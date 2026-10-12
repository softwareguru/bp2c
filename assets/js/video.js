/* Vídeo con patrón fachada. En reposo la tarjeta es una imagen y un botón:
   cero peticiones al proveedor. Al pulsar, entra el reproductor y arranca.
   Los subtítulos van activados; nada se reproduce solo. */
(function () {
  document.querySelectorAll('[data-video]').forEach(function (caja) {
    var boton = caja.querySelector('[data-video-play]');
    if (!boton) return;

    boton.addEventListener('click', function () {
      var yt = caja.dataset.youtube;
      var src = caja.dataset.src;
      var pista = caja.dataset.track;
      var reproductor;

      if (yt) {
        reproductor = document.createElement('iframe');
        reproductor.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt) +
          '?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=es';
        reproductor.title = caja.dataset.titulo || 'Testimonio en vídeo';
        reproductor.allow = 'accelerometer; clipboard-write; encrypted-media; picture-in-picture';
        reproductor.allowFullscreen = true;
      } else if (src) {
        reproductor = document.createElement('video');
        reproductor.src = src;
        reproductor.controls = true;
        reproductor.autoplay = true;
        reproductor.playsInline = true;
        if (pista) {
          var track = document.createElement('track');
          track.kind = 'captions';
          track.src = pista;
          track.srclang = 'es';
          track.label = 'Español';
          track.default = true;
          reproductor.appendChild(track);
        }
      } else {
        return;
      }

      caja.innerHTML = '';
      caja.appendChild(reproductor);
      reproductor.focus({ preventScroll: true });
    });
  });
})();
