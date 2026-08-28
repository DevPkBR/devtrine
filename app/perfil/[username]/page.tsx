import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toggleFollow } from "./actions";
import "./profile.css";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();
  const [{ data: profile }, { data: auth }] = await Promise.all([
    supabase.from("profiles").select("id, name, username, bio, avatar_path, links, created_at").eq("username", username).maybeSingle(),
    supabase.auth.getUser(),
  ]);
  if (!profile) notFound();
  const [{ data: projects }, { count: followers }, { count: following }, { data: followed }] = await Promise.all([
    supabase.from("projects").select("id, title, description, thumbnail_path, project_likes(count)").eq("author_id", profile.id).eq("status", "published").order("published_at", { ascending: false }),
    supabase.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", profile.id),
    supabase.from("follows").select("following_id", { count: "exact", head: true }).eq("follower_id", profile.id),
    auth.user ? supabase.from("follows").select("follower_id").eq("follower_id", auth.user.id).eq("following_id", profile.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  const initials = profile.name.split(" ").slice(0, 2).map((part: string) => part[0]).join("").toUpperCase();
  const links = profile.links && typeof profile.links === "object" && !Array.isArray(profile.links) ? Object.entries(profile.links).filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].startsWith("http")) : [];

  return <div className="public-profile-shell">
    <header className="public-profile-topbar"><Link className="brand" href="/"><span className="logo-mark" aria-hidden="true"><i /><i /><i /></span><span>devtrine</span></Link><Link href="/explorar">Explorar projetos</Link></header>
    <main className="public-profile-main">
      <section className="profile-hero">
        <div className="profile-public-avatar">{initials}</div>
        <div className="profile-public-copy"><span>@{profile.username}</span><h1>{profile.name}</h1><p>{profile.bio || "Construindo e compartilhando projetos no Devtrine."}</p><div className="profile-links">{links.map(([label, url]) => <a href={url} target="_blank" rel="noreferrer" key={label}>{label}</a>)}</div></div>
        {auth.user?.id === profile.id ? <Link className="profile-follow secondary-button" href="/dashboard">Seu dashboard</Link> : <form action={toggleFollow}><input type="hidden" name="profileId" value={profile.id} /><input type="hidden" name="username" value={profile.username} /><button className={followed ? "profile-follow secondary-button" : "profile-follow primary-button"} type="submit">{followed ? "Seguindo" : "Seguir"}</button></form>}
      </section>
      <div className="profile-public-stats"><div><strong>{projects?.length ?? 0}</strong><span>Projetos</span></div><div><strong>{followers ?? 0}</strong><span>Seguidores</span></div><div><strong>{following ?? 0}</strong><span>Seguindo</span></div></div>
      <section className="profile-projects"><div className="profile-section-title"><span>Portfólio</span><h2>Projetos publicados</h2></div><div className="profile-project-grid">{(projects ?? []).map((project) => { const image = supabase.storage.from("project-thumbnails").getPublicUrl(project.thumbnail_path).data.publicUrl; return <article key={project.id}><Link href={`/projetos/${project.id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={project.title} />
      </Link><div><h3><Link href={`/projetos/${project.id}`}>{project.title}</Link></h3><p>{project.description}</p><small>♥ {project.project_likes[0]?.count ?? 0}</small></div></article>; })}</div>{projects?.length === 0 ? <p className="profile-empty">Nenhum projeto publicado ainda.</p> : null}</section>
    </main>
  </div>;
}
