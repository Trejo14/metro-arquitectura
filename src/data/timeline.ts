/* HISTORIA DE LA RED: épocas e hitos que NO son estaciones (las estaciones se toman de stations.ts). */

export interface Era {
  from: number
  to: number
  name: string
  summary: string
}

export const eras: Era[] = [
  { from: 1960, to: 1989, name: 'Mainframes y PC', summary: 'Una sola máquina grande; después, computadoras personales conectadas en red.' },
  { from: 1990, to: 2009, name: 'La Web y la empresa', summary: 'Internet conecta todo; las empresas integran sus sistemas.' },
  { from: 2010, to: 2019, name: 'La nube', summary: 'Infraestructura bajo demanda, contenedores y sistemas a escala global.' },
  { from: 2020, to: 2100, name: 'La era de la IA', summary: 'Los modelos de lenguaje se vuelven un componente más de la arquitectura.' },
]

export interface Milestone {
  year: number
  label: string
  note: string
}

export const milestones: Milestone[] = [
  { year: 1964, label: 'Mainframes', note: 'IBM System/360: todo el software en una sola máquina.' },
  { year: 1991, label: 'World Wide Web', note: 'Tim Berners-Lee publica la Web.' },
  { year: 2006, label: 'Nube pública', note: 'Amazon Web Services lanza S3 y EC2.' },
  { year: 2013, label: 'Docker', note: 'Los contenedores se vuelven accesibles.' },
  // TODO: verificar; Kubernetes se anunció en 2014 y su versión 1.0 es de 2015.
  { year: 2014, label: 'Kubernetes', note: 'Orquestación de contenedores a gran escala.' },
  { year: 2022, label: 'ChatGPT', note: 'La IA generativa llega al público general.' },
]
