export const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'escolar', label: 'Colegio y universidad' },
  { id: 'arte', label: 'Arte, color y lettering' },
  { id: 'oficina', label: 'Oficina y escritorio' },
  { id: 'graduacion', label: 'Graduación y especiales' }
];

export const TRACKING_LABELS = [
  { key: 'recibida', title: 'Reserva registrada', detail: 'Solicitud recibida y existencias en verificación' },
  { key: 'preparacion', title: 'Armando en librería', detail: 'Empacando tus artículos en Locales L-259 y L-260' },
  { key: 'listo', title: 'Listo para recoger', detail: 'Tu paquete te espera en mostrador de Interplaza' },
  { key: 'recogido', title: 'Recogido en tienda', detail: 'Entregado y pagado en efectivo en mostrador' }
];

export const PRODUCTS = [
  {
    id: 'kit-lettering-pelikan',
    name: 'Marcadores Pelikan Lettering Punta Pincel',
    category: 'arte',
    categoryLabel: 'Arte, color y lettering',
    price: 68,
    image: '/assets/img/bulgari-pelikan.jpg',
    mediaClass: 'product-media--contain',
    alt: 'Estuche de marcadores Pelikan Lettering Markana Pincel con trazos de caligrafía y punta pincel flexible',
    description: 'Trazo suave y punta pincel flexible con tinta lavable de colores vibrantes para transformar títulos y apuntes.',
    today: true,
    variants: ['Estuche 6 colores pastel', 'Estuche 10 colores vivos', 'Estuche 12 colores colección'],
    specs: [
      ['Marca', 'Pelikan — Línea Markana Pincel'],
      ['Punta', 'Pincel flexible para lettering y caligrafía'],
      ['Tinta', 'Base agua, lavable en la mayoría de telas'],
      ['Uso ideal', 'Apuntes universitarios, títulos y tarjetas']
    ]
  },
  {
    id: 'colores-bozetto-24',
    name: 'Lápices de Color Bozetto 24 Colores Mina 4 mm',
    category: 'arte',
    categoryLabel: 'Arte, color y lettering',
    price: 45,
    image: '/assets/img/bulgari-bozetto.jpg',
    alt: 'Caja roja de lápices de color Bozetto con mina gruesa de 4 mm y lápices afilados sobre papel cuadriculado',
    description: '24 colores vibrantes con mina gruesa súper resistente de 4 mm listos para el colegio, la U y proyectos creativos.',
    today: true,
    variants: ['Caja 24 colores (Mina 4 mm)', 'Caja 12 colores largos', 'Dúo escolar 2 × 24 colores'],
    specs: [
      ['Marca', 'Bozetto Escolar y Creativo'],
      ['Grosor de mina', '4 mm de alta resistencia al quiebre'],
      ['Pigmentación', 'Suave cobertura y mezcla uniforme'],
      ['Presentación', 'Caja rígida lista para mochila']
    ]
  },
  {
    id: 'organizador-escritorio-madera',
    name: 'Organizador de Escritorio en Madera y Acrílico',
    category: 'oficina',
    categoryLabel: 'Oficina y escritorio',
    price: 145,
    image: '/assets/img/bulgari-organizador.jpg',
    alt: 'Organizador de escritorio en acabado madera clara con bandeja blanca, dos gavetas frontales y espacio para teléfono y lápices',
    description: 'Módulo compacto con doble gaveta, compartimentos para clips y notas adhesivas, más base para teléfono y bolígrafos.',
    today: true,
    variants: ['Roble claro con blanco', 'Nogal con grafito'],
    specs: [
      ['Compartimentos', '2 gavetas + 4 divisiones superiores'],
      ['Material', 'Tablero melamínico acabado madera y acrílico'],
      ['Capacidad', 'Lápices, notas 3×3", clips y smartphone'],
      ['Uso sugerido', 'Oficina, estudio en casa y recepción']
    ]
  },
  {
    id: 'carpetas-clasificadoras-deli',
    name: 'Carpeta Clasificadora con Asa Deli / Archivador Oficio',
    category: 'oficina',
    categoryLabel: 'Oficina y escritorio',
    price: 55,
    image: '/assets/img/bulgari-carpetas.jpg',
    alt: 'Carpeta clasificadora azul con fuelle, broche frontal y asa de mano junto a archivador negro de palanca',
    description: 'Organiza expedientes, recibos y trabajos por colores y temas con broche de seguridad o archivador de palanca.',
    today: true,
    variants: ['Carpeta fuelle con asa Deli (Azul)', 'Carpeta fuelle con asa Deli (Negro)', 'Archivador de palanca oficio'],
    specs: [
      ['Formato', 'Compatible con hojas Carta y Oficio'],
      ['Capacidad', '12 divisiones con pestañas rotulables'],
      ['Cierre', 'Broche frontal reforzado y asa portátil'],
      ['Marca', 'Deli / Archivo Comercial']
    ]
  },
  {
    id: 'bandeja-metalica-documentos',
    name: 'Bandeja Metálica Apilable de 5 Niveles para Documentos',
    category: 'oficina',
    categoryLabel: 'Oficina y escritorio',
    price: 165,
    image: '/assets/img/bulgari-bandejas.jpg',
    alt: 'Bandeja organizadora de malla metálica con 5 charolas deslizables cargadas con carpetas, cuadernos y documentos',
    description: 'Estructura de malla de acero con cinco bandejas deslizables para clasificar facturas, folders y cuadernos sin saturar el escritorio.',
    today: true,
    variants: ['Malla plata (5 niveles)', 'Malla negro mate (5 niveles)'],
    specs: [
      ['Niveles', '5 charolas metálicas deslizables'],
      ['Material', 'Malla de acero con marco tubular firme'],
      ['Formato admitido', 'Hojas Carta, Oficio, folders y libretas'],
      ['Armado', 'Ensamble rápido sin herramientas especiales']
    ]
  },
  {
    id: 'portalapices-kit-escritura',
    name: 'Portalápices Equipado con Kit de Escritura y Corte',
    category: 'escolar',
    categoryLabel: 'Colegio y universidad',
    price: 42,
    image: '/assets/img/bulgari-portalapices.jpg',
    alt: 'Vaso portalápices celeste equipado con lápices de grafito, bolígrafos azul y rojo, resaltador y tijera escolar',
    description: 'Vaso organizador rígido listo para el escritorio escolar con lápices, bolígrafos, marcador y tijera escolar.',
    today: true,
    variants: ['Portalápices azul + 10 útiles', 'Portalápices negro + 10 útiles', 'Solo vaso organizador'],
    specs: [
      ['Contenido', '4 lápices, 4 bolígrafos, 1 marcador y tijera'],
      ['Base', 'Polipropileno rígido fácil de limpiar'],
      ['Público', 'Estudiantes, docentes y escritorio de hogar'],
      ['Disponibilidad', 'Listo para recoger hoy en Interplaza']
    ]
  },
  {
    id: 'kit-escolar-bulgari',
    name: 'Kit Escolar «Lista Completa Bulgari»',
    category: 'escolar',
    categoryLabel: 'Colegio y universidad',
    price: 185,
    image: '/assets/img/bulgari-kit-escolar.jpg',
    alt: 'Conjunto de útiles escolares con cuadernos cosidos, lápices de colores, marcadores y reglas sobre mesa clara',
    description: 'Paquete armado para ahorrar vueltas: cuadernos cosidos, lápices de colores, marcadores, regla, borrador y tijera.',
    today: true,
    variants: ['Primaria completa', 'Básico y Diversificado', 'Universitario'],
    specs: [
      ['Incluye', '5 cuadernos, caja de 12 colores, 6 lápices, kit geometría'],
      ['Personalización', 'Adaptamos el surtido a tu lista del colegio'],
      ['Ahorro', 'Precio especial frente a compra por unidad'],
      ['Empaque', 'Bolsa reutilizable lista para recoger en mostrador']
    ]
  },
  {
    id: 'cuadernos-universitarios-pack',
    name: 'Pack de 4 Cuadernos Universitarios Espiral 100 Hojas',
    category: 'escolar',
    categoryLabel: 'Colegio y universidad',
    price: 92,
    image: '/assets/img/bulgari-cuadernos.jpg',
    alt: 'Cuadernos universitarios con pasta dura resistente, espiral metálico y hojas blancas listos para tomar notas',
    description: 'Pasta gruesa laminada resistente al uso diario con papel bond de 70 g que evita el traspaso de tinta y resaltadores.',
    today: true,
    variants: ['4 Cuadernos con líneas', '4 Cuadernos cuadrícula 5 mm', 'Mixto (2 líneas + 2 cuadrícula)'],
    specs: [
      ['Cantidad', '4 cuadernos de 100 hojas cada uno'],
      ['Gramaje de papel', '70 g/m² blanco de alta opacidad'],
      ['Encuadernado', 'Doble espiral metálico continuo'],
      ['Formato', 'Tamaño Carta universitario (21.5 × 28 cm)']
    ]
  },
  {
    id: 'set-manualidades-arte',
    name: 'Set de Manualidades, Acuarelas y Pinceles',
    category: 'arte',
    categoryLabel: 'Arte, color y lettering',
    price: 78,
    image: '/assets/img/bulgari-manualidades.jpg',
    alt: 'Paleta de acuarelas de colores vivos acompañada de pinceles planos y redondos sobre mesa de arte',
    description: 'Surtido creativo de pigmentos de fácil disolución, pinceles de cerda suave y cartulinas para tareas artísticas y maquetas.',
    today: true,
    variants: ['Acuarelas 24 tonos + pinceles', 'Témperas escolares + cartulinas', 'Kit maquetas y silicón líquido'],
    specs: [
      ['Incluye', 'Estuche de pintura, 4 pinceles y block 20 hojas'],
      ['Seguridad', 'Fórmula no tóxica apta para uso escolar'],
      ['Secado', 'Rápido y uniforme sobre papel o cartón'],
      ['Ideal para', 'Expresión artística, carteles y manualidades']
    ]
  },
  {
    id: 'resma-papel-bond',
    name: 'Resma de Papel Bond 500 Hojas Alta Blancura (75 g)',
    category: 'oficina',
    categoryLabel: 'Oficina y escritorio',
    price: 48,
    image: '/assets/img/bulgari-resma-papel.jpg',
    alt: 'Paquete abierto de hojas blancas de papel bond de alta blancura listas para impresión láser o tinta',
    description: 'Corte de precisión libre de atascos para impresoras láser, inyección de tinta y fotocopiadoras de oficina o estudio.',
    today: true,
    variants: ['Tamaño Carta (500 hojas)', 'Tamaño Oficio (500 hojas)', 'Caja 3 resmas Carta'],
    specs: [
      ['Contenido', '500 hojas por resma sellada'],
      ['Gramaje', '75 g/m² · Blancura 96 %'],
      ['Compatibilidad', 'Láser, inyección de tinta y copiado dúplex'],
      ['Presentación', 'Envoltura antihumedad ideal para Escuintla']
    ]
  },
  {
    id: 'mochila-escolar-ergonomica',
    name: 'Mochila Escolar y Universitaria Impermeable 15.6"',
    category: 'escolar',
    categoryLabel: 'Colegio y universidad',
    price: 210,
    image: '/assets/img/bulgari-mochila.jpg',
    alt: 'Mochila escolar y universitaria de tela resistente con múltiples cierres y compartimento acolchado',
    description: 'Espalda acolchada transpirable, bolsillo interior para laptop de 15.6 pulgadas y bolsillos laterales para termo.',
    today: false,
    variants: ['Azul marino Bulgari', 'Negro clásico', 'Naranja terracota'],
    specs: [
      ['Capacidad', '26 litros · Compartimento laptop 15.6"'],
      ['Tejido', 'Lona poliéster repelente a lluvia ligera'],
      ['Tirantes', 'Ergonómicos con refuerzo de costura'],
      ['Garantía', 'Cierres metálicos de doble deslizador']
    ]
  },
  {
    id: 'anillo-graduacion-delariva',
    name: 'Reserva de Anillo de Graduación De La Riva «El Original»',
    category: 'graduacion',
    categoryLabel: 'Graduación y especiales',
    price: 1000,
    image: '/assets/img/bulgari-delariva.jpg',
    mediaClass: 'product-media--top',
    alt: 'Anillo y dije de graduación dorado Industrias De La Riva El Original con promoción especial en Librería Bulgari',
    description: 'Distribuidor autorizado en Escuintla de Industrias De La Riva con garantía para toda la vida, toma de medida y planes de reserva en efectivo.',
    today: false,
    variants: ['Plan Plata — Anticipo Q1,000', 'Plan Oro — Anticipo Q1,500'],
    specs: [
      ['Fabricante', 'Industrias De La Riva — El Original'],
      ['Garantía', 'Certificado oficial para toda la vida'],
      ['Beneficios', '10 % desc. de contado en efectivo o reserva por abonos'],
      ['Atención', 'Toma de talla presencial en Interplaza L-259/260']
    ]
  }
];
