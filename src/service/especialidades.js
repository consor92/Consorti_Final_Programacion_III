import api from './api'

const especialidadService = {}

especialidadService.addEspecialidad = ( json) => api.post(`/especialidades` ,json)
especialidadService.getEspecialidades = () => api.get(`/especialidades`)


export default especialidadService