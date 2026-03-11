import { StrictMode } from 'react'
import {QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
import { DashboardLayout, Protected, SideBarLayout, Stock, Staff, CreateStaff, UpdateStaff, Purchase, CreateSale } from './Components/index.js'
import SuperAdminVerificationPage from './pages/SuperAdminVerificationPage.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import DashboardComp from './Components/Dashboard/DashboardPageComponent/Dashboard.jsx'
import CreatePurchase from './Components/Purchase/CreatePurchase.jsx'
import AddPurchaseItems from './Components/Purchase/AddPurchaseItems.jsx'
import Sales from './pages/Sales/Sales.jsx'

const queryClient = new QueryClient();

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
            
            {
              path : '/web/staff',
              element : <Staff />,
            },
             
                {
                  path : '/web/staff/create-staff',
                  element : <CreateStaff />
                },
                {
                  path : '/web/staff/update/:id',
                  element : <UpdateStaff />
                },
                {
                  path : 'purchase',
                  element : <Purchase />
                }, 
                {
                  path : 'purchase/create', 
                  element : <CreatePurchase />
                },
                {
                  path : "purchase/:purchaseId/items",
                   element : <AddPurchaseItems />
                },
                {
                  path : "sale" , 
                  element : <Sales />
                }, 
                {
                  path : "sales/create", 
                  element : <CreateSale />
                }
            
          ]
        },
      ]
      
    }
  ])

createRoot(document.getElementById('root')).render(

  <QueryClientProvider client={queryClient} >
  <Provider store={store} >
  <RouterProvider router={router} >
  </RouterProvider>
</Provider>
</QueryClientProvider>
  
)
