<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">SUPERVISIÓN MÉDICA - REPORTES</h2>

    <!-- Filtros y Acciones -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      <label class="text-sm font-medium text-gray-700">
        Nombre:
        <input v-model="filtros.nombre" type="text" class="border border-gray-300 rounded px-3 py-1 w-full" />
      </label>
      <label class="text-sm font-medium text-gray-700">
        Cargo:
        <input v-model="filtros.cargo" type="text" class="border border-gray-300 rounded px-3 py-1 w-full" />
      </label>
      <label class="text-sm font-medium text-gray-700">
        Fecha de Reporte:
        <input v-model="filtros.fecha" type="date" class="border border-gray-300 rounded px-3 py-1 w-full" />
      </label>
      <label class="text-sm font-medium text-gray-700">
        Prioridad:
        <select v-model="filtros.prioridad" class="border border-gray-300 rounded px-3 py-1 w-full">
          <option value="">Todas</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </label>
      <div class="col-span-2 flex gap-4">
        <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm">Cerrar sesión</button>
      </div>
    </div>

    <div class="mb-4 flex gap-4">
  <button @click="mostrarAtendidos = false" :class="!mostrarAtendidos ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'" class="px-4 py-1 rounded">
    Pendientes
  </button>
  <button @click="mostrarAtendidos = true" :class="mostrarAtendidos ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'" class="px-4 py-1 rounded">
    Atendidos
  </button>
</div>

<div v-if="!mostrarAtendidos">
<!-- Tabla de reportes pendientes -->
<h3 class="text-lg font-semibold mb-2">Reportes Pendientes</h3>
<div class="overflow-x-auto">
  <table class="min-w-full border text-sm">
    <thead class="bg-gray-200">
      <tr>
        <th class="border px-2 py-1">ID</th>
        <th class="border px-2 py-1">Nombre</th>
        <th class="border px-2 py-1">Cargo</th>
        <th class="border px-2 py-1">Título</th>
        <th class="border px-2 py-1">Prioridad</th>
        <th class="border px-2 py-1">Descripción</th>
        <th class="border px-2 py-1">Fecha</th>
        <th class="border px-2 py-1">Acción</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="reporte in reportesPaginados"
        :key="reporte.id_reporte"
        :style="{ backgroundColor: colorPrioridad(reporte.prioridad) }"
      >
        <td class="border px-2 py-1">{{ reporte.id_reporte }}</td>
        <td class="border px-2 py-1">{{ reporte.nombre_reportante }}</td>
        <td class="border px-2 py-1">{{ reporte.cargo }}</td>
        <td class="border px-2 py-1">{{ reporte.tipo_reporte }}</td>
        <td class="border px-2 py-1 font-bold">{{ reporte.prioridad }}</td>
        <td class="border px-2 py-1">{{ reporte.descripcion }}</td>
        <td class="border px-2 py-1">{{ reporte.fecha.split('T')[0] }}</td>
        <td class="border px-2 py-1 text-center">
          <button @click="abrirModal(reporte)" class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">
            Detalles
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  <!-- Paginación de pendientes -->
  <div class="flex flex-col items-center mt-4 gap-2">
    <span class="font-semibold">Paginación de pendientes:</span>
    <div class="flex gap-4">
      <button :disabled="pagina === 1" @click="pagina--" class="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">
        Anterior
      </button>
      <span class="text-sm mt-1">Página {{ pagina }} de {{ Math.ceil(reportesFiltrados.length / limite) }}</span>
      <button :disabled="pagina === Math.ceil(reportesFiltrados.length / limite)" @click="pagina++" class="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">
        Siguiente
      </button>
    </div>
  </div>
</div>

<div v-if="mostrarAtendidos">
  <!-- Tabla de reportes atendidos -->
  <h3 class="text-lg font-semibold mt-10 mb-2">Histórico de Reportes Atendidos</h3>
  <div class="overflow-x-auto">
    <table class="min-w-full border text-sm">
      <thead class="bg-gray-300">
        <tr>
          <th class="border px-2 py-1">ID</th>
          <th class="border px-2 py-1">Nombre</th>
          <th class="border px-2 py-1">Cargo</th>
          <th class="border px-2 py-1">Título</th>
          <th class="border px-2 py-1">Prioridad</th>
          <th class="border px-2 py-1">Descripción</th>
          <th class="border px-2 py-1">Fecha Reporte</th>
<th class="border px-2 py-1">Fecha Atendido</th>
          <th class="border px-2 py-1">Firma</th>
          <th class="border px-2 py-1">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="reporte in historicoPaginado"
          :key="reporte.id_reporte"
        >
          <td class="border px-2 py-1">{{ reporte.id_reporte }}</td>
          <td class="border px-2 py-1">{{ reporte.nombre_reportante }}</td>
          <td class="border px-2 py-1">{{ reporte.cargo }}</td>
          <td class="border px-2 py-1">{{ reporte.tipo_reporte }}</td>
          <td class="border px-2 py-1">{{ reporte.prioridad }}</td>
          <td class="border px-2 py-1">{{ reporte.descripcion }}</td>
          <td class="border px-2 py-1">{{ reporte.fecha.split('T')[0] }}</td>
<td class="border px-2 py-1">{{ reporte.fecha_atendido?.split('T')[0] }}</td>
          <td class="border px-2 py-1 text-center">
            <button @click="abrirModal(reporte)" class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">
              Detalles
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Paginación del histórico -->
  <div class="flex flex-col items-center mt-4 gap-2">
    <span class="font-semibold">Paginación del histórico:</span>
    <div class="flex gap-4">
      <button :disabled="paginaHistorico === 1" @click="paginaHistorico--" class="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">
        Anterior
      </button>
      <span class="text-sm mt-1">Página {{ paginaHistorico }} de {{ totalPaginasHistorico }}</span>
      <button :disabled="paginaHistorico === totalPaginasHistorico" @click="paginaHistorico++" class="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">
        Siguiente
      </button>
    </div>
  </div>
</div>
    </div>


    <div v-if="modalActivo" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-2">Detalles del Reporte</h3>
        <p><strong>Nombre:</strong> {{ reporteSeleccionado.nombre_reportante }}</p>
        <p><strong>Cargo:</strong> {{ reporteSeleccionado.cargo }}</p>
        <p><strong>Título:</strong> {{ reporteSeleccionado.tipo_reporte }}</p>
        <p><strong>Prioridad:</strong> {{ reporteSeleccionado.prioridad }}</p>
        <p><strong>Descripción:</strong> {{ reporteSeleccionado.descripcion }}</p>
        <p><strong>Fecha:</strong> {{ reporteSeleccionado.fecha?.split('T')[0] }}</p>

        <div v-if="!reporteSeleccionado.atendido" class="mt-4 flex justify-between">
          <button @click="marcarAtendido(reporteSeleccionado.id_reporte)" class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded">Marcar como atendido</button>
          <button @click="modalActivo = false" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded">Cerrar</button>
        </div>
        <div v-else class="mt-4 flex justify-end">
          <button @click="modalActivo = false" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded">Cerrar</button>
        </div>
      </div>
    </div>
</template>

<script setup>
const mostrarAtendidos = ref(false);
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const reportes = ref([])
const historico = ref([])
const filtros = ref({ nombre: '', cargo: '', fecha: '', prioridad: '' })
const pagina = ref(1)
const paginaHistorico = ref(1)
const limite = 10
const modalActivo = ref(false)
const reporteSeleccionado = ref(null)

const API_URL = `http://${window.location.hostname}:5000/supervision/reportes`

const obtenerReportes = async () => {
  try {
    const res = await axios.get(API_URL)
    reportes.value = res.data.filter(r => !r.atendido)
    historico.value = res.data.filter(r => r.atendido)
  } catch (err) {
    console.error('Error al obtener reportes:', err)
  }
}

const reportesFiltrados = computed(() => {
  return reportes.value.filter(r => {
    return (
      (!filtros.value.nombre || r.nombre_reportante.toLowerCase().includes(filtros.value.nombre.toLowerCase())) &&
      (!filtros.value.cargo || r.cargo.toLowerCase().includes(filtros.value.cargo.toLowerCase())) &&
      (!filtros.value.fecha || r.fecha.startsWith(filtros.value.fecha)) &&
      (!filtros.value.prioridad || r.prioridad === filtros.value.prioridad)
    )
  })
})

// const totalPaginas = computed(() => Math.ceil(reportesFiltrados.value.length / limite))
const totalPaginasHistorico = computed(() => Math.ceil(historicoFiltrado.value.length / limite))

const reportesPaginados = computed(() => {
  const inicio = (pagina.value - 1) * limite
  return reportesFiltrados.value.slice(inicio, inicio + limite)
})

const historicoFiltrado = computed(() => {
  return historico.value.filter(r => {
    return (
      (!filtros.value.nombre || r.nombre_reportante.toLowerCase().includes(filtros.value.nombre.toLowerCase())) &&
      (!filtros.value.cargo || r.cargo.toLowerCase().includes(filtros.value.cargo.toLowerCase())) &&
      (!filtros.value.fecha || r.fecha.startsWith(filtros.value.fecha)) &&
      (!filtros.value.prioridad || r.prioridad === filtros.value.prioridad)
    )
  })
})

const historicoPaginado = computed(() => {
  const inicio = (paginaHistorico.value - 1) * limite
  return historicoFiltrado.value.slice(inicio, inicio + limite)
})

const abrirModal = (reporte) => {
  reporteSeleccionado.value = reporte
  modalActivo.value = true
}

const marcarAtendido = async (id) => {
  try {
    await axios.put(`${API_URL}/${id}/atendido`)
    modalActivo.value = false
    obtenerReportes()
  } catch (err) {
    console.error('Error al marcar como atendido:', err)
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}

const colorPrioridad = (nivel) => {
  if (nivel === 'Alta') return '#f87171'
  if (nivel === 'Media') return '#fde047'
  if (nivel === 'Baja') return '#86efac'
  return '#fff'
}

onMounted(() => {
  obtenerReportes()
    setInterval(obtenerReportes, 10000)
})
</script>
