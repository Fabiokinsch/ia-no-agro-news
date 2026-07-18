// Gera o Reel diário (~16s, 1080x1920) a partir do conteudo.json:
// grava o template animado com Playwright e converte pra MP4 (H.264 + AAC) com ffmpeg.
// Uso: npm run reel -- 2026-07-17
// Pré-requisitos: ffmpeg instalado; trilha livre de direitos em assets/trilha.mp3
// (sem a trilha, o reel sai sem áudio — funciona, mas performa pior).
const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const data = process.argv[2];
if (!data) { console.error('Uso: npm run reel -- AAAA-MM-DD'); process.exit(1); }

const raiz = path.join(__dirname, '..');
const edicao = path.join(raiz, 'edicoes', data);
const conteudo = JSON.parse(fs.readFileSync(path.join(edicao, 'conteudo.json'), 'utf8'));

const tpl = fs.readFileSync(path.join(raiz, 'templates', 'reel.html'), 'utf8');
const n1 = conteudo.noticias[0];
const n2 = conteudo.noticias.find((n) => n.kicker !== n1.kicker) || conteudo.noticias[1];
const html = Object.entries({
  DATA: conteudo.data,
  HOOK: conteudo.capa.manchete,
  M1K: n1.kicker, M1: n1.manchete,
  M2K: n2.kicker, M2: n2.manchete,
}).reduce((h, [k, v]) => h.replaceAll(`{{${k}}}`, v ?? ''), tpl);

(async () => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'reel-'));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: tmp, size: { width: 1080, height: 1920 } },
  });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(16800);
  const video = page.video();
  await ctx.close();
  await browser.close();
  const webm = await video.path();

  const trilha = path.join(raiz, 'assets', 'trilha.mp3');
  const saida = path.join(edicao, 'reel.mp4');
  const base = ['-y', '-i', webm];
  const args = fs.existsSync(trilha)
    ? [...base, '-stream_loop', '-1', '-i', trilha, '-t', '16', '-map', '0:v', '-map', '1:a',
       '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
       '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', saida]
    : [...base, '-t', '16', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
       '-movflags', '+faststart', saida];

  if (!fs.existsSync(trilha)) console.warn('Aviso: assets/trilha.mp3 não encontrada — reel sem áudio.');
  const r = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (r.status !== 0) { console.error('ffmpeg falhou. Está instalado?'); process.exit(1); }
  console.log('OK reel.mp4 salvo em', edicao);
})();
