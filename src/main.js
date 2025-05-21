// Importa la función para crear la aplicación Vue
import { createApp } from 'vue';

// Importa el componente raíz de la aplicación
import App from './App.vue';

// Importa el enrutador para la navegación entre vistas
import router from './router';

// Importa el store de Vuex para el manejo del estado global
import store from './store';

// Importa los estilos de Tailwind CSS
import './assets/tailwind.css';

// Importa la librería de notificaciones Toast y sus estilos
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Crea la instancia principal de la aplicación Vue
const app = createApp(App);

// Middleware global para proteger rutas antes de cada navegación
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.token;     // Verifica si hay token
  const userRole = store.state.role;             // Obtiene el rol del usuario

  // Si la ruta requiere autenticación y no está autenticado, redirige al login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } 
  // Si la ruta tiene restricciones por rol y el rol actual no está permitido, redirige al dashboard
  else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/dashboard');
  } 
  // Si pasa todas las validaciones, permite la navegación
  else {
    next();
  }
});

// Configura y usa la librería Toast para notificaciones
app.use(Toast, {
  transition: "Vue-Toastification__fade",  // Animación
  maxToasts: 5,                            // Máximo de toasts visibles
  newestOnTop: true                        // Nuevas notificaciones arriba
});

// Usa el enrutador y el store en la aplicación
app.use(router);
app.use(store);

// Monta la app en el elemento con id 'app' en el HTML
app.mount('#app');
