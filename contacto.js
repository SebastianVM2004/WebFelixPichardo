// FORMULARIO DE CONTACTO
document.addEventListener('DOMContentLoaded', function() {
    cargarContenidoContacto();
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

            const formData = new FormData(contactForm);
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
                .then(response => {
                    if (!response.ok) throw new Error('No se pudo enviar el formulario');
                    mostrarMensaje('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
                    contactForm.reset();
                    setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
                })
                .catch(() => mostrarMensaje('No se pudo enviar el mensaje. Inténtalo nuevamente.', 'error'));
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

function cargarContenidoContacto() {
    fetch(`content/contact.json?ts=${Date.now()}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
            const contactInfo = data.contactInfo || {};
            document.querySelectorAll('[data-content-field]').forEach(element => {
                const value = data[element.dataset.contentField];
                if (value !== undefined && value !== null) element.textContent = value;
            });
            document.querySelectorAll('[data-contact-field]').forEach(element => {
                const value = contactInfo[element.dataset.contactField];
                if (value !== undefined && value !== null) {
                    element.innerHTML = String(value).replace(/\n/g, '<br>');
                }
            });
        })
        .catch(error => console.warn('No se pudo cargar el contacto:', error));
}

