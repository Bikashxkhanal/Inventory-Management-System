import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, BrowserRouter } from 'react-router-dom'
import LandingPage from './pages/Landingpage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { Provider } from 'react-redux';
import store from './Stores/Store.js'
import OtpVerificationPage from './pages/EmailOtpVerificationPage.jsx'
import { Protected } from './Components/index.js'


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
        },
        {
          path: '/signup/email-otp-verification',
          element:
          (<Protected >
           <OtpVerificationPage  />
           </Protected>)
        }
      ]
      
    }
  ])

createRoot(document.getElementById('root')).render(

  <Provider store={store} >
  <RouterProvider router={router} >
    

  </RouterProvider>
</Provider>
  
)
