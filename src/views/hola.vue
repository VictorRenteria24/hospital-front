<template>
    <div class="p-6 bg-white min-h-screen">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Solicitud de Insumos</h2>
  
      <form @submit.prevent="enviarSolicitud" class="space-y-6 max-w-4xl mx-auto">
  
        <!-- 🔹 Datos del paciente -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <!-- CURP -->
          <div class="col-span-full">
            <label class="font-semibold block mb-1">CURP</label>
            <div class="relative">
              <input
                v-model="paciente.curp"
                placeholder="CURP"
                class="input-field w-full"
                @input="buscarPacientePorCurp"
                maxlength="18"
                minlength="18"
                required
              />
              <ul v-if="coincidenciasCurp.length" class="absolute bg-white border w-full shadow z-10 max-h-48 overflow-y-auto">
                <li
                  v-for="(item, i) in coincidenciasCurp"
                  :key="i"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="seleccionarPaciente(item)"
                >
                  {{ item.curp }} - {{ item.nombre }} {{ item.ap_paterno }}
                </li>
              </ul>
            </div>
          </div>
  
          <!-- Nombre -->
          <div>
            <label class="font-semibold block mb-1">Nombre</label>
            <input
              v-model="paciente.nombre"
              :disabled="pacienteExistente"
              :class="['input-field', pacienteExistente ? 'bg-gray-100 cursor-not-allowed' : '']"
              placeholder="Nombre"
              required
            />
          </div>
  
          <!-- Apellido paterno -->
          <div>
            <label class="font-semibold block mb-1">Apellido paterno</label>
            <input
              v-model="paciente.ap_paterno"
              :disabled="pacienteExistente"
              :class="['input-field', pacienteExistente ? 'bg-gray-100 cursor-not-allowed' : '']"
              placeholder="Apellido paterno"
              required
            />
          </div>
  
          <!-- Apellido materno -->
          <div>
            <label class="font-semibold block mb-1">Apellido materno</label>
            <input
              v-model="paciente.ap_materno"
              :disabled="pacienteExistente"
              :class="['input-field', pacienteExistente ? 'bg-gray-100 cursor-not-allowed' : '']"
              placeholder="Apellido materno"
              required
            />
          </div>
  
          <!-- Género -->
          <div>
            <label class="font-semibold block mb-1">Género</label>
            <select
              v-model="paciente.genero"
              :disabled="pacienteExistente"
              :class="['input-field', pacienteExistente ? 'bg-gray-100 cursor-not-allowed' : '']"
              required
            >
              <option disabled value="">Selecciona género</option>
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </div>
  
          <!-- Edad -->
          <div>
            <label class="font-semibold block mb-1">Edad</label>
            <input
              v-model="paciente.edad"
              type="number"
              :disabled="pacienteExistente"
              :class="['input-field', pacienteExistente ? 'bg-gray-100 cursor-not-allowed' : '']"
              placeholder="Edad"
              required
            />
          </div>
  
          <!-- Fecha de nacimiento -->
          <div>
            <label class="font-semibold block mb-1">Fecha de nacimiento</label>
            <input
              v-model="paciente.fecha_nacimiento"
              type="date"
              :disabled="pacienteExistente"
              :class="['input-field', pacienteExistente ? 'bg-gray-100 cursor-not-allowed' : '']"
              required
            />
          </div>
  
          <!-- Domicilio -->
          <div class="col-span-full">
            <label class="font-semibold block mb-1">Domicilio</label>
            <input
              v-model="paciente.domicilio"
              :disabled="pacienteExistente"
              :class="['input-field w-full', pacienteExistente ? 'bg-gray-100 cursor-not-allowed' : '']"
              placeholder="Domicilio"
            />
          </div>
        </div>
  
        <!-- 🔹 Servicio -->
        <div>
          <label class="font-semibold block mb-1">Tipo de servicio</label>
          <select v-model="tipoServicio" class="input-field w-full" required>
            <option disabled value="">Selecciona tipo</option>
            <option value="Hospitalaria">Hospitalaria</option>
            <option value="Ambulatoria">Ambulatoria</option>
          </select>
        </div>
  
        <div v-if="tipoServicio">
          <label class="font-semibold block mb-1">Servicio</label>
          <select v-model="solicitud.id_servicio" class="input-field w-full" required>
            <option disabled value="">Selecciona servicio</option>
            <option v-for="serv in serviciosFiltrados" :key="serv.id_servicio" :value="serv.id_servicio">
              {{ serv.nombre }}
            </option>
          </select>
        </div>
  
        <!-- 🔹 Solicitante -->
        <div>
          <label class="font-semibold block mb-1">Solicitante</label>
          <input type="text" :value="solicitud.nombre_solicitante" disabled class="input-field w-full bg-gray-100 cursor-not-allowed" />
        </div>
  
        <!-- 🔹 Diagnóstico -->
        <div>
          <label class="font-semibold block mb-1">Diagnóstico</label>
          <input v-model="solicitud.diagnostico" placeholder="Diagnóstico" required class="input-field w-full" />
        </div>
  
        <!-- 🔹 Buscar insumo -->
        <div>
          <label class="font-semibold block mb-1">Buscar insumo</label>
          <input v-model="busquedaInsumo" @input="buscarInsumos" placeholder="Buscar..." class="input-field w-full" />
          <ul v-if="insumosFiltrados.length" class="border bg-white shadow rounded max-h-48 overflow-y-auto mt-1">
            <li
              v-for="insumo in insumosFiltrados"
              :key="insumo.id_insumo"
              @click="seleccionarInsumo(insumo)"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {{ insumo.nombre }} - {{ insumo.presentacion }} (ID: {{ insumo.id_insumo }})
            </li>
          </ul>
  
          <div class="flex gap-2 mt-2">
            <input v-model="insumoTemporal.cantidad_solicitada" type="number" min="1" placeholder="Cantidad" class="input-field w-full" />
            <button type="button" @click="agregarInsumo" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Agregar insumo
            </button>
          </div>
        </div>
  
        <!-- 🔹 Insumos agregados -->
        <div v-if="insumosSeleccionados.length">
          <h4 class="font-semibold mb-2">Insumos agregados:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(insumo, index) in insumosSeleccionados" :key="index" class="flex justify-between items-center">
              <span>{{ insumo.nombre }} - {{ insumo.presentacion }} ({{ insumo.cantidad_solicitada }})</span>
              <button @click="eliminarInsumo(index)" class="text-red-600 hover:underline text-sm">Eliminar</button>
            </li>
          </ul>
        </div>
  
        <!-- 🔹 Prioridad y justificación -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select v-model="solicitud.prioridad" required class="input-field">
            <option disabled value="">Prioridad</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
          <textarea
            v-model="solicitud.justificacion"
            placeholder="Justificación (solo administrativo)"
            :disabled="role !== 'Administrativo 1'"
            class="input-field resize-none w-full h-24"
          ></textarea>
        </div>
  
        <!-- 🔹 Botón -->
        <div class="text-center">
          <button type="submit" :disabled="cargando" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-4 shadow flex items-center justify-center gap-2">
            <span v-if="!cargando">Enviar solicitud</span>
            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  </template>  

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const tipoServicio = ref('')
const servicios = ref([])
const insumosFiltrados = ref([])
const busquedaInsumo = ref('')
const coincidenciasCurp = ref([])
const role = localStorage.getItem('role')
const toast = useToast()
const cargando = ref(false)

// ✅ Variable para bloquear campos si el paciente ya está registrado
const pacienteExistente = ref(false)

const paciente = ref({
  nombre: '', ap_paterno: '', ap_materno: '', genero: '',
  edad: '', curp: '', fecha_nacimiento: '', domicilio: ''
})

const solicitud = ref({
  id_servicio: '', nombre_solicitante: '',
  diagnostico: '', justificacion: '', prioridad: 'Media'
})

const insumoTemporal = ref({
  id_insumo: '', nombre: '', presentacion: '', cantidad_solicitada: ''
})

const insumosSeleccionados = ref([])

const serviciosFiltrados = computed(() =>
  servicios.value.filter(serv => serv.tipo === tipoServicio.value)
)

const buscarInsumos = async () => {
  if (busquedaInsumo.value.length > 1) {
    const res = await axios.get(`http://${window.location.hostname}:5000/supervision/solicitudes/insumos?q=${busquedaInsumo.value}`)
    insumosFiltrados.value = res.data
  }
}

const seleccionarInsumo = (insumo) => {
  insumoTemporal.value = {
    id_insumo: insumo.id_insumo,
    nombre: insumo.nombre,
    presentacion: insumo.presentacion,
    cantidad_solicitada: ''
  }
  busquedaInsumo.value = `${insumo.nombre} (${insumo.presentacion})`
  insumosFiltrados.value = []
}

const agregarInsumo = () => {
  if (!insumoTemporal.value.id_insumo || !insumoTemporal.value.cantidad_solicitada) {
    toast.error('❌ Debes seleccionar un insumo y cantidad')
    return
  }
  insumosSeleccionados.value.push({ ...insumoTemporal.value })
  insumoTemporal.value = { id_insumo: '', nombre: '', presentacion: '', cantidad_solicitada: '' }
  busquedaInsumo.value = ''
}

const eliminarInsumo = (index) => {
  insumosSeleccionados.value.splice(index, 1)
}

const buscarPacientePorCurp = async () => {
  const curp = paciente.value.curp.toUpperCase()
  if (curp.length >= 3) {
    const res = await axios.get(`http://${window.location.hostname}:5000/supervision/solicitudes/pacientes/buscar?curp=${curp}`)
    coincidenciasCurp.value = res.data
  } else {
    coincidenciasCurp.value = []
  }
}

const seleccionarPaciente = (item) => {
  paciente.value = {
    ...item,
    fecha_nacimiento: item.fecha_nacimiento ? item.fecha_nacimiento.slice(0, 10) : ''
  }
  pacienteExistente.value = true // 🚫 Bloquear edición
  coincidenciasCurp.value = []
}

const cargarServicios = async () => {
  const res = await axios.get(`http://${window.location.hostname}:5000/supervision/solicitudes/servicios`)
  servicios.value = res.data
}

const cargarNombreSolicitante = async () => {
  const email = localStorage.getItem('email')
  if (!email) return
  const res = await axios.get(`http://${window.location.hostname}:5000/usuarios/info?email=${email}`)
  solicitud.value.nombre_solicitante = `${res.data.nombre} (${res.data.cargo})`
}

const enviarSolicitud = async () => {
  if (insumosSeleccionados.value.length === 0) {
    toast.error('❌ Agrega al menos un insumo antes de enviar')
    return
  }

  cargando.value = true

  try {
    const payload = {
      paciente: paciente.value,
      solicitud: solicitud.value,
      insumos: insumosSeleccionados.value,
      tipoServicio: tipoServicio.value
    }

    await axios.post(`http://${window.location.hostname}:5000/supervision/solicitudes`, payload)
    toast.success('✅ Solicitud enviada correctamente')

    // Limpiar
    Object.keys(paciente.value).forEach(k => paciente.value[k] = '')
    pacienteExistente.value = false
    insumosSeleccionados.value = []
    solicitud.value.justificacion = ''
    solicitud.value.diagnostico = ''
    solicitud.value.id_servicio = ''
    tipoServicio.value = ''
  } catch (error) {
    toast.error('❌ Error al enviar la solicitud. Intenta de nuevo.')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarServicios()
  cargarNombreSolicitante()
})
</script>