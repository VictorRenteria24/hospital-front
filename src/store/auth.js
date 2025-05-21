// Importa el enrutador para realizar redirecciones después del login
import router from '../router';

// Importa Vuex para crear el store global
import { createStore } from 'vuex';

// Importa instancia de Axios personalizada
import API from '../utils/axios';

// Crea y exporta el store de Vuex
const store = createStore({
  // ==================== STATE ====================
  state: {
    // Token JWT y rol almacenados en el estado global, o recuperados del localStorage
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null
  },

  // ==================== MUTATIONS ====================
  mutations: {
    // Mutación para guardar el token y el rol en el estado y en localStorage
    SET_AUTH(state, { token, role }) {
      state.token = token;
      state.role = role;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    },

    // Mutación para cerrar sesión y limpiar datos
    LOGOUT(state) {
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  },

  // ==================== ACTIONS ====================
  actions: {
    // Acción para realizar login (llamada a la API + guardar token + redirección)
    async login({ commit }, credentials) {
      const response = await API.post('/login', credentials);
      const { token, role } = response.data;
      
      // Guarda token y rol usando la mutación
      commit('SET_AUTH', { token, role });

      // 🔐 Redirección según el rol del usuario
      switch (role) {
        case 'Administrador':
        case 'Administrativo':
          router.push('/dashboard');
          break;
        case 'Medico':
        case 'Enfermero':
          router.push('/solicitud-insumos');
          break;
        default:
          router.push('/');
      }
    }
  },

  // ==================== GETTERS ====================
  getters: {
    // Devuelve true si hay token, lo que indica que el usuario está autenticado
    isAuthenticated: state => !!state.token,

    // Devuelve el rol actual del usuario
    userRole: state => state.role
  }
});

// Exporta el store para usarlo en main.js
export default store;
