<template>
  <!-- Contenedor principal -->
  <div class="p-5">
    <h1 class="text-2xl font-bold mb-4">📌 Solicitudes Pendientes</h1>

    <!-- Tabla de solicitudes -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">#</th>
          <th class="border p-2">Insumo</th>
          <th class="border p-2">Cantidad</th>
          <th class="border p-2">Diagnóstico</th>
          <th class="border p-2">Justificación</th>
          <th class="border p-2">Estado</th>
          <th class="border p-2">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <!-- Renderiza cada solicitud -->
        <tr v-for="(sol, index) in solicitudes" :key="sol.id_solicitud">
          <td class="border p-2">{{ index + 1 }}</td>
          <td class="border p-2">{{ sol.insumo }}</td>
          <td class="border p-2">{{ sol.cantidad_solicitada }}</td>
          <td class="border p-2">{{ sol.diagnostico }}</td>
          <td class="border p-2">{{ sol.justificacion || '-' }}</td>
          <td class="border p-2">{{ sol.estatus }}</td>

          <!-- Botones para cambiar estado -->
          <td class="border p-2 space-x-1">
            <button 
              @click="actualizarEstado(sol.id_solicitud, 'pendiente')" 
              class="bg-blue-500 text-white px-2 py-1 rounded">
              Pendiente
            </button>
            <button 
              @click="actualizarEstado(sol.id_solicitud, 'aprobada')" 
              class="bg-green-500 text-white px-2 py-1 rounded">
              Aprobar
            </button>
            <button 
              @click="justificar(sol.id_solicitud)" 
              class="bg-red-500 text-white px-2 py-1 rounded">
              Rechazar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Almacena la lista de solicitudes
const solicitudes = ref([]);

// Obtener solicitudes desde el backend
const obtenerSolicitudes = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/solicitudes/pendientes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    solicitudes.value = res.data;
  } catch (err) {
    console.error('Error al obtener solicitudes:', err);
  }
};

// Cambiar el estado de una solicitud
const actualizarEstado = async (id, nuevoEstado) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/solicitudes/${id}/estado`, {
      estatus: nuevoEstado
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert(`✅ Solicitud marcada como ${nuevoEstado}`);
    obtenerSolicitudes(); // recargar lista
  } catch (err) {
    console.error('Error al actualizar estado:', err);
  }
};

// Rechazar solicitud con justificación
const justificar = async (id) => {
  const texto = prompt("🔍 Ingresa la justificación para esta solicitud:");
  if (!texto) return;

  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/solicitudes/${id}/justificar`, {
      justificacion: texto,
      estatus: 'rechazada'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('❌ Solicitud rechazada');
    obtenerSolicitudes(); // recargar lista
  } catch (err) {
    console.error('Error al justificar:', err);
  }
};

// Cargar solicitudes al iniciar componente
onMounted(obtenerSolicitudes);
</script>

<style scoped>
/* No hay estilos definidos aquí, pero puedes personalizar la tabla si lo deseas */
</style>
  