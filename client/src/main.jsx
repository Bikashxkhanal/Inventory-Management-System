import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, BrowserRouter } from 'react-router-dom'
import LandingPage from './pages/Landingpage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'


 const router = createBrowserRouter([
    {
      path: '/',
      element : <App />,
      children : [
        {
          path : '/',
          element : <LandingPage />,
        },
        {
          path : '/login',
          element: <LoginPage />
        },
        {
          path: '/signup',
          element: <SignupPage />,
        }
      ]
      
    }
  ])

createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} >

  </RouterProvider>

  
)
