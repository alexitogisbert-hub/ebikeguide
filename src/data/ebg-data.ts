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

export type SubPuntuaciones = {
  autonomia: number;
  potencia: number;
  confort: number;
  precio: number;
  peso: number;
  componentes: number;
};

export type PerfilUso = {
  llano: number;
  cuestas: number;
  largaDistancia: number;
  carga: number;
  transporte: number;
  offroad: number;
};

export type MotorTipo = "central" | "buje";
export type NivelEquipamiento = "basico" | "medio" | "completo" | "deportivo";
export type Disponibilidad = "disponible" | "pocas" | "agotado";

export type OfertaBike = {
  merchantId: string;
  precio: number;
  disponibilidad: Disponibilidad;
  affiliateUrl: string | null;
  fechaComprobacion: string | null;
  envio: string | null;
  comision: number | null;
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
  bateriaExtraible: boolean;
  autonomia: number;
  autonomiaMin: number;
  autonomiaMax: number;
  motor: string;
  motorTipo: MotorTipo;
  parNm: number;
  velocidad: number;
  pesoKg: number;
  cambios: string;
  frenos: string;
  suspension: string;
  tallas: string[];
  cargaMaxima: number;
  dimensiones: string;
  nivelEquipamiento: NivelEquipamiento;
  plegable: boolean;
  carga: boolean;
  puntuacion: number;
  subs: SubPuntuaciones;
  perfil: PerfilUso;
  usosRecomendados: string[];
  mejorPara: string;
  idealPara: string;
  noEsPara: string;
  porQue: string;
  analisis: string;
  pros: string[];
  contras: string[];
  ofertas: OfertaBike[];
  alternativas: string[];
  imagen: string;
  imagenPlaceholder: string;
  galeria: string[] | null;
  medidasPropias: unknown | null;
  fechaActualizacion: string | null;
  fechaPrecioComprobado: string | null;
  reviews: number;
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
        peso: 25,
        que: "Km reales estimados frente al consumo según motor y batería.",
      },
      {
        id: "potencia",
        label: "Motor",
        peso: 20,
        que: "Par, tipo de motor y comportamiento en rampa.",
      },
      {
        id: "confort",
        label: "Comodidad",
        peso: 20,
        que: "Postura, accesibilidad del cuadro y suspensión.",
      },
      {
        id: "componentes",
        label: "Componentes",
        peso: 15,
        que: "Grupo de cambios, frenos y calidad de los acabados.",
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
      id: "b01",
      slug: "moma-e16-city",
      marca: "Moma Bikes",
      modelo: "E-16 City",
      tipo: "urbana",
      categoriaId: "baratas",
      precio: 999,
      precioAnterior: 1199,
      bateriaWh: 374,
      bateriaExtraible: true,
      autonomia: 45,
      autonomiaMin: 35,
      autonomiaMax: 55,
      motor: "Buje trasero genérico 250 W",
      motorTipo: "buje",
      parNm: 40,
      velocidad: 25,
      pesoKg: 22,
      cambios: "7v",
      frenos: "Mecánico 160 mm",
      suspension: "Horquilla 50 mm",
      tallas: ["M", "L"],
      cargaMaxima: 115,
      dimensiones: "178 × 62 × 108 cm",
      nivelEquipamiento: "basico",
      plegable: false,
      carga: false,
      puntuacion: 7.4,
      subs: { autonomia: 6.2, potencia: 6.0, confort: 6.6, precio: 9.6, peso: 7.6, componentes: 5.8 },
      perfil: { llano: 0.85, cuestas: 0.3, largaDistancia: 0.25, carga: 0.2, transporte: 0.2, offroad: 0.05 },
      usosRecomendados: ["ciudad", "ocasional"],
      mejorPara: "Primera e-bike con presupuesto muy ajustado",
      idealPara: "Quien quiere probar la asistencia eléctrica gastando lo mínimo posible, en trayectos cortos y llanos.",
      noEsPara: "Cuestas o uso diario intensivo: el motor de buje y los frenos mecánicos se quedan cortos.",
      porQue: "El precio de entrada más bajo del catálogo demo, con batería extraíble pese a costar menos de 1.000 €.",
      analisis:
        "Es la compra racional cuando el presupuesto manda: cumple lo básico en llano y trayectos cortos, y no pretende ser otra cosa. Los frenos mecánicos y el motor de buje son el recorte esperable a este precio.",
      pros: [
        "Precio de entrada más bajo del catálogo demo",
        "Batería extraíble",
        "Peso contenido para su categoría",
      ],
      contras: [
        "Frenos mecánicos, no hidráulicos",
        "Motor de buje con menos control que uno central",
        "Componentes básicos",
      ],
      ofertas: [
        {
          merchantId: "amazon",
          precio: 999,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b06", "b12", "b09"],
      imagen: "",
      imagenPlaceholder: "Moma Bikes E-16 City aparcada frente a un portal de vivienda",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 210,
      destacada: true,
    },
    {
      id: "b02",
      slug: "brompton-electric-c-line",
      marca: "Brompton",
      modelo: "Electric C Line",
      tipo: "plegable",
      categoriaId: "plegables",
      precio: 3895,
      bateriaWh: 300,
      bateriaExtraible: true,
      autonomia: 40,
      autonomiaMin: 30,
      autonomiaMax: 50,
      motor: "Brompton/Williams buje delantero",
      motorTipo: "buje",
      parNm: 30,
      velocidad: 25,
      pesoKg: 16.6,
      cambios: "2v",
      frenos: "V-brake",
      suspension: "Bloque elastómero trasero",
      tallas: ["Única"],
      cargaMaxima: 100,
      dimensiones: "Plegada 65 × 33 × 59 cm",
      nivelEquipamiento: "medio",
      plegable: true,
      carga: false,
      puntuacion: 8.4,
      subs: { autonomia: 5.9, potencia: 5.8, confort: 7.6, precio: 6.8, peso: 9.8, componentes: 8.2 },
      perfil: { llano: 0.85, cuestas: 0.25, largaDistancia: 0.2, carga: 0.1, transporte: 0.99, offroad: 0.05 },
      usosRecomendados: ["multimodal", "commuting"],
      mejorPara: "Combinar con tren o metro y guardar en espacios mínimos",
      idealPara: "Quien combina bici y transporte público a diario y necesita plegarla en segundos para subirla al vagón.",
      noEsPara: "Rutas largas o terreno con cuestas: 300 Wh y 30 Nm no dan para mucho más que el último tramo del trayecto.",
      porQue: "El plegado más rápido y compacto del catálogo demo, con acabados y materiales de gama alta.",
      analisis:
        "Se paga un precio alto por un plegado de segundos y 16,6 kg, no por prestaciones eléctricas: la batería y el par son los más discretos del catálogo demo. Tiene sentido solo si el criterio de compra es la portabilidad, no la autonomía.",
      pros: ["Se pliega en segundos", "La más compacta del catálogo demo", "Acabados premium"],
      contras: ["Autonomía limitada", "Precio alto para sus prestaciones eléctricas", "Frenos V-brake"],
      ofertas: [
        {
          merchantId: "fabricante",
          precio: 3895,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b09", "b12", "b06"],
      imagen: "",
      imagenPlaceholder: "Brompton Electric C Line plegada junto a una mesa de cafetería",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 67,
      destacada: false,
    },
    {
      id: "b03",
      slug: "granith-trail-emtb-29",
      marca: "Granith",
      modelo: "Trail eMTB 29",
      tipo: "montana",
      categoriaId: "montana",
      precio: 4290,
      precioAnterior: 4790,
      bateriaWh: 750,
      bateriaExtraible: false,
      autonomia: 95,
      autonomiaMin: 70,
      autonomiaMax: 120,
      motor: "Central 250 W full power",
      motorTipo: "central",
      parNm: 85,
      velocidad: 25,
      pesoKg: 24.8,
      cambios: "12v SLX",
      frenos: "Disco 4 pistones 203 mm",
      suspension: "Doble 150/140 mm",
      tallas: ["S", "M", "L", "XL"],
      cargaMaxima: 130,
      dimensiones: "183 × 78 × 118 cm",
      nivelEquipamiento: "deportivo",
      plegable: false,
      carga: false,
      puntuacion: 9.2,
      subs: { autonomia: 8.8, potencia: 9.7, confort: 8.9, precio: 6.9, peso: 6.8, componentes: 9.2 },
      perfil: { llano: 0.5, cuestas: 0.98, largaDistancia: 0.8, carga: 0.2, transporte: 0.1, offroad: 0.95 },
      usosRecomendados: ["montaña", "aventura"],
      mejorPara: "Rutas de montaña con desnivel acumulado alto",
      idealPara: "Quien acumula más de 800 m de desnivel por salida y no quiere pensar en la batería a mitad de ruta.",
      noEsPara: "Uso urbano: es sobredimensionada, cara y su geometría no aporta nada en ciudad.",
      porQue: "Batería de 750 Wh y 85 Nm de par. Es la referencia del catálogo demo si tu terreno tiene desnivel de verdad.",
      analisis:
        "La combinación 750 Wh + 85 Nm es lo que separa una eMTB de una bici de monte con motor. Los frenos de 4 pistones y 203 mm no son un lujo cuando bajas 24,8 kg. El precio es su único problema real y la razón por la que la Hardtail 500 tiene sentido para la mayoría.",
      pros: ["Par y batería sobresalientes", "Frenos de 4 pistones", "Grupo 12v y geometría moderna"],
      contras: ["Precio alto", "Excesiva para uso urbano", "Batería no extraíble"],
      ofertas: [
        {
          merchantId: "especializada",
          precio: 4290,
          disponibilidad: "pocas",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
        {
          merchantId: "fabricante",
          precio: 4390,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b08", "b11", "b04"],
      imagen: "",
      imagenPlaceholder: "Granith Trail eMTB 29 subiendo un sendero de montaña con roca suelta",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 38,
      destacada: true,
    },
    {
      id: "b04",
      slug: "nordvik-tour-trekking-625",
      marca: "Nordvik",
      modelo: "Tour Trekking 625",
      tipo: "trekking",
      categoriaId: "trekking",
      precio: 3190,
      precioAnterior: 3490,
      bateriaWh: 625,
      bateriaExtraible: true,
      autonomia: 130,
      autonomiaMin: 100,
      autonomiaMax: 160,
      motor: "Central 250 W",
      motorTipo: "central",
      parNm: 75,
      velocidad: 25,
      pesoKg: 25.1,
      cambios: "11v Deore",
      frenos: "Disco hidráulico 180 mm",
      suspension: "Horquilla 60 mm",
      tallas: ["M", "L", "XL"],
      cargaMaxima: 150,
      dimensiones: "186 × 68 × 115 cm",
      nivelEquipamiento: "completo",
      plegable: false,
      carga: false,
      puntuacion: 8.8,
      subs: { autonomia: 9.6, potencia: 8.4, confort: 9.3, precio: 7.6, peso: 6.9, componentes: 8.4 },
      perfil: { llano: 0.9, cuestas: 0.8, largaDistancia: 0.98, carga: 0.7, transporte: 0.1, offroad: 0.4 },
      usosRecomendados: ["cicloturismo", "commuting"],
      mejorPara: "Salidas largas y viajes con alforjas",
      idealPara: "Quien hace rutas de más de 60 km o viaja con alforjas y quiere no pensar en la carga.",
      noEsPara: "Tráfico denso y trayectos cortos con paradas: 25,1 kg y una batalla larga no son ágiles.",
      porQue: "La autonomía más alta del catálogo demo con equipamiento completo de serie: portabultos, guardabarros y luces homologadas.",
      analisis:
        "Es la bici que menos compromisos pide en distancia y la que más pide en manejabilidad. Sobre el papel, 625 Wh con un motor central de 75 Nm es la combinación más holgada del catálogo para distancia; no lo hemos verificado rodando. Si tu uso es mixto ciudad/ruta, es la más versátil del catálogo; si es solo ciudad, sobra bici.",
      pros: ["Autonomía sobresaliente", "Equipada de fábrica", "Muy cómoda en distancias largas"],
      contras: ["Pesada", "Poco ágil en tráfico denso"],
      ofertas: [
        {
          merchantId: "especializada",
          precio: 3190,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b10", "b01", "b11"],
      imagen: "",
      imagenPlaceholder: "Nordvik Tour Trekking 625 con alforjas completas en una ruta de cicloturismo",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 71,
      destacada: false,
    },
    {
      id: "b05",
      slug: "portea-cargo-family-l",
      marca: "Portea",
      modelo: "Cargo Family L",
      tipo: "cargo",
      categoriaId: "cargo",
      precio: 3890,
      precioAnterior: 4290,
      bateriaWh: 720,
      bateriaExtraible: true,
      autonomia: 85,
      autonomiaMin: 60,
      autonomiaMax: 105,
      motor: "Central 250 W cargo",
      motorTipo: "central",
      parNm: 85,
      velocidad: 25,
      pesoKg: 38.5,
      cambios: "Buje 5v",
      frenos: "Disco hidráulico 203 mm",
      suspension: "Rígida",
      tallas: ["Única"],
      cargaMaxima: 180,
      dimensiones: "245 × 70 × 118 cm",
      nivelEquipamiento: "completo",
      plegable: false,
      carga: true,
      puntuacion: 8.6,
      subs: { autonomia: 8.2, potencia: 9.4, confort: 8.6, precio: 7.0, peso: 5.2, componentes: 8.4 },
      perfil: { llano: 0.9, cuestas: 0.7, largaDistancia: 0.6, carga: 0.99, transporte: 0.05, offroad: 0.1 },
      usosRecomendados: ["familia", "carga"],
      mejorPara: "Llevar niños o compra semanal sin coche",
      idealPara: "Familias que quieren sustituir el segundo coche: hasta 180 kg de carga total y frenos dimensionados para ello.",
      noEsPara: "Quien no tenga un sitio a nivel de calle donde aparcarla: 2,45 m de largo y 38,5 kg.",
      porQue: "Cuadro rígido, frenos de 203 mm y buje de 5 velocidades: pensada para ir cargada todos los días con mantenimiento bajo.",
      analisis:
        "El dato que importa en una cargo no es la autonomía sino la carga máxima y el freno. Aquí los dos están bien resueltos. El cambio de buje es la decisión correcta para una bici que arranca cargada en cuesta. El problema es logístico: aparcamiento y peso.",
      pros: ["Capacidad de carga enorme", "Estabilidad a baja velocidad", "Mantenimiento bajo (buje)"],
      contras: ["Aparcamiento complicado", "Peso muy alto", "Solo talla única"],
      ofertas: [
        {
          merchantId: "especializada",
          precio: 3890,
          disponibilidad: "pocas",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b04", "b10"],
      imagen: "",
      imagenPlaceholder: "Portea Cargo Family L con dos sillas infantiles instaladas",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 29,
      destacada: true,
    },
    {
      id: "b06",
      slug: "vent-city-basic-36",
      marca: "Vent",
      modelo: "City Basic 36",
      tipo: "urbana",
      categoriaId: "urbanas",
      precio: 899,
      precioAnterior: 1099,
      bateriaWh: 360,
      bateriaExtraible: true,
      autonomia: 55,
      autonomiaMin: 40,
      autonomiaMax: 70,
      motor: "Buje trasero 250 W",
      motorTipo: "buje",
      parNm: 40,
      velocidad: 25,
      pesoKg: 21.2,
      cambios: "7v",
      frenos: "V-brake",
      suspension: "Horquilla 50 mm",
      tallas: ["M", "L"],
      cargaMaxima: 120,
      dimensiones: "180 × 64 × 110 cm",
      nivelEquipamiento: "basico",
      plegable: false,
      carga: false,
      puntuacion: 7.4,
      subs: { autonomia: 6.4, potencia: 6.6, confort: 7.2, precio: 9.8, peso: 7.4, componentes: 6.0 },
      perfil: { llano: 0.85, cuestas: 0.35, largaDistancia: 0.3, carga: 0.3, transporte: 0.2, offroad: 0.1 },
      usosRecomendados: ["ciudad", "ocasional"],
      mejorPara: "Primera e-bike con presupuesto ajustado",
      idealPara: "Quien quiere probar si la e-bike encaja en su día a día sin arriesgar más de 1.000 €, en ciudad llana y trayectos cortos.",
      noEsPara: "Uso intensivo diario o terreno con cuestas: los V-brake y la batería de 360 Wh marcan el límite.",
      porQue: "Entrada al eléctrico por menos de 1.000 €. No compite en componentes, pero cumple en trayectos llanos y cortos.",
      analisis:
        "A este precio el recorte está en el freno, no en el motor: los V-brake funcionan en seco y empeoran mucho con lluvia y 21 kg encima. Es una compra racional como primera e-bike de prueba, no como sustituto del coche.",
      pros: ["Precio de entrada", "Batería extraíble", "Ligera para su categoría"],
      contras: ["Frenos V-brake", "Autonomía justa", "Componentes básicos"],
      ofertas: [
        {
          merchantId: "amazon",
          precio: 899,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b02", "b12", "b09"],
      imagen: "",
      imagenPlaceholder: "Vent City Basic 36 aparcada en una calle residencial",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 184,
      destacada: false,
    },
    {
      id: "b07",
      slug: "volter-urban-light-360",
      marca: "Volter",
      modelo: "Urban Light 360",
      tipo: "urbana",
      categoriaId: "urbanas",
      precio: 1790,
      precioAnterior: 1990,
      bateriaWh: 360,
      bateriaExtraible: false,
      autonomia: 70,
      autonomiaMin: 55,
      autonomiaMax: 90,
      motor: "Central 250 W ligero",
      motorTipo: "central",
      parNm: 55,
      velocidad: 25,
      pesoKg: 17.6,
      cambios: "Monoplato 9v",
      frenos: "Disco hidráulico 160 mm",
      suspension: "Rígida",
      tallas: ["S", "M", "L"],
      cargaMaxima: 120,
      dimensiones: "175 × 62 × 108 cm",
      nivelEquipamiento: "medio",
      plegable: false,
      carga: false,
      puntuacion: 8.5,
      subs: { autonomia: 7.4, potencia: 7.8, confort: 8.4, precio: 8.8, peso: 9.4, componentes: 8.2 },
      perfil: { llano: 0.95, cuestas: 0.6, largaDistancia: 0.45, carga: 0.2, transporte: 0.7, offroad: 0.1 },
      usosRecomendados: ["ciudad", "commuting"],
      mejorPara: "Quien necesita subir la bici a un piso sin ascensor",
      idealPara: "Quien tiene que cargar la bici por escaleras o quiere una e-bike que se pedalee como una bici normal cuando se agota la batería.",
      noEsPara: "Rutas largas o cuestas continuadas: 360 Wh no extraíbles y 55 Nm son su techo.",
      porQue: "17,6 kg con motor central: la más ligera con asistencia central del catálogo demo. Asistencia discreta y silenciosa.",
      analisis:
        "El peso es aquí una prestación, no un dato. 17,6 kg es la diferencia entre subirla al tercero y dejarla en la calle. Se paga con batería fija y pequeña: hay que asumir carga frecuente. Frente a la Urban Pro pierdes equipamiento y autonomía y ganas casi 5 kg y agilidad.",
      pros: ["Muy ligera para llevar en mano", "Diseño limpio, cableado interno", "Silenciosa"],
      contras: ["Batería no extraíble", "Par limitado en rampas largas"],
      ofertas: [
        {
          merchantId: "especializada",
          precio: 1790,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
        {
          merchantId: "fabricante",
          precio: 1790,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b12", "b01", "b11"],
      imagen: "",
      imagenPlaceholder: "Volter Urban Light 360 apoyada en una escalera de un portal",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 96,
      destacada: false,
    },
    {
      id: "b08",
      slug: "granith-hardtail-500",
      marca: "Granith",
      modelo: "Hardtail 500",
      tipo: "montana",
      categoriaId: "montana",
      precio: 2690,
      precioAnterior: 2990,
      bateriaWh: 500,
      bateriaExtraible: true,
      autonomia: 80,
      autonomiaMin: 60,
      autonomiaMax: 100,
      motor: "Central 250 W",
      motorTipo: "central",
      parNm: 70,
      velocidad: 25,
      pesoKg: 23.4,
      cambios: "10v Deore",
      frenos: "Disco hidráulico 180 mm",
      suspension: "Horquilla 120 mm",
      tallas: ["S", "M", "L"],
      cargaMaxima: 130,
      dimensiones: "180 × 74 × 115 cm",
      nivelEquipamiento: "deportivo",
      plegable: false,
      carga: false,
      puntuacion: 8.3,
      subs: { autonomia: 7.8, potencia: 8.6, confort: 7.9, precio: 8.2, peso: 7.4, componentes: 8.0 },
      perfil: { llano: 0.6, cuestas: 0.9, largaDistancia: 0.6, carga: 0.2, transporte: 0.1, offroad: 0.8 },
      usosRecomendados: ["montaña", "mixto"],
      mejorPara: "Pistas y caminos sin grandes exigencias técnicas",
      idealPara: "Quien sale a pista y camino cada semana y prefiere gastar menos y mantener menos que tener suspensión trasera.",
      noEsPara: "Descenso técnico o rutas de más de 80 km con desnivel: la horquilla y los 500 Wh se quedan cortos.",
      porQue: "Mismo motor central de la gama alta con cuadro rígido detrás: menos mantenimiento y bastante menos precio que una doble.",
      analisis:
        "Para el 80 % del uso real de una eMTB —pistas, caminos, algún sendero— la rígida es la compra correcta. Ahorra 1.600 € frente a la Trail y pierde principalmente confort en bajada y 250 Wh. Buen punto de entrada al monte eléctrico.",
      pros: ["Relación calidad/precio", "Motor central de gama alta", "Versátil en mixto"],
      contras: ["Sin suspensión trasera", "500 Wh justos en rutas largas"],
      ofertas: [
        {
          merchantId: "especializada",
          precio: 2690,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b03", "b04", "b11"],
      imagen: "",
      imagenPlaceholder: "Granith Hardtail 500 en un camino de tierra junto a un bosque",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 112,
      destacada: false,
    },
    {
      id: "b09",
      slug: "kompaq-mini-fold-16",
      marca: "Kompaq",
      modelo: "Mini Fold 16",
      tipo: "plegable",
      categoriaId: "plegables",
      precio: 1099,
      precioAnterior: 1299,
      bateriaWh: 288,
      bateriaExtraible: true,
      autonomia: 45,
      autonomiaMin: 35,
      autonomiaMax: 60,
      motor: "Buje delantero 250 W",
      motorTipo: "buje",
      parNm: 35,
      velocidad: 25,
      pesoKg: 16.4,
      cambios: "Monomarcha",
      frenos: "Disco mecánico 140 mm",
      suspension: "Rígida",
      tallas: ["Única"],
      cargaMaxima: 110,
      dimensiones: "Plegada 72 × 38 × 60 cm",
      nivelEquipamiento: "basico",
      plegable: true,
      carga: false,
      puntuacion: 7.6,
      subs: { autonomia: 5.8, potencia: 6.2, confort: 6.9, precio: 9.5, peso: 9.6, componentes: 6.4 },
      perfil: { llano: 0.8, cuestas: 0.25, largaDistancia: 0.2, carga: 0.1, transporte: 0.99, offroad: 0.05 },
      usosRecomendados: ["multimodal", "ocasional"],
      mejorPara: "Último kilómetro y guardado en espacios mínimos",
      idealPara: "Quien necesita cubrir 3–8 km desde la estación y guardar la bici bajo un escritorio.",
      noEsPara: 'Trayectos de más de 15 km o terreno con cuestas: 288 Wh, 35 Nm y ruedas de 16".',
      porQue: 'Ruedas de 16" y 16,4 kg: la más transportable del catálogo demo. Pensada para trayectos cortos, no para rutas.',
      analisis:
        "Es un vehículo de último kilómetro, no una bicicleta de uso general, y juzgarla de otro modo es injusto. En su terreno —llano, corto, multimodal— no tiene rival de precio. Fuera de él se queda corta rápido.",
      pros: ["La más compacta", "Ligera de llevar en mano", "Cabe bajo un escritorio"],
      contras: ["Autonomía corta", "Poco estable a velocidad alta", "Monomarcha"],
      ofertas: [
        {
          merchantId: "amazon",
          precio: 1099,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b02", "b12", "b06"],
      imagen: "",
      imagenPlaceholder: "Kompaq Mini Fold 16 plegada bajo un escritorio de oficina",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 143,
      destacada: true,
    },
    {
      id: "b10",
      slug: "nordvik-comfort-step-500",
      marca: "Nordvik",
      modelo: "Comfort Step 500",
      tipo: "trekking",
      categoriaId: "trekking",
      precio: 2290,
      precioAnterior: 2590,
      bateriaWh: 500,
      bateriaExtraible: true,
      autonomia: 100,
      autonomiaMin: 80,
      autonomiaMax: 120,
      motor: "Central 250 W",
      motorTipo: "central",
      parNm: 65,
      velocidad: 25,
      pesoKg: 24.2,
      cambios: "9v Alivio",
      frenos: "Disco hidráulico 180 mm",
      suspension: "Horquilla 63 mm + tija",
      tallas: ["S", "M", "L"],
      cargaMaxima: 140,
      dimensiones: "184 × 66 × 112 cm",
      nivelEquipamiento: "completo",
      plegable: false,
      carga: false,
      puntuacion: 8.4,
      subs: { autonomia: 9.0, potencia: 7.9, confort: 9.6, precio: 8.4, peso: 7.0, componentes: 7.8 },
      perfil: { llano: 0.95, cuestas: 0.7, largaDistancia: 0.85, carga: 0.6, transporte: 0.1, offroad: 0.3 },
      usosRecomendados: ["ocio", "commuting"],
      mejorPara: "Comodidad máxima y acceso fácil al cuadro",
      idealPara: "Quien vuelve a la bici después de años, o necesita subir y bajar del cuadro sin levantar la pierna.",
      noEsPara: "Uso deportivo o quien busque una respuesta ágil: el cuadro de paso bajo flexa a velocidad alta.",
      porQue: "Cuadro de paso bajo, tija con suspensión y postura totalmente erguida: la más cómoda del catálogo demo.",
      analisis:
        "La accesibilidad del cuadro es una prestación infravalorada: es la diferencia entre usar la bici a diario o no usarla. Renuncia a rigidez y a estética deportiva, y a cambio da la posición más cómoda y 100 km de autonomía con solo 500 Wh gracias a una asistencia conservadora.",
      pros: ["Acceso muy fácil al cuadro", "Postura erguida y cómoda", "Autonomía alta para 500 Wh"],
      contras: ["Estética menos deportiva", "Cuadro flexible a alta velocidad"],
      ofertas: [
        {
          merchantId: "especializada",
          precio: 2290,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b04", "b01", "b06"],
      imagen: "",
      imagenPlaceholder: "Nordvik Comfort Step 500 con cuadro de paso bajo en un parque",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 88,
      destacada: false,
    },
    {
      id: "b11",
      slug: "sable-gravel-e-road-320",
      marca: "Sable",
      modelo: "Gravel e-Road 320",
      tipo: "trekking",
      categoriaId: "trekking",
      precio: 3590,
      precioAnterior: 3890,
      bateriaWh: 320,
      bateriaExtraible: false,
      autonomia: 90,
      autonomiaMin: 70,
      autonomiaMax: 110,
      motor: "Central 250 W ligero",
      motorTipo: "central",
      parNm: 55,
      velocidad: 25,
      pesoKg: 15.8,
      cambios: "12v GRX",
      frenos: "Disco hidráulico 160 mm",
      suspension: "Rígida",
      tallas: ["S", "M", "L", "XL"],
      cargaMaxima: 115,
      dimensiones: "176 × 44 × 105 cm",
      nivelEquipamiento: "deportivo",
      plegable: false,
      carga: false,
      puntuacion: 8.7,
      subs: { autonomia: 8.0, potencia: 7.6, confort: 7.8, precio: 7.2, peso: 9.8, componentes: 9.0 },
      perfil: { llano: 0.9, cuestas: 0.75, largaDistancia: 0.85, carga: 0.15, transporte: 0.5, offroad: 0.6 },
      usosRecomendados: ["deporte", "aventura"],
      mejorPara: "Salidas deportivas mixtas asfalto + pista",
      idealPara: "Ciclistas con fondo que quieren una gravel normal con un empujón en las rampas, no una moto.",
      noEsPara: "Quien dependa del motor para avanzar: con 320 Wh y asistencia sutil, aquí sigue pedaleando el ciclista.",
      porQue: "15,8 kg. Asistencia que se nota en las rampas y desaparece en llano: se comporta como una gravel convencional.",
      analisis:
        "Su ratio Wh/€ es el peor del catálogo y aun así tiene sentido: no se compra por autonomía sino por peso y por grupo. Los 90 km declarados solo se cumplen con asistencia baja, que es exactamente cómo está pensada para usarse.",
      pros: ["Peso récord del catálogo", "Grupo GRX de 12v", "Asistencia natural"],
      contras: ["Batería pequeña y no extraíble", "Precio alto para sus Wh"],
      ofertas: [
        {
          merchantId: "fabricante",
          precio: 3590,
          disponibilidad: "pocas",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b08", "b07", "b04"],
      imagen: "",
      imagenPlaceholder: "Sable Gravel e-Road 320 en una pista de grava con niebla",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 52,
      destacada: false,
    },
    {
      id: "b12",
      slug: "vent-single-speed-e",
      marca: "Vent",
      modelo: "Single Speed e",
      tipo: "urbana",
      categoriaId: "urbanas",
      precio: 1490,
      precioAnterior: 1690,
      bateriaWh: 250,
      bateriaExtraible: false,
      autonomia: 50,
      autonomiaMin: 40,
      autonomiaMax: 65,
      motor: "Buje trasero 250 W",
      motorTipo: "buje",
      parNm: 40,
      velocidad: 25,
      pesoKg: 15.2,
      cambios: "Monomarcha por correa",
      frenos: "Disco mecánico 160 mm",
      suspension: "Rígida",
      tallas: ["S", "M", "L"],
      cargaMaxima: 110,
      dimensiones: "172 × 60 × 106 cm",
      nivelEquipamiento: "basico",
      plegable: false,
      carga: false,
      puntuacion: 7.9,
      subs: { autonomia: 6.0, potencia: 6.4, confort: 7.4, precio: 9.0, peso: 9.9, componentes: 7.0 },
      perfil: { llano: 0.95, cuestas: 0.3, largaDistancia: 0.3, carga: 0.15, transporte: 0.75, offroad: 0.05 },
      usosRecomendados: ["ciudad", "ocasional"],
      mejorPara: "Ciudad llana y mantenimiento mínimo",
      idealPara: "Ciudad plana, trayectos de menos de 10 km y quien no quiera engrasar una cadena nunca.",
      noEsPara: "Cualquier ciudad con cuestas: monomarcha y 40 Nm no dejan margen.",
      porQue: "Monomarcha por correa y 15,2 kg: mantenimiento casi nulo y una de las siluetas más limpias.",
      analisis:
        "Es una decisión estética y de mantenimiento tanto como técnica, y hay que asumirla: sin desarrollo que elegir, la bici solo funciona en llano. En ese contexto es la más agradable de usar a diario del catálogo demo.",
      pros: ["Transmisión por correa sin mantenimiento", "Muy ligera", "Silueta muy limpia"],
      contras: ["Solo terreno llano", "Batería de 250 Wh", "Batería no extraíble"],
      ofertas: [
        {
          merchantId: "amazon",
          precio: 1490,
          disponibilidad: "disponible",
          affiliateUrl: null,
          fechaComprobacion: null,
          envio: null,
          comision: null,
        },
      ],
      alternativas: ["b07", "b06", "b09"],
      imagen: "",
      imagenPlaceholder: "Vent Single Speed e con transmisión por correa, silueta minimalista",
      galeria: null,
      medidasPropias: null,
      fechaActualizacion: null,
      fechaPrecioComprobado: null,
      reviews: 77,
      destacada: false,
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
