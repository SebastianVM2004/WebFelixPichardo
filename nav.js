// Genera una navegación Bootstrap responsive mostrando sólo las otras páginas.
(function() {
  const pages = [
    { name: 'Inicio', file: 'index.html' },
    { name: 'Catálogo', file: 'catalogo.html' },
    { name: 'Conferencias', file: 'conferencias.html' },
    { name: 'Contacto', file: 'contacto.html' },
    { name: 'Artículos', file: 'articles.html' }
  ];

  const originalList = document.getElementById('opcionesindex');
  if (!originalList) return;

  // determinar archivo actual
  let path = window.location.pathname;
  let current = path.substring(path.lastIndexOf('/') + 1);
  if (!current) current = 'index.html';

  const navigation = document.createElement('nav');
  navigation.className = 'navbar navbar-expand-lg site-navbar';
  navigation.setAttribute('aria-label', 'Navegación principal');

  const navigationContainer = document.createElement('div');
  navigationContainer.className = 'container-fluid px-0';

  const toggle = document.createElement('button');
  toggle.className = 'navbar-toggler';
  toggle.type = 'button';
  toggle.setAttribute('data-bs-toggle', 'collapse');
  toggle.setAttribute('data-bs-target', '#mainNavigation');
  toggle.setAttribute('aria-controls', 'mainNavigation');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Mostrar navegación');
  toggle.innerHTML = '<span class="navbar-toggler-icon"></span>';

  const navigationMenu = document.createElement('div');
  navigationMenu.className = 'collapse navbar-collapse justify-content-center';
  navigationMenu.id = 'mainNavigation';

  const ul = document.createElement('ul');
  ul.id = 'opcionesindex';
  ul.className = 'navbar-nav gap-lg-2';

  // Generar elementos para las páginas distintas a la actual.
  pages.forEach(p => {
    if (p.file === current) return; // omitir link a la misma página
    const li = document.createElement('li');
    li.className = 'nav-item';
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = p.file;
    a.textContent = p.name;
    li.appendChild(a);
    ul.appendChild(li);
  });

  navigationMenu.appendChild(ul);
  navigationContainer.append(toggle, navigationMenu);
  navigation.appendChild(navigationContainer);
  originalList.replaceWith(navigation);
})();
