/* =====================================================================
   build-posts.js — Siqueira & Sousa Advogados

   Lê todos os arquivos .md dentro de content/posts/ e gera o arquivo
   assets/data/posts.js, que é o que o site realmente exibe.

   Isso roda automaticamente TODA VEZ que você publica um texto pelo
   painel /admin (o Netlify executa este script sozinho, como parte
   da publicação — "build command"). Você não precisa rodar nada
   manualmente nem entender o que está escrito aqui.

   Não é necessário nenhuma dependência externa (sem npm install).
   ===================================================================== */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');
const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'data', 'posts.js');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const [, fmBlock, body] = match;
  const fields = {};
  fmBlock.split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // remove surrounding quotes, if any
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fields[key] = value;
  });
  const paragraphs = body
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\r?\n/g, ' ').trim())
    .filter(Boolean);
  return { fields, paragraphs };
}

function jsStringLiteral(str) {
  return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error('Pasta content/posts não encontrada, nada para gerar.');
    process.exit(0);
  }
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const posts = [];

  files.forEach((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) {
      console.warn('Ignorando ' + file + ': sem frontmatter válido.');
      return;
    }
    const f = parsed.fields;
    const id = f.id || path.basename(file, '.md');
    if (!f.date || !f.title) {
      console.warn('Ignorando ' + file + ': faltam campos obrigatórios (date/title).');
      return;
    }
    posts.push({
      id,
      date: f.date,
      dateLabel: f.dateLabel || f.date,
      title: f.title,
      excerpt: f.excerpt || '',
      body: parsed.paragraphs,
    });
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  let out = '';
  out += '/* Gerado automaticamente por scripts/build-posts.js — não edite este\n';
  out += '   arquivo à mão, ele é sobrescrito a cada publicação. Para adicionar\n';
  out += '   ou editar textos, use o painel /admin do site. */\n\n';
  out += 'var BLOG_POSTS = [\n';
  posts.forEach((p) => {
    out += '  {\n';
    out += '    id: ' + jsStringLiteral(p.id) + ',\n';
    out += '    date: ' + jsStringLiteral(p.date) + ',\n';
    out += '    dateLabel: ' + jsStringLiteral(p.dateLabel) + ',\n';
    out += '    title: ' + jsStringLiteral(p.title) + ',\n';
    out += '    excerpt: ' + jsStringLiteral(p.excerpt) + ',\n';
    out += '    body: [\n';
    p.body.forEach((para) => {
      out += '      ' + jsStringLiteral(para) + ',\n';
    });
    out += '    ],\n';
    out += '  },\n';
  });
  out += '];\n';

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, out, 'utf8');
  console.log('Gerado ' + OUTPUT_FILE + ' com ' + posts.length + ' post(s).');
}

main();
