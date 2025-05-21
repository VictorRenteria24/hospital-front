<template>
  <div class="p-6 bg-white min-h-screen">
    <!-- Botón de cerrar sesión -->
    <div class="flex justify-end mb-4">
      <button
        @click="logout"
        class="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
      >
        <span class="material-icons">logout</span> Cerrar sesión
      </button>
    </div>

    <h2 class="text-2xl font-bold text-green-700 mb-4">Sugerencias de Compra</h2>
    <p class="text-gray-600 mb-6">Lista de insumos críticos sugeridos para reabastecimiento.</p>

    <div v-if="sugerencias.length" class="overflow-x-auto mb-4">
      <table class="min-w-full text-sm border border-gray-300">
        <thead class="bg-green-100">
          <tr>
            <th class="px-4 py-2 border">ID</th>
            <th class="px-4 py-2 border">Nombre</th>
            <th class="px-4 py-2 border">Presentación</th>
            <th class="px-4 py-2 border">Cantidad</th>
            <th class="px-4 py-2 border">Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="insumo in sugerencias"
            :key="insumo.id_insumo_critico"
            class="text-center"
          >
            <td class="px-3 py-1 border">{{ insumo.id_insumo_critico }}</td>
            <td class="px-3 py-1 border text-left">{{ insumo.nombre }}</td>
            <td class="px-3 py-1 border">{{ insumo.presentacion }}</td>
            <td class="px-3 py-1 border">{{ insumo.cantidad }}</td>
            <td class="px-3 py-1 border">{{ new Date(insumo.fecha_vencimiento).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center text-gray-500 my-10">
      ✅ No hay sugerencias de compra por el momento.
    </div>

    <div v-if="sugerencias.length" class="text-right">
      <button
        @click="descargarYLimpiar"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
      >
        📥 Descargar lista y archivar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const sugerencias = ref([]);
const toast = useToast();
const store = useStore();
const router = useRouter();

const obtenerSugerencias = async () => {
  try {
    const res = await axios.get('http://localhost:5000/sugerencias');
    sugerencias.value = res.data;
  } catch (err) {
    toast.error('❌ Error al cargar sugerencias');
  }
};

const descargarYLimpiar = async () => {
  try {
    // Generar PDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Sugerencias de Compra', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Nombre', 'Presentación', 'Cantidad', 'Vencimiento']],
      body: sugerencias.value.map(i => [
        i.id_insumo_critico,
        i.nombre,
        i.presentacion,
        i.cantidad,
        new Date(i.fecha_vencimiento).toLocaleDateString()
      ])
    });

    doc.save('sugerencias_compra.pdf');

    // Limpiar y archivar
    await axios.post('http://localhost:5000/sugerencias/guardar-historico');
    toast.success('✅ Lista archivada y limpiada correctamente');
    sugerencias.value = [];
  } catch (err) {
    toast.error('⚠️ Error al archivar sugerencias');
    console.error(err);
  }
};

const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  store.commit('setAuth', { token: null, role: null });
  router.push('/');
};

onMounted(() => {
  obtenerSugerencias();
});
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
