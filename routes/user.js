const { Router } = require('express')

const User = require('../schemas/user')
const Role = require('../schemas/role')

const router = new Router()

//  ----------  END POINT -----------

router.post('/role', createRol)
router.get('/view', getAllUsers)


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
  try {
    const users = await User.find({ isActive: true }).populate('role').populate({
      path: 'pref',
      model: 'Pais',
      select: 'pref',
    }).populate({
      path: 'especialidad',
      model: 'Especialidades',
      select: 'value'
    }).populate(
      {
        path:'cobertura',
        model:'Coberturas',
        select: 'value'
      }
    ).populate({
      path: 'sanatorio.localidades',
      model: 'Localidades',
    }).populate({
      path: 'localidad',
      model: 'Pais',
      options: { $slice: 1 }
    }).exec();

    res.send(users)
  } catch (err) {
    next(err)
  }
}


/*
.populate({
  path: 'localidad',
  populate: {
    path: 'provincia',
    model: 'Provincia',
    populate: {
      path: 'pais',
      model: 'Pais',
    },
  },
})
*/


module.exports = router