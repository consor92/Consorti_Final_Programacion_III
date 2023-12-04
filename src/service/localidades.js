import api from './api'

const localidadesService = {}

localidadesService.addLocalidad = ( json) => api.post(`/localidades` ,json)
localidadesService.getLocalidad = () => api.get(`/localidades`)


export default localidadesService