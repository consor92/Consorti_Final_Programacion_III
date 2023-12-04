import api from './api'

const agendaService = {}

agendaService.addAgenda = (json) => api.post('/medico/agenda' ,json)
agendaService.addDia = (json) => api.post('/medico/agenda/dia' , json)
agendaService.addTurno = (json) => api.post('/medico/agenda/turno', json)

agendaService.getAllAgendas = () => api.get('/medico/agenda')
agendaService.getAgenda = (medico) => api.get(`/medico/agenda/${medico}`)
agendaService.getTurnos = () => api.get(`/medico/agenda/turnos`)
agendaService.getDias = () => api.get(`/medico/agenda/dias`)

agendaService.getTurnoById = (idTurno) => api.get(`/medico/agenda/IdTurno/${idTurno}`)
agendaService.getDiaById = (idDia) => api.get(`/medico/agenda/IdDia/${idDia}`)

agendaService.editAgenda = (medico, json) => api.patch(`/medico/agenda/${medico}`,json)
agendaService.editDia = (idDia ,json) => api.patch(`/medico/agenda/dia/${idDia}`, json)
agendaService.editTurno = (idTurno , json) => api.patch(`/medico/agenda/turno/${idTurno}` , json)


export default agendaService