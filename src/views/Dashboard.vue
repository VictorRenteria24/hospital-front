<template>
  <!-- Fondo con gradiente suave -->
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 text-gray-800">

    <!-- Encabezado institucional -->
    <header class="flex flex-col items-center text-center py-6 border-b border-gray-300 px-4 relative">
      <p class="text-sm text-gray-500 uppercase tracking-wider">Gobierno de México</p>
      <h1 class="text-2xl sm:text-3xl font-bold mt-1">Hospital Municipal de Chiconcuac</h1>

      <!-- Botón para cerrar sesión (ubicado en la esquina superior derecha) -->
      <button
        @click="logout"
        class="absolute right-4 top-4 flex items-center gap-1 text-sm text-gray-700 hover:text-red-600 transition"
      >
        <span class="material-icons">logout</span>
        <span>Cerrar sesión</span>
      </button>
    </header>

    <!-- Contenedor de accesos a módulos -->
    <div class="flex flex-col sm:flex-row justify-center items-center gap-12 py-20 px-6">

      <!-- Módulo: Supervisión Médica -->
      <div class="text-center">
        <!-- Círculo decorativo con texto -->
        <div class="w-44 h-44 sm:w-52 sm:h-52 bg-white border-4 border-green-300 rounded-full flex items-center justify-center mx-auto shadow-md mb-4">
          <p class="text-green-700 font-bold text-center px-4">SUPERVISIÓN MÉDICA</p>
        </div>
        <!-- Botón de acceso -->
        <button
          @click="router.push('/supervision')"
          class="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md transition shadow"
        >
          INGRESAR
        </button>
      </div>

      <!-- Módulo: Medicina Preventiva -->
      <div class="text-center">
        <!-- Círculo decorativo con texto -->
        <div class="w-44 h-44 sm:w-52 sm:h-52 bg-white border-4 border-yellow-300 rounded-full flex items-center justify-center mx-auto shadow-md mb-4">
          <p class="text-yellow-700 font-bold text-center px-4">MEDICINA PREVENTIVA</p>
        </div>
        <!-- Botón de acceso -->
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
// Importa acceso al store y al router
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

// Función para cerrar sesión: limpia storage y redirige a login
const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  store.commit('setAuth', { token: null, role: null }); // ← Si usas Pinia, esto sería diferente
  router.push('/');
};
</script>

<style>
/* Importa íconos de Google Material Icons para usar el ícono de logout */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>

