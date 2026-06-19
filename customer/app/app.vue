<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
authStore.init()
</script>