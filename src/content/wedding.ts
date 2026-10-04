export const wedding = {
  couple: { partnerA: "TODO:Nombre A", partnerB: "TODO:Nombre B", hashtag: "#TODO" },
  date: { iso: "2027-01-01T16:00:00-05:00", timezone: "America/Bogota" }, // TODO: real date
  quote: "Y de pronto, todo tuvo sentido.",
  story: [
    { year: "TODO", title: "Cómo nos conocimos", text: "…", photo: "/photos/story-1.svg" },
  ],
  events: [
    { kind: "ceremonia", name: "TODO:Lugar", address: "TODO", time: "16:00", mapsUrl: "TODO" },
    { kind: "recepcion", name: "TODO:Lugar", address: "TODO", time: "18:00", mapsUrl: "TODO" },
  ],
  itinerary: [
    { time: "16:00", label: "Ceremonia" },
    { time: "17:30", label: "Cóctel" },
  ],
  dressCode: { label: "Formal / Etiqueta", palette: ["#000000"], avoid: ["blanco", "marfil"], notes: "…" },
  gifts: { mode: "lluvia-de-sobres", text: "…", bank: null },
  rsvpDeadline: "TODO",
  music: { src: "/audio/placeholder.mp3", title: "TODO" },
  gallery: ["/photos/g-1.svg"],
} as const;
