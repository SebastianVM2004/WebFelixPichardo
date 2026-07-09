// FORMULARIO DE CONTACTO
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const asunto = document.getElementById('asunto').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            // Validaciones
            if (!nombre || !email || !asunto || !mensaje) {
                mostrarMensaje('Por favor completa todos los campos requeridos.', 'error');
                return;
            }

            if (!validarEmail(email)) {
                mostrarMensaje('Por favor ingresa un email válido.', 'error');
                return;
            }

            // Simular envío del formulario
            console.log({
                nombre,
                email,
                telefono,
                asunto,
                mensaje,
                fecha: new Date().toLocaleString()
            });

            // Mostrar mensaje de éxito
            mostrarMensaje('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');

            // Limpiar formulario
            contactForm.reset();

            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }

    function validarEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    function mostrarMensaje(texto, tipo) {
        formMessage.textContent = texto;
        formMessage.className = `form-message ${tipo}`;
        formMessage.style.display = 'block';
    }
});

// CHATBOT FLOTANTE
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('close-chatbot');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    const respuestasBot = {
        'hola': 'Hola! ¿En qué puedo ayudarte hoy?',
        'gracias': 'De nada, es un placer ayudarte!',
        'horario': 'Nuestro horario es Lunes a Viernes de 9am a 6pm.',
        'precio': 'Los precios varían según el servicio. ¿Qué servicio te interesa?',
        'envío': 'Realizamos envíos a todo el país. El tiempo de entrega es de 3-5 días hábiles.',
        'ubicación': 'Estamos ubicados en Calle Principal 123, Ciudad.',
        'contacto': 'Puedes contactarnos por teléfono (+34 XXX XXX XXX) o email (info@ejemplo.com).',
        'ayuda': 'Puedo ayudarte con: horarios, precios, envío, ubicación, contacto, servicios.',
        'default': 'Lo siento, no entiendo tu pregunta. Escribe "ayuda" para conocer mis funciones.'
    };

    // Toggle del chatbot
    chatbotToggle.addEventListener('click', function(event) {
        event.preventDefault();
        const chatDiv = document.getElementById('chat-messages');
        const defaultMsg = '¡Hola! Soy tu asistente virtual. Pregúntame sobre horario, precio o envío.';
        if (chatbotWindow.classList.contains('hidden')) {
            if (chatDiv) chatDiv.innerHTML = `<div class="message bot-message"><strong>Bot:</strong> ${defaultMsg}</div>`;
            chatbotWindow.classList.remove('hidden');
            chatbotWindow.classList.add('visible');
        } else {
            chatbotWindow.classList.add('hidden');
            chatbotWindow.classList.remove('visible');
        }
    });

    // Cerrar chatbot
    closeBtn.addEventListener('click', function() {
        chatbotWindow.classList.add('hidden');
        chatbotWindow.classList.remove('visible');
    });

    // Enviar mensaje
    function enviarMensaje() {
        const texto = userInput.value.trim();
        if (texto === '') return;

        // Mensaje del usuario
        agregarMensaje(texto, 'user-message');
        userInput.value = '';

        // Respuesta del bot (con pequeño delay)
        setTimeout(() => {
            const respuesta = obtenerRespuesta(texto);
            agregarMensaje(respuesta, 'bot-message');
        }, 500);
    }

    sendBtn.addEventListener('click', enviarMensaje);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    });

    function agregarMensaje(texto, clase) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `message ${clase}`;
        mensajeDiv.textContent = texto;
        chatMessages.appendChild(mensajeDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function obtenerRespuesta(entrada) {
        const entradaLower = entrada.toLowerCase();

        for (const clave in respuestasBot) {
            if (entradaLower.includes(clave)) {
                return respuestasBot[clave];
            }
        }

        return respuestasBot['default'];
    }
});
