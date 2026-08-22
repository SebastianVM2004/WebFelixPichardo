const articleCount = document.querySelector('[data-article-count]');

function getPublishedImagePath(path) {
  const imagePath = String(path || '').trim();
  return imagePath.startsWith('/images/') ? `/static/images/${imagePath.slice(8)}` : imagePath;
}

function renderArticles(articles) {
  const list = document.getElementById('articlesList');
  if (!list) return;
  list.innerHTML = '';

  articles.forEach(article => {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.tabIndex = 0;
    card.dataset.articleSlug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    card.innerHTML = `<div class="article-thumb"></div><div class="article-info"><span class="article-category"></span><h3></h3><p></p></div><div class="article-action">›</div>`;
    const image = document.createElement('img');
    image.src = getPublishedImagePath(article.image);
    image.alt = article.imageAlt || article.title || 'Artículo';
    card.querySelector('.article-thumb').appendChild(image);
    card.querySelector('.article-category').textContent = article.category || '';
    card.querySelector('h3').textContent = article.title || '';
    card.querySelector('p').textContent = article.description || '';
    list.appendChild(card);
  });

  const articleCards = list.querySelectorAll('.article-card');
  if (articleCount) articleCount.textContent = `${articleCards.length} artículos disponibles`;
  articleCards.forEach(card => {
    const openArticle = () => {
      articleCards.forEach(item => item.classList.remove('active'));
      card.classList.add('active');
      window.location.href = `article.html?slug=${encodeURIComponent(card.dataset.articleSlug)}`;
    };
    card.addEventListener('click', openArticle);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openArticle();
      }
    });
  });
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
