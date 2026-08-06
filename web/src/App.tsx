import { useLenis } from './hooks/useLenis'
import { useCursorGlow } from './hooks/useCursorGlow'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BrandStory from './components/BrandStory'
import WastePipe from './components/WastePipe'
import BottleTrap from './components/BottleTrap'
import Materials from './components/Materials'
import Features from './components/Features'
import Gallery from './components/Gallery'
import Applications from './components/Applications'
import Installation from './components/Installation'
import Specifications from './components/Specifications'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  useLenis()
  useCursorGlow()

  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <BrandStory />
        <WastePipe />
        <BottleTrap />
        <Materials />
        <Features />
        <Gallery />
        <Applications />
        <Installation />
        <Specifications />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
