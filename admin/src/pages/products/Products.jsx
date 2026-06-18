import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import productService from '../../services/productService'
import { formatCurrency } from '../../utils/helpers'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await productService.getAll()
      setProducts(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await productService.delete(id)
      setSuccess('Product deleted!')
      fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete product')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Products</h2>
        <button
          onClick={() => navigate('/products/add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <MdAdd size={20} /> Add Product
        </button>
      </div>

      {success && <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 mb-4 text-sm">{success}</div>}
      {error   && <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : products.map((product, i) => (
              <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-500">{i + 1}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-800">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.sku}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.category_name}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-800">{formatCurrency(product.price)}</p>
                  {product.sale_price && (
                    <p className="text-xs text-green-600">{formatCurrency(product.sale_price)}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-slate-800'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}