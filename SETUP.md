# SETUP — IA no Agro News no Claude Code

> **Primeira vez aqui?** Cole no Claude Code: "Leia o COMECE-AQUI.md e execute" — ele te guia do zero até o sistema rodando.

## 1. Pré-requisitos

- **Claude Code** instalado (incluído no seu plano; instruções em docs.claude.com → Claude Code). Precisa de Node.js na máquina.
- **Chave da API da OpenAI** para a ilustração de capa e a narração: criar em `platform.openai.com` → API Keys.
  - **Trava financeira:** usar crédito **pré-pago com recarga automática DESLIGADA** (teto absoluto de gasto) + alerta de orçamento no painel. Partida sugerida: valor baixo, ajustar com o consumo real. A API é cobrada à parte do ChatGPT Plus; preço vigente na página de pricing.

## 2. Primeira execução

Abra o terminal na pasta deste projeto e rode `claude`. Primeiro comando:

> Leia o CLAUDE.md e o SETUP.md. Instale as dependências (npm install e npx playwright install chromium), configure o que faltar e gere a edição-exemplo 2026-07-17 completa (ilustração + render + reel) e, na sequência, o dossiê-exemplo 2026-07-22-dossie e o teaser narrado 2026-07-20-teaser. Me mostre os 7 slides e me diga o que precisou ajustar.

A edição-exemplo já vem com notícias reais de 17/07/2026 — o primeiro render sai sem você escrever nada.

Para a ilustração funcionar, exporte a chave antes (ou peça ao Claude Code para configurar num `.env`):

```
export OPENAI_API_KEY="sua-chave"
```

## 3. Ligar o Instagram (configuração única)

Não existe botão "conectar Instagram" no Claude Code — a publicação automática usa a API oficial da Meta, configurada uma vez:

1. Criar a conta do IA no Agro News no Instagram e convertê-la em **conta profissional**.
2. Vincular a uma **Página do Facebook** (pode ser criada só pra isso).
3. Criar um **app em developers.facebook.com** com permissão de publicação de conteúdo e gerar um **token de longa duração**.
4. Colocar o projeto num **repositório GitHub** — a API da Meta exige as imagens em URL pública, e o fluxo usa as URLs raw do repositório.

Comando pro Claude Code fazer isso com você:

> Me guie na configuração da publicação automática (scripts/publicar.js): app da Meta, permissões, token de longa duração, IG_USER_ID, repositório GitHub e variáveis de ambiente. Valide endpoints e versão na doc atual da Meta e ajuste o script se necessário. No fim, faça um teste de publicação com a edição-exemplo.

## 4. Rodar sozinho todo dia (Rotinas)

No Claude Code Desktop → **Rotinas** → a grade completa:

**1. Diária, de manhã (ex.: 11h):**

> Faça a edição de hoje conforme o CLAUDE.md, do início à publicação do carrossel.

**2. Diária, à tarde (ex.: 17h30):**

> Publique o reel de hoje: commit + push do reel.mp4 e npm run publicar-reel com a data de hoje.

**3. Segunda, quarta e sexta (ex.: 12h30) — a série em 3 atos:**

> Produza e publique a peça da série de hoje conforme a Linha de Aprofundamento do CLAUDE.md (segunda: teaser narrado; quarta: dossiê; sexta: na prática). Se for segunda, escolha antes o tema da semana e registre em edicoes/.

**4. Semanal (ex.: domingo, 20h):**

> Rode a retro semanal conforme o CLAUDE.md: puxe as métricas, ranqueie por envios e salvamentos, compare reels narrados vs texto, e registre os aprendizados na seção Aprendizados.

- **Tarefa local:** roda na sua máquina, com o app aberto e o computador ligado no horário.
- **Rotina remota:** roda na nuvem mesmo com o computador desligado (usa o projeto no GitHub). Recomendação: validar uns dias na tarefa local e migrar pra remota.

Pré-requisitos extras do Reel: **ffmpeg** instalado (o Claude Code instala) e uma **trilha livre de direitos** em `assets/trilha.mp3` (ver `assets/LEIA-ME.txt`) — sem ela o reel sai sem som.

A regra de segurança fica no CLAUDE.md: se algo falhar no checklist (fonte, whitelist, render), o Radar **não publica** — salva a edição com um ALERTA.md e te avisa. Um dia sem post custa menos que um post errado no ar.

## Estrutura

```
ia-no-agro-news/
├── CLAUDE.md                  ← identidade, guardrails e processo do agente
├── SETUP.md
├── package.json
├── templates/                 ← capa.html · noticia.html · cta.html (visual da marca)
├── scripts/                   ← render.js (HTML→PNG) · ilustracao.js (OpenAI)
└── edicoes/2026-07-17/        ← edição-exemplo com notícias reais
```

## Segurança (leia o SEGURANCA.md)

Antes de ligar as rotinas: rode o checklist do `SEGURANCA.md` — travas de gasto, `.env` fora do repositório, token da Meta com data de renovação anotada, e teste ponta a ponta. Prudência na semana 1: começar com 1–2 posts/dia antes da grade completa, pra conta nova construir histórico.

## Trabalhar em mais de um computador

O GitHub é a fonte da verdade — o projeto continua de onde parou em qualquer máquina, com a mesma conta do Claude.

**Na segunda máquina (uma vez):**
1. `git clone` do repositório e abrir a pasta no terminal.
2. `npm install` + `npx playwright install chromium` + ffmpeg.
3. Recriar o `.env` (as chaves não sincronizam, de propósito — traga do seu gerenciador de senhas, nunca por e-mail/WhatsApp).
4. Copiar `assets/trilha.mp3` manualmente.
5. Rodar `claude` e trabalhar normal — o CLAUDE.md manda ele puxar (`git pull`) no início e subir (`commit + push`) no fim de toda sessão.

**Regra de ouro:** as rotinas agendadas ficam SÓ na máquina principal (ou na rotina remota da nuvem) — nunca nas duas, pra não publicar em dobro.
