<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <LayoutNavbar />
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>