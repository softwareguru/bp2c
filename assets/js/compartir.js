/* Recomendar la página: copiar el mensaje y compartirlo. Dispara el evento
   GA4 compartir_pagina con el medio. El botón de copiar solo tiene sentido
   con JavaScript, así que el marcado lo deja oculto hasta que esto corre. */
(function () {
  function evento(medio) {
    if (typeof gtag === 'function') { gtag('event', 'compartir_pagina', { medio: medio }); }
  }

  var boton = document.querySelector('[data-copiar]');
  if (boton && navigator.clipboard) {
    boton.hidden = false;
    boton.addEventListener('click', function () {
      navigator.clipboard.writeText(boton.dataset.copiar).then(function () {
        var antes = boton.textContent;
        boton.textContent = 'Mensaje copiado';
        setTimeout(function () { boton.textContent = antes; }, 2400);
        evento('copiar');
      });
    });
  }

  document.querySelectorAll('[data-compartir]').forEach(function (a) {
    a.addEventListener('click', function () { evento(a.dataset.compartir); });
  });
})();
