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
import { DashboardLayout, Protected, SideBarLayout, Stock } from './Components/index.js'
import SuperAdminVerificationPage from './pages/SuperAdminVerificationPage.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import DashboardComp from './Components/Dashboard/DashboardPageComponent/Dashboard.jsx'


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
        },
        {
          path: '/super-admin-verification',
          element : (<Protected>
            <SuperAdminVerificationPage />
          </Protected>)
        },
        {path: '/super-admin-verification/email-verify',
          element : (
            <Protected >
           <OtpVerificationPage  />
           </Protected>

          )
        },
        {
          path : '/web',
          element : (
           <Protected >
           <Dashboard  />
            </Protected>
             
          ), 
          children : [
            {
              path : '/web/dashboard', 
              element : <DashboardComp />
            }, 
            {
              path : '/web/stock', 
              element : <Stock />
            },
            
          ]
        },
      ]
      
    }
  ])

createRoot(document.getElementById('root')).render(

  <Provider store={store} >
  <RouterProvider router={router} >
  </RouterProvider>
</Provider>
  
)
