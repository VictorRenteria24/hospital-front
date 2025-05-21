<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const store = useStore();
const router = useRouter();
const toast = useToast();

const insumos = ref([]);
const presentaciones = ref([]);
const filtro = ref('');
const mostrarConfirmacion = ref(false);
const modoActualizacion = ref(false);
const tipoAccion = ref('');
const archivoExcel = ref(null);
const pagina = ref(1);
const limite = ref(30);
const totalPaginas = ref(1);

const seleccionarArchivo = (e) => {
  archivoExcel.value = e.target.files[0];
};

const form = ref({
  id_insumo: '',
  nombre: '',
  cantidad: '',
  presentacion: '',
  id_lote: '',
  fecha_recepcion: '',
  fecha_vencimiento: ''
});

watch(() => form.value.id_insumo, (nuevoID) => {
  const insumo = insumos.value.find(i => i.id_insumo == nuevoID);
  if (insumo) {
    form.value.nombre = insumo.nombre;
    form.value.presentacion = insumo.presentacion;
    form.value.cantidad = insumo.cantidad;
    form.value.id_lote = insumo.id_lote;
    form.value.fecha_recepcion = insumo.fecha_recepcion?.split('T')[0];
    form.value.fecha_vencimiento = insumo.fecha_vencimiento?.split('T')[0];
  } else {
    form.value.nombre = '';
    form.value.presentacion = '';
    form.value.cantidad = '';
    form.value.id_lote = '';
    form.value.fecha_recepcion = '';
    form.value.fecha_vencimiento = '';
  }
});

const obtenerInsumos = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/supervision/stock/paginado?page=${pagina.value}&limit=${limite.value}`);
    insumos.value = res.data.data;
    totalPaginas.value = res.data.totalPages;
    return res;
  } catch (error) {
    toast.error('❌ Error al obtener insumos');
  }
};

const siguientePagina = () => {
  if (pagina.value < totalPaginas.value) {
    pagina.value++;
    obtenerInsumos();
  }
};

const anteriorPagina = () => {
  if (pagina.value > 1) {
    pagina.value--;
    obtenerInsumos();
  }
};

const obtenerPresentaciones = async () => {
  try {
    const res = await axios.get('http://localhost:5000/supervision/stock/presentaciones');
    presentaciones.value = res.data;
    return res;
  } catch (error) {
    toast.error('❌ Error al cargar presentaciones');
  }
};

const confirmarRegistro = () => {
  if (!form.value.id_insumo || !form.value.cantidad) {
    toast.warning('⚠️ Debes indicar ID y cantidad');
    return;
  }
  tipoAccion.value = 'agregar';
  mostrarConfirmacion.value = true;
  modoActualizacion.value = false;
};

const confirmarModificacion = () => {
  if (!form.value.id_insumo || !form.value.cantidad) {
    toast.warning('⚠️ Debes indicar ID y cantidad');
    return;
  }
  tipoAccion.value = 'modificar';
  mostrarConfirmacion.value = true;
  modoActualizacion.value = true;
};

const confirmarEliminacion = () => {
  if (!form.value.id_insumo) {
    toast.warning('⚠️ Debes ingresar un ID de insumo');
    return;
  }
  tipoAccion.value = 'eliminar';
  mostrarConfirmacion.value = true;
};

const ejecutarAccion = async () => {
  if (tipoAccion.value === 'agregar') return await agregarInsumo();
  if (tipoAccion.value === 'modificar') return await modificarInsumo();
  if (tipoAccion.value === 'eliminar') return await eliminarInsumo();
};

const modificarInsumo = async () => {
  try {
    const res = await axios.put(`http://localhost:5000/supervision/stock/${form.value.id_insumo}`, {
      cantidad: form.value.cantidad,
      presentacion: form.value.presentacion || null
    });
    toast.success('✅ Insumo actualizado');
    limpiar();
    obtenerInsumos();
    return res;
  } catch (error) {
    toast.error('❌ Error al modificar insumo');
  }
};

const agregarInsumo = async () => {
  try {
    const res = await axios.post('http://localhost:5000/supervision/stock', form.value);
    toast.success('✅ Insumo registrado');
    mostrarConfirmacion.value = false;
    limpiar();
    obtenerInsumos();
    return res;
  } catch (error) {
    toast.error(`❌ Error: ${error?.response?.data?.message || error.message}`);
  }
};

const eliminarInsumo = async () => {
  try {
    const res = await axios.delete(`http://localhost:5000/supervision/stock/${form.value.id_insumo}`);
    toast.success('🗑️ Insumo eliminado');
    limpiar();
    obtenerInsumos();
    return res;
  } catch (error) {
    toast.error('❌ Error al eliminar insumo');
  }
};

const limpiar = () => {
  form.value = {
    id_insumo: '',
    nombre: '',
    cantidad: '',
    presentacion: '',
    id_lote: '',
    fecha_recepcion: '',
    fecha_vencimiento: ''
  };
  mostrarConfirmacion.value = false;
  modoActualizacion.value = false;
  tipoAccion.value = '';
};

const cancelarConfirmacion = () => {
  mostrarConfirmacion.value = false;
};

const normalizarTexto = (texto) => {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
};

const insumosFiltrados = computed(() => {
  return insumos.value.filter(i => normalizarTexto(i.nombre).includes(normalizarTexto(filtro.value)));
});

const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString();

const estiloFila = (fechaVencimiento) => {
  const hoy = new Date();
  const vencimiento = new Date(fechaVencimiento);
  const diferenciaDias = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));
  if (diferenciaDias < 0) return { backgroundColor: '#f87171' };
  if (diferenciaDias <= 150) return { backgroundColor: '#a16207' };
  if (diferenciaDias <= 364) return { backgroundColor: '#facc15' };
  return { backgroundColor: '#4ade80' };
};

const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  store.commit('setAuth', { token: null, role: null });
  router.push('/');
};

const subirExcel = async () => {
  if (!archivoExcel.value) {
    toast.warning('⚠️ Debes seleccionar un archivo Excel');
    return;
  }
  const formData = new FormData();
  formData.append('file', archivoExcel.value);
  try {
    const res = await axios.post(`http://${window.location.hostname}:5000/supervision/stock/upload-excel`, formData);
    toast.success(res.data.message || '✅ Excel procesado');
    obtenerInsumos();
    archivoExcel.value = null;
    return res;
  } catch (error) {
    toast.error('❌ Error al subir Excel');
  }
};

onMounted(() => {
  obtenerInsumos();
  obtenerPresentaciones();
});
</script>

<template>
  <div class="min-h-screen px-6 py-6 bg-white">
    <header class="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">SUPERVISIÓN MÉDICA</h1>
        <p class="text-lg text-gray-600 mt-1">Stock de Insumos</p>
      </div>
      <button @click="logout" class="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium">
        <span class="material-icons">logout</span> Cerrar sesión
      </button>
    </header>

    <!-- Buscador -->
    <div class="mb-4">
      <label class="text-sm font-semibold text-gray-700 mb-1 block">Buscar insumo</label>
      <input v-model="filtro" placeholder="Paracetamol, Ibuprofeno..." class="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto mb-6">
      <table class="min-w-full text-sm border border-gray-300">
        <thead class="bg-gray-100 text-gray-800 font-semibold">
          <tr>
            <th class="px-3 py-2 border">ID</th>
            <th class="px-3 py-2 border">Nombre</th>
            <th class="px-3 py-2 border">Presentación</th>
            <th class="px-3 py-2 border">Cantidad</th>
            <th class="px-3 py-2 border">Recepción</th>
            <th class="px-3 py-2 border">Vencimiento</th>
            <th class="px-3 py-2 border">ID Lote</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="insumo in insumosFiltrados" :key="insumo.id_insumo" :style="estiloFila(insumo.fecha_vencimiento)" class="text-center">
            <td class="px-2 py-1 border">{{ insumo.id_insumo }}</td>
            <td class="px-2 py-1 border text-left">{{ insumo.nombre }}</td>
            <td class="px-2 py-1 border">{{ insumo.presentacion }}</td>
            <td class="px-2 py-1 border">{{ insumo.cantidad }}</td>
            <td class="px-2 py-1 border">{{ formatearFecha(insumo.fecha_recepcion) }}</td>
            <td class="px-2 py-1 border">{{ formatearFecha(insumo.fecha_vencimiento) }}</td>
            <td class="px-2 py-1 border">{{ insumo.id_lote }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formulario de registro -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <input v-model="form.id_insumo" placeholder="ID del insumo" class="border px-3 py-2 rounded" />
      <input v-model="form.nombre" placeholder="Nombre" class="border px-3 py-2 rounded" />
      <input v-model="form.cantidad" type="number" placeholder="Cantidad" class="border px-3 py-2 rounded" />
      <select v-model="form.presentacion" class="border px-3 py-2 rounded">
        <option disabled value="">PRESENTACIÓN</option>
        <option v-for="p in presentaciones" :key="p" :value="p">{{ p }}</option>
      </select>
      <input v-model="form.id_lote" placeholder="ID Lote" class="border px-3 py-2 rounded" />
      <input v-model="form.fecha_recepcion" placeholder="Fecha de recepción" type="date" class="border px-3 py-2 rounded" />
      <input v-model="form.fecha_vencimiento" placeholder="Fecha de vencimiento" type="date" class="border px-3 py-2 rounded" />
    </div>

    <!-- Acciones -->
    <div class="flex flex-wrap gap-4 mb-6">
      <button @click="confirmarRegistro" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Agregar</button>
      <button @click="confirmarModificacion" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Modificar</button>
      <button @click="confirmarEliminacion" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Eliminar</button>
    </div>

    <!-- Modal emergente -->
    <div v-if="mostrarConfirmacion" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div class="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn">
        <button @click="cancelarConfirmacion" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition duration-200">&times;</button>

        <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">
          Confirmar
          <span v-if="tipoAccion === 'agregar'">registro</span>
          <span v-else-if="tipoAccion === 'modificar'">modificación</span>
          <span v-else-if="tipoAccion === 'eliminar'">eliminación</span>
        </h3>

        <ul class="text-sm text-gray-700 space-y-1 mb-4">
          <li><strong>ID Insumo:</strong> {{ form.id_insumo }}</li>
          <li><strong>Cantidad:</strong> {{ form.cantidad }}</li>
          <li><strong>Nombre:</strong> {{ form.nombre }}</li>
          <li><strong>Presentación:</strong> {{ form.presentacion }}</li>
          <li><strong>ID Lote:</strong> {{ form.id_lote }}</li>
          <li><strong>Recepción:</strong> {{ form.fecha_recepcion }}</li>
          <li><strong>Vencimiento:</strong> {{ form.fecha_vencimiento }}</li>
        </ul>

        <div class="flex justify-end gap-3">
          <button @click="cancelarConfirmacion" class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
          <button @click="ejecutarAccion" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirmar</button>
        </div>
      </div>
    </div>

    <!-- Subida de Excel -->
    <div class="mt-6 mb-4">
      <h3 class="font-semibold text-gray-700 mb-2">📥 Subir archivo Excel de existencias</h3>
      <div class="flex items-center gap-3">
        <input type="file" accept=".xlsx,.xls" @change="seleccionarArchivo" class="border px-3 py-2 rounded w-full" />
        <button @click="subirExcel" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Subir y procesar</button>
      </div>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-10">
      <div class="flex items-center gap-3">
        <label class="text-sm">Mostrar:</label>
        <select v-model="limite" @change="obtenerInsumos" class="border px-2 py-1 rounded">
          <option :value="30">30</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>

      <div class="flex items-center gap-4">
        <button @click="anteriorPagina" :disabled="pagina === 1" class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50">← Anterior</button>
        <span class="text-sm font-medium">Página {{ pagina }} de {{ totalPaginas }}</span>
        <button @click="siguientePagina" :disabled="pagina === totalPaginas" class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50">Siguiente →</button>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
