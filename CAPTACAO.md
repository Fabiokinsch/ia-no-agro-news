# CAPTAÇÃO — newsletter e formulário

Fase atual: o canal é blindado. **Único CTA: assinar a newsletter gratuita.** Um link só na bio. Integração com o IA no Agro (site, cursos) só depois da validação, por ordem do Fábio.

## Ferramenta recomendada

**beehiiv** — plataforma feita pra newsletters de notícias (o modelo do benchmark Agro Espresso):
- Página de inscrição pronta + formulário com **campos personalizados** (atende WhatsApp e listas suspensas).
- **Programa de indicação nativo** — o loop de crescimento clássico de newsletter ("indique 3, ganhe X").
- **API** — permite ao Radar automatizar o envio no futuro.
- Tem plano gratuito de entrada; limites e preços vigentes: validar na configuração.

Alternativas: **MailerLite** (mais simples e barato, formulários com campos extras, sem programa de indicação nativo) · **Substack** (o Fábio já usa no IA no Agro, mas a inscrição é só e-mail — não atende os campos extras nem a automação; e manter separado do Substack principal preserva a blindagem).

## Formulário (bem simples — só e-mail trava a inscrição)

| Campo | Tipo | Obrigatório |
|---|---|---|
| Nome | texto | sim |
| E-mail | e-mail | **sim** |
| WhatsApp | telefone | não (com consentimento explícito: "aceito receber novidades por WhatsApp") |
| Área no agro | lista suspensa | não — produtor · consultor · vendedor · pesquisador · professor · estudante · outro |
| Principal cultura/atividade | lista suspensa | não — grãos/cereais · café · citrus · frutas · cana · gado de corte · gado de leite · outra |

Princípio: atrito mínimo. Os campos opcionais existem pra segmentar o funil futuro (curso certo pro perfil certo), não pra travar a inscrição.

## LGPD (o básico que protege)

- Consentimento claro no formulário: o que a pessoa vai receber e com qual frequência.
- WhatsApp só com opt-in próprio (caixa separada) — coletar sem consentir em receber é passivo de LGPD.
- Descadastro em 1 clique em todo envio; política de privacidade linkada na página.
- Double opt-in (confirmação por e-mail) recomendado: lista menor e mais limpa vale mais que lista grande e suja.

## A newsletter em si (o Radar já produz a matéria-prima)

- **Fase 1 — digest semanal:** toda sexta, o Radar compila as edições da semana (manchetes + "na operação" + fontes) num rascunho de newsletter pra aprovação do Fábio. Custo marginal ~zero.
- **Fase 2 — diária:** se a base validar (abertura/crescimento), migrar pro formato diário "5 minutos" via API — decisão do Fábio com dado da retro.

## Gatilho de integração com o IA no Agro

Quando o canal validar (referência: na régua dos portões aos 60–90 dias e base de e-mails crescendo), o Fábio autoriza a fase 2 do funil: menção ao ianoagro.com, CTA de cursos segmentado pelos campos do formulário, e cross-promo do ecossistema. Até lá: **newsletter, só.**
