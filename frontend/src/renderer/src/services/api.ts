import axios from 'axios'

const API_URL = 'http://localhost:5001/api/v1/'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const projectAPI = {
  createProject: (data: any) => api.post('/project', data),
  addParts: (id: string, parts: any[]) => api.post(`/project/${id}/parts`, { parts }),
  completeProject: (id: string) => api.post(`/project/${id}/complete`),
  getProjects: () => api.get('/project'),
  getCurrentProjects: () => api.get('/project/current'),
  getCompletedProjects: () => api.get('/project/completed'),
  getSuggestions: (query: string) => api.get(`/project/suggestions?query=${encodeURIComponent(query)}`),
  updateProject: (id: string, data: any) => api.put(`/project/${id}`, data),
  updatePart: (partId: string, data: any) => api.put(`/project/part/${partId}`, data)
}
