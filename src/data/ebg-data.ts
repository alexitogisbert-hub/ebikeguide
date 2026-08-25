import { calcularSubsCatalogo, computeWeightedScore, type MetricasBike } from "@/domain/scoring";

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

/**
 * 0-10 por criterio, calculado algorítmicamente (ver `calcularSubsCatalogo` en
 * domain/scoring.ts) a partir de especificaciones publicadas, nunca asignado a mano —
 * `meta.pruebasPropias` es `false`, así que no evaluamos subjetivamente nada que no hayamos
 * probado. `null` cuando el fabricante no publica el dato necesario para ese criterio (no se
 * inventa un valor neutro). No incluye "confort" ni "componentes": no existe una
 * especificación numérica objetiva de la que derivarlos sin haber probado la bici, así que
 * se han retirado del motor de puntuación en vez de fabricar una fórmula pseudo-objetiva
 * para ellos — ver la metodología.
 */
export type SubPuntuaciones = {
  autonomia: number | null;
  potencia: number | null;
  peso: number | null;
  precio: number | null;
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
  /**
   * URL real del producto (no de afiliado) investigada manualmente, para no perder el
   * trabajo de investigación mientras no haya cuenta de Amazon Associates. En cuanto se
   * apruebe la cuenta, `affiliateUrl` se generará a partir de esta URL real.
   */
  urlProducto: string | null;
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
  /**
   * Precio orientativo. Cuando `precioAproximado` es `true`, viene de investigación web
   * (rango de precio observado, no lectura directa de la ficha de Amazon en el momento de
   * publicar) — usar el extremo inferior del rango investigado, nunca un valor inventado.
   */
  precio: number;
  precioAproximado: boolean;
  precioAnterior?: number;
  bateriaWh: number;
  bateriaExtraible: boolean | null;
  /** null si el fabricante no publica una cifra de autonomía para este modelo. */
  autonomia: number | null;
  autonomiaMin: number | null;
  autonomiaMax: number | null;
  motor: string;
  motorTipo: MotorTipo | null;
  parNm: number | null;
  velocidad: number;
  pesoKg: number | null;
  cambios: string | null;
  frenos: string | null;
  suspension: string | null;
  tallas: string[];
  cargaMaxima: number | null;
  dimensiones: string | null;
  nivelEquipamiento: NivelEquipamiento;
  plegable: boolean;
  carga: boolean;
  /** Si es un triciclo de 3 ruedas en vez de una bicicleta de 2 — debe mostrarse claramente. */
  esTriciclo?: boolean;
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
  /**
   * Ruta local (p. ej. "/images/bikes/urbana.jpg") a una foto de stock GENÉRICA de la
   * categoría del producto — no es la foto real de este modelo. No usamos fotos scrapeadas
   * de Amazon/Google Images (riesgo de copyright y puede perjudicar la solicitud de afiliado
   * de Amazon); usamos fotografía editorial con licencia libre (Unsplash/Pexels, uso
   * comercial permitido) descargada y servida desde este proyecto, nunca hotlinked.
   * Vacío ("") mientras no se haya incorporado esa foto: en ese caso los componentes que
   * consumen este campo (ver `BikeImage`) recurren al placeholder de texto de
   * `imagenPlaceholder`. Ver `obtenerImagenAmazonPAAPI` más abajo para el futuro reemplazo
   * por fotos reales de producto vía Amazon Associates.
   */
  imagen: string;
  imagenPlaceholder: string;
  galeria: string[] | null;
  medidasPropias: unknown | null;
  fechaActualizacion: string | null;
  fechaPrecioComprobado: string | null;
  destacada?: boolean;
};

/**
 * Punto de conexión (todavía SIN IMPLEMENTAR) con la Amazon Product Advertising API (PA-API
 * 5.0) para traer la imagen real de producto de un ASIN una vez tengamos una cuenta de
 * Amazon Associates aprobada. La PA-API solo se puede usar con una cuenta de Associates
 * activa y credenciales propias (access key, secret key, partner tag) — no tiene sentido
 * implementarla antes de tener esa cuenta. Cuando la tengamos, esta función sustituirá el
 * uso de `Bike.imagen` (foto de stock genérica) por la foto real del producto.
 * No se llama desde ningún sitio todavía.
 */
export async function obtenerImagenAmazonPAAPI(asin: string): Promise<string | null> {
  throw new Error(
    `obtenerImagenAmazonPAAPI("${asin}"): no implementado — pendiente de cuenta de Amazon Associates y credenciales de la Product Advertising API.`,
  );
}

export type Guia = {
  id: string;
  slug: string;
  categoria: string;
  titulo: string;
  resumen: string;
  minutosLectura: number;
  imagenPlaceholder: string;
  cuerpo: string[];
  productos: string[];
  fechaPublicacion: string;
  destacada?: boolean;
};

export type MejorCriterio = {
  titulo: string;
  descripcion: string;
};

export type MejorGanador = {
  bikeId: string;
  motivo: string;
};

export type MejorFaqItem = {
  pregunta: string;
  respuesta: string;
};

export type Mejor = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  intro: string;
  criterios: MejorCriterio[];
  ganadores: MejorGanador[];
  faq: MejorFaqItem[];
  imagenPlaceholder: string;
};

export type Accesorio = {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  precioAprox: number;
  nota: string;
  paraQue: string;
  imagenPlaceholder: string;
};

export type NavLink = { label: string; href: string };

/**
 * Pesos del motor de puntuación (ver domain/scoring.ts). Se calculan sobre 4 criterios
 * objetivos derivables de especificaciones publicadas — no 6: "confort" y "componentes" se
 * han retirado porque no hay una métrica objetiva de la que derivarlos sin pruebas propias
 * (`meta.pruebasPropias` es `false`). El peso que tenían (20+15=35 puntos) se ha
 * redistribuido proporcionalmente entre los 4 restantes.
 */
const PESOS_PUNTUACION: PesoPuntuacion[] = [
  {
    id: "autonomia",
    label: "Autonomía",
    peso: 40,
    que: "Percentil de la autonomía estimada (km) dentro del catálogo.",
  },
  {
    id: "potencia",
    label: "Motor",
    peso: 30,
    que: "Percentil del par motor (Nm) publicado por el fabricante.",
  },
  {
    id: "peso",
    label: "Peso",
    peso: 15,
    que: "Percentil inverso del peso de la bici en kg (menos peso, mejor nota).",
  },
  {
    id: "precio",
    label: "Precio",
    peso: 15,
    que: "Percentil inverso del precio: más barata dentro del catálogo, mejor nota.",
  },
];

const PERFIL_POR_TIPO: Record<string, PerfilUso> = {
  urbana: { llano: 0.85, cuestas: 0.35, largaDistancia: 0.3, carga: 0.25, transporte: 0.5, offroad: 0.1 },
  plegable: { llano: 0.75, cuestas: 0.3, largaDistancia: 0.25, carga: 0.2, transporte: 0.9, offroad: 0.05 },
  montana: { llano: 0.5, cuestas: 0.85, largaDistancia: 0.6, carga: 0.3, transporte: 0.2, offroad: 0.9 },
  trekking: { llano: 0.65, cuestas: 0.6, largaDistancia: 0.85, carga: 0.45, transporte: 0.35, offroad: 0.35 },
  cargo: { llano: 0.6, cuestas: 0.4, largaDistancia: 0.5, carga: 0.95, transporte: 0.25, offroad: 0.15 },
};

const USOS_POR_TIPO: Record<string, string[]> = {
  urbana: ["ciudad", "commuting"],
  plegable: ["ciudad", "multimodal"],
  montana: ["montaña", "offroad"],
  trekking: ["cicloturismo", "larga distancia"],
  cargo: ["carga", "familiar"],
};

type BikeRaw = Omit<Bike, "subs" | "puntuacion" | "perfil" | "usosRecomendados"> & { tipo: keyof typeof PERFIL_POR_TIPO };

/**
 * Catálogo de 14 e-bikes reales, investigadas por Alex por búsqueda web (no leídas
 * directamente de la ficha de Amazon en el momento de publicar, así que precios y algunas
 * specs son orientativos — ver `precioAproximado` y los `null` en cada bici). Cuando un dato
 * no se pudo confirmar, se deja en `null`/vacío en vez de inventarlo — la UI muestra "Dato no
 * publicado por el fabricante" en esos casos.
 *
 * HITWAY Electric Bike 27.5" (trekking) se investigó pero se ha dejado fuera del catálogo:
 * no se encontró ninguna cifra de precio, ni siquiera aproximada, así que no había forma de
 * publicarla sin inventar un número.
 */
const BIKES_RAW: BikeRaw[] = [
  {
    id: "b01",
    slug: "moma-bikes-ebike-28",
    marca: "Moma Bikes",
    modelo: "eBike-28\"",
    tipo: "urbana",
    categoriaId: "urbanas",
    precio: 900,
    precioAproximado: true,
    bateriaWh: 576,
    bateriaExtraible: true,
    autonomia: 80,
    autonomiaMin: 80,
    autonomiaMax: 80,
    motor: "250 W (tipo no confirmado)",
    motorTipo: null,
    parNm: 55,
    velocidad: 25,
    pesoKg: 20,
    cambios: "Shimano 7v",
    frenos: "Disco (tipo no confirmado)",
    suspension: null,
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "basico",
    plegable: false,
    carga: false,
    mejorPara: "Empezar con e-bike gastando poco sin renunciar a batería extraíble.",
    idealPara: "Trayectos urbanos cortos y llanos con presupuesto ajustado.",
    noEsPara: "Quien necesita confirmar el tipo exacto de motor o frenos antes de comprar: el fabricante no lo detalla.",
    porQue: "Uno de los precios de entrada más bajos del catálogo con una batería grande (576 Wh) para su rango de precio.",
    analisis:
      "Con 576 Wh es la batería más grande de las tres urbanas del catálogo, lo que explica su autonomía estimada de 80 km. Pesa 20 kg (la más ligera de las tres urbanas) y su motor entrega 55 Nm de par, aunque ni el fabricante ni la ficha investigada confirman el tipo exacto de motor ni de frenos, así que quedan marcados como 'no confirmado' en vez de asumir un valor.",
    pros: [
      "Batería de 576 Wh, la más grande de las urbanas del catálogo",
      "Con 20 kg, la más ligera de las tres urbanas",
      "Precio de entrada bajo y batería extraíble",
    ],
    contras: [
      "El fabricante no especifica el tipo de motor ni de frenos",
      "Precio investigado (900 €), no confirmado con exactitud por el fabricante",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 900,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/Moma-Bikes-Bicicleta-Electrica-EBIKE-28/dp/B018GV9BBS",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b02", "b03"],
    imagen: "",
    imagenPlaceholder: "Moma Bikes eBike-28 aparcada en una calle de ciudad",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b02",
    slug: "engwe-p275-se",
    marca: "ENGWE",
    modelo: "P275 SE",
    tipo: "urbana",
    categoriaId: "urbanas",
    precio: 899,
    precioAproximado: false,
    bateriaWh: 468,
    bateriaExtraible: true,
    autonomia: 120,
    autonomiaMin: 120,
    autonomiaMax: 120,
    motor: "250 W, sensor de par 42 Nm (tipo no confirmado)",
    motorTipo: null,
    parNm: 42,
    velocidad: 25,
    pesoKg: 24,
    cambios: null,
    frenos: "Hidráulicos",
    suspension: null,
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "medio",
    plegable: false,
    carga: false,
    mejorPara: "Buena autonomía por precio sin ser la más barata del catálogo.",
    idealPara: "Quien prioriza autonomía y frenos hidráulicos en el rango de precio urbano.",
    noEsPara: "Quien necesita saber el número de marchas antes de comprar: no está publicado.",
    porQue: "42 Nm de par y frenos hidráulicos por 899 €, con autonomía anunciada de hasta 120 km.",
    analisis:
      "Es la urbana del catálogo con más autonomía anunciada (hasta 120 km) y la única de las tres con frenos hidráulicos confirmados. El sensor de par de 42 Nm es razonable para el segmento y pesa 24 kg, en línea con las demás urbanas, aunque el fabricante no especifica si el motor es central o de buje.",
    pros: [
      "Autonomía anunciada de hasta 120 km, la más alta de las urbanas",
      "Frenos hidráulicos",
      "Sensor de par de 42 Nm y peso confirmado (24 kg)",
    ],
    contras: [
      "No se confirma si el motor es central o de buje",
      "No se confirma el número de marchas",
      "Precio investigado, no leído directamente de la ficha",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 899,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/ENGWE-Electrica-Hidr%C3%A1ulico-Neum%C3%A1ticos-P275/dp/B0FF4NRCBY",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b01", "b03"],
    imagen: "",
    imagenPlaceholder: "ENGWE P275 SE apoyada junto a un carril bici urbano",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: true,
  },
  {
    id: "b03",
    slug: "onesport-ot07",
    marca: "ONESPORT",
    modelo: "OT07",
    tipo: "urbana",
    categoriaId: "urbanas",
    precio: 729,
    precioAproximado: true,
    bateriaWh: 374,
    bateriaExtraible: true,
    autonomia: 80,
    autonomiaMin: 70,
    autonomiaMax: 90,
    motor: "250 W, sensor de par 65 Nm (tipo no confirmado)",
    motorTipo: null,
    parNm: 65,
    velocidad: 25,
    pesoKg: 24,
    cambios: null,
    frenos: "Hidráulicos",
    suspension: null,
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "medio",
    plegable: false,
    carga: false,
    mejorPara: "El precio de entrada más bajo del catálogo con frenos hidráulicos.",
    idealPara: "Presupuesto muy ajustado sin renunciar a frenos hidráulicos.",
    noEsPara: "Quien quiere una cifra de batería sin discrepancias entre fuentes.",
    porQue: "El precio más bajo investigado del catálogo (desde 729 €) con frenos hidráulicos y 65 Nm de par.",
    analisis:
      "Es la bici más barata investigada del catálogo (729-976 € según la oferta) y también la de mayor par motor de las tres urbanas (65 Nm). Ojo: las fuentes consultadas no coinciden en la capacidad de la batería (374 Wh calculados a partir de los amperios-hora declarados, 250 Wh según otra fuente) — publicamos la cifra calculada, pero es una discrepancia real que no hemos podido resolver.",
    pros: [
      "El precio más bajo investigado del catálogo",
      "65 Nm de par, el más alto de las urbanas",
      "Frenos hidráulicos y peso confirmado (24 kg)",
    ],
    contras: [
      "Discrepancia entre fuentes sobre la capacidad real de la batería",
      "No se confirma el número de marchas",
      "No se confirma el tipo de motor",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 729,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/ONESPORT-Bicicleta-El%C3%A9ctrica-OT07-Hidr%C3%A1ulicos/dp/B0DM26P9J6",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b01", "b02"],
    imagen: "",
    imagenPlaceholder: "ONESPORT OT07 aparcada frente a un portal de vivienda",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b04",
    slug: "engwe-p1",
    marca: "ENGWE",
    modelo: "P1",
    tipo: "plegable",
    categoriaId: "plegables",
    precio: 1399,
    precioAproximado: false,
    bateriaWh: 468,
    bateriaExtraible: true,
    autonomia: 57.5,
    autonomiaMin: 35,
    autonomiaMax: 80,
    motor: "250 W sin escobillas, 40 Nm (tipo no confirmado)",
    motorTipo: null,
    parNm: 40,
    velocidad: 25,
    pesoKg: 25,
    cambios: null,
    frenos: null,
    suspension: null,
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "medio",
    plegable: true,
    carga: false,
    mejorPara: "Quien busca una plegable con autonomía amplia y no le importa que sea 'semiplegable'.",
    idealPara: "Trayectos que combinan tramos largos con la necesidad de plegar la bici ocasionalmente.",
    noEsPara: "Quien necesita conocer el tipo de frenos antes de comprar.",
    porQue: "El rango de autonomía anunciado más amplio de las plegables del catálogo (35-80 km).",
    analisis:
      "El fabricante la describe como 'semiplegable', no plegable al 100 %, así que conviene comprobar el tamaño plegado real antes de asumir que cabe donde una plegable convencional. Motor sin escobillas de 250 W con 40 Nm de par, aunque el fabricante no confirma si es central o de buje.",
    pros: [
      "Rango de autonomía anunciado amplio (35-80 km)",
      "Batería extraíble de 468 Wh",
      "Peso moderado para su categoría (25 kg) y 40 Nm de par confirmado",
    ],
    contras: [
      "Es 'semiplegable', no plegable al 100 % según el propio fabricante",
      "No se confirma el tipo de frenos",
      "No se confirma si el motor es central o de buje",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1399,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/ENGWE-P1-Bicicleta-El%C3%A9ctrica-Plegable/dp/B0DF1PW1Y8",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b05", "b06"],
    imagen: "",
    imagenPlaceholder: "ENGWE P1 semiplegada junto a una mochila",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b05",
    slug: "ado-air20-pro",
    marca: "ADO",
    modelo: "Air20 Pro",
    tipo: "plegable",
    categoriaId: "plegables",
    precio: 1699,
    precioAproximado: true,
    bateriaWh: 346,
    bateriaExtraible: true,
    autonomia: 100,
    autonomiaMin: 100,
    autonomiaMax: 100,
    motor: "Buje Bafang 250 W, 40 Nm",
    motorTipo: "buje",
    parNm: 40,
    velocidad: 25,
    pesoKg: 18,
    cambios: "Automático interno 2v",
    frenos: null,
    suspension: null,
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "medio",
    plegable: true,
    carga: false,
    mejorPara: "La plegable más ligera investigada, con transmisión por correa.",
    idealPara: "Multimodal (tren/metro + bici) donde cada kilo cuenta al cargarla.",
    noEsPara: "Quien prioriza autonomía larga por encima de peso: 40 Nm es el par más bajo del trío plegable.",
    porQue: "18 kg con transmisión por correa (sin cadena que engrasar) y motor Bafang de 40 Nm.",
    analisis:
      "Con 18 kg es, de las tres plegables del catálogo, la más ligera investigada — un factor real si hay que subirla a un piso o a un tren a menudo. La transmisión por correa evita el mantenimiento de una cadena tradicional. El motor de buje Bafang de 40 Nm es coherente con una plegable ligera, no pensada para cuestas pronunciadas con carga.",
    pros: [
      "18 kg, la más ligera de las tres plegables investigadas",
      "Transmisión por correa, sin cadena que engrasar",
      "Cambio automático interno de 2 velocidades",
    ],
    contras: [
      "40 Nm de par, el más bajo de las tres plegables",
      "No se confirma con certeza el tipo de frenos",
      "Autonomía anunciada (100 km) sin desglose de condiciones de prueba",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1699,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/Air20Pro-Bicicleta-El%C3%A9ctrica-Transmisi%C3%B3n-Extra%C3%ADble/dp/B0DB5BGDKQ",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b04", "b06"],
    imagen: "",
    imagenPlaceholder: "ADO Air20 Pro plegada en un andén de tren",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: true,
  },
  {
    id: "b06",
    slug: "ado-air20-pro-ultra",
    marca: "ADO",
    modelo: "Air20 Pro Ultra",
    tipo: "plegable",
    categoriaId: "plegables",
    precio: 1699,
    precioAproximado: true,
    bateriaWh: 346,
    bateriaExtraible: true,
    autonomia: 100,
    autonomiaMin: 100,
    autonomiaMax: 100,
    motor: "Buje Bafang 250 W, 40 Nm",
    motorTipo: "buje",
    parNm: 40,
    velocidad: 25,
    pesoKg: 18,
    cambios: "Automático interno 2v",
    frenos: null,
    suspension: null,
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "completo",
    plegable: true,
    carga: false,
    mejorPara: "Como la Air20 Pro, pero con localización GPS integrada.",
    idealPara: "Quien quiere las mismas prestaciones que la Air20 Pro y le da valor a poder localizar la bici si se la roban.",
    noEsPara: "Quien no necesita GPS y prefiere pagar menos por la Air20 Pro estándar.",
    porQue: "Misma base que la Air20 Pro (18 kg, correa, 40 Nm) sumando localización GPS.",
    analisis:
      "Es la misma plataforma que la ADO Air20 Pro — mismo peso, motor y transmisión, según la propia investigación — con la adición de localización GPS. El precio investigado no está confirmado con exactitud, pero es previsiblemente algo superior al de la Air20 Pro estándar.",
    pros: [
      "Localización GPS integrada, útil en caso de robo",
      "Misma base ligera que la Air20 Pro (18 kg, transmisión por correa)",
      "Cambio automático interno de 2 velocidades",
    ],
    contras: [
      "Precio investigado, no confirmado con exactitud frente a la variante estándar",
      "40 Nm de par, el más bajo de las tres plegables",
      "No se confirma con certeza el tipo de frenos",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1699,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/dp/B0D9Y3HXZT",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b05", "b04"],
    imagen: "",
    imagenPlaceholder: "ADO Air20 Pro Ultra con panel de localización GPS visible",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b07",
    slug: "eskute-netuno",
    marca: "ESKUTE",
    modelo: "Netuno",
    tipo: "montana",
    categoriaId: "montana",
    precio: 1189,
    precioAproximado: true,
    bateriaWh: 522,
    bateriaExtraible: true,
    autonomia: 120,
    autonomiaMin: 120,
    autonomiaMax: 120,
    motor: "Bafang buje trasero 250 W, 45 Nm",
    motorTipo: "buje",
    parNm: 45,
    velocidad: 25,
    pesoKg: 26,
    cambios: "Shimano 7v",
    frenos: null,
    suspension: "Delantera",
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "medio",
    plegable: false,
    carga: false,
    mejorPara: "eMTB con batería grande y celdas de marca reconocida (Samsung) a precio de entrada.",
    idealPara: "Rutas de montaña largas donde la capacidad de batería importa más que la doble suspensión.",
    noEsPara: "Terreno técnico o de descenso: solo lleva suspensión delantera.",
    porQue: "522 Wh con celdas Samsung y autonomía estimada de 120 km, con motor Bafang de 45 Nm.",
    analisis:
      "De las tres montaña del catálogo es la de entrada de precio (1.189 €) y la que declara celdas de batería de una marca reconocida (Samsung). Con 26 kg (sin batería) y solo suspensión delantera, no compite con la doble suspensión de las otras dos eMTB del catálogo, pero tampoco su precio lo pretende.",
    pros: [
      "Celdas de batería Samsung declaradas por el fabricante",
      "522 Wh y autonomía estimada de 120 km",
      "El precio de entrada más bajo de las tres montaña",
    ],
    contras: [
      "Solo suspensión delantera, no doble",
      "No se confirma con certeza el tipo de frenos",
      "Peso publicado sin la batería puesta (26 kg), no el peso total real",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1189,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/ESKUTE-Bicicleta-Electrica-Bater%C3%ADa-Autonom%C3%ADa/dp/B09XDXT625",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b08", "b09"],
    imagen: "",
    imagenPlaceholder: "ESKUTE Netuno subiendo un camino de tierra en el bosque",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b08",
    slug: "moma-bikes-emtb-29-pro",
    marca: "Moma Bikes",
    modelo: "EMTB-29\" PRO Full Suspension",
    tipo: "montana",
    categoriaId: "montana",
    precio: 1047,
    precioAproximado: true,
    bateriaWh: 624,
    bateriaExtraible: false,
    autonomia: 120,
    autonomiaMin: 120,
    autonomiaMax: 120,
    motor: "Central 250 W, 70 Nm",
    motorTipo: "central",
    parNm: 70,
    velocidad: 25,
    pesoKg: 26,
    cambios: "Shimano 8v (Altus)",
    frenos: "Disco hidráulicos",
    suspension: "Doble (delantera y trasera)",
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "completo",
    plegable: false,
    carga: false,
    mejorPara: "Doble suspensión y frenos hidráulicos confirmados a precio de entrada dentro del catálogo.",
    idealPara: "Terreno más técnico donde la doble suspensión marca la diferencia frente a una rígida.",
    noEsPara: "Quien quiere un precio cerrado sin rango: varía bastante según la oferta (1.047-1.700 €).",
    porQue: "624 Wh, doble suspensión y frenos de disco hidráulicos confirmados, con precio investigado desde 1.047 €.",
    analisis:
      "Es la única de las tres montaña con doble suspensión (delantera y trasera) y frenos hidráulicos confirmados en la misma ficha, con un cuadro de aluminio 6061, motor central de 70 Nm de par y 26 kg de peso. El precio investigado varía mucho según la oferta (1.047-1.700 €), así que conviene comprobarlo antes de decidir solo por el número más bajo.",
    pros: [
      "Doble suspensión (delantera y trasera)",
      "Frenos de disco hidráulicos confirmados",
      "Motor central de 70 Nm de par",
      "Batería de 624 Wh integrada, Shimano 8v (Altus)",
    ],
    contras: ["Rango de precio investigado muy amplio (1.047-1.700 €), verificar antes de comprar"],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1047,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/Moma-Bikes-Bicicleta-Suspension-Hidr%C3%A1ulicos/dp/B0BY2PCBQR",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b07", "b09"],
    imagen: "",
    imagenPlaceholder: "Moma Bikes EMTB-29 PRO con doble suspensión en un sendero de montaña",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: true,
  },
  {
    id: "b09",
    slug: "accolmile-cola-bear",
    marca: "Accolmile",
    modelo: "Cola Bear",
    tipo: "montana",
    categoriaId: "montana",
    precio: 1742,
    precioAproximado: true,
    bateriaWh: 624,
    bateriaExtraible: false,
    autonomia: 70,
    autonomiaMin: 70,
    autonomiaMax: 70,
    motor: "Bafang central, 80 Nm",
    motorTipo: "central",
    parNm: 80,
    velocidad: 25,
    pesoKg: 31,
    cambios: "9v",
    frenos: "Hidráulicos Zoom",
    suspension: "SunTour delantera 100 mm + Kindshock trasera 52 mm",
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "completo",
    plegable: false,
    carga: false,
    mejorPara: "Suspensión delantera y trasera de marcas reconocidas (SunTour/Kindshock) en una eMTB.",
    idealPara:
      "Quien valora componentes de suspensión de marca (SunTour/Kindshock) por encima de tener la autonomía más larga: es la que menos autonomía declara de las tres montaña.",
    noEsPara: "Quien busca la autonomía más alta del trío montaña: con 70 km es la más corta de las tres.",
    porQue:
      "Suspensión delantera SunTour de 100 mm y trasera Kindshock de 52 mm, con 624 Wh de batería y motor Bafang central de 80 Nm de par.",
    analisis:
      "Es la más cara de las tres montaña investigadas (desde 1.742 €) y la única que detalla marcas concretas de suspensión (SunTour delantera, Kindshock trasera). Su motor Bafang central entrega 80 Nm de par — empatada con la Fischer Viator 4.2i como el par más alto del catálogo fuera de las cargo — pero su autonomía declarada (70 km) es la más corta de las tres montaña, y con 31 kg también es la más pesada. Disponible con rueda de 27,5\" o 29\" según la oferta.",
    pros: [
      "Suspensión de marca reconocida delante (SunTour) y detrás (Kindshock)",
      "80 Nm de par, empatada con la Fischer Viator 4.2i como el más alto fuera de las cargo",
      "Frenos hidráulicos Zoom y transmisión de 9 velocidades",
    ],
    contras: [
      "La autonomía declarada (70 km) es la más corta de las tres montaña",
      "Con 31 kg, la más pesada de las tres montaña",
      "La más cara de las tres montaña investigadas",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1742,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/Accolmile-Bicicleta-El%C3%A9ctrica-Suspensi%C3%B3n-Velocidades/dp/B0BGKHPWP8",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b07", "b08"],
    imagen: "",
    imagenPlaceholder: "Accolmile Cola Bear en una pista de montaña con roca suelta",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b10",
    slug: "flli-schiano-e-ride",
    marca: "F.lli Schiano",
    modelo: "E-Ride",
    tipo: "trekking",
    categoriaId: "trekking",
    precio: 699,
    precioAproximado: true,
    bateriaWh: 374,
    bateriaExtraible: true,
    autonomia: 90,
    autonomiaMin: 90,
    autonomiaMax: 90,
    motor: "250 W, 40 Nm",
    motorTipo: null,
    parNm: 40,
    velocidad: 25,
    pesoKg: 24,
    cambios: null,
    frenos: "Disco (tipo no confirmado)",
    suspension: null,
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "basico",
    plegable: false,
    carga: false,
    mejorPara: "El precio de entrada más bajo de todo el catálogo.",
    idealPara: "Presupuesto muy ajustado en formato trekking, sin exigir el número de marchas confirmado.",
    noEsPara: "Quien necesita el número de marchas confirmado antes de comprar: no está publicado.",
    porQue: "El precio más bajo investigado de todo el catálogo (desde 699 €), con motor de 40 Nm y autonomía anunciada de 90 km.",
    analisis:
      "Es la bici más barata investigada de todo el catálogo. Pesa 24 kg y anuncia una autonomía de 90 km — sigue faltando el número de marchas y el tipo exacto de frenos de disco, que quedan sin confirmar. Rueda de 28\".",
    pros: [
      "El precio más bajo investigado de todo el catálogo",
      "Autonomía anunciada de 90 km y 24 kg de peso",
      "Batería extraíble de 374 Wh",
    ],
    contras: ["Sin dato de número de marchas", "No se confirma el tipo de frenos de disco"],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 699,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/F-lli-Schiano-Bicicleta-Mujeres-Blanca/dp/B086HHSD2Z",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b11"],
    imagen: "",
    imagenPlaceholder: "F.lli Schiano E-Ride apoyada en una ruta de cicloturismo",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b11",
    slug: "fischer-viator-42i",
    marca: "Fischer",
    modelo: "Viator 4.2i",
    tipo: "trekking",
    categoriaId: "trekking",
    precio: 1400,
    precioAproximado: true,
    bateriaWh: 522,
    bateriaExtraible: null,
    autonomia: 120,
    autonomiaMin: 120,
    autonomiaMax: 120,
    motor: "Central Bafang M400, 80 Nm",
    motorTipo: "central",
    parNm: 80,
    velocidad: 25,
    pesoKg: 30,
    cambios: "Shimano 1x9",
    frenos: null,
    suspension: null,
    tallas: [],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "completo",
    plegable: false,
    carga: false,
    mejorPara: "Quien busca par motor alto y buena autonomía en formato trekking, con marca alemana especializada.",
    idealPara: "Quien prioriza par motor alto y una transmisión Shimano de 9 velocidades por encima de conocer el precio exacto de antemano.",
    noEsPara: "Quien necesita el precio exacto confirmado antes de comprar: solo hay un rango de gama investigado (1.400-2.800 €).",
    porQue: "80 Nm de par con motor central Bafang M400 y 120 km de autonomía anunciada, entre los datos más altos del catálogo fuera de las cargo.",
    analisis:
      "Marca alemana con motor central Bafang M400 de 80 Nm — empatada con la Accolmile Cola Bear como el par más alto del catálogo fuera de las cargo (que llevan motores pensados para tirar de peso) — y autonomía anunciada de 120 km, la más alta de las dos trekking. Pesa 30 kg. El precio, en cambio, sigue sin confirmarse con exactitud: solo hay un rango de gama investigado (1.400-2.800 €).",
    pros: [
      "80 Nm de par, empatada con la Accolmile Cola Bear como el más alto fuera de las cargo",
      "Autonomía anunciada de 120 km, la más alta de las dos trekking",
      "Transmisión Shimano 1x9",
    ],
    contras: [
      "Precio no confirmado con exactitud, solo un rango de gama muy amplio (1.400-2.800 €)",
      "No se confirma el tipo de frenos",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1400,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/Fischer-Bicicleta-el%C3%A9ctrica-Trekking-50cm-522Wh/dp/B0C1K9HVZ7",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b10"],
    imagen: "",
    imagenPlaceholder: "Fischer Viator 4.2i con alforjas en una ruta de trekking",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: true,
  },
  {
    id: "b12",
    slug: "engwe-le20-cargo",
    marca: "ENGWE",
    modelo: "LE20 Cargo",
    tipo: "cargo",
    categoriaId: "cargo",
    precio: 1650,
    precioAproximado: true,
    bateriaWh: 922,
    bateriaExtraible: true,
    autonomia: 180,
    autonomiaMin: 180,
    autonomiaMax: 180,
    motor: "Central Bafang/ENGWE 250 W, 100 Nm",
    motorTipo: "central",
    parNm: 100,
    velocidad: 25,
    pesoKg: 36.8,
    cambios: "Shimano 7v",
    frenos: "Disco hidráulicos 180 mm",
    suspension: null,
    tallas: [],
    cargaMaxima: 200,
    dimensiones: null,
    nivelEquipamiento: "completo",
    plegable: false,
    carga: true,
    mejorPara: "El mayor par motor de todo el catálogo, para tirar de carga o de dos niños.",
    idealPara: "Familias que necesitan cuadro longtail step-thru y hasta 200 kg de carga máxima.",
    noEsPara: "Quien busca la cargo más ligera: con 36,8 kg es la más pesada de las tres.",
    porQue: "100 Nm de par y 922 Wh de batería (variante sencilla), con carga máxima de 200 kg.",
    analisis:
      "Con 100 Nm es la de mayor par motor de todo el catálogo, coherente con un cuadro longtail step-thru pensado para llevar hasta 200 kg entre bici, conductor y carga. Existe también una variante de doble batería (1.843 Wh, hasta 350 km) que no es la que usamos como base en esta ficha — la base es la variante de batería sencilla (922 Wh, hasta 180 km).",
    pros: [
      "100 Nm de par, el más alto de todo el catálogo",
      "Frenos de disco hidráulicos de 180 mm confirmados",
      "Carga máxima de 200 kg, con variante de doble batería disponible",
    ],
    contras: [
      "36,8 kg, la más pesada del catálogo",
      "Rango de precio investigado amplio (1.650-1.850 €)",
      "Cuadro longtail: requiere más espacio de aparcamiento que una cargo compacta",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1650,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/ENGWE-Bicicleta-Electrica-El%C3%A9ctrica-Seguimiento/dp/B0DK3C43S5",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b13", "b14"],
    imagen: "",
    imagenPlaceholder: "ENGWE LE20 Cargo con caja delantera transportando a dos niños",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: true,
  },
  {
    id: "b13",
    slug: "fafrees-ff20-cuv",
    marca: "Fafrees",
    modelo: "FF20 CUV",
    tipo: "cargo",
    categoriaId: "cargo",
    precio: 1700,
    precioAproximado: true,
    bateriaWh: 576,
    bateriaExtraible: true,
    autonomia: 140,
    autonomiaMin: 140,
    autonomiaMax: 140,
    motor: "Buje trasero 250 W, 75 Nm",
    motorTipo: "buje",
    parNm: 75,
    velocidad: 25,
    pesoKg: 38,
    cambios: null,
    frenos: "Disco hidráulicos",
    suspension: "Doble (delantera y trasera)",
    tallas: [],
    cargaMaxima: 200,
    dimensiones: null,
    nivelEquipamiento: "medio",
    plegable: false,
    carga: true,
    mejorPara: "Cargo compacta de dos ruedas con neumáticos fatbike y doble suspensión.",
    idealPara: "Quien quiere una cargo más manejable que una longtail, con neumáticos anchos para más estabilidad.",
    noEsPara: "Quien necesita confirmar el número de marchas antes de comprar: no está claro si tiene cambio.",
    porQue: "Neumáticos fat de 20x3.0\", doble suspensión y manillar plegable, con 75 Nm de par.",
    analisis:
      "A diferencia de la ENGWE LE20, es una cargo clásica de dos ruedas (no longtail), con neumáticos fatbike de 20x3.0\" y doble suspensión que priorizan estabilidad sobre alcance de carga máximo. Pesa 38 kg. No está confirmado si dispone de cambio de marchas: la información investigada solo menciona los niveles de asistencia (PAS 0-3).",
    pros: [
      "Neumáticos fat 20x3.0\" con doble suspensión",
      "Manillar plegable para ahorrar espacio",
      "Carga máxima de 200 kg pese a ser más compacta que una longtail",
    ],
    contras: [
      "No está confirmado si tiene cambio de marchas",
      "Rango de precio investigado (1.700-1.800 €) sin confirmar",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1700,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/Fafrees-FF20-CUV-Fatbike-Bicicleta/dp/B0FP18ZH6N",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b12", "b14"],
    imagen: "",
    imagenPlaceholder: "Fafrees FF20 CUV con neumáticos anchos en una calle residencial",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b14",
    slug: "fafrees-f20-mate",
    marca: "Fafrees",
    modelo: "F20 Mate [Oficial]",
    tipo: "cargo",
    categoriaId: "cargo",
    precio: 1300,
    precioAproximado: true,
    bateriaWh: 874,
    bateriaExtraible: true,
    autonomia: 85,
    autonomiaMin: 55,
    autonomiaMax: 115,
    motor: "Buje trasero 500 W, 65 Nm",
    motorTipo: "buje",
    parNm: 65,
    velocidad: 25,
    pesoKg: 52,
    cambios: null,
    frenos: "Disco hidráulicos + freno de estacionamiento",
    suspension: null,
    tallas: [],
    cargaMaxima: 180,
    dimensiones: null,
    nivelEquipamiento: "completo",
    plegable: true,
    carga: true,
    esTriciclo: true,
    mejorPara: "Quien necesita la máxima estabilidad de un triciclo, no una bicicleta de dos ruedas.",
    idealPara: "Carga y estabilidad por encima de la ligereza: no hay que hacer equilibrio para mantenerla en pie.",
    noEsPara: "Quien busca una bicicleta de dos ruedas: esta es un triciclo, con las limitaciones de espacio y giro que eso implica.",
    porQue: "Motor de 500 W (el más potente en vatios del catálogo) con freno de estacionamiento, en formato triciclo plegable.",
    analisis:
      "Es un TRICICLO de 3 ruedas, no una bicicleta de 2 — lo indicamos explícitamente porque cambia por completo cómo se conduce, se aparca y se transporta frente al resto del catálogo. Con 52 kg es, con diferencia, la más pesada de todas las bicis (o triciclos) investigadas, coherente con su motor de 500 W y freno de estacionamiento, pensado para carga estable más que para ligereza.",
    pros: [
      "Estabilidad de triciclo: no requiere equilibrio para mantenerse en pie",
      "Freno de estacionamiento integrado",
      "5 niveles de asistencia (PAS) más control de crucero",
    ],
    contras: [
      "Es un triciclo, no una bicicleta de dos ruedas — ocupa más espacio y gira de forma distinta",
      "52 kg, con diferencia el más pesado del catálogo",
      "Rango de precio investigado muy disperso (1.300-2.400 €), verificar antes de comprar",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1300,
        disponibilidad: "disponible",
        affiliateUrl: null,
        urlProducto: "https://www.amazon.es/Fafrees-F20-Mate-Bicicleta-hidr%C3%A1ulicos/dp/B0CT3DKT5G",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b12", "b13"],
    imagen: "",
    imagenPlaceholder: "Fafrees F20 Mate, triciclo eléctrico plegable, aparcado en una acera",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
];

const METRICAS: MetricasBike[] = BIKES_RAW.map((b) => ({
  tipo: b.tipo,
  autonomiaKm: b.autonomiaMin !== null && b.autonomiaMax !== null ? (b.autonomiaMin + b.autonomiaMax) / 2 : null,
  parNm: b.parNm,
  pesoKg: b.pesoKg,
  precio: b.precio,
}));

const SUBS_CATALOGO = calcularSubsCatalogo(METRICAS);

const BIKES: Bike[] = BIKES_RAW.map((b, i) => ({
  ...b,
  subs: SUBS_CATALOGO[i],
  puntuacion: computeWeightedScore(SUBS_CATALOGO[i], PESOS_PUNTUACION),
  perfil: PERFIL_POR_TIPO[b.tipo],
  usosRecomendados: USOS_POR_TIPO[b.tipo],
}));

const CATEGORIAS_BASE: Omit<Categoria, "modelosCount">[] = [
  {
    id: "urbanas",
    slug: "urbanas",
    nombre: "Urbanas",
    claim: "Para el día a día en ciudad",
    imagenPlaceholder: "Ciclista urbano en e-bike cruzando un carril bici en la ciudad",
  },
  {
    id: "plegables",
    slug: "plegables",
    nombre: "Plegables",
    claim: "Se pliegan, caben en cualquier sitio",
    imagenPlaceholder: "E-bike plegable apoyada junto a una mochila en un andén de tren",
  },
  {
    id: "montana",
    slug: "montana",
    nombre: "Montaña",
    claim: "Motor y suspensión para el barro",
    imagenPlaceholder: "E-bike de montaña subiendo un sendero forestal con suspensión activa",
  },
  {
    id: "trekking",
    slug: "trekking",
    nombre: "Trekking",
    claim: "Rutas largas con equipaje",
    imagenPlaceholder: "E-bike de trekking con alforjas en una ruta de gravilla",
  },
  {
    id: "cargo",
    slug: "cargo",
    nombre: "Cargo",
    claim: "Lleva niños o la compra sin sudar",
    imagenPlaceholder: "E-bike de carga con caja delantera transportando a dos niños",
  },
];

const CATEGORIAS: Categoria[] = CATEGORIAS_BASE.map((c) => ({
  ...c,
  modelosCount: BIKES.filter((b) => b.categoriaId === c.id).length,
}));

export const EBG_DATA = {
  meta: {
    /**
     * El catálogo ya no es una demo de datos inventados: las 14 bicis son productos reales
     * investigados por búsqueda web (marca/modelo real, disponibles en amazon.es). Pero
     * tampoco es un catálogo "en producción" al uso: no hay pruebas propias
     * (`pruebasPropias: false`), los precios son orientativos (ver `precioAproximado` en cada
     * bici) y no hay afiliación activa todavía (`ofertas[].affiliateUrl` sigue en `null`). Por
     * eso `demo` pasa a `false` pero se añade `estadoCatalogo`/`mensajeEstado` para reflejar
     * este estado intermedio con honestidad en vez de mostrar "DEMO" (ya no es cierto) o
     * callarlo (tampoco sería cierto decir que está verificado al 100%).
     */
    demo: false,
    estadoCatalogo: "verificacion" as const,
    mensajeEstado:
      "Catálogo en verificación · productos reales, precios orientativos, sin afiliación activa todavía",
    nombre: "eBikeGuide",
    dominio: "https://ebike-guide.netlify.app",
    metodologiaUrl: "/metodologia/",
    pruebasPropias: false,
    evidenciaPorDefecto: "especificaciones",
    pesosPuntuacion: PESOS_PUNTUACION,
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

  categorias: CATEGORIAS,

  bikes: BIKES,

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
      cuerpo: [
        "El motor es lo primero que se anuncia y lo último que se entiende bien. Hay dos familias: motores centrales, montados en el eje de pedalier, y motores de buje, en la rueda delantera o trasera. La diferencia no es solo de ubicación: cambia cómo se reparte el peso, cómo responde en rampa y cuánto puedes exigirle.",
        "Un motor central mide el par que aplicas al pedal y lo multiplica, por lo que la asistencia se siente natural y escala con el esfuerzo. Es el estándar en bicis de gama media-alta —trekking, montaña, muchas urbanas premium— y es lo que llevan la Fischer Viator 4.2i o la Moma Bikes EMTB-29 PRO de este catálogo.",
        "Un motor de buje es más simple y barato de fabricar, por eso domina las e-bikes de entrada. Empuja con menos matiz —a menudo por velocidad, no por par pedaleado— y añade peso no suspendido en la rueda. Es lo que monta la ADO Air20 Pro: cumple en llano, se nota más en cuestas.",
        "El par (Nm) importa más que la potencia nominal, que en la UE está limitada a 250 W en la mayoría de casos. Un motor central de 100 Nm como el de la ENGWE LE20 Cargo tira con carga en rampa; uno de 30-40 Nm en una bici ligera es suficiente porque hay menos peso que mover.",
        "La recomendación práctica: si vas a llevar peso, subir cuestas con regularidad o rodar más de 40 km por salida, prioriza un motor central de par alto. Si tu uso es plano, corto y el precio manda, un motor de buje cumple y abarata la bici de forma notable.",
      ],
      productos: ["b11", "b05", "b12"],
      fechaPublicacion: "2026-07-14",
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
      cuerpo: [
        "La cifra de autonomía de una ficha técnica suele venir del test más favorable posible: asistencia mínima, terreno llano, ciclista ligero. En condiciones reales —asistencia alta, cuestas, más peso— es habitual perder entre un 30 % y un 50 % de esa cifra.",
        "Lo que de verdad determina cuántos km vas a hacer es la relación entre los Wh de la batería y el consumo medio de tu ruta en Wh/km. Nuestra calculadora de autonomía usa un modelo simplificado (8,5 Wh/km base, ajustado por peso, terreno y nivel de asistencia) para dar un rango realista en vez de una única cifra optimista.",
        "Como referencia de este catálogo: la ENGWE LE20 Cargo declara hasta 180 km gracias a 922 Wh; el ENGWE P1 declara entre 35 y 80 km con 468 Wh porque su rango depende mucho del nivel de asistencia usado.",
        "Regla práctica: calcula tu trayecto habitual en km, multiplícalo por dos si sueles ir en asistencia alta o hay cuestas, y busca una bici cuya autonomía mínima cubra ese número sin apurar la batería por debajo del 20 % de forma sistemática.",
      ],
      productos: ["b12", "b04", "b02"],
      fechaPublicacion: "2026-06-02",
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
      cuerpo: [
        "Las baterías de e-bike son de ion-litio y se degradan por ciclos de carga y por temperatura, no solo por el paso del tiempo. Cargar entre el 20 % y el 80 % en el día a día, en vez de siempre a 100 %, reduce el estrés químico y alarga la vida útil.",
        "El calor es el enemigo principal: no dejes la batería cargando al sol ni la guardes en el maletero de un coche en verano. El frío intenso reduce la autonomía de forma temporal pero no daña la batería igual que el calor.",
        "Para almacenamiento largo (más de unas semanas sin usar la bici), deja la batería en torno al 50-60 % de carga y en un sitio fresco y seco, no completamente vacía ni completamente llena.",
        "Una batería extraíble, como la del Moma Bikes eBike-28\", la ENGWE P275 SE o la ENGWE LE20 Cargo, facilita este cuidado porque puedes guardarla en casa en vez de dejar la bici entera a la intemperie con la batería puesta.",
      ],
      productos: ["b01", "b02", "b12"],
      fechaPublicacion: "2026-05-18",
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
      cuerpo: [
        "En España y la UE, una e-bike homologada como EPAC (pedaleo asistido) tiene un motor de hasta 250 W que deja de asistir a partir de 25 km/h. Todas las bicis de dos ruedas de este catálogo, como el Moma Bikes eBike-28\" o la ENGWE P275 SE, son de este tipo: legalmente se consideran bicicletas normales.",
        "Eso significa que no necesitan matrícula, seguro obligatorio ni casco (aunque se recomienda) para circular, y pueden usar carriles bici igual que una bicicleta convencional.",
        "Las e-bikes de hasta 45 km/h (conocidas como S-pedelec) son una categoría distinta: se consideran ciclomotor, exigen matrícula, seguro, casco homologado de ciclomotor y no pueden circular por carriles bici urbanos en la mayoría de casos. Ninguna bici de este catálogo entra en esta categoría — el triciclo Fafrees F20 Mate tampoco: sus 500 W y su límite de 25 km/h lo mantienen dentro del mismo marco EPAC, aunque conviene verificarlo antes de circular con él por ser un vehículo de 3 ruedas.",
        "Recomendación general aunque no sea obligatoria por ley: un seguro de responsabilidad civil es barato y cubre a terceros en caso de accidente, algo especialmente relevante si la e-bike pesa 20-30 kg (o más de 50 kg en el caso del triciclo de carga) y circula a más velocidad media que una bici convencional.",
      ],
      productos: ["b01", "b02"],
      fechaPublicacion: "2026-04-09",
    },
  ] as Guia[],

  mejores: [
    {
      id: "mejores-ebikes-urbanas-2026",
      slug: "mejores-ebikes-urbanas",
      titulo: "Las mejores e-bikes urbanas de 2026",
      resumen: "Tres perfiles distintos para moverte por ciudad, según lo que dice su ficha técnica: la de más autonomía, la de más par y la de entrada.",
      intro:
        "No existe «la mejor» e-bike urbana: existe la mejor para tu trayecto y tu presupuesto. Aquí comparamos las tres urbanas de nuestro catálogo según sus especificaciones publicadas, en vez de forzar un único ganador.",
      criterios: [
        { titulo: "Autonomía anunciada", descripcion: "Km que declara el fabricante para cada modelo." },
        { titulo: "Par motor", descripcion: "Nm del motor, cuando el fabricante lo publica." },
        { titulo: "Peso y frenos", descripcion: "Kilos a mover a mano y tipo de frenos, cuando están confirmados." },
        { titulo: "Precio", descripcion: "Coste de entrada frente a lo que ofrece cada modelo." },
      ],
      ganadores: [
        { bikeId: "b03", motivo: "24 kg confirmados y el par más alto (65 Nm) de las tres urbanas del catálogo." },
        { bikeId: "b02", motivo: "Autonomía anunciada de hasta 120 km, la más alta de las urbanas, con frenos hidráulicos confirmados." },
        { bikeId: "b01", motivo: "El precio de entrada más bajo con la batería más grande (576 Wh) de las tres urbanas." },
      ],
      faq: [
        {
          pregunta: "¿Necesito una e-bike con motor central para uso urbano?",
          respuesta: "No necesariamente. Un motor de buje cumple bien en ciudad llana y trayectos cortos; el motor central se nota más en cuestas y arranques con carga.",
        },
        {
          pregunta: "¿Merece la pena pagar más por batería extraíble?",
          respuesta: "Si no tienes dónde enchufar la bici entera (garaje comunitario sin toma, por ejemplo), sí: puedes subir solo la batería a casa a cargar.",
        },
        {
          pregunta: "¿Qué autonomía es suficiente para ciudad?",
          respuesta: "Para trayectos urbanos de menos de 15 km al día, 300-400 Wh suelen bastar sin cargar cada noche.",
        },
      ],
      imagenPlaceholder: "Tres e-bikes urbanas distintas aparcadas una junto a otra en una calle",
    },
    {
      id: "mejores-ebikes-menos-2000-euros",
      slug: "mejores-ebikes-menos-de-2000-euros",
      titulo: "Las mejores e-bikes por menos de 2.000 € (2026)",
      resumen: "Dónde se recorta a este precio, y qué modelos de nuestro catálogo recortan mejor según sus especificaciones publicadas.",
      intro:
        "Por debajo de 2.000 € toda e-bike recorta en algo: frenos, batería, componentes o equipamiento. La pregunta útil no es «cuál es perfecta» sino «cuál recorta lo que menos te importa a ti».",
      criterios: [
        { titulo: "Relación autonomía/precio", descripcion: "Km de autonomía estimados por cada euro invertido." },
        { titulo: "Par motor", descripcion: "Nm publicados, cuando el fabricante los confirma." },
        { titulo: "Frenos", descripcion: "Disco hidráulico frente a mecánico o sin confirmar a este rango de precio." },
      ],
      ganadores: [
        { bikeId: "b10", motivo: "699 €, el precio de entrada más bajo de todo el catálogo." },
        { bikeId: "b03", motivo: "729 € con frenos hidráulicos y peso confirmado (24 kg) — raro a este precio." },
        { bikeId: "b12", motivo: "100 Nm de par y carga máxima de 200 kg por 1.650 €, la cargo más asequible investigada." },
      ],
      faq: [
        {
          pregunta: "¿Qué es lo primero que recortan las e-bikes baratas?",
          respuesta: "Casi siempre los frenos (mecánicos en vez de disco hidráulico) y la información publicada: muchas fichas de entrada omiten peso, marchas o tipo exacto de motor.",
        },
        {
          pregunta: "¿Compensa esperar y ahorrar para una gama más alta?",
          respuesta: "Depende del uso: para trayectos cortos y llanos, una bici de entrada bien elegida cumple perfectamente y no hace falta sobrepagar.",
        },
      ],
      imagenPlaceholder: "E-bike económica con etiqueta de precio visible en una tienda",
    },
    {
      id: "mejores-ebikes-montana-2026",
      slug: "mejores-ebikes-montana-y-gravel",
      titulo: "Las mejores e-bikes de montaña de 2026",
      resumen: "De la doble suspensión de marca a la batería más grande de entrada: tres eMTB reales de nuestro catálogo, comparadas por especificaciones.",
      intro:
        "Comparamos las tres eMTB de nuestro catálogo por lo que realmente publica cada fabricante — batería, suspensión, frenos y precio — sin forzar una única ganadora para todos los usos.",
      criterios: [
        { titulo: "Batería y suspensión", descripcion: "Wh disponibles y si la suspensión es delantera o doble." },
        { titulo: "Frenos y transmisión", descripcion: "Tipo de frenos y número de marchas, cuando están confirmados." },
        { titulo: "Precio", descripcion: "Coste de entrada investigado frente a lo que ofrece cada modelo." },
      ],
      ganadores: [
        { bikeId: "b08", motivo: "624 Wh, doble suspensión y frenos hidráulicos confirmados desde 1.047 €." },
        { bikeId: "b09", motivo: "Suspensión de marca reconocida delante (SunTour) y detrás (Kindshock)." },
        { bikeId: "b07", motivo: "El precio de entrada más bajo de las tres, con celdas de batería Samsung declaradas." },
      ],
      faq: [
        {
          pregunta: "¿Necesito doble suspensión para hacer montaña con e-bike?",
          respuesta: "Solo si el terreno es técnico o el descenso es exigente. Para pistas y caminos, una rígida con buena horquilla delantera suele bastar.",
        },
        {
          pregunta: "¿Por qué algunas fichas no publican la autonomía?",
          respuesta: "Algunos fabricantes no certifican una cifra oficial para el mercado europeo, o solo publican una estimación muy general. Preferimos no publicar ninguna cifra a inventar una.",
        },
      ],
      imagenPlaceholder: "E-bike de montaña de doble suspensión apoyada en un mirador con vistas",
    },
  ] as Mejor[],

  accesorios: [
    {
      id: "acc-casco-urbano",
      slug: "casco-urbano-homologado",
      nombre: "Casco urbano homologado",
      categoria: "Seguridad",
      precioAprox: 45,
      nota: "No es obligatorio por ley en e-bikes de hasta 25 km/h, pero reduce muchísimo el riesgo en caso de caída.",
      paraQue: "Protección en trayectos urbanos y commuting diario.",
      imagenPlaceholder: "Casco de bicicleta urbano en color mate sobre una mesa",
    },
    {
      id: "acc-candado-u",
      slug: "candado-tipo-u-alta-seguridad",
      nombre: "Candado tipo U de alta seguridad",
      categoria: "Seguridad",
      precioAprox: 60,
      nota: "Una e-bike es un objetivo más atractivo para el robo que una bici convencional: no escatimes en el candado.",
      paraQue: "Evitar el robo al dejar la bici en la calle.",
      imagenPlaceholder: "Candado tipo U anclando una e-bike a una farola",
    },
    {
      id: "acc-luces",
      slug: "luces-delantera-trasera-recargables",
      nombre: "Set de luces delantera y trasera recargables",
      categoria: "Visibilidad",
      precioAprox: 35,
      nota: "Muchas e-bikes de gama media-alta ya las llevan integradas; en las más básicas conviene añadirlas.",
      paraQue: "Visibilidad y seguridad en trayectos con poca luz.",
      imagenPlaceholder: "Luz trasera de e-bike encendida en la oscuridad",
    },
    {
      id: "acc-alforjas",
      slug: "alforjas-impermeables",
      nombre: "Alforjas impermeables",
      categoria: "Transporte",
      precioAprox: 70,
      nota: "Imprescindibles en bicis de trekking o cicloturismo; útiles también para la compra semanal en una urbana.",
      paraQue: "Cargar equipaje o compra sin mochila.",
      imagenPlaceholder: "Alforjas impermeables instaladas en un portabultos trasero",
    },
    {
      id: "acc-funda-bateria",
      slug: "funda-protectora-bateria",
      nombre: "Funda protectora de batería",
      categoria: "Mantenimiento",
      precioAprox: 25,
      nota: "Protege la batería de golpes, lluvia y radiación solar directa, especialmente en baterías no extraíbles.",
      paraQue: "Alargar la vida útil de la batería.",
      imagenPlaceholder: "Funda de neopreno cubriendo una batería de e-bike integrada en el cuadro",
    },
    {
      id: "acc-soporte-movil",
      slug: "soporte-movil-manillar",
      nombre: "Soporte de móvil para manillar",
      categoria: "Accesorios",
      precioAprox: 20,
      nota: "Útil para navegación GPS en rutas largas; elige uno con sujeción firme y protección ante vibraciones.",
      paraQue: "Usar el móvil como navegador durante la ruta.",
      imagenPlaceholder: "Teléfono móvil montado en un soporte sobre el manillar de una e-bike",
    },
    {
      id: "acc-guardabarros",
      slug: "guardabarros-universales",
      nombre: "Guardabarros universales",
      categoria: "Componentes",
      precioAprox: 30,
      nota: "En modelos que no los llevan de serie, evitan salpicaduras en días de lluvia.",
      paraQue: "Ir a trabajar sin mancharte de barro o agua.",
      imagenPlaceholder: "Guardabarros trasero instalado sobre la rueda de una e-bike urbana",
    },
    {
      id: "acc-cargador-rapido",
      slug: "cargador-rapido-adicional",
      nombre: "Cargador rápido adicional",
      categoria: "Batería",
      precioAprox: 90,
      nota: "Útil si cargas en dos sitios distintos (casa y trabajo) para no tener que llevar el cargador contigo.",
      paraQue: "Cargar más rápido o en dos ubicaciones distintas.",
      imagenPlaceholder: "Cargador de e-bike enchufado junto a una batería extraíble",
    },
  ] as Accesorio[],

  trustItems: [
    "Comparamos especificaciones oficiales publicadas por cada fabricante",
    "Actualizamos precios y disponibilidad con frecuencia",
    "Señalamos con claridad qué enlaces son de afiliado",
    "Nunca alteramos una puntuación por acuerdos comerciales",
  ],
};

export type EbgData = typeof EBG_DATA;
