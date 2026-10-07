import type { Station, StationId } from './types'

/*
 * CONTENIDO DE LAS ESTACIONES
 * ---------------------------
 * Cada objeto es un "letrero de estación". Para editar un texto, cámbialo aquí;
 * no hace falta tocar ningún componente.
 *
 * - ratings: de 1 a 5. En "complejidad" y "costo" un número alto significa MÁS complejo / MÁS caro.
 * - diagram: lienzo de 640 × 300. x,y son el CENTRO de cada nodo.
 * - flow: recorrido del tren por los nodos, con el texto que se muestra en cada parada.
 * - Los comentarios TODO marcan datos que conviene verificar antes de exponer.
 */

export const stations: Station[] = [
  // ───────────────────────────── LÍNEA 1 · CLÁSICAS ─────────────────────────────
  {
    id: 'monolitica',
    line: 'L1',
    name: 'Monolítica',
    year: 1960,
    yearLabel: 'Años 60',
    yearNote: 'Es la forma original de construir software, desde la era de los mainframes.',
    metaphor: 'Una sola estación gigante donde paran todos los trenes.',
    definition:
      'Toda la aplicación (interfaz, lógica de negocio y acceso a datos) se construye y se despliega como una sola unidad, normalmente con una única base de datos.',
    pros: [
      'Simple de desarrollar, probar y desplegar: un solo proyecto, un solo proceso.',
      'Las llamadas internas son en memoria: rápidas y sin fallos de red.',
      'Transacciones sencillas, porque todo comparte una base de datos.',
      'Costo de operación bajo.',
    ],
    cons: [
      'Para escalar una parte hay que replicar la aplicación completa.',
      'Un error grave (por ejemplo, una fuga de memoria) puede tirar todo el sistema.',
      'Al crecer, el código tiende a acoplarse y los cambios se vuelven riesgosos.',
      'Los equipos grandes se estorban: todos despliegan lo mismo.',
    ],
    useWhen: [
      'Productos nuevos, prototipos y MVP.',
      'Equipos pequeños (1 a 8 personas).',
      'Dominios que todavía no se entienden bien.',
    ],
    avoidWhen: [
      'Muchos equipos necesitan desplegar de forma independiente.',
      'Las partes del sistema tienen necesidades de escala muy distintas.',
    ],
    // TODO: verificar que estos casos sigan vigentes al momento de la exposición.
    companies: ['Stack Overflow', 'Basecamp', 'WordPress'],
    tech: ['Ruby on Rails', 'Django', 'Laravel', 'Spring Boot', 'ASP.NET'],
    ratings: { escalabilidad: 2, complejidad: 1, costo: 1, velocidad: 5, equipo: 1 },
    transfers: [
      { to: 'monolito-modular', note: 'El mismo despliegue único, pero con fronteras internas claras.' },
      { to: 'capas', note: 'La forma más común de ordenar un monolito por dentro.' },
    ],
    diagram: {
      zones: [{ label: 'Aplicación única · un solo despliegue', x: 185, y: 30, w: 270, h: 240 }],
      nodes: [
        { id: 'cliente', label: 'Cliente', x: 80, y: 150, w: 110, desc: 'Navegador o app que envía peticiones.' },
        { id: 'ui', label: 'Interfaz', x: 320, y: 90, desc: 'Pantallas y endpoints: reciben la petición.' },
        { id: 'logica', label: 'Lógica de negocio', x: 320, y: 160, w: 170, desc: 'Las reglas del negocio viven en el mismo proceso.' },
        { id: 'datos', label: 'Acceso a datos', x: 320, y: 230, w: 150, desc: 'Consultas a la base de datos.' },
        { id: 'bd', label: 'Base de datos', x: 555, y: 230, w: 130, shape: 'db', desc: 'Una sola base de datos para toda la aplicación.' },
      ],
      edges: [
        ['cliente', 'ui'],
        ['ui', 'logica'],
        ['logica', 'datos'],
        ['datos', 'bd'],
      ],
      flow: [
        { at: 'cliente', text: 'El pasajero envía una petición.' },
        { at: 'ui', text: 'Entra a la única estación: la interfaz la recibe.' },
        { at: 'logica', text: 'La lógica de negocio la procesa con una llamada en memoria.' },
        { at: 'datos', text: 'El acceso a datos prepara la consulta.' },
        { at: 'bd', text: 'Todo se guarda en una única base de datos.' },
        { at: 'datos', text: 'Los datos regresan por el mismo camino…' },
        { at: 'logica', text: '…dentro del mismo proceso, sin saltos de red.' },
        { at: 'ui', text: 'La interfaz arma la respuesta.' },
        { at: 'cliente', text: 'Respuesta entregada. Todo ocurrió en un solo proceso.' },
      ],
    },
  },
  {
    id: 'capas',
    line: 'L1',
    name: 'En capas (N-tier)',
    shortName: 'En capas',
    year: 1992,
    // TODO: verificar; "three-tier" se popularizó a inicios/mediados de los 90.
    yearLabel: 'Años 90',
    yearNote: 'Se popularizó con las aplicaciones empresariales de tres niveles (three-tier).',
    metaphor: 'Una estación de varios pisos: andén, vestíbulo y taquilla. Cada piso solo conecta con el de abajo.',
    definition:
      'Organiza el sistema en capas horizontales con responsabilidades distintas (presentación, negocio, persistencia, datos). Cada capa solo usa a la capa inmediatamente inferior. Cuando las capas se despliegan en máquinas separadas se habla de niveles (tiers).',
    pros: [
      'Separación de responsabilidades fácil de entender y de enseñar.',
      'Se puede cambiar una capa (por ejemplo, la interfaz) sin reescribir las demás.',
      'Es el estándar de facto en muchos frameworks empresariales.',
    ],
    cons: [
      'Un cambio de negocio suele atravesar todas las capas.',
      'Riesgo de capas "de paso" que solo reenvían datos sin aportar nada.',
      'La lógica de negocio termina dependiendo de la base de datos.',
    ],
    useWhen: [
      'Aplicaciones empresariales tipo CRUD.',
      'Equipos organizados por especialidad (frontend, backend, datos).',
      'Cuando se busca una estructura conocida por todos.',
    ],
    avoidWhen: [
      'Dominios complejos donde la lógica debe quedar aislada de la infraestructura.',
      'Sistemas que necesitan escalar funciones de forma independiente.',
    ],
    companies: ['Sistemas bancarios y de gobierno', 'ERP y CRM tradicionales'],
    tech: ['Java EE / Jakarta EE', 'Spring (Controller → Service → Repository)', '.NET', 'Angular + API + SQL'],
    ratings: { escalabilidad: 2, complejidad: 2, costo: 2, velocidad: 4, equipo: 2 },
    transfers: [
      { to: 'clean', note: 'Clean Architecture invierte las dependencias: el negocio ya no depende de la base de datos.' },
      { to: 'mvc', note: 'MVC suele vivir dentro de la capa de presentación.' },
    ],
    diagram: {
      nodes: [
        { id: 'cliente', label: 'Cliente', x: 90, y: 45, w: 120, desc: 'Quien usa el sistema.' },
        { id: 'presentacion', label: 'Capa de presentación', x: 380, y: 45, w: 300, h: 42, desc: 'Andén: lo que el usuario ve y toca.' },
        { id: 'negocio', label: 'Capa de negocio', x: 380, y: 115, w: 300, h: 42, desc: 'Vestíbulo: reglas y procesos del negocio.' },
        { id: 'persistencia', label: 'Capa de persistencia', x: 380, y: 185, w: 300, h: 42, desc: 'Taquilla: traduce objetos a consultas.' },
        { id: 'bd', label: 'Base de datos', x: 380, y: 255, w: 300, h: 42, shape: 'db', desc: 'Donde se guardan los datos.' },
      ],
      edges: [
        ['cliente', 'presentacion'],
        ['presentacion', 'negocio'],
        ['negocio', 'persistencia'],
        ['persistencia', 'bd'],
      ],
      flow: [
        { at: 'cliente', text: 'El pasajero llega a la estación.' },
        { at: 'presentacion', text: 'Piso 1 · presentación: recibe y valida la entrada.' },
        { at: 'negocio', text: 'Piso 2 · negocio: aplica las reglas.' },
        { at: 'persistencia', text: 'Piso 3 · persistencia: convierte la operación en consultas.' },
        { at: 'bd', text: 'Sótano · base de datos: lee o guarda.' },
        { at: 'persistencia', text: 'La respuesta sube piso por piso…' },
        { at: 'negocio', text: '…sin saltarse ninguna capa.' },
        { at: 'presentacion', text: 'La presentación le da formato.' },
        { at: 'cliente', text: 'El pasajero recibe su respuesta.' },
      ],
    },
  },
  {
    id: 'mvc',
    line: 'L1',
    name: 'MVC (Modelo-Vista-Controlador)',
    shortName: 'MVC',
    year: 1979,
    yearLabel: '1979',
    yearNote: 'Trygve Reenskaug lo formuló en Xerox PARC para Smalltalk. En la web se popularizó en los 2000.',
    metaphor: 'Pantallas (vista), centro de control (controlador) y registro de viajes (modelo).',
    definition:
      'Patrón que separa la aplicación en tres papeles: el Modelo guarda los datos y las reglas, la Vista los muestra, y el Controlador recibe las acciones del usuario y coordina a los otros dos.',
    pros: [
      'Separa la interfaz de los datos: se pueden cambiar las pantallas sin tocar las reglas.',
      'Enorme ecosistema de frameworks y documentación.',
      'Facilita las pruebas del modelo de forma aislada.',
    ],
    cons: [
      'Los controladores tienden a engordar ("fat controllers").',
      'No dice cómo organizar la lógica de negocio compleja.',
      'Cada framework lo interpreta distinto, lo que genera confusión.',
    ],
    useWhen: [
      'Aplicaciones web con interfaz de usuario y operaciones CRUD.',
      'Proyectos que quieren aprovechar un framework maduro.',
    ],
    avoidWhen: [
      'Servicios sin interfaz (procesos por lotes, pipelines de datos).',
      'Interfaces muy reactivas, donde encajan mejor variantes como MVVM o flujo unidireccional.',
    ],
    // TODO: verificar que GitHub y Shopify sigan usando Rails como base principal.
    companies: ['GitHub (Rails)', 'Shopify (Rails)', 'Instagram (Django)'],
    tech: ['Ruby on Rails', 'Django (lo llama MTV)', 'Laravel', 'Spring MVC', 'ASP.NET MVC'],
    ratings: { escalabilidad: 2, complejidad: 2, costo: 1, velocidad: 5, equipo: 1 },
    transfers: [
      { to: 'capas', note: 'MVC organiza la presentación; las capas organizan todo el sistema.' },
      { to: 'monolitica', note: 'La mayoría de los monolitos web usan MVC.' },
    ],
    diagram: {
      nodes: [
        { id: 'usuario', label: 'Usuario', x: 80, y: 150, w: 110, desc: 'Hace clic, escribe, envía formularios.' },
        { id: 'controlador', label: 'Controlador', x: 320, y: 55, w: 160, desc: 'Centro de control: recibe la acción y decide qué hacer.' },
        { id: 'modelo', label: 'Modelo', x: 540, y: 150, w: 130, desc: 'Registro de viajes: datos y reglas del negocio.' },
        { id: 'vista', label: 'Vista', x: 320, y: 245, w: 160, desc: 'Pantallas: muestran el estado del modelo.' },
      ],
      edges: [
        ['usuario', 'controlador'],
        ['controlador', 'modelo'],
        ['controlador', 'vista'],
        ['modelo', 'vista'],
        ['vista', 'usuario'],
      ],
      flow: [
        { at: 'usuario', text: 'El usuario pulsa "Comprar boleto".' },
        { at: 'controlador', text: 'El controlador recibe la acción.' },
        { at: 'modelo', text: 'El modelo aplica las reglas y actualiza los datos.' },
        { at: 'controlador', text: 'El controlador elige qué vista mostrar.' },
        { at: 'vista', text: 'La vista se dibuja con los datos del modelo.' },
        { at: 'usuario', text: 'El usuario ve la pantalla actualizada.' },
      ],
    },
  },

  // ─────────────────────────── LÍNEA 2 · DISTRIBUIDAS ───────────────────────────
  {
    id: 'cliente-servidor',
    line: 'L2',
    name: 'Cliente-servidor',
    year: 1983,
    // TODO: verificar; el modelo existe desde los 60-70, se popularizó con las PC y redes locales en los 80.
    yearLabel: 'Años 80',
    yearNote: 'Se popularizó con las PC conectadas en red; la Web (1991) lo llevó a todo el mundo.',
    metaphor: 'Pasajeros (clientes) que acuden a una taquilla central (servidor) para pedir su boleto.',
    definition:
      'Divide el sistema en dos papeles: los clientes inician peticiones y el servidor las atiende y centraliza los datos y recursos. Es la base de la Web y de casi todos los estilos distribuidos.',
    pros: [
      'Los datos y las reglas están centralizados: más fáciles de proteger y actualizar.',
      'Muchos clientes distintos (web, móvil, escritorio) comparten el mismo servidor.',
      'Modelo simple y universal.',
    ],
    cons: [
      'El servidor es un punto único de falla si no se replica.',
      'Depende de la red: sin conexión, no hay servicio.',
      'El servidor puede convertirse en cuello de botella.',
    ],
    useWhen: [
      'Varios usuarios deben compartir los mismos datos.',
      'Se quiere controlar la seguridad y las actualizaciones desde un solo lugar.',
    ],
    avoidWhen: [
      'La aplicación debe funcionar sin conexión la mayor parte del tiempo.',
      'Se busca evitar cualquier punto central (ahí encajan los modelos peer-to-peer).',
    ],
    companies: ['La Web (navegador ↔ servidor HTTP)', 'Correo electrónico', 'Banca en línea'],
    tech: ['HTTP / REST', 'PostgreSQL y MySQL', 'Nginx', 'Apps móviles + API'],
    ratings: { escalabilidad: 3, complejidad: 2, costo: 2, velocidad: 4, equipo: 2 },
    transfers: [
      { to: 'soa', note: 'Cuando el servidor se divide en varios servicios reutilizables.' },
      { to: 'edge', note: 'Cuando parte del servidor se acerca físicamente al cliente.' },
    ],
    diagram: {
      nodes: [
        { id: 'web', label: 'Cliente web', x: 90, y: 60, w: 140, desc: 'Un navegador.' },
        { id: 'movil', label: 'Cliente móvil', x: 90, y: 150, w: 140, desc: 'Una app en el teléfono.' },
        { id: 'escritorio', label: 'Cliente de escritorio', x: 90, y: 240, w: 160, desc: 'Un programa instalado.' },
        { id: 'servidor', label: 'Servidor', x: 360, y: 150, w: 140, h: 70, desc: 'Taquilla central: atiende todas las peticiones.' },
        { id: 'bd', label: 'Datos', x: 560, y: 150, w: 110, shape: 'db', desc: 'Datos compartidos por todos los clientes.' },
      ],
      edges: [
        ['web', 'servidor'],
        ['movil', 'servidor'],
        ['escritorio', 'servidor'],
        ['servidor', 'bd'],
      ],
      flow: [
        { at: 'movil', text: 'Un cliente inicia la conversación: envía una petición.' },
        { at: 'servidor', text: 'El servidor (la taquilla) la atiende.' },
        { at: 'bd', text: 'Consulta los datos centralizados.' },
        { at: 'servidor', text: 'Prepara la respuesta.' },
        { at: 'movil', text: 'El cliente la recibe y la muestra.' },
        { at: 'web', text: 'Otro cliente hace su propia petición…' },
        { at: 'servidor', text: '…al mismo servidor, que atiende a todos.' },
        { at: 'web', text: 'Todos comparten la misma información.' },
      ],
    },
  },
  {
    id: 'soa',
    line: 'L2',
    name: 'SOA (Arquitectura orientada a servicios)',
    shortName: 'SOA',
    year: 2002,
    // TODO: verificar; el término se atribuye a Gartner (1996) y despegó con SOAP/WSDL a inicios de los 2000.
    yearLabel: 'Años 2000',
    yearNote: 'El término aparece a mediados de los 90 y despega con los servicios web (SOAP, WSDL).',
    metaphor: 'Una vía troncal compartida (el bus) por la que circulan todos los servicios.',
    definition:
      'Organiza la empresa como un conjunto de servicios de negocio reutilizables que se comunican mediante contratos estándar, normalmente a través de un bus de servicios empresarial (ESB) que enruta, transforma y orquesta los mensajes.',
    pros: [
      'Reutiliza servicios entre muchas aplicaciones de la empresa.',
      'Integra sistemas heredados y tecnologías distintas.',
      'Contratos formales entre servicios.',
    ],
    cons: [
      'El ESB concentra lógica y se vuelve cuello de botella y punto único de falla.',
      'Gobernanza pesada y despliegues lentos.',
      'Los servicios suelen compartir bases de datos, lo que los acopla.',
    ],
    useWhen: [
      'Grandes organizaciones que deben integrar muchos sistemas existentes.',
      'Se necesitan contratos formales y gobierno centralizado.',
    ],
    avoidWhen: [
      'Startups y equipos pequeños.',
      'Se busca despliegue rápido e independiente por equipo.',
    ],
    companies: ['Bancos y aseguradoras', 'Gobierno', 'Telecomunicaciones'],
    tech: ['SOAP / WSDL', 'ESB (MuleSoft, IBM, Oracle)', 'BPEL', 'XML'],
    ratings: { escalabilidad: 3, complejidad: 4, costo: 4, velocidad: 2, equipo: 4 },
    transfers: [
      { to: 'microservicios', note: 'Evolución: servicios más pequeños, sin bus central y con datos propios.' },
      { to: 'cliente-servidor', note: 'Cada servicio sigue siendo un servidor para sus consumidores.' },
    ],
    diagram: {
      nodes: [
        { id: 'app', label: 'Aplicación consumidora', x: 95, y: 150, w: 170, desc: 'Cualquier aplicación de la empresa que necesita un servicio.' },
        { id: 'esb', label: 'ESB', x: 320, y: 150, w: 90, h: 230, desc: 'Bus de servicios: enruta, transforma y orquesta los mensajes.' },
        { id: 'clientes', label: 'Servicio de clientes', x: 530, y: 60, w: 180, desc: 'Servicio de negocio reutilizable.' },
        { id: 'facturacion', label: 'Servicio de facturación', x: 530, y: 150, w: 180, desc: 'Servicio de negocio reutilizable.' },
        { id: 'legado', label: 'Sistema heredado', x: 530, y: 240, w: 180, desc: 'Un sistema antiguo expuesto como servicio.' },
      ],
      edges: [
        ['app', 'esb'],
        ['esb', 'clientes'],
        ['esb', 'facturacion'],
        ['esb', 'legado'],
      ],
      flow: [
        { at: 'app', text: 'Una aplicación necesita generar una factura.' },
        { at: 'esb', text: 'Todo pasa por la vía troncal: el ESB recibe el mensaje.' },
        { at: 'clientes', text: 'El bus consulta el servicio de clientes.' },
        { at: 'esb', text: 'Transforma el formato de los datos.' },
        { at: 'facturacion', text: 'Invoca el servicio de facturación.' },
        { at: 'esb', text: 'Orquesta el siguiente paso.' },
        { at: 'legado', text: 'Registra la operación en el sistema heredado.' },
        { at: 'esb', text: 'Reúne los resultados.' },
        { at: 'app', text: 'Respuesta entregada. Si el bus se detiene, se detiene todo.' },
      ],
    },
  },
  {
    id: 'microservicios',
    line: 'L2',
    name: 'Microservicios',
    year: 2014,
    yearLabel: '2014',
    yearNote: 'El término circula desde 2011-2012; el artículo de James Lewis y Martin Fowler (2014) lo popularizó.',
    metaphor: 'Muchas estaciones pequeñas; si una cierra, la red sigue funcionando.',
    definition:
      'El sistema se divide en servicios pequeños y autónomos, cada uno alineado con una capacidad de negocio, con su propia base de datos y su propio ciclo de despliegue. Se comunican por red mediante API o mensajes.',
    pros: [
      'Cada servicio se despliega y se escala de forma independiente.',
      'Aislamiento de fallas: un servicio caído no tira a los demás (si está bien diseñado).',
      'Cada equipo es dueño de su servicio y puede elegir su tecnología.',
    ],
    cons: [
      'Complejidad de sistema distribuido: red, latencia, fallas parciales.',
      'Consistencia eventual: no hay transacciones simples entre servicios.',
      'Exige automatización, monitoreo y trazabilidad maduros.',
      'Costo de infraestructura y de operación alto.',
    ],
    useWhen: [
      'Muchos equipos que necesitan desplegar de forma independiente.',
      'Partes del sistema con necesidades de escala muy diferentes.',
      'Dominio bien entendido, con fronteras claras.',
    ],
    avoidWhen: [
      'Equipos pequeños o productos en etapa temprana.',
      'No hay cultura ni herramientas de DevOps.',
      'El dominio todavía está cambiando mucho.',
    ],
    companies: ['Netflix', 'Amazon', 'Uber', 'Spotify'],
    tech: ['Docker', 'Kubernetes', 'API Gateway', 'gRPC / REST', 'Service mesh'],
    ratings: { escalabilidad: 5, complejidad: 5, costo: 5, velocidad: 2, equipo: 5 },
    transfers: [
      { to: 'event-driven', note: 'Los eventos desacoplan a los servicios entre sí.' },
      { to: 'soa', note: 'Heredan la idea de servicio, pero sin bus central.' },
      { to: 'cell-based', note: 'Las celdas agrupan microservicios para aislar fallas.' },
    ],
    diagram: {
      nodes: [
        { id: 'cliente', label: 'Cliente', x: 65, y: 150, w: 100, desc: 'App web o móvil.' },
        { id: 'gateway', label: 'API Gateway', x: 210, y: 150, w: 130, desc: 'Puerta de entrada: enruta cada petición al servicio correcto.' },
        { id: 'pedidos', label: 'Pedidos', x: 395, y: 60, w: 120, desc: 'Servicio autónomo con su propio despliegue.' },
        { id: 'pagos', label: 'Pagos', x: 395, y: 150, w: 120, desc: 'Servicio autónomo con su propio despliegue.' },
        { id: 'catalogo', label: 'Catálogo', x: 395, y: 240, w: 120, desc: 'Servicio autónomo con su propio despliegue.' },
        { id: 'bd1', label: 'BD pedidos', x: 560, y: 60, w: 120, shape: 'db', desc: 'Cada servicio es dueño de sus datos.' },
        { id: 'bd2', label: 'BD pagos', x: 560, y: 150, w: 120, shape: 'db', desc: 'Cada servicio es dueño de sus datos.' },
        { id: 'bd3', label: 'BD catálogo', x: 560, y: 240, w: 120, shape: 'db', desc: 'Cada servicio es dueño de sus datos.' },
      ],
      edges: [
        ['cliente', 'gateway'],
        ['gateway', 'pedidos'],
        ['gateway', 'pagos'],
        ['gateway', 'catalogo'],
        ['pedidos', 'pagos'],
        ['pedidos', 'bd1'],
        ['pagos', 'bd2'],
        ['catalogo', 'bd3'],
      ],
      flow: [
        { at: 'cliente', text: 'El cliente crea un pedido.' },
        { at: 'gateway', text: 'El API Gateway enruta la petición.' },
        { at: 'pedidos', text: 'El servicio de Pedidos la atiende.' },
        { at: 'bd1', text: 'Guarda en SU propia base de datos.' },
        { at: 'pedidos', text: 'Necesita cobrar: llama a otro servicio por la red.' },
        { at: 'pagos', text: 'Pagos procesa el cobro de forma independiente.' },
        { at: 'bd2', text: 'Y guarda en su propia base de datos.' },
        { at: 'pagos', text: 'Responde a Pedidos.' },
        { at: 'pedidos', text: 'Pedidos confirma la compra.' },
        { at: 'gateway', text: 'La respuesta vuelve por el gateway.' },
        { at: 'cliente', text: 'Catálogo ni se enteró: cada estación trabaja por su cuenta.' },
      ],
    },
  },

  // ────────────────────────── LÍNEA 3 · EVENTOS Y NUBE ──────────────────────────
  {
    id: 'event-driven',
    line: 'L3',
    name: 'Event-driven (dirigida por eventos)',
    shortName: 'Event-driven',
    year: 2003,
    // TODO: verificar; publish/subscribe se describe desde 1987 y Apache Kafka (2011) lo llevó a gran escala.
    yearLabel: 'Años 2000',
    yearNote: 'Publicar/suscribir existe desde finales de los 80; la mensajería empresarial y luego Kafka (2011) lo masificaron.',
    metaphor: 'Avisos por altavoz: se anuncia lo que ocurrió y quien esté interesado, reacciona.',
    definition:
      'Los componentes se comunican emitiendo eventos (hechos que ya ocurrieron) a través de un intermediario. Con publicar/suscribir, cada evento llega a todos los interesados; con colas, cada mensaje lo procesa un solo trabajador. El emisor no sabe quién lo escucha.',
    pros: [
      'Bajo acoplamiento: se agregan consumidores sin modificar al productor.',
      'Absorbe picos: los mensajes esperan en la cola hasta ser procesados.',
      'Permite reaccionar casi en tiempo real.',
    ],
    cons: [
      'El flujo completo es difícil de seguir y de depurar.',
      'Consistencia eventual: los datos tardan un momento en coincidir.',
      'Hay que manejar mensajes duplicados, perdidos o fuera de orden.',
    ],
    useWhen: [
      'Varios sistemas deben reaccionar al mismo hecho.',
      'Procesos asíncronos: notificaciones, analítica, IoT, auditoría.',
      'Se necesita absorber picos de carga.',
    ],
    avoidWhen: [
      'Flujos simples de petición-respuesta inmediata.',
      'Operaciones que exigen consistencia fuerte al instante.',
    ],
    // TODO: verificar los casos de uso públicos de Uber y Netflix con Kafka.
    companies: ['LinkedIn (creó Kafka)', 'Uber', 'Netflix'],
    tech: ['Apache Kafka', 'RabbitMQ', 'AWS SNS / SQS / EventBridge', 'Google Pub/Sub'],
    ratings: { escalabilidad: 5, complejidad: 4, costo: 3, velocidad: 3, equipo: 4 },
    transfers: [
      { to: 'microservicios', note: 'Los eventos son la forma más desacoplada de conectar microservicios.' },
      { to: 'serverless', note: 'Las funciones serverless se disparan con eventos.' },
    ],
    diagram: {
      nodes: [
        { id: 'productor', label: 'Productor (Pedidos)', x: 95, y: 150, w: 170, desc: 'Publica lo que ocurrió, sin saber quién escucha.' },
        { id: 'broker', label: 'Broker de eventos', x: 320, y: 150, w: 120, h: 230, desc: 'El altavoz: recibe los eventos y los reparte por temas.' },
        { id: 'facturacion', label: 'Facturación', x: 540, y: 60, w: 150, desc: 'Consumidor suscrito al evento.' },
        { id: 'notificaciones', label: 'Notificaciones', x: 540, y: 150, w: 150, desc: 'Consumidor suscrito al evento.' },
        { id: 'inventario', label: 'Inventario', x: 540, y: 240, w: 150, desc: 'Consumidor suscrito al evento.' },
      ],
      edges: [
        ['productor', 'broker'],
        ['broker', 'facturacion'],
        ['broker', 'notificaciones'],
        ['broker', 'inventario'],
      ],
      flow: [
        { at: 'productor', text: 'Ocurre algo: se crea un pedido.' },
        { at: 'broker', text: 'Se anuncia por el altavoz el evento "PedidoCreado".' },
        { at: 'facturacion', text: 'Facturación estaba suscrita: genera la factura.' },
        { at: 'broker', text: 'El mismo evento se entrega a cada suscriptor (en la realidad, en paralelo).' },
        { at: 'notificaciones', text: 'Notificaciones envía un correo al cliente.' },
        { at: 'broker', text: 'El productor no espera a nadie: ya siguió con su trabajo.' },
        { at: 'inventario', text: 'Inventario descuenta las existencias.' },
        { at: 'productor', text: 'Se pueden agregar más oyentes sin tocar al productor.' },
      ],
    },
  },
  {
    id: 'serverless',
    line: 'L3',
    name: 'Serverless',
    year: 2014,
    yearLabel: '2014',
    yearNote: 'AWS Lambda se anunció en noviembre de 2014 y popularizó las funciones como servicio (FaaS).',
    metaphor: 'Trenes que solo salen cuando hay pasajeros esperando.',
    definition:
      'El proveedor de nube administra los servidores y ejecuta el código bajo demanda, en funciones efímeras que se activan con eventos. Escala de forma automática (incluso a cero) y se paga solo por el tiempo de ejecución. Sí hay servidores: simplemente no los administras tú.',
    pros: [
      'Sin administración de servidores.',
      'Escala sola: de cero a miles de ejecuciones y de regreso.',
      'Pago por uso: sin tráfico, casi no hay costo.',
      'Permite lanzar rápido.',
    ],
    cons: [
      'Arranque en frío: la primera ejecución puede tardar más.',
      'Dependencia del proveedor (vendor lock-in).',
      'Límites de tiempo de ejecución y de memoria.',
      'Con tráfico alto y constante puede salir más caro que un servidor fijo.',
    ],
    useWhen: [
      'Tráfico impredecible o con picos.',
      'Tareas disparadas por eventos: procesar archivos, webhooks, tareas programadas.',
      'Equipos pequeños sin especialistas en infraestructura.',
    ],
    avoidWhen: [
      'Procesos de larga duración o con estado en memoria.',
      'Carga alta y constante las 24 horas.',
      'Requisitos estrictos de latencia que no toleran arranques en frío.',
    ],
    // TODO: verificar los casos públicos (Coca-Cola en máquinas expendedoras, iRobot) antes de citarlos.
    companies: ['Coca-Cola', 'iRobot', 'Startups y productos nuevos'],
    tech: ['AWS Lambda', 'Azure Functions', 'Google Cloud Run / Functions', 'Cloudflare Workers'],
    ratings: { escalabilidad: 5, complejidad: 3, costo: 2, velocidad: 4, equipo: 2 },
    transfers: [
      { to: 'event-driven', note: 'Cada función se dispara con un evento.' },
      { to: 'edge', note: 'Las funciones también pueden ejecutarse en el borde de la red.' },
    ],
    diagram: {
      nodes: [
        { id: 'evento', label: 'Evento', x: 75, y: 150, w: 110, desc: 'Una petición HTTP, un archivo subido, un mensaje o un horario.' },
        { id: 'plataforma', label: 'Plataforma FaaS', x: 245, y: 150, w: 150, desc: 'El proveedor: crea y destruye instancias según la demanda.' },
        { id: 'funcion', label: 'Función', x: 420, y: 150, w: 110, desc: 'Código efímero: vive solo mientras atiende el evento.' },
        { id: 'bd', label: 'BD gestionada', x: 565, y: 80, w: 130, shape: 'db', desc: 'El estado vive fuera de la función.' },
        { id: 'archivos', label: 'Almacenamiento', x: 565, y: 220, w: 130, desc: 'Archivos en un servicio gestionado.' },
      ],
      edges: [
        ['evento', 'plataforma'],
        ['plataforma', 'funcion'],
        ['funcion', 'bd'],
        ['funcion', 'archivos'],
      ],
      flow: [
        { at: 'evento', text: 'Sin pasajeros no hay trenes: cero instancias, cero costo.' },
        { at: 'plataforma', text: 'Llega un evento: la plataforma arranca una instancia (arranque en frío).' },
        { at: 'funcion', text: 'La función se ejecuta.' },
        { at: 'bd', text: 'Lee y guarda el estado en un servicio externo.' },
        { at: 'funcion', text: 'Termina su trabajo en milisegundos.' },
        { at: 'archivos', text: 'Guarda el resultado.' },
        { at: 'funcion', text: 'Se cobra solo el tiempo que estuvo ejecutándose.' },
        { at: 'plataforma', text: 'Si llegan mil eventos, la plataforma crea mil instancias.' },
        { at: 'evento', text: 'Sin tráfico, vuelve a escalar a cero.' },
      ],
    },
  },

  // ────────────────────────── LÍNEA 4 · DISEÑO INTERNO ──────────────────────────
  {
    id: 'hexagonal',
    line: 'L4',
    name: 'Hexagonal (puertos y adaptadores)',
    shortName: 'Hexagonal',
    year: 2005,
    yearLabel: '2005',
    yearNote: 'Propuesta por Alistair Cockburn con el nombre "Ports and Adapters".',
    metaphor: 'Una estación con accesos intercambiables: torniquete, tarjeta o QR. Por dentro, la estación es la misma.',
    definition:
      'Aísla la lógica de negocio en el centro y la comunica con el exterior solo mediante puertos (interfaces). Los adaptadores implementan esos puertos para cada tecnología concreta: web, base de datos, mensajería o pruebas.',
    pros: [
      'El dominio se prueba sin base de datos ni servidor web.',
      'Cambiar de tecnología es cambiar un adaptador, no el negocio.',
      'Varias entradas (API, línea de comandos, eventos) reutilizan la misma lógica.',
    ],
    cons: [
      'Más interfaces y más código de mapeo.',
      'Excesiva para aplicaciones CRUD sencillas.',
      'Requiere disciplina del equipo para respetar las fronteras.',
    ],
    useWhen: [
      'Lógica de negocio compleja y de larga vida.',
      'Integración con muchos sistemas externos que pueden cambiar.',
      'Se valoran mucho las pruebas automatizadas.',
    ],
    avoidWhen: ['Prototipos y CRUD simples.', 'Equipos sin experiencia en inversión de dependencias.'],
    // TODO: verificar; Netflix publicó en 2020 un artículo sobre su uso de arquitectura hexagonal.
    companies: ['Netflix (caso publicado en su blog técnico)', 'Sistemas con Domain-Driven Design'],
    tech: ['Spring Boot', 'NestJS', '.NET', 'Inyección de dependencias'],
    ratings: { escalabilidad: 3, complejidad: 3, costo: 2, velocidad: 3, equipo: 2 },
    transfers: [
      { to: 'clean', note: 'Misma idea central: el dominio no depende de la infraestructura.' },
      { to: 'monolito-modular', note: 'Cada módulo puede ser un hexágono.' },
    ],
    diagram: {
      nodes: [
        { id: 'rest', label: 'Adaptador REST', x: 80, y: 75, w: 130, desc: 'Un acceso: peticiones HTTP.' },
        { id: 'test', label: 'Adaptador de pruebas', x: 80, y: 225, w: 130, h: 52, desc: 'Otro acceso: pruebas automáticas que usan el mismo puerto.' },
        { id: 'pin', label: 'Puerto de entrada', x: 212, y: 150, w: 96, h: 52, desc: 'Interfaz que define qué puede pedírsele a la aplicación.' },
        { id: 'dominio', label: 'Dominio', x: 330, y: 150, w: 110, h: 110, shape: 'hex', desc: 'Lógica de negocio pura: no conoce HTTP ni SQL.' },
        { id: 'pout', label: 'Puerto de salida', x: 448, y: 150, w: 96, h: 52, desc: 'Interfaz que define qué necesita la aplicación del exterior.' },
        { id: 'sql', label: 'Adaptador SQL', x: 570, y: 75, w: 120, desc: 'Implementa el puerto con una base de datos.' },
        { id: 'email', label: 'Adaptador de correo', x: 570, y: 225, w: 120, h: 52, desc: 'Implementa el puerto con un servicio de correo.' },
      ],
      edges: [
        ['rest', 'pin'],
        ['test', 'pin'],
        ['pin', 'dominio'],
        ['dominio', 'pout'],
        ['pout', 'sql'],
        ['pout', 'email'],
      ],
      flow: [
        { at: 'rest', text: 'El pasajero entra por un acceso: una petición REST.' },
        { at: 'pin', text: 'El adaptador la traduce al lenguaje del puerto de entrada.' },
        { at: 'dominio', text: 'El dominio aplica las reglas, sin saber de dónde vino la petición.' },
        { at: 'pout', text: 'Necesita guardar: lo pide a través de un puerto de salida.' },
        { at: 'sql', text: 'Hoy el adaptador es SQL; mañana puede ser otro.' },
        { at: 'pout', text: 'También necesita avisar al usuario…' },
        { at: 'email', text: '…y otro adaptador envía el correo.' },
        { at: 'dominio', text: 'El dominio nunca cambió.' },
        { at: 'test', text: 'Las pruebas entran por otro acceso al mismo dominio.' },
      ],
    },
  },
  {
    id: 'clean',
    line: 'L4',
    name: 'Clean Architecture',
    year: 2012,
    yearLabel: '2012',
    yearNote: 'Robert C. Martin ("Uncle Bob") la publicó en su blog en 2012 y en un libro en 2017.',
    metaphor: 'El centro de control protegido en el corazón de la red: nada de afuera puede darle órdenes.',
    definition:
      'Organiza el código en círculos concéntricos: entidades, casos de uso, adaptadores de interfaz y frameworks. La regla de dependencia dice que el código solo puede depender hacia adentro; el negocio no conoce la base de datos, la web ni el framework.',
    pros: [
      'Las reglas de negocio son independientes de frameworks, interfaz y base de datos.',
      'Muy fácil de probar.',
      'Los detalles técnicos se pueden posponer o reemplazar.',
    ],
    cons: [
      'Muchas capas, clases y conversiones de datos.',
      'Curva de aprendizaje pronunciada.',
      'Sobreingeniería para sistemas pequeños.',
    ],
    useWhen: [
      'Sistemas de larga vida con reglas de negocio valiosas.',
      'Se prevé cambiar de framework, de interfaz o de base de datos.',
      'Equipos con experiencia en diseño orientado a objetos.',
    ],
    avoidWhen: ['MVP con fecha de entrega cercana.', 'Aplicaciones CRUD con poca lógica.'],
    companies: ['Apps Android y iOS de gran tamaño', 'Sistemas empresariales en .NET y Java'],
    tech: ['Plantillas Clean Architecture para .NET', 'Kotlin / Android', 'Principios SOLID'],
    ratings: { escalabilidad: 3, complejidad: 4, costo: 2, velocidad: 2, equipo: 3 },
    transfers: [
      { to: 'capas', note: 'También usa capas, pero con las dependencias apuntando hacia el negocio.' },
      { to: 'hexagonal', note: 'Clean generaliza la idea de puertos y adaptadores.' },
    ],
    diagram: {
      zones: [
        { label: 'Frameworks y drivers', x: 14, y: 14, w: 612, h: 272 },
        { label: 'Adaptadores de interfaz', x: 128, y: 44, w: 388, h: 212 },
        { label: 'Casos de uso', x: 236, y: 74, w: 172, h: 152 },
      ],
      nodes: [
        { id: 'ui', label: 'Web / UI', x: 72, y: 160, w: 90, desc: 'Detalle externo: el framework web.' },
        { id: 'ctrl', label: 'Controlador', x: 182, y: 160, w: 92, desc: 'Convierte la petición al formato del caso de uso.' },
        { id: 'uc', label: 'Caso de uso', x: 322, y: 120, w: 140, h: 38, desc: 'Reglas de la aplicación: orquesta las entidades.' },
        { id: 'ent', label: 'Entidades', x: 322, y: 185, w: 140, h: 44, desc: 'El corazón: reglas de negocio que casi nunca cambian.' },
        { id: 'repo', label: 'Repositorio', x: 462, y: 160, w: 92, desc: 'Implementa una interfaz definida por el caso de uso.' },
        { id: 'bd', label: 'BD', x: 572, y: 160, w: 80, shape: 'db', desc: 'Detalle externo: se puede cambiar sin tocar el negocio.' },
      ],
      edges: [
        ['ui', 'ctrl'],
        ['ctrl', 'uc'],
        ['uc', 'ent'],
        ['uc', 'repo'],
        ['repo', 'bd'],
      ],
      flow: [
        { at: 'ui', text: 'La petición entra por el círculo exterior.' },
        { at: 'ctrl', text: 'Un adaptador la convierte a datos simples.' },
        { at: 'uc', text: 'El caso de uso coordina la operación.' },
        { at: 'ent', text: 'Las entidades aplican las reglas de negocio: el centro protegido.' },
        { at: 'uc', text: 'El caso de uso pide guardar a través de una interfaz que él mismo define.' },
        { at: 'repo', text: 'El repositorio (afuera) implementa esa interfaz.' },
        { at: 'bd', text: 'La base de datos es un detalle reemplazable.' },
        { at: 'uc', text: 'Regla de dependencia: el código de adentro no conoce al de afuera.' },
        { at: 'ui', text: 'La respuesta sale hacia el exterior.' },
      ],
    },
  },

  // ───────────────────── LÍNEA 5 · FUTURO (EN CONSTRUCCIÓN) ─────────────────────
  {
    id: 'monolito-modular',
    line: 'L5',
    name: 'Monolito modular',
    year: 2018,
    // TODO: verificar; el término ganó fuerza hacia 2018-2020 (charlas de Simon Brown, caso Shopify).
    yearLabel: '≈ 2018',
    yearNote: 'La idea es antigua, pero resurgió como respuesta al exceso de microservicios.',
    metaphor: 'Una estación grande, pero dividida en andenes independientes.',
    definition:
      'Un solo despliegue, como el monolito, pero dividido en módulos con fronteras estrictas: cada módulo corresponde a una parte del negocio, expone una interfaz pública y oculta sus datos e implementación a los demás.',
    pros: [
      'Mantiene la simplicidad operativa del monolito.',
      'Fronteras claras: el código no se convierte en una bola de lodo.',
      'Los módulos se pueden extraer como microservicios más adelante.',
      'Llamadas en memoria: sin latencia ni fallas de red.',
    ],
    cons: [
      'Sigue escalando como una sola unidad.',
      'Las fronteras dependen de la disciplina o de herramientas que las vigilen.',
      'Un despliegue defectuoso afecta a todos los módulos.',
    ],
    useWhen: [
      'Equipos pequeños o medianos que quieren orden sin complejidad distribuida.',
      'Como paso intermedio antes de adoptar microservicios.',
      'El dominio aún está evolucionando.',
    ],
    avoidWhen: [
      'Los módulos necesitan escalar o desplegarse de forma independiente.',
      'Cientos de desarrolladores trabajando sobre el mismo despliegue.',
    ],
    // TODO: verificar el caso Shopify (monolito modular en Rails con la herramienta Packwerk).
    companies: ['Shopify', 'Basecamp'],
    tech: ['Spring Modulith', 'Packwerk (Rails)', 'Módulos de Java', 'Monorepos'],
    ratings: { escalabilidad: 3, complejidad: 2, costo: 1, velocidad: 4, equipo: 3 },
    transfers: [
      { to: 'monolitica', note: 'Su punto de partida: el mismo despliegue único.' },
      { to: 'microservicios', note: 'Siguiente parada si un módulo necesita independencia.' },
      { to: 'hexagonal', note: 'Buena forma de organizar cada módulo por dentro.' },
    ],
    diagram: {
      zones: [{ label: 'Un solo despliegue · módulos con fronteras', x: 150, y: 22, w: 330, h: 256 }],
      nodes: [
        { id: 'cliente', label: 'Cliente', x: 70, y: 150, w: 100, desc: 'App web o móvil.' },
        { id: 'api', label: 'API', x: 215, y: 150, w: 90, desc: 'Entrada única a la aplicación.' },
        { id: 'pedidos', label: 'Módulo Pedidos', x: 380, y: 78, w: 160, desc: 'Andén independiente: solo expone su interfaz pública.' },
        { id: 'pagos', label: 'Módulo Pagos', x: 380, y: 158, w: 160, desc: 'Andén independiente: sus tablas son privadas.' },
        { id: 'catalogo', label: 'Módulo Catálogo', x: 380, y: 238, w: 160, desc: 'Andén independiente.' },
        { id: 'bd', label: 'BD · un esquema por módulo', x: 560, y: 158, w: 130, h: 64, shape: 'db', desc: 'Una base de datos, pero cada módulo solo toca su propio esquema.' },
      ],
      edges: [
        ['cliente', 'api'],
        ['api', 'pedidos'],
        ['pedidos', 'pagos'],
        ['pagos', 'bd'],
        ['catalogo', 'bd'],
        ['pedidos', 'bd'],
      ],
      flow: [
        { at: 'cliente', text: 'El cliente crea un pedido.' },
        { at: 'api', text: 'Entra a la estación única.' },
        { at: 'pedidos', text: 'Llega al andén de Pedidos.' },
        { at: 'pagos', text: 'Pedidos llama a Pagos por su interfaz pública: es una llamada en memoria.' },
        { at: 'bd', text: 'Cada módulo escribe solo en su propio esquema.' },
        { at: 'pagos', text: 'Nadie toca las tablas de otro módulo.' },
        { at: 'pedidos', text: 'Si mañana Pagos necesita independencia, ya tiene la frontera lista.' },
        { at: 'cliente', text: 'Un solo despliegue, pero ordenado.' },
      ],
    },
  },
  {
    id: 'agentes-ia',
    line: 'L5',
    name: 'Agentes de IA y RAG',
    shortName: 'Agentes de IA y RAG',
    year: 2020,
    yearLabel: '2020 – hoy',
    // TODO: verificar; el artículo de RAG (Lewis et al.) es de 2020 y los agentes despegaron desde 2023.
    yearNote: 'RAG se publicó en 2020; los agentes con herramientas se popularizaron a partir de 2023.',
    metaphor: 'Un guía inteligente que consulta mapas y horarios para resolver tu viaje.',
    definition:
      'Sistemas construidos alrededor de un modelo de lenguaje (LLM). Con RAG (generación aumentada por recuperación), el sistema busca primero la información relevante en tus documentos y se la entrega al modelo para que responda con base en ella. Un agente va más allá: el modelo decide qué pasos seguir y qué herramientas usar, en un ciclo, hasta cumplir el objetivo.',
    pros: [
      'Responde con información propia y actualizada sin reentrenar el modelo.',
      'Puede citar sus fuentes, lo que reduce las respuestas inventadas.',
      'Automatiza tareas abiertas que antes requerían a una persona.',
    ],
    cons: [
      'No es determinista: la misma pregunta puede dar respuestas distintas.',
      'Puede equivocarse con seguridad ("alucinar"); es difícil de probar y evaluar.',
      'Costo y latencia por cada llamada al modelo.',
      'Riesgos nuevos de seguridad, como la inyección de instrucciones (prompt injection).',
    ],
    useWhen: [
      'Preguntas y respuestas sobre documentos o bases de conocimiento.',
      'Asistentes de soporte, de búsqueda o de programación.',
      'Tareas de varios pasos sobre información no estructurada.',
    ],
    avoidWhen: [
      'Se exige un resultado exacto y repetible (cálculos, transacciones).',
      'Decisiones críticas sin supervisión humana.',
      'Una regla sencilla o una búsqueda normal resuelve el problema.',
    ],
    companies: ['Asistentes como ChatGPT, Claude y Gemini', 'GitHub Copilot', 'NotebookLM', 'Perplexity'],
    tech: ['LLM', 'Bases vectoriales (pgvector, Pinecone)', 'LangChain / LlamaIndex', 'Model Context Protocol (MCP)'],
    ratings: { escalabilidad: 3, complejidad: 4, costo: 4, velocidad: 3, equipo: 2 },
    transfers: [
      { to: 'event-driven', note: 'Los agentes suelen coordinarse mediante eventos y colas.' },
      { to: 'serverless', note: 'Las herramientas del agente suelen ser funciones bajo demanda.' },
    ],
    diagram: {
      nodes: [
        { id: 'usuario', label: 'Usuario', x: 65, y: 150, w: 100, desc: 'Hace una pregunta en lenguaje natural.' },
        { id: 'agente', label: 'Agente', x: 210, y: 150, w: 120, h: 60, desc: 'El guía: orquesta el ciclo de pensar, actuar y observar.' },
        { id: 'llm', label: 'Modelo de lenguaje', x: 400, y: 50, w: 170, desc: 'Razona y redacta la respuesta.' },
        { id: 'rag', label: 'Recuperador', x: 400, y: 150, w: 140, desc: 'Busca los fragmentos de documentos más relevantes.' },
        { id: 'vector', label: 'Base vectorial', x: 565, y: 150, w: 130, shape: 'db', desc: 'Los "mapas": documentos indexados por significado.' },
        { id: 'tools', label: 'Herramientas / API', x: 400, y: 250, w: 170, desc: 'Los "horarios": sistemas que el agente puede consultar o accionar.' },
      ],
      edges: [
        ['usuario', 'agente'],
        ['agente', 'llm'],
        ['agente', 'rag'],
        ['rag', 'vector'],
        ['agente', 'tools'],
      ],
      flow: [
        { at: 'usuario', text: '"¿Cómo llego al aeropuerto antes de las 8?"' },
        { at: 'agente', text: 'El guía recibe la pregunta.' },
        { at: 'rag', text: 'RAG: primero busca información relevante.' },
        { at: 'vector', text: 'Consulta los mapas: encuentra los fragmentos más parecidos a la pregunta.' },
        { at: 'agente', text: 'Agrega esos fragmentos al contexto.' },
        { at: 'llm', text: 'El modelo razona: le falta conocer los horarios de hoy.' },
        { at: 'agente', text: 'Decide usar una herramienta.' },
        { at: 'tools', text: 'Consulta la API de horarios en tiempo real.' },
        { at: 'agente', text: 'Observa el resultado y lo suma al contexto.' },
        { at: 'llm', text: 'Con mapas y horarios, el modelo redacta la respuesta.' },
        { at: 'usuario', text: 'Respuesta fundamentada, con sus fuentes.' },
      ],
    },
  },
  {
    id: 'edge',
    line: 'L5',
    name: 'Edge computing',
    year: 2017,
    // TODO: verificar; las CDN existen desde finales de los 90 y el cómputo programable en el borde despegó hacia 2017.
    yearLabel: '≈ 2017',
    yearNote: 'Nace de las redes de distribución de contenido (CDN) de los 90; el cómputo en el borde despega hacia 2017.',
    metaphor: 'Estaciones de barrio cerca del usuario, en vez de obligar a todos a ir hasta el centro.',
    definition:
      'Ejecuta el cómputo y guarda los datos cerca de donde se usan (en nodos repartidos por el mundo o en los propios dispositivos) en lugar de enviarlo todo a un centro de datos central. Así se reduce la latencia y el tráfico de red.',
    pros: [
      'Latencia mínima: la respuesta sale de un nodo cercano.',
      'Sigue funcionando si la conexión con el centro falla.',
      'Menos tráfico hacia el origen; los datos pueden permanecer en su región.',
    ],
    cons: [
      'Entornos de ejecución limitados en cada nodo.',
      'Mantener los datos consistentes entre cientos de ubicaciones es difícil.',
      'Depurar y observar un sistema repartido por el mundo es complejo.',
    ],
    useWhen: [
      'Usuarios repartidos en muchas regiones.',
      'Tiempo real: video, juegos, IoT, vehículos.',
      'Personalización, autenticación o caché cerca del usuario.',
    ],
    avoidWhen: [
      'Todos los usuarios están en una sola región.',
      'Operaciones que dependen de una base de datos central y transaccional.',
    ],
    // TODO: verificar; Netflix opera su propia red de distribución (Open Connect).
    companies: ['Cloudflare', 'Akamai', 'Netflix (Open Connect)', 'Vercel'],
    tech: ['Cloudflare Workers', 'AWS Lambda@Edge / CloudFront', 'Fastly Compute', 'WebAssembly'],
    ratings: { escalabilidad: 5, complejidad: 4, costo: 3, velocidad: 3, equipo: 3 },
    transfers: [
      { to: 'serverless', note: 'El cómputo en el borde suele ofrecerse como funciones serverless.' },
      { to: 'cliente-servidor', note: 'Es cliente-servidor, pero con el servidor acercado al cliente.' },
    ],
    diagram: {
      nodes: [
        { id: 'u1', label: 'Usuario en Monterrey', x: 85, y: 75, w: 150, desc: 'Un usuario lejos del centro de datos.' },
        { id: 'u2', label: 'Usuario en Madrid', x: 85, y: 225, w: 150, desc: 'Otro usuario, en otro continente.' },
        { id: 'e1', label: 'Nodo edge cercano', x: 275, y: 75, w: 150, desc: 'Estación de barrio: responde desde caché o ejecuta lógica ligera.' },
        { id: 'e2', label: 'Nodo edge cercano', x: 275, y: 225, w: 150, desc: 'Estación de barrio en otra región.' },
        { id: 'origen', label: 'Origen central', x: 455, y: 150, w: 130, h: 60, desc: 'El centro: solo se visita cuando el borde no puede resolver.' },
        { id: 'bd', label: 'BD', x: 580, y: 150, w: 80, shape: 'db', desc: 'Datos centrales.' },
      ],
      edges: [
        ['u1', 'e1'],
        ['u2', 'e2'],
        ['e1', 'origen'],
        ['e2', 'origen'],
        ['origen', 'bd'],
      ],
      flow: [
        { at: 'u1', text: 'Un usuario pide una página.' },
        { at: 'e1', text: 'La atiende la estación de su barrio: ya la tenía en caché.' },
        { at: 'u1', text: 'Respuesta en milisegundos, sin viajar al centro.' },
        { at: 'u2', text: 'Otro usuario, en otro continente, pide algo nuevo.' },
        { at: 'e2', text: 'Su nodo cercano no lo tiene guardado.' },
        { at: 'origen', text: 'Solo entonces se viaja al origen central.' },
        { at: 'bd', text: 'El origen consulta los datos.' },
        { at: 'origen', text: 'Devuelve el resultado.' },
        { at: 'e2', text: 'El nodo edge lo guarda para los siguientes vecinos.' },
        { at: 'u2', text: 'La próxima vez, responderá el barrio.' },
      ],
    },
  },
  {
    id: 'cell-based',
    line: 'L5',
    name: 'Cell-based architecture',
    shortName: 'Cell-based',
    year: 2018,
    // TODO: verificar fechas y casos; AWS documenta este enfoque y Slack publicó su migración a celdas (≈ 2023).
    yearLabel: '≈ 2018',
    yearNote: 'Práctica interna de grandes proveedores de nube que empezó a documentarse y difundirse en los últimos años.',
    metaphor: 'La red dividida en zonas aisladas: una falla en una zona no afecta a las demás.',
    definition:
      'Divide el sistema en celdas: copias completas e independientes de la aplicación (servicios y datos), cada una atendiendo a una parte de los usuarios. Un enrutador ligero asigna cada petición a su celda. Si una celda falla, solo se ve afectada su porción de usuarios.',
    pros: [
      'Limita el radio de impacto de una falla (blast radius).',
      'Se escala agregando celdas idénticas.',
      'Permite desplegar un cambio celda por celda y detenerlo si algo sale mal.',
    ],
    cons: [
      'Infraestructura duplicada: costo alto.',
      'El enrutador se vuelve una pieza crítica.',
      'Mover usuarios o datos entre celdas es complicado.',
      'Mucha complejidad operativa.',
    ],
    useWhen: [
      'Plataformas muy grandes con requisitos de disponibilidad extremos.',
      'Software como servicio con muchos clientes que deben estar aislados.',
      'Un fallo global sería inaceptable.',
    ],
    avoidWhen: [
      'Sistemas pequeños o medianos.',
      'Los datos no se pueden particionar por cliente o por región.',
    ],
    // TODO: verificar los casos públicos de DoorDash antes de citarlos.
    companies: ['Amazon Web Services', 'Slack', 'DoorDash'],
    tech: ['Enrutamiento por clave de partición', 'Kubernetes multiclúster', 'Despliegues por etapas'],
    ratings: { escalabilidad: 5, complejidad: 5, costo: 5, velocidad: 1, equipo: 5 },
    transfers: [
      { to: 'microservicios', note: 'Cada celda contiene su propio conjunto de microservicios.' },
      { to: 'edge', note: 'Las celdas suelen repartirse por regiones.' },
    ],
    diagram: {
      zones: [
        { label: 'Celda A', x: 320, y: 12, w: 306, h: 84 },
        { label: 'Celda B', x: 320, y: 108, w: 306, h: 84 },
        { label: 'Celda C', x: 320, y: 204, w: 306, h: 84 },
      ],
      nodes: [
        { id: 'cliente', label: 'Cliente', x: 65, y: 150, w: 100, desc: 'Cada cliente pertenece a una celda.' },
        { id: 'router', label: 'Enrutador de celdas', x: 215, y: 150, w: 130, h: 60, desc: 'Decide a qué celda va cada petición según una clave (cliente, región).' },
        { id: 'sa', label: 'Servicios', x: 420, y: 62, w: 120, h: 38, desc: 'Copia completa de la aplicación.' },
        { id: 'da', label: 'Datos', x: 555, y: 62, w: 100, h: 38, shape: 'db', desc: 'Datos propios de la celda A.' },
        { id: 'sb', label: 'Servicios', x: 420, y: 158, w: 120, h: 38, desc: 'Copia completa de la aplicación.' },
        { id: 'db', label: 'Datos', x: 555, y: 158, w: 100, h: 38, shape: 'db', desc: 'Datos propios de la celda B.' },
        { id: 'sc', label: 'Servicios', x: 420, y: 254, w: 120, h: 38, desc: 'Copia completa de la aplicación.' },
        { id: 'dc', label: 'Datos', x: 555, y: 254, w: 100, h: 38, shape: 'db', desc: 'Datos propios de la celda C.' },
      ],
      edges: [
        ['cliente', 'router'],
        ['router', 'sa'],
        ['router', 'sb'],
        ['router', 'sc'],
        ['sa', 'da'],
        ['sb', 'db'],
        ['sc', 'dc'],
      ],
      flow: [
        { at: 'cliente', text: 'Un cliente envía una petición.' },
        { at: 'router', text: 'El enrutador revisa a qué zona pertenece: celda B.' },
        { at: 'sb', text: 'La celda B la atiende con sus propios servicios…' },
        { at: 'db', text: '…y sus propios datos. No comparte nada con A ni con C.' },
        { at: 'sb', text: 'Si la celda A fallara ahora mismo, este cliente ni lo notaría.' },
        { at: 'router', text: 'Solo los clientes de la celda afectada tendrían problemas.' },
        { at: 'cliente', text: 'Para crecer se agrega otra celda idéntica.' },
      ],
    },
  },
]

export const stationById = Object.fromEntries(stations.map((s) => [s.id, s])) as Record<StationId, Station>

export const ratingLabels: { key: keyof Station['ratings']; label: string; hint: string }[] = [
  { key: 'escalabilidad', label: 'Escalabilidad', hint: '5 = escala muy bien' },
  { key: 'complejidad', label: 'Complejidad', hint: '5 = muy compleja' },
  { key: 'costo', label: 'Costo', hint: '5 = muy costosa de operar' },
  { key: 'velocidad', label: 'Velocidad de desarrollo', hint: '5 = se construye muy rápido' },
  { key: 'equipo', label: 'Tamaño de equipo', hint: '5 = requiere equipos grandes' },
]
