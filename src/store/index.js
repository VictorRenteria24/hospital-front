import { createStore } from 'vuex';

const store = createStore({
  state: {
    token: sessionStorage.getItem('token') || '',
    role: sessionStorage.getItem('role') || ''
  },
  mutations: {
    setAuth(state, { token, role }) {
      state.token = token;
      state.role = role;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', role);
    },
    logout(state) {
      state.token = '';
      state.role = '';
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    userRole: state => state.role
  }
});

export default store;




/*import { createStore } from 'vuex';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});*/

