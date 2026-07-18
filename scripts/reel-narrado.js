// Reel narrado (60-90s): narração por voz de IA sincronizada com cenas de texto cinético.
// Fluxo: TTS por cena (API da OpenAI) → mede a duração de cada áudio (ffprobe) →
// monta a linha do tempo exata → grava com Playwright → mux narração + trilha (volume baixo).
// Uso: OPENAI_API_KEY=... npm run reel-narrado -- 2026-07-20-teaser
// Obs: modelo/voz de TTS mudam — validar na doc da OpenAI na primeira execução.
const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const pasta = process.argv[2];
if (!pasta) { console.error('Uso: npm run reel-narrado -- <pasta em edicoes/>'); process.exit(1); }
const chave = process.env.OPENAI_API_KEY;
if (!chave) { console.error('Defina OPENAI_API_KEY.'); process.exit(1); }

const raiz = path.join(__dirname, '..');
const edicao = path.join(raiz, 'edicoes', pasta);
const c = JSON.parse(fs.readFileSync(path.join(edicao, 'conteudo.json'), 'utf8'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'narrado-'));

const MODELO_TTS = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';
const VOZ = process.env.OPENAI_TTS_VOICE || 'onyx';

const dur = (arq) => Number(spawnSync('ffprobe',
  ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arq],
  { encoding: 'utf8' }).stdout.trim());

async function tts(texto, destino) {
  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${chave}` },
    body: JSON.stringify({ model: MODELO_TTS, voice: VOZ, input: texto, response_format: 'mp3' }),
  });
  if (!r.ok) { console.error('Erro no TTS:', await r.text()); process.exit(1); }
  fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
}

(async () => {
  // 1) Narração por cena + duração exata
  const tempos = [];
  let inicio = 0;
  for (let i = 0; i < c.cenas.length; i++) {
    const arq = path.join(tmp, `cena${i}.mp3`);
    await tts(c.cenas[i].narracao, arq);
    const d = dur(arq) + 0.35; // respiro entre cenas
    tempos.push({ inicio, d, arq });
    inicio += d;
  }
  const total = inicio.toFixed(2);

  // 2) Concatenar a narração
  const lista = path.join(tmp, 'lista.txt');
  fs.writeFileSync(lista, tempos.map((t) => `file '${t.arq}'`).join('\n'));
  const narracao = path.join(tmp, 'narracao.mp3');
  spawnSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', narracao]);

  // 3) Montar o HTML com os tempos exatos
  const tplBase = fs.readFileSync(path.join(raiz, 'templates', 'reel-narrado.html'), 'utf8');
  const cenas = c.cenas.map((cena, i) =>
    `<div class="cena c${i}"><div class="kicker"><div class="traco"></div><span>${cena.kicker}</span></div><h2>${cena.texto}</h2></div>`
  ).join('\n');
  const estilos = tempos.map((t, i) =>
    `.c${i} { animation-duration:${t.d.toFixed(2)}s; animation-delay:${t.inicio.toFixed(2)}s; }`
  ).join('\n');
  const html = tplBase.replaceAll('{{CENAS}}', cenas).replaceAll('{{ESTILOS}}', estilos)
    .replaceAll('{{DATA}}', c.data).replaceAll('{{TOTAL}}', total);

  // 4) Gravar o vídeo
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: tmp, size: { width: 1080, height: 1920 } },
  });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout((Number(total) + 0.8) * 1000);
  const video = page.video();
  await ctx.close();
  await browser.close();
  const webm = await video.path();

  // 5) Mux: narração em primeiro plano, trilha ao fundo (se existir)
  const trilha = path.join(raiz, 'assets', 'trilha.mp3');
  const saida = path.join(edicao, 'reel.mp4');
  const args = fs.existsSync(trilha)
    ? ['-y', '-i', webm, '-i', narracao, '-stream_loop', '-1', '-i', trilha, '-t', total,
       '-filter_complex', '[1:a]volume=1.0[voz];[2:a]volume=0.12[fundo];[voz][fundo]amix=inputs=2:duration=first[a]',
       '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
       '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', saida]
    : ['-y', '-i', webm, '-i', narracao, '-t', total, '-map', '0:v', '-map', '1:a',
       '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
       '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', saida];
  const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (r.status !== 0) { console.error('ffmpeg falhou.'); process.exit(1); }
  console.log(`OK reel narrado (${total}s) salvo em`, saida);
})();
