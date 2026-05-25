import { StrictMode } from 'react'
import {QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, BrowserRouter } from 'react-router-dom'
import LandingPage from './pages/Landingpage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { Provider } from 'react-redux';
import store, {persistor} from './Stores/Store.js'
import { ToastProvider } from './context/ToastContext.jsx'
import OtpVerificationPage from './pages/EmailOtpVerificationPage.jsx'
import { DashboardLayout, Protected, SideBarLayout, Stock, Staff, CreateStaff, UpdateStaff, Purchase, CreateSale } from './Components/index.js'
import SuperAdminVerificationPage from './pages/SuperAdminVerificationPage.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import DashboardComp from './Components/Dashboard/DashboardPageComponent/Dashboard.jsx'
import DashboardSalesDetails from './pages/Dashboard/DashboardSalesDetails.jsx'
import DashboardPurchasesDetails from './pages/Dashboard/DashboardPurchasesDetails.jsx'
import CreatePurchaseWizard from './Components/Purchase/CreatePurchaseWizard.jsx'
import EditPurchase from './Components/Purchase/EditPurchase.jsx'
import Sales from './pages/Sales/Sales.jsx'
import Vendor from './pages/Vendor/Vendor.jsx'
import Product from './pages/Product/Product.jsx'

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
              path: '/web/dashboard/sales',
              element: <DashboardSalesDetails />
            },
            {
              path: '/web/dashboard/purchases',
              element: <DashboardPurchasesDetails />
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
                  element : <CreatePurchaseWizard />
                },
                {
                  path : 'purchase/edit/:id',
                  element : <EditPurchase />
                },
                {
                  path : "sale" , 
                  element : <Sales />
                }, 
                {
                  path : "sale/create", 
                  element : <CreateSale />
                },
                {
                  path: 'vendor',
                  element: <Vendor />
                },
                {
                  path: 'product',
                  element: <Product />
                }
            
          ]
        },
      ]
      
    }
  ])

createRoot(document.getElementById('root')).render(

  <QueryClientProvider client={queryClient} >
  <Provider store={store} >
    <PersistGate loading={null}  persistor={persistor}>
  <ToastProvider>
  <RouterProvider router={router} >
  </RouterProvider>
  </ToastProvider>
  </PersistGate>
</Provider>
</QueryClientProvider>
  
)
