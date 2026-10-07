import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  eyebrow: string
  title: string
  lead?: ReactNode
  children: ReactNode
}

/** Marco común de cada sección: antetítulo, título grande y contenido. */
export function SectionShell({ eyebrow, title, lead, children }: Props) {
  return (
    <motion.main
      className="mx-auto max-w-[100rem] px-4 pb-28 pt-6 sm:px-6 lg:pt-8"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-1 text-4xl font-bold leading-[1.05] tracking-tight lg:text-5xl">{title}</h1>
      {lead && <p className="mt-3 max-w-4xl text-xl leading-snug text-muted">{lead}</p>}
      <div className="mt-6">{children}</div>
    </motion.main>
  )
}
