import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, BrowserRouter } from 'react-router-dom'
import LandingPage from './pages/Landingpage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import EmailOtpVerification from './Components/OtpVerification/EmailOtpVerification.jsx';
import { Provider } from 'react-redux';
import store from './Components/Stores/Store.js'


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
          element: <EmailOtpVerification />
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
