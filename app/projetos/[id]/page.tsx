import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addComment, reportProject, toggleLike, toggleSave } from "./actions";
import "./project-page.css";

function Logo() {
  return <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>;
}

export default async function PublicProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ denunciado?: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id, author_id, category_id, title, description, url, thumbnail_path, published_at")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (!project) notFound();

  const { data: auth } = await supabase.auth.getUser();
  const [{ data: author }, { data: category }, { data: relations }, { count: likes }, { data: comments }, { data: liked }, { data: saved }] = await Promise.all([
    supabase.from("profiles").select("name, username, bio").eq("id", project.author_id).single(),
    project.category_id ? supabase.from("categories").select("name, slug").eq("id", project.category_id).single() : Promise.resolve({ data: null }),
    supabase.from("project_technologies").select("technologies(name, slug)").eq("project_id", project.id),
    supabase.from("project_likes").select("project_id", { count: "exact", head: true }).eq("project_id", project.id),
    supabase.from("comments").select("id, body, created_at, profiles!comments_user_id_fkey(name, username)").eq("project_id", project.id).order("created_at", { ascending: true }).limit(100),
    auth.user ? supabase.from("project_likes").select("user_id").eq("project_id", project.id).eq("user_id", auth.user.id).maybeSingle() : Promise.resolve({ data: null }),
    auth.user ? supabase.from("saved_projects").select("user_id").eq("project_id", project.id).eq("user_id", auth.user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  if (!author) notFound();
  const thumbnailUrl = supabase.storage.from("project-thumbnails").getPublicUrl(project.thumbnail_path).data.publicUrl;
  const initials = author.name.split(" ").slice(0, 2).map((part: string) => part[0]).join("").toUpperCase();
  const technologies = (relations ?? []).flatMap((relation) => relation.technologies ?? []);
  const { denunciado } = await searchParams;

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
            <dl><div><dt>Curtidas</dt><dd>{likes ?? 0}</dd></div><div><dt>Comentários</dt><dd>{comments?.length ?? 0}</dd></div><div><dt>Publicado</dt><dd>{project.published_at ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(project.published_at)) : "—"}</dd></div></dl>
            <div className="project-social-actions"><form action={toggleLike}><input type="hidden" name="projectId" value={project.id} /><button className={liked ? "active" : ""} type="submit">{liked ? "♥ Curtido" : "♡ Curtir"}</button></form><form action={toggleSave}><input type="hidden" name="projectId" value={project.id} /><button className={saved ? "active" : ""} type="submit">{saved ? "Salvo" : "Salvar"}</button></form></div>
            {auth.user?.id !== project.author_id ? <form className="report-form" action={reportProject}><input type="hidden" name="projectId" value={project.id} /><button type="submit">Denunciar projeto</button></form> : null}
            {denunciado ? <p className="report-success">Denúncia recebida. Obrigado por ajudar a comunidade.</p> : null}
          </aside>
        </section>
        <section className="project-comments"><div><span className="details-label">Comunidade</span><h2>Comentários</h2></div><form className="comment-form" action={addComment}><input type="hidden" name="projectId" value={project.id} /><textarea name="body" maxLength={1000} placeholder={auth.user ? "Compartilhe uma opinião construtiva..." : "Entre para comentar"} disabled={!auth.user} required /><button className="primary-button" type="submit" disabled={!auth.user}>{auth.user ? "Comentar" : "Entre para comentar"}</button></form><div className="comment-list">{(comments ?? []).map((comment) => { const commenter = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles; return <article key={comment.id}><Link href={commenter?.username ? `/perfil/${commenter.username}` : "#"}>@{commenter?.username ?? "devtrine"}</Link><p>{comment.body}</p><time>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(comment.created_at))}</time></article>; })}{comments?.length === 0 ? <p className="comments-empty">Seja a primeira pessoa a comentar.</p> : null}</div></section>
      </main>
    </div>
  );
}
