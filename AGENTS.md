# Instruções para agentes

Antes de propor ou implementar qualquer mudança, leia nesta ordem:

1. `docs/PRODUCT.md`
2. `docs/DECISIONS.md`
3. `docs/OPEN_QUESTIONS.md`
4. `README.md`

## Regras

- Preserve as decisões registradas. Não reabra uma decisão aprovada sem motivo técnico concreto.
- Não transforme o Devtrine em uma rede de posts genéricos: o projeto acessível por URL é a unidade central.
- Não implemente itens marcados como futuros no MVP.
- Não invente uma decisão quando ela não estiver documentada; registre-a em `OPEN_QUESTIONS.md`.
- Mudanças de produto ou arquitetura aprovadas devem atualizar estes documentos no mesmo PR.
- Priorize soluções simples, seguras, acessíveis, responsivas e fáceis de manter.
- Execute `npm run lint`, `npm run typecheck` e `npm run build` antes de concluir uma implementação.
