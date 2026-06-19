export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  imports: {
    dirs: ['stores']
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:5000/api'
    }
  }
})