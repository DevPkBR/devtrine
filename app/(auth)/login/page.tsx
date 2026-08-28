import Link from "next/link";
import { AuthShell, Feedback } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { signIn, signInWithGoogle } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; mensagem?: string }>;
}) {
  const { erro, mensagem } = await searchParams;
  return (
    <AuthShell eyebrow="Bem-vindo de volta" title="Entre no Devtrine" description="Acesse seu perfil e continue mostrando o que você construiu." footer={<>Ainda não tem conta? <Link href="/cadastro">Criar conta</Link></>}>
      <Feedback error={erro} message={mensagem} />
      <form className="auth-form" action={signIn}>
        <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
        <div className="field">
          <div className="field-row"><label htmlFor="password">Senha</label><Link href="/recuperar-senha">Esqueci minha senha</Link></div>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <SubmitButton pendingText="Entrando...">Entrar</SubmitButton>
      </form>
      <div className="auth-divider">ou</div>
      <form action={signInWithGoogle}><SubmitButton className="google-button" pendingText="Conectando...">Continuar com Google</SubmitButton></form>
    </AuthShell>
  );
}
