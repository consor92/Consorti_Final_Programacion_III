import api from './api'

const userService = {}

userService.getRoot = () => api.get('/')
userService.getUser = () => api.get('/user/view')
userService.getToken = (json) => api.post('/login', json)

export default userService