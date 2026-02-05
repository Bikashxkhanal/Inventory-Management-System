# 🛒 Inventory Management System (IMS)

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react&logoColor=white) 
![Node.js](https://img.shields.io/badge/Node.js-20.4-green?logo=node.js&logoColor=white) 
![PHP](https://img.shields.io/badge/PHP-8.2-purple?logo=php&logoColor=white) 
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql&logoColor=white) 
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-skyblue?logo=tailwind-css&logoColor=white) 
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?logo=redux&logoColor=white) 
![TanStack](https://img.shields.io/badge/TanStack-ReactQuery-orange?logo=react&logoColor=white) 
![Redis](https://img.shields.io/badge/Redis-7.0-orange?logo=redis&logoColor=white)  

---

## 🔥 Overview

The **Inventory Management System (IMS)** is a **full-stack application** designed for multi-level inventory operations.  

- **Backend:** PHP serves as a **data provider**, handling all requests and business logic related to users, products, orders, and reports.  
- **Frontend:** React handles **UI, routing, state management**, caching, and data visualization.  
- **SPA with CSR:** Smooth, dynamic navigation without full-page reloads.  
- **Multi-user system:** Supports **Super Admin, Admin, Store Manager, and Sales Person** with **role-based dashboards and access control**.  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | `React.js` • `Tailwind CSS` • `TanStack Query` • `Redux` • Client-Side Rendering (CSR) |
| **Backend** | `PHP` • `PHP Built-in Session` • REST APIs • Data Provider only |
| **Database** | `MySQL` |
| **Caching** | `Redis` |
| **Architecture** | SPA • CSR • Role-based Access Control |

---

## 🌟 User Roles

1. **Super Admin** – Full control over all operations and users.  
2. **Admin** – Can add/remove users, manage suppliers, and oversee operations.  
3. **Store Manager** – Can view reports, generate purchase orders (PO), and override sales staff decisions.  
4. **Sales Person** – Handles selling and billing operations under role-based restrictions.  

---

## 📝 Business Logic & Features

1. **User Authentication:** Users must be able to login securely.  
2. **Role-Based Authentication:** Access and operations depend on user role.  
3. **Role-Based Dashboard Orientation:** Each role sees a tailored dashboard view.  
4. **Role-Based Access Level:** Permissions and features vary based on role.  
5. **Purchase Order Management:** Organizations can generate POs and send them to suppliers.  
6. **Batch-Based Product Storage:** Products stored with batch tracking.  
7. **Real-Time Stock Updates:** Stock updates automatically on purchases or sales.  
8. **Billing System:** Generate bills during sales operations.  
9. **Stock Alerts:** Notify when stock is low or full.  
10. **Sales Forecasting:** Predict monthly best-selling products.  
11. **Reports Visualization:** View monthly sales reports dynamically.  
12. **Stock Prediction:** Suggest required stock based on previous sales.  
13. **Admin Operations:** Admin can register users (sales staff and managers), add/remove suppliers and users.  
14. **Manager Permissions:** Managers can view reports, generate POs, and overturn sales staff decisions.  

---

## ⚡ Frontend Highlights

- Built as a **React SPA** for **dynamic UI rendering**.  
- **State Management:** `Redux` manages global app state efficiently.  
- **Data Fetching & Caching:** `TanStack Query` integrates with backend APIs and caches results in `Redis`.  
- **UI/UX:** `Tailwind CSS` ensures responsive and modern design.  
- **Routing:** Frontend handles all routing and role-based dashboard navigation.  

---

## 🔹 Backend Highlights

- **PHP Backend:** Provides all data via REST APIs.  
- **Session Management:** PHP built-in session handles authentication.  
- **Business Logic:** Enforces role-based operations and validations.  
- **Database:** `MySQL` stores users, products, orders, and reports.  
