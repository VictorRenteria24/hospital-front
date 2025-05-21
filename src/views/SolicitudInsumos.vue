<template>
  <div class="p-6 bg-white min-h-screen">
    <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Solicitud de Insumos</h2>

    <div class="bg-white border border-gray-300 rounded-2xl shadow-md p-8 max-w-5xl mx-auto">
      <form @submit.prevent="enviarSolicitud" class="space-y-6">
        <div v-if="solicitud.nombre_solicitante" class="mb-4 text-sm text-gray-700">
          <strong>Solicitante:</strong> {{ solicitud.nombre_solicitante }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <!-- CURP -->
          <label class="block">
            <span class="text-gray-700">CURP del paciente</span>
            <input v-model="paciente.curp" @input="handleCurpInput" type="text" class="input-field w-full" required />
            <ul v-if="coincidenciasCurp.length" class="border bg-white rounded shadow">
              <li v-for="item in coincidenciasCurp" :key="item.curp" @click="seleccionarPaciente(item)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">
                {{ item.curp }} - {{ item.nombre }} {{ item.ap_paterno }}
              </li>
            </ul>
          </label>

          <!-- Nombre -->
          <label class="block">
            <span class="text-gray-700">Nombre</span>
            <input v-model="paciente.nombre" class="input-field w-full" required :disabled="pacienteExistente" />
          </label>

          <!-- Apellido paterno -->
          <label class="block">
            <span class="text-gray-700">Apellido paterno</span>
            <input v-model="paciente.ap_paterno" class="input-field w-full" required :disabled="pacienteExistente" />
          </label>

          <!-- Apellido materno -->
          <label class="block">
            <span class="text-gray-700">Apellido materno</span>
            <input v-model="paciente.ap_materno" class="input-field w-full" required :disabled="pacienteExistente" />
          </label>

          <!-- Género -->
          <label class="block">
            <span class="text-gray-700">Género</span>
            <select v-model="paciente.genero" class="input-field w-full" required :disabled="pacienteExistente">
              <option disabled value="">Selecciona</option>
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </label>

          <!-- Edad -->
          <label class="block">
            <span class="text-gray-700">Edad</span>
            <input v-model="paciente.edad" type="number" class="input-field w-full" required :disabled="pacienteExistente" />
          </label>

          <!-- Fecha nacimiento -->
          <label class="block">
            <span class="text-gray-700">Fecha de nacimiento</span>
            <input v-model="paciente.fecha_nacimiento" type="date" class="input-field w-full" required :disabled="pacienteExistente" />
          </label>

          <!-- Domicilio -->
          <label class="block col-span-full">
            <span class="text-gray-700">Domicilio</span>
            <input v-model="paciente.domicilio" class="input-field w-full" required :disabled="pacienteExistente" />
          </label>
        </div>

        <!-- Tipo de Servicio -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label class="block">
            <span class="text-gray-700">Tipo de servicio</span>
            <select v-model="tipoServicio" class="input-field w-full" required @change="filtrarServicios">
              <option disabled value="">Selecciona tipo</option>
              <option value="Hospitalaria">Hospitalaria</option>
              <option value="Ambulatoria">Ambulatoria</option>
            </select>
          </label>

          <label class="block">
            <span class="text-gray-700">Servicio</span>
            <select v-model="solicitud.id_servicio" class="input-field w-full" required>
              <option disabled value="">Selecciona servicio</option>
              <option v-for="s in serviciosFiltrados" :key="s.id_servicio" :value="s.id_servicio">{{ s.nombre }}</option>
            </select>
          </label>
        </div>

        <!-- Diagnóstico y Prioridad -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label class="block">
            <span class="text-gray-700">Diagnóstico</span>
            <input v-model="solicitud.diagnostico" class="input-field w-full" required />
          </label>

          <label class="block">
            <span class="text-gray-700">Prioridad</span>
            <select v-model="solicitud.prioridad" class="input-field w-full" required>
              <option disabled value="">Selecciona prioridad</option>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>
        </div>

        <!-- Buscar Insumo -->
        <div>
          <label class="text-gray-700">Buscar insumo</label>
          <input v-model="busquedaInsumo" @input="buscarInsumos" class="input-field w-full" placeholder="Ej. paracetamol" />
          <ul v-if="insumosFiltrados.length" class="border bg-white shadow rounded max-h-48 overflow-y-auto mt-1">
            <li v-for="insumo in insumosFiltrados" :key="insumo.id_insumo" @click="seleccionarInsumo(insumo)" class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
              {{ insumo.nombre }} - {{ insumo.presentacion }} (ID: {{ insumo.id_insumo }})
            </li>
          </ul>

          <!-- Insumo temporal seleccionado -->
          <div v-if="insumoTemporal.id_insumo" class="mt-2 p-2 border rounded bg-gray-50 text-sm text-gray-700">
            <p><strong>Seleccionado:</strong> {{ insumoTemporal.nombre }} - {{ insumoTemporal.presentacion }}</p>
            <p v-if="insumoTemporal.cantidad_solicitada"><strong>Cantidad:</strong> {{ insumoTemporal.cantidad_solicitada }}</p>
          </div>

          <!-- Cantidad y botón agregar -->
          <div class="flex gap-2 mt-2">
            <input v-model="insumoTemporal.cantidad_solicitada" type="number" min="1" placeholder="Cantidad" class="input-field w-full" />
            <button type="button" @click="agregarInsumo" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Agregar insumo
            </button>
          </div>
        </div>

        <!-- Insumos agregados -->
        <div v-if="insumosSeleccionados.length">
          <h4 class="font-semibold mb-2">Insumos agregados:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(insumo, index) in insumosSeleccionados" :key="index" class="flex justify-between items-center">
              <span>{{ insumo.nombre }} - {{ insumo.presentacion }} ({{ insumo.cantidad_solicitada }})</span>
              <button @click="eliminarInsumo(index)" class="text-red-600 hover:underline text-sm">Eliminar</button>
            </li>
          </ul>
        </div>

        <!-- Botón enviar -->
        <div class="text-center">
          <button type="submit" :disabled="cargando" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-4 shadow">
            Enviar solicitud
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  @apply border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-md;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const paciente = ref({ nombre: '', ap_paterno: '', ap_materno: '', genero: '', edad: '', curp: '', fecha_nacimiento: '', domicilio: '' })
const pacienteExistente = ref(false)
const solicitud = ref({ diagnostico: '', prioridad: '', id_servicio: '', nombre_solicitante: '' })
const tipoServicio = ref('')
const servicios = ref([])
const serviciosFiltrados = computed(() => servicios.value.filter(s => s.tipo === tipoServicio.value))
const busquedaInsumo = ref('')
const insumosFiltrados = ref([])
const insumoTemporal = ref({})
const insumosSeleccionados = ref([])
const coincidenciasCurp = ref([])
const cargando = ref(false)
const toast = useToast()

const normalizarTexto = (texto) => texto ? texto.normalize("NFD").replace(/\p{Diacritic}/gu, '').toUpperCase() : ''

const handleCurpInput = () => {
  paciente.value.curp = paciente.value.curp.toUpperCase()

  if (paciente.value.curp.length >= 3) {
    buscarPacientePorCurp()
  } else {
    coincidenciasCurp.value = []
  }

  if (paciente.value.curp.length < 18) {
    pacienteExistente.value = false
    Object.assign(paciente.value, {
      nombre: '', ap_paterno: '', ap_materno: '', genero: '', edad: '', fecha_nacimiento: '', domicilio: ''
    })
  }
}

const buscarPacientePorCurp = async () => {
  const curp = paciente.value.curp
  const { data } = await axios.get(`http://${window.location.hostname}:5000/supervision/solicitudes/pacientes/buscar?curp=${curp}`)
  coincidenciasCurp.value = data
}

const seleccionarPaciente = (item) => {
  paciente.value = { ...item, fecha_nacimiento: item.fecha_nacimiento?.slice(0, 10) || '' }
  pacienteExistente.value = true
  coincidenciasCurp.value = []
}

const buscarInsumos = async () => {
  if (busquedaInsumo.value.length > 1) {
    const { data } = await axios.get(`http://${window.location.hostname}:5000/supervision/solicitudes/insumos?q=${busquedaInsumo.value}`)
    insumosFiltrados.value = data
  }
}

const seleccionarInsumo = (insumo) => {
  insumoTemporal.value = { id_insumo: insumo.id_insumo, nombre: insumo.nombre, presentacion: insumo.presentacion, cantidad_solicitada: '' }
  busquedaInsumo.value = ''
  insumosFiltrados.value = []
}

const agregarInsumo = () => {
  if (!insumoTemporal.value.id_insumo || isNaN(insumoTemporal.value.id_insumo)) {
    return toast.error('ID de insumo no válido')
  }
  if (!insumoTemporal.value.cantidad_solicitada) {
    return toast.error('Falta ingresar la cantidad')
  }
  const yaAgregado = insumosSeleccionados.value.find(i => i.id_insumo === insumoTemporal.value.id_insumo)
  if (yaAgregado) return toast.warning('Este insumo ya fue agregado')
  insumosSeleccionados.value.push({
    ...insumoTemporal.value,
    id_insumo: parseInt(insumoTemporal.value.id_insumo)
  })
  insumoTemporal.value = {}
}

const eliminarInsumo = (i) => insumosSeleccionados.value.splice(i, 1)

const cargarServicios = async () => {
  const { data } = await axios.get(`http://${window.location.hostname}:5000/supervision/solicitudes/servicios`)
  servicios.value = data
}

const cargarSolicitante = async () => {
  try {
    const email = localStorage.getItem('email')
    const { data } = await axios.get(`http://${window.location.hostname}:5000/usuarios/info?email=${email}`)
    solicitud.value.nombre_solicitante = `${normalizarTexto(data.nombre)} (${normalizarTexto(data.cargo)})`
  } catch (err) {
    toast.error('No se pudo cargar el nombre del solicitante')
    console.error('⚠️ Error al cargar nombre del solicitante:', err)
  }
}

const enviarSolicitud = async () => {
  if (!paciente.value.curp || !solicitud.value.diagnostico || !solicitud.value.prioridad || !solicitud.value.id_servicio || insumosSeleccionados.value.length === 0) {
    toast.error('Faltan campos por llenar')
    return
  }

  paciente.value.nombre = normalizarTexto(paciente.value.nombre)
  paciente.value.ap_paterno = normalizarTexto(paciente.value.ap_paterno)
  paciente.value.ap_materno = normalizarTexto(paciente.value.ap_materno)
  paciente.value.domicilio = normalizarTexto(paciente.value.domicilio)
  paciente.value.curp = normalizarTexto(paciente.value.curp)
  paciente.value.genero = normalizarTexto(paciente.value.genero)
  solicitud.value.diagnostico = normalizarTexto(solicitud.value.diagnostico)

  cargando.value = true
  try {
    const payload = {
      paciente: paciente.value,
      solicitud: solicitud.value,
      tipoServicio: tipoServicio.value,
      insumos: insumosSeleccionados.value
    }
    await axios.post(`http://${window.location.hostname}:5000/supervision/solicitudes`, payload)
    toast.success('✅ Solicitud enviada correctamente')
    Object.keys(paciente.value).forEach(k => paciente.value[k] = '')
    Object.keys(solicitud.value).forEach(k => solicitud.value[k] = '')
    tipoServicio.value = ''
    insumosSeleccionados.value = []
    pacienteExistente.value = false
    await cargarSolicitante()
  } catch (err) {
    toast.error('❌ Error al enviar solicitud')
    console.error('❌ Backend:', err.response?.data || err.message)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarServicios()
  cargarSolicitante()
})
</script>
