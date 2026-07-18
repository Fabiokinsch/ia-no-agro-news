// Gera a ilustração da capa via API de imagens da OpenAI (1 imagem por edição)
// Uso: OPENAI_API_KEY=... npm run ilustracao -- 2026-07-17
// Obs: modelo/parâmetros podem mudar — se falhar, conferir a doc atual da OpenAI e ajustar.
const fs = require('fs');
const path = require('path');

const data = process.argv[2];
if (!data) { console.error('Uso: npm run ilustracao -- AAAA-MM-DD'); process.exit(1); }

const chave = process.env.OPENAI_API_KEY;
if (!chave) { console.error('Defina a variável OPENAI_API_KEY (chave em platform.openai.com).'); process.exit(1); }

const edicao = path.join(__dirname, '..', 'edicoes', data);
const conteudo = JSON.parse(fs.readFileSync(path.join(edicao, 'conteudo.json'), 'utf8'));

(async () => {
  const r = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${chave}` },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2',
      prompt: conteudo.ilustracao_prompt,
      size: '1024x1536',
      quality: 'high',
    }),
  });
  const j = await r.json();
  if (!r.ok) { console.error('Erro da API:', JSON.stringify(j, null, 2)); process.exit(1); }

  const b64 = j.data[0].b64_json;
  fs.writeFileSync(path.join(edicao, 'ilustracao.png'), Buffer.from(b64, 'base64'));
  console.log('OK ilustracao.png salva em', edicao);
})();
