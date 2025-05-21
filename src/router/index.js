// Importa funciones necesarias para crear el router de Vue 3
import { createRouter, createWebHistory } from 'vue-router';

// Importación de vistas utilizadas en las rutas
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Supervision from '../views/Supervision.vue';
import MedicinaPreventiva from '../views/MedicinaPreventiva.vue';
import Solicitudes from '../views/Solicitudes.vue';
import SolicitudInsumos from '../views/SolicitudInsumos.vue';
import Usuarios from '../views/Usuarios.vue';
import Reportes from '../views/Reportes.vue';
import GestionInsumos from '../views/GestionInsumos.vue';
import SupervisionMedica from '../views/SupervisionMedica.vue';
import DashboardAtencionSolicitudes from '../views/DashboardAtencionSolicitudes.vue';
import CrearReporte from '../views/CrearReporte.vue';
import DashboardUsuario from '../views/DashboardUsuario.vue';
import Stock from '../views/Stock.vue';

// Definición de rutas del sistema
const routes = [
  { path: '/', component: Login },

  // Rutas protegidas por autenticación y rol
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo'] } },
  { path: '/dashboard/atender-solicitudes', component: DashboardAtencionSolicitudes, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo'] } },
  { path: '/supervision', component: Supervision, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo'] } },
  { path: '/supervision/solicitudes', component: Solicitudes, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo'] } },
  { path: '/supervision/stock', component: Stock, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo'] } },
  { path: '/supervision/reportes', component: Reportes, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo'] } },
  
  // Carga perezosa (lazy loading) para mejorar rendimiento
  { path: '/supervision/estadisticas', component: () => import('../views/Estadisticas.vue'), meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo'] } },
  { path: '/dashboard-adm2', name: 'DashboardAdministrativo2', component: () => import('@/views/DashboardAdm2.vue') },

  // Accesos de administrativos y administrativos 2
  { path: '/medicina-preventiva', component: MedicinaPreventiva, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo', 'Administrativo2'] } },

  // Rutas exclusivas de administrador
  { path: '/usuarios', component: Usuarios, meta: { requiresAuth: true, roles: ['Administrador'] } },

  // Acceso a reportes y gestión para todos los roles relevantes
  { path: '/reportes', component: Reportes, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo'] } },
  { path: '/gestion-insumos', component: GestionInsumos, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo', 'Medico', 'Enfermero'] } },
  { path: '/supervision-medica', component: SupervisionMedica, meta: { requiresAuth: true, roles: ['Administrador', 'Administrativo'] } },

  // Accesos para médicos y enfermeros
  { path: '/crear-reporte', component: CrearReporte, meta: { requiresAuth: true, roles: ['Medico', 'Enfermero'] } },
  { path: '/dashboard-usuario', component: DashboardUsuario, meta: { requiresAuth: true, roles: ['Medico', 'Enfermero'] } },
  { path: '/solicitud-insumos', component: SolicitudInsumos, meta: { requiresAuth: true, roles: ['Medico', 'Enfermero'] } },

  //Accesos para el administrador del hospital
  {path: '/admin',component: () => import('@/layouts/LayoutAdministrador.vue'), meta: { requiresAuth: true, rol: 'Adm' }, children: [
    {
      path: 'dashboard',
      name: 'AdminDashboard',
      component: () => import('@/views/AdminDashboard.vue'),
    },
    {
      path: 'insumos-criticos',
      name: 'AdminInsumosCriticos',
      component: () => import('@/views/InsumosCriticos.vue'),
    },
    {
      path: 'alertas',
      name: 'AdminAlertas',
      component: () => import('@/views/Alertas.vue'),
    },
    {
      path: 'sugerencias',
      name: 'AdminSugerencias',
      component: () => import('@/views/SugerenciasCompras.vue'),
    }
  ]
}
];

// Crea la instancia del enrutador con historial HTML5
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Middleware global de navegación (protección de rutas)
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');  // Verifica si hay token
  const role = sessionStorage.getItem('role');    // Obtiene el rol del usuario

  // Si requiere autenticación y no hay token, redirige al login
  if (to.meta.requiresAuth && !token) {
    return next('/');
  }

  // Si ya está autenticado y va al login, redirige según su rol
  if (to.path === '/' && token) {
    if (role === 'Administrador' || role === 'Administrativo') {
      return next('/dashboard');
    } else if (role === 'Medico' || role === 'Enfermero') {
      return next('/dashboard-usuario');
    }
  }

  // Si el rol actual no está permitido en la ruta, redirige
  if (to.meta.roles && !to.meta.roles.includes(role)) {
    return next('/'); // Acceso denegado
  }

  // Si todo está bien, continúa con la navegación
  next();
});

// Exporta el router para usarlo en main.js
export default router;

