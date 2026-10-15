// Refresca el contador de la portada. El HTML ya trae el número calculado al
// construir el sitio; esto solo lo corrige si la página se sirve días después.
(function () {
  var el = document.querySelector('[data-cuenta-regresiva]');
  if (!el) return;
  var partes = el.getAttribute('data-cuenta-regresiva').split('-');
  var limite = Date.UTC(+partes[0], +partes[1] - 1, +partes[2]);
  var dias = Math.max(0, Math.ceil((limite - Date.now()) / 86400000));
  el.textContent = String(dias);
})();
