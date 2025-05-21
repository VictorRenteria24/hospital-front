<template>
  <!-- Contenedor que ocupa toda la altura de la pantalla -->
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <!-- Renderiza la vista hija correspondiente al layout de autenticación (ej: Login.vue) -->
    <router-view />
  </div>
</template>
