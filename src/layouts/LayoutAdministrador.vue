<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

// Computado reactivo para la ruta actual
const rutaActual = computed(() => route.path);

const volverAlPanel = () => {
  router.push('/admin/dashboard');
};
</script>

<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar visible fuera del dashboard -->
    <aside
      v-if="rutaActual !== '/admin/dashboard'"
      class="w-64 bg-blue-800 text-white flex flex-col p-4 space-y-4"
    >
      <h2 class="text-xl font-bold text-center mb-4">Administrador Hospital</h2>

      <!-- Enlaces dinámicos -->
      <router-link
        v-if="rutaActual !== '/admin/insumos-criticos'"
        to="/admin/insumos-criticos"
        class="hover:bg-blue-700 px-3 py-2 rounded transition"
      >
        🧪 Insumos Críticos
      </router-link>

      <router-link
        v-if="rutaActual !== '/admin/alertas'"
        to="/admin/alertas"
        class="hover:bg-blue-700 px-3 py-2 rounded transition"
      >
        🚨 Alertas
      </router-link>

      <router-link
        v-if="rutaActual !== '/admin/sugerencias'"
        to="/admin/sugerencias"
        class="hover:bg-blue-700 px-3 py-2 rounded transition"
      >
        📦 Sugerencias de Compra
      </router-link>
    </aside>

    <!-- Contenido principal -->
    <main class="flex-1 p-6">
      <!-- Botón volver al panel -->
      <div v-if="rutaActual !== '/admin/dashboard'" class="text-right mb-4">
        <button
          @click="volverAlPanel"
          class="text-sm bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition"
        >
          🏠 Volver al Panel Principal
        </button>
      </div>

      <router-view />
    </main>
  </div>
</template>
