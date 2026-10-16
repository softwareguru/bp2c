/* Navegación: menú de móvil y grupos desplegables.
   Mejora progresiva. Sin este archivo, los paneles quedan abiertos y todos
   los enlaces siguen siendo alcanzables; el script solo los colapsa. */
(function () {
  var nav = document.querySelector('[data-nav]');
  if (!nav) return;

  var burger = nav.querySelector('[data-nav-burger]');
  var menu = nav.querySelector('[data-nav-menu]');
  var toggles = Array.prototype.slice.call(nav.querySelectorAll('[data-nav-toggle]'));

  function cerrarGrupos(excepto) {
    toggles.forEach(function (t) {
      if (t !== excepto) { t.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* Al tomar el control, el script colapsa lo que el HTML dejó abierto. */
  nav.setAttribute('data-nav', 'ready');
  cerrarGrupos();
  if (burger) { burger.setAttribute('aria-expanded', 'false'); }

  toggles.forEach(function (t) {
    t.addEventListener('click', function () {
      var abierto = t.getAttribute('aria-expanded') === 'true';
      cerrarGrupos(t);
      t.setAttribute('aria-expanded', abierto ? 'false' : 'true');
    });
  });

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var abierto = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', abierto ? 'false' : 'true');
      if (abierto) { cerrarGrupos(); }
    });
  }

  /* Escape cierra y devuelve el foco al control que abrió. */
  nav.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var abierto = toggles.filter(function (t) { return t.getAttribute('aria-expanded') === 'true'; })[0];
    if (abierto) { cerrarGrupos(); abierto.focus(); return; }
    if (burger && burger.getAttribute('aria-expanded') === 'true') {
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  });

  /* Un clic fuera cierra los grupos, sin encerrar a nadie. */
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) { cerrarGrupos(); }
  });
})();
