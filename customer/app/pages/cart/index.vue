<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

    <!-- Empty -->
    <div v-if="cartStore.items.length === 0" class="text-center py-16 bg-white rounded-2xl shadow-sm">
      <div class="text-6xl mb-4">🛒</div>
      <p class="text-gray-500 text-lg mb-2">Your cart is empty</p>
      <p class="text-gray-400 text-sm mb-6">Add some products to get started</p>
      <NuxtLink to="/products"
        class="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
        Start Shopping
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Items -->
      <div class="lg:col-span-2 space-y-3">
        <div v-for="item in cartStore.items" :key="item.id"
          class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div class="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
            <span v-else class="text-3xl">📦</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-gray-800 truncate">{{ item.name }}</h3>
            <p class="text-blue-600 font-bold mt-1">{{ formatCurrency(item.sale_price || item.price) }}</p>
          </div>
          <div class="flex items-center border border-gray-200 rounded-lg">
            <button @click="cartStore.updateCart(item.id, item.quantity - 1)"
              :disabled="item.quantity <= 1"
              class="px-3 py-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors">−</button>
            <span class="px-4 py-2 text-sm font-semibold">{{ item.quantity }}</span>
            <button @click="cartStore.updateCart(item.id, item.quantity + 1)"
              :disabled="item.quantity >= item.stock"
              class="px-3 py-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors">+</button>
          </div>
          <p class="text-sm font-bold text-gray-800 w-20 text-right">
            {{ formatCurrency((item.sale_price || item.price) * item.quantity) }}
          </p>
          <button @click="cartStore.removeFromCart(item.id)"
            class="text-red-400 hover:text-red-600 transition-colors p-1">✕</button>
        </div>
      </div>

      <!-- Summary -->
      <div class="space-y-4">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal ({{ cartStore.itemCount }} items)</span>
              <span>{{ formatCurrency(cartStore.total) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span :class="cartStore.total > 500 ? 'text-green-600 font-medium' : ''">
                {{ cartStore.total > 500 ? '🎉 FREE' : formatCurrency(50) }}
              </span>
            </div>
            <div class="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800 text-base">
              <span>Total</span>
              <span>{{ formatCurrency(cartStore.total > 500 ? cartStore.total : cartStore.total + 50) }}</span>
            </div>
          </div>
          <button @click="checkout"
            class="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors">
            Proceed to Checkout →
          </button>
          <button @click="cartStore.clearCart()"
            class="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-500 font-medium py-2.5 rounded-xl transition-colors text-sm">
            Clear Cart
          </button>
        </div>

        <div v-if="cartStore.total <= 500"
          class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 text-center">
          🚚 Add <strong>{{ formatCurrency(500 - cartStore.total) }}</strong> more for FREE shipping!
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div v-if="showCheckout" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-screen overflow-y-auto">

        <!-- Success -->
        <div v-if="orderSuccess" class="text-center py-8">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Order Placed!</h3>
          <p class="text-gray-500 text-sm mb-1">Your order has been placed successfully</p>
          <p class="text-blue-600 font-semibold">Order #{{ orderId }}</p>
          <div class="flex gap-3 mt-6">
            <button @click="showCheckout = false; navigateTo('/orders')"
              class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
              View Orders
            </button>
            <button @click="showCheckout = false; navigateTo('/')"
              class="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>

        <template v-else>
          <h3 class="text-lg font-bold text-gray-800 mb-4">Shipping Details</h3>

          <div v-if="orderError"
            class="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm">
            {{ orderError }}
          </div>

          <form @submit.prevent="placeOrder" class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <input v-model="form.shipping_name" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                <input v-model="form.shipping_phone" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Address *</label>
              <textarea v-model="form.shipping_address" required rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" />
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">City *</label>
                <input v-model="form.shipping_city" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">State *</label>
                <input v-model="form.shipping_state" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Pincode *</label>
                <input v-model="form.shipping_pincode" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
              <select v-model="form.payment_method"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                <option value="cod">💵 Cash on Delivery</option>
                <option value="online">💳 Online Payment</option>
              </select>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Total Amount</span>
                <span class="font-bold text-gray-800">
                  {{ formatCurrency(cartStore.total > 500 ? cartStore.total : cartStore.total + 50) }}
                </span>
              </div>
            </div>
            <div class="flex gap-3 pt-1">
              <button type="submit" :disabled="placingOrder"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {{ placingOrder ? 'Placing Order...' : '✅ Place Order' }}
              </button>
              <button type="button" @click="showCheckout = false"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatCurrency } from '../../utils/helpers'
import api from '../../utils/api'

const cartStore    = useCartStore()
const authStore    = useAuthStore()
const showCheckout = ref(false)
const placingOrder = ref(false)
const orderSuccess = ref(false)
const orderError   = ref('')
const orderId      = ref(null)

const form = ref({
  shipping_name:    authStore.user?.name || '',
  shipping_phone:   authStore.user?.phone || '',
  shipping_address: '',
  shipping_city:    '',
  shipping_state:   'Tamil Nadu',
  shipping_pincode: '',
  payment_method:   'cod'
})

if (import.meta.client) cartStore.fetchCart()

const checkout = () => {
  if (!authStore.isLoggedIn) { navigateTo('/auth/login'); return }
  showCheckout.value = true
}

const placeOrder = async () => {
  placingOrder.value = true
  orderError.value = ''
  try {
    const res = await api.post('/orders', form.value)
    orderId.value = res.data.data.order_id
    orderSuccess.value = true
    await cartStore.fetchCart()
  } catch (err) {
    orderError.value = err.response?.data?.message || 'Failed to place order.'
  } finally {
    placingOrder.value = false
  }
}
</script>