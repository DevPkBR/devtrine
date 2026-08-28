# devtrine

Rede social de portfólios para mostrar projetos reais e conhecer as pessoas que os criaram.

## Desenvolvimento

1. Instale as dependências:

```bash
npm install
```

2. Copie `.env.example` para `.env.local` e informe a URL e a chave anônima do projeto Supabase.

3. Inicie a aplicação:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Supabase

O schema, as políticas de Row Level Security e os buckets estão em `supabase/migrations`. Aplique as migrations ao projeto Supabase com a CLI antes de usar autenticação ou dados reais.

Nunca versione chaves privadas ou a service role key. O navegador utiliza somente a chave anônima pública.

## Scripts

- `npm run dev` inicia o ambiente de desenvolvimento.
- `npm run build` cria a versão de produção.
- `npm run start` inicia a versão de produção.
- `npm run lint` executa o ESLint.
- `npm run typecheck` verifica os tipos TypeScript sem gerar arquivos.

## Documentação

Antes de implementar, consulte `AGENTS.md`, `docs/PRODUCT.md`, `docs/DECISIONS.md` e `docs/OPEN_QUESTIONS.md`.
