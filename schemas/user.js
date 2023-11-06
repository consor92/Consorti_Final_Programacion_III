const mongoose = require('mongoose')
const validate = require('mongoose-validator')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types
const emailValidator = validate({ validator: 'isEmail' })

const Localidades = ['BsAs', 'Cordoba']
const Prefix = ['+54','+56','+67']
const Sanatorios = ['Mendoza', 'Cordoba']
const Generos = ['Masculino','Femenino','Otro']
const Especialidades = ['ninguna','Cardiologia','General']

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: emailValidator,
  },
  matricula: {    type: Number, required: false, unique: true, trim: true},
  dni:{           type: Number, required:true ,  unique: true },
  password: {     type: String, required: true, select: false },
  role: {         type: ObjectId, ref: 'Role', required: true },
  nombre: {       type: String, required: true, lowercase: true, trim: true },
  apellido: {     type: String, required: true, lowercase: true, trim: true },
  tel: {          type: String, trim: true },
  pref: {         type: String , enum: Prefix },
  nick: {         type: String , unique: true, required: true, trim: true},
  localidad: {    type: String , enum: Localidades },
  sanatorio:{     type: String , enum: Sanatorios , required: false, default: ''},
  nacimiento: {   type: Date},
  edad: {         type: Number , trim: true },
  genero: {       type: String , enum: Generos },
  especialidad: { type: String , enum: Especialidades , required: false, default: 'ninguna'},
  descripcion: {  type: String , trim: true },
  antecedentes: {
    area: {       type: String , trim: true , required: false, default: '' },
    año: {        type: Number , trim: true , required: false, default: ''},
    info: {       type: String , trim: true , required: false, default: ''}
    
  },
  isActive: {     type: Boolean, default: true },
})

userSchema.index({ 'matricula': 1, 'email': 1, 'nick': 1 , 'dni' : 1}, { unique: true })


userSchema.method('checkPassword', async function checkPassword(potentialPassword) {
  if (!potentialPassword) {
    return Promise.reject(new Error('Password is required'))
  }

  const isMatch = await bcrypt.compare(potentialPassword, this.password)

  return { isOk: isMatch, isLocked: !this.isActive }
})

const User = mongoose.model('User', userSchema)

module.exports = User