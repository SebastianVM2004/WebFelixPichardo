// Conferencias definidas directamente desde el código
const conferences = [
  {
    title: 'Conferencia "Lentes y Narrativa"',
    speaker: 'Félix Pichardo Meuly',
    date: '2024-11-15',
    location: 'Auditorio Central',
    description: 'Una charla sobre cómo la fotografía puede transformar relatos y conectar con audiencias en presentaciones y conferencias.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('conferencesList');

  function render() {
    listEl.innerHTML = '';

    if (conferences.length === 0) {
      listEl.innerHTML = '<p style="color:#666;padding:20px;text-align:center">No hay conferencias programadas.</p>';
      return;
    }

    conferences.forEach((c) => {
      const card = document.createElement('div');
      card.className = 'conference-card';
      card.innerHTML = `
        ${c.image ? `<img src="${c.image}" alt="${c.title}" class="conf-image">` : ''}
        <div class="conf-title">${c.title}</div>
        <div class="conf-meta"><strong>Ponente:</strong> ${c.speaker} • <strong>Fecha:</strong> ${c.date}</div>
        <div class="conf-meta"><strong>Lugar:</strong> ${c.location || 'En línea'}</div>
        <p>${c.description || ''}</p>
      `;
      listEl.appendChild(card);
    });
  }

  render();
});
