# Decisões aprovadas

Este documento registra decisões já aprovadas. Elas não devem ser apresentadas novamente como perguntas em tarefas futuras.

## Produto e conteúdo

- Apenas projetos vinculados a uma URL acessível podem ser publicados.
- O Devtrine não terá posts genéricos no MVP.
- Recrutadores usam a mesma experiência dos demais usuários no MVP.
- O feed será híbrido.
- A área Explorar terá categorias.
- Comentários serão livres, mas sem respostas encadeadas no MVP.
- Haverá denúncias e moderação básica.

## Cadastro, autenticação e perfil

- Métodos de autenticação do MVP: e-mail e senha e Google OAuth.
- Haverá confirmação de e-mail, recuperação de senha/conta e logout.
- Depois do cadastro ou primeiro acesso pelo Google, o usuário passa por onboarding.
- Nome e username são obrigatórios.
- Username é único.
- Avatar e bio são opcionais.
- O perfil é criado/completado durante o onboarding, não automaticamente por trigger no cadastro.
- O perfil pode possuir links.
- Callbacks de autenticação só aceitam redirecionamentos internos.
- Senhas criadas pela interface exigem pelo menos 8 caracteres.

## Projetos

Campos aprovados:

- título;
- descrição;
- URL acessível obrigatória;
- thumbnail;
- tecnologias;
- categoria.

Acesso ao projeto externo deve permanecer fácil e evidente.

## Imagens

- Limite definido para thumbnails e avatares: 500 KB.
- Formatos aceitos: JPEG/JPG, PNG, WebP e AVIF.
- Compressão pode ser aplicada.
- Supabase Storage possui buckets públicos separados para avatares e thumbnails.
- Cada usuário só pode gravar ou excluir arquivos dentro da pasta identificada pelo próprio UUID.

## Banco e segurança

- O schema usa UUIDs e timestamps UTC.
- Entidades: perfis, categorias, tecnologias, projetos, relação projeto-tecnologia, likes, comentários, follows, projetos salvos e denúncias.
- Tecnologias são normalizadas para permitir filtros e evitar duplicações por projeto.
- Projetos possuem estados `draft` e `published`.
- Todas as tabelas públicas usam Row Level Security.
- Perfis e projetos publicados têm leitura pública.
- Rascunhos só podem ser lidos e alterados pelo autor.
- Escrita de perfis e projetos é restrita ao proprietário autenticado.
- Likes, comentários, follows e salvamentos só podem ser criados em nome do usuário autenticado.
- Likes, comentários e salvamentos só podem apontar para projetos publicados.
- Salvamentos e denúncias são privados para o usuário que os criou.
- Migrations SQL são versionadas em `supabase/migrations`.

## Tecnologia

Stack aprovada:

- TypeScript;
- Next.js com App Router;
- React;
- Tailwind CSS;
- Supabase;
- PostgreSQL;
- GitHub;
- GitHub Actions.

Estado atual:

- Next.js, React, TypeScript e Tailwind estão configurados.
- O lockfile está versionado.
- GitHub Actions executa instalação, lint, typecheck e build.
- Clientes Supabase para browser e servidor e renovação de sessão estão configurados.
- O schema inicial, RLS e buckets estão versionados como migration.
- Interfaces e ações de autenticação, recuperação de senha e onboarding estão implementadas e validadas em produção.
- Google OAuth e credenciais públicas do Supabase estão configurados no ambiente Cloudflare.
- O dashboard autenticado é o destino após login e onboarding.

## Infraestrutura

- Não é necessário domínio próprio neste momento.
- O MVP deve ser publicado para poder ser apresentado.
- A hospedagem aprovada para o MVP é Cloudflare Workers no plano gratuito.
- O Next.js 15 será adaptado com OpenNext para preservar Server Actions, SSR e middleware sem migrar a stack para vinext/Next.js 16.
- Artefatos `.open-next`, arquivos `.dev.vars` e credenciais nunca são versionados.
- As variáveis públicas do Supabase são configuradas diretamente no ambiente do Worker.
- O endereço provisório do MVP é `https://devtrine.dev-pkbr.workers.dev`.

## Desenvolvimento

Fluxo preferencial:

Definição → Especificação → Arquitetura → Implementação → Testes → Revisão → Deploy.

- Usar branches, commits claros e Pull Requests.
- Mesclar automaticamente somente quando a mudança estiver dentro do escopo aprovado e todas as validações passarem.
- Versionar migrations do banco.
- Não adicionar dependências sem necessidade.
- Mudanças arquiteturais relevantes exigem registro da decisão e de suas implicações.
