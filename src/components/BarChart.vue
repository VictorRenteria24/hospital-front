<template>
  <!-- Renderiza una gráfica de barras con los datos proporcionados por la prop chartData -->
  <Bar :data="chartData" />
</template>

<script>
// Importa el componente de barra desde vue-chartjs
import { Bar } from 'vue-chartjs';

// Importa los módulos necesarios de Chart.js para construir la gráfica
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

// Registra los componentes de Chart.js que se usarán en esta instancia
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default {
  name: 'BarChart', // Nombre del componente

  // Define una prop obligatoria que recibe los datos para construir la gráfica
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },

  // Declara el componente hijo que será utilizado en el template
  components: {
    Bar
  }
};
</script>
