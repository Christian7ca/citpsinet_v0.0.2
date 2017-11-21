'use strict'

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Usuario = require('./../models/usuarios')

passport.serializeUser((usuario, finish) => {
    finish(null, usuario._id)
})

passport.deserializeUser((id, finish) => {
    Usuario.findById(id, 'numeroControl primerNombre apellidoPaterno imagen correoPrincipal notificaciones password rol', (err, usuario) => {
        finish(err, usuario)
    })
})

passport.use(new LocalStrategy({ usernameField: 'correo' },
    (correo, password, finish) => {
        Usuario.findOne({ correoPrincipal: correo }, (err, usuario) => {
            if (!usuario) {
                return finish(null, false, { message: `El correo ${correo} no está registrado!` })
            } else {
                usuario.comparePassword(password, (err, equals) => {
                    if (equals) {
                        return finish(null, usuario)
                    } else {
                        return finish(null, false, { message: `La contraseña no es válida!` })
                    }
                })
            }
        })
    }
))

exports.webMaster = (req, res, next) => {
    if (req.user.rol == 'WEB-MASTER') {
        return next()
    } else {
        res.status(400).send('Esta trantando de acceder a un lugar no autorizado')
    }
}

exports.adminServicios = (req, res, next) => {
    if (req.user.rol == 'ADMIN-SERVICIOS') {
        return next()
    } else {
        res.status(400).send('Esta trantando de acceder a un lugar no autorizado')
    }
}

exports.Authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect(401, '/login')
    }
}