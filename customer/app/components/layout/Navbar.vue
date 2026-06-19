<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
      <NuxtLink to="/" class="text-xl font-bold text-blue-600 whitespace-nowrap">
        🛒 ShopNow
      </NuxtLink>
      <div class="flex-1 flex gap-2">
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Search products..."
          class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
        <button @click="handleSearch"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
          Search
        </button>
      </div>
      <div class="flex items-center gap-4 text-sm font-medium">
        <NuxtLink to="/products" class="text-gray-600 hover:text-blue-600 transition-colors">
          Products
        </NuxtLink>
        <NuxtLink to="/cart" class="relative text-gray-600 hover:text-blue-600 transition-colors">
          🛒 Cart
          <span v-if="cartStore.itemCount > 0"
            class="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {{ cartStore.itemCount }}
          </span>
        </NuxtLink>
        <template v-if="authStore.isLoggedIn">
          <NuxtLink to="/orders" class="text-gray-600 hover:text-blue-600 transition-colors">
            My Orders
          </NuxtLink>
          <span class="text-gray-400 text-xs">{{ authStore.user?.name }}</span>
          <button @click="authStore.logout()"
            class="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs">
            Logout
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login"
            class="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Login
          </NuxtLink>
          <NuxtLink to="/auth/register"
            class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Register
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router      = useRouter()
const authStore   = useAuthStore()
const cartStore   = useCartStore()
const searchQuery = ref('')

if (import.meta.client && authStore.isLoggedIn) {
  cartStore.fetchCart()
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/products?search=${searchQuery.value}`)
  }
}
</script>