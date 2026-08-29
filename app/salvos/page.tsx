import Link from "next/link";
import { redirect } from "next/navigation";
import { SocialNav } from "@/components/social-nav";
import { createClient } from "@/lib/supabase/server";
import "../explorar/explore.css";

export const metadata = { title: "Projetos salvos — Devtrine" };

export default async function SavedProjectsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");
  const [{ data: viewer }, { data: saved }] = await Promise.all([
    supabase.from("profiles").select("username").eq("id", auth.user.id).single(),
    supabase.from("saved_projects").select("created_at, projects(id, title, description, thumbnail_path, profiles!projects_author_id_fkey(name, username), project_likes(count))").eq("user_id", auth.user.id).order("created_at", { ascending: false }),
  ]);
  return <div className="social-shell explore-shell"><SocialNav active="saved" username={viewer?.username}/><main className="explore-main social-content"><header className="mobile-social-header"><Link className="social-brand" href="/"><span className="logo-mark" aria-hidden="true"><i/><i/><i/></span><strong>devtrine</strong></Link></header><div className="explore-heading"><span>Sua coleção</span><h1>Projetos salvos.</h1><p>Referências que você separou para visitar novamente.</p></div><section className="explore-grid">{(saved ?? []).flatMap((item) => item.projects ?? []).map((project) => { const author = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles; const image = supabase.storage.from("project-thumbnails").getPublicUrl(project.thumbnail_path).data.publicUrl; return <article key={project.id}><Link className="explore-image" href={`/projetos/${project.id}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image} alt={project.title}/>
  </Link><div><span>Salvo</span><h2><Link href={`/projetos/${project.id}`}>{project.title}</Link></h2><p>{project.description}</p><footer><Link href={author?.username ? `/perfil/${author.username}` : "#"}>@{author?.username ?? "devtrine"}</Link><small>♥ {project.project_likes[0]?.count ?? 0}</small></footer></div></article>; })}{saved?.length === 0 ? <div className="explore-empty">Você ainda não salvou nenhum projeto.</div> : null}</section></main></div>;
}
