
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import Layout from './components/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import Products from './pages/products/Products'
import ProductForm from './pages/products/ProductForm'
import Categories from './pages/categories/Categories'
import Orders from './pages/orders/Orders'
import Customers from './pages/customers/Customers'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard"         element={<Dashboard />} />
        <Route path="products"          element={<Products />} />
        <Route path="products/add"      element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="categories"        element={<Categories />} />
        <Route path="orders"            element={<Orders />} />
        <Route path="customers"         element={<Customers />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App