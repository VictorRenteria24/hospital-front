<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Supervisión Médica</h1>
    <p class="mt-2 text-gray-600">Aquí se gestionan las supervisiones médicas y solicitudes de insumos.</p>
    
    <!-- Contenido del módulo -->
    <div v-if="!detalleVisible" class="mt-6 p-4 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold">Listado de supervisiones</h2>
      
      <!-- Tabla de supervisiones -->
      <table class="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2">ID</th>
            <th class="border border-gray-300 px-4 py-2">Paciente</th>
            <th class="border border-gray-300 px-4 py-2">Fecha</th>
            <th class="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supervision in supervisiones" :key="supervision.id" class="text-center">
            <td class="border border-gray-300 px-4 py-2">{{ supervision.id }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ supervision.paciente }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ supervision.fecha }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <button class="bg-blue-500 text-white px-3 py-1 rounded" @click="verDetalle(supervision)">Ver</button>
              <button class="bg-yellow-500 text-white px-3 py-1 rounded ml-2" @click="editarSupervision(supervision)">Editar</button>
              <button class="bg-red-500 text-white px-3 py-1 rounded ml-2" @click="confirmarEliminacion(supervision.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Gráficos históricos de insumos -->
    <div class="mt-6 p-4 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold">Historial de Insumos Solicitados</h2>
      <canvas id="graficoInsumos"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "SupervisionMedica",
  data() {
    return {
      supervisiones: [
        { id: 1, paciente: "Juan Pérez", fecha: "2025-03-21", notas: "Seguimiento por hipertensión." },
        { id: 2, paciente: "Ana Gómez", fecha: "2025-03-22", notas: "Control de diabetes." }
      ],
      solicitudesInsumos: [],
      detalleVisible: false,
      detalleSupervision: {},
      edicionVisible: false,
      edicionSupervision: {},
      chartInstance: null
    };
  },
  methods: {
    verDetalle(supervision) {
      this.detalleSupervision = supervision;
      this.detalleVisible = true;
      this.edicionVisible = false;
    },
    cerrarDetalle() {
      this.detalleVisible = false;
      this.detalleSupervision = {};
    },
    editarSupervision(supervision) {
      this.edicionSupervision = { ...supervision };
      this.edicionVisible = true;
      this.detalleVisible = false;
    },
    guardarEdicion() {
      const index = this.supervisiones.findIndex(s => s.id === this.edicionSupervision.id);
      if (index !== -1) {
        this.supervisiones[index] = { ...this.edicionSupervision };
      }
      this.edicionVisible = false;
    },
    cancelarEdicion() {
      this.edicionVisible = false;
      this.edicionSupervision = {};
    },
    confirmarEliminacion(id) {
      if (confirm("¿Estás seguro de que deseas eliminar esta supervisión?")) {
        this.eliminarSupervision(id);
      }
    },
    eliminarSupervision(id) {
      this.supervisiones = this.supervisiones.filter(s => s.id !== id);
    },
    cargarSolicitudesInsumos() {
      // Simulación de datos
      this.solicitudesInsumos = [
        { medicamento: "Paracetamol", cantidad: 30, fecha: "2025-03-01" },
        { medicamento: "Ibuprofeno", cantidad: 25, fecha: "2025-03-05" },
        { medicamento: "Omeprazol", cantidad: 15, fecha: "2025-03-10" }
      ];
      this.generarGrafico();
    },
    generarGrafico() {
      const ctx = document.getElementById("graficoInsumos").getContext("2d");
      const labels = this.solicitudesInsumos.map(item => item.medicamento);
      const data = this.solicitudesInsumos.map(item => item.cantidad);
      
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      
      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "Cantidad de Insumos Solicitados",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  },
  mounted() {
    this.cargarSolicitudesInsumos();
  }
};
</script>

<style scoped>
</style>
