const articleCount = document.querySelector('[data-article-count]');
const fallbackArticleListImages = [
  'assets/junta.png',
  'assets/Consultorias.png',
  'assets/GestionServicios.png',
  'assets/Habilidadesdelentrevistador.png',
  'assets/Plan 30-60-90.png'
];

function getPublishedImagePath(path) {
  const imagePath = String(path || '').trim();
  return imagePath.startsWith('/images/') ? `/static/images/${imagePath.slice(8)}` : imagePath;
}

function createArticleSlug(title) {
  return String(title || 'articulo')
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function renderArticles(articles) {
  const list = document.getElementById('articlesList');
  if (!list) return;
  list.innerHTML = '';

  articles.forEach(article => {
    const card = document.createElement('article');
    card.className = 'article-card';
    const slug = article.slug || createArticleSlug(article.title);
    card.innerHTML = `<div class="article-thumb"></div><div class="article-info"><span class="article-category"></span><h3></h3><p></p></div><div class="article-action">›</div>`;
    const image = document.createElement('img');
    image.src = getPublishedImagePath(article.image) || fallbackArticleListImages[Math.floor(Math.random() * fallbackArticleListImages.length)];
    image.alt = article.imageAlt || article.title || 'Artículo';
    card.querySelector('.article-thumb').appendChild(image);
    card.querySelector('.article-category').textContent = article.category || '';
    card.querySelector('h3').textContent = article.title || '';
    card.querySelector('p').textContent = article.description || '';

    const articleLink = document.createElement('a');
    articleLink.className = 'article-card-link';
    articleLink.href = `article.html?slug=${encodeURIComponent(slug)}`;
    articleLink.setAttribute('aria-label', `Leer artículo: ${article.title || 'sin título'}`);
    articleLink.appendChild(card);
    list.appendChild(articleLink);
  });

  const articleCards = list.querySelectorAll('.article-card');
  if (articleCount) articleCount.textContent = `${articleCards.length} artículos disponibles`;
}

function renderPageFields(data) {
  document.querySelectorAll('[data-content-field]').forEach(element => {
    const value = data[element.dataset.contentField];
    if (value !== undefined && value !== null) element.textContent = value;
  });
}

fetch(`content/articles.json?ts=${Date.now()}`, { cache: 'no-store' })
  .then(response => response.json())
  .then(data => {
    renderPageFields(data);
    renderArticles(Array.isArray(data.articles) ? data.articles : []);
  })
  .catch(error => console.warn('No se pudieron cargar los artículos:', error));
