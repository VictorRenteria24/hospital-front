<template>
  <div class="p-6">
    <!-- Título principal -->
    <h2 class="text-2xl font-bold mb-6 text-center">📊 ESTADÍSTICAS DE SOLICITUDES</h2>

    <!-- Filtros: semanal, mensual, anual -->
    <div class="grid md:grid-cols-3 gap-6 mb-10">
      <!-- Filtro semanal -->
      <div class="border p-4 rounded shadow bg-white">
        <h3 class="text-lg font-semibold mb-2">Por semana</h3>
        <input type="date" v-model="filtroSemana" class="border px-2 py-1 w-full mb-2" />
        <button @click="cargarEstadisticas('semanal')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
          Mostrar semanal
        </button>
      </div>

      <!-- Filtro mensual -->
      <div class="border p-4 rounded shadow bg-white">
        <h3 class="text-lg font-semibold mb-2">Por mes</h3>
        <select v-model="filtroMes" class="border px-2 py-1 w-full mb-2">
          <option disabled value="">-- Selecciona mes --</option>
          <option v-for="(m, i) in 12" :key="i" :value="i + 1">{{ i + 1 }}</option>
        </select>
        <input type="number" v-model="filtroAnioMes" placeholder="Año" class="border px-2 py-1 w-full mb-2" />
        <button @click="cargarEstadisticas('mensual')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
          Mostrar mensual
        </button>
      </div>

      <!-- Filtro anual -->
      <div class="border p-4 rounded shadow bg-white">
        <h3 class="text-lg font-semibold mb-2">Por año</h3>
        <input type="number" v-model="filtroAnual" placeholder="Año" class="border px-2 py-1 w-full mb-2" />
        <button @click="cargarEstadisticas('anual')" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded w-full">
          Mostrar anual
        </button>
      </div>
    </div>

    <!-- Gráfico estadístico -->
    <div class="border p-4 rounded shadow bg-white mb-8">
      <h3 class="text-lg font-semibold mb-2">Gráfico de {{ periodoActivo }}</h3>
      <canvas ref="grafica"></canvas>
      <div class="mt-4 flex gap-4">
        <button @click="exportarExcel" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          Descargar Excel
        </button>
      </div>
    </div>

    <!-- Tabla de insumos no surtidos -->
    <div class="border p-4 rounded shadow bg-white">
      <h3 class="text-lg font-semibold mb-4">📌 Insumos solicitados pero no surtidos</h3>
      <table class="w-full border text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-2 py-1 text-left">#</th>
            <th class="px-2 py-1 text-left">Insumo</th>
            <th class="px-2 py-1 text-left">Cantidad solicitada</th>
          </tr>
        </thead>
        <tbody>
          <!-- Muestra cada insumo no surtido -->
          <tr v-for="(item, idx) in noSurtidos" :key="item.insumo">
            <td class="px-2 py-1">{{ idx + 1 }}</td>
            <td class="px-2 py-1">{{ item.insumo }}</td>
            <td class="px-2 py-1">{{ item.solicitado }}</td>
          </tr>
          <!-- Mensaje si no hay registros -->
          <tr v-if="noSurtidos.length === 0">
            <td colspan="3" class="text-center py-2 text-gray-500">No hay insumos pendientes en este periodo</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'
import * as XLSX from 'xlsx'

// Referencia al canvas de la gráfica
const grafica = ref(null)
let chartInstance = null

// Filtros y datos
const periodoActivo = ref('')
const filtroSemana = ref('')
const filtroMes = ref('')
const filtroAnioMes = ref(new Date().getFullYear())
const filtroAnual = ref(new Date().getFullYear())
const datos = ref([])
const noSurtidos = ref([])

// Llama a la API para obtener estadísticas y datos no surtidos
const cargarEstadisticas = async (tipo) => {
  try {
    let url = `http://${window.location.hostname}:5000/supervision/solicitudes/estadisticas/${tipo}`
    let noSurtidoUrl = `http://${window.location.hostname}:5000/supervision/solicitudes/estadisticas/no-surtidos/${tipo}`

    let params = {}
    if (tipo === 'semanal') {
      if (!filtroSemana.value) return alert('Selecciona una fecha para la semana')
      params.fecha = filtroSemana.value
    } else if (tipo === 'mensual') {
      if (!filtroMes.value || !filtroAnioMes.value) return alert('Completa mes y año')
      params.mes = filtroMes.value
      params.anio = filtroAnioMes.value
    } else if (tipo === 'anual') {
      if (!filtroAnual.value) return alert('Completa el año')
      params.anio = filtroAnual.value
    }

    const res = await axios.get(url, { params })
    const resNo = await axios.get(noSurtidoUrl, { params })

    datos.value = res.data.datos
    noSurtidos.value = resNo.data.insumos_no_surtidos
    periodoActivo.value = tipo.charAt(0).toUpperCase() + tipo.slice(1)

    renderChart()
  } catch (err) {
    console.error('❌ Error al cargar estadísticas:', err)
    alert('Ocurrió un error al obtener las estadísticas')
  }
}

// Genera la gráfica con Chart.js
const renderChart = () => {
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(grafica.value, {
    type: 'bar',
    data: {
      labels: datos.value.map(d => d.insumo),
      datasets: [
        {
          label: 'Solicitadas',
          data: datos.value.map(d => d.solicitado),
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Surtidas',
          data: datos.value.map(d => d.surtido),
          backgroundColor: '#22c55e'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            // Agrega porcentaje a los tooltips
            label: function (context) {
              const solicitado = datos.value[context.dataIndex].solicitado
              const surtido = datos.value[context.dataIndex].surtido
              const porcentaje = solicitado === 0 ? 0 : ((surtido / solicitado) * 100).toFixed(1)
              return `${context.dataset.label}: ${context.raw} (${porcentaje}%)`
            }
          }
        }
      }
    }
  })
}

// Exporta los datos mostrados a un archivo Excel
const exportarExcel = () => {
  const hoja = datos.value.map(d => ({
    Insumo: d.insumo,
    Solicitado: d.solicitado,
    Surtido: d.surtido,
    Porcentaje: d.solicitado === 0 ? '0%' : ((d.surtido / d.solicitado) * 100).toFixed(1) + '%'
  }))

  const ws = XLSX.utils.json_to_sheet(hoja)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, periodoActivo.value)
  XLSX.writeFile(wb, `estadisticas_${periodoActivo.value}.xlsx`)
}
</script>

<style scoped>
canvas {
  max-height: 350px;
}
</style>
