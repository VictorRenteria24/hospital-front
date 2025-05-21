<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Definición de variables reactivas para el formulario
const nombre_reportante = ref('')
const cargo = ref('')
const tipo_reporte = ref('')
const prioridad = ref('')
const descripcion = ref('')
const error = ref(null)
const exito = ref(null)

// URL base de la API para reportes
const API_URL = `http://${window.location.hostname}:5000/supervision/reportes`

// Función para normalizar texto: quita acentos y pone en mayúsculas
const normalizarTexto = (texto) => {
  return texto
    ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    : ''
}

// Cargar nombre y cargo del usuario autenticado usando su email
const cargarInfoUsuario = async () => {
  const email = localStorage.getItem('email')
  if (!email) return

  try {
    const res = await axios.get(`http://${window.location.hostname}:5000/usuarios/info?email=${email}`)
    nombre_reportante.value = res.data.nombre
    cargo.value = res.data.cargo
  } catch (err) {
    console.error('❌ Error al cargar datos del usuario:', err)
    error.value = 'Error al cargar los datos del usuario'
  }
}

// Enviar el reporte al backend
const enviarReporte = async () => {
  error.value = null
  exito.value = null

  const nuevoReporte = {
    nombre_reportante: normalizarTexto(nombre_reportante.value),
    cargo: normalizarTexto(cargo.value),
    tipo_reporte: normalizarTexto(tipo_reporte.value),
    prioridad: normalizarTexto(prioridad.value),
    descripcion: normalizarTexto(descripcion.value)
  }

  try {
    await axios.post(API_URL, nuevoReporte)
    exito.value = 'Reporte enviado correctamente ✅'

    // Limpia campos después del envío
    tipo_reporte.value = ''
    prioridad.value = ''
    descripcion.value = ''

    // Oculta el mensaje después de 3 segundos
    setTimeout(() => {
      exito.value = null
    }, 3000)
  } catch (err) {
    console.error('❌ Error al enviar el reporte:', err)
    error.value = 'Ocurrió un error al enviar el reporte'

    setTimeout(() => {
      error.value = null
    }, 3000)
  }
}

// Limpia los campos del formulario (excepto nombre y cargo)
const limpiarCampos = () => {
  tipo_reporte.value = ''
  prioridad.value = ''
  descripcion.value = ''
}

// Carga datos del usuario al montar el componente
onMounted(() => {
  cargarInfoUsuario()
})
</script>

<template>
  <!-- Contenedor principal con fondo degradado -->
  <div class="min-h-screen p-6 bg-gradient-to-br from-white to-sky-50">
    <h1 class="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-8">Nuevo Reporte</h1>

    <!-- Formulario principal -->
    <form @submit.prevent="enviarReporte" class="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-6">

      <!-- Campo: nombre del reportante (no editable) -->
      <div>
        <label class="block text-sm font-semibold mb-1">Nombre del reportante</label>
        <input v-model="nombre_reportante" type="text" class="input-field w-full bg-gray-100 cursor-not-allowed" readonly />
      </div>

      <!-- Campo: cargo (no editable) -->
      <div>
        <label class="block text-sm font-semibold mb-1">Cargo</label>
        <input v-model="cargo" type="text" class="input-field w-full bg-gray-100 cursor-not-allowed" readonly />
      </div>

      <!-- Campo: título del reporte -->
      <div class="mb-4">
        <label class="block text-sm font-semibold">Título del reporte</label>
        <input
          v-model="tipo_reporte"
          type="text"
          class="border p-3 w-full text-base rounded-md"
          required
          placeholder="Describe brevemente el reporte"
        />
      </div>

      <!-- Campo: prioridad -->
      <div>
        <label class="block text-sm font-semibold mb-1">Prioridad</label>
        <select v-model="prioridad" class="input-field w-full" required>
          <option disabled value="">Selecciona la prioridad</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      <!-- Campo: descripción del reporte -->
      <div class="mb-4">
        <label class="block text-sm font-semibold">Descripción</label>
        <textarea
          v-model="descripcion"
          class="border p-3 w-full text-base rounded-md resize-y min-h-[120px]"
          rows="5"
          placeholder="Agrega una descripción detallada del incidente o situación..."
          required
        ></textarea>
      </div>

      <!-- Botones: enviar y limpiar -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow">
          Enviar Reporte
        </button>
        <button type="button" @click="limpiarCampos" class="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded shadow">
          Limpiar
        </button>
      </div>
    </form>

    <!-- Mensajes de éxito y error -->
    <div v-if="exito" class="max-w-2xl mx-auto bg-green-100 text-green-800 p-3 mt-6 rounded shadow text-center font-medium">
      ✅ {{ exito }}
    </div>
    <div v-if="error" class="max-w-2xl mx-auto bg-red-100 text-red-800 p-3 mt-6 rounded shadow text-center font-medium">
      ❌ {{ error }}
    </div>
  </div>
</template>
