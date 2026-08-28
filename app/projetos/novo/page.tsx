import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { createClient } from "@/lib/supabase/server";
import { publishProject } from "./actions";
import "./project-form.css";

function Logo() {
  return <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>;
}

export const metadata = {
  title: "Publicar projeto — Devtrine",
  description: "Apresente um projeto real para a comunidade Devtrine.",
};

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/login");

  const [{ data: profile }, { data: categories }] = await Promise.all([
    supabase.from("profiles").select("id").eq("id", authData.user.id).maybeSingle(),
    supabase.from("categories").select("id, name").order("name"),
  ]);
  if (!profile) redirect("/onboarding");

  const { erro } = await searchParams;

  return (
    <div className="project-form-shell">
      <header className="project-form-topbar">
        <Link className="brand" href="/" aria-label="Devtrine, página inicial"><Logo /><span>devtrine</span></Link>
        <Link href="/dashboard">Voltar ao dashboard</Link>
      </header>
      <main className="project-form-main">
        <section className="project-form-intro">
          <span>Publicar projeto</span>
          <h1>Mostre o que você construiu.</h1>
          <p>Compartilhe um projeto real, apresente o contexto e facilite o acesso de quem quiser conhecê-lo.</p>
          <div><strong>Antes de publicar</strong><p>A URL precisa estar acessível. A imagem deve ter até 500 KB e estar em JPEG, PNG, WebP ou AVIF.</p></div>
        </section>

        <section className="project-form-card">
          {erro ? <div className="project-form-error" role="alert">{erro}</div> : null}
          <form action={publishProject}>
            <div className="project-field">
              <label htmlFor="title">Título</label>
              <input id="title" name="title" type="text" maxLength={120} placeholder="Nome do projeto" required />
            </div>
            <div className="project-field">
              <label htmlFor="description">Descrição</label>
              <textarea id="description" name="description" maxLength={5000} placeholder="O que é, por que foi criado e como funciona?" required />
            </div>
            <div className="project-field">
              <label htmlFor="url">URL do projeto</label>
              <input id="url" name="url" type="url" inputMode="url" placeholder="https://seu-projeto.com" required />
              <small>O acesso externo ficará evidente para quem visualizar o projeto.</small>
            </div>
            <div className="project-field-row">
              <div className="project-field">
                <label htmlFor="categoryId">Categoria</label>
                <select id="categoryId" name="categoryId" defaultValue="" required>
                  <option value="" disabled>Selecione</option>
                  {(categories ?? []).map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
                </select>
              </div>
              <div className="project-field">
                <label htmlFor="technologies">Tecnologias</label>
                <input id="technologies" name="technologies" type="text" placeholder="Next.js, TypeScript, Supabase" />
                <small>Separe os nomes por vírgulas.</small>
              </div>
            </div>
            <div className="project-field file-field">
              <label htmlFor="thumbnail">Thumbnail</label>
              <input id="thumbnail" name="thumbnail" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required />
              <small>JPEG, PNG, WebP ou AVIF. Tamanho máximo: 500 KB.</small>
            </div>
            <div className="project-form-actions">
              <Link href="/dashboard">Cancelar</Link>
              <SubmitButton className="primary-button project-submit" pendingText="Publicando...">Publicar projeto</SubmitButton>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
