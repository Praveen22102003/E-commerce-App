<template>
  <footer class="bg-slate-800 text-slate-400 mt-16">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="text-white text-lg font-bold mb-2">🛒 ShopNow</h3>
          <p class="text-sm">Your one-stop shop for everything you need.</p>
        </div>
        <div>
          <h4 class="text-white text-sm font-semibold mb-3">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/products" class="hover:text-white transition-colors">Products</NuxtLink></li>
            <li><NuxtLink to="/cart" class="hover:text-white transition-colors">Cart</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white text-sm font-semibold mb-3">Account</h4>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/auth/login" class="hover:text-white transition-colors">Login</NuxtLink></li>
            <li><NuxtLink to="/auth/register" class="hover:text-white transition-colors">Register</NuxtLink></li>
            <li><NuxtLink to="/orders" class="hover:text-white transition-colors">My Orders</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white text-sm font-semibold mb-3">Contact</h4>
          <p class="text-sm">support@shopnow.com</p>
          <p class="text-sm mt-1">+91 98765 43210</p>
          <p class="text-sm mt-1">Tiruppur, Tamil Nadu</p>
        </div>
      </div>
      <div class="border-t border-slate-700 pt-6 text-center text-sm">
        © 2024 ShopNow. All rights reserved.
      </div>
    </div>
  </footer>
</template>