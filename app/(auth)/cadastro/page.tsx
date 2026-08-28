import Link from "next/link";
import { AuthShell, Feedback } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { signInWithGoogle, signUp } from "../actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <AuthShell eyebrow="Comece agora" title="Crie sua conta" description="Entre para uma comunidade feita por quem transforma ideias em projetos." footer={<>Já tem uma conta? <Link href="/login">Entrar</Link></>}>
      <Feedback error={erro} />
      <form className="auth-form" action={signUp}>
        <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
        <div className="field"><label htmlFor="password">Senha</label><input id="password" name="password" type="password" minLength={8} autoComplete="new-password" required /><span className="field-hint">Use pelo menos 8 caracteres.</span></div>
        <div className="field"><label htmlFor="passwordConfirmation">Confirmar senha</label><input id="passwordConfirmation" name="passwordConfirmation" type="password" minLength={8} autoComplete="new-password" required /></div>
        <SubmitButton pendingText="Criando conta...">Criar conta</SubmitButton>
      </form>
      <div className="auth-divider">ou</div>
      <form action={signInWithGoogle}><SubmitButton className="google-button" pendingText="Conectando...">Cadastrar com Google</SubmitButton></form>
    </AuthShell>
  );
}
