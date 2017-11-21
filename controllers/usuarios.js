'use strict'

const passport = require('passport')
const Usuario = require('./../models/usuarios')

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, usuario, info) => {
        if (err) {
            next(err)
        } else {
            if (!usuario) {
                res.send({ message: 'Correo o contraseña no válida' })
            } else {
                req.logIn(usuario, (err) => {
                    if (err) { next(err) }
                    switch (usuario.rol) {
                        case 'WEB-MASTER':
                            res.send({ message: 'Login successs', redirect: '/dashboard' })
                            break
                        case 'ADMIN-SERVICIOS':
                            res.send({ message: 'Login success', redirect: '/adminServicios' })
                            break
                        default:
                            res.redirect('/login')
                    }
                })
            }
        }
    })(req, res, next)
}

exports.logout = (req, res) => {
    req.logout()
    res.redirect(301, '/login')
}