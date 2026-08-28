import Link from "next/link";
import { AuthShell, Feedback } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { requestPasswordReset } from "../actions";

export default async function RecoverPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <AuthShell eyebrow="Recuperação" title="Redefina sua senha" description="Informe seu e-mail e enviaremos as instruções para recuperar o acesso." footer={<Link href="/login">Voltar para o login</Link>}>
      <Feedback error={erro} />
      <form className="auth-form" action={requestPasswordReset}>
        <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
        <SubmitButton pendingText="Enviando...">Enviar link de recuperação</SubmitButton>
      </form>
    </AuthShell>
  );
}
