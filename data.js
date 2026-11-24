// CONFIG — Jardín Sur (demo Vigolo Web Studio)
// Todo lo que cambia de un comercio a otro vive acá.
// "// PENDIENTE CLIENTE" = dato de ejemplo o a confirmar con el dueño.

const CONFIG = {
  negocio: {
    nombre: "Jardín Sur",
    rubro: "Fábrica de parrillas",
    localidad: "Turdera",
    eslogan: "Fábrica de parrillas, fogoneros y hogares en Turdera. Más de 30 años en el rubro, showroom a la calle y hasta 18 cuotas.",
    logo: "img/logo.svg",
    anios: "30",
  },

  colores: {
    primario: "#FF6B1A",   // naranja fuego
    madera: "#E8892B",     // naranja madera (las tablas de las parrillas)
    fondo: "#0A0A0B",
    texto: "#F3F1EE",
  },

  contacto: {
    whatsapp: "5491155014260", // 549 + área + número, sin + ni espacios
    mensajeWhatsapp: "¡Hola Jardín Sur! Vi su web y quería consultar...",
    telefono: "+54 9 11 5501-4260",
    instagram: "https://instagram.com/jardinsur3499",
    instagramUsuario: "@jardinsur3499",
    direccion: "Av. Frías 3684, Turdera, Buenos Aires",
    referencia: "Entre Patricios y Magallanes",
    mapsEmbed: "https://www.google.com/maps?q=Av.+Fr%C3%ADas+3684,+Turdera,+Buenos+Aires&output=embed",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Av.+Fr%C3%ADas+3684,+Turdera,+Buenos+Aires",
  },

  // 0 = domingo ... 6 = sábado. Varios turnos por día permitidos.
  // PENDIENTE CLIENTE: horarios tomados de una historia de Instagram de dic 2023, confirmar.
  horarios: {
    0: [],
    1: [["09:30", "12:00"], ["15:30", "18:30"]],
    2: [["09:30", "12:00"], ["15:30", "18:30"]],
    3: [["09:30", "12:00"], ["15:30", "18:30"]],
    4: [["09:30", "12:00"], ["15:30", "18:30"]],
    5: [["09:30", "12:00"], ["15:30", "18:30"]],
    6: [["09:30", "13:30"]],
  },

  // Cifras públicas del perfil de Instagram (nov 2026). "valor" es el número que anima el contador.
  stats: [
    { valor: 30, prefijo: "+", sufijo: "", etiqueta: "años en el rubro" },
    { valor: 20, prefijo: "", sufijo: " mil", etiqueta: "seguidores en Instagram" },
    { valor: 303, prefijo: "", sufijo: " mil", etiqueta: "reproducciones en un solo video" },
    { valor: 18, prefijo: "hasta ", sufijo: "", etiqueta: "cuotas para llevártela" },
  ],

  // Financiación. factor = multiplicador sobre el precio de contado.
  // Sale de la oferta publicada en Instagram: $385.000 contado → 3 cuotas $440.000, 6 $480.000, 12 $580.000, 18 $680.000.
  // PENDIENTE CLIENTE: confirmar planes y recargos vigentes.
  financiacion: {
    contado: "Efectivo o transferencia",
    planes: [
      { cuotas: 3, factor: 1.1429 },
      { cuotas: 6, factor: 1.2468 },
      { cuotas: 12, factor: 1.5065 },
      { cuotas: 18, factor: 1.7662 },
    ],
  },

  categorias: ["Parrillas", "Fogoneros", "Hogares y herrajes"],

  // PENDIENTE CLIENTE: solo el precio de Pantera Negra sale de una oferta real; el resto son precios de ejemplo.
  // precio: null => muestra "Consultá el precio".
  productos: [
    {
      id: "pantera-negra",
      categoria: "Parrillas",
      nombre: "Pantera Negra",
      subtitulo: "Parrilla con tapa, madera y ruedas",
      descripcion: "Hierro negro, tapa con manija de madera, estantes de madera a los costados y abajo, piso de ladrillo refractario y ruedas para moverla donde quieras.",
      precio: 385000,
      etiqueta: "Oferta",
      fotos: ["img/pantera-negra-1.webp", "img/pantera-negra-2.webp"],
      caracteristicas: ["Tapa abatible", "Fogonero lateral", "Tablas de madera", "Ladrillo refractario", "Con ruedas"],
    },
    {
      id: "eco",
      categoria: "Parrillas",
      nombre: "Modelo ECO",
      subtitulo: "Parrilla negra mate con tapa",
      descripcion: "Nuestro modelo más prolijo y práctico: terminación negra mate, tapa abatible, fogonero lateral para hacer brasas y estante inferior.",
      precio: 295000,
      etiqueta: "",
      fotos: ["img/eco-fuego.webp", "img/eco-1.webp", "img/eco-2.webp"],
      caracteristicas: ["Negro mate", "Tapa abatible", "Fogonero lateral", "Ladrillo refractario", "Con ruedas"],
    },
    {
      id: "topo-grande",
      categoria: "Parrillas",
      nombre: "Topo Grande",
      subtitulo: "Tapa tipo topo, para asados grandes",
      descripcion: "Tapa tipo topo con manija de madera, fogonero a un costado, tabla lateral y base con piso refractario. Pensada para cocinar para toda la familia.",
      precio: 420000,
      etiqueta: "",
      fotos: ["img/topo-grande.webp"],
      caracteristicas: ["Tapa tipo topo", "Fogonero lateral", "Tabla lateral", "Ladrillo refractario", "Con ruedas"],
    },
    {
      id: "topo-chica",
      categoria: "Parrillas",
      nombre: "Topo Chica",
      subtitulo: "El topo para espacios más chicos",
      descripcion: "La misma idea que el Topo Grande en un tamaño más compacto: ideal para patios y balcones sin resignar terminación.",
      precio: 330000,
      etiqueta: "",
      fotos: ["img/topo-chica.webp"],
      caracteristicas: ["Tapa tipo topo", "Fogonero lateral", "Tabla lateral", "Ladrillo refractario", "Con ruedas"],
    },
    {
      id: "fogonero-guru",
      categoria: "Fogoneros",
      nombre: "Fogonero Guru",
      subtitulo: "Fogonero circular con parrilla y plancha",
      descripcion: "Fogonero circular sobre tres patas con parrilla abatible, plancha de cocción y parrilla redonda. Para juntarse alrededor del fuego.",
      precio: 450000,
      etiqueta: "Nuevo",
      fotos: ["img/guru-2.webp", "img/guru-1.webp"],
      caracteristicas: ["Circular", "Parrilla abatible", "Plancha de cocción", "Parrilla redonda", "Tres patas"],
    },
    {
      id: "parrilla-hogar-a-medida",
      categoria: "Hogares y herrajes",
      nombre: "Parrilla para hogar a medida",
      subtitulo: "Herraje con cadenas y manivela",
      descripcion: "Parrilla de varillas para hogar, hecha a la medida de tu quincho, con cadenas y manivela para regular la altura.",
      precio: null,
      etiqueta: "A medida",
      fotos: ["img/herraje-cardan.webp"],
      caracteristicas: ["Hecha a medida", "Cadenas", "Manivela", "Varillas"],
    },
  ],

  // También fabrican (sin fotos todavía)
  tambien: ["Hogares", "Herrajes para hogar", "Discos de arado", "Parrillas a medida"],

  instagramFotos: [
    { src: "img/pantera-negra-2.webp", alt: "Parrilla Pantera Negra con tablas de madera" },
    { src: "img/guru-2.webp", alt: "Fogonero Guru con parrilla y plancha" },
    { src: "img/eco-fuego.webp", alt: "Parrilla ECO encendida con fuego en el fogonero" },
    { src: "img/topo-grande.webp", alt: "Parrilla Topo Grande en el showroom" },
    { src: "img/eco-2.webp", alt: "Parrilla ECO negra con tapa abierta" },
    { src: "img/herraje-cardan.webp", alt: "Parrilla para hogar con cadenas y manivela" },
  ],

  showroom: {
    foto: "img/showroom.webp",
    alt: "Frente rojo del showroom de Jardín Sur en Av. Frías con parrillas en la vereda",
    detalle: "Showroom a la calle con estacionamiento para clientes.",
  },

  faq: [
    { p: "¿Hacen parrillas a medida?", r: "Sí. Fabricamos parrillas, fogoneros y hogares a la medida de tu quincho o tu patio. Contanos las medidas por WhatsApp y te pasamos presupuesto." },
    { p: "¿Puedo pagar en cuotas?", r: "Sí, tenemos planes de hasta 18 cuotas. Mirá la calculadora de esta página y consultanos los planes vigentes." },
    { p: "¿Puedo ver las parrillas antes de comprar?", r: "Claro. Tenemos showroom a la calle en Av. Frías 3684, Turdera, con estacionamiento para clientes." },
    { p: "¿Hacen envíos?", r: "Coordinamos la entrega por WhatsApp según tu zona." }, // PENDIENTE CLIENTE: confirmar zona y costo de envío
    { p: "¿Tienen discos de arado?", r: "Sí, además de parrillas, fogoneros y hogares trabajamos discos de arado. Consultanos disponibilidad." },
  ],

  resenas: [
    // { autor: "Nombre A.", texto: "…", estrellas: 5 },  // PENDIENTE CLIENTE: sumar reseñas reales de Google/Instagram. Si está vacío, la sección no se muestra.
  ],

  seo: {
    titulo: "Parrillas y fogoneros en Turdera | Jardín Sur",
    descripcion: "Fábrica de parrillas, fogoneros y hogares en Turdera, con más de 30 años en el rubro. Showroom a la calle, hasta 18 cuotas y pedidos por WhatsApp.",
    ogImage: "img/og.jpg", // 1200x630, local
    tipoSchema: "Store",
  },
};
