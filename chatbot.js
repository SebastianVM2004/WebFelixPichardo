(function() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('close-chatbot');
  const sendBtn = document.getElementById('send-btn');
  const userInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');

  if (!chatbotToggle || !chatbotWindow || !closeBtn || !sendBtn || !userInput || !chatMessages) return;

  const socialLinks = [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/felix-pichardo-meuly/' },
    { label: 'Poderato', url: 'https://poderato.com/fpichardo/de-todo-un-poco-psicologa-trabajo-liderazgo-vida/indicadores-claves-de-desempeo-kpi-s' },
    { label: 'Spotify', url: 'https://spotify.com/' }
  ];

  const intents = [
    {
      patterns: [/\b(hola|holi|buenas|buenos dias|buenas tardes|buenas noches|hey|que tal|saludos)\b/],
      response: '¡Hola! Soy el asistente virtual de Books Felix. Puedo ayudarte con horarios, precios, envíos y nuestros servicios. ¿Qué necesitas saber?'
    },
    {
      patterns: [/\b(gracias|muchas gracias|te agradezco|agradecido)\b/],
      response: '¡Con gusto! Estoy aquí para ayudarte con cualquier otra duda.'
    },
    {
      patterns: [/\b(horario|horarios|hora|abren|abierto|atienden|atencion|atender|cerrar|cierran|disponible)\b/, /a que hora|hasta que hora|cuando puedo visitar/],
      response: 'Nuestro horario de atención es de lunes a viernes, de 9:00 a 18:00 horas. Si necesitas una asesoría fuera de ese horario, escríbenos por nuestras redes.'
    },
    {
      patterns: [/\b(precio|precios|costo|costos|cuesta|cuestan|tarifa|tarifas|presupuesto|cotizacion|cotizar|valor)\b/, /cuanto vale|cuanto cuesta|que precio tiene/],
      response: 'Los precios dependen del servicio y el alcance. En el catálogo encontrarás opciones desde $600 hasta $3,500; para una propuesta personalizada, contáctanos directamente.'
    },
    {
      patterns: [/\b(envio|envios|enviar|envian|entrega|entregan|recibir|reciben|domicilio|delivery|paqueteria|tiempo de entrega)\b/, /llega a mi ciudad|mandan a/],
      response: 'Sí, coordinamos envíos según el producto y la ubicación. Para confirmar cobertura, costo y fecha de entrega, compártenos tu ciudad por nuestras redes.'
    },
    {
      patterns: [/\b(servicio|servicios|consultoria|consultoria|asesoria|asesorias|capacitacion|liderazgo|conferencia|conferencias|taller)\b/],
      response: 'Ofrecemos consultoría, desarrollo web, diseño, capacitación, liderazgo, conferencias y análisis de indicadores. Puedes explorar el catálogo o pedir una recomendación personalizada.'
    },
    {
      patterns: [/\b(contacto|contactar|contactarnos|telefono|correo|email|mensaje|ubicacion|direccion)\b/],
      response: 'Puedes escribirnos desde la sección Contacto o por nuestras redes sociales. Allí podremos orientarte de forma directa sobre tu caso.'
    },
    {
      patterns: [/\b(ayuda|ayudar|puedes hacer|que haces|informacion)\b/],
      response: 'Puedo orientarte sobre horarios, precios, envíos, servicios y formas de contacto. También puedes visitar el catálogo para ver las opciones disponibles.'
    }
  ];

  function normalize(text) {
    return text
      .toLocaleLowerCase('es')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function obtenerRespuesta(input) {
    const normalizedInput = normalize(input);
    const intent = intents.find(item => item.patterns.some(pattern => pattern.test(normalizedInput)));

    if (intent) return { text: intent.response };

    return {
      text: 'No tengo una respuesta precisa para esa consulta todavía. Puedes encontrar orientación directa en nuestras redes:',
      links: socialLinks
    };
  }

  function agregarMensaje(message, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;

    const text = typeof message === 'string' ? message : message.text;
    messageDiv.appendChild(document.createTextNode(text));

    if (message.links) {
      const links = document.createElement('div');
      links.className = 'chatbot-social-links';
      message.links.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.label;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        links.appendChild(anchor);
      });
      messageDiv.appendChild(links);
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function mostrarBienvenida() {
    chatMessages.innerHTML = '';
    agregarMensaje('¡Hola! Soy el asistente virtual de Books Felix. Pregúntame por horarios, precios, envíos o servicios.', 'bot-message');
  }

  chatbotToggle.addEventListener('click', function(event) {
    event.preventDefault();
    const isHidden = chatbotWindow.classList.contains('hidden');
    if (isHidden) mostrarBienvenida();
    chatbotWindow.classList.toggle('hidden', !isHidden);
    chatbotWindow.classList.toggle('visible', isHidden);
  });

  closeBtn.addEventListener('click', function() {
    chatbotWindow.classList.add('hidden');
    chatbotWindow.classList.remove('visible');
  });

  function enviarMensaje() {
    const text = userInput.value.trim();
    if (!text) return;

    agregarMensaje(text, 'user-message');
    userInput.value = '';

    window.setTimeout(() => agregarMensaje(obtenerRespuesta(text), 'bot-message'), 350);
  }

  sendBtn.addEventListener('click', enviarMensaje);
  userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') enviarMensaje();
  });
})();