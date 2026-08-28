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
- Haverá recuperação de senha/conta e logout.
- Depois do cadastro, o usuário passa por onboarding.
- Nome e username são obrigatórios.
- Username é único.
- Avatar e bio são opcionais.
- O perfil é criado/completado durante o onboarding, não automaticamente por trigger no cadastro.
- O perfil pode possuir links.

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

- Limite definido para thumbnails: 500 KB.
- Formatos aceitos: JPEG/JPG, PNG, WebP e AVIF.
- Compressão pode ser aplicada.

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
- Supabase e PostgreSQL ainda não foram integrados ao código.

## Infraestrutura

- Não é necessário domínio próprio neste momento.
- O MVP deve ser publicado para poder ser apresentado.
- Cloudflare foi considerado aceitável.
- Decisões finais de hospedagem e integração com Supabase ainda devem ser documentadas antes da implementação.

## Desenvolvimento

Fluxo preferencial:

Definição → Especificação → Arquitetura → Implementação → Testes → Revisão → Deploy.

- Usar branches, commits claros e Pull Requests.
- Mesclar automaticamente somente quando a mudança estiver dentro do escopo aprovado e todas as validações passarem.
- Versionar migrations do banco.
- Não adicionar dependências sem necessidade.
- Mudanças arquiteturais relevantes exigem registro da decisão e de suas implicações.
