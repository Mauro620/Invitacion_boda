export const wedding = {
  couple: { partnerA: "TODO:Nombre A", partnerB: "TODO:Nombre B", hashtag: "#TODO" },
  date: { iso: "2027-01-01T16:00:00-05:00", timezone: "America/Bogota", text: "TODO: fecha en texto" }, // TODO: real date
  quote: "Y de pronto, todo tuvo sentido.",
  envelope: {
    line: "Una carta escrita a mano, solo para ti.",
    hint: "Toca el sello para abrirla",
  },
  hero: {
    tagline: "Hay días que se esperan toda la vida. Este es uno, y quisimos que lo vivieras con nosotros.",
    scroll: "Sigue bajando, aún hay más por contarte",
  },
  intro: {
    lines: [
      "Hay amores que llegan con ruido.",
      "El nuestro llegó como llega la luz por la mañana:",
      "despacio, sin pedir permiso, y lo cambió todo.",
      "Hoy queremos celebrarlo con las personas que nos enseñaron a querer.",
    ],
  },
  story: [
    {
      year: "TODO",
      title: "Cómo nos conocimos",
      text: "Nadie lo planeó. Una conversación que debía durar cinco minutos se alargó hasta que se apagaron las luces, y desde esa noche supimos que algo había empezado.",
      photo: "/photos/story-1.svg",
    },
    {
      year: "TODO",
      title: "La primera vez que dijimos nosotros",
      text: "Sin darnos cuenta, los planes empezaron a conjugarse en plural. Un café se volvió costumbre, y la costumbre se volvió hogar.",
      photo: "/photos/story-2.svg",
    },
    {
      year: "TODO",
      title: "Aprendimos a viajar juntos",
      text: "Nos perdimos en caminos que no estaban en el mapa y descubrimos que, a tu lado, perderse también es una forma de llegar.",
      photo: "/photos/story-3.svg",
    },
    {
      year: "TODO",
      title: "La pregunta",
      text: "Hubo nervios, risas y lágrimas que nadie pidió. Y una sola respuesta, la más fácil que hemos dado en la vida: sí.",
      photo: "/photos/story-4.svg",
    },
  ],
  personalMessage: {
    greeting: "Querido(a)",
    fallback:
      "Eres parte de las historias que nos trajeron hasta aquí. Por eso este día no estaría completo sin ti, sin tu risa y sin tu abrazo. Gracias por estar, siempre.",
    signature: "Con todo nuestro cariño",
  },
  date_section: {
    title: "Guarda este día en el corazón",
    countdownLabel: "Faltan para abrazarnos",
    calendarButton: "Agregar al calendario",
  },
  events: [
    {
      kind: "ceremonia",
      name: "TODO:Lugar",
      address: "TODO",
      time: "16:00",
      mapsUrl: "TODO",
      blurb: "Aquí nos prometeremos el para siempre, con la luz de la tarde como testigo.",
    },
    {
      kind: "recepcion",
      name: "TODO:Lugar",
      address: "TODO",
      time: "18:00",
      mapsUrl: "TODO",
      blurb: "Después, la mesa larga, la música y las ganas de quedarnos hasta tarde contigo.",
    },
  ],
  eventsUi: { directions: "Cómo llegar" },
  itinerary: [
    { time: "16:00", label: "Ceremonia", note: "Llega unos minutos antes para acomodarte con calma.", icon: "rings" },
    { time: "17:30", label: "Cóctel", note: "Un brindis para empezar a celebrar.", icon: "glass" },
    { time: "19:00", label: "Cena", note: "Una mesa pensada para compartir.", icon: "plate" },
    { time: "21:00", label: "Baile", note: "Trae tus mejores pasos y tus ganas de reír.", icon: "dance" },
  ],
  dressCode: {
    label: "Formal / Etiqueta",
    palette: ["#7A8B6F", "#B89A5E", "#C9A18B", "#4A3F35"],
    avoid: ["blanco", "marfil", "crema"],
    notes:
      "Queremos verte elegante y cómodo(a). Los tonos tierra y verdes suaves acompañan muy bien el paisaje. El blanco y el marfil los guardamos para la novia.",
  },
  gifts: {
    mode: "lluvia-de-sobres",
    title: "Tu presencia es nuestro mejor regalo",
    text: "Tenerte ahí ya es más de lo que soñamos. Si quieres tener un detalle con nosotros, preparamos una lluvia de sobres que nos ayudará a empezar esta nueva vida. Sin compromiso, con todo el cariño.",
    bank: null,
    revealButton: "Ver datos para el detalle",
    copyButton: "Copiar número",
  },
  recommendations: {
    lodging: "Te sugerimos reservar con tiempo. TODO: hoteles cercanos y códigos de descuento.",
    transport: "Habrá espacio para parquear. Si vas a brindar con nosotros, coordina un conductor o un taxi de regreso. TODO: transporte de cortesía.",
    adultsOnly: "Será una celebración solo para adultos. Gracias por entender que queremos cuidar cada detalle.",
    weather: "A esa hora suele refrescar. Trae un abrigo ligero para la noche.",
  },
  rsvp: {
    title: "¿Nos acompañas?",
    intro: "Cuéntanos quiénes vendrán. Solo te tomará un minuto.",
    attending: "Asistiré",
    notAttending: "No podré asistir",
    dietaryLabel: "¿Alguna restricción alimentaria?",
    dietaryPlaceholder: "Alergias, vegetariano, sin gluten...",
    messageLabel: "Un mensaje para los novios (opcional)",
    messagePlaceholder: "Escríbenos lo que quieras, lo leeremos con cariño.",
    deadlineLabel: "Responde antes del",
    submit: "Enviar mi respuesta",
    edit: "Cambiar mi respuesta",
    error: "No pudimos guardar tu respuesta. Revisa tu conexión e inténtalo de nuevo.",
    errorChoose: "Elige una opción para cada persona antes de enviar.",
    success: "Gracias, recibimos tu respuesta.",
  },
  closing: {
    attending: {
      title: "Te esperamos",
      text: "Gracias por decir que sí. Ahora solo falta que llegue el día, y que lo vivamos juntos.",
    },
    notAttending: {
      title: "Te llevaremos en el corazón",
      text: "Sentimos que no puedas acompañarnos, pero sabemos que estarás presente de otra forma. Gracias por querernos así.",
    },
    final: "Porque el amor, cuando se comparte, se hace más grande.",
  },
  rsvpDeadline: "TODO",
  music: { src: "/audio/placeholder.mp3", title: "TODO" },
  gallery: [
    "/photos/g-1.svg",
    "/photos/g-2.svg",
    "/photos/g-3.svg",
    "/photos/g-4.svg",
    "/photos/g-5.svg",
    "/photos/g-6.svg",
  ],
} as const;

export type Wedding = typeof wedding;
