<template>
  <div class="min-h-screen flex items-center justify-center -mt-8">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🛒</div>
        <h2 class="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p class="text-gray-500 text-sm mt-1">Sign in to your account</p>
      </div>
      <div v-if="authStore.error"
        class="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm">
        {{ authStore.error }}
      </div>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" placeholder="your@email.com" required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" placeholder="••••••••" required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <button type="submit" :disabled="authStore.loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50">
          {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      <p class="text-center text-sm text-gray-500 mt-6">
        Don't have an account?
        <NuxtLink to="/auth/register" class="text-blue-600 font-medium hover:underline">Register here</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router    = useRouter()
const email     = ref('')
const password  = ref('')

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch {}
}
</script>