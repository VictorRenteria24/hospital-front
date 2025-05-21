<template>
  <div class="p-4 md:p-6 bg-white min-h-screen text-gray-800">
    <h2 class="text-2xl font-bold mb-6 text-center">SUPERVISIÓN MÉDICA - SOLICITUDES</h2>

    <!-- Filtros avanzados -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <!-- Filtros existentes -->
      <label class="text-sm font-medium text-gray-700">
        Fecha de solicitud:
        <input type="date" v-model="filtros.fecha" class="border border-gray-300 rounded px-3 py-1 w-full" />
      </label>
      <label class="text-sm font-medium text-gray-700">
        Fecha atendido:
        <input type="date" v-model="filtros.fecha_atendido" class="border border-gray-300 rounded px-3 py-1 w-full" />
      </label>
      <label class="text-sm font-medium text-gray-700">
        ID Solicitud:
        <input type="text" v-model="filtros.id_solicitud" class="border border-gray-300 rounded px-3 py-1 w-full" />
      </label>
      <label class="text-sm font-medium text-gray-700">
        Médico:
        <input type="text" v-model="filtros.nombre_solicitante" class="border border-gray-300 rounded px-3 py-1 w-full" />
      </label>
      <label class="text-sm font-medium text-gray-700">
        Tipo de Servicio:
        <select v-model="filtros.tipo" @change="filtrarServicios" class="border border-gray-300 rounded px-3 py-1 w-full">
          <option value="">Todos</option>
          <option value="Ambulatoria">Ambulatoria</option>
          <option value="Hospitalaria">Hospitalaria</option>
        </select>
      </label>
      <label class="text-sm font-medium text-gray-700">
        Servicio:
        <select v-model="filtros.servicio" class="border border-gray-300 rounded px-3 py-1 w-full">
          <option value="">Todos</option>
          <option v-for="serv in serviciosFiltrados" :key="serv.nombre" :value="serv.nombre">
            {{ serv.nombre }}
          </option>
        </select>
      </label>
    </div>

    <!-- Botón limpiar filtros -->
    <div class="text-right mb-4">
      <button @click="limpiarFiltros" class="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded text-sm">Limpiar filtros</button>
    </div>

    <!-- Filtro de estatus -->
    <div class="flex justify-center gap-4 mb-6">
      <button @click="cambiarEstatus('pendiente')" :class="filtroEstatus === 'pendiente' ? 'bg-blue-600 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Pendientes</button>

      <button @click="cambiarEstatus('aprobada')" :class="filtroEstatus === 'aprobada' ? 'bg-green-600 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded font-semibold hover:bg-green-700 transition">Ver Aprobadas</button>

      <button @click="cambiarEstatus('rechazada')" :class="filtroEstatus === 'rechazada' ? 'bg-red-600 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded font-semibold hover:bg-red-700 transition">Ver Rechazadas</button>
    </div>

    <!-- Botón de descarga -->
    <div class="text-right mb-4" v-if="solicitudesPaginadas.length">
      <button @click="descargarPDF" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow text-sm">
        Descargar PDF
      </button>
    </div>

    <!-- Paginación -->
    <div v-if="totalPaginas > 1" class="flex justify-between items-center mb-4 text-sm text-gray-600">
      <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <div class="flex gap-2">
        <button v-for="p in totalPaginas" :key="p"
                @click="paginaActual = p"
                :class="paginaActual === p ? 'bg-blue-600 text-white' : 'bg-gray-200'"
                class="px-3 py-1 rounded text-sm hover:bg-blue-700">
          {{ p }}
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <section class="mb-10">
      <h3 class="text-lg font-semibold mb-2" :class="{
        'text-blue-700': filtroEstatus === 'pendiente',
        'text-green-700': filtroEstatus === 'aprobada',
        'text-red-700': filtroEstatus === 'rechazada'
      }">
        {{ filtroEstatus === 'pendiente' ? 'Solicitudes Pendientes' : (filtroEstatus === 'aprobada' ? 'Solicitudes Aprobadas' : 'Solicitudes Rechazadas') }}
      </h3>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border border-gray-300 shadow-sm rounded-md">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-3 py-2 text-left font-semibold text-gray-600">ID</th>
              <th class="border px-3 py-2 text-left font-semibold text-gray-600">Solicitante</th>
              <th class="border px-3 py-2 text-left font-semibold text-gray-600">Paciente</th>
              <th class="border px-3 py-2 text-left font-semibold text-gray-600">Servicio</th>
              <th class="border px-3 py-2 text-left font-semibold text-gray-600">Diagnóstico</th>
              <th class="border px-3 py-2 text-left font-semibold text-gray-600">Insumo</th>
              <th class="border px-3 py-2 text-left font-semibold text-gray-600">Cantidad Solicitada</th>
              <th v-if="filtroEstatus === 'aprobada'" class="border px-3 py-2 text-left font-semibold text-gray-600">Cantidad Surtida</th>
              <th class="border px-3 py-2 text-left font-semibold text-gray-600">{{ filtroEstatus === 'rechazada' ? 'Justificación' : 'Fecha Atendido' }}</th>
              <th class="border px-3 py-2 text-left font-semibold text-gray-600">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sol in solicitudesPaginadas" :key="sol.id_solicitud" class="hover:bg-gray-50">
              <td class="border px-3 py-2">{{ sol.id_solicitud }}</td>
              <td class="border px-3 py-2">{{ sol.nombre_solicitante || '' }}</td>
              <td class="border px-3 py-2">{{ sol.paciente }}</td>
              <td class="border px-3 py-2">{{ sol.servicio }}</td>
              <td class="border px-3 py-2">{{ sol.diagnostico }}</td>
              <td class="border px-3 py-2 whitespace-pre-line">
                <p v-for="insumo in sol.nombre_insumo?.split('||')" :key="insumo">{{ insumo }}</p>
              </td>
              <td class="border px-3 py-2 whitespace-pre-line">
                <p v-for="cant in sol.cantidad_solicitada?.split('||')" :key="cant">{{ cant }}</p>
              </td>
              <td v-if="filtroEstatus === 'aprobada'" class="border px-3 py-2 whitespace-pre-line">
                <p v-for="cant in sol.cantidad_surtida?.split('||')" :key="cant">{{ cant }}</p>
              </td>
              <td class="border px-3 py-2">
                <template v-if="filtroEstatus === 'rechazada'">
                  <span class="text-red-600 font-semibold">{{ sol.justificacion }}</span>
                </template>
                <template v-else>
                  {{ sol.fecha_atendido?.split('T')[0] || '-' }}
                </template>
              </td>
              <td class="border px-3 py-2 text-center">
                <button @click="abrirModal(sol)" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                  Detalles
                </button>
              </td>
            </tr>
            <tr v-if="!solicitudesPaginadas.length">
              <td :colspan="filtroEstatus === 'aprobada' ? 10 : 9" class="text-center text-red-500 py-4 font-semibold">
                No se encontraron solicitudes con los filtros actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal -->
    <SolicitudModal
      v-if="mostrarModal"
      :solicitudSeleccionada="solicitudSeleccionada"
      @cerrar="cerrarModal"
      @actualizar="obtenerSolicitudes"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import SolicitudModal from '../components/SolicitudModal.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const solicitudes = ref([])
const servicios = ref([])
const serviciosFiltrados = ref([])
const mostrarModal = ref(false)
const solicitudSeleccionada = ref(null)
const filtroEstatus = ref('pendiente')
const filtros = ref({ fecha: '', fecha_atendido: '', id_solicitud: '', nombre_solicitante: '', tipo: '', servicio: '' })
const paginaActual = ref(1)
const porPagina = 15
const API_URL = `http://${window.location.hostname}:5000/supervision/solicitudes`

const cambiarEstatus = (nuevo) => {
  filtroEstatus.value = nuevo
  paginaActual.value = 1
}

const abrirModal = (sol) => {
  solicitudSeleccionada.value = sol
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  solicitudSeleccionada.value = null
}

const limpiarFiltros = () => {
  filtros.value = { fecha: '', fecha_atendido: '', id_solicitud: '', nombre_solicitante: '', tipo: '', servicio: '' }
  serviciosFiltrados.value = []
}

const obtenerSolicitudes = async () => {
  try {
    const res = await axios.get(API_URL)
    solicitudes.value = res.data

    // 👇 Log para verificar los estatus directamente
    console.log('📦 Solicitudes recibidas:', res.data.map(s => ({
      id: s.id_solicitud,
      estatus: s.estatus
    })))
  } catch (err) {
    console.error('❌ Error al cargar solicitudes:', err)
  }
}

const obtenerServicios = async () => {
  try {
    const res = await axios.get(`${API_URL}/servicios`)
    servicios.value = res.data
  } catch (err) {
    console.error('❌ Error al cargar servicios:', err)
  }
}

const filtrarServicios = () => {
  serviciosFiltrados.value = filtros.value.tipo
    ? servicios.value.filter(s => s.tipo === filtros.value.tipo)
    : []
  filtros.value.servicio = ''
}

const solicitudesFiltradas = computed(() => {
  return solicitudes.value.filter(s => {
    const coincideEstatus = (s.estatus || '').toString().trim().toLowerCase() === filtroEstatus.value
    const coincideFecha = !filtros.value.fecha || s.fecha?.startsWith(filtros.value.fecha)
    const coincideFechaAtendido = !filtros.value.fecha_atendido || (s.fecha_atendido?.startsWith(filtros.value.fecha_atendido) ?? true)
    const coincideMedico = !filtros.value.nombre_solicitante || (s.nombre_solicitante || '').toLowerCase().includes(filtros.value.nombre_solicitante.toLowerCase())
    const coincideID = !filtros.value.id_solicitud || s.id_solicitud.toString().includes(filtros.value.id_solicitud)
    const coincideServicio = !filtros.value.servicio || (s.servicio || '').toLowerCase().includes(filtros.value.servicio.toLowerCase())

    return coincideEstatus && coincideFecha && coincideFechaAtendido && coincideMedico && coincideID && coincideServicio
  })
})

const solicitudesPaginadas = computed(() => {
  if (filtroEstatus.value === 'pendiente') return solicitudesFiltradas.value
  const inicio = (paginaActual.value - 1) * porPagina
  return solicitudesFiltradas.value.slice(inicio, inicio + porPagina)
})

const totalPaginas = computed(() => {
  return filtroEstatus.value === 'pendiente'
    ? 1
    : Math.ceil(solicitudesFiltradas.value.length / porPagina)
})

const descargarPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(12)
  doc.text(`Listado de Solicitudes (${filtroEstatus.value})`, 14, 14)

  const rows = solicitudesPaginadas.value.map(s => [
    s.id_solicitud,
    s.nombre_solicitante,
    s.paciente,
    s.servicio,
    s.diagnostico,
    s.nombre_insumo?.replaceAll('||', '\n') || '',
    s.cantidad_solicitada?.replaceAll('||', '\n') || '',
    s.fecha?.split('T')[0],
    s.fecha_atendido?.split('T')[0] || '-',
    s.estatus,
    s.justificacion || ''
  ])

  autoTable(doc, {
    head: [[
      'ID', 'Solicitante', 'Paciente', 'Servicio', 'Diagnóstico', 'Insumos', 'Cantidades', 'Fecha Solicitud', 'Fecha Atendido', 'Estatus', 'Justificación'
    ]],
    body: rows,
    startY: 20,
    styles: { fontSize: 8, cellPadding: 2 }
  })

  doc.save(`solicitudes_${filtroEstatus.value}.pdf`)
}

onMounted(() => {
  obtenerSolicitudes()
  obtenerServicios()
  setInterval(obtenerSolicitudes, 10000)
})

watch(mostrarModal, (v) => {
  if (!v) obtenerSolicitudes()
})
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
