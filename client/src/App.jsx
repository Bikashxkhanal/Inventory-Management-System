import { useState } from 'react'
import { NavBar } from './Components/index'
import { Outlet } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <NavBar />
    <Outlet />
    </>

   
  )
}

export default App
