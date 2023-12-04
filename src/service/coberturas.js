import api from './api'

const coberturasService = {}

coberturasService.addCobertura = ( json) => api.post(`/coberturas` ,json)
coberturasService.getCobertura = () => api.get(`/coberturas`)


export default coberturasService