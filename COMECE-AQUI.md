# COMECE AQUI — Onboarding guiado do IA no Agro News

**Para o Fábio:** abra o terminal nesta pasta, rode `claude` e cole:
> Leia o COMECE-AQUI.md e execute: me conduza passo a passo, do zero até o sistema rodando.

**Para você, Claude Code:** este é o seu roteiro de condução. Regras de condução:

1. **Um passo por vez.** Dê a instrução, espere o Fábio confirmar ("feito"), verifique quando possível, só então avance.
2. **Linguagem simples**, sem jargão. O Fábio é gestor, não programador.
3. **Registre o progresso** em `SETUP-PROGRESSO.md` (fase e passo concluídos) — se a sessão cair, retome de onde parou.
4. **Telas de sites mudam:** antes de instruir qualquer passo na Meta, OpenAI, beehiiv ou GitHub, confira a documentação oficial vigente e adapte a instrução ao que existe hoje.
5. **Segurança de credenciais:** o Fábio digita senhas SÓ nos sites oficiais. Você nunca pede, recebe nem registra senha. Chaves e tokens vão direto pro `.env`, nunca pro chat em texto que fique em log versionado.
6. Leia antes de começar: `CLAUDE.md`, `SETUP.md`, `SEGURANCA.md`, `CAPTACAO.md`.

---

## FASE 0 — Preparação da máquina

1. Verifique Node.js (18+), npm e ffmpeg; instale o que faltar (guie a instalação se preciso).
2. `npm install` e `npx playwright install chromium`.
3. Explique ao Fábio em 5 linhas o que vai acontecer nas fases seguintes.

## FASE 1 — Contas (uma por vez, com instruções de tela)

**1.1 Instagram (conta nova — permitido).** Guie a criação de uma conta nova com o e-mail que o Fábio escolher (o Instagram permite múltiplas contas por pessoa). Nome: IA no Agro News; @ conforme disponibilidade. Converter em **conta profissional**.

**1.2 Facebook — ponto importante de conformidade.** O objetivo do Fábio é separação e risco contido. O caminho correto:
- Usar o **perfil real do Fábio como administrador** e criar uma **Página nova** chamada "IA no Agro News". Páginas são entidades separadas do perfil; **o administrador não aparece publicamente** na Página.
- **Não conduza a criação de um segundo perfil pessoal do Facebook**: os termos da Meta preveem um perfil por pessoa, e perfil novo + app de desenvolvedor + automação é exatamente o padrão que dispara bloqueio automático — o maior risco de banimento de toda a operação. Se o Fábio pedir, explique isso com calma e ofereça o caminho compliant. A separação que ele quer já é atendida por: Página nova + Instagram novo + (opcional) organizar os ativos num Portfólio Empresarial da Meta.

**1.3 Vincular** a conta profissional do Instagram à Página nova.

**1.4 Meta for Developers.** Criar o app (modo desenvolvimento), adicionar os produtos/permissões necessários pra publicação de conteúdo no Instagram, gerar **token de longa duração**, salvar no `.env` (`IG_USER_ID`, `META_ACCESS_TOKEN`). Anotar a data de expiração (~60 dias) em `SETUP-PROGRESSO.md`. Validar campos e endpoints na doc vigente e ajustar `scripts/publicar*.js` se necessário.

**1.5 OpenAI.** Conta em platform.openai.com → chave de API → `.env` (`OPENAI_API_KEY`). **Trava financeira:** crédito pré-pago com recarga automática DESLIGADA + alerta de orçamento. Confirmar preços vigentes de imagem e TTS e informar ao Fábio o custo estimado/mês da grade.

**1.6 GitHub.** Repositório público novo (ex.: `ia-no-agro-news`). Antes do primeiro push: `git status` e conferir que `.env` NÃO aparece (o `.gitignore` já bloqueia). Push inicial. Definir `BASE_URL` no `.env` com a raiz raw da pasta `edicoes/`.

**1.7 beehiiv.** Conta + publicação "IA no Agro News" + formulário com os campos do `CAPTACAO.md` (e-mail obrigatório; WhatsApp e listas suspensas opcionais; consentimento LGPD). Colocar o link da página de inscrição como **único link na bio** do Instagram.

**1.8 Trilha.** Fábio salva uma faixa livre de direitos em `assets/trilha.mp3`.

## FASE 2 — Teste ponta a ponta (edições-exemplo)

Na ordem, mostrando o resultado de cada passo ao Fábio:
1. `npm run ilustracao -- 2026-07-17` → 2. `npm run render -- 2026-07-17` → 3. `npm run reel -- 2026-07-17`
4. `npm run dossie -- 2026-07-22-dossie` (com ilustração antes)
5. `npm run reel-narrado -- 2026-07-20-teaser`
6. Commit + push das edições e **um teste real de publicação** na conta nova (a edição de 17/07). Conferir o post no app. Ajustar o que a API vigente exigir.

## FASE 3 — Checklist de segurança

Executar o checklist do `SEGURANCA.md` item por item, marcando em `SETUP-PROGRESSO.md`.

## FASE 4 — Rotinas

Criar as 4 rotinas do `SETUP.md` (diária manhã, diária tarde, seg/qua/sex da série, retro de domingo). **Semana 1 em aquecimento:** 1–2 posts/dia; grade completa a partir da semana 2.

## FASE 5 — Handoff

Resumir pro Fábio: o que roda sozinho e quando; onde ver os alertas (`ALERTA.md`); data de renovação do token; o que a primeira retro vai reportar (régua de trajetória + inscritos da newsletter). Encerrar com o sistema rodando.
