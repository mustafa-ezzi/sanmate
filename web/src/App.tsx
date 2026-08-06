import { useLenis } from './hooks/useLenis'
import { useCustomCursor } from './hooks/useCustomCursor'
import { useScrollProgress } from './hooks/useScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BuyProducts from './components/BuyProducts'
import WastePipe from './components/WastePipe'
import BottleTrap from './components/BottleTrap'
import Features from './components/Features'
import Gallery from './components/Gallery'
import Specifications from './components/Specifications'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  useLenis()
  useCustomCursor()
  useScrollProgress()

  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <BuyProducts />
        <WastePipe />
        <BottleTrap />
        <Features />
        <Gallery />
        <Specifications />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
