import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

export const useCartStore = defineStore('cart', () => {
  const items   = ref([])
  const total   = ref(0)
  const loading = ref(false)

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const fetchCart = async () => {
    loading.value = true
    try {
      const res = await api.get('/cart')
      items.value = res.data.data
      total.value = res.data.total
    } catch {}
    finally { loading.value = false }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart', { product_id: productId, quantity })
      await fetchCart()
      return true
    } catch (err) { throw err }
  }

  const updateCart = async (cartId, quantity) => {
    try {
      await api.put(`/cart/${cartId}`, { quantity })
      await fetchCart()
    } catch {}
  }

  const removeFromCart = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`)
      await fetchCart()
    } catch {}
  }

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear')
      items.value = []
      total.value = 0
    } catch {}
  }

  return { items, total, loading, itemCount, fetchCart, addToCart, updateCart, removeFromCart, clearCart }
})