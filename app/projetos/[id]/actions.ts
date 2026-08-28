"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function context(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(`/login?next=/projetos/${projectId}`);
  return { supabase, user: data.user };
}

export async function toggleLike(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const { supabase, user } = await context(projectId);
  const { data } = await supabase.from("project_likes").select("user_id").eq("project_id", projectId).eq("user_id", user.id).maybeSingle();
  if (data) await supabase.from("project_likes").delete().eq("project_id", projectId).eq("user_id", user.id);
  else await supabase.from("project_likes").insert({ project_id: projectId, user_id: user.id });
  revalidatePath(`/projetos/${projectId}`);
}

export async function toggleSave(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const { supabase, user } = await context(projectId);
  const { data } = await supabase.from("saved_projects").select("user_id").eq("project_id", projectId).eq("user_id", user.id).maybeSingle();
  if (data) await supabase.from("saved_projects").delete().eq("project_id", projectId).eq("user_id", user.id);
  else await supabase.from("saved_projects").insert({ project_id: projectId, user_id: user.id });
  revalidatePath(`/projetos/${projectId}`);
}

export async function addComment(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body || body.length > 1000) return;
  const { supabase, user } = await context(projectId);
  await supabase.from("comments").insert({ project_id: projectId, user_id: user.id, body });
  revalidatePath(`/projetos/${projectId}`);
}

export async function reportProject(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const { supabase, user } = await context(projectId);
  await supabase.from("reports").insert({ reporter_id: user.id, target_type: "project", target_id: projectId, reason: "Conteúdo inadequado: denúncia enviada pela página pública do projeto." });
  redirect(`/projetos/${projectId}?denunciado=1`);
}
