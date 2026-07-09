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

// Chatbot - Respuestas predeterminadas
const responses = {
    "horario": "📅 Estamos abiertos de 9:00 a 18:00 horas de lunes a viernes.",
    "precio": "💰 Consulta nuestro catálogo para ver precios y promociones especiales.",
    "envio": "🚚 Tenemos envío gratis a partir de $50. ¡Aproveecha!"
};

// Toggle del widget de chatbot
document.getElementById("chatbot-toggle").addEventListener("click", function() {
    let respuesta = "¡Hola! Soy tu asistente virtual. Pregúntame sobre horario, precio o envío.";
    const window = document.getElementById("chatbot-window");
    const chatDiv = document.getElementById("chat-messages");
    chatDiv.innerHTML = `<div class="message bot-message"><strong>Bot:</strong> ${respuesta}</div>`;
    
    window.classList.toggle("hidden");
    window.classList.toggle("visible");
});

// Cerrar chatbot
document.getElementById("close-chatbot").addEventListener("click", function() {
    const window = document.getElementById("chatbot-window");
    window.classList.add("hidden");
    window.classList.remove("visible");
});

// Evento para enviar mensaje
document.getElementById("send-btn").addEventListener("click", function() {
    let pregunta = document.getElementById("user-input").value.trim().toLowerCase();
    
    if (!pregunta) return;
    
    // Mostrar mensaje del usuario
    const chatDiv = document.getElementById("chat-messages");
    chatDiv.innerHTML += `<div class="message user-message"><strong>Tú:</strong> ${pregunta}</div>`;
    
    // Buscar respuesta
    let respuesta = "No entendí tu pregunta. Prueba: horario, precio o envio.";
    
    for (let clave in responses) {
        if (pregunta.includes(clave)) {
            respuesta = responses[clave];
            break;
        }
    }
    
    // Mostrar respuesta del bot
    setTimeout(function() {
        chatDiv.innerHTML += `<div class="message bot-message"><strong>Bot:</strong> ${respuesta}</div>`;
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }, 500);
    
    // Limpiar input
    document.getElementById("user-input").value = "";
});

// Permitir enviar con Enter
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("send-btn").click();
    }
});

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

    const originalSlides = Array.from(servicesCarousel.querySelectorAll(".service-card"));
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
