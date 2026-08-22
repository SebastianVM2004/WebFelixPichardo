const articleDetail = document.getElementById('articleDetail');

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

function renderMarkdown(markdown) {
  const safeText = escapeHtml(markdown);
  return safeText
    .split(/\n{2,}/)
    .map(block => {
      if (block.startsWith('### ')) return `<h3>${block.slice(4)}</h3>`;
      if (block.startsWith('## ')) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith('# ')) return `<h2>${block.slice(2)}</h2>`;
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
}

function getPublishedImagePath(path) {
  const imagePath = String(path || '').trim();
  return imagePath.startsWith('/images/') ? `/static/images/${imagePath.slice(8)}` : imagePath;
}

function renderArticle(article) {
  articleDetail.innerHTML = '';

  const category = document.createElement('div');
  category.className = 'article-detail-category';
  category.textContent = article.category || 'Artículo';
  articleDetail.appendChild(category);

  const title = document.createElement('h1');
  title.textContent = article.title || 'Artículo sin título';
  articleDetail.appendChild(title);

  const intro = document.createElement('p');
  intro.className = 'article-detail-dek';
  intro.textContent = article.description || article.summary || '';
  articleDetail.appendChild(intro);

  const meta = document.createElement('div');
  meta.className = 'article-detail-meta';
  const author = article.author || 'Félix Pichardo Meuly';
  const date = article.date || article.publishedAt || '';
  meta.innerHTML = [
    date ? `<span>${escapeHtml(date)}</span>` : '',
    author ? `<span>Por ${escapeHtml(author)}</span>` : ''
  ].filter(Boolean).join(' · ');
  articleDetail.appendChild(meta);

  if (article.image) {
    const figure = document.createElement('figure');
    figure.className = 'article-detail-figure';

    const image = document.createElement('img');
    image.className = 'article-detail-image';
    image.src = getPublishedImagePath(article.image);
    image.alt = article.imageAlt || article.title || 'Artículo';
    figure.appendChild(image);

    if (article.imageCaption || article.imageAlt) {
      const figcaption = document.createElement('figcaption');
      figcaption.className = 'article-detail-caption';
      figcaption.textContent = article.imageCaption || article.imageAlt || '';
      figure.appendChild(figcaption);
    }

    articleDetail.appendChild(figure);
  }

  const content = document.createElement('div');
  content.className = 'article-detail-content';
  content.innerHTML = renderMarkdown(article.body || article.description || 'Este artículo todavía no tiene contenido.');
  articleDetail.appendChild(content);
  document.title = `${article.title || 'Artículo'} - Books Felix`;
}

const slug = new URLSearchParams(window.location.search).get('slug');
fetch(`content/articles.json?ts=${Date.now()}`, { cache: 'no-store' })
  .then(response => response.json())
  .then(data => {
    const articles = Array.isArray(data.articles) ? data.articles : [];
    const article = articles.find(item => item.slug === slug);
    if (article) {
      renderArticle(article);
    } else {
      articleDetail.innerHTML = '<p class="article-error">No se encontró el artículo solicitado.</p>';
    }
  })
  .catch(() => {
    articleDetail.innerHTML = '<p class="article-error">No se pudo cargar el artículo.</p>';
  });
