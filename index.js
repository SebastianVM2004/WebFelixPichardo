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
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotWindow = document.getElementById("chatbot-window");

if (chatbotToggle && chatbotWindow) {
  chatbotToggle.addEventListener("click", function(event) {
      event.preventDefault();
      let respuesta = "¡Hola! Soy tu asistente virtual. Pregúntame sobre horario, precio o envío.";
      const chatDiv = document.getElementById("chat-messages");
      if (chatDiv) {
        chatDiv.innerHTML = `<div class="message bot-message"><strong>Bot:</strong> ${respuesta}</div>`;
      }
      chatbotWindow.classList.toggle("hidden");
      chatbotWindow.classList.toggle("visible");
  });
}

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

// Cargar contenido dinámico (textoentrada e imagenautor)
// Cargar contenido dinámico (textoentrada e imagenautor) y hacerlo editable
function loadContent() {
    fetch('content/content.json')
        .then(resp => resp.ok ? resp.json() : Promise.reject('No content'))
        .then(data => {
            
            // 1. Lógica para el Texto de Bienvenida
            const welcomeDiv = document.querySelector('.Texto-bienvenida');
            if (welcomeDiv && data.textoentrada) {
                welcomeDiv.innerHTML = data.textoentrada;
                
                // Hacer el texto editable
                welcomeDiv.setAttribute('contenteditable', 'true');
                welcomeDiv.style.outline = '1px dashed #ccc'; // Indicador visual sutil
                welcomeDiv.title = 'Haz clic para editar el texto';

                // Capturar el nuevo texto cuando el usuario hace clic fuera (pierde el foco)
                welcomeDiv.addEventListener('blur', function() {
                    console.log('Nuevo texto listo para guardar:', this.innerHTML);
                    // Aquí en el futuro enviarías este dato a tu servidor
                });
            }

            // 2. Lógica para la Imagen del Autor
            const authorImg = document.querySelector('.author-card img');
            if (authorImg && data.imagenautor) {
                authorImg.src = data.imagenautor;
                
                // Dar estilo de botón a la imagen
                authorImg.style.cursor = 'pointer';
                authorImg.title = 'Haz clic para cambiar la foto';

                // Crear un input de archivo oculto
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);

                // Abrir el explorador de archivos al hacer clic en la imagen
                authorImg.addEventListener('click', () => {
                    fileInput.click();
                });

                // Cambiar la imagen en pantalla cuando el usuario selecciona una nueva
                fileInput.addEventListener('change', function(event) {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            // Mostrar la nueva imagen
                            authorImg.src = e.target.result;
                            console.log('Nueva imagen cargada (Base64) lista para guardar.');
                            // Aquí en el futuro enviarías la imagen a tu servidor
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        })
        .catch(err => {
            console.warn('No se pudo cargar content/content.json:', err);
        });
}
// Ejecutar después de cargar DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
} else {
    loadContent();
}
