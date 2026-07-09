const articleCards = document.querySelectorAll('.article-card');
const articleCount = document.querySelector('[data-article-count]');

if (articleCount) {
  articleCount.textContent = `${articleCards.length} artículos disponibles`;
}

articleCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.classList.add('hovered');
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('hovered');
  });

  card.addEventListener('click', () => {
    articleCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
  });
});
