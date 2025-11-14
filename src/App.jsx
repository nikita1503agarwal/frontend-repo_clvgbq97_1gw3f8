import Hero from './components/Hero'
import Calculator from './components/Calculator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Hero />
      <Calculator />
      <footer className="py-8 text-center text-slate-500 text-sm">
        Built with motion-first design.
      </footer>
    </div>
  )
}

export default App
