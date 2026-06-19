<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-white mb-10">
      <div class="max-w-lg">
        <h1 class="text-4xl font-bold mb-3">Welcome to ShopNow 🛒</h1>
        <p class="text-blue-100 text-lg mb-6">
          Discover amazing products at unbeatable prices. Shop from thousands of items delivered to your door.
        </p>
        <div class="flex gap-3">
          <NuxtLink to="/products"
            class="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Shop Now →
          </NuxtLink>
          <NuxtLink to="/auth/register"
            class="border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
            Join Free
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <div v-for="feature in features" :key="feature.title"
        class="bg-white rounded-xl p-4 text-center shadow-sm">
        <div class="text-2xl mb-2">{{ feature.icon }}</div>
        <p class="text-sm font-semibold text-gray-800">{{ feature.title }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ feature.desc }}</p>
      </div>
    </div>

    <!-- Categories -->
    <div class="mb-10">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-gray-800">Shop by Category</h2>
        <NuxtLink to="/products" class="text-sm text-blue-600 hover:underline">View All →</NuxtLink>
      </div>
      <div v-if="loadingCats" class="text-center py-8 text-gray-400">Loading...</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink v-for="cat in categories" :key="cat.id"
          :to="`/products?category=${cat.id}`"
          class="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all hover:border-blue-500 border border-transparent group">
          <div class="text-3xl mb-2 group-hover:scale-110 transition-transform">📦</div>
          <p class="font-semibold text-gray-800 text-sm">{{ cat.name }}</p>
          <p class="text-xs text-gray-500 mt-1 line-clamp-1">{{ cat.description }}</p>
        </NuxtLink>
      </div>
    </div>

    <!-- Featured Products -->
    <div>
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-gray-800">Featured Products</h2>
        <NuxtLink to="/products" class="text-sm text-blue-600 hover:underline">View All →</NuxtLink>
      </div>
      <div v-if="loadingProds" class="text-center py-8 text-gray-400">Loading...</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/api'

const categories   = ref([])
const products     = ref([])
const loadingCats  = ref(true)
const loadingProds = ref(true)

const features = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹500' },
  { icon: '🔒', title: 'Secure Payment', desc: '100% safe checkout' },
  { icon: '↩️', title: 'Easy Returns', desc: '7 day return policy' },
  { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
]

onMounted(async () => {
  try {
    const [catRes, prodRes] = await Promise.all([
      api.get('/categories'),
      api.get('/products')
    ])
    categories.value = catRes.data.data
    products.value   = prodRes.data.data.slice(0, 8)
  } finally {
    loadingCats.value  = false
    loadingProds.value = false
  }
})
</script>