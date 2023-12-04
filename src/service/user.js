import api from './api'

const userService = {}

userService.getRoot = () => api.get('/')

userService.getAllUser = () => api.get('/user/all')
userService.addRol = (json) => api.post('/user/rol', json)
userService.getAllMedicos = () => api.get('/user/medicos')
userService.getAllPacientes = () => api.get('/user/pacientes')
userService.addUser = (json) => api.post('/user/register',json)
userService.addMedico = (json) => api.post('/user/medico/register',json)

userService.getPaciente = (id) => api.get(`/user/${id}`)
userService.editarPaciente = (id ,json) => api.patch(`/user/${id}`,json)
userService.habilitacionUser = (id , json) => api.patch(`/user/activate/${id}`,json)
userService.editHistoriaCli = (id, json) => api.patch(`/user/historia/${id}`,json)

userService.getToken = (json) => api.post('/login', json)



export default userService