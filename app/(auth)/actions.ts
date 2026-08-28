"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function destination(path: string, kind: "erro" | "mensagem", value: string) {
  return path + "?" + kind + "=" + encodeURIComponent(value);
}

async function origin() {
  const headerStore = await headers();
  return headerStore.get("origin") ?? "http://localhost:3000";
}

export async function signIn(formData: FormData) {
  const email = text(formData, "email");
  const password = text(formData, "password");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect(destination("/login", "erro", "E-mail ou senha inválidos."));

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  redirect(profile ? "/dashboard" : "/onboarding");
}

export async function signUp(formData: FormData) {
  const email = text(formData, "email");
  const password = text(formData, "password");
  const confirmation = text(formData, "passwordConfirmation");

  if (password.length < 8) {
    redirect(destination("/cadastro", "erro", "A senha precisa ter pelo menos 8 caracteres."));
  }
  if (password !== confirmation) {
    redirect(destination("/cadastro", "erro", "As senhas não coincidem."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: (await origin()) + "/auth/callback?next=/onboarding" },
  });

  if (error) redirect(destination("/cadastro", "erro", error.message));
  if (data.session) redirect("/onboarding");

  redirect(destination("/login", "mensagem", "Confira seu e-mail para confirmar a conta."));
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: (await origin()) + "/auth/callback?next=/onboarding" },
  });

  if (error) redirect(destination("/login", "erro", "Não foi possível entrar com o Google."));
  redirect(data.url);
}

export async function requestPasswordReset(formData: FormData) {
  const email = text(formData, "email");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: (await origin()) + "/auth/callback?next=/atualizar-senha",
  });

  if (error) redirect(destination("/recuperar-senha", "erro", error.message));
  redirect(destination("/login", "mensagem", "Se a conta existir, enviaremos um link de recuperação."));
}

export async function updatePassword(formData: FormData) {
  const password = text(formData, "password");
  const confirmation = text(formData, "passwordConfirmation");

  if (password.length < 8) {
    redirect(destination("/atualizar-senha", "erro", "A senha precisa ter pelo menos 8 caracteres."));
  }
  if (password !== confirmation) {
    redirect(destination("/atualizar-senha", "erro", "As senhas não coincidem."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect(destination("/atualizar-senha", "erro", error.message));

  redirect(destination("/login", "mensagem", "Senha atualizada com sucesso."));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
