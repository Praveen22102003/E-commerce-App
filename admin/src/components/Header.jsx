import { useAuth } from '../context/AuthContext'
import { MdPerson } from 'react-icons/md'

export default function Header({ title }) {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
          <MdPerson size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
    </header>
  )
}