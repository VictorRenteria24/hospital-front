<template>
  <!-- Contenedor principal con fondo y centrado -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <!-- Título del formulario -->
      <h2 class="text-3xl font-bold mb-6 text-center text-blue-800">Sistema Hospitalario</h2>

      <!-- Formulario de inicio de sesión -->
      <form @submit.prevent="login" class="space-y-5">
        <!-- Campo: Correo -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Correo institucional</label>
          <input
            v-model="email"
            type="email"
            placeholder="tucorreo@hospital.gob.mx"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <!-- Campo: Contraseña -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="********"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <!-- Botón: Iniciar sesión -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
        >
          Iniciar sesión
        </button>

        <!-- Mensaje de error si las credenciales son incorrectas -->
        <p v-if="error" class="text-red-600 text-sm text-center mt-2">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref(null);
const store = useStore();

const login = async () => {
  error.value = null;

  if (!email.value || !password.value) {
    error.value = 'Debes llenar todos los campos';
    return;
  }

  try {
    const res = await axios.post('http://localhost:5000/login', {
      email: email.value,
      password: password.value,
    });

    console.log('📦 Respuesta del login:', res.data);

    const { token, role, nombre_usuario, id_rol } = res.data;

    store.commit('setAuth', { token, role });
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    localStorage.setItem('nombre', nombre_usuario);
    localStorage.setItem('rol', id_rol);
    localStorage.setItem('email', email.value);

    // Redirección según el rol
    if (role === 'Adm' || id_rol === 6) {
      router.push('/admin/dashboard'); // Administrador del hospital
    } else if (role === 'Administrador' || id_rol === 1 || role === 'Administrativo' || id_rol === 2) {
      router.push('/dashboard');
    } else if (role === 'Administrativo2' || id_rol === 3) {
      router.push('/dashboard-adm2');
    } else if (role === 'Medico' || role === 'Enfermero' || id_rol === 4 || id_rol === 5) {
      router.push('/dashboard-usuario');
    } else {
      router.push('/no-autorizado');
    }

  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    error.value = 'Correo o contraseña incorrectos';
  }
};
</script>
