<template>
    <div class="p-5">
      <h1 class="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
  
      <div class="flex justify-between items-center mb-4">
        <button 
          v-if="userRole === 'Administrador'" 
          @click="abrirModal"
          class="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Nuevo Usuario
        </button>
      </div>
  
      <table class="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Nombre</th>
            <th class="p-3 text-left">Correo</th>
            <th class="p-3 text-left">Rol</th>
            <th class="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuarios" :key="user.id">
            <td class="p-3">{{ user.id }}</td>
            <td class="p-3">{{ user.nombre }}</td>
            <td class="p-3">{{ user.correo }}</td>
            <td class="p-3">{{ user.rol }}</td>
            <td class="p-3 flex gap-2">
              <button 
                v-if="userRole === 'Administrador'" 
                @click="abrirEdicion(user)"
                class="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Editar Rol
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal para agregar usuario -->
      <div v-if="modal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg">
          <h2 class="text-xl font-bold mb-4">{{ editando ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
          <input v-model="nuevoUsuario.nombre" type="text" placeholder="Nombre" class="border p-2 w-full mb-2" />
          <input v-model="nuevoUsuario.correo" type="email" placeholder="Correo" class="border p-2 w-full mb-2" />
          <select v-model="nuevoUsuario.rol" class="border p-2 w-full mb-2">
            <option value="Administrador">Administrador</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Medico">Médico</option>
            <option value="Enfermero">Enfermero</option>
          </select>
          <div class="flex justify-end gap-2">
            <button @click="cerrarModal" class="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
            <button @click="guardarUsuario" class="bg-blue-500 text-white px-4 py-2 rounded">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const usuarios = ref([]);
      const modal = ref(false);
      const editando = ref(false);
      const nuevoUsuario = ref({ nombre: '', correo: '', rol: '' });
      const userRole = ref(localStorage.getItem('role'));
  
      const obtenerUsuarios = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/usuarios', {
            headers: { Authorization: token }
          });
          usuarios.value = response.data;
        } catch (error) {
          console.error('Error al obtener usuarios:', error);
        }
      };
  
      const abrirModal = () => { modal.value = true; editando.value = false; nuevoUsuario.value = { nombre: '', correo: '', rol: '' }; };
      const cerrarModal = () => { modal.value = false; };
      const abrirEdicion = (user) => { modal.value = true; editando.value = true; nuevoUsuario.value = { ...user }; };
  
      const guardarUsuario = async () => {
        try {
          const token = localStorage.getItem('token');
          if (editando.value) {
            await axios.put(`http://localhost:5000/usuarios/${nuevoUsuario.value.id}`, nuevoUsuario.value, {
              headers: { Authorization: token }
            });
          } else {
            await axios.post('http://localhost:5000/usuarios', nuevoUsuario.value, {
              headers: { Authorization: token }
            });
          }
          obtenerUsuarios();
          cerrarModal();
        } catch (error) {
          console.error('Error al guardar usuario:', error);
        }
      };
  
      onMounted(obtenerUsuarios);
  
      return { usuarios, modal, nuevoUsuario, abrirModal, cerrarModal, guardarUsuario, abrirEdicion, editando, userRole };
    }
  };
  </script>
  