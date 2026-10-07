# Metro Arquitectura

Presentación web interactiva sobre **modelos arquitectónicos de software**, con forma de mapa del metro:
cada línea es una familia de arquitecturas, cada estación es una arquitectura y los trenes son peticiones
que viajan por el sistema.

Hecha con React + Vite + TypeScript + Tailwind CSS + Framer Motion. No tiene backend: es un sitio estático.

## Instalación y ejecución

Requiere [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install        # instala las dependencias
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # revisa tipos y genera la versión final en dist/
npm run preview    # sirve dist/ para probar la versión final
```

> Si `npm install` falla con `ECONNRESET` o se queda colgado (algunas redes bloquean el registro de npm),
> usa el espejo oficial: `npm install --registry https://registry.yarnpkg.com`

## Cómo presentar

| Tecla | Acción |
| --- | --- |
| `→` / `AvPág` | Siguiente parada del recorrido |
| `←` / `RePág` | Parada anterior |
| `F` | Pantalla completa |
| `M` | Volver al mapa |
| `Esc` | Cerrar el letrero de la estación |
| `Inicio` / `Fin` | Primera / última parada |

El recorrido es: Bienvenida → Mapa → las 14 estaciones → Visualizar (C4) → Planificar → Hora pico →
Historia → Juego → Fin. El orden se define en `src/data/tour.ts`.

También hay botones para todo en la barra superior (flechas, modo claro/oscuro y pantalla completa).
Cada parada tiene su propia dirección (por ejemplo `…/#/estacion/microservicios`), así que se puede
compartir un enlace directo. La tarjeta de viaje guarda las estaciones visitadas en el navegador.

## Cómo editar el contenido

Todo el contenido está en `src/data/`. No hace falta tocar los componentes.

| Archivo | Qué contiene |
| --- | --- |
| `stations.ts` | Las 14 estaciones: metáfora, definición, ventajas, desventajas, cuándo usarla, ejemplos, indicadores (1–5), año, transbordos y el diagrama con el recorrido del tren |
| `lines.ts` | Nombre, descripción y color de cada línea |
| `mapLayout.ts` | Posición de cada estación en el mapa, trazo de las líneas y pasillos de transbordo |
| `tour.ts` | Secciones y orden del recorrido (flechas del teclado) |
| `c4.ts` | Los cuatro niveles del modelo C4 y sus diagramas |
| `adrs.ts` | Los ADR (contexto, decisión, alternativas, consecuencias) |
| `evolution.ts` | Las etapas de la "ruta de evolución" |
| `rushHour.ts` | Parámetros del simulador "Hora pico" (capacidades y reparto del tráfico) |
| `timeline.ts` | Épocas e hitos de la línea del tiempo (las estaciones se toman de `stations.ts`) |
| `quiz.ts` | Escenarios, opciones, respuestas y retroalimentación del juego |
| `credits.ts` | Nombres del equipo, materia, docente, conclusión y URL del código QR |

### Antes de exponer

1. **Créditos:** escribe los nombres reales en `src/data/credits.ts`.
2. **Datos por verificar:** busca `TODO` en `src/data/` (fechas aproximadas y casos de empresas que conviene
   confirmar con una fuente antes de citarlos en clase).
3. **Código QR:** se genera solo con la dirección donde esté publicada la página. Si quieres fijarla,
   escribe la URL definitiva en `publicUrl` dentro de `credits.ts`.

### Agregar una estación

1. Agrega su identificador al tipo `StationId` en `src/data/types.ts`.
2. Agrega el objeto de la estación en `stations.ts`.
3. Dale una posición en `stationPos` (`mapLayout.ts`) y ajusta el trazo de su línea para que pase por ella.

TypeScript avisará si falta alguno de los pasos.

## Estructura

```
src/
├─ data/                 contenido (ver tabla anterior)
├─ hooks/                useRoute (rutas con #), useTheme, useVisited, usePresentation
├─ components/
│  ├─ layout/            TopBar, MetroCard (tarjeta de viaje), SectionShell
│  ├─ map/               MetroMap (mapa SVG con trenes), Legend
│  ├─ station/           StationSign (letrero), FlowDiagram (tren por los componentes), Ratings
│  └─ sections/          Welcome, MapSection, C4Section, PlanSection, RushHour, Timeline, Quiz, Finale
├─ App.tsx               une rutas, secciones, letrero y tarjeta
└─ index.css             colores de modo claro/oscuro (variables CSS) y estilos base
```

## Despliegue

El sitio usa rutas con `#` y `base: './'`, así que funciona en cualquier carpeta sin configuración extra.

### GitHub Pages

1. Sube el proyecto a un repositorio de GitHub, en la rama `main`.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Listo: el flujo `.github/workflows/deploy.yml` compila y publica en cada `push` a `main`.
   La dirección será `https://TU_USUARIO.github.io/TU_REPOSITORIO/`.

### Vercel

1. En [vercel.com](https://vercel.com), **Add New → Project** e importa el repositorio.
2. Vercel detecta Vite automáticamente (comando `npm run build`, carpeta `dist`). Pulsa **Deploy**.

### Cualquier otro hosting estático

Ejecuta `npm run build` y sube el contenido de la carpeta `dist/`.
