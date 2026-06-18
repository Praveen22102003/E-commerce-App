import API from './api';

const customerService = {
  getAll: () => API.get('/admin/customers'),
  updateStatus: (id, status) => API.put(`/admin/customers/${id}/status`, { status }),
};

export default customerService;