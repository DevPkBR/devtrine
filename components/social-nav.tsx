import Link from "next/link";

type SocialNavProps = { active: "home" | "explore" | "saved" | "profile"; username?: string | null };

function Icon({ name }: { name: SocialNavProps["active"] | "create" }) {
  if (name === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg>;
  if (name === "explore") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>;
  if (name === "create") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7v10M7 12h10"/></svg>;
  if (name === "saved") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
}

export function SocialNav({ active, username }: SocialNavProps) {
  const items = [
    { id: "home" as const, label: "Home", href: "/feed" },
    { id: "explore" as const, label: "Explorar", href: "/explorar" },
    { id: "create" as const, label: "Criar", href: "/projetos/novo" },
    { id: "saved" as const, label: "Salvos", href: "/salvos" },
    { id: "profile" as const, label: "Perfil", href: username ? `/perfil/${username}` : "/login" },
  ];
  return <aside className="social-nav"><Link className="social-brand" href="/feed" aria-label="Devtrine"><span className="logo-mark" aria-hidden="true"><i/><i/><i/></span><strong>devtrine</strong></Link><nav aria-label="Navegação principal">{items.map((item) => <Link className={active === item.id ? "active" : ""} href={item.href} key={item.id}><Icon name={item.id}/><span>{item.label}</span></Link>)}</nav></aside>;
}
