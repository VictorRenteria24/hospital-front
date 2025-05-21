<template>
  <!-- Modal visible solo si la prop 'visible' es true -->
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

    <!-- Contenedor del modal -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
      <h3 class="text-lg font-bold mb-4">Confirmar registro de insumo</h3>

      <!-- Lista de detalles del insumo a confirmar -->
      <ul class="mb-4 text-sm text-gray-700 space-y-1">
        <li><strong>Nombre:</strong> {{ insumo.nombre }}</li>
        <li><strong>ID Insumo:</strong> {{ insumo.id_insumo }}</li>
        <li><strong>Presentación:</strong> {{ insumo.presentacion }}</li>
        <li><strong>Cantidad:</strong> {{ insumo.cantidad }}</li>
        <li><strong>ID Lote:</strong> {{ insumo.id_lote }}</li>
        <li><strong>Fecha de recepción:</strong> {{ insumo.fecha_recepcion }}</li>
        <li><strong>Fecha de vencimiento:</strong> {{ insumo.fecha_vencimiento }}</li>
      </ul>

      <!-- Botones de acción: cancelar o confirmar -->
      <div class="flex justify-end gap-2">
        <button 
          @click="$emit('cancelar')" 
          class="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded">
          Cancelar
        </button>

        <button 
          @click="$emit('confirmar')" 
          class="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define las props que recibe el componente: visibilidad y datos del insumo
defineProps(['visible', 'insumo']);

// Define los eventos que puede emitir: confirmar y cancelar
defineEmits(['confirmar', 'cancelar']);
</script>
