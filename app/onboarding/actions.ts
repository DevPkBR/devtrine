"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function fail(message: string): never {
  redirect("/onboarding?erro=" + encodeURIComponent(message));
}

export async function completeOnboarding(formData: FormData) {
  const name = text(formData, "name");
  const username = text(formData, "username").toLowerCase();
  const bio = text(formData, "bio");

  if (!name || name.length > 80) fail("Informe um nome com até 80 caracteres.");
  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    fail("O username deve ter de 3 a 30 caracteres, usando letras minúsculas, números ou _.");
  }
  if (bio.length > 300) fail("A bio deve ter no máximo 300 caracteres.");

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { error } = await supabase.from("profiles").insert({
    id: data.user.id,
    name,
    username,
    bio: bio || null,
  });

  if (error?.code === "23505") fail("Esse username já está em uso.");
  if (error) fail("Não foi possível concluir seu perfil. Tente novamente.");

  redirect("/");
}
