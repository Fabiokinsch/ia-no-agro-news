// Publica o carrossel do dia no Instagram via API oficial da Meta (Graph API).
// Uso: npm run publicar -- 2026-07-17
//
// Pré-requisitos (configuração única — ver SETUP.md, seção 4):
//   - Conta profissional do Instagram vinculada a uma Página do Facebook
//   - App na Meta for Developers com permissão de publicação de conteúdo + token de longa duração
//   - Imagens do dia acessíveis em URL pública (fluxo padrão: pasta edicoes/ versionada
//     no GitHub — fazer commit + push ANTES de rodar este script)
//   - Variáveis de ambiente: IG_USER_ID, META_ACCESS_TOKEN, BASE_URL
//     (BASE_URL = raiz pública da pasta edicoes/, ex.: https://raw.githubusercontent.com/usuario/repo/main/edicoes)
//
// Obs: endpoints e versão da API mudam — na primeira execução, conferir a doc atual da Meta e ajustar.
const fs = require('fs');
const path = require('path');

const data = process.argv[2];
if (!data) { console.error('Uso: npm run publicar -- AAAA-MM-DD'); process.exit(1); }

const { IG_USER_ID, META_ACCESS_TOKEN, BASE_URL } = process.env;
if (!IG_USER_ID || !META_ACCESS_TOKEN || !BASE_URL) {
  console.error('Defina IG_USER_ID, META_ACCESS_TOKEN e BASE_URL (ver SETUP.md, seção 4).');
  process.exit(1);
}

// Login do Instagram para empresas (token gerado no painel do app) → host graph.instagram.com
const VERSAO = process.env.META_API_VERSION || 'v25.0';
const GRAPH = `https://graph.instagram.com/${VERSAO}/${IG_USER_ID}`;

const edicao = path.join(__dirname, '..', 'edicoes', data);
const out = path.join(edicao, 'out');
const slides = fs.readdirSync(out).filter((f) => f.endsWith('.png')).sort();
const legenda = fs.readFileSync(path.join(out, 'legenda.txt'), 'utf8');
if (slides.length < 2 || slides.length > 20) { console.error(`Quantidade inválida de slides: ${slides.length} (esperado 2-20). Abortando.`); process.exit(1); }

async function post(endpoint, params) {
  const r = await fetch(`${GRAPH}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params, access_token: META_ACCESS_TOKEN }),
  });
  const j = await r.json();
  if (!r.ok) { console.error('Erro da API da Meta:', JSON.stringify(j, null, 2)); process.exit(1); }
  return j;
}

(async () => {
  // 1) Um contêiner por slide
  const filhos = [];
  for (const arquivo of slides) {
    const { id } = await post('media', {
      image_url: `${BASE_URL}/${data}/out/${arquivo}`,
      is_carousel_item: true,
    });
    filhos.push(id);
    console.log('Contêiner OK:', arquivo, id);
  }

  // 2) Contêiner do carrossel com a legenda
  const { id: criacao } = await post('media', {
    media_type: 'CAROUSEL',
    children: filhos.join(','),
    caption: legenda,
  });

  // 3) Aguardar o processamento do carrossel (a API retorna erro 9007 se publicar cedo demais)
  for (let i = 0; i < 24; i++) {
    const r = await fetch(`https://graph.instagram.com/${VERSAO}/${criacao}?${new URLSearchParams({ fields: 'status_code', access_token: META_ACCESS_TOKEN })}`);
    const { status_code } = await r.json();
    console.log('Status do carrossel:', status_code);
    if (status_code === 'FINISHED') break;
    if (status_code === 'ERROR') { console.error('Processamento do carrossel falhou.'); process.exit(1); }
    await new Promise((res) => setTimeout(res, 5000));
  }

  // 4) Publicar
  const { id: postId } = await post('media_publish', { creation_id: criacao });
  const registro = `${new Date().toISOString()} — publicado, id ${postId}\n`;
  fs.writeFileSync(path.join(edicao, 'publicado.txt'), registro);
  console.log('Publicado. ID do post:', postId);
})();
