<template>
  <!-- Contenedor principal que usa flexbox en toda la pantalla -->
  <div class="flex h-screen">

    <!-- Barra lateral (aside) con fondo azul -->
    <aside class="w-64 bg-blue-500 p-5 text-white">
      <h2 class="text-xl font-bold">Menú</h2>

      <!-- Navegación por roles usando router-link -->
      <nav>
        <!-- Enlace visible para todos los usuarios autenticados -->
        <router-link to="/dashboard">Inicio</router-link>

        <!-- Enlace solo visible si el rol es administrador -->
        <router-link v-if="userRole === 'administrador'" to="/supervision-medica">
          Supervisión Médica
        </router-link>

        <!-- Enlace solo visible si el rol es administrativo -->
        <router-link v-if="userRole === 'administrativo'" to="/medicina-preventiva">
          Medicina Preventiva
        </router-link>

        <!-- Enlace solo visible para médicos o enfermeros -->
        <router-link v-if="['medico', 'enfermero'].includes(userRole)" to="/solicitudes">
          Solicitudes de Insumos
        </router-link>
      </nav>
    </aside>

    <!-- Área principal donde se cargan las vistas dinámicas -->
    <main class="flex-1 p-5">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// Importa Vue y el store para obtener el rol del usuario actual
import { computed } from 'vue';
import store from '../store/auth';

// Obtiene dinámicamente el rol del usuario autenticado
const userRole = computed(() => store.state.role);
</script>
