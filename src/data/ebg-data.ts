export type PesoPuntuacion = {
  id: string;
  label: string;
  peso: number;
  que: string;
};

export type Merchant = {
  id: string;
  nombre: string;
  tipo: "marketplace" | "retail" | "directo";
  tipoEnlace: "afiliado" | "directo";
};

export type Categoria = {
  id: string;
  slug: string;
  nombre: string;
  claim: string;
  imagenPlaceholder: string;
  modelosCount: number;
};

export type Bike = {
  id: string;
  slug: string;
  marca: string;
  modelo: string;
  tipo: string;
  categoriaId: string;
  precio: number;
  precioAnterior?: number;
  bateriaWh: number;
  autonomiaKm: { min: number; max: number };
  motor: string;
  parNm: number;
  pesoKg: number;
  puntuacion: number;
  reviews: number;
  pros: string[];
  contras: string[];
  imagenPlaceholder: string;
  merchantId: string;
  destacada?: boolean;
};

export type Guia = {
  id: string;
  slug: string;
  categoria: string;
  titulo: string;
  resumen: string;
  minutosLectura: number;
  imagenPlaceholder: string;
  destacada?: boolean;
};

export type NavLink = { label: string; href: string };

export const EBG_DATA = {
  meta: {
    demo: true,
    nombre: "eBikeGuide",
    dominio: "https://ebikeguide.es",
    metodologiaUrl: "/metodologia/",
    pruebasPropias: false,
    evidenciaPorDefecto: "especificaciones",
    pesosPuntuacion: [
      {
        id: "autonomia",
        label: "Autonomía",
        peso: 20,
        que: "Wh disponibles frente al consumo estimado de la bici.",
      },
      {
        id: "confort",
        label: "Comodidad",
        peso: 20,
        que: "Postura, accesibilidad del cuadro y suspensión.",
      },
      {
        id: "potencia",
        label: "Motor",
        peso: 15,
        que: "Par, tipo de motor y comportamiento en rampa.",
      },
      {
        id: "equipamiento",
        label: "Equipamiento",
        peso: 15,
        que: "Luces, guardabarros, portabultos y batería extraíble de serie.",
      },
      {
        id: "frenada",
        label: "Frenada",
        peso: 10,
        que: "Tipo de freno y diámetro de disco frente al peso de la bici.",
      },
      {
        id: "peso",
        label: "Peso",
        peso: 10,
        que: "Kilos a mover a mano, escalados por categoría.",
      },
      {
        id: "precio",
        label: "Precio",
        peso: 10,
        que: "Prestación obtenida por euro dentro del catálogo.",
      },
    ] as PesoPuntuacion[],
  },

  merchants: [
    { id: "amazon", nombre: "Amazon", tipo: "marketplace", tipoEnlace: "afiliado" },
    { id: "especializada", nombre: "Tienda especializada", tipo: "retail", tipoEnlace: "afiliado" },
    { id: "fabricante", nombre: "Fabricante", tipo: "directo", tipoEnlace: "directo" },
  ] as Merchant[],

  navLinks: [
    { label: "Inicio", href: "/" },
    { label: "Bicicletas", href: "/bicicletas-electricas/" },
    { label: "Comparador", href: "/comparador/" },
    { label: "Calculadoras", href: "/calculadoras/" },
    { label: "Guías", href: "/guias/" },
    { label: "Ofertas", href: "/ofertas/" },
  ] as NavLink[],

  categorias: [
    {
      id: "urbanas",
      slug: "urbanas",
      nombre: "Urbanas",
      claim: "Para el día a día en ciudad",
      imagenPlaceholder: "Ciclista urbano en e-bike cruzando un carril bici en la ciudad",
      modelosCount: 34,
    },
    {
      id: "plegables",
      slug: "plegables",
      nombre: "Plegables",
      claim: "Se pliegan, caben en cualquier sitio",
      imagenPlaceholder: "E-bike plegable apoyada junto a una mochila en un andén de tren",
      modelosCount: 18,
    },
    {
      id: "montana",
      slug: "montana",
      nombre: "Montaña",
      claim: "Motor y suspensión para el barro",
      imagenPlaceholder: "E-bike de montaña subiendo un sendero forestal con suspensión activa",
      modelosCount: 27,
    },
    {
      id: "trekking",
      slug: "trekking",
      nombre: "Trekking",
      claim: "Rutas largas con equipaje",
      imagenPlaceholder: "E-bike de trekking con alforjas en una ruta de gravilla",
      modelosCount: 22,
    },
    {
      id: "cargo",
      slug: "cargo",
      nombre: "Cargo",
      claim: "Lleva niños o la compra sin sudar",
      imagenPlaceholder: "E-bike de carga con caja delantera transportando a dos niños",
      modelosCount: 11,
    },
    {
      id: "baratas",
      slug: "baratas",
      nombre: "Baratas",
      claim: "Buena relación calidad-precio",
      imagenPlaceholder: "E-bike sencilla aparcada frente a un portal de vivienda",
      modelosCount: 29,
    },
  ] as Categoria[],

  bikes: [
    {
      id: "bike-cube-town-hybrid-exc-625",
      slug: "cube-town-hybrid-exc-625",
      marca: "Cube",
      modelo: "Town Hybrid EXC 625",
      tipo: "Urbana",
      categoriaId: "urbanas",
      precio: 3299,
      precioAnterior: 3699,
      bateriaWh: 625,
      autonomiaKm: { min: 60, max: 100 },
      motor: "Bosch Performance Line",
      parNm: 65,
      pesoKg: 24.5,
      puntuacion: 88,
      reviews: 142,
      pros: [
        "Postura muy cómoda para trayectos diarios",
        "Guardabarros, luces y portabultos de serie",
        "Batería extraíble fácil de cargar en casa",
      ],
      contras: [
        "Peso elevado para subir escaleras o portales",
        "Suspensión solo delantera",
      ],
      imagenPlaceholder: "Cube Town Hybrid EXC 625 en gris mate, vista de tres cuartos",
      merchantId: "especializada",
      destacada: true,
    },
    {
      id: "bike-brompton-electric-c-line",
      slug: "brompton-electric-c-line",
      marca: "Brompton",
      modelo: "Electric C Line",
      tipo: "Plegable",
      categoriaId: "plegables",
      precio: 3895,
      bateriaWh: 300,
      autonomiaKm: { min: 30, max: 50 },
      motor: "Brompton/Williams",
      parNm: 30,
      pesoKg: 16.6,
      puntuacion: 84,
      reviews: 67,
      pros: [
        "Se pliega en segundos y cabe bajo una mesa",
        "La más ligera de la comparativa",
        "Acabado y materiales premium",
      ],
      contras: [
        "Autonomía justa para rutas largas",
        "Precio alto para su categoría de plegable",
      ],
      imagenPlaceholder: "Brompton Electric C Line plegada junto a una mesa de cafetería",
      merchantId: "fabricante",
    },
    {
      id: "bike-orbea-rise-m20",
      slug: "orbea-rise-m20",
      marca: "Orbea",
      modelo: "Rise M20",
      tipo: "Montaña",
      categoriaId: "montana",
      precio: 5499,
      precioAnterior: 5999,
      bateriaWh: 360,
      autonomiaKm: { min: 40, max: 70 },
      motor: "Shimano EP8 RS",
      parNm: 85,
      pesoKg: 18.9,
      puntuacion: 91,
      reviews: 98,
      pros: [
        "Se comporta casi como una MTB no eléctrica",
        "Motor discreto y con muy buena respuesta",
        "Geometría moderna y suspensión de recorrido generoso",
      ],
      contras: [
        "Batería pequeña para rutas de más de 3 horas",
        "Mantenimiento más exigente que una urbana",
      ],
      imagenPlaceholder: "Orbea Rise M20 subiendo un sendero forestal con barro",
      merchantId: "especializada",
      destacada: true,
    },
    {
      id: "bike-kalkhoff-endeavour-5b-move",
      slug: "kalkhoff-endeavour-5b-move",
      marca: "Kalkhoff",
      modelo: "Endeavour 5.B Move",
      tipo: "Trekking",
      categoriaId: "trekking",
      precio: 3199,
      bateriaWh: 500,
      autonomiaKm: { min: 70, max: 110 },
      motor: "Bosch Performance Line CX",
      parNm: 85,
      pesoKg: 25.8,
      puntuacion: 89,
      reviews: 76,
      pros: [
        "Autonomía sobresaliente para rutas de fin de semana",
        "Motor con mucho par para desniveles con alforjas cargadas",
        "Frenos de disco hidráulicos de gran diámetro",
      ],
      contras: [
        "Bici pesada de manejar fuera de la bici",
        "Sin suspensión trasera",
      ],
      imagenPlaceholder: "Kalkhoff Endeavour 5.B Move con alforjas en una ruta de gravilla",
      merchantId: "especializada",
    },
    {
      id: "bike-tern-gsd-s10",
      slug: "tern-gsd-s10",
      marca: "Tern",
      modelo: "GSD S10",
      tipo: "Cargo",
      categoriaId: "cargo",
      precio: 4999,
      bateriaWh: 500,
      autonomiaKm: { min: 50, max: 90 },
      motor: "Bosch Cargo Line",
      parNm: 85,
      pesoKg: 30.3,
      puntuacion: 90,
      reviews: 54,
      pros: [
        "Capacidad de carga hasta 200 kg entre bici y porteo",
        "Rueda de 20\" que la hace más manejable de lo esperado",
        "Doble batería opcional para trayectos largos",
      ],
      contras: [
        "Precio de entrada elevado",
        "Necesita espacio de aparcamiento propio",
      ],
      imagenPlaceholder: "Tern GSD S10 transportando a dos niños en asientos traseros",
      merchantId: "especializada",
      destacada: true,
    },
    {
      id: "bike-moma-e16-city",
      slug: "moma-e16-city",
      marca: "Moma Bikes",
      modelo: "E-16 City",
      tipo: "Urbana económica",
      categoriaId: "baratas",
      precio: 999,
      precioAnterior: 1199,
      bateriaWh: 374,
      autonomiaKm: { min: 35, max: 55 },
      motor: "Motor buje trasero genérico",
      parNm: 40,
      pesoKg: 22,
      puntuacion: 74,
      reviews: 210,
      pros: [
        "La opción más asequible con buena nota general",
        "Fácil de encontrar recambios básicos",
        "Peso contenido para su precio",
      ],
      contras: [
        "Componentes de frenada más modestos",
        "Sin batería extraíble en algunas unidades",
      ],
      imagenPlaceholder: "Moma Bikes E-16 City aparcada frente a un portal de vivienda",
      merchantId: "amazon",
      destacada: true,
    },
  ] as Bike[],

  guias: [
    {
      id: "guia-motores-bosch-shimano-yamaha",
      slug: "bosch-vs-shimano-vs-yamaha-que-motor-elegir",
      categoria: "Comparativas",
      titulo: "Bosch vs Shimano vs Yamaha: qué motor de e-bike elegir en 2026",
      resumen:
        "Comparamos par, peso, ruido y autonomía real de los tres motores más habituales del mercado para que sepas cuál encaja con tu forma de rodar.",
      minutosLectura: 9,
      imagenPlaceholder: "Primer plano de tres motores de e-bike distintos montados en cuadro",
      destacada: true,
    },
    {
      id: "guia-autonomia-necesaria",
      slug: "como-elegir-la-autonomia-que-necesitas",
      categoria: "Guía de compra",
      titulo: "Cómo elegir la autonomía que realmente necesitas",
      resumen:
        "La autonomía anunciada casi nunca coincide con la real. Te explicamos qué factores la reducen y cuántos Wh necesitas según tu ruta.",
      minutosLectura: 6,
      imagenPlaceholder: "Indicador de batería de una e-bike mostrado en un display central",
    },
    {
      id: "guia-cuidado-bateria",
      slug: "cuidados-basicos-bateria-e-bike",
      categoria: "Mantenimiento",
      titulo: "Cuidados básicos de la batería de tu e-bike para que dure más",
      resumen:
        "Temperatura, ciclos de carga y almacenamiento en invierno: los hábitos que más alargan la vida útil de una batería de litio.",
      minutosLectura: 5,
      imagenPlaceholder: "Batería extraíble de e-bike cargándose sobre una mesa de taller",
    },
    {
      id: "guia-normativa-espana",
      slug: "normativa-e-bikes-espana",
      categoria: "Normativa",
      titulo: "Qué dice la ley española sobre las e-bikes (y qué pasa con las de 45 km/h)",
      resumen:
        "Repasamos la clasificación legal de las bicicletas eléctricas en España, seguro, casco y en qué casos se consideran ciclomotor.",
      minutosLectura: 7,
      imagenPlaceholder: "Señal de tráfico de carril bici junto a una e-bike aparcada",
    },
  ] as Guia[],

  trustItems: [
    "Comparamos especificaciones oficiales publicadas por cada fabricante",
    "Actualizamos precios y disponibilidad con frecuencia",
    "Señalamos con claridad qué enlaces son de afiliado",
    "Nunca alteramos una puntuación por acuerdos comerciales",
  ],
};

export type EbgData = typeof EBG_DATA;
