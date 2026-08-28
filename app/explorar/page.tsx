import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "./explore.css";

export const metadata = { title: "Explorar projetos — Devtrine", description: "Descubra projetos publicados pela comunidade Devtrine." };

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const supabase = await createClient();
  const { categoria } = await searchParams;
  const { data: categories } = await supabase.from("categories").select("id, name, slug").order("name");
  const selected = categories?.find((item) => item.slug === categoria);
  let query = supabase.from("projects").select("id, title, description, thumbnail_path, profiles!projects_author_id_fkey(name, username), project_technologies(technologies(name)), project_likes(count)").eq("status", "published").order("published_at", { ascending: false }).limit(30);
  if (selected) query = query.eq("category_id", selected.id);
  const { data: projects } = await query;

  return <div className="explore-shell">
    <header className="explore-topbar"><Link className="brand" href="/"><span className="logo-mark" aria-hidden="true"><i /><i /><i /></span><span>devtrine</span></Link><Link href="/dashboard">Meu dashboard</Link></header>
    <main className="explore-main">
      <div className="explore-heading"><span>Comunidade</span><h1>Explore projetos reais.</h1><p>Conheça o trabalho e as pessoas por trás de cada ideia.</p></div>
      <nav className="filters" aria-label="Categorias"><Link className={!selected ? "selected" : ""} href="/explorar">Todos</Link>{(categories ?? []).map((item) => <Link className={selected?.id === item.id ? "selected" : ""} href={`/explorar?categoria=${item.slug}`} key={item.id}>{item.name}</Link>)}</nav>
      <section className="explore-grid" aria-label="Projetos publicados">
        {(projects ?? []).map((project) => {
          const author = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles;
          const thumbnail = supabase.storage.from("project-thumbnails").getPublicUrl(project.thumbnail_path).data.publicUrl;
          const technologies = project.project_technologies.map((relation) => relation.technologies?.[0]?.name).filter(Boolean);
          return <article key={project.id}><Link className="explore-image" href={`/projetos/${project.id}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt={project.title} />
          </Link><div><span>{technologies.slice(0, 3).join(" · ") || "Projeto"}</span><h2><Link href={`/projetos/${project.id}`}>{project.title}</Link></h2><p>{project.description}</p><footer><Link href={author?.username ? `/perfil/${author.username}` : "#"}>@{author?.username ?? "devtrine"}</Link><small>♥ {project.project_likes[0]?.count ?? 0}</small></footer></div></article>;
        })}
        {projects?.length === 0 ? <div className="explore-empty">Ainda não há projetos nesta categoria.</div> : null}
      </section>
    </main>
  </div>;
}
