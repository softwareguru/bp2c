---
title: "Recibimos tus datos"
type: bp2c
description: "Recibimos tus datos. Nuestro equipo te contacta pronto."
noindex: true
sin_cta: true
blocks:
  - type: hero
    h1: "Listo, recibimos tus datos"
    subtitulo: "Nos pondremos en contacto contigo a la brevedad. Mientras, esto te puede servir:"

  - type: enlaces
    enlaces:
      - kicker: "Directorio"
        texto: "Mira quién ya se acreditó"
        url: "/companies/"
      - kicker: "Para organizaciones"
        texto: "Revisa qué preguntamos y cuál es el criterio"
        url: "/para-organizaciones/"
      - kicker: "Blog"
        texto: "Lee el blog"
        url: "/blog/"

# La cuarta tarjeta del diseño. Sin `url` no se publica: en cuanto exista la
# liga de agenda, se pega aquí y aparece sola.
agenda:
  kicker: "Agenda"
  texto: "Agenda una llamada con nuestro equipo"
  url: ""
---

<script>
/* generate_lead. Los pixeles de LinkedIn, Meta y TikTok quedan apagados
   hasta tener los IDs (D6) y el aviso de privacidad actualizado (D9). */
if (typeof gtag === 'function') { gtag('event', 'generate_lead', { metodo: 'formulario_contacto' }); }
</script>
