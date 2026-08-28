import Link from "next/link";
import type { ReactNode } from "react";

function Logo() {
  return <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>;
}

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <Link className="brand auth-brand" href="/" aria-label="Voltar para a home">
        <Logo />
        <span>devtrine</span>
      </Link>
      <section className="auth-card">
        <span className="auth-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="auth-description">{description}</p>
        {children}
        {footer ? <footer className="auth-footer">{footer}</footer> : null}
      </section>
      <p className="auth-note">Projetos reais. Pessoas reais.</p>
    </main>
  );
}

export function Feedback({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  if (!error && !message) return null;
  return (
    <div className={error ? "form-feedback error" : "form-feedback success"} role="status">
      {error ?? message}
    </div>
  );
}
