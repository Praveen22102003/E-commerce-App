import { useState, useEffect } from 'react'
import orderService from '../../services/orderService'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'

export default function Orders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await orderService.getAll()
      setOrders(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async (id, status) => {
    try {
      await orderService.updateStatus(id, status)
      setSuccess('Order status updated!')
      fetchOrders()
      setTimeout(() => setSuccess(''), 3000)
    } catch {}
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Orders</h2>
        <span className="text-sm text-slate-500">{orders.length} total orders</span>
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-800">#{order.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{order.customer_name}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                  {formatCurrency(order.final_amount)}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs uppercase">
                    {order.payment_method}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(order.created_at)}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={e => handleStatus(order.id, e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}