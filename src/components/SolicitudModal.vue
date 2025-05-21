<template>
  <!-- Modal fijo en pantalla con fondo oscuro -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">Detalles de la Solicitud</h2>

      <!-- Se muestra solo si hay una solicitud seleccionada -->
      <div v-if="solicitudSeleccionada">
        <p><strong>Paciente:</strong> {{ solicitudSeleccionada.paciente }}</p>
        <p><strong>Solicitante:</strong> {{ solicitudSeleccionada.nombre_solicitante }}</p>
        <p><strong>Diagnóstico:</strong> {{ solicitudSeleccionada.diagnostico }}</p>
        <p><strong>Estatus:</strong> {{ solicitudSeleccionada.estatus }}</p>
        <p v-if="solicitudSeleccionada.fecha_atendido">
          <strong>Fecha Atendido:</strong> {{ solicitudSeleccionada.fecha_atendido.split('T')[0] }}
        </p>

        <!-- Tabla dinámica de insumos procesados -->
        <table class="w-full mt-4 border">
          <thead class="bg-gray-100">
            <tr>
              <th>Insumo</th>
              <th>Presentación</th>
              <th>Solicitado</th>
              <th>Surtido</th>
              <th>Disponibles</th>
              <th>Vencimiento</th>
              <th>Justificación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(insumo, i) in insumosProcesados" :key="i">
              <td>{{ insumo.nombre }}</td>
              <td>{{ insumo.presentacion }}</td>
              <td>{{ insumo.solicitada }}</td>
              <td>
                <!-- Campo editable si no está caducado ni aprobado -->
                <input type="number" min="0" class="border p-1 w-20"
                       v-model.number="insumo.surtida"
                       :disabled="noEditable || insumo.esta_caducado"
                       @input="validarJustificacion(insumo)" />
              </td>
              <td>{{ insumo.cantidad_actual ?? '-' }}</td>
              <td :class="{ 'text-red-600 font-semibold': insumo.esta_caducado }">
                {{ insumo.fecha_vencimiento ? insumo.fecha_vencimiento.split('T')[0] : '-' }}
              </td>
              <td>
                <!-- Selector de justificación cuando hay diferencia entre solicitada y surtida -->
                <select v-if="insumo.surtida < insumo.solicitada"
                        v-model="insumo.justificacion"
                        :disabled="noEditable"
                        class="border p-1 w-full text-sm">
                  <option disabled value="">Selecciona justificación</option>
                  <option value="Fuera_de_cuadro">Fuera de cuadro</option>
                  <option value="Compra_directa">Compra directa</option>
                  <option value="No_existencia">No existencia</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Alerta si todos los insumos están caducados -->
        <p v-if="!puedeAprobar && !noEditable" class="text-sm text-red-600 mt-4 font-semibold">
          No se puede aprobar esta solicitud porque todos los insumos están caducados.
        </p>

        <!-- Botones de acción -->
        <div class="mt-6 flex gap-4 justify-end">
          <button v-if="!noEditable && puedeAprobar"
                  @click="aprobarSolicitud"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Aprobar y surtir</button>
          <button v-if="!noEditable"
                  @click="rechazarSolicitud"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Rechazar</button>
          <button @click="$emit('cerrar')"
                  class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useToast } from 'vue-toastification'

export default {
  // Recibe la solicitud seleccionada desde el padre
  props: ['solicitudSeleccionada'],

  data () {
    return {
      insumosProcesados: [] // Aquí se almacenan los insumos transformados
    }
  },

  computed: {
    // Desactiva edición si la solicitud ya no está en estado 'pendiente'
    noEditable () {
      return this.solicitudSeleccionada?.estatus !== 'pendiente'
    },
    // Verifica si al menos un insumo no está caducado para poder aprobar
    puedeAprobar () {
      return this.insumosProcesados.some(i => !i.esta_caducado)
    }
  },

  watch: {
    // Cada vez que cambia la solicitud seleccionada, se procesan los insumos
    solicitudSeleccionada: {
      immediate: true,
      async handler (val) {
        if (val) {
          const idsInsumo = (val.id_insumo || '').split('||')
          const cantidades = (val.cantidad_solicitada || '').split('||')
          const cantidadesSurtidas = (val.cantidad_surtida || '').split('||')
          const presentaciones = (val.presentacion || '').split('||')
          const nombres = (val.nombre_insumo || '').split('||')

          // Crea objetos por insumo con detalles y valida si están caducados
          this.insumosProcesados = await Promise.all(nombres.map(async (nombre, i) => {
            const id = idsInsumo[i]
            if (!id) {
              return {
                id_insumo: '',
                id_solicitud: val.id_solicitud,
                nombre,
                presentacion: presentaciones[i] || '-',
                solicitada: Number(cantidades[i]) || 0,
                surtida: 0,
                justificacion: '',
                cantidad_actual: '-',
                fecha_vencimiento: null,
                esta_caducado: false
              }
            }

            const detalle = await this.obtenerDetalleInsumo(id)
            const estaCaducado = detalle?.fecha_vencimiento
              ? new Date(detalle.fecha_vencimiento) < new Date()
              : false

            return {
              id_insumo: id,
              id_solicitud: val.id_solicitud,
              nombre,
              presentacion: presentaciones[i] || '-',
              solicitada: Number(cantidades[i]) || 0,
              surtida: this.noEditable
                ? (Number(cantidadesSurtidas[i]) || 0)
                : (estaCaducado ? 0 : Number(cantidades[i]) || 0),
              justificacion: estaCaducado ? 'No_existencia' : '',
              cantidad_actual: detalle?.cantidad ?? '-',
              fecha_vencimiento: detalle?.fecha_vencimiento || null,
              esta_caducado: estaCaducado
            }
          }))
        }
      }
    }
  },

  methods: {
    // Obtiene los detalles del insumo desde el backend
    async obtenerDetalleInsumo (id) {
      try {
        const { data } = await axios.get(`http://${window.location.hostname}:5000/supervision/solicitudes/insumos/detalle/${id}`)
        return data
      } catch (err) {
        console.error('Error al obtener detalle del insumo:', err)
        return null
      }
    },

    // Valida si se requiere justificación por surtir menos de lo solicitado
    validarJustificacion (insumo) {
      if (insumo.surtida < insumo.solicitada && !insumo.justificacion) {
        insumo.justificacion = ''
      }
    },

    // Aprueba la solicitud con insumos válidos
    async aprobarSolicitud () {
      const toast = useToast()
      try {
        const errores = this.insumosProcesados.filter(i => i.esta_caducado && i.surtida > 0)
        if (errores.length > 0) {
          return toast.error('❌ No se pueden surtir insumos caducados. Debes marcarlos con cantidad 0')
        }

        const payload = {
          estatus: 'aprobada',
          insumos: this.insumosProcesados.map(i => ({
            id_insumo: i.id_insumo,
            id_solicitud: i.id_solicitud,
            cantidad_surtida: i.surtida,
            justificacion: i.surtida < i.solicitada ? i.justificacion : ''
          }))
        }

        await axios.put(`http://${window.location.hostname}:5000/supervision/solicitudes`, payload)
        toast.success('✅ Solicitud aprobada correctamente')
        this.$emit('actualizar')
        this.$emit('cerrar')
      } catch (err) {
        toast.error('❌ Error al aprobar solicitud')
        console.error(err)
      }
    },

    // Rechaza la solicitud con justificación
    async rechazarSolicitud () {
      const toast = useToast()
      const faltantes = this.insumosProcesados.filter(i => !i.justificacion)
      if (faltantes.length > 0) {
        toast.error('❌ Debes seleccionar una justificación para todos los insumos')
        return
      }

      try {
        const payload = {
          estatus: 'rechazada',
          insumos: this.insumosProcesados.map(i => ({
            id_insumo: i.id_insumo,
            id_solicitud: i.id_solicitud,
            cantidad_surtida: 0,
            justificacion: i.justificacion
          }))
        }

        await axios.put(`http://${window.location.hostname}:5000/supervision/solicitudes`, payload)
        toast.success('❌ Solicitud rechazada correctamente')
        this.$emit('actualizar')
        this.$emit('cerrar')
      } catch (err) {
        toast.error('Error al rechazar solicitud')
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
/* Estilo para celdas de tabla */
th, td {
  text-align: left;
  padding: 4px;
  border-bottom: 1px solid #ccc;
}
</style>
