import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function Logo() { return <span className="logo-mark" aria-hidden="true"><i/><i/><i/></span>; }
function ArrowIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>; }

export default async function LandingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return <div className="landing-shell">
    <header className="topbar landing-topbar"><Link className="brand" href="/" aria-label="Devtrine, página inicial"><Logo/><span>devtrine</span></Link><div className="header-actions">{data.user ? <Link className="primary-button" href="/feed">Abrir feed</Link> : <><Link className="text-button" href="/login">Entrar</Link><Link className="primary-button" href="/cadastro">Criar conta</Link></>}</div></header>
    <main><section className="hero landing-hero" aria-labelledby="hero-title"><div className="hero-copy"><div className="eyebrow"><span/> Feito por quem constrói</div><h1 id="hero-title">Mostre o que você<br/><em>construiu.</em></h1><p>Descubra projetos reais, encontre inspiração e conecte-se com as pessoas por trás de cada ideia.</p><div className="hero-actions">{data.user ? <Link className="primary-button large" href="/feed">Entrar no feed <ArrowIcon/></Link> : <><Link className="primary-button large" href="/cadastro">Criar meu perfil <ArrowIcon/></Link><Link className="secondary-button large" href="/login">Já tenho conta</Link></>}</div></div><div className="hero-orbit" aria-hidden="true"><span className="orbit-one"/><span className="orbit-two"/><b><Logo/></b></div></section></main>
  </div>;
}
