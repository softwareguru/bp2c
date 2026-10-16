---
title: "Organizaciones acreditadas"
description: "Las organizaciones cuyas personas de tecnología calificaron su entorno de trabajo por encima del criterio. Conoce sus perfiles, sus vacantes y sus testimonios."
tags: ["index"]

# El diseño de esta página vive en layouts/companies/list.es.html (artboard
# «Acreditadas»). De aquí toma la copia del hero y la del CTA; el directorio y
# los testimonios los arma de las fichas y de data/bp2c/testimonios.yaml.
# `sin_cta` evita que el pie añada una segunda banda: la del artboard ya va
# dentro de la página. El bloque `testimonios` se queda declarado porque es lo
# que hace que el pie cargue la fachada de vídeo.
sin_cta: true
aliases:
  - /testimonios/
cta:
  titulo: "¿Quieres que tu organización esté en esta lista?"
  texto: "Empieza por preguntarle a tu equipo. El resto depende de lo que responda."
  boton:
    texto: "Evalúa a tu organización"
    url: "/contacto/?interes=evaluar"
blocks:
  - type: hero
    kicker: "Directorio"
    h1: "Organizaciones acreditadas"
    subtitulo: "Las personas de tecnología de estas organizaciones calificaron su entorno de trabajo en anónimo, y esa calificación pasó el criterio: 85 % de promedio y ninguna pregunta por debajo de 75 %."
    nota: "Las acreditaciones del ciclo 2025-2026 se otorgaron como Best Place to Code. El Listado 2027 se publica el 4 de febrero de 2027."
    foto: "fotos/organizaciones.jpg"
    palabra: "Equipos."
    botones:
      - texto: "Escucha a tres de ellas"
        url: "#testimonios"
        variant: "outline"

  - type: directorio

  - type: testimonios
    ancla: "testimonios"
---
