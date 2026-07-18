// Siqueira & Sousa Advogados — renderização do blog a partir de assets/data/posts.js
(function () {
  if (typeof BLOG_POSTS === 'undefined') return;

  function sortedPosts() {
    return BLOG_POSTS.slice().sort(function (a, b) {
      return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Formatação leve de markdown dentro do texto: **negrito**, *itálico*
  // e [texto](link). Suficiente para o que o painel /admin escreve.
  function liteMarkdown(str) {
    return escapeHtml(str)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  // ---- Listagem completa (blog.html) ----
  var listEl = document.getElementById('blog-list');
  if (listEl) {
    var posts = sortedPosts();
    var html = '';
    posts.forEach(function (p) {
      html += '' +
        '<a class="blog-list-item" href="post.html#' + encodeURIComponent(p.id) + '" style="display:flex; text-decoration:none;">' +
          '<div>' +
            '<div class="blog-date">' + escapeHtml(p.dateLabel) + '</div>' +
            '<div class="blog-title">' + escapeHtml(p.title) + '</div>' +
            '<div class="blog-excerpt">' + escapeHtml(p.excerpt) + '</div>' +
          '</div>' +
        '</a>';
    });
    listEl.innerHTML = html;
  }

  // ---- Prévia na Home (index.html) ----
  var previewEl = document.getElementById('blog-preview-grid');
  if (previewEl) {
    var previewPosts = sortedPosts().slice(0, 3);
    var previewHtml = '';
    previewPosts.forEach(function (p) {
      previewHtml += '' +
        '<a class="blog-card" href="post.html#' + encodeURIComponent(p.id) + '" style="text-decoration:none;">' +
          '<div class="blog-date">' + escapeHtml(p.dateLabel) + '</div>' +
          '<div class="blog-title">' + escapeHtml(p.title) + '</div>' +
          '<div class="blog-excerpt">' + escapeHtml(p.excerpt) + '</div>' +
        '</a>';
    });
    previewEl.innerHTML = previewHtml;
  }

  // ---- Post individual (post.html) ----
  var postEl = document.getElementById('post-detail');
  if (postEl) {
    var id = decodeURIComponent((window.location.hash || '').replace('#', ''));
    var post = BLOG_POSTS.filter(function (p) { return p.id === id; })[0];
    if (!post) {
      postEl.innerHTML = '' +
        '<div class="eyebrow">Blog</div>' +
        '<h1 style="font-size:28px; margin-bottom:20px;">Texto não encontrado</h1>' +
        '<p style="font-size:14.5px; line-height:1.8;">O texto que você procura não existe ou o link está incorreto.</p>' +
        '<a href="blog.html" class="btn btn-outline" style="margin-top:24px;">Voltar ao blog</a>';
    } else {
      document.title = post.title + ' | Siqueira & Sousa Advogados';
      var bodyHtml = post.body.map(function (para) {
        return '<p style="font-size:15.5px; line-height:1.85; margin:0 0 20px;">' + liteMarkdown(para) + '</p>';
      }).join('');
      postEl.innerHTML = '' +
        '<div class="eyebrow">' + escapeHtml(post.dateLabel) + '</div>' +
        '<h1 style="font-size:30px; line-height:1.3; margin-bottom:28px; max-width:22ch;">' + escapeHtml(post.title) + '</h1>' +
        '<div style="max-width:68ch;">' + bodyHtml + '</div>' +
        '<a href="blog.html" class="btn btn-outline" style="margin-top:12px;">← Voltar ao blog</a>';
    }
  }

  // re-render post detail if hash changes without full reload
  window.addEventListener('hashchange', function () {
    window.location.reload();
  });
})();
