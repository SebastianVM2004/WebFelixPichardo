document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('conferencesList');

  function renderPageFields(data) {
    document.querySelectorAll('[data-content-field]').forEach(element => {
      const value = data[element.dataset.contentField];
      if (value !== undefined && value !== null) element.textContent = value;
    });
  }

  function renderConferences(conferences) {
    listEl.innerHTML = '';
    if (conferences.length === 0) {
      listEl.innerHTML = '<p style="color:#666;padding:20px;text-align:center">No hay conferencias programadas.</p>';
      return;
    }

    conferences.forEach(conference => {
      const card = document.createElement('article');
      card.className = 'conference-card';
      if (conference.image) {
        const image = document.createElement('img');
        image.src = conference.image;
        image.alt = conference.title || 'Conferencia';
        image.className = 'conf-image';
        card.appendChild(image);
      }

      const title = document.createElement('div');
      title.className = 'conf-title';
      title.textContent = conference.title || '';
      card.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'conf-meta';
      meta.textContent = `Ponente: ${conference.speaker || ''} • Fecha: ${conference.date || ''}`;
      card.appendChild(meta);

      const location = document.createElement('div');
      location.className = 'conf-meta';
      location.textContent = `Lugar: ${conference.location || 'En línea'}`;
      card.appendChild(location);

      const description = document.createElement('p');
      description.textContent = conference.description || '';
      card.appendChild(description);
      listEl.appendChild(card);
    });
  }

  fetch(`content/conferences.json?ts=${Date.now()}`, { cache: 'no-store' })
    .then(response => response.json())
    .then(data => {
      renderPageFields(data);
      renderConferences(Array.isArray(data.conferences) ? data.conferences : []);
    })
    .catch(error => console.warn('No se pudieron cargar las conferencias:', error));
});
