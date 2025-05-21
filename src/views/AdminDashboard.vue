<template>
  <div class="p-6 bg-white min-h-screen">
    <!-- Botón cerrar sesión -->
    <div class="flex justify-end mb-4">
      <button @click="cerrarSesion" class="text-red-600 hover:text-red-800 font-semibold text-sm flex items-center gap-1">
        <span class="material-icons text-base">logout</span> Cerrar sesión
      </button>
    </div>

    <!-- Título -->
    <h2 class="text-2xl font-bold text-blue-700 text-center mb-6">Panel del Administrador del Hospital</h2>

    <!-- Tarjetas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <!-- Insumos Críticos -->
      <router-link
        to="/admin/insumos-criticos"
        class="block p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300 text-center"
      >
        <div class="text-4xl mb-2">🧪</div>
        <h3 class="text-lg font-semibold text-gray-800">Gestión de Insumos Críticos</h3>
        <p class="text-sm text-gray-600 mt-1">Registrar, editar y visualizar insumos sensibles</p>
      </router-link>

      <!-- Alertas -->
      <router-link
        to="/admin/alertas"
        class="block p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300 text-center relative"
      >
        <div class="text-4xl mb-2">🚨</div>
        <h3 class="text-lg font-semibold text-gray-800">Alertas de Insumos</h3>
        <p class="text-sm text-gray-600 mt-1">Consulta insumos por caducidad o bajo stock</p>

        <!-- Círculo de alerta -->
        <div v-if="mostrarAlerta" class="absolute top-2 right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
          !
        </div>
      </router-link>

      <!-- Sugerencias -->
      <router-link
        to="/admin/sugerencias"
        class="block p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300 text-center"
      >
        <div class="text-4xl mb-2">📦</div>
        <h3 class="text-lg font-semibold text-gray-800">Sugerencias de Compra</h3>
        <p class="text-sm text-gray-600 mt-1">Pronósticos y estadísticas mensuales de insumos</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const mostrarAlerta = ref(false);

// Verifica si hay alertas
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/insumos-criticos/alertas');
    if (res.data && res.data.length > 0) {
      mostrarAlerta.value = true;
    }
  } catch (error) {
    console.error('Error al verificar alertas:', error);
  }
});

// Función para cerrar sesión
const cerrarSesion = () => {
  localStorage.clear();
  sessionStorage.clear();
  router.push('/');
};
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
