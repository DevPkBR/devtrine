# devtrine

Rede social de portfólios para mostrar projetos reais e conhecer as pessoas que os criaram.

MVP publicado em [devtrine.dev-pkbr.workers.dev](https://devtrine.dev-pkbr.workers.dev).

## Desenvolvimento

1. Instale as dependências:

```bash
npm install
```

2. Copie `.env.example` para `.env.local` e informe a URL e a Publishable Key do projeto Supabase.

3. Inicie a aplicação:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Supabase

O schema, as políticas de Row Level Security e os buckets estão em `supabase/migrations`. Aplique as migrations ao projeto Supabase com a CLI antes de usar autenticação ou dados reais.

Nunca versione chaves privadas ou a service role key. O navegador utiliza somente a Publishable Key pública.

### Autenticação

No painel do Supabase:

1. defina a Site URL do ambiente;
2. adicione `/auth/callback` às URLs de redirecionamento permitidas;
3. mantenha e-mail e senha habilitados;
4. habilite o Google e informe as credenciais OAuth do provedor;
5. configure a URL de callback fornecida pelo Supabase no Google Cloud.

Em desenvolvimento, permita `http://localhost:3000/auth/callback`.

## Scripts

- `npm run dev` inicia o ambiente de desenvolvimento.
- `npm run build` cria a versão de produção.
- `npm run start` inicia a versão de produção.
- `npm run lint` executa o ESLint.
- `npm run typecheck` verifica os tipos TypeScript sem gerar arquivos.

## Documentação

Antes de implementar, consulte `AGENTS.md`, `docs/PRODUCT.md`, `docs/DECISIONS.md` e `docs/OPEN_QUESTIONS.md`.

## Cloudflare Workers

O projeto usa OpenNext para gerar um Worker compatível com Next.js 15, Server Actions e autenticação SSR.

- `npm run build:cloudflare` gera o artefato de produção.
- `npm run preview` executa uma prévia no runtime da Cloudflare.
- `npm run deploy` publica após autenticação segura do Wrangler.

No painel da Cloudflare, configure estas variáveis no Worker sem colocá-las no GitHub:

- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Não adicione Secret Key, `service_role`, senha do banco ou Google Client Secret ao Worker frontend.
