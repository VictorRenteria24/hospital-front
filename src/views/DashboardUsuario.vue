<template>
  <!-- Fondo con gradiente azul claro -->
  <div class="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-6">

    <!-- Encabezado institucional -->
    <header class="border-b border-gray-300 pb-5 mb-10 text-center relative">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Hospital Municipal de Chiconcuac</h1>
      <p class="text-sm text-gray-600">Gobierno de México</p>

      <!-- Botón para cerrar sesión -->
      <button
        @click="logout"
        class="absolute right-4 top-4 text-gray-700 hover:text-red-600 flex items-center gap-1 transition text-sm"
      >
        <span class="material-icons">logout</span>
        Cerrar sesión
      </button>
    </header>

    <!-- Opciones disponibles: insumos y reportes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-3xl mx-auto mt-10">

      <!-- Opción 1: Solicitar insumos -->
      <div class="flex flex-col items-center">
        <div class="rounded-full border-4 border-blue-300 bg-white shadow-md w-60 h-60 flex flex-col items-center justify-center">
          <img src="/icons/insumo.png" alt="Solicitar" class="w-12 h-12 mb-2" />
          <p class="text-center font-semibold text-gray-600">Solicitar<br />insumos</p>
        </div>
        <button
          @click="goTo('/solicitud-insumos')"
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow transition"
        >
          INGRESAR
        </button>
      </div>

      <!-- Opción 2: Reportar -->
      <div class="flex flex-col items-center">
        <div class="rounded-full border-4 border-yellow-300 bg-white shadow-md w-60 h-60 flex flex-col items-center justify-center">
          <img src="/icons/reporte.png" alt="Reportar" class="w-12 h-12 mb-2" />
          <p class="text-center font-semibold text-gray-600">Reportar</p>
        </div>
        <button
          @click="goTo('/crear-reporte')"
          class="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-md shadow transition"
        >
          INGRESAR
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
// Importa router para redirección y store para limpiar sesión
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

// Función para redirigir a una ruta
const goTo = (ruta) => router.push(ruta);

// Función para cerrar sesión
const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  store.commit('setAuth', { token: null, role: null }); // Asegura limpieza del estado
  router.push('/');
};
</script>

<style>
/* Importa Material Icons para usar el ícono de logout */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
