/* Formulario: resumen de errores al enviar.
   La validación nativa del navegador sigue funcionando sin este archivo;
   esto añade un resumen enlazado al principio, que es lo que necesita quien
   usa lector de pantalla o no ve el campo que falló. */
(function () {
  var form = document.querySelector('[data-form]');
  if (!form) return;
  var resumen = form.querySelector('[data-form-errores]');
  if (!resumen) return;

  form.setAttribute('novalidate', '');

  form.addEventListener('submit', function (e) {
    var malos = Array.prototype.filter.call(form.elements, function (el) {
      return el.willValidate && !el.checkValidity();
    });

    if (!malos.length) { resumen.hidden = true; return; }

    e.preventDefault();

    var lista = malos.map(function (el) {
      var etiqueta = form.querySelector('label[for="' + el.id + '"]');
      var nombre = etiqueta ? etiqueta.textContent.replace(/\(requerido\)/i, '').trim() : el.name;
      el.setAttribute('aria-invalid', 'true');
      return '<li><a href="#' + el.id + '">' + nombre + ': ' + (el.validationMessage || 'revisa este campo') + '</a></li>';
    }).join('');

    resumen.innerHTML = '<h2>Revisa ' + (malos.length === 1 ? 'un campo' : malos.length + ' campos') +
      ' antes de enviar</h2><ul>' + lista + '</ul>';
    resumen.hidden = false;
    resumen.focus();
  });

  /* Al corregir, el campo deja de estar marcado como inválido. */
  form.addEventListener('input', function (e) {
    if (e.target.getAttribute('aria-invalid') && e.target.checkValidity()) {
      e.target.removeAttribute('aria-invalid');
    }
  });
})();
