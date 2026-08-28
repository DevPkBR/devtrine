"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function fail(message: string): never {
  redirect("/projetos/novo?erro=" + encodeURIComponent(message));
}

function technologySlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.+#-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function publishProject(formData: FormData) {
  const title = value(formData, "title");
  const description = value(formData, "description");
  const projectUrl = value(formData, "url");
  const categoryId = value(formData, "categoryId");
  const technologyNames = Array.from(
    new Set(
      value(formData, "technologies")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
  const thumbnail = formData.get("thumbnail");

  if (!title || title.length > 120) fail("Informe um título com até 120 caracteres.");
  if (!description || description.length > 5000) fail("Informe uma descrição com até 5.000 caracteres.");
  if (!categoryId) fail("Escolha uma categoria.");
  if (technologyNames.some((name) => name.length > 50 || !technologySlug(name))) {
    fail("Cada tecnologia deve ter um nome válido com até 50 caracteres.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(projectUrl);
  } catch {
    fail("Informe uma URL completa e válida para o projeto.");
  }
  if (!(["http:", "https:"] as string[]).includes(parsedUrl.protocol)) {
    fail("A URL do projeto deve começar com http:// ou https://.");
  }

  if (!(thumbnail instanceof File) || thumbnail.size === 0) fail("Adicione uma thumbnail do projeto.");
  const extension = allowedImageTypes.get(thumbnail.type);
  if (!extension) fail("Use uma imagem JPEG, PNG, WebP ou AVIF.");
  if (thumbnail.size > 512000) fail("A thumbnail deve ter no máximo 500 KB.");

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", authData.user.id)
    .maybeSingle();
  if (!profile) redirect("/onboarding");

  const thumbnailPath = `${authData.user.id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("project-thumbnails")
    .upload(thumbnailPath, thumbnail, { contentType: thumbnail.type, upsert: false });
  if (uploadError) fail("Não foi possível enviar a thumbnail. Tente novamente.");

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      author_id: authData.user.id,
      category_id: categoryId,
      title,
      description,
      url: parsedUrl.toString(),
      thumbnail_path: thumbnailPath,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (projectError || !project) {
    await supabase.storage.from("project-thumbnails").remove([thumbnailPath]);
    fail("Não foi possível publicar o projeto. Tente novamente.");
  }

  const technologyIds: string[] = [];
  for (const name of technologyNames) {
    const slug = technologySlug(name);
    const { data: existing } = await supabase
      .from("technologies")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      technologyIds.push(existing.id);
      continue;
    }

    const { data: created, error: createError } = await supabase
      .from("technologies")
      .insert({ name, slug })
      .select("id")
      .single();

    if (createError || !created) {
      await supabase.from("projects").delete().eq("id", project.id);
      await supabase.storage.from("project-thumbnails").remove([thumbnailPath]);
      fail("Não foi possível registrar as tecnologias do projeto.");
    }
    technologyIds.push(created.id);
  }

  if (technologyIds.length > 0) {
    const { error: relationError } = await supabase.from("project_technologies").insert(
      technologyIds.map((technologyId) => ({
        project_id: project.id,
        technology_id: technologyId,
      })),
    );

    if (relationError) {
      await supabase.from("projects").delete().eq("id", project.id);
      await supabase.storage.from("project-thumbnails").remove([thumbnailPath]);
      fail("Não foi possível associar as tecnologias ao projeto.");
    }
  }

  redirect("/dashboard?publicado=1");
}
