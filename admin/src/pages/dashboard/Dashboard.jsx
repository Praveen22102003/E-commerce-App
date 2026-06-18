import { useState, useEffect } from 'react'
import API from '../../services/api'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import {
  MdShoppingCart, MdAttachMoney,
  MdPeople, MdInventory
} from 'react-icons/md'

export default function Dashboard() {
  const [stats, setStats]       = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/dashboard')
      setStats(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-lg">Loading dashboard...</div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.stats.totalOrders,
      icon: <MdShoppingCart size={24} />,
      color: 'bg-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(stats?.stats.totalRevenue || 0),
      icon: <MdAttachMoney size={24} />,
      color: 'bg-green-500',
      bg: 'bg-green-50',
      text: 'text-green-600'
    },
    {
      label: 'Total Customers',
      value: stats?.stats.totalCustomers,
      icon: <MdPeople size={24} />,
      color: 'bg-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-600'
    },
    {
      label: 'Total Products',
      value: stats?.stats.totalProducts,
      icon: <MdInventory size={24} />,
      color: 'bg-orange-500',
      bg: 'bg-orange-50',
      text: 'text-orange-600'
    },
  ]

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} ${card.text} p-3 rounded-xl`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            <p className="text-sm text-slate-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.monthlySales || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total_revenue" fill="#3b82f6" radius={[4,4,0,0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Products</h3>
          <div className="space-y-3">
            {stats?.topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.total_sold} sold</p>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(product.total_revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentOrders.map(order => (
              <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-800">#{order.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{order.customer_name}</td>
                <td className="px-6 py-4 text-sm font-medium">{formatCurrency(order.final_amount)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}