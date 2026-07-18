// Render dos 7 slides (1080x1350) a partir de edicoes/AAAA-MM-DD/conteudo.json
// Uso: npm run render -- 2026-07-17
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const data = process.argv[2];
if (!data) { console.error('Uso: npm run render -- AAAA-MM-DD'); process.exit(1); }

const raiz = path.join(__dirname, '..');
const edicao = path.join(raiz, 'edicoes', data);
const conteudo = JSON.parse(fs.readFileSync(path.join(edicao, 'conteudo.json'), 'utf8'));
const out = path.join(edicao, 'out');
fs.mkdirSync(out, { recursive: true });

const tpl = (nome) => fs.readFileSync(path.join(raiz, 'templates', nome), 'utf8');
const fill = (html, mapa) =>
  Object.entries(mapa).reduce((h, [k, v]) => h.replaceAll(`{{${k}}}`, v ?? ''), html);

(async () => {
  const browser = await chromium.launch();

  async function render(nomeArquivo, html) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(out, nomeArquivo) });
    await page.close();
    console.log('OK', nomeArquivo);
  }

  // 1 — Capa (ilustração embutida como data URI, se existir)
  const artePath = path.join(edicao, 'ilustracao.png');
  const arte = fs.existsSync(artePath)
    ? `<img src="data:image/png;base64,${fs.readFileSync(artePath).toString('base64')}">`
    : '';
  await render('01-capa.png', fill(tpl('capa.html'), {
    ILUSTRACAO: arte, DATA: conteudo.data,
    MANCHETE: conteudo.capa.manchete, LOOP: conteudo.capa.loop,
  }));

  // 2 a 6 — Notícias
  for (let i = 0; i < conteudo.noticias.length; i++) {
    const n = conteudo.noticias[i];
    await render(`0${i + 2}-noticia.png`, fill(tpl('noticia.html'), {
      CONTADOR: `0${i + 2} / 08`, KICKER: n.kicker, MANCHETE: n.manchete,
      FATO: n.fato, OPERACAO: n.operacao, FONTE: n.fonte,
      LOOP: n.loop, DATA: conteudo.data,
    }));
  }

  // 7 — Resumo salvável (gerado das manchetes)
  const itens = conteudo.noticias
    .map((n) => `<div class="item"><span>${n.kicker}</span><p>${n.manchete}</p></div>`)
    .join('');
  await render('07-resumo.png', fill(tpl('resumo.html'), { ITENS: itens, DATA: conteudo.data }));

  // 8 — CTA
  await render('08-cta.png', fill(tpl('cta.html'), { PERGUNTA: conteudo.cta.pergunta }));

  // Legenda pronta pra colar
  fs.writeFileSync(path.join(out, 'legenda.txt'), conteudo.legenda);
  console.log('Edição pronta em', out);

  await browser.close();
})();
