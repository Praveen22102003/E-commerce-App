<template>
  <div class="min-h-screen flex items-center justify-center -mt-8">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">👋</div>
        <h2 class="text-2xl font-bold text-gray-800">Create Account</h2>
        <p class="text-gray-500 text-sm mt-1">Join ShopNow today — it's free!</p>
      </div>
      <div v-if="authStore.error"
        class="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm">
        {{ authStore.error }}
      </div>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input v-model="name" type="text" placeholder="John Doe" required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" placeholder="your@email.com" required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input v-model="phone" type="tel" placeholder="9876543210"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" placeholder="Min 6 characters" required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <button type="submit" :disabled="authStore.loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50">
          {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
      <p class="text-center text-sm text-gray-500 mt-6">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-blue-600 font-medium hover:underline">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router    = useRouter()
const name      = ref('')
const email     = ref('')
const phone     = ref('')
const password  = ref('')

const handleRegister = async () => {
  try {
    await authStore.register(name.value, email.value, password.value, phone.value)
    router.push('/')
  } catch {}
}
</script>