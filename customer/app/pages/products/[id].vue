<template>
  <div>
    <div v-if="loading" class="text-center py-16 text-gray-400">Loading product...</div>

    <div v-else-if="product">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <NuxtLink to="/" class="hover:text-blue-600">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/products" class="hover:text-blue-600">Products</NuxtLink>
        <span>/</span>
        <span class="text-gray-800">{{ product.name }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Image -->
        <div class="bg-white rounded-2xl shadow-sm flex items-center justify-center h-80 overflow-hidden">
          <img v-if="product.image" :src="product.image" :alt="product.name"
            class="w-full h-full object-cover" />
          <span v-else class="text-8xl">📦</span>
        </div>

        <!-- Details -->
        <div class="space-y-4">
          <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            {{ product.category_name }}
          </span>
          <h1 class="text-2xl font-bold text-gray-800">{{ product.name }}</h1>
          <p class="text-gray-500 text-sm leading-relaxed">{{ product.description }}</p>

          <!-- Price -->
          <div class="flex items-center gap-3 py-2">
            <span class="text-3xl font-bold text-gray-800">
              {{ formatCurrency(product.sale_price || product.price) }}
            </span>
            <span v-if="product.sale_price" class="text-lg text-gray-400 line-through">
              {{ formatCurrency(product.price) }}
            </span>
            <span v-if="product.sale_price"
              class="bg-green-100 text-green-700 text-sm px-2 py-0.5 rounded-full font-medium">
              {{ Math.round((1 - product.sale_price / product.price) * 100) }}% OFF
            </span>
          </div>

          <!-- SKU -->
          <p class="text-xs text-gray-400">SKU: {{ product.sku || 'N/A' }}</p>

          <!-- Stock -->
          <p class="text-sm font-medium" :class="product.stock > 0 ? 'text-green-600' : 'text-red-500'">
            {{ product.stock > 0 ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock' }}
          </p>

          <!-- Quantity Selector -->
          <div v-if="product.stock > 0" class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700">Quantity:</label>
            <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button @click="qty > 1 && qty--"
                class="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold">
                −
              </button>
              <span class="px-5 py-2 text-sm font-semibold border-x border-gray-300">{{ qty }}</span>
              <button @click="qty < product.stock && qty++"
                class="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold">
                +
              </button>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button @click="handleAddToCart" :disabled="product.stock === 0 || adding"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50">
              {{ adding ? 'Adding...' : '🛒 Add to Cart' }}
            </button>
            <NuxtLink to="/cart"
              class="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium text-sm flex items-center">
              View Cart
            </NuxtLink>
          </div>

          <!-- Success Message -->
          <div v-if="successMsg"
            class="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 text-sm">
            {{ successMsg }}
          </div>

          <!-- Features -->
          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>🚚</span> Free shipping above ₹500
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>↩️</span> 7 day easy returns
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>🔒</span> Secure checkout
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>💬</span> 24/7 support
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../utils/api'
import { formatCurrency } from '../../utils/helpers'

const route      = useRoute()
const router     = useRouter()
const cartStore  = useCartStore()
const authStore  = useAuthStore()
const product    = ref(null)
const loading    = ref(true)
const qty        = ref(1)
const adding     = ref(false)
const successMsg = ref('')

onMounted(async () => {
  try {
    const res = await api.get(`/products/${route.params.id}`)
    product.value = res.data.data
  } finally {
    loading.value = false
  }
})

const handleAddToCart = async () => {
  if (!authStore.isLoggedIn) { router.push('/auth/login'); return }
  adding.value = true
  try {
    await cartStore.addToCart(product.value.id, qty.value)
    successMsg.value = '✅ Added to cart successfully!'
    setTimeout(() => successMsg.value = '', 3000)
  } finally {
    adding.value = false
  }
}
</script>