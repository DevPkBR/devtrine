import { redirect } from "next/navigation";
import { AuthShell, Feedback } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { createClient } from "@/lib/supabase/server";
import { updatePassword } from "../actions";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  const { erro } = await searchParams;

  return (
    <AuthShell eyebrow="Nova senha" title="Atualize sua senha" description="Escolha uma nova senha segura para sua conta.">
      <Feedback error={erro} />
      <form className="auth-form" action={updatePassword}>
        <div className="field"><label htmlFor="password">Nova senha</label><input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required /></div>
        <div className="field"><label htmlFor="passwordConfirmation">Confirmar nova senha</label><input id="passwordConfirmation" name="passwordConfirmation" type="password" minLength={8} autoComplete="new-password" required /></div>
        <SubmitButton pendingText="Atualizando...">Atualizar senha</SubmitButton>
      </form>
    </AuthShell>
  );
}
