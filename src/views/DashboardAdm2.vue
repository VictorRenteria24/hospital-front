<template>
  <!-- Contenedor principal con fondo amarillo claro -->
  <div class="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 text-gray-800">

    <!-- Encabezado institucional -->
    <header class="flex flex-col items-center text-center py-6 border-b border-gray-300 px-4 relative">
      <p class="text-sm text-gray-500 uppercase tracking-wider">Gobierno de México</p>
      <h1 class="text-2xl sm:text-3xl font-bold mt-1">Hospital Municipal de Chiconcuac</h1>

      <!-- Botón para cerrar sesión, ubicado arriba a la derecha -->
      <button
        @click="logout"
        class="absolute right-4 top-4 flex items-center gap-1 text-sm text-gray-700 hover:text-red-600 transition"
      >
        <span class="material-icons">logout</span>
        <span>Cerrar sesión</span>
      </button>
    </header>

    <!-- Módulo único disponible: Medicina Preventiva -->
    <div class="flex flex-col items-center justify-center py-24 px-6">
      <div class="text-center">
        <!-- Círculo decorativo amarillo -->
        <div class="w-44 h-44 sm:w-52 sm:h-52 bg-white border-4 border-yellow-300 rounded-full flex items-center justify-center mx-auto shadow-md mb-4">
          <p class="text-yellow-700 font-bold text-center px-4">MEDICINA PREVENTIVA</p>
        </div>

        <!-- Botón para ingresar al módulo -->
        <button
          @click="router.push('/medicina-preventiva')"
          class="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-md transition shadow"
        >
          INGRESAR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Importa router para redirección
import { useRouter } from 'vue-router';

const router = useRouter();

// Función para cerrar sesión y redirigir al login
const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  router.push('/');
};
</script>

<style>
/* Importa los íconos de Google Material Icons */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
