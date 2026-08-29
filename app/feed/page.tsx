import Link from "next/link";
import { redirect } from "next/navigation";
import { SocialNav } from "@/components/social-nav";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Feed — Devtrine", description: "Projetos recentes publicados pela comunidade Devtrine." };

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");
  const [{ data: viewer }, { data: projects }] = await Promise.all([
    supabase.from("profiles").select("name, username").eq("id", auth.user.id).maybeSingle(),
    supabase.from("projects").select("id, title, description, thumbnail_path, published_at, profiles!projects_author_id_fkey(name, username), project_technologies(technologies(name)), project_likes(count), comments(count)").eq("status", "published").order("published_at", { ascending: false }).limit(20),
  ]);
  if (!viewer) redirect("/onboarding");

  return <div className="social-shell"><SocialNav active="home" username={viewer.username}/><main className="feed-page"><header className="mobile-social-header"><Link className="social-brand" href="/feed"><span className="logo-mark" aria-hidden="true"><i/><i/><i/></span><strong>devtrine</strong></Link><Link href="/dashboard">Painel</Link></header><div className="feed-column"><div className="feed-heading"><div><span>Home</span><h1>Projetos recentes</h1></div><Link href="/projetos/novo">+ Publicar</Link></div>{(projects ?? []).map((project) => {
    const author = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles;
    const image = supabase.storage.from("project-thumbnails").getPublicUrl(project.thumbnail_path).data.publicUrl;
    const technologies = project.project_technologies.flatMap((relation) => relation.technologies ?? []).slice(0, 4);
    return <article className="feed-post" key={project.id}><header><Link className="feed-author" href={author?.username ? `/perfil/${author.username}` : "#"}><span>{author?.name?.split(" ").slice(0,2).map((part: string)=>part[0]).join("") ?? "DV"}</span><div><strong>{author?.name ?? "Devtrine"}</strong><small>@{author?.username ?? "devtrine"}</small></div></Link><time>{project.published_at ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(project.published_at)) : ""}</time></header><Link className="feed-media" href={`/projetos/${project.id}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={`Projeto ${project.title}`} />
    </Link><div className="feed-post-body"><div className="feed-post-actions"><span>♡ {project.project_likes[0]?.count ?? 0}</span><span>◯ {project.comments[0]?.count ?? 0}</span><Link href={`/projetos/${project.id}`}>Ver projeto</Link></div><h2><Link href={`/projetos/${project.id}`}>{project.title}</Link></h2><p>{project.description}</p>{technologies.length ? <ul>{technologies.map((tech) => <li key={tech.name}>{tech.name}</li>)}</ul> : null}</div></article>;
  })}{projects?.length === 0 ? <div className="social-empty"><h2>Ainda não há projetos no feed.</h2><p>Publique o primeiro projeto da comunidade.</p><Link className="primary-button" href="/projetos/novo">Publicar projeto</Link></div> : null}</div><aside className="feed-sidecard"><span className="side-avatar">{viewer.name.slice(0,2).toUpperCase()}</span><div><strong>{viewer.name}</strong><small>@{viewer.username}</small></div><Link href="/dashboard">Gerenciar</Link></aside></main></div>;
}
