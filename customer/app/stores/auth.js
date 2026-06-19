import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isLoggedIn = computed(() => !!token.value)

  const init = () => {
    if (import.meta.client) {
      token.value = localStorage.getItem('customerToken')
      const u = localStorage.getItem('customerUser')
      user.value = u ? JSON.parse(u) : null
    }
  }

  const register = async (name, email, password, phone) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/auth/register', { name, email, password, phone })
      token.value = res.data.token
      user.value  = res.data.user
      localStorage.setItem('customerToken', res.data.token)
      localStorage.setItem('customerUser', JSON.stringify(res.data.user))
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/auth/login', { email, password })
      token.value = res.data.token
      user.value  = res.data.user
      localStorage.setItem('customerToken', res.data.token)
      localStorage.setItem('customerUser', JSON.stringify(res.data.user))
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value  = null
    localStorage.removeItem('customerToken')
    localStorage.removeItem('customerUser')
    navigateTo('/auth/login')
  }

  return { user, token, loading, error, isLoggedIn, init, register, login, logout }
})