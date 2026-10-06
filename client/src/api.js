import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

export const usersApi = {
  getAll: () => api.get('/users').then(r => r.data),
  create: (data) => api.post('/users', data).then(r => r.data),
  remove: (id) => api.delete(`/users/${id}`).then(r => r.data),
}

export const productsApi = {
  getAll: () => api.get('/products').then(r => r.data),
  create: (data) => api.post('/products', data).then(r => r.data),
  remove: (id) => api.delete(`/products/${id}`).then(r => r.data),
}

export const ordersApi = {
  getAll: () => api.get('/orders').then(r => r.data),
  create: (data) => api.post('/orders', data).then(r => r.data),
  remove: (id) => api.delete(`/orders/${id}`).then(r => r.data),
}