/* Recibe el formulario de /contacto/ y lo deja en dos lados: Pipedrive y el
   Google Form que ya existia. Google es el respaldo mientras Pipedrive se
   prueba; cuando este confiable se quita la constante GOOGLE_FORM y esta
   funcion deja de escribirle, sin tocar nada mas.

   El token de Pipedrive vive en las variables de entorno de Netlify
   (PIPEDRIVE_API_TOKEN). Nunca en el repo ni en el html: la API de Pipedrive
   no se puede llamar desde el navegador porque el token quedaria a la vista.

   Que crea en Pipedrive, en este orden:
     1 · la organizacion, si no existe ya una con ese nombre
     2 · la persona, si no existe ya una con ese correo, ligada a la anterior
     3 · un lead en la bandeja de prospectos, ligado a las dos
     4 · una nota en el lead con lo que no cabe en campos estandar

   El puesto y el origen van a dos campos que ya existen en la cuenta, no a
   campos nuevos: «Title» y «Lead Source» de persona. Sus claves son las de
   CAMPOS_PERSONA; se pueden cambiar por variable de entorno si algun dia se
   renombran.

   El tamano del equipo de tecnologia se queda en la nota a proposito. La
   organizacion tiene un campo «Tamaño», pero mide la empresa entera —Micro,
   Pequena, Mediana, Multinacional— y aqui se pregunta por el equipo de
   tecnologia, que es otra cosa: una multinacional puede tener ocho personas
   en tech. Meterlo ahi seria guardar un dato falso. */

const API = "https://api.pipedrive.com";

const GOOGLE_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLScCNhhaFvAefpe0NUETnA-h9QUNC_wdPW-9RfVhISd3p7YxeQ/formResponse";

// Las mismas claves que ya usaba el formulario al postear a Google.
const CAMPOS_GOOGLE = {
  interes: "entry.2043203638",
  nombre: "entry.1703096167",
  correo: "entry.1574457905",
  organizacion: "entry.770527947",
  puesto: "entry.754306744",
  tamano: "entry.733970373",
  comentarios: "entry.783181383",
};

/* Campos personalizados de persona que ya existian en la cuenta. No son
   secretos, solo identificadores, por eso van aqui y no en el entorno; la
   variable queda por si algun dia cambian. */
const CAMPOS_PERSONA = {
  puesto: process.env.PIPEDRIVE_CAMPO_PUESTO
    || "c7cc1bf0316c9846ab8980112936433aa45ba18a",   // «Title»
  origen: process.env.PIPEDRIVE_CAMPO_ORIGEN
    || "e42eafcdab9ed10dfd623122e77481a571ea35b4",   // «Lead Source»
};

const ORIGEN = "Best Place to Create · formulario de contacto";

const token = () => process.env.PIPEDRIVE_API_TOKEN;

async function pipedrive(ruta, opciones = {}) {
  const r = await fetch(`${API}${ruta}`, {
    ...opciones,
    headers: {
      "x-api-token": token(),
      "content-type": "application/json",
      ...(opciones.headers || {}),
    },
  });
  const cuerpo = await r.json().catch(() => ({}));
  if (!r.ok || cuerpo.success === false) {
    const detalle = cuerpo.error || cuerpo.message || `HTTP ${r.status}`;
    throw new Error(`Pipedrive ${ruta}: ${detalle}`);
  }
  return cuerpo.data;
}

/* Busca antes de crear para no llenar la cuenta de duplicados: la misma
   persona puede escribir dos veces, y varias personas pueden escribir desde
   la misma organizacion. */
async function buscar(tipo, termino, campos) {
  if (!termino) return null;
  const q = new URLSearchParams({
    term: termino,
    fields: campos,
    exact_match: "true",
    limit: "1",
  });
  const data = await pipedrive(`/v1/${tipo}/search?${q}`);
  return data?.items?.[0]?.item?.id ?? null;
}

async function enviarAPipedrive(d) {
  let organizacionId = null;
  if (d.organizacion) {
    organizacionId =
      (await buscar("organizations", d.organizacion, "name")) ??
      (await pipedrive("/v1/organizations", {
        method: "POST",
        body: JSON.stringify({ name: d.organizacion }),
      })).id;
  }

  const datosPersona = {
    ...(organizacionId ? { org_id: organizacionId } : {}),
    ...(d.puesto ? { [CAMPOS_PERSONA.puesto]: d.puesto } : {}),
    [CAMPOS_PERSONA.origen]: ORIGEN,
  };

  let personaId = await buscar("persons", d.correo, "email");
  if (personaId) {
    // Ya existia: se le completa lo que trae el formulario, sin pisar nombre
    // ni correo, que es lo que la identifica.
    await pipedrive(`/v1/persons/${personaId}`, {
      method: "PUT",
      body: JSON.stringify(datosPersona),
    });
  } else {
    personaId = (await pipedrive("/v1/persons", {
      method: "POST",
      body: JSON.stringify({
        name: d.nombre,
        email: [{ value: d.correo, primary: true, label: "work" }],
        ...datosPersona,
      }),
    })).id;
  }

  const lead = await pipedrive("/v1/leads", {
    method: "POST",
    body: JSON.stringify({
      title: `${d.organizacion || d.nombre} · ${d.interes}`,
      person_id: personaId,
      ...(organizacionId ? { organization_id: organizacionId } : {}),
    }),
  });

  // Lo que no cabe en campos estandar va aqui, para que no se pierda.
  const nota = [
    `Formulario de ${d.origen || "/contacto/"}`,
    `Interés: ${d.interes}`,
    d.puesto && `Puesto: ${d.puesto}`,
    d.tamano && `Tamaño del equipo de tecnología: ${d.tamano}`,
    d.comentarios && `\nComentarios:\n${d.comentarios}`,
  ]
    .filter(Boolean)
    .join("\n");

  await pipedrive("/v1/notes", {
    method: "POST",
    body: JSON.stringify({ lead_id: lead.id, content: nota.replace(/\n/g, "<br>") }),
  });

  return lead.id;
}

async function enviarAGoogle(d) {
  const cuerpo = new URLSearchParams();
  for (const [clave, entry] of Object.entries(CAMPOS_GOOGLE)) {
    if (d[clave]) cuerpo.set(entry, d[clave]);
  }
  const r = await fetch(GOOGLE_FORM, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: cuerpo,
  });
  // Google responde 200 con su propia pagina de gracias.
  if (!r.ok) throw new Error(`Google Forms: HTTP ${r.status}`);
}

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let d;
  try {
    const tipo = request.headers.get("content-type") || "";
    d = tipo.includes("application/json")
      ? await request.json()
      : Object.fromEntries(new URLSearchParams(await request.text()));
  } catch {
    return Response.json({ ok: false, error: "cuerpo ilegible" }, { status: 400 });
  }

  // El campo trampa del formulario: si viene lleno es un bot. Se responde que
  // si para no darle pistas, pero no se escribe nada en ningun lado.
  if (d.website) return Response.json({ ok: true });

  for (const requerido of ["nombre", "correo", "organizacion", "interes"]) {
    if (!d[requerido]?.trim()) {
      return Response.json(
        { ok: false, error: `falta ${requerido}` },
        { status: 400 }
      );
    }
  }

  /* Los dos destinos van en paralelo y por separado a proposito: que
     Pipedrive falle no debe costar el dato, que para eso sigue el respaldo.
     Se responde que si cuando al menos uno guardo. */
  const [pd, google] = await Promise.allSettled([
    token() ? enviarAPipedrive(d) : Promise.reject(new Error("sin PIPEDRIVE_API_TOKEN")),
    GOOGLE_FORM ? enviarAGoogle(d) : Promise.resolve(null),
  ]);

  if (pd.status === "rejected") console.error("[contacto] Pipedrive:", pd.reason?.message);
  if (google.status === "rejected") console.error("[contacto] Google:", google.reason?.message);

  const guardado = pd.status === "fulfilled" || google.status === "fulfilled";
  if (!guardado) {
    return Response.json({ ok: false, error: "no se pudo guardar" }, { status: 502 });
  }

  return Response.json({
    ok: true,
    pipedrive: pd.status === "fulfilled" ? pd.value : null,
  });
};

export const config = { path: "/api/contacto" };
