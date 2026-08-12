import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { api } from './api/client'
import Layout from './components/layout/Layout'
import { initGA } from './lib/ga'
import AdminLayout from './admin/AdminLayout'
import BannersPage from './admin/pages/BannersPage'
import CategoriesPage from './admin/pages/CategoriesPage'
import DashboardPage from './admin/pages/DashboardPage'
import LoginPage from './admin/pages/LoginPage'
import OrdersPage from './admin/pages/OrdersPage'
import PoliciesPage from './admin/pages/PoliciesPage'
import ProductsAdminPage from './admin/pages/ProductsPage'
import SettingsPage from './admin/pages/SettingsPage'
import BrandPage from './pages/BrandPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import HomePage from './pages/HomePage'
import PolicyPage from './pages/PolicyPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'

export default function App() {
  useEffect(() => {
    const envGa = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (envGa) {
      initGA(envGa)
      return
    }
    api
      .company()
      .then((c) => {
        if (c.settings?.ga_measurement_id) {
          initGA(c.settings.ga_measurement_id)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<LoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsAdminPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="brands/:slug" element={<BrandPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="policies/:type" element={<PolicyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
