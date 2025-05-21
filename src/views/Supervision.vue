<template>
  <div class="min-h-screen bg-gradient-to-br from-white to-sky-50 px-4 py-6 sm:px-8">
    <!-- Encabezado -->
    <header class="relative border-b border-gray-300 pb-5 mb-8 text-center">
      <p class="text-sm text-gray-500 uppercase">Gobierno de México</p>
      <h1 class="text-2xl font-bold text-gray-700">Hospital Municipal de Chiconcuac</h1>
      <button
        @click="logout"
        class="absolute right-4 top-4 flex items-center gap-1 text-gray-600 hover:text-red-600 transition text-sm"
      >
        <span class="material-icons">logout</span>
        <span>Cerrar sesión</span>
      </button>
    </header>

    <!-- Título del módulo -->
    <h2 class="text-xl sm:text-2xl font-semibold text-center text-blue-800 mb-8">SUPERVISIÓN MÉDICA</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
      <!-- Solicitudes -->
      <div class="flex items-start gap-4 bg-white p-4 rounded-xl shadow-md">
        <div class="bg-yellow-200 w-12 h-12 flex items-center justify-center rounded-full">
          <span class="material-icons text-yellow-700">assignment</span>
        </div>
        <div>
          <h4 class="text-lg font-bold text-gray-800">Solicitudes</h4>
          <p class="text-sm text-gray-600 mb-2">Atiende las solicitudes de insumos.</p>
          <button
            @click="router.push('/supervision/solicitudes')"
            class="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 text-sm rounded-md shadow"
          >
            INGRESAR
          </button>
        </div>
      </div>

      <!-- Opciones del módulo -->
      <div class="flex flex-col gap-8">
        <!-- Stock -->
        <div class="flex items-start gap-4 bg-white p-4 rounded-xl shadow-md">
          <div class="bg-green-200 w-12 h-12 flex items-center justify-center rounded-full">
            <span class="material-icons text-green-700">star</span>
          </div>
          <div>
            <h4 class="text-lg font-bold text-gray-800">Stock</h4>
            <p class="text-sm text-gray-600 mb-2">Agregar, consultar, actualizar, eliminar insumos.</p>
            <button
              @click="router.push('/supervision/stock')"
              class="bg-green-400 hover:bg-green-500 px-4 py-2 text-sm rounded-md shadow"
            >
              INGRESAR
            </button>
          </div>
        </div>

        <!-- Reportes -->
        <div class="flex items-start gap-4 bg-white p-4 rounded-xl shadow-md">
          <div class="bg-blue-200 w-12 h-12 flex items-center justify-center rounded-full">
            <span class="material-icons text-blue-700">description</span>
          </div>
          <div>
            <h4 class="text-lg font-bold text-gray-800">Reportes</h4>
            <p class="text-sm text-gray-600 mb-2">Consultar reportes registrados por el personal.</p>
            <button
              @click="router.push('/supervision/reportes')"
              class="bg-blue-400 hover:bg-blue-500 px-4 py-2 text-sm rounded-md shadow"
            >
              INGRESAR
            </button>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="flex items-start gap-4 bg-white p-4 rounded-xl shadow-md">
          <div class="bg-purple-200 w-12 h-12 flex items-center justify-center rounded-full">
            <span class="material-icons text-purple-700">insert_chart</span>
          </div>
          <div>
            <h4 class="text-lg font-bold text-gray-800">Estadísticas</h4>
            <p class="text-sm text-gray-600 mb-2">Visualiza gráficas por semana y mes.</p>
            <button
              @click="router.push('/supervision/estadisticas')"
              class="bg-purple-400 hover:bg-purple-500 px-4 py-2 text-sm rounded-md shadow"
            >
              INGRESAR
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

const store = useStore();
const router = useRouter();
const solicitudes = ref([]);

const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  store.commit('setAuth', { token: null, role: null });
  router.push('/');
};

const obtenerSolicitudes = async () => {
  try {
    const response = await axios.get('http://localhost:5000/supervision/solicitudes', {
      headers: {
        Authorization: store.state.token
      }
    });
    solicitudes.value = response.data;
  } catch (error) {
    console.error('Error al cargar solicitudes:', error);
  }
};

onMounted(() => {
  obtenerSolicitudes();
});
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
