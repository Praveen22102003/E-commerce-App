import API from './api';

const orderService = {
  getAll: () => API.get('/admin/orders'),
  updateStatus: (id, status) => API.put(`/admin/orders/${id}/status`, { status }),
};

export default orderService;