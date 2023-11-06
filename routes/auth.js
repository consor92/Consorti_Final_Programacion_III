const { Router } = require('express')

const bcrypt = require('bcrypt')
const User = require('../schemas/user')
const Role = require('../schemas/role')
const generateUserToken = require('../utils/generateToken')

const router = new Router()

router.post('/login', createUserToken)
router.post('/register' , createUser)

async function createUserToken(req, res, next) {
    console.log(`Creando un nuevo TOKEN ${req.body.nick}`)

    if (!req.body.email) {
        if (!req.body.nick) {
            console.error('Nombre Usuario: VACIO')
            return res.status(400).end()
        }
    }

    if (!req.body.password) {
        console.error('Password: VACIO')
        return res.status(400).end()
    }

    try {
        const user = await User.findOne({ nick: req.body.nick }, '+password')

        if (!user) {
            const user = await User.findOne({ email: req.body.nick }, '+password')

            if (!user) {
                console.error('Usuario: NO ENCONTRADO')
                return res.status(401).end()
            }
        }

        const result = await user.checkPassword(req.body.password)

        if (result.isLocked) {
            console.error('Usuario:  BLOQUEADO')
            return res.status(400).end()
        }

        if (!result.isOk) {
            console.error('Usuario:  DATOS ERRONEOS')
            return res.status(401).end()
        }

        const response = await generateUserToken(req, user)

        res.status(201).json(response)
    } catch (err) {
        next(err)
    }

}

async function createUser(req, res, next) {
    console.log('createUser: ', req.body)
  
    const user = req.body
  
    try {
      const roles = await Role.find()
      const role = await Role.findOne({ name: user.role })
      if (!role) {
        res.status(404).send('Role not found')
      }
  
      const passEncrypted = await bcrypt.hash(user.password, 10)
      
      const userCreated = await User.create({ ...user, password: passEncrypted, role: role._id })
  
      res.send(userCreated)
    } catch (err) {
      next(err)
    }
  }

module.exports = router