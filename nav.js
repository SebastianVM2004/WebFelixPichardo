// nav.js — genera la barra de navegación mostrando sólo las otras páginas
(function() {
  const pages = [
    { name: 'Inicio', file: 'index.html' },
    { name: 'Catálogo', file: 'catalogo.html' },
    { name: 'Conferencias', file: 'conferencias.html' },
    { name: 'Contacto', file: 'contacto.html' },
    { name: 'Artículos', file: 'articles.html' }
  ];

  const ul = document.getElementById('opcionesindex');
  if (!ul) return;

  // determinar archivo actual
  let path = window.location.pathname;
  let current = path.substring(path.lastIndexOf('/') + 1);
  if (!current) current = 'index.html';

  // generar elementos para las páginas distintas a la actual
  ul.innerHTML = '';
  pages.forEach(p => {
    if (p.file === current) return; // omitir link a la misma página
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = p.file;
    a.textContent = p.name;
    li.appendChild(a);
    ul.appendChild(li);
  });
})();
