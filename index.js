// Nota: los efectos de hover en los botones se manejan por CSS (index.css).
// Se eliminó la rotación por JavaScript para evitar cambios de ángulo momentáneos.

// Efecto hover para cambiar imagen del libro
const bookImage = document.getElementById('book-image');
if (bookImage) {
  bookImage.addEventListener('mouseenter', () => {
    bookImage.src = 'assets/libroabierto.png';
  });
  bookImage.addEventListener('mouseleave', () => {
    bookImage.src = 'assets/librocerrado.png';
  });
}

// Carrusel de servicios con avance circular
const servicesCarousel = document.getElementById("services-carousel");
const carouselWrapper = document.querySelector(".services-carousel-wrapper");
const prevBtn = document.getElementById("carousel-prev");
const nextBtn = document.getElementById("carousel-next");
let currentServiceIndex = 1;
let slideCount = 0;
let isTransitioning = false;

function setupServiceCarousel() {
    if (!servicesCarousel || !carouselWrapper) return;

    const originalSlides = Array.from(servicesCarousel.children);
    if (originalSlides.length === 0) return;

    slideCount = originalSlides.length;
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    servicesCarousel.appendChild(firstClone);
    servicesCarousel.insertBefore(lastClone, servicesCarousel.firstChild);
    currentServiceIndex = 1;
    updateServiceCarousel(false);
}

function updateServiceCarousel(animate = true) {
    if (!servicesCarousel || !carouselWrapper || slideCount === 0) return;

    const wrapperWidth = carouselWrapper.clientWidth;
    const gap = parseFloat(getComputedStyle(servicesCarousel).gap) || 0;
    const slideWidth = wrapperWidth + gap;
    servicesCarousel.style.transition = animate ? "transform 0.4s ease" : "none";
    servicesCarousel.style.transform = `translateX(-${currentServiceIndex * slideWidth}px)`;
}

function moveToNext() {
    if (isTransitioning || slideCount === 0) return;
    isTransitioning = true;
    currentServiceIndex += 1;
    updateServiceCarousel();
}

function moveToPrev() {
    if (isTransitioning || slideCount === 0) return;
    isTransitioning = true;
    currentServiceIndex -= 1;
    updateServiceCarousel();
}

if (prevBtn) {
    prevBtn.addEventListener("click", moveToPrev);
}

if (nextBtn) {
    nextBtn.addEventListener("click", moveToNext);
}

if (servicesCarousel) {
    servicesCarousel.addEventListener("transitionend", function() {
        const wrapperWidth = carouselWrapper.clientWidth;
        const gap = parseFloat(getComputedStyle(servicesCarousel).gap) || 0;
        const slideWidth = wrapperWidth + gap;
        if (currentServiceIndex === 0) {
            currentServiceIndex = slideCount;
            servicesCarousel.style.transition = "none";
            servicesCarousel.style.transform = `translateX(-${currentServiceIndex * slideWidth}px)`;
        } else if (currentServiceIndex === slideCount + 1) {
            currentServiceIndex = 1;
            servicesCarousel.style.transition = "none";
            servicesCarousel.style.transform = `translateX(-${currentServiceIndex * slideWidth}px)`;
        }
        isTransitioning = false;
    });
}

window.addEventListener("resize", function() {
    updateServiceCarousel(false);
});

setupServiceCarousel();

// Avance automático del carrusel cada 20 segundos
setInterval(function() {
    moveToNext();
}, 5000);

// Cargar el contenido publicado desde Netlify CMS.
function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    })[character]);
}

function renderWelcomeContent(value) {
    const content = String(value).trim();

    // Conservar el HTML existente y convertir texto nuevo en párrafos seguros.
    if (/<[a-z][\s\S]*>/i.test(content)) {
        return content;
    }

    return content
        .split(/\n{2,}/)
        .map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
        .join('');
}

function renderEditableFields(data) {
    document.querySelectorAll('[data-content-field]').forEach(element => {
        const field = element.dataset.contentField;
        if (field === 'textoentrada' || field === 'imagenautor') return;
        if (data[field] !== undefined && data[field] !== null) {
            element.textContent = data[field];
        }
    });
}

function renderServices(services) {
    if (!servicesCarousel || !Array.isArray(services)) return;

    servicesCarousel.innerHTML = '';
    services.forEach(service => {
        const card = document.createElement('article');
        card.className = 'service-card';

        const image = document.createElement('img');
        image.src = getPublishedImagePath(service.image || '');
        image.alt = service.imageAlt || service.title || 'Servicio';

        const title = document.createElement('h3');
        title.textContent = service.title || '';

        const description = document.createElement('p');
        description.textContent = service.description || '';

        card.append(image, title, description);
        if (service.date) {
            const date = document.createElement('p');
            date.textContent = service.date;
            card.appendChild(date);
        }

        const eventUrl = getSafeServiceUrl(service.url);
        if (eventUrl) {
            const link = document.createElement('a');
            link.className = 'service-card-link';
            link.href = eventUrl;
            link.setAttribute('aria-label', `Ver información: ${service.title || 'evento'}`);

            if (/^https?:\/\//i.test(eventUrl)) {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }

            link.appendChild(card);
            servicesCarousel.appendChild(link);
        } else {
            servicesCarousel.appendChild(card);
        }
    });
}

function getSafeServiceUrl(value) {
    const rawUrl = String(value || '').trim();
    if (!rawUrl) return '';

    try {
        const parsedUrl = new URL(rawUrl, window.location.href);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') return '';
        return parsedUrl.href;
    } catch {
        return '';
    }
}

function getPublishedImagePath(path) {
    const imagePath = String(path).trim();

    // Compatibilidad con publicaciones antiguas que usaban /images.
    if (imagePath.startsWith('/images/')) {
        return `/static/images/${imagePath.slice('/images/'.length)}`;
    }

    return imagePath;
}

function loadContent() {
    fetch(`content/home.json?ts=${Date.now()}`, { cache: 'no-store' })
        .then(resp => resp.ok ? resp.json() : Promise.reject('No content'))
        .then(data => {
            renderEditableFields(data);
            renderServices(data.services);
            setupServiceCarousel();

            const welcomeDiv = document.querySelector('[data-content-field="textoentrada"]');
            if (welcomeDiv && data.textoentrada) {
                welcomeDiv.innerHTML = renderWelcomeContent(data.textoentrada);
            }

            const authorImg = document.querySelector('[data-content-field="imagenautor"]');
            if (authorImg && data.imagenautor) {
                const publishedImagePath = getPublishedImagePath(data.imagenautor);
                const imageCandidates = [
                    publishedImagePath,
                    publishedImagePath.replace(/^\/+/, ''),
                    'static/images/lolchicas.png'
                ];
                let imageCandidateIndex = 0;
                authorImg.src = imageCandidates[imageCandidateIndex];
                authorImg.onerror = () => {
                    imageCandidateIndex += 1;
                    if (imageCandidateIndex < imageCandidates.length) {
                        authorImg.src = imageCandidates[imageCandidateIndex];
                    }
                };
            }
        })
        .catch(err => {
            console.warn('No se pudo cargar content/home.json:', err);
        });
}
// Ejecutar después de cargar DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
} else {
    loadContent();
}
