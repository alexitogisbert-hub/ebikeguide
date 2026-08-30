/**
 * Copys y contenido de SEO on-page orientados a intención de búsqueda real. Todo lo que
 * afirma un dato de producto (peso, par motor, precio) está anclado a EBG_DATA — nunca se
 * inventa un dato ni se promete un resultado ("bicis por menos de X€") que el catálogo
 * actual no puede respaldar.
 */

export const CATEGORY_TITLES: Record<string, string> = {
  urbanas: "Mejores Bicicletas Eléctricas Urbanas para la Ciudad (2026) | eBikeGuide",
  plegables: "Mejores e-Bikes Plegables y Ligeras para Ciudad (2026) | eBikeGuide",
  montana: "Bicicletas Eléctricas de Montaña Baratas y Potentes | eBikeGuide",
  trekking: "Mejores Bicicletas Eléctricas de Trekking para Rutas Largas (2026) | eBikeGuide",
  cargo: "Bicicletas Eléctricas de Carga para Niños y Compra (2026) | eBikeGuide",
};

export type IntentBlock = { heading: string; body: string };

/**
 * Bloques de contenido por categoría con encabezados que calcan frases de búsqueda reales.
 * Solo se rellenan categorías donde el catálogo actual respalda una respuesta honesta —
 * no se añade contenido de relleno a categorías sin un dato real que sostenga el titular.
 */
export const CATEGORY_INTENT_CONTENT: Record<string, IntentBlock[]> = {
  montana: [
    {
      heading: "¿Cuál es la mejor e-bike para subir cuestas empinadas?",
      body: "El par motor (Nm) es lo que de verdad determina cómo responde una e-bike en rampa, no la potencia nominal, limitada por ley a 250 W en la mayoría de casos. En nuestro catálogo, la Antgooat Speedy 29\" destaca con 80 Nm de par, el más alto de toda la gama, pensada específicamente para terreno con desnivel.",
    },
    {
      heading: "Mejores bicicletas eléctricas de montaña por menos de 1000€",
      body: "Ahora mismo no tenemos ninguna e-bike de montaña por debajo de 1.000 € en catálogo: mantener un motor con par alto y buena suspensión tiene un coste que rara vez baja de esa franja. La opción más asequible que hemos investigado en esta categoría es la Antgooat Speedy 29\" (1.299 €). Si tu presupuesto es más ajustado, nuestras urbanas y plegables con buen par motor sí bajan de los 1.000 €.",
    },
  ],
  plegables: [
    {
      heading: "Bicis eléctricas plegables ideales para llevar en el maletero",
      body: "Si vas a guardarla en el maletero o en la entrada de casa, el peso y las medidas ya plegada importan más que la autonomía. La ADO Air20 Pro es la más compacta del catálogo con estas medidas (85 × 48 × 67 cm plegada) y solo 19 kg. La Legend Ebikes Siena pliega en un formato similar (86,5 × 79,8 × 46 cm) con 21 kg. Si buscas la más ligera de todas, la Bodywel T16PRO pesa 20,8 kg, aunque no publica sus medidas ya plegada.",
    },
  ],
};

export type FaqItem = { pregunta: string; respuesta: string; guiaHref?: string };

/** FAQ general sobre autonomía, mantenimiento y normativa, reutilizada en portada y categorías. */
export const FAQ_GENERAL: FaqItem[] = [
  {
    pregunta: "¿Cuánta autonomía real tiene una bicicleta eléctrica?",
    respuesta:
      "Depende del nivel de asistencia, el peso y el terreno: la cifra del fabricante suele venir del test más favorable posible, y en condiciones reales (asistencia alta, cuestas, más peso) es habitual perder entre un 30 % y un 50 % de esa cifra. En nuestro catálogo, por ejemplo, la ENGWE EP-2 BOOST declara hasta 120 km con 624 Wh, y la HITWAY BK6SL1 entre 70 y 150 km con 562 Wh.",
    guiaHref: "/guias/como-elegir-la-autonomia-que-necesitas/",
  },
  {
    pregunta: "¿Cómo debo cuidar la batería de mi bicicleta eléctrica?",
    respuesta:
      "Carga entre el 20 % y el 80 % en el día a día en vez de siempre al 100 %, evita dejarla al sol o en el maletero del coche en verano, y si no vas a usar la bici durante varias semanas, guárdala con la batería en torno al 50-60 % de carga. Una batería extraíble facilita mucho este cuidado porque puedes guardarla en casa sin dejar la bici entera fuera.",
    guiaHref: "/guias/cuidados-basicos-bateria-e-bike/",
  },
  {
    pregunta: "¿Necesito seguro, matrícula o carné para una bicicleta eléctrica en España?",
    respuesta:
      "No, si es una EPAC homologada (motor de hasta 250 W que deja de asistir a partir de 25 km/h): legalmente se considera una bicicleta normal, no necesita matrícula, seguro obligatorio ni casco (aunque se recomienda), y puede circular por carriles bici. Todos los modelos de dos ruedas de este catálogo son de este tipo.",
    guiaHref: "/guias/normativa-e-bikes-espana/",
  },
];
