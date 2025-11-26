import { useState } from 'react'
import NavBar from './Components/NavBar'
import HomePage from './Components/Home'
import Services from './Components/Services'
import AboutUs from './Components/Aboutus'
import Footer from './Components/Footer'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <NavBar />
   <HomePage />
   <Services />
   <AboutUs />
   <Footer />
   </>
   
  )
}

export default App
