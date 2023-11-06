const { Router } = require('express')

const User = require('../schemas/user')
const Role = require('../schemas/role')

const router = new Router()

//  ----------  END POINT -----------

router.post('/role' , createRol)
router.get('/view' , getAllUsers)


  async function createRol(req, res, next) {
    console.log('createRol: ', req.body)
  
    const user = req.body
  
    try {
      if (!user) {
        res.status(404).send('Sin datos')
      }
  
      const roleCreated = await User.create({ ...user })
  
      res.send(roleCreated)
    } catch (err) {
      next(err)
    }
  }  

  async function getAllUsers(req, res, next) {
    console.log('getAllUsers by user ', req.user._id)
    try {
      const users = await User.find({ isActive: true }).populate('role')
      res.send(users)
    } catch (err) {
      next(err)
    }
  }

  
module.exports = router