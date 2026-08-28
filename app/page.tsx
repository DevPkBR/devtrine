import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function Logo() {
  return <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>;
}

function HeartIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16.8 4.8a4 4 0 0 0-5.7 0L10 5.9 8.9 4.8a4 4 0 0 0-5.7 5.7L10 17l6.8-6.5a4 4 0 0 0 0-5.7Z" /></svg>;
}

function BookmarkIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3.5h10v13l-5-3-5 3v-13Z" /></svg>;
}

export default async function Home() {
  const supabase = await createClient();
  const [{ data }, { data: projects }, { data: categories }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("projects").select("id, title, description, thumbnail_path, author_id, profiles!projects_author_id_fkey(name, username), project_technologies(technologies(name)), project_likes(count), saved_projects(count)").eq("status", "published").order("published_at", { ascending: false }).limit(9),
    supabase.from("categories").select("id, name, slug").order("name"),
  ]);
  const destination = data.user ? "/dashboard" : "/login";
  const projectCards = (projects ?? []).map((project) => {
    const author = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles;
    return {
      ...project,
      author,
      thumbnailUrl: supabase.storage.from("project-thumbnails").getPublicUrl(project.thumbnail_path).data.publicUrl,
      technologies: project.project_technologies.map((relation) => {
        const technology = Array.isArray(relation.technologies) ? relation.technologies[0] : relation.technologies;
        return technology?.name;
      }).filter(Boolean),
      likes: project.project_likes[0]?.count ?? 0,
      saves: project.saved_projects[0]?.count ?? 0,
    };
  });

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Devtrine, página inicial"><Logo /><span>devtrine</span></a>
        <nav className="desktop-nav" aria-label="Navegação principal"><a className="active" href="#projetos">Explorar</a><a href="#recentes">Recentes</a><a href="#sobre">Sobre</a></nav>
        <div className="header-actions">
          {data.user ? (
            <Link className="primary-button" href="/dashboard">Meu dashboard</Link>
          ) : (
            <><Link className="text-button" href="/login">Entrar</Link><Link className="primary-button" href="/cadastro">Criar conta</Link></>
          )}
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Feito por quem constrói</div>
            <h1 id="hero-title">Mostre o que você<br /><em>construiu.</em></h1>
            <p>Descubra projetos reais, encontre inspiração e conecte-se com as pessoas por trás de cada ideia.</p>
            <div className="hero-actions"><a className="primary-button large" href="#projetos">Explorar projetos <ArrowIcon /></a><Link className="secondary-button large" href={destination}>{data.user ? "Ir para o dashboard" : "Publicar projeto"}</Link></div>
          </div>
          <div className="hero-orbit" aria-hidden="true"><span className="orbit-one" /><span className="orbit-two" /><b><Logo /></b></div>
        </section>

        <section className="feed" id="projetos" aria-labelledby="feed-title">
          <div className="section-heading"><div><span className="section-kicker">Mais recentes</span><h2 id="feed-title">Projetos para descobrir</h2></div><Link href="/explorar">Ver todos <ArrowIcon /></Link></div>
          <div className="filters" aria-label="Filtrar projetos"><Link className="selected" href="/explorar">Todos</Link>{(categories ?? []).map((category) => <Link href={`/explorar?categoria=${category.slug}`} key={category.id}>{category.name}</Link>)}</div>
          <div className="project-grid" id="recentes">
            {projectCards.map((project) => (
              <article className="project-card" key={project.id}>
                <Link className="project-preview" href={`/projetos/${project.id}`} aria-label={"Abrir projeto " + project.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.thumbnailUrl} alt="" /><span className="visit-label">Ver detalhes <ArrowIcon /></span>
                </Link>
                <div className="project-body">
                  <div className="project-title-row"><h3><Link href={`/projetos/${project.id}`}>{project.title}</Link></h3></div>
                  <p>{project.description}</p>
                  <ul>{project.technologies.slice(0, 4).map((technology) => <li key={technology}>{technology}</li>)}</ul>
                  <footer><Link className="author" href={project.author?.username ? `/perfil/${project.author.username}` : "#"}><span>{project.author?.name?.slice(0, 2).toUpperCase() ?? "DV"}</span><p><strong>{project.author?.name ?? "Pessoa Devtrine"}</strong><small>@{project.author?.username ?? "devtrine"}</small></p></Link><div className="metrics"><span><HeartIcon /> {project.likes}</span><span><BookmarkIcon /> {project.saves}</span></div></footer>
                </div>
              </article>
            ))}
            {projectCards.length === 0 ? <div className="feed-empty"><h3>Os primeiros projetos estão chegando.</h3><p>Publique o seu e inaugure esta vitrine.</p><Link className="primary-button" href={destination}>Publicar projeto</Link></div> : null}
          </div>
        </section>

        <section className="closing" id="sobre"><span><Logo /></span><div><h2>Seu projeto merece ser visto.</h2><p>Crie seu perfil e compartilhe o que você está construindo.</p></div><Link className="light-button" href={data.user ? "/dashboard" : "/cadastro"}>{data.user ? "Abrir dashboard" : "Começar agora"} <ArrowIcon /></Link></section>
      </main>

      <footer className="footer"><a className="brand" href="#top"><Logo /><span>devtrine</span></a><p>Projetos reais. Pessoas reais.</p><small>© 2026 Devtrine</small></footer>
    </div>
  );
}
