<template>
  <div class="p-5">
    <!-- Título de la sección -->
    <h1 class="text-2xl font-bold mb-4">📦 Solicitudes de Insumos</h1>

    <!-- Formulario para crear una nueva solicitud -->
    <div class="bg-white p-5 shadow rounded-lg mb-6">
      <h2 class="text-lg font-semibold mb-3">📝 Nueva Solicitud</h2>
      <form @submit.prevent="crearSolicitud">
        <!-- Selector de insumo -->
        <div class="mb-3">
          <label class="block font-medium">Insumo:</label>
          <select v-model="solicitud.insumo" class="w-full border p-2 rounded">
            <option v-for="insumo in insumos" :key="insumo.id" :value="insumo.id">
              {{ insumo.nombre }}
            </option>
          </select>
        </div>

        <!-- Campo de cantidad -->
        <div class="mb-3">
          <label class="block font-medium">Cantidad:</label>
          <input v-model="solicitud.cantidad" type="number" min="1" class="w-full border p-2 rounded" />
        </div>

        <!-- Botón para enviar la solicitud -->
        <button class="bg-blue-500 text-white px-4 py-2 rounded">Solicitar</button>
      </form>
    </div>

    <!-- Tabla de historial de solicitudes -->
    <div class="bg-white p-5 shadow rounded-lg">
      <h2 class="text-lg font-semibold mb-3">📋 Historial de Solicitudes</h2>
      <table class="w-full border-collapse border">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2">ID</th>
            <th class="border p-2">Insumo</th>
            <th class="border p-2">Cantidad</th>
            <th class="border p-2">Estado</th>
            <th class="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sol in solicitudes" :key="sol.id">
            <td class="border p-2">{{ sol.id }}</td>
            <td class="border p-2">{{ sol.insumo }}</td>
            <td class="border p-2">{{ sol.cantidad }}</td>
            <td class="border p-2">{{ sol.estado }}</td>
            <td class="border p-2">
              <!-- Botones de acción disponibles solo para administrativos -->
              <button v-if="esAdministrativo" @click="actualizarEstado(sol.id, 'Aprobado')" class="bg-green-500 text-white px-2 py-1 rounded">✔</button>
              <button v-if="esAdministrativo" @click="actualizarEstado(sol.id, 'Rechazado')" class="bg-red-500 text-white px-2 py-1 rounded">✖</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

export default {
  setup() {
    // Datos reactivos
    const solicitudes = ref([]);       // Lista de solicitudes existentes
    const insumos = ref([]);           // Lista de insumos disponibles
    const solicitud = ref({            // Nueva solicitud
      insumo: '',
      cantidad: 1
    });

    // Determina si el usuario actual es administrativo
    const usuarioRol = localStorage.getItem('rol');
    const esAdministrativo = computed(() =>
      usuarioRol === 'Administrador' || usuarioRol.includes('Administrativo')
    );

    // Carga solicitudes e insumos desde el backend
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        const resSolicitudes = await axios.get('http://localhost:5000/solicitudes', {
          headers: { Authorization: token }
        });
        solicitudes.value = resSolicitudes.data;

        const resInsumos = await axios.get('http://localhost:5000/insumos', {
          headers: { Authorization: token }
        });
        insumos.value = resInsumos.data;
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    // Envía una nueva solicitud al backend
    const crearSolicitud = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/solicitudes', solicitud.value, {
          headers: { Authorization: token }
        });
        cargarDatos(); // recargar la tabla después de enviar
      } catch (error) {
        console.error('Error al crear solicitud:', error);
      }
    };

    // Cambia el estado de una solicitud (solo administrativos)
    const actualizarEstado = async (id, estado) => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/solicitudes/${id}`, { estado }, {
          headers: { Authorization: token }
        });
        cargarDatos(); // recargar lista
      } catch (error) {
        console.error('Error al actualizar solicitud:', error);
      }
    };

    // Cargar datos al montar el componente
    onMounted(cargarDatos);

    return {
      solicitudes,
      insumos,
      solicitud,
      crearSolicitud,
      actualizarEstado,
      esAdministrativo
    };
  }
};
</script>
