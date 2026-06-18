import API from './api';

const authService = {
  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.user.role !== 'admin') {
      throw new Error('Access denied. Admins only.');
    }
    localStorage.setItem('adminToken', res.data.token);
    localStorage.setItem('adminUser', JSON.stringify(res.data.user));
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  }
};

export default authService;
