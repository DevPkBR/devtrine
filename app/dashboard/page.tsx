import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/server";
import "./dashboard.css";

function Logo() {
  return <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function PlusIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>;
}

function ProjectIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4zM4 9h16M8 5.5v3.5" /></svg>;
}

export const metadata = {
  title: "Dashboard — Devtrine",
  description: "Acompanhe seu perfil e os projetos publicados no Devtrine.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/login");

  const [{ data: profile }, { count: projectCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("name, username, bio")
      .eq("id", authData.user.id)
      .maybeSingle(),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("author_id", authData.user.id),
  ]);

  if (!profile) redirect("/onboarding");

  const firstName = profile.name.split(" ")[0];
  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <Link className="brand" href="/" aria-label="Devtrine, página inicial">
          <Logo /><span>devtrine</span>
        </Link>
        <nav aria-label="Navegação do dashboard">
          <Link className="active" href="/dashboard">Dashboard</Link>
          <Link href="/#projetos">Explorar</Link>
        </nav>
        <div className="dashboard-account">
          <span className="account-avatar" aria-hidden="true">{initials}</span>
          <span className="account-copy"><strong>{profile.name}</strong><small>@{profile.username}</small></span>
          <form action={signOut}><button className="logout-button" type="submit">Sair</button></form>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-welcome" aria-labelledby="dashboard-title">
          <div>
            <span className="dashboard-kicker">Seu espaço</span>
            <h1 id="dashboard-title">Olá, {firstName}.</h1>
            <p>Acompanhe seu perfil e mostre ao mundo o que você construiu.</p>
          </div>
          <span className="disabled-action" aria-disabled="true" title="Disponível na próxima etapa">
            <PlusIcon /> Publicar projeto
          </span>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel profile-summary">
            <div className="panel-heading">
              <div><span className="panel-label">Perfil</span><h2>Sua presença no Devtrine</h2></div>
              <span className="profile-status"><i /> Perfil ativo</span>
            </div>
            <div className="profile-row">
              <span className="profile-avatar" aria-hidden="true">{initials}</span>
              <div><strong>{profile.name}</strong><span>@{profile.username}</span><p>{profile.bio || "Adicione uma bio para contar o que você constrói."}</p></div>
            </div>
            <div className="profile-stats">
              <div><strong>{projectCount ?? 0}</strong><span>Projetos</span></div>
              <div><strong>0</strong><span>Seguidores</span></div>
              <div><strong>0</strong><span>Seguindo</span></div>
            </div>
          </article>

          <aside className="dashboard-panel next-step">
            <span className="panel-label">Próximo passo</span>
            <h2>Publique seu primeiro projeto</h2>
            <p>Na próxima entrega, você poderá cadastrar título, descrição, URL, imagem, categoria e tecnologias.</p>
            <span><i>1</i> Projeto real e acessível</span>
            <span><i>2</i> Uma boa apresentação</span>
            <span><i>3</i> Link direto para visitar</span>
          </aside>
        </section>

        <section className="dashboard-panel projects-panel" aria-labelledby="projects-title">
          <div className="panel-heading">
            <div><span className="panel-label">Portfólio</span><h2 id="projects-title">Seus projetos</h2></div>
            <Link href="/#projetos">Explorar comunidade <ArrowIcon /></Link>
          </div>
          <div className="empty-projects">
            <span><ProjectIcon /></span>
            <h3>Seu portfólio começa aqui.</h3>
            <p>Você ainda não publicou projetos. O fluxo de publicação será a próxima funcionalidade do MVP.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
