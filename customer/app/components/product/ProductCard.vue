<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
    <NuxtLink :to="`/products/${product.id}`">
      <div class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img v-if="product.image" :src="product.image" :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span v-else class="text-5xl">📦</span>
      </div>
    </NuxtLink>
    <div class="p-4">
      <p class="text-xs text-blue-600 font-medium mb-1">{{ product.category_name }}</p>
      <NuxtLink :to="`/products/${product.id}`">
        <h3 class="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {{ product.name }}
        </h3>
      </NuxtLink>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-base font-bold text-gray-800">
          {{ formatCurrency(product.sale_price || product.price) }}
        </span>
        <span v-if="product.sale_price" class="text-xs text-gray-400 line-through">
          {{ formatCurrency(product.price) }}
        </span>
        <span v-if="product.sale_price"
          class="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
          {{ Math.round((1 - product.sale_price / product.price) * 100) }}% OFF
        </span>
      </div>
      <p class="text-xs mb-3" :class="product.stock > 0 ? 'text-green-600' : 'text-red-500'">
        {{ product.stock > 0 ? `✅ In Stock (${product.stock})` : '❌ Out of Stock' }}
      </p>
      <button
        @click="handleAddToCart"
        :disabled="product.stock === 0 || adding"
        class="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
               hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ adding ? 'Adding...' : '🛒 Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency } from '../../utils/helpers'

const props     = defineProps({ product: Object })
const cartStore = useCartStore()
const authStore = useAuthStore()
const router    = useRouter()
const adding    = ref(false)

const handleAddToCart = async () => {
  if (!authStore.isLoggedIn) { router.push('/auth/login'); return }
  adding.value = true
  try {
    await cartStore.addToCart(props.product.id)
  } catch {}
  finally { adding.value = false }
}
</script>