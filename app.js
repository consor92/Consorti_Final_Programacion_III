const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const userRoute = require('./routes/user')
const turnosRoute = require('./routes/turnos')
const personalRoute = require('./routes/personal')
const pacienteRoute = require('./routes/paciente')
const agendaRoute = require('./routes/agenda')
const authRoute = require('./routes/auth')

const especialidadRoute = require('./routes/especialidades')
const localidadRoute = require('./routes/paises')
const coberturaRoute = require('./routes/coberturas')

const authentication = require('./middlewares/authentication')
const authorization = require('./middlewares/authorization')

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
//app.use(authorization)

// This is to aviod error
app.get('/favicon.ico', (req, res) => res.status(204))

// ----------  ***  -----------------
//app.use('/', statusRouter)

// ----------  DATOS GRAL. USUARIO  ----------
app.use('/', authRoute) // localhost:4000/login                                                -- POST   (verifica y devuelve TOKEN)
app.use('/logout', userRoute) // localhost:4000/logout                                              -- GET   (rompe el TOKEN)
app.use('/edit', userRoute) // localhost:4000/edit                                                  -- PATCH 
app.use('/user' , userRoute) // localhost:4000/view                                                  -- GET   (muestras los datos del usuario)

// ----------  ENDPOINT DE DATOS  ----------
app.use('/localidades' , localidadRoute)
app.use('/coberturas' , coberturaRoute)
app.use('/especialidades' , especialidadRoute)



// ----------  ENDPOINT DE PERSONAL  ----------
app.use('/medico', personalRoute) // localhost:4000/medicos                                         -- GET   (muestra a todos los medicos)
app.use('/medico:matricula', personalRoute) // localhost:4000/medicos:3                             -- GET   (muesra los datos de un medico)
app.use('/medico', personalRoute) // localhost:4000/medicos                                         -- POST  
app.use('/medico/edit:matricula', personalRoute) // localhost:4000/medicos/edit:4                   -- PATCH 

// ---------- ENDPOINT DE AGENDAS ------------
app.use('/medico/agenda', agendaRoute) // localhost:4000/medico/agenda                            -- GET (todas las agendas)
//app.use('/medico/agenda/:matricula', agendaRoute) // localhost:4000/medico/agenda/5                  -- GET (todas las agendas de un medico)
//app.use('/medico/agenda/view:idDia', agendaRoute) // localhost:4000/medico/agenda/view:             -- GET (la agenda de 1 dia especifico de un medico)
//app.use('/medico/agenda', agendaRoute) // localhost:4000/medico/agenda                              -- POST
//app.use('/medico/agenda/dia/:idDia', agendaRoute) // localhost:4000/medico/agenda/dia/66                    -- PATCH

// ------------  ENDPOINT PACIENTES -----------
app.use('/pacientes', pacienteRoute) // localhost:4000/                                             -- GET  (muestra a todos los pacientes)
app.use('/paciente:id', pacienteRoute) // localhost:4000/                                           -- GET  (muestra a un paciente en particular)
app.use('/paciente:id', pacienteRoute) // localhost:4000/                                           -- PATCH
app.use('/paciente', pacienteRoute) // localhost:4000/                                              -- POST

// ------------ENDPOINT DE TURNOS
app.use('/turno:idTurno', turnosRoute) // localhost:4000/                                           -- GET  (muestra los datos de un turno)
app.use('/turnos', turnosRoute) // localhost:4000/                                                  -- GET  (muestra todos los turno existentes)
app.use('/turno:idTurno', turnosRoute) // localhost:4000/                                           -- PATCH
app.use('/turno/cancelr:idTurno', turnosRoute) // localhost:4000/                                   -- PATCH
app.use('/turno/edit:idTurno', turnosRoute) // localhost:4000/                                      -- PATCH

//app.use('/users', authentication, userRouter)

module.exports = app