import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const pageTitles = {
  '/dashboard':  'Dashboard',
  '/products':   'Products',
  '/categories': 'Categories',
  '/orders':     'Orders',
  '/customers':  'Customers',
}

export default function Layout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Admin Panel'

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col">
        <Header title={title} />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}