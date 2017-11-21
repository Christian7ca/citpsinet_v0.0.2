'use strict'

const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


/* 
moment.locale('es');
moment().format('YYYYMMDD');

var m1 = moment('1994-03-03','YYYY-MM-DD');
var m2 = moment('2017-05-11','YYYY-MM-DD');
var diff = moment.preciseDiff(m1, m2,true); // '1 month 2 days 3 hours 4 minutes 5 seconds'
console.log(diff.years);
*/

const Notificaciones = new Schema({
    titulo: { type: String, required: true },
    fecha: { type: String, required: true },
    contenido: { type: String, required: true },
    icono: { type: String, required: true }
})

const Usuario = new Schema({
    numeroControl: { type: String, unique: true, required: true },
    primerNombre: { type: String, uppercase: true, required: true },
    segundoNombre: { type: String, uppercase: true },
    apellidoPaterno: { type: String, uppercase: true, required: true },
    apellidoPaterno: { type: String, uppercase: true, required: true },
    sexo: { type: String, enum: ['Masculino', 'Femenino'], required: true },
    fechaNacimiento: { type: String, required: true },
    nacionalidad: { type: String, uppercase: true, required: true },
    correoPrincipal: { type: String, lowercase: true, unique: true, required: true },
    correoSecundario: { type: String, lowercase: true },
    telefonoPrincipal: { type: String, required: true, required: true },
    telefonoSecundario: { type: String },
    direccionPostal: { type: String, uppercase: true, required: true },
    rol: {
        type: String,
        enum: ['WEB-MASTER',
            'ADMIN-SERVICIOS',
            'ADMIN-DOCTORADO',
            'ADMIN-INVESTIGACION',
            'ADMIN-TRANSFERENCIA',
            'INVESTIGADOR',
            'ALUMNO',
            'TERAPEUTA-A',
            'TERAPEUTA-B',
            'TERAPEUTA-C'
        ],
        required: true
    },
    imagen: { type: String, default: "" },
    password: { type: String, required: true },
    notificaciones: [Notificaciones]
}, {
    timestamps: true
})

/* 
    Metodo 'pre' que encripta la contraseña antes de guardarla en la Base de Datos
*/
Usuario.pre('save', function(next) {
    const usuario = this;
    if (!usuario.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            next(err)
        }
        bcrypt.hash(usuario.password, salt, null, (err, hash) => {
            if (err) {
                next(err)
            }
            usuario.password = hash
            next()
        })
    })

})

/* 
    Metodo que compara la contraseña dada por el usuario en texto plano y el hash de la contraseña 
    guardado en la Base de Datos.    
*/
Usuario.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, same) => {
        if (err) {
            return cb(err)
        }
        cb(null, same)
    })
}

module.exports = mongoose.model('Usuario', Usuario)