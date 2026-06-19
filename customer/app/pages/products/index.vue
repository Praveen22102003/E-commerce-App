<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">All Products</h1>
      <span class="text-sm text-gray-500">{{ products.length }} products found</span>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl p-4 shadow-sm mb-6 flex gap-4 flex-wrap">
      <input v-model="search" @keyup.enter="fetchProducts"
        type="text" placeholder="Search products..."
        class="flex-1 min-w-48 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
      <select v-model="selectedCategory" @change="fetchProducts"
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <button @click="fetchProducts"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
        Search
      </button>
      <button @click="resetFilters"
        class="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
        Reset
      </button>
    </div>

    <!-- Products -->
    <div v-if="loading" class="text-center py-16 text-gray-400 text-lg">Loading products...</div>
    <div v-else-if="products.length === 0" class="text-center py-16">
      <div class="text-5xl mb-4">📦</div>
      <p class="text-gray-500">No products found</p>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../utils/api'

const route            = useRoute()
const products         = ref([])
const categories       = ref([])
const loading          = ref(true)
const search           = ref(route.query.search || '')
const selectedCategory = ref(route.query.category || '')

onMounted(async () => {
  const catRes = await api.get('/categories')
  categories.value = catRes.data.data
  await fetchProducts()
})

const fetchProducts = async () => {
  loading.value = true
  try {
    let url = '/products?'
    if (search.value) url += `search=${search.value}&`
    if (selectedCategory.value) url += `category=${selectedCategory.value}&`
    const res = await api.get(url)
    products.value = res.data.data
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  search.value = ''
  selectedCategory.value = ''
  fetchProducts()
}
</script>