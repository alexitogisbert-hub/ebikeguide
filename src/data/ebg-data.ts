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
  imagen: string;
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
  bateriaWh: number | null;
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
  imagen: string;
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
    slug: "colorway-bk15",
    marca: "COLORWAY",
    modelo: "BK15",
    tipo: "urbana",
    categoriaId: "urbanas",
    precio: 600,
    precioAproximado: false,
    bateriaWh: 540,
    bateriaExtraible: null,
    autonomia: 60,
    autonomiaMin: 40,
    autonomiaMax: 80,
    motor: "Buje 250 W",
    motorTipo: "buje",
    parNm: null,
    velocidad: 25,
    pesoKg: 39,
    cambios: "7 velocidades",
    frenos: "Disco doble",
    suspension: "Horquilla delantera",
    tallas: ["Única"],
    cargaMaxima: 120,
    dimensiones: "188 × 60 × 103 cm",
    nivelEquipamiento: "basico",
    plegable: false,
    carga: false,
    mejorPara: "La urbana más barata del catálogo con batería de 540 Wh y autonomía de 40-80 km.",
    idealPara: "Primer contacto con e-bike urbana con presupuesto muy ajustado.",
    noEsPara: "Quien busca ligereza: con 39 kg y cuadro de acero, es la más pesada del catálogo.",
    porQue: "600 € con batería de 540 Wh, 7 velocidades, frenos de disco, suspensión delantera y luces.",
    analisis:
      "Es la urbana más barata del catálogo (600 €) y ofrece una batería de 540 Wh (36V 15Ah) con autonomía estimada de 40 a 80 km según condiciones. Ruedas de 26 × 2,125\", cuadro de acero de alto carbono, 7 velocidades, frenos de disco y horquilla delantera con suspensión. Pesa 39 kg, con diferencia la más pesada del catálogo, consecuencia directa del cuadro de acero. Carga máxima de 120 kg. Incluye bomba, pantalla LCD multifunción y luces delantera y trasera.",
    pros: [
      "600 €, la urbana más barata del catálogo",
      "Batería de 540 Wh con autonomía estimada de 40-80 km",
      "Carga máxima de 120 kg y ruedas de 26\" para estabilidad",
    ],
    contras: [
      "39 kg, la más pesada del catálogo: cuadro de acero de alto carbono",
      "Par motor no publicado; frenos de disco sin especificar si hidráulicos o mecánicos",
      "No se confirma si la batería es extraíble",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 600,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0CM93HNTQ?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/COLORWAY-Bicicleta-El%C3%A9ctrica-Extra%C3%ADble-amortiguadores/dp/B0CM93HNTQ",
        fechaComprobacion: "2026-08-27",
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b02", "b03"],
    imagen: "/bikes/colorway-bk15.webp",
    imagenPlaceholder: "COLORWAY BK15 azul apoyada junto a un carril bici urbano",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: "2026-08-27",
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
    motor: "Buje trasero 250 W, 42 Nm",
    motorTipo: "buje",
    parNm: 42,
    velocidad: 25,
    pesoKg: 24,
    cambios: "Shimano 7v",
    frenos: "Hidráulicos",
    suspension: "Horquilla delantera, tija de sillín con muelle",
    tallas: [],
    cargaMaxima: 120,
    dimensiones: "183 × 68 × 150 cm",
    nivelEquipamiento: "medio",
    plegable: false,
    carga: false,
    mejorPara: "Buena autonomía por precio sin ser la más barata del catálogo.",
    idealPara: "Quien prioriza autonomía y frenos hidráulicos en el rango de precio urbano.",
    noEsPara: "Quien quiere motor central: lleva motor de buje trasero.",
    porQue: "42 Nm de par y frenos hidráulicos por 899 €, con autonomía anunciada de hasta 120 km.",
    analisis:
      "Es la urbana del catálogo con más autonomía anunciada (hasta 120 km). Motor de buje trasero de 42 Nm con sensor de par, Shimano de 7 velocidades, frenos hidráulicos y doble suspensión (horquilla delantera y tija de sillín con muelle). Pesa 24 kg y mide 183 × 68 × 150 cm montada. Carga máxima de 120 kg. Incluye kit de herramientas.",
    pros: [
      "Autonomía anunciada de hasta 120 km, la más alta de las urbanas",
      "Frenos hidráulicos y Shimano 7v",
      "Sensor de par de 42 Nm y carga máxima de 120 kg",
      "Doble suspensión: horquilla delantera y tija de sillín con muelle",
    ],
    contras: [
      "Motor de buje trasero, no central",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 899,
        disponibilidad: "agotado",
        affiliateUrl: "https://www.amazon.es/dp/B0FF4NRCBY?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/ENGWE-Electrica-Hidr%C3%A1ulico-Neum%C3%A1ticos-P275/dp/B0FF4NRCBY",
        fechaComprobacion: "2026-08-27",
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b01", "b03"],
    imagen: "/bikes/engwe-p275-se.webp",
    imagenPlaceholder: "ENGWE P275 SE apoyada junto a un carril bici urbano",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
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
    motor: "Central 250 W, 65 Nm",
    motorTipo: "central",
    parNm: 65,
    velocidad: 25,
    pesoKg: 24,
    cambios: "7 velocidades",
    frenos: "Hidráulicos 160 mm",
    suspension: "Horquilla delantera",
    tallas: [],
    cargaMaxima: 120,
    dimensiones: "190 × 67 × 105 cm",
    nivelEquipamiento: "completo",
    plegable: false,
    carga: false,
    mejorPara: "El precio de entrada más bajo del catálogo con frenos hidráulicos.",
    idealPara: "Presupuesto muy ajustado sin renunciar a frenos hidráulicos.",
    noEsPara: "Quien quiere una cifra de batería sin discrepancias entre fuentes.",
    porQue: "El precio más bajo investigado del catálogo (desde 729 €) con motor central de 65 Nm de par.",
    analisis:
      "Es la bici más barata investigada del catálogo (729-976 € según la oferta) y monta un motor central de 65 Nm de par, el más alto de las tres urbanas. Cambio de 7 velocidades, frenos hidráulicos de 160 mm y horquilla delantera con suspensión. Incluye guardabarros, portaequipajes, luces, bomba, bocina y kit de herramientas. Pesa 24 kg y mide 190 × 67 × 105 cm. Carga máxima de 120 kg.",
    pros: [
      "El precio más bajo investigado del catálogo",
      "Motor central de 65 Nm, el mayor par de las urbanas",
      "Frenos hidráulicos, 7 velocidades y peso confirmado (24 kg)",
    ],
    contras: [
      "374 Wh de batería, la más baja de las tres urbanas",
      "Suspensión delantera sin marca confirmada",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 729,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0DM26P9J6?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/ONESPORT-Bicicleta-El%C3%A9ctrica-OT07-Hidr%C3%A1ulicos/dp/B0DM26P9J6",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b01", "b02"],
    imagen: "/bikes/onesport-ot07.webp",
    imagenPlaceholder: "ONESPORT OT07 aparcada frente a un portal de vivienda",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b04",
    slug: "hitway-bk6sl1",
    marca: "HITWAY",
    modelo: "BK6SL1",
    tipo: "plegable",
    categoriaId: "plegables",
    precio: 800,
    precioAproximado: false,
    bateriaWh: 562,
    bateriaExtraible: true,
    autonomia: 110,
    autonomiaMin: 70,
    autonomiaMax: 150,
    motor: "250 W sin escobillas",
    motorTipo: null,
    parNm: null,
    velocidad: 25,
    pesoKg: 29,
    cambios: "7 velocidades",
    frenos: "Disco mecánico",
    suspension: "Horquilla delantera",
    tallas: ["Única"],
    cargaMaxima: 120,
    dimensiones: "164 × 56 × 120 cm",
    nivelEquipamiento: "medio",
    plegable: true,
    carga: false,
    mejorPara: "Quien busca una plegable con mucha autonomía y equipamiento práctico (portaequipajes + bolsa) a buen precio.",
    idealPara: "Desplazamientos diarios y rutas largas donde la autonomía amplia (70-150 km) marca la diferencia.",
    noEsPara: "Quien priorice el peso: 29 kg es pesada para subir escaleras.",
    porQue: "El rango de autonomía anunciado más amplio de las plegables del catálogo (70-150 km) con batería de 562 Wh por 800 €.",
    analisis:
      "Cuadro de aluminio plegable de 20\" con motor de 250 W, batería extraíble de 562 Wh (36 V / 15,6 Ah) y autonomía declarada de 70-150 km. Frenos de disco mecánico, suspensión delantera, 7 velocidades y carga máxima de 120 kg. Incluye portaequipajes delantero, bolsa trasera, control por App, pantalla LCD y protección IP54. Pesa 29 kg.",
    pros: [
      "Autonomía declarada muy amplia (70-150 km) con 562 Wh",
      "Batería extraíble y precio contenido (800 €)",
      "Equipamiento práctico incluido: portaequipajes, bolsa, bomba, candado",
    ],
    contras: [
      "29 kg: pesada para una plegable",
      "Frenos de disco mecánico, no hidráulicos",
      "Par motor no publicado",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 800,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0DHZK2YDD?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/dp/B0DHZK2YDD",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b05", "b06"],
    imagen: "/bikes/hitway-bk6sl1.webp",
    imagenPlaceholder: "HITWAY BK6SL1 plegada en negro junto a una bolsa de transporte",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
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
    precioAproximado: false,
    bateriaWh: 346,
    bateriaExtraible: true,
    autonomia: 100,
    autonomiaMin: 100,
    autonomiaMax: 100,
    motor: "Buje Bafang 250 W, 50 Nm",
    motorTipo: "buje",
    parNm: 50,
    velocidad: 25,
    pesoKg: 19,
    cambios: "Automático interno Bafang 2v",
    frenos: "Disco hidráulico",
    suspension: "Horquilla delantera ajustable con bloqueo",
    tallas: ["Única"],
    cargaMaxima: 120,
    dimensiones: "85 × 48 × 67 cm (plegada)",
    nivelEquipamiento: "completo",
    plegable: true,
    carga: false,
    mejorPara: "Plegable ligera con transmisión por correa, NFC y nivel de acabado alto.",
    idealPara: "Multimodal (tren/metro + bici) donde cada kilo cuenta al cargarla y se valora cero mantenimiento de transmisión.",
    noEsPara: "Quien prioriza autonomía larga por encima de todo: 100 km anunciados sin desglose de condiciones.",
    porQue: "19 kg con transmisión por correa de carbono, motor Bafang de 50 Nm con sensor de par, pantalla IPS NFC e IPX6.",
    analisis:
      "Versión 2026 de la Air20 Pro. Con 19 kg es una de las plegables más ligeras del catálogo. Motor de buje Bafang de 50 Nm con sensor de par y cambio automático interno de 2 velocidades. Transmisión por correa de fibra de carbono, sin cadena que engrasar. Pantalla IPS a color de 2,4\" con desbloqueo NFC, certificación IPX6 (pantalla IPX7). Frenos de disco hidráulicos y horquilla ajustable con bloqueo. Plegada mide 85 × 48 × 67 cm. Incluye cesta delantera plegable y portaequipajes trasero con sistema MIK.",
    pros: [
      "19 kg, una de las plegables más ligeras del catálogo",
      "Transmisión por correa de fibra de carbono, sin cadena que engrasar",
      "Motor Bafang 50 Nm con sensor de par y cambio automático interno 2v",
      "Pantalla IPS NFC, IPX6, cesta y portaequipajes MIK incluidos",
    ],
    contras: [
      "Autonomía anunciada (100 km) sin desglose de condiciones de prueba",
      "Motor de buje, no central",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1699,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0GCZ6SVDV?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/dp/B0GCZ6SVDV",
        fechaComprobacion: "2026-08-27",
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b04", "b06"],
    imagen: "/bikes/ado-air20-pro.webp",
    imagenPlaceholder: "ADO Air20 Pro plegada en un andén de tren",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: null,
    destacada: true,
  },
  {
    id: "b06",
    slug: "legend-siena",
    marca: "LEGEND EBIKES",
    modelo: "Siena",
    tipo: "plegable",
    categoriaId: "plegables",
    precio: 1400,
    precioAproximado: false,
    bateriaWh: 470,
    bateriaExtraible: true,
    autonomia: 90,
    autonomiaMin: 90,
    autonomiaMax: 90,
    motor: "Buje trasero MAHLE 250 W, 40 Nm",
    motorTipo: "buje",
    parNm: 40,
    velocidad: 25,
    pesoKg: 21,
    cambios: "Shimano 7v",
    frenos: "Disco hidráulico",
    suspension: null,
    tallas: ["Única"],
    cargaMaxima: null,
    dimensiones: "163 × 59 × 113 cm; plegada 86,5 × 79,8 × 46 cm",
    nivelEquipamiento: "completo",
    plegable: true,
    carga: false,
    mejorPara: "Plegable de paseo con ruedas de 24\", diseño clásico y fabricación española.",
    idealPara: "Quien busca una plegable cómoda para paseo urbano con ruedas grandes (24\"), guardabarros y porta-bultos incluidos.",
    noEsPara: "Quien busca la plegable más compacta o ligera: con ruedas de 24\" y 21 kg no es la más fácil de subir escaleras.",
    porQue: "Plegable de 24\" con frenos hidráulicos, Shimano 7v, sistema MAHLE SmartBike, batería de 470 Wh y conectores IP67 por 1.400 €.",
    analisis:
      "Plegable de paseo con ruedas de 24 pulgadas, las más grandes entre las plegables del catálogo, lo que aporta estabilidad y comodidad frente a las habituales de 20\". Motor de buje trasero MAHLE de 250 W con 40 Nm y sensor de velocidad, Shimano de 7 velocidades y frenos de disco hidráulicos. Cuadro de aluminio 6061 T6 plegable en 5 segundos: montada mide 163 × 59 × 113 cm, plegada 86,5 × 79,8 × 46 cm. Pesa 21 kg. Incluye luces LED Spanninga Kendo+ 30 LUX, guardabarros, pata de cabra, porta-bultos compatible con asiento infantil (hasta 27 kg) y anclaje KLICKfix. Conectores IP67 impermeables. Sistema MAHLE SmartBike con app Bluetooth. Fabricada por una empresa de Barcelona.",
    pros: [
      "Ruedas de 24\", las más grandes entre las plegables del catálogo",
      "Equipamiento completo: luces LED 30 LUX, guardabarros, porta-bultos KLICKfix",
      "Frenos de disco hidráulicos y Shimano 7v",
      "Batería de 470 Wh extraíble con autonomía anunciada de hasta 90 km",
    ],
    contras: [
      "21 kg y plegada 86,5 × 79,8 × 46 cm: no es la más compacta para transporte",
      "Sensor de velocidad, no de par: la asistencia no se adapta al esfuerzo del pedaleo",
      "Suspensión rígida, solo amortiguación de los neumáticos balloon",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1400,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B07PX766T3?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/LEGEND-EBIKES-Velocidades-Bicicletas-Hidr%C3%A1ulicos/dp/B07PX766T3",
        fechaComprobacion: "2026-08-27",
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b05", "b04"],
    imagen: "/bikes/legend-siena.webp",
    imagenPlaceholder: "Legend Siena plegada en blanco junto a un portal urbano",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: "2026-08-27",
    destacada: false,
  },
  {
    id: "b08",
    slug: "antgooat-speedy-29",
    marca: "Antgooat",
    modelo: "Speedy 29\"",
    tipo: "montana",
    categoriaId: "montana",
    precio: 1299,
    precioAproximado: false,
    bateriaWh: 720,
    bateriaExtraible: true,
    autonomia: 120,
    autonomiaMin: 90,
    autonomiaMax: 120,
    motor: "Buje trasero 250 W sin escobillas, 80 Nm",
    motorTipo: "buje",
    parNm: 80,
    velocidad: 25,
    pesoKg: 31,
    cambios: "7 velocidades",
    frenos: "Disco hidráulicos",
    suspension: "Horquilla delantera",
    tallas: ["Única"],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "completo",
    plegable: false,
    carga: false,
    mejorPara: "720 Wh, 80 Nm de par y frenos hidráulicos por 1.299 €: mucha eMTB por el precio.",
    idealPara: "Ciclistas de 170-195 cm que buscan una eMTB de 29\" con batería grande y extraíble.",
    noEsPara: "Quien busca doble suspensión o motor central: lleva horquilla delantera y motor de buje.",
    porQue: "80 Nm, 720 Wh de batería extraíble, frenos hidráulicos y guardabarros incluidos, por 1.299 €.",
    analisis:
      "eMTB de 29\" con 80 Nm de par (motor de buje trasero) y 720 Wh de batería extraíble, lo que le da hasta 120 km de autonomía declarada en modo de asistencia baja. Pesa 31 kg. Frenos de disco hidráulicos, 7 velocidades, suspensión delantera, guardabarros y luces LED incluidas. Disponible en gris y verde. Apta para ciclistas de 170-195 cm. Marca menos conocida, pero con precio competitivo para las prestaciones que ofrece.",
    pros: [
      "720 Wh de batería extraíble, la más grande entre las eMTB del catálogo",
      "80 Nm de par, potente para cuestas",
      "Frenos de disco hidráulicos y guardabarros incluidos",
    ],
    contras: [
      "31 kg, de las más pesadas del catálogo",
      "Solo suspensión delantera, sin amortiguador trasero",
      "Marca poco conocida (Antgooat), menos respaldo postventa que marcas establecidas",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1299,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0DDTGW3KW?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/dp/B0DDTGW3KW",
        fechaComprobacion: "2026-08-27",
        envio: null,
        comision: null,
      },
    ],
    alternativas: [],
    imagen: "/bikes/antgooat-speedy-29.webp",
    imagenPlaceholder: "Antgooat Speedy 29 en un sendero de montaña",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: "2026-08-27",
    destacada: true,
  },
  {
    id: "b09",
    slug: "nilox-x8-plus",
    marca: "Nilox",
    modelo: "X8 Plus",
    tipo: "plegable",
    categoriaId: "plegables",
    precio: 999,
    precioAproximado: false,
    bateriaWh: 468,
    bateriaExtraible: true,
    autonomia: 70,
    autonomiaMin: 70,
    autonomiaMax: 70,
    motor: "250 W sin escobillas",
    motorTipo: null,
    parNm: null,
    velocidad: 25,
    pesoKg: 24,
    cambios: "Shimano 7 velocidades",
    frenos: "Disco mecánico",
    suspension: "Rígida",
    tallas: ["Única"],
    cargaMaxima: 120,
    dimensiones: "166 × 59 × 111 cm",
    nivelEquipamiento: "medio",
    plegable: true,
    carga: false,
    mejorPara: "Quien busca una fat bike plegable de 20\" con batería extraíble y marca europea a menos de 1.000 €.",
    idealPara: "Desplazamientos urbanos y caminos sin asfaltar donde los neumáticos FAT de 20\" × 4\" aportan tracción extra.",
    noEsPara: "Quien necesita suspensión: el cuadro es rígido.",
    porQue:
      "Neumáticos FAT de 20\" × 4\", batería extraíble de 468 Wh, cuadro plegable de acero aleado y Shimano 7v por 999 €.",
    analisis:
      "Fat bike plegable de 20\" × 4\" con motor de 250 W y batería extraíble de 468 Wh (36 V / 13 Ah). Cuadro de acero aleado plegable, frenos de disco mecánico, Shimano 7 velocidades, luces LED delanteras y traseras con función stop, pantalla LCD con 5 modos de asistencia, portaequipajes trasero y protección IP54. Pesa 24 kg según el fabricante (Nilox, marca italiana). Sin suspensión.",
    pros: [
      "Neumáticos FAT de 20\" × 4\" para tracción en caminos",
      "Batería extraíble de 468 Wh y cuadro plegable",
      "Shimano 7 velocidades, luces LED con función stop, pantalla LCD",
    ],
    contras: [
      "Cuadro rígido: sin suspensión delantera ni trasera",
      "Frenos de disco mecánico, no hidráulicos",
      "Par motor no publicado",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 999,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B09STYG3LB?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/dp/B09STYG3LB",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b04", "b12"],
    imagen: "/bikes/nilox-x8-plus.webp",
    imagenPlaceholder: "Nilox X8 Plus en color vainilla plegada junto a un portaequipajes",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b10",
    slug: "touroll-j1",
    marca: "Touroll",
    modelo: "J1/J2 ST",
    tipo: "trekking",
    categoriaId: "trekking",
    precio: 699,
    precioAproximado: false,
    bateriaWh: null,
    bateriaExtraible: true,
    autonomia: 100,
    autonomiaMin: 100,
    autonomiaMax: 100,
    motor: "250 W, 45 Nm",
    motorTipo: null,
    parNm: 45,
    velocidad: 25,
    pesoKg: null,
    cambios: null,
    frenos: "Disco",
    suspension: "Horquilla delantera",
    tallas: ["M-L"],
    cargaMaxima: null,
    dimensiones: null,
    nivelEquipamiento: "basico",
    plegable: false,
    carga: false,
    mejorPara: "Trekking de entrada con 45 Nm de par y frenos de disco por 699 €.",
    idealPara: "Primer contacto con e-bike trekking/urbana con presupuesto ajustado y batería extraíble.",
    noEsPara: "Quien necesita datos técnicos completos: la ficha del fabricante es muy escueta.",
    porQue: "699 € con 45 Nm de par, batería extraíble de 15,6 Ah, frenos de disco y autonomía anunciada de 100 km.",
    analisis:
      "Trekking/urbana nueva en Amazon (julio 2026) con motor de 250 W y 45 Nm de par. Batería extraíble de 15,6 Ah (voltaje no especificado en la ficha, por lo que los Wh no se pueden confirmar). Autonomía anunciada de 100 km. Frenos de disco y horquilla delantera con suspensión. La ficha del fabricante es muy escueta: no publica peso, material del cuadro, rueda, marchas ni tipo exacto de motor. Modelo 2026 (J1/J2 ST), cuadro step-through.",
    pros: [
      "699 € con 45 Nm de par y frenos de disco",
      "Batería extraíble de 15,6 Ah con autonomía anunciada de 100 km",
      "Modelo 2026, nuevo en Amazon",
    ],
    contras: [
      "Ficha muy escueta: no publica peso, marchas, rueda ni Wh de batería",
      "Tipo de motor (buje/central) no especificado",
      "Sin opiniones suficientes para valorar fiabilidad a largo plazo",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 699,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0HCBKYT9C?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/Touroll-Bicicleta-el%C3%A9ctrica-Autonom%C3%ADa-Desmontable/dp/B0HCBKYT9C",
        fechaComprobacion: "2026-08-27",
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b15"],
    imagen: "/bikes/touroll-j1.webp",
    imagenPlaceholder: "Touroll J1 verde en una ruta de cicloturismo",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: "2026-08-27",
    destacada: false,
  },
  {
    id: "b11",
    slug: "bodywel-t16pro",
    marca: "Bodywel",
    modelo: "T16PRO",
    tipo: "plegable",
    categoriaId: "plegables",
    precio: 430,
    precioAproximado: false,
    bateriaWh: 360,
    bateriaExtraible: true,
    autonomia: 45,
    autonomiaMin: 35,
    autonomiaMax: 45,
    motor: "Buje trasero 250 W brushless",
    motorTipo: "buje",
    parNm: null,
    velocidad: 25,
    pesoKg: 20.8,
    cambios: null,
    frenos: "Disco mecánico doble",
    suspension: "Horquilla delantera + amortiguador central",
    tallas: [],
    cargaMaxima: 120,
    dimensiones: null,
    nivelEquipamiento: "completo",
    plegable: true,
    carga: false,
    mejorPara: "Última milla urbana y transporte público: ultra-compacta de 14\" y 20,8 kg.",
    idealPara: "Quien necesita una e-bike que se pliegue con manillar incluido, quepa en transporte público y cueste menos de 450 €.",
    noEsPara: "Quien busca largas distancias: con 360 Wh y rueda de 14\", está pensada para trayectos cortos.",
    porQue: "430 € con batería de 360 Wh, plegado completo con manillar, display de 4,5\" y solo 20,8 kg.",
    analisis:
      "Mini plegable de 14\" con motor de buje trasero de 250 W. No publica par motor, pero a este precio (430 €) y formato no se espera: está pensada para tramos cortos en llano, no para cuestas cargada. La batería de 360 Wh da una autonomía estimada de 35-45 km según asistencia, suficiente para última milla. Pesa 20,8 kg y pliega manillar además de cuadro, lo que facilita llevarla en metro o autobús. Incluye doble freno de disco mecánico, horquilla delantera con amortiguador central, luces integradas y display LED de 4,5\". Carga máxima de 120 kg. Rango de altura recomendado: 140-185 cm.",
    pros: [
      "430 €, uno de los precios más bajos del catálogo",
      "20,8 kg con plegado completo incluyendo manillar",
      "Rueda de 14\" y formato mini ideal para última milla y transporte público",
    ],
    contras: [
      "Par motor no publicado y rueda de 14\" — no está pensada para cuestas ni distancias largas",
      "Autonomía de 35-45 km, la más corta del catálogo",
      "Frenos de disco mecánicos, no hidráulicos",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 430,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0F1MQXYB5?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/dp/B0F1MQXYB5",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b05", "b04"],
    imagen: "/bikes/bodywel-t16pro.webp",
    imagenPlaceholder: "Bodywel T16PRO plegada junto a una parada de metro",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b12",
    slug: "engwe-ep2-boost",
    marca: "ENGWE",
    modelo: "EP-2 BOOST",
    tipo: "plegable",
    categoriaId: "plegables",
    precio: 1049,
    precioAproximado: false,
    bateriaWh: 624,
    bateriaExtraible: null,
    autonomia: 120,
    autonomiaMin: 100,
    autonomiaMax: 120,
    motor: "Buje trasero 250 W sin escobillas, 55 Nm",
    motorTipo: "buje",
    parNm: 55,
    velocidad: 25,
    pesoKg: 30,
    cambios: "7 velocidades",
    frenos: "Disco mecánico 180 mm",
    suspension: "Horquilla delantera",
    tallas: ["Única"],
    cargaMaxima: 150,
    dimensiones: null,
    nivelEquipamiento: "completo",
    plegable: true,
    carga: false,
    mejorPara: "Plegable fatbike con sensor de par y 624 Wh: mucha batería para una plegable de 20\".",
    idealPara: "Quien quiere una plegable robusta con neumáticos anchos 20×4.0\" para ciudad y caminos.",
    noEsPara: "Quien busca la plegable más ligera: con 30 kg es más pesada que una plegable urbana estándar.",
    porQue: "Sensor de par (no de velocidad), 624 Wh de batería, neumáticos fat de 20×4.0\" y plegable, por 1.049 €.",
    analisis:
      "La EP-2 BOOST es una plegable fatbike de 20×4.0\" con sensor de par — algo poco habitual en plegables de este precio. Con 624 Wh de batería y 55 Nm de par, ofrece más autonomía y potencia que la mayoría de plegables del catálogo, a cambio de más peso (30 kg). Frenos de disco mecánicos de 180 mm, cuadro de aluminio 6061 y 7 velocidades. Sin acelerador, pero con botón boost para asistencia extra puntual.",
    pros: [
      "Sensor de par, poco habitual en plegables de este rango de precio",
      "624 Wh de batería, hasta 120 km de autonomía declarada",
      "Neumáticos fat 20×4.0\" para estabilidad en distintos terrenos",
    ],
    contras: [
      "30 kg, pesada para una plegable (difícil de subir escaleras)",
      "Frenos de disco mecánicos, no hidráulicos",
      "Cambios genéricos de 7 velocidades, sin marca Shimano confirmada",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1049,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0FJLDH3H9?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/dp/B0FJLDH3H9",
        fechaComprobacion: "2026-08-27",
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b04"],
    imagen: "/bikes/engwe-ep2-boost.webp",
    imagenPlaceholder: "ENGWE EP-2 BOOST plegada junto al maletero de un coche",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: "2026-08-27",
    destacada: true,
  },
  {
    id: "b13",
    slug: "fafrees-ff20-cuv",
    marca: "Fafrees",
    modelo: "FF20 CUV",
    tipo: "cargo",
    categoriaId: "cargo",
    precio: 1800,
    precioAproximado: false,
    bateriaWh: 1152,
    bateriaExtraible: true,
    autonomia: 140,
    autonomiaMin: 100,
    autonomiaMax: 140,
    motor: "Buje trasero 250 W, 75 Nm",
    motorTipo: "buje",
    parNm: 75,
    velocidad: 25,
    pesoKg: 38,
    cambios: "Shimano 7v",
    frenos: "Disco hidráulicos",
    suspension: "Horquilla delantera 60 mm + amortiguador trasero 15 mm",
    tallas: ["Única"],
    cargaMaxima: 200,
    dimensiones: "190 × 67 × 120 cm (desplegada), 190 × 50 × 85 cm (manillar plegado)",
    nivelEquipamiento: "completo",
    plegable: false,
    carga: true,
    mejorPara: "Cargo compacta de dos ruedas con sensor de par, doble suspensión y IPX5.",
    idealPara: "Quien quiere una cargo manejable con neumáticos anchos, cesta delantera y asiento trasero para niños.",
    noEsPara: "Quien necesita un motor central: lleva motor de buje trasero.",
    porQue: "Doble batería de 1.152 Wh totales, 75 Nm de par, doble suspensión, Shimano 7v y manillar plegable.",
    analisis:
      "Cargo longtail familiar con doble batería (576 Wh × 2 = 1.152 Wh totales), neumáticos fat de 20×3.0\", doble suspensión (horquilla 60 mm + amortiguador trasero 15 mm) y sensor de par. Incluye cesta delantera (36×32×16 cm) y asiento trasero para niños (72,5×42,5×21 cm). Frenos de disco hidráulicos, Shimano 7v, IPX5 y carga máxima de 200 kg. Apta para ciclistas de 160-200 cm. Con 38 kg es pesada, pero coherente con su propósito de carga familiar.",
    pros: [
      "Doble batería de 1.152 Wh totales (576 × 2), la mayor capacidad del catálogo",
      "Sensor de par, doble suspensión y frenos hidráulicos",
      "Asiento trasero para niños y cesta delantera incluidos",
    ],
    contras: [
      "Motor de buje trasero (75 Nm), no central",
      "38 kg, pesada para maniobrar sin asistencia",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1800,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0FP1DZRGF?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/dp/B0FP1DZRGF",
        fechaComprobacion: "2026-08-27",
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b14"],
    imagen: "/bikes/fafrees-ff20-cuv.webp",
    imagenPlaceholder: "Fafrees FF20 CUV con neumáticos anchos en una calle residencial",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: "2026-08-27",
    destacada: true,
  },
  {
    id: "b14",
    slug: "fafrees-f20-mate",
    marca: "Fafrees",
    modelo: "F20 Mate [Oficial]",
    tipo: "cargo",
    categoriaId: "cargo",
    precio: 2399,
    precioAproximado: false,
    bateriaWh: 874,
    bateriaExtraible: true,
    autonomia: 90,
    autonomiaMin: 65,
    autonomiaMax: 115,
    motor: "Buje trasero con diferencial, 65 Nm",
    motorTipo: "buje",
    parNm: 65,
    velocidad: 25,
    pesoKg: 40,
    cambios: "1 velocidad",
    frenos: "Disco hidráulicos 180 mm + freno de estacionamiento (triple)",
    suspension: "Horquilla delantera + amortiguador trasero (doble suspensión)",
    tallas: ["Única"],
    cargaMaxima: 180,
    dimensiones: "174 × 74 × 116 cm",
    nivelEquipamiento: "completo",
    plegable: true,
    carga: true,
    esTriciclo: true,
    mejorPara: "Quien necesita la máxima estabilidad de un triciclo, no una bicicleta de dos ruedas.",
    idealPara: "Carga y estabilidad por encima de la ligereza: no hay que hacer equilibrio para mantenerla en pie.",
    noEsPara: "Quien busca una bicicleta de dos ruedas: esta es un triciclo, con las limitaciones de espacio y giro que eso implica.",
    porQue: "Triciclo plegable con diferencial trasero, 874 Wh de batería extraíble, freno de estacionamiento y 180 kg de carga máxima.",
    analisis:
      "Es un TRICICLO de 3 ruedas, no una bicicleta de 2 — lo indicamos explícitamente porque cambia por completo cómo se conduce, se aparca y se transporta frente al resto del catálogo. Motor de buje trasero con diferencial de velocidad (las ruedas traseras giran de forma independiente), 65 Nm de par, batería extraíble de 874 Wh (48 V / 18,2 Ah) con autonomía declarada de 65-115 km. Doble suspensión, frenos de disco hidráulicos de 180 mm con sistema de frenado triple y freno de estacionamiento. Neumáticos FAT de 20\" × 3\", cuadro de aluminio plegable. Incluye cesta, guardabarros, intermitentes, luces de advertencia, espejo retrovisor y claxon electrónico. Pantalla LCD a color con 5 niveles de asistencia. Pesa 40 kg y admite hasta 180 kg de carga.",
    pros: [
      "Estabilidad de triciclo con diferencial trasero: no requiere equilibrio",
      "Freno de estacionamiento y sistema de frenado triple hidráulico",
      "874 Wh de batería extraíble con autonomía de 65-115 km",
    ],
    contras: [
      "Es un triciclo, no una bicicleta de dos ruedas — ocupa más espacio y gira de forma distinta",
      "40 kg, con diferencia el más pesado del catálogo",
      "2.399 €, la más cara del catálogo",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 2399,
        disponibilidad: "disponible",
        affiliateUrl: "https://www.amazon.es/dp/B0CT3DKT5G?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/dp/B0CT3DKT5G",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b13"],
    imagen: "/bikes/fafrees-f20-mate.webp",
    imagenPlaceholder: "Fafrees F20 Mate, triciclo eléctrico plegable azul, aparcado en una acera",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-25",
    fechaPrecioComprobado: null,
    destacada: false,
  },
  {
    id: "b15",
    slug: "fischer-viator-42i",
    marca: "Fischer",
    modelo: "Viator 4.2i",
    tipo: "trekking",
    categoriaId: "trekking",
    precio: 1400,
    precioAproximado: true,
    bateriaWh: 522,
    bateriaExtraible: true,
    autonomia: 120,
    autonomiaMin: 120,
    autonomiaMax: 120,
    motor: "Central Bafang M400, 80 Nm",
    motorTipo: "central",
    parNm: 80,
    velocidad: 25,
    pesoKg: 30,
    cambios: "Shimano 1x9",
    frenos: "Disco hidráulico Shimano",
    suspension: "Horquilla delantera SR Suntour NEX E25 75 mm, tija de sillín con muelle",
    tallas: [],
    cargaMaxima: 150,
    dimensiones: "188 × 26 × 126 cm",
    nivelEquipamiento: "medio",
    plegable: false,
    carga: false,
    mejorPara: "Par motor alto (80 Nm) y buena autonomía en formato trekking con motor central Bafang M400.",
    idealPara: "Quien prioriza par motor alto y transmisión Shimano de 9 velocidades para rutas largas y cuestas.",
    noEsPara: "Quien busca una e-bike ligera: con 30 kg es de las más pesadas del catálogo.",
    porQue: "Motor central Bafang M400 de 80 Nm y 522 Wh de batería con autonomía anunciada de 120 km, con display Bafang LCD y puerto USB.",
    analisis:
      "Trekking alemana con motor central Bafang M400 de 80 Nm — empatada con la Antgooat Speedy 29 como el par más alto del catálogo fuera de las cargo — y autonomía anunciada de 120 km con batería extraíble de 522 Wh. Cambio Shimano de 1×9 velocidades y frenos de disco hidráulicos Shimano. Horquilla SR Suntour NEX E25 de 75 mm y tija de sillín con muelle. Display Bafang LCD 1050 con CAN Bus y puerto USB para cargar dispositivos. Pesa 30 kg y admite hasta 150 kg de carga. Dimensiones: 188 × 26 × 126 cm.",
    pros: [
      "Motor central Bafang M400 de 80 Nm confirmado por el fabricante",
      "Autonomía anunciada de 120 km con batería extraíble de 522 Wh",
      "Shimano 1×9 velocidades y frenos de disco hidráulicos Shimano",
    ],
    contras: [
      "30 kg, de las más pesadas del catálogo",
      "Precio de ~1.400 €, actualmente sin disponibilidad en Amazon",
    ],
    ofertas: [
      {
        merchantId: "amazon",
        precio: 1400,
        disponibilidad: "agotado",
        affiliateUrl: "https://www.amazon.es/dp/B0C1K9HVZ7?tag=ebikeguide-21",
        urlProducto: "https://www.amazon.es/Fischer-Bicicleta-el%C3%A9ctrica-Trekking-50cm-522Wh/dp/B0C1K9HVZ7",
        fechaComprobacion: null,
        envio: null,
        comision: null,
      },
    ],
    alternativas: ["b10"],
    imagen: "/bikes/fischer-viator-42i.webp",
    imagenPlaceholder: "Fischer Viator 4.2i con alforjas en una ruta de trekking",
    galeria: null,
    medidasPropias: null,
    fechaActualizacion: "2026-08-27",
    fechaPrecioComprobado: null,
    destacada: true,
  },
];

const METRICAS: MetricasBike[] = BIKES_RAW.map((b) => ({
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
    imagen: "/bikes/colorway-bk15.webp",
    imagenPlaceholder: "Ciclista urbano en e-bike cruzando un carril bici en la ciudad",
  },
  {
    id: "plegables",
    slug: "plegables",
    nombre: "Plegables",
    claim: "Se pliegan, caben en cualquier sitio",
    imagen: "/bikes/bodywel-t16pro.webp",
    imagenPlaceholder: "E-bike plegable apoyada junto a una mochila en un andén de tren",
  },
  {
    id: "montana",
    slug: "montana",
    nombre: "Montaña",
    claim: "Motor y suspensión para el barro",
    imagen: "/bikes/antgooat-speedy-29.webp",
    imagenPlaceholder: "E-bike de montaña subiendo un sendero forestal con suspensión activa",
  },
  {
    id: "trekking",
    slug: "trekking",
    nombre: "Trekking",
    claim: "Rutas largas con equipaje",
    imagen: "/bikes/fischer-viator-42i.webp",
    imagenPlaceholder: "E-bike de trekking con alforjas en una ruta de gravilla",
  },
  {
    id: "cargo",
    slug: "cargo",
    nombre: "Cargo",
    claim: "Lleva niños o la compra sin sudar",
    imagen: "/bikes/fafrees-ff20-cuv.webp",
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
    dominio: "https://ebikeguide.netlify.app",
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
      imagen: "/guias/bosch-vs-shimano-vs-yamaha-que-motor-elegir.webp",
      imagenPlaceholder: "Primer plano de tres motores de e-bike distintos montados en cuadro",
      cuerpo: [
        "El motor es lo primero que se anuncia y lo último que se entiende bien. Hay dos familias: motores centrales, montados en el eje de pedalier, y motores de buje, en la rueda delantera o trasera. La diferencia no es solo de ubicación: cambia cómo se reparte el peso, cómo responde en rampa y cuánto puedes exigirle.",
        "Un motor central mide el par que aplicas al pedal y lo multiplica, por lo que la asistencia se siente natural y escala con el esfuerzo. Es el estándar en bicis de gama media-alta —trekking, montaña, muchas urbanas premium— y es lo que llevan la Fischer Viator 4.2i o la ONESPORT OT07 de este catálogo.",
        "Un motor de buje es más simple y barato de fabricar, por eso domina las e-bikes de entrada. Empuja con menos matiz —a menudo por velocidad, no por par pedaleado— y añade peso no suspendido en la rueda. Es lo que monta la ADO Air20 Pro: cumple en llano, se nota más en cuestas.",
        "El par (Nm) importa más que la potencia nominal, que en la UE está limitada a 250 W en la mayoría de casos. Un motor de 80 Nm como el de la Antgooat Speedy 29 tira bien en rampa; uno de 40-50 Nm en una bici ligera es suficiente porque hay menos peso que mover.",
        "La recomendación práctica: si vas a llevar peso, subir cuestas con regularidad o rodar más de 40 km por salida, prioriza un motor central de par alto. Si tu uso es plano, corto y el precio manda, un motor de buje cumple y abarata la bici de forma notable.",
      ],
      productos: ["b15", "b05", "b08"],
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
      imagen: "/guias/como-elegir-la-autonomia-que-necesitas.webp",
      imagenPlaceholder: "Indicador de batería de una e-bike mostrado en un display central",
      cuerpo: [
        "La cifra de autonomía de una ficha técnica suele venir del test más favorable posible: asistencia mínima, terreno llano, ciclista ligero. En condiciones reales —asistencia alta, cuestas, más peso— es habitual perder entre un 30 % y un 50 % de esa cifra.",
        "Lo que de verdad determina cuántos km vas a hacer es la relación entre los Wh de la batería y el consumo medio de tu ruta en Wh/km. Nuestra calculadora de autonomía usa un modelo simplificado (8,5 Wh/km base, ajustado por peso, terreno y nivel de asistencia) para dar un rango realista en vez de una única cifra optimista.",
        "Como referencia de este catálogo: la ENGWE EP-2 BOOST declara hasta 120 km con 624 Wh; la HITWAY BK6SL1 declara entre 70 y 150 km con 562 Wh. La diferencia no es solo de batería — el nivel de asistencia usado cambia drásticamente el consumo real.",
        "Regla práctica: calcula tu trayecto habitual en km, multiplícalo por dos si sueles ir en asistencia alta o hay cuestas, y busca una bici cuya autonomía mínima cubra ese número sin apurar la batería por debajo del 20 % de forma sistemática.",
      ],
      productos: ["b12", "b02"],
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
      imagen: "/guias/cuidados-basicos-bateria-e-bike.webp",
      imagenPlaceholder: "Batería extraíble de e-bike cargándose sobre una mesa de taller",
      cuerpo: [
        "Las baterías de e-bike son de ion-litio y se degradan por ciclos de carga y por temperatura, no solo por el paso del tiempo. Cargar entre el 20 % y el 80 % en el día a día, en vez de siempre a 100 %, reduce el estrés químico y alarga la vida útil.",
        "El calor es el enemigo principal: no dejes la batería cargando al sol ni la guardes en el maletero de un coche en verano. El frío intenso reduce la autonomía de forma temporal pero no daña la batería igual que el calor.",
        "Para almacenamiento largo (más de unas semanas sin usar la bici), deja la batería en torno al 50-60 % de carga y en un sitio fresco y seco, no completamente vacía ni completamente llena.",
        "Una batería extraíble, como la de la ADO Air20 Pro, la ENGWE P275 SE o la Fischer Viator 4.2i, facilita este cuidado porque puedes guardarla en casa en vez de dejar la bici entera a la intemperie con la batería puesta.",
      ],
      productos: ["b05", "b02", "b15"],
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
      imagen: "/guias/normativa-e-bikes-espana.webp",
      imagenPlaceholder: "Señal de tráfico de carril bici junto a una e-bike aparcada",
      cuerpo: [
        "En España y la UE, una e-bike homologada como EPAC (pedaleo asistido) tiene un motor de hasta 250 W que deja de asistir a partir de 25 km/h. Todas las bicis de dos ruedas de este catálogo, como la COLORWAY BK15 o la ENGWE P275 SE, son de este tipo: legalmente se consideran bicicletas normales.",
        "Eso significa que no necesitan matrícula, seguro obligatorio ni casco (aunque se recomienda) para circular, y pueden usar carriles bici igual que una bicicleta convencional.",
        "Las e-bikes de hasta 45 km/h (conocidas como S-pedelec) son una categoría distinta: se consideran ciclomotor, exigen matrícula, seguro, casco homologado de ciclomotor y no pueden circular por carriles bici urbanos en la mayoría de casos. Ninguna bici de este catálogo entra en esta categoría — el triciclo Fafrees F20 Mate tampoco: su límite de 25 km/h lo mantiene dentro del mismo marco EPAC, aunque conviene verificarlo antes de circular con él por ser un vehículo de 3 ruedas.",
        "Recomendación general aunque no sea obligatoria por ley: un seguro de responsabilidad civil es barato y cubre a terceros en caso de accidente, algo especialmente relevante si la e-bike pesa 20-40 kg y circula a más velocidad media que una bici convencional.",
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
        { bikeId: "b01", motivo: "600 €, la urbana más barata del catálogo, con batería de 540 Wh y autonomía estimada de 40-80 km." },
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
        { bikeId: "b10", motivo: "699 € con 45 Nm de par, frenos de disco y batería extraíble: buena relación par/precio en el rango trekking." },
        { bikeId: "b03", motivo: "729 € con frenos hidráulicos y peso confirmado (24 kg) — raro a este precio." },
        { bikeId: "b12", motivo: "1.049 € con sensor de par, 624 Wh de batería y neumáticos fat 20×4.0\" — mucha plegable por el precio." },
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
      resumen: "La eMTB de nuestro catálogo: 720 Wh, 80 Nm de par y frenos hidráulicos por 1.299 €.",
      intro:
        "Nuestra selección de eMTB analizada por lo que realmente publica el fabricante — batería, suspensión, frenos y precio.",
      criterios: [
        { titulo: "Batería y suspensión", descripcion: "Wh disponibles y si la suspensión es delantera o doble." },
        { titulo: "Frenos y transmisión", descripcion: "Tipo de frenos y número de marchas, cuando están confirmados." },
        { titulo: "Precio", descripcion: "Coste de entrada investigado frente a lo que ofrece cada modelo." },
      ],
      ganadores: [
        { bikeId: "b08", motivo: "720 Wh de batería extraíble, 80 Nm de par y frenos hidráulicos por 1.299 €." },
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
    {
      id: "mejores-ebikes-plegables-maletero-2026",
      slug: "mejores-ebikes-plegables-para-el-maletero",
      titulo: "Las 3 mejores e-bikes plegables para meter en el maletero",
      resumen: "Las plegables de nuestro catálogo ordenadas por lo que de verdad importa para el coche: cuánto pesan al levantarlas y si se pliegan al 100 %.",
      intro:
        "Para el maletero, la ficha que más importa no es la autonomía: es el peso (lo que vas a levantar cada vez) y si el fabricante la llama «plegable» de verdad o «semiplegable». Aquí van las tres plegables destacadas de nuestro catálogo con esos datos claros, sin asumir tamaños de maletero que no hemos podido confirmar.",
      criterios: [
        { titulo: "Peso", descripcion: "Kilos a levantar para meterla y sacarla del maletero, según ficha del fabricante." },
        { titulo: "Plegado real", descripcion: "Si se pliega al 100 % o el fabricante la describe como «semiplegable»." },
        { titulo: "Autonomía anunciada", descripcion: "Km declarados, para no quedarte tirado si la usas también fuera del coche." },
      ],
      ganadores: [
        { bikeId: "b05", motivo: "19 kg con transmisión por correa, motor Bafang 50 Nm con sensor de par, NFC e IPX6: la plegable más completa del catálogo." },
        { bikeId: "b06", motivo: "Ruedas de 24\", las más grandes entre las plegables: más estabilidad y comodidad de paseo, con equipamiento completo y fabricación española." },
        { bikeId: "b04", motivo: "La de más autonomía anunciada del trío (70-150 km) con 562 Wh por solo 800 € — incluye portaequipajes y bolsa, pero pesa 29 kg." },
      ],
      faq: [
        {
          pregunta: "¿Todas las e-bikes «plegables» se pliegan al 100 %?",
          respuesta: "No. Algunos fabricantes usan «plegable» para modelos que solo doblan el manillar o el sillín («semiplegables»), no el cuadro completo. Antes de comprar, comprueba si el fabricante especifica que se pliega por el centro del cuadro.",
        },
        {
          pregunta: "¿Qué tamaño de maletero necesito?",
          respuesta: "Depende del modelo, y no todos los fabricantes publican las medidas exactas plegada. Si el espacio es muy justo, comprueba las dimensiones plegadas en la ficha del fabricante antes de comprar en vez de asumirlas.",
        },
        {
          pregunta: "¿Cuánto pesa una e-bike plegable normal?",
          respuesta: "Entre las plegables de nuestro catálogo, el rango va de 18 a 25 kg. Cuanto menos peses tú, más relevante es fijarte en ese dato antes de elegir.",
        },
      ],
      imagenPlaceholder: "E-bike plegable junto al maletero abierto de un coche",
    },
    {
      id: "mejores-ebikes-cargo-ninos-2026",
      slug: "mejores-ebikes-de-carga-para-llevar-ninos",
      titulo: "Las mejores e-bikes de carga para llevar niños al cole",
      resumen: "Triciclo o cargo compacta: las dos cargo de nuestro catálogo comparadas por estabilidad y carga máxima, no solo por precio.",
      intro:
        "Para llevar niños, la pregunta no es solo «cuánto carga» — es si necesitas mantener el equilibrio con ese peso detrás o delante. Comparamos las dos cargo de nuestro catálogo por carga máxima, tipo de cuadro y lo que declara cada fabricante.",
      criterios: [
        { titulo: "Estabilidad", descripcion: "Triciclo (no requiere equilibrio) frente a cargo de dos ruedas longtail o compacta." },
        { titulo: "Carga máxima", descripcion: "Kg que admite el fabricante entre conductor, niños y carga." },
        { titulo: "Par motor", descripcion: "Nm del motor: cuanto más peso llevas, más se nota al arrancar en cuesta." },
      ],
      ganadores: [
        { bikeId: "b14", motivo: "Es un triciclo: no hace falta mantener el equilibrio con el peso de un niño detrás, la diferencia real frente a una cargo de dos ruedas." },
        { bikeId: "b13", motivo: "Cargo compacta de dos ruedas con neumáticos fat 20×3.0\" y doble suspensión, 200 kg de carga máxima y 75 Nm de par para arrancar con peso." },
      ],
      faq: [
        {
          pregunta: "¿Triciclo o cargo de dos ruedas para llevar niños?",
          respuesta: "El triciclo no requiere mantener el equilibrio, lo que puede dar más tranquilidad a baja velocidad o al parar. A cambio ocupa más espacio y gira de forma distinta a una bici normal — no es una decisión solo de gustos.",
        },
        {
          pregunta: "¿Qué carga máxima necesito para dos niños?",
          respuesta: "Depende del peso de los niños y de si además llevas mochilas o compra. Las cargo de este catálogo admiten hasta 200 kg entre conductor, niños y carga; comprueba siempre la cifra del fabricante para tu caso concreto.",
        },
        {
          pregunta: "¿Necesito más par motor si llevo niños?",
          respuesta: "Sí: arrancar en cuesta con peso extra exige más del motor. Un par motor alto (65-75 Nm en las bicis de carga de este catálogo) ayuda a que el arranque no se note forzado.",
        },
      ],
      imagenPlaceholder: "E-bike de carga con niño sentado en el asiento trasero en una calle residencial",
    },
    {
      id: "mejores-ebikes-baratas-frenos-hidraulicos-2026",
      slug: "mejores-ebikes-baratas-con-frenos-hidraulicos",
      titulo: "Las e-bikes más baratas con frenos hidráulicos confirmados",
      resumen: "No todas las e-bikes de entrada tienen frenos hidráulicos — muchas fichas ni siquiera confirman el tipo. Estas tres sí lo confirman, ordenadas de menor a mayor precio.",
      intro:
        "En e-bikes de entrada, los frenos son de lo primero que se recorta: muchas fichas económicas ni siquiera especifican si son hidráulicos o mecánicos. Estas son las tres bicis más baratas de nuestro catálogo con frenos hidráulicos confirmados por el fabricante, no asumidos.",
      criterios: [
        { titulo: "Precio", descripcion: "Coste de entrada investigado, de menor a mayor." },
        { titulo: "Frenos", descripcion: "Solo se incluyen modelos con hidráulicos confirmados, no «disco (tipo no confirmado)»." },
        { titulo: "Qué más incluye", descripcion: "Autonomía, par motor u otros extras a ese mismo precio." },
      ],
      ganadores: [
        { bikeId: "b03", motivo: "729 €, el precio más bajo del catálogo con frenos hidráulicos confirmados, además del par motor más alto de las urbanas (65 Nm)." },
        { bikeId: "b02", motivo: "899 € con frenos hidráulicos confirmados y la autonomía anunciada más alta de las urbanas del catálogo (hasta 120 km)." },
        { bikeId: "b08", motivo: "1.299 € con 720 Wh, 80 Nm de par y frenos hidráulicos — la eMTB con la batería más grande del catálogo." },
      ],
      faq: [
        {
          pregunta: "¿Por qué importan los frenos hidráulicos frente a los mecánicos?",
          respuesta: "Los hidráulicos suelen frenar con más potencia y consistencia, y necesitan menos mantenimiento (no hay que tensar un cable). En una e-bike, que pesa y acelera más que una bici normal, esa diferencia se nota más.",
        },
        {
          pregunta: "¿Todas las e-bikes baratas tienen frenos hidráulicos?",
          respuesta: "No. Varios modelos de entrada de nuestro propio catálogo solo confirman «disco», sin especificar si es hidráulico o mecánico — por eso esta selección solo incluye los que sí lo confirman explícitamente.",
        },
      ],
      imagenPlaceholder: "Detalle de una pinza de freno de disco hidráulico en una rueda de e-bike",
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
