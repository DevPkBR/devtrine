import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "./project-page.css";

function Logo() {
  return <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>;
}

export default async function PublicProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id, author_id, category_id, title, description, url, thumbnail_path, published_at")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (!project) notFound();

  const [{ data: author }, { data: category }, { data: relations }, { count: likes }, { count: comments }] = await Promise.all([
    supabase.from("profiles").select("name, username, bio").eq("id", project.author_id).single(),
    project.category_id ? supabase.from("categories").select("name, slug").eq("id", project.category_id).single() : Promise.resolve({ data: null }),
    supabase.from("project_technologies").select("technologies(name, slug)").eq("project_id", project.id),
    supabase.from("project_likes").select("project_id", { count: "exact", head: true }).eq("project_id", project.id),
    supabase.from("comments").select("id", { count: "exact", head: true }).eq("project_id", project.id),
  ]);

  if (!author) notFound();
  const thumbnailUrl = supabase.storage.from("project-thumbnails").getPublicUrl(project.thumbnail_path).data.publicUrl;
  const initials = author.name.split(" ").slice(0, 2).map((part: string) => part[0]).join("").toUpperCase();
  const technologies = (relations ?? []).flatMap((relation) => relation.technologies ?? []);

  return (
    <div className="public-project-shell">
      <header className="public-project-topbar">
        <Link className="brand" href="/"><Logo /><span>devtrine</span></Link>
        <nav><Link href="/#projetos">Explorar</Link><Link href="/dashboard">Dashboard</Link></nav>
      </header>
      <main>
        <section className="public-project-hero">
          <div className="public-project-breadcrumb"><Link href="/">Devtrine</Link><span>/</span><span>{category?.name ?? "Projeto"}</span></div>
          <div className="public-project-heading">
            <div>
              <span className="project-category">{category?.name ?? "Projeto publicado"}</span>
              <h1>{project.title}</h1>
              <p>{project.description}</p>
            </div>
            <a className="primary-button project-visit" href={project.url} target="_blank" rel="noreferrer">Visitar projeto <ArrowIcon /></a>
          </div>
          <div className="public-project-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailUrl} alt={"Apresentação do projeto " + project.title} />
          </div>
        </section>

        <section className="public-project-details">
          <article>
            <span className="details-label">Sobre o projeto</span>
            <p>{project.description}</p>
            {technologies.length ? <ul>{technologies.map((technology) => <li key={technology.slug}>{technology.name}</li>)}</ul> : null}
          </article>
          <aside>
            <span className="details-label">Criado por</span>
            <Link className="project-author" href={`/perfil/${author.username}`}>
              <span>{initials}</span><div><strong>{author.name}</strong><small>@{author.username}</small></div>
            </Link>
            {author.bio ? <p>{author.bio}</p> : null}
            <dl><div><dt>Curtidas</dt><dd>{likes ?? 0}</dd></div><div><dt>Comentários</dt><dd>{comments ?? 0}</dd></div><div><dt>Publicado</dt><dd>{project.published_at ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(project.published_at)) : "—"}</dd></div></dl>
          </aside>
        </section>
      </main>
    </div>
  );
}
