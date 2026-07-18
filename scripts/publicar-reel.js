// Publica o Reel do dia via API oficial da Meta.
// Uso: npm run publicar-reel -- 2026-07-17
// Fluxo: contêiner REELS (video_url público) → aguarda processamento → publica.
// O reel.mp4 precisa estar acessível em URL pública (commit + push antes, mesmo fluxo do carrossel).
// Obs: campos/versão da API mudam — na primeira execução, validar na doc atual da Meta.
const fs = require('fs');
const path = require('path');

const data = process.argv[2];
if (!data) { console.error('Uso: npm run publicar-reel -- AAAA-MM-DD'); process.exit(1); }

const { IG_USER_ID, META_ACCESS_TOKEN, BASE_URL } = process.env;
if (!IG_USER_ID || !META_ACCESS_TOKEN || !BASE_URL) {
  console.error('Defina IG_USER_ID, META_ACCESS_TOKEN e BASE_URL.');
  process.exit(1);
}

// Login do Instagram para empresas (token gerado no painel do app) → host graph.instagram.com
const VERSAO = process.env.META_API_VERSION || 'v25.0';
const GRAPH = `https://graph.instagram.com/${VERSAO}`;
const edicao = path.join(__dirname, '..', 'edicoes', data);
const conteudo = JSON.parse(fs.readFileSync(path.join(edicao, 'conteudo.json'), 'utf8'));

const legenda = `${conteudo.capa?.manchete || conteudo.tema}\n\nO dia completo, com fontes, tá no post de hoje.\n\n#IAnoAgro #agro #inteligenciaartificial`;

async function api(caminho, params, metodo = 'POST') {
  const url = `${GRAPH}/${caminho}`;
  const r = metodo === 'GET'
    ? await fetch(`${url}?${new URLSearchParams({ ...params, access_token: META_ACCESS_TOKEN })}`)
    : await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, access_token: META_ACCESS_TOKEN }),
      });
  const j = await r.json();
  if (!r.ok) { console.error('Erro da API da Meta:', JSON.stringify(j, null, 2)); process.exit(1); }
  return j;
}

(async () => {
  const { id: container } = await api(`${IG_USER_ID}/media`, {
    media_type: 'REELS',
    video_url: `${BASE_URL}/${data}/reel.mp4`,
    caption: legenda,
    share_to_feed: true,
  });
  console.log('Contêiner do reel criado:', container);

  // Vídeo leva alguns minutos pra processar — aguardar antes de publicar
  for (let i = 0; i < 40; i++) {
    const { status_code } = await api(container, { fields: 'status_code' }, 'GET');
    console.log('Status:', status_code);
    if (status_code === 'FINISHED') break;
    if (status_code === 'ERROR') { console.error('Processamento falhou.'); process.exit(1); }
    await new Promise((res) => setTimeout(res, 15000));
  }

  const { id: postId } = await api(`${IG_USER_ID}/media_publish`, { creation_id: container });
  fs.writeFileSync(path.join(edicao, 'publicado-reel.txt'),
    `${new Date().toISOString()} — reel publicado, id ${postId}\n`);
  console.log('Reel publicado. ID:', postId);
})();
