// Puxa métricas dos posts publicados (últimos N dias) via Graph API — insumo da retro semanal.
// Uso: npm run metricas -- 7
// Obs: os nomes das métricas variam entre versões da API — validar na doc atual da Meta e
// ajustar via variável IG_METRICAS se necessário.
const fs = require('fs');
const path = require('path');

const dias = Number(process.argv[2] || 7);
const { META_ACCESS_TOKEN } = process.env;
if (!META_ACCESS_TOKEN) { console.error('Defina META_ACCESS_TOKEN.'); process.exit(1); }

const VERSAO = process.env.META_API_VERSION || 'v21.0';
const METRICAS = process.env.IG_METRICAS || 'reach,saved,shares,likes,comments,total_interactions';

const raiz = path.join(__dirname, '..');
const edicoesDir = path.join(raiz, 'edicoes');
const limite = Date.now() - dias * 24 * 60 * 60 * 1000;

const posts = [];
for (const pasta of fs.readdirSync(edicoesDir)) {
  const reg = path.join(edicoesDir, pasta, 'publicado.txt');
  if (!fs.existsSync(reg)) continue;
  if (new Date(pasta.slice(0, 10)).getTime() < limite) continue;
  const m = fs.readFileSync(reg, 'utf8').match(/id (\S+)/);
  if (m) posts.push({ data: pasta, id: m[1] });
}
if (!posts.length) { console.log('Nenhum post publicado no período.'); process.exit(0); }

(async () => {
  const linhas = [];
  for (const p of posts) {
    const url = `https://graph.facebook.com/${VERSAO}/${p.id}/insights?metric=${METRICAS}&access_token=${META_ACCESS_TOKEN}`;
    const r = await fetch(url);
    const j = await r.json();
    if (!r.ok) { console.error(`Erro em ${p.data}:`, JSON.stringify(j)); continue; }
    const valores = Object.fromEntries(
      (j.data || []).map((mtr) => [mtr.name, mtr.values?.[0]?.value ?? '-'])
    );
    linhas.push({ data: p.data, id: p.id, ...valores });
    console.log(p.data, JSON.stringify(valores));
  }

  const relDir = path.join(raiz, 'metricas');
  fs.mkdirSync(relDir, { recursive: true });
  const hoje = new Date().toISOString().slice(0, 10);
  const cabecalho = ['data', 'id', ...METRICAS.split(',')];
  const md = [
    `# Métricas — últimos ${dias} dias (gerado em ${hoje})`,
    '',
    `| ${cabecalho.join(' | ')} |`,
    `| ${cabecalho.map(() => '---').join(' | ')} |`,
    ...linhas.map((l) => `| ${cabecalho.map((c) => l[c] ?? '-').join(' | ')} |`),
  ].join('\n');
  fs.writeFileSync(path.join(relDir, `relatorio-${hoje}.md`), md);
  console.log('Relatório salvo em metricas/relatorio-' + hoje + '.md');
})();
