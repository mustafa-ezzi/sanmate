import { useState } from 'react'
import { useLenis } from './hooks/useLenis'
import { useCustomCursor } from './hooks/useCustomCursor'
import { useScrollProgress } from './hooks/useScrollProgress'
import SplashLoader from './components/SplashLoader'
import Navbar from './components/Navbar'
import ProductElevate from './components/ProductElevate'
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
  const [splashDone, setSplashDone] = useState(false)
  const [booted, setBooted] = useState(false)

  useLenis()
  useCustomCursor()
  useScrollProgress()

  return (
    <div className="relative">
      {!booted && (
        <SplashLoader
          onDone={() => {
            setBooted(true)
            setSplashDone(true)
          }}
        />
      )}

      <div
        className={`transition-opacity duration-500 ${
          splashDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Navbar />
        <main>
          <ProductElevate active={splashDone} />
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
    </div>
  )
}
