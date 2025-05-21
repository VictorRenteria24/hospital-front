<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();

const alertas = ref([]);

// Cerrar sesión
const cerrarSesion = () => {
  localStorage.clear();
  sessionStorage.clear();
  router.push('/');
};

// Obtener insumos críticos en alerta
const obtenerAlertas = async () => {
  try {
    const res = await axios.get('http://localhost:5000/insumos-criticos/alertas');
    alertas.value = res.data;
  } catch (err) {
    toast.error('❌ Error al cargar alertas');
  }
};

// Agregar insumo a sugerencias
const agregarASugerencias = async (insumo) => {
  try {
    await axios.post('http://localhost:5000/sugerencias', insumo);
    toast.success(`🛒 ${insumo.nombre} agregado a sugerencias`);
  } catch (err) {
    toast.error('⚠️ No se pudo agregar a sugerencias');
  }
};

onMounted(() => {
  obtenerAlertas();
});
</script>

<template>
  <div class="min-h-screen px-6 py-6 bg-white">
    <!-- Botón cerrar sesión -->
    <div class="flex justify-end mb-4">
      <button @click="cerrarSesion" class="text-red-600 hover:text-red-800 font-semibold text-sm flex items-center gap-1">
        <span class="material-icons text-base">logout</span> Cerrar sesión
      </button>
    </div>

    <h2 class="text-2xl font-bold text-orange-700 mb-4">Alertas de Insumos</h2>
    <p class="text-sm text-gray-700 mb-6">Insumos próximos a caducar o con existencia baja serán mostrados aquí.</p>

    <div v-if="alertas.length" class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 text-sm">
        <thead class="bg-orange-100">
          <tr>
            <th class="px-4 py-2 border">ID</th>
            <th class="px-4 py-2 border">Nombre</th>
            <th class="px-4 py-2 border">Presentación</th>
            <th class="px-4 py-2 border">Cantidad</th>
            <th class="px-4 py-2 border">Vencimiento</th>
            <th class="px-4 py-2 border">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="insumo in alertas" :key="insumo.id_insumo_critico" class="text-center">
            <td class="px-2 py-1 border">{{ insumo.id_insumo_critico }}</td>
            <td class="px-2 py-1 border text-left">{{ insumo.nombre }}</td>
            <td class="px-2 py-1 border">{{ insumo.presentacion }}</td>
            <td class="px-2 py-1 border">{{ insumo.cantidad }}</td>
            <td class="px-2 py-1 border">{{ new Date(insumo.fecha_vencimiento).toLocaleDateString() }}</td>
            <td class="px-2 py-1 border">
              <button @click="agregarASugerencias(insumo)" class="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs">
                🛒 Agregar a lista
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-gray-600 mt-10 text-center">
      ✅ No hay alertas por el momento.
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
