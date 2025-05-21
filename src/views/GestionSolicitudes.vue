<template>
  <div class="p-5">
    <!-- Título de la vista -->
    <h1 class="text-2xl font-bold mb-4">Gestión de Solicitudes de Insumos</h1>

    <!-- Tabla de solicitudes -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <!-- Encabezados de columna -->
          <th class="border border-gray-300 p-2">ID</th>
          <th class="border border-gray-300 p-2">Usuario</th>
          <th class="border border-gray-300 p-2">Insumo</th>
          <th class="border border-gray-300 p-2">Cantidad</th>
          <th class="border border-gray-300 p-2">Motivo</th>
          <th class="border border-gray-300 p-2">Estado</th>
          <th class="border border-gray-300 p-2">Acción</th>
        </tr>
      </thead>

      <tbody>
        <!-- Itera sobre cada solicitud y muestra su información -->
        <tr v-for="solicitud in solicitudes" :key="solicitud.id">
          <td class="border border-gray-300 p-2">{{ solicitud.id }}</td>
          <td class="border border-gray-300 p-2">{{ solicitud.usuario }}</td>
          <td class="border border-gray-300 p-2">{{ solicitud.insumo }}</td>
          <td class="border border-gray-300 p-2">{{ solicitud.cantidad }}</td>
          <td class="border border-gray-300 p-2">{{ solicitud.motivo }}</td>
          <td class="border border-gray-300 p-2">{{ solicitud.estado }}</td>

          <!-- Desplegable para actualizar el estado de la solicitud -->
          <td class="border border-gray-300 p-2">
            <select v-model="solicitud.estado" @change="actualizarEstado(solicitud)" class="p-1 border rounded">
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      solicitudes: [] // Arreglo que almacena todas las solicitudes recuperadas del servidor
    };
  },

  // Se ejecuta automáticamente al cargar el componente
  async created() {
    await this.obtenerSolicitudes(); // Llama al método para cargar datos
  },

  methods: {
    // Método para obtener todas las solicitudes desde el backend
    async obtenerSolicitudes() {
      try {
        const token = localStorage.getItem('token'); // Se obtiene el token JWT desde el almacenamiento local
        const response = await axios.get('http://localhost:5000/solicitudes-insumos', {
          headers: { Authorization: token } // Se envía el token en los headers para autenticar
        });
        this.solicitudes = response.data; // Se guarda la respuesta en el array de solicitudes
      } catch (error) {
        console.error('Error al obtener solicitudes:', error); // Error en la carga de datos
      }
    },

    // Método para actualizar el estado de una solicitud
    async actualizarEstado(solicitud) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/solicitudes-insumos/${solicitud.id}`, 
          { estado: solicitud.estado }, 
          { headers: { Authorization: token } }
        );
        alert('Estado actualizado'); // Muestra notificación al usuario
      } catch (error) {
        console.error('Error al actualizar estado:', error); // Error en la actualización
      }
    }
  }
};
</script>
