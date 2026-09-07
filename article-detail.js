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

const fallbackArticleImages = [
  'assets/junta.png',
  'assets/Consultorias.png',
  'assets/GestionServicios.png',
  'assets/Habilidadesdelentrevistador.png',
  'assets/Plan 30-60-90.png',
  'assets/expoLibro.png'
];

function getArticleImages(article) {
  const usedImages = [];
  const chooseImage = configuredImage => {
    const image = getPublishedImagePath(configuredImage);
    if (image && !usedImages.includes(image)) {
      usedImages.push(image);
      return image;
    }

    const availableImages = fallbackArticleImages.filter(item => !usedImages.includes(item));
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)] || fallbackArticleImages[0];
    usedImages.push(randomImage);
    return randomImage;
  };

  return {
    hero: chooseImage(article.image),
    secondary: chooseImage(article.secondaryImage),
    footer: chooseImage(article.footerImage)
  };
}

function createArticleFigure(imagePath, altText, caption, className) {
  const figure = document.createElement('figure');
  figure.className = `article-detail-figure ${className}`;

  const image = document.createElement('img');
  image.className = 'article-detail-image';
  image.src = imagePath;
  image.alt = altText;
  figure.appendChild(image);

  if (caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'article-detail-caption';
    figcaption.textContent = caption;
    figure.appendChild(figcaption);
  }

  return figure;
}

function renderArticle(article) {
  articleDetail.innerHTML = '';
  const images = getArticleImages(article);

  const topLine = document.createElement('div');
  topLine.className = 'article-detail-topline';
  topLine.innerHTML = `<span>${escapeHtml(article.category || 'Artículo')}</span><span>${escapeHtml(article.date || article.publishedAt || '')}</span>`;
  articleDetail.appendChild(topLine);

  const hero = document.createElement('div');
  hero.className = 'article-detail-hero';

  const heading = document.createElement('div');
  heading.className = 'article-detail-heading';

  const title = document.createElement('h1');
  title.textContent = article.title || 'Artículo sin título';
  heading.appendChild(title);

  const intro = document.createElement('p');
  intro.className = 'article-detail-dek';
  intro.textContent = article.description || article.summary || '';
  heading.appendChild(intro);

  const meta = document.createElement('div');
  meta.className = 'article-detail-meta';
  const author = article.author || 'Félix Pichardo Meuly';
  meta.innerHTML = [
    author ? `<span>Por ${escapeHtml(author)}</span>` : ''
  ].filter(Boolean).join(' · ');
  heading.appendChild(meta);
  hero.appendChild(heading);

  hero.appendChild(createArticleFigure(
    images.hero,
    article.imageAlt || article.title || 'Artículo',
    article.imageCaption || article.imageAlt || '',
    'article-detail-hero-figure'
  ));
  articleDetail.appendChild(hero);

  const editorialGrid = document.createElement('div');
  editorialGrid.className = 'article-detail-editorial-grid';
  editorialGrid.appendChild(createArticleFigure(
    images.secondary,
    article.secondaryImageAlt || article.title || 'Imagen del artículo',
    article.secondaryImageCaption || '',
    'article-detail-secondary-figure'
  ));

  const content = document.createElement('div');
  content.className = 'article-detail-content';
  content.innerHTML = renderMarkdown(article.body || article.description || 'Este artículo todavía no tiene contenido.');
  editorialGrid.appendChild(content);
  articleDetail.appendChild(editorialGrid);

  articleDetail.appendChild(createArticleFigure(
    images.footer,
    article.footerImageAlt || article.title || 'Imagen del artículo',
    article.footerImageCaption || '',
    'article-detail-footer-figure'
  ));
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
