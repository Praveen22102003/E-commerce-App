<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

    <div v-if="!authStore.isLoggedIn" class="text-center py-16 bg-white rounded-2xl shadow-sm">
      <div class="text-5xl mb-4">🔒</div>
      <p class="text-gray-500 mb-4">Please login to view your orders</p>
      <NuxtLink to="/auth/login"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
        Login
      </NuxtLink>
    </div>

    <div v-else-if="loading" class="text-center py-16 text-gray-400">
      Loading your orders...
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-16 bg-white rounded-2xl shadow-sm">
      <div class="text-5xl mb-4">📦</div>
      <p class="text-gray-500 mb-2">No orders yet</p>
      <p class="text-gray-400 text-sm mb-6">Your orders will appear here once you place one</p>
      <NuxtLink to="/products"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
        Start Shopping
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 gap-3">
          <div>
            <p class="font-bold text-gray-800">Order #{{ order.id }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ formatDate(order.created_at) }}</p>
          </div>
          <div class="flex items-center gap-4">
            <span :class="`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`">
              {{ order.status.toUpperCase() }}
            </span>
            <p class="font-bold text-gray-800 text-lg">{{ formatCurrency(order.final_amount) }}</p>
          </div>
        </div>

        <!-- Body -->
        <div class="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-xs text-gray-400 mb-1">Payment Method</p>
            <p class="text-sm font-semibold text-gray-800 uppercase">{{ order.payment_method }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-1">Payment Status</p>
            <p class="text-sm font-semibold text-gray-800 capitalize">{{ order.payment_status }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-1">Deliver To</p>
            <p class="text-sm font-semibold text-gray-800">{{ order.shipping_name }}</p>
            <p class="text-xs text-gray-500">{{ order.shipping_city }}, {{ order.shipping_state }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-1">Shipping</p>
            <p class="text-sm font-semibold"
              :class="order.shipping_amount == 0 ? 'text-green-600' : 'text-gray-800'">
              {{ order.shipping_amount == 0 ? '🎉 FREE' : formatCurrency(order.shipping_amount) }}
            </p>
          </div>
        </div>

        <!-- Cancel -->
        <div v-if="order.status === 'pending'" class="px-6 pb-4">
          <button @click="cancelOrder(order.id)"
            class="text-sm text-red-500 hover:text-red-700 font-medium border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            ✕ Cancel Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'
import api from '../../utils/api'

const authStore = useAuthStore()
const orders    = ref([])
const loading   = ref(true)

onMounted(async () => {
  if (!authStore.isLoggedIn) { loading.value = false; return }
  try {
    const res = await api.get('/orders')
    orders.value = res.data.data
  } finally {
    loading.value = false
  }
})

const cancelOrder = async (id) => {
  if (!confirm('Cancel this order?')) return
  try {
    await api.put(`/orders/${id}/cancel`)
    const res = await api.get('/orders')
    orders.value = res.data.data
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to cancel')
  }
}
</script>