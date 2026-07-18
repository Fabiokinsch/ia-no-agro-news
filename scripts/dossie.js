// Renderiza um carrossel profundo (Dossiê ou "Na prática") a partir de
// edicoes/<pasta>/conteudo.json com o campo "secoes".
// Uso: npm run dossie -- 2026-07-20-dossie
// Estrutura: 01-capa + seções + resumo + CTA (total variável, máx 20 slides).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const pasta = process.argv[2];
if (!pasta) { console.error('Uso: npm run dossie -- <pasta em edicoes/>'); process.exit(1); }

const raiz = path.join(__dirname, '..');
const edicao = path.join(raiz, 'edicoes', pasta);
const c = JSON.parse(fs.readFileSync(path.join(edicao, 'conteudo.json'), 'utf8'));
const out = path.join(edicao, 'out');
fs.mkdirSync(out, { recursive: true });

const total = 1 + c.secoes.length + 2; // capa + seções + resumo + CTA
if (total > 20) { console.error(`Total de ${total} slides excede o limite de 20.`); process.exit(1); }
const pad = (n) => String(n).padStart(2, '0');

const tpl = (nome) => fs.readFileSync(path.join(raiz, 'templates', nome), 'utf8');
const fill = (html, mapa) =>
  Object.entries(mapa).reduce((h, [k, v]) => h.replaceAll(`{{${k}}}`, v ?? ''), html);

(async () => {
  const browser = await chromium.launch();
  async function render(nome, html) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(out, nome) });
    await page.close();
    console.log('OK', nome);
  }

  // Capa (mesmo template do diário; ilustração da pasta, se existir)
  const artePath = path.join(edicao, 'ilustracao.png');
  const arte = fs.existsSync(artePath)
    ? `<img src="data:image/png;base64,${fs.readFileSync(artePath).toString('base64')}">`
    : '';
  await render('01-capa.png', fill(tpl('capa.html'), {
    ILUSTRACAO: arte, DATA: c.data, MANCHETE: c.capa.manchete, LOOP: c.capa.loop,
  }));

  // Seções
  for (let i = 0; i < c.secoes.length; i++) {
    const s = c.secoes[i];
    await render(`${pad(i + 2)}-secao.png`, fill(tpl('dossie.html'), {
      CONTADOR: `${pad(i + 2)} / ${pad(total)}`, ETAPA: s.etapa, TITULO: s.titulo,
      CORPO: s.corpo, LOOP: s.loop,
      FONTE: s.fonte ? `FONTE · ${s.fonte}` : 'IA NO AGRO NEWS', DATA: c.data,
    }));
  }

  // Resumo (etapas + títulos)
  const itens = c.secoes
    .map((s) => `<div class="item"><span>${s.etapa}</span><p>${s.titulo}</p></div>`)
    .join('');
  await render(`${pad(total - 1)}-resumo.png`,
    fill(tpl('resumo.html'), { ITENS: itens, DATA: c.data })
      .replace('07 / 08', `${pad(total - 1)} / ${pad(total)}`)
      .replace('O resumo de hoje', 'O dossiê em 1 slide'));

  // CTA
  await render(`${pad(total)}-cta.png`,
    fill(tpl('cta.html'), { PERGUNTA: c.cta.pergunta })
      .replace('08 / 08', `${pad(total)} / ${pad(total)}`));

  fs.writeFileSync(path.join(out, 'legenda.txt'), c.legenda);
  console.log(`Dossiê pronto: ${total} slides em`, out);
  await browser.close();
})();
