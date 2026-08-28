import { redirect } from "next/navigation";
import { AuthShell, Feedback } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { createClient } from "@/lib/supabase/server";
import { completeOnboarding } from "./actions";
import "../(auth)/auth.css";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", data.user.id).maybeSingle();
  if (profile) redirect("/");
  const { erro } = await searchParams;

  return (
    <AuthShell eyebrow="Seu perfil" title="Como devemos chamar você?" description="Essas informações ajudam outras pessoas a reconhecer quem criou cada projeto.">
      <Feedback error={erro} />
      <form className="auth-form" action={completeOnboarding}>
        <div className="field"><label htmlFor="name">Nome</label><input id="name" name="name" type="text" maxLength={80} autoComplete="name" required /></div>
        <div className="field"><label htmlFor="username">Username</label><input id="username" name="username" type="text" minLength={3} maxLength={30} pattern="[a-z0-9_]+" autoCapitalize="none" autoComplete="username" required /><span className="field-hint">Use letras minúsculas, números ou _. Você poderá compartilhar seu perfil por esse nome.</span></div>
        <div className="field"><label htmlFor="bio">Bio <span className="field-hint">(opcional)</span></label><textarea id="bio" name="bio" maxLength={300} placeholder="Conte brevemente o que você constrói." /></div>
        <SubmitButton pendingText="Salvando perfil...">Concluir perfil</SubmitButton>
      </form>
    </AuthShell>
  );
}
