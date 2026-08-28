import Link from "next/link";

const projects = [
  { title: "Cittadoc", description: "Análise inteligente de documentos e construção de árvores genealógicas em um só lugar.", author: "Marina Costa", role: "Product Designer", initials: "MC", technologies: ["Next.js", "TypeScript", "IA"], likes: 128, saves: 36, tone: "violet", symbol: "C" },
  { title: "Plantaria", description: "Planeje hortas urbanas, acompanhe cultivos e compartilhe colheitas com sua comunidade.", author: "Lucas Nunes", role: "Full-stack Developer", initials: "LN", technologies: ["React", "Supabase", "PWA"], likes: 94, saves: 21, tone: "green", symbol: "P" },
  { title: "Orbit Finance", description: "Um painel simples e visual para entender para onde seu dinheiro está indo.", author: "Ana Ribeiro", role: "Front-end Developer", initials: "AR", technologies: ["Next.js", "PostgreSQL", "Charts"], likes: 76, saves: 18, tone: "orange", symbol: "O" },
];

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

export default function Home() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Devtrine, página inicial"><Logo /><span>devtrine</span></a>
        <nav className="desktop-nav" aria-label="Navegação principal"><a className="active" href="#projetos">Explorar</a><a href="#recentes">Recentes</a><a href="#sobre">Sobre</a></nav>
        <div className="header-actions"><Link className="text-button" href="/login">Entrar</Link><Link className="primary-button" href="/cadastro">Criar conta</Link></div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Feito por quem constrói</div>
            <h1 id="hero-title">Mostre o que você<br /><em>construiu.</em></h1>
            <p>Descubra projetos reais, encontre inspiração e conecte-se com as pessoas por trás de cada ideia.</p>
            <div className="hero-actions"><a className="primary-button large" href="#projetos">Explorar projetos <ArrowIcon /></a><Link className="secondary-button large" href="/login">Publicar projeto</Link></div>
          </div>
          <div className="hero-orbit" aria-hidden="true"><span className="orbit-one" /><span className="orbit-two" /><b><Logo /></b></div>
        </section>

        <section className="feed" id="projetos" aria-labelledby="feed-title">
          <div className="section-heading"><div><span className="section-kicker">Em destaque</span><h2 id="feed-title">Projetos para descobrir</h2></div><a href="#recentes">Ver todos <ArrowIcon /></a></div>
          <div className="filters" aria-label="Filtrar projetos"><button className="selected" type="button">Todos</button><button type="button">Web</button><button type="button">Mobile</button><button type="button">Design</button><button type="button">Open source</button></div>
          <div className="project-grid" id="recentes">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <a className={"project-preview " + project.tone} href="#" aria-label={"Abrir projeto " + project.title}>
                  <span className="preview-grid" /><span className="preview-glow" /><strong>{project.symbol}</strong><span className="visit-label">Visitar projeto <ArrowIcon /></span>
                </a>
                <div className="project-body">
                  <div className="project-title-row"><h3>{project.title}</h3><button type="button" aria-label={"Salvar " + project.title}><BookmarkIcon /></button></div>
                  <p>{project.description}</p>
                  <ul>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                  <footer><div className="author"><span>{project.initials}</span><p><strong>{project.author}</strong><small>{project.role}</small></p></div><div className="metrics"><span><HeartIcon /> {project.likes}</span><span><BookmarkIcon /> {project.saves}</span></div></footer>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="closing" id="sobre"><span><Logo /></span><div><h2>Seu projeto merece ser visto.</h2><p>Crie seu perfil e compartilhe o que você está construindo.</p></div><Link className="light-button" href="/cadastro">Começar agora <ArrowIcon /></Link></section>
      </main>

      <footer className="footer"><a className="brand" href="#top"><Logo /><span>devtrine</span></a><p>Projetos reais. Pessoas reais.</p><small>© 2026 Devtrine</small></footer>
    </div>
  );
}
