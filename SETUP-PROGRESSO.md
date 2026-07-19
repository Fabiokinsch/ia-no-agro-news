# SETUP — Progresso

## FASE 0 — Preparação da máquina ✅ (concluída em 18/07/2026)
- [x] Node.js v24.18.0 (LTS) instalado via winget
- [x] npm 11.16.0
- [x] ffmpeg 8.1.2 instalado via winget
- [x] `npm install` (playwright)
- [x] `npx playwright install chromium`

## FASE 1 — Contas
- [x] 1.1 Instagram criado: @ianoagronews (profissional, na Central de Contas do Fábio)
- [x] 1.2 Página do Facebook "IA no Agro News" criada (18/07/2026, perfil real como admin)
- [x] 1.3 @ianoagronews vinculado à Página (18/07/2026, portfólio empresarial "ianoagronews")
- [x] 1.4 App "IA no Agro News Publisher" criado (18/07/2026) — caso de uso "API do Instagram" com login do Instagram para empresas; permissões: instagram_business_basic + instagram_business_content_publish (+ mensagens/comentários obrigatórias); @ianoagronews como Testador do Instagram (convite aceito); token de 60 dias gerado e testado via graph.instagram.com v25.0 (.env: IG_USER_ID e META_ACCESS_TOKEN preenchidos); scripts publicar.js e publicar-reel.js ajustados para graph.instagram.com
- [x] 1.5 OpenAI (18/07/2026): US$ 20 pré-pagos, auto-recarga OFF confirmada, chave criada e testada (.env OPENAI_API_KEY); script de ilustração atualizado pro gpt-image-2 (configurável via OPENAI_IMAGE_MODEL); custo estimado < US$ 12/mês
- [x] 1.6 GitHub (18/07/2026): repositório público github.com/Fabiokinsch/ia-no-agro-news, push inicial feito (28 arquivos, sem .env — conferido), BASE_URL no .env apontando pras URLs raw de edicoes/, acesso público testado (HTTP 200)
- [x] 1.7 beehiiv (18/07/2026): publicação "IA no Agro News" criada em conta beehiiv existente do Fábio (separada da "From Normal to Superhuman" — blindagem preservada); campos personalizados (Nome e sobrenome, WhatsApp, Área no agro, Principal cultura); formulário em PT com consentimento LGPD (campos extras ficam pro embed em site futuro); double opt-in LIGADO; reply-to fabio@ianoagro.com; página de inscrição https://ianoagronews.beehiiv.com/subscribe como link único na bio do @ianoagronews
- [x] 1.8 Trilha (19/07): "the_mountain-country" (Pixabay, livre de direitos) em assets/trilha.mp3 (2min34; fica só local — .gitignore bloqueia mp3)

## FASE 2 — Teste ponta a ponta
- [x] ilustracao → render (2026-07-17): gpt-image-2 OK, 8 slides OK (18/07; corrigido overlap do loop na capa.html)
- [x] reel 16s — trilha instalada (19/07); reel da edição 2026-07-18 regenerado com som
- [x] dossiê (2026-07-22-dossie): ilustração + 10 slides OK (18/07)
- [x] reel narrado (2026-07-20-teaser): TTS gpt-4o-mini-tts voz onyx + ffmpeg, 45s OK (18/07)
- [x] commit+push das edições (URLs públicas prontas pra API da Meta)
- [x] teste real de publicação (18/07/2026): carrossel 2026-07-17 publicado no @ianoagronews via API, post ID 18435431803121414 (publicar.js ganhou espera de processamento do carrossel — erro 9007 corrigido)

## FASE 3 — Checklist de segurança (SEGURANCA.md)
- [x] 1. .env criado e fora do git (conferido no git status antes do 1º push e em todo commit)
- [x] 2. OpenAI: US$ 20 pré-pagos, auto-recarga OFF (banner "Auto recharge is off" confirmado 18/07)
- [x] 3. Meta: app em modo desenvolvimento, permissões mínimas (basic + content_publish + obrigatórias), token de 60 dias gerado e TESTADO em publicação real; expiração ~16/09/2026 anotada
- [x] 4. Doc vigente validada: API v25.0 via graph.instagram.com, fluxo contêiner→status FINISHED→publish (carrossel e reels), preços OpenAI conferidos (custo < US$ 12/mês)
- [x] 5. Teste ponta a ponta com edições-exemplo ANTES das rotinas (publicação real OK em 18/07)
- Pendência menor: limite diário exato de publicações da API (confirmar na primeira semana; volume do canal 2-3/dia fica muito abaixo de qualquer limite)

## FASE 4 — Rotinas
- [x] Rotina 1 criada (18/07): edição diária ~6h ("ia-no-agro-edicao-diaria") — roda com o app Claude aberto e o computador ligado
- [x] Rotina 4 criada (18/07): retro semanal domingo ~8h ("ia-no-agro-retro-semanal")
- [ ] Semana 2 (a partir de ~27/07, se a semana 1 correr bem): criar rotina do reel da tarde e a série seg/qua/sex (3 atos)
- Primeira edição 100% real produzida e publicada em 18/07 (post 18101575022172628): tarifaço EUA, chuva no Sul, USDA, IA confiável (AgFunder), OpenAI Frontier

## FASE 5 — Handoff
- [ ] Resumo final pro Fábio

## Anotações
- Token da Meta: gerado em 18/07/2026, expira ~16/09/2026 (60 dias). Renovar ANTES: painel do app → Casos de uso → Configuração da API com login do Instagram → Gerar token. A retro semanal deve alertar a partir de 01/09/2026.
