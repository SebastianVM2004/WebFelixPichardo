// DATOS DE PRODUCTOS
const productos = [
    {
        id: 1,
        nombre: 'Consultoría Estratégica',
        descripcion: 'Análisis profundo de tu negocio y estrategia personalizada.',
        precio: 1500,
        categoria: 'consultoría',
        emoji: '📊'
    },
    {
        id: 2,
        nombre: 'Desarrollo Web',
        descripcion: 'Sitios web modernos y responsivos para tu empresa.',
        precio: 2500,
        categoria: 'desarrollo',
        emoji: '🌐'
    },
    {
        id: 3,
        nombre: 'Diseño Gráfico',
        descripcion: 'Identidad visual profesional y atractiva.',
        precio: 800,
        categoria: 'diseño',
        emoji: '🎨'
    },
    {
        id: 4,
        nombre: 'Capacitación Digital',
        descripcion: 'Programas de formación en tecnología y liderazgo.',
        precio: 600,
        categoria: 'capacitación',
        emoji: '📚'
    },
    {
        id: 5,
        nombre: 'Aplicaciones Móvil',
        descripcion: 'Apps iOS y Android personalizadas.',
        precio: 3500,
        categoria: 'desarrollo',
        emoji: '📱'
    },
    {
        id: 6,
        nombre: 'Marketing Digital',
        descripcion: 'Estrategias de marketing y posicionamiento online.',
        precio: 1200,
        categoria: 'consultoría',
        emoji: '📢'
    },
    {
        id: 7,
        nombre: 'UX/UI Design',
        descripcion: 'Diseño de experiencia de usuario excepcional.',
        precio: 2000,
        categoria: 'diseño',
        emoji: '✨'
    },
    {
        id: 8,
        nombre: 'Gestión de Proyectos',
        descripcion: 'Capacitación en metodologías ágiles y gestión.',
        precio: 950,
        categoria: 'capacitación',
        emoji: '🎯'
    }
];

// CARRITO
let carrito = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    configurarBuscador();
    configurarFiltros();
    configurarCarrito();
    configurarChatbot();
});

// CARGAR Y MOSTRAR PRODUCTOS
function cargarProductos(filtros = {}) {
    const catalogGrid = document.getElementById('catalogGrid');
    catalogGrid.innerHTML = '';

    let productosFiltrados = productos;

    // Filtrar por categoría
    if (filtros.categoria) {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === filtros.categoria);
    }

    // Filtrar por precio
    if (filtros.precio) {
        productosFiltrados = productosFiltrados.filter(p => {
            if (filtros.precio === '0-500') return p.precio <= 500;
            if (filtros.precio === '500-1000') return p.precio >= 500 && p.precio <= 1000;
            if (filtros.precio === '1000+') return p.precio > 1000;
            return true;
        });
    }

    // Filtrar por búsqueda
    if (filtros.busqueda) {
        const termino = filtros.busqueda.toLowerCase();
        productosFiltrados = productosFiltrados.filter(p =>
            p.nombre.toLowerCase().includes(termino) ||
            p.descripcion.toLowerCase().includes(termino)
        );
    }

    if (productosFiltrados.length === 0) {
        catalogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No se encontraron productos.</p>';
        return;
    }

    productosFiltrados.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${producto.emoji}</div>
            <div class="product-content">
                <span class="product-category">${producto.categoria}</span>
                <h3 class="product-title">${producto.nombre}</h3>
                <p class="product-description">${producto.descripcion}</p>
                <div class="product-footer">
                    <div class="product-price">$${producto.precio.toFixed(2)}</div>
                    <button class="btn-add-cart" onclick="agregarAlCarrito(${producto.id})">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        catalogGrid.appendChild(card);
    });
}

// SISTEMA DE BÚSQUEDA
function configurarBuscador() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', realizarBusqueda);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            realizarBusqueda();
        }
    });
}

function realizarBusqueda() {
    const busqueda = document.getElementById('searchInput').value;
    const categoria = document.getElementById('categoryFilter').value;
    const precio = document.getElementById('priceFilter').value;

    cargarProductos({ busqueda, categoria, precio });
}

// SISTEMA DE FILTROS
function configurarFiltros() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    categoryFilter.addEventListener('change', aplicarFiltros);
    priceFilter.addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    const busqueda = document.getElementById('searchInput').value;
    const categoria = document.getElementById('categoryFilter').value;
    const precio = document.getElementById('priceFilter').value;

    cargarProductos({ busqueda, categoria, precio });
}

// CARRITO DE COMPRAS
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);

    if (!producto) return;

    const itemCarrito = carrito.find(item => item.id === productoId);

    if (itemCarrito) {
        itemCarrito.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    actualizarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito!`);
}

function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarrito();
}

function configurarCarrito() {
    document.getElementById('clearCartBtn').addEventListener('click', function() {
        if (carrito.length > 0 && confirm('¿Deseas vaciar el carrito?')) {
            carrito = [];
            actualizarCarrito();
        }
    });

    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const total = calcularTotal();
        alert(`Procederás al pago de $${total.toFixed(2)}. Esta es una demostración.`);
        carrito = [];
        actualizarCarrito();
    });
}

function actualizarCarrito() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    if (carrito.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        actualizarResumenCarrito();
        return;
    }

    carrito.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-name">${item.nombre} x${item.cantidad}</div>
            <div class="cart-item-price">$${(item.precio * item.cantidad).toFixed(2)}</div>
            <button class="btn-remove" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        `;
        cartItems.appendChild(itemDiv);
    });

    actualizarResumenCarrito();
}

function actualizarResumenCarrito() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const impuestos = subtotal * 0.10;
    const total = subtotal + impuestos;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxes').textContent = `$${impuestos.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function calcularTotal() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    return subtotal * 1.10;
}

function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #fdb913, #ffd700);
        color: #0d1b2a;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(253, 185, 19, 0.4);
        z-index: 999;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = mensaje;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// CHATBOT FLOTANTE
function configurarChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('close-chatbot');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    const respuestasBot = {
        'precio': 'Nuestros precios varían según el servicio. El más económico es de $600 y el más premium de $3500.',
        'servicios': 'Ofrecemos: Consultoría, Desarrollo Web, Diseño Gráfico, Aplicaciones Móvil, Marketing Digital y más.',
        'carrito': 'Puedes agregar productos al carrito haciendo clic en "Agregar al Carrito" en cada producto.',
        'pago': 'Aceptamos todos los métodos de pago. El pago se procesa de forma segura.',
        'envío': 'Los servicios digitales se entregan en línea. Consulta con nosotros para detalles específicos.',
        'duda': 'Estamos aquí para ayudarte. ¿Qué necesitas saber?',
        'hola': 'Hola! Bienvenido a nuestro catálogo. ¿En qué puedo ayudarte?',
        'default': 'Puedo ayudarte con: precios, servicios, carrito, pago, envío. ¿Qué deseas saber?'
    };

    chatbotToggle.addEventListener('click', function() {
        if (chatbotWindow.classList.contains('hidden')) {
            chatbotWindow.classList.remove('hidden');
            chatbotWindow.classList.add('visible');
        } else {
            chatbotWindow.classList.add('hidden');
            chatbotWindow.classList.remove('visible');
        }
    });

    closeBtn.addEventListener('click', function() {
        chatbotWindow.classList.add('hidden');
        chatbotWindow.classList.remove('visible');
    });

    function enviarMensaje() {
        const texto = userInput.value.trim();
        if (texto === '') return;

        agregarMensaje(texto, 'user-message');
        userInput.value = '';

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
}
