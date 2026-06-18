import { useState, useEffect } from 'react'
import customerService from '../../services/customerService'
import { formatDate, getStatusColor } from '../../utils/helpers'
import { MdPerson } from 'react-icons/md'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState('')

  useEffect(() => { fetchCustomers() }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await customerService.getAll()
      setCustomers(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    try {
      await customerService.updateStatus(id, newStatus)
      setSuccess('Customer status updated!')
      fetchCustomers()
      setTimeout(() => setSuccess(''), 3000)
    } catch {}
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Customers</h2>
        <span className="text-sm text-slate-500">{customers.length} total customers</span>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 mb-4 text-sm">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : customers.map(customer => (
              <tr key={customer.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MdPerson size={16} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-800">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{customer.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{customer.city || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(customer.created_at)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(customer.id, customer.status)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                      ${customer.status === 'active'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                  >
                    {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}