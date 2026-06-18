import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MdDashboard, MdInventory, MdCategory,
  MdShoppingCart, MdPeople, MdLogout, MdStore
} from 'react-icons/md'

const navItems = [
  { path: '/dashboard',  icon: <MdDashboard size={20} />,    label: 'Dashboard' },
  { path: '/products',   icon: <MdInventory size={20} />,    label: 'Products' },
  { path: '/categories', icon: <MdCategory size={20} />,     label: 'Categories' },
  { path: '/orders',     icon: <MdShoppingCart size={20} />, label: 'Orders' },
  { path: '/customers',  icon: <MdPeople size={20} />,       label: 'Customers' },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="w-60 min-h-screen bg-slate-800 fixed left-0 top-0 z-50 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <MdStore size={28} className="text-blue-400" />
        <span className="text-white text-lg font-bold">Admin Panel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-4 py-3 rounded-lg text-sm font-medium transition-all
               ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg text-sm font-medium transition-all"
        >
          <MdLogout size={20} />
          Logout
        </button>
      </div>
    </aside>
  )
}