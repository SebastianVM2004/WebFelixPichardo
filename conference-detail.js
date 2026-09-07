const conferenceDetail = document.getElementById('conferenceDetail');

const fallbackConferenceImages = [
  'assets/expoLibro.png',
  'assets/junta.png',
  'assets/Consultorias.png',
  'assets/GestionServicios.png',
  'assets/Habilidadesdelentrevistador.png'
];

function createSlug(title) {
  return String(title || 'conferencia')
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getPublishedImagePath(path) {
  const imagePath = String(path || '').trim();
  return imagePath.startsWith('/images/') ? `/static/images/${imagePath.slice(8)}` : imagePath;
}

function renderConference(conference) {
  conferenceDetail.innerHTML = '';
  const image = getPublishedImagePath(conference.image) || fallbackConferenceImages[Math.floor(Math.random() * fallbackConferenceImages.length)];

  const poster = document.createElement('section');
  poster.className = 'conference-poster';

  const posterImage = document.createElement('img');
  posterImage.className = 'conference-poster-image';
  posterImage.src = image;
  posterImage.alt = conference.imageAlt || conference.title || 'Conferencia';
  poster.appendChild(posterImage);

  const overlay = document.createElement('div');
  overlay.className = 'conference-poster-overlay';

  const label = document.createElement('p');
  label.className = 'conference-poster-label';
  label.textContent = 'Evento destacado';
  overlay.appendChild(label);

  const title = document.createElement('h1');
  title.textContent = conference.title || 'Conferencia';
  overlay.appendChild(title);

  const date = document.createElement('p');
  date.className = 'conference-poster-date';
  date.textContent = conference.date || 'Próximamente';
  overlay.appendChild(date);

  const description = document.createElement('p');
  description.className = 'conference-poster-description';
  description.textContent = conference.description || 'Una experiencia para aprender, conversar y transformar ideas en acción.';
  overlay.appendChild(description);

  const callout = document.createElement('span');
  callout.className = 'conference-poster-callout';
  callout.textContent = 'No te lo pierdas';
  overlay.appendChild(callout);

  poster.appendChild(overlay);
  conferenceDetail.appendChild(poster);

  const details = document.createElement('section');
  details.className = 'conference-detail-info';
  details.innerHTML = `
    <div><span>Ponente</span><strong>${escapeHtml(conference.speaker || 'Félix Pichardo Meuly')}</strong></div>
    <div><span>Lugar</span><strong>${escapeHtml(conference.location || 'En línea')}</strong></div>
  `;
  conferenceDetail.appendChild(details);
  document.title = `${conference.title || 'Conferencia'} - Books Felix`;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

const requestedSlug = new URLSearchParams(window.location.search).get('slug');
fetch(`content/conferences.json?ts=${Date.now()}`, { cache: 'no-store' })
  .then(response => response.json())
  .then(data => {
    const conferences = Array.isArray(data.conferences) ? data.conferences : [];
    const conference = conferences.find(item => (item.slug || createSlug(item.title)) === requestedSlug);
    if (conference) {
      renderConference(conference);
    } else {
      conferenceDetail.innerHTML = '<p class="conference-error">No se encontró la conferencia solicitada.</p>';
    }
  })
  .catch(() => {
    conferenceDetail.innerHTML = '<p class="conference-error">No se pudo cargar la conferencia.</p>';
  });
