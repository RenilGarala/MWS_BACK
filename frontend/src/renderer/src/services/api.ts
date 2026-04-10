import axios from 'axios'

const API_URL = 'http://localhost:5001/api/v1/project'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const projectAPI = {
  createProject: (data: any) => api.post('/', data),
  addParts: (id: string, parts: any[]) => api.post(`/${id}/parts`, { parts }),
  completeProject: (id: string) => api.post(`/${id}/complete`),
  getProjects: () => api.get('/'),
  getCurrentProjects: () => api.get('/current'),
  getCompletedProjects: () => api.get('/completed'),
  getSuggestions: (query: string) => api.get(`/suggestions?query=${encodeURIComponent(query)}`)
}
