import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Divide, X, Minus, Plus, Equal, Delete, RotateCcw } from 'lucide-react'

const keys = [
  { label: 'C', type: 'action' },
  { label: '⌫', type: 'action' },
  { label: '÷', value: '/', type: 'op' },
  { label: '7' },
  { label: '8' },
  { label: '9' },
  { label: '×', value: '*', type: 'op' },
  { label: '4' },
  { label: '5' },
  { label: '6' },
  { label: '−', value: '-', type: 'op' },
  { label: '1' },
  { label: '2' },
  { label: '3' },
  { label: '+', value: '+', type: 'op' },
  { label: '0', span: 2 },
  { label: '.', type: 'dot' },
  { label: '=', type: 'equal' },
]

function evalSafe(expr) {
  try {
    // Prevent eval injection by allowing only digits, operators, and dot
    if (!/^[-+*/.()\d\s]+$/.test(expr)) return 'Err'
    // Avoid leading operators like * /
    const cleaned = expr.replace(/\s+/g, '')
    if (/^[*/.]/.test(cleaned)) return 'Err'
    // Avoid multiple consecutive operators
    if (/([*/+\-])\1+/.test(cleaned)) return 'Err'
    // Evaluate using Function constructor in a safe scope
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict";return (${cleaned})`)()
    if (!isFinite(result)) return 'Err'
    return +parseFloat(result.toFixed(10))
  } catch {
    return 'Err'
  }
}

export default function Calculator() {
  const [expr, setExpr] = useState('')
  const [display, setDisplay] = useState('0')
  const [justEvaluated, setJustEvaluated] = useState(false)

  const press = (key) => {
    const label = key.value ?? key.label

    if (key.type === 'equal') {
      const out = evalSafe(expr || display)
      setDisplay(String(out))
      setExpr(String(out))
      setJustEvaluated(true)
      return
    }

    if (key.type === 'action' && label === 'C') {
      setExpr('')
      setDisplay('0')
      setJustEvaluated(false)
      return
    }

    if (key.type === 'action' && (label === '⌫')) {
      const next = expr.slice(0, -1)
      setExpr(next)
      setDisplay(next || '0')
      return
    }

    if (justEvaluated && /[0-9]/.test(label)) {
      setExpr(label)
      setDisplay(label)
      setJustEvaluated(false)
      return
    }

    const next = expr + label
    setExpr(next)
    setDisplay(next)
    setJustEvaluated(false)
  }

  const bounce = {
    hidden: { scale: 0.95, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  }

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-md mx-auto w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl shadow-xl p-5"
        >
          <div className="mb-4">
            <div className="text-xs text-slate-500 h-5 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={expr}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {expr || '\u00A0'}
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.div
              key={display}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-right text-4xl md:text-5xl font-semibold tracking-tight text-slate-900"
            >
              {display}
            </motion.div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {keys.map((k) => (
              <motion.button
                key={k.label}
                variants={bounce}
                initial="hidden"
                animate="show"
                whileTap={{ scale: 0.92 }}
                onClick={() => press(k)}
                className={`h-12 md:h-14 rounded-xl font-medium border border-slate-200 shadow-sm bg-white text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-colors ${
                  k.type === 'op' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''
                } ${k.type === 'equal' ? 'bg-blue-600 text-white border-blue-600 col-span-1' : ''} ${k.span === 2 ? 'col-span-2' : ''}`}
              >
                <span className="inline-flex items-center justify-center gap-1">
                  {k.label}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="mt-3 text-xs text-slate-500 flex items-center gap-2 justify-center">
            <RotateCcw className="w-3.5 h-3.5" />
            Tap keys or use your keyboard. Operators: + − × ÷
          </div>
        </motion.div>
      </div>
    </section>
  )
}
