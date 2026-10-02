import axios from 'axios'

const api = axios.create({
  baseURL: 'https://blog-app-backend-mmiu.onrender.com/api', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Assuming you store the token in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  })

  export default api;
