import api from './api'

const medicoService = {}

medicoService.editMedico = (matricula, json) => api.patch(`/personal/${matricula}` ,json)
medicoService.getMedico = (matricula) => api.get(`/personal/${matricula}`)


export default medicoService