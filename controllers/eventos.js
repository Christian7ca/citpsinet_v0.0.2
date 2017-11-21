'use strict'

const mongoose = require('mongoose')
const moment = require('moment')
const Avisos = require('./../models/avisos')
const Eventos = require('./../models/eventos')
const config = require('./../config')
mongoose.Promise = global.Promise

/**
 * Controlador para crear Eventos 
 */
exports.crearEvento = (req, res) => {
    var evento = new Eventos
    var idEvento = moment().unix()
    evento.id = idEvento
    evento.titulo = req.body.nombre_evento
    evento.autor = req.user._id
    evento.descripcion = req.body.descripcion_evento
    evento.contacto = req.body.contacto_evento
    evento.fecha_inicio = moment(req.body.inicio_evento).unix()
    evento.fecha_final = moment(req.body.final_evento).unix()
    evento.imagen.push({
        //uri: "/uploads/" + moment().unix() + evento.imagen.split('/')[1] <== reemplazar por la uri deseada
        nombre: moment().add(2, 's').unix() + '.' + req.files.imagen.mimetype.split('/')[1]
    })

    /* Serie de condiciones para tratar el request en caso de contener imágenes adicionales o no */
    if (req.files.imagenes != undefined && req.files.imagenes.length > 1) {
        req.files.imagenes.forEach((imagen, index, array) => {
            evento.imagenes.push({
                //uri: "/uploads/" + moment().unix() + imagen.mimetype.split('/')[1],
                nombre: moment().add((index + 1) * 10, 's').unix() + '.' + imagen.mimetype.split('/')[1]
            })
        })
    } else if (req.files.imagenes != undefined && req.files.imagenes.length == undefined) {
        evento.imagenes.push({
            //uri: "/uploads/" + moment().unix() + imagen.mimetype.split('/')[1],
            nombre: moment().add(10, 's').unix() + '.' + req.files.imagenes.mimetype.split('/')[1]
        })
    }

    evento.save()
        .then((evento) => {
            req.files.imagen.mv(config.PATH_PUBLIC + evento.imagen[0].uri + evento.imagen[0].nombre, function(err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send(err)
                }
            })

            if (evento.imagenes.length > 1) {
                req.files.imagenes.forEach((imagen, index, array) => {
                    imagen.mv(config.PATH_PUBLIC + evento.imagenes[index].uri + evento.imagenes[index].nombre, function(err) {
                        if (err) {
                            console.log(err)
                            return res.status(500).send(err)
                        }
                    })
                })
            } else if (evento.imagenes.length == 1) {
                req.files.imagenes.mv(config.PATH_PUBLIC + evento.imagenes[0].uri + evento.imagenes[0].nombre, function(err) {
                    if (err) {
                        console.log(err)
                        return res.status(500).send(err)
                    }
                })
            }
            //console.log(evento)
            // Instanciamos el esquema de los avisos para guardalo en la DB
            var aviso = new Avisos
            aviso.id = idEvento
            aviso.autor = req.user._id
            aviso.imagen = evento.imagen[0].uri + evento.imagen[0].nombre
            aviso.endPoint = `/eventos/${idEvento}`
            aviso.caducidad = evento.fecha_final
            aviso.save().then(() => {
                res.status(200).send({ message: 'Evento y Aviso creado.', evento: evento })
            }).catch((err) => {
                console.log(err)
                return res.status(500).send('Evento creado, sin embargo no se pudo crear el aviso para el evento.')
            })

        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send(err)
        })

}

exports.verEventos = (req, res) => {
    // filtrar por autor    
    Eventos.find()
        .where('fecha_final')
        .gte(moment().unix())
        .exec((err, eventos) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Falla al extraer de la Base de datos')
            }
            res.status(200).send(eventos)
        })
}

exports.verEvento = (req, res) => {
    Eventos.findOne({ id: req.body.id }, function(err, evento) {
        if (err) {
            return res.status(500).send({ message: 'Hubo un error al extraer la información de la base de datos' })
        }
        res.status(200).send(evento)
    })
}

exports.actualizarEvento = (req, res) => {
    Eventos.findOne({ id: req.body.id }, (err, evento) => {
        if (err) {
            return res.status(500).send({ message: 'Error en el servidor.' })
        }
        if (req.body.nombre_evento != undefined) {
            evento.titulo = req.body.nombre_evento
        }
        if (req.body.descripcion_evento != undefined) {
            evento.descripcion = req.body.descripcion_evento
        }
        if (req.body.contacto_evento != undefined) {
            evento.contacto = req.body.contacto_evento
        }
        if (req.body.inicio_evento != undefined) {
            evento.fecha_inicio = moment(req.body.inicio_evento).unix()
        }
        if (req.body.final_evento != undefined) {
            evento.fecha_inicio = moment(req.body.inicio_evento).unix()
        }
        if (req.files != null) {
            if (req.files.imagen != undefined) {
                req.files.imagen.mv(config.PATH_PUBLIC + req.body.nombre_imagen, function(err) {
                    if (err) {
                        console.log(err)
                        return res.status(500).send({ message: 'Problema al actualiar los datos.' })
                    }
                })
            }
            // Everiguamos si el request tiene imagenes secundarias; en caso verdadero, itera el array y guarda en la DB
            if (req.files.imagenes != undefined && req.files.imagenes.length > 1) {
                req.files.imagenes.forEach((imagen, index, array) => {
                    evento.imagenes.push({
                        //uri: "/uploads/" + moment().unix() + imagen.mimetype.split('/')[1],
                        nombre: moment().add((index + 1) * 10, 's').unix() + '.' + imagen.mimetype.split('/')[1]
                    })
                })
            } else if (req.files.imagenes != undefined && req.files.imagenes.length == undefined) {
                evento.imagenes.push({
                    //uri: "/uploads/" + moment().unix() + imagen.mimetype.split('/')[1],
                    nombre: moment().add(10, 's').unix() + '.' + req.files.imagenes.mimetype.split('/')[1]
                })
            }
        }
        evento.save((err, evento) => {
            if (err) {
                res.status(500).send({ message: err })
            }
            if (req.files != null) {
                if (req.files.imagenes != undefined && req.files.imagenes.length > 1) {
                    req.files.imagenes.forEach((imagen, index, array) => {
                        imagen.mv(config.PATH_PUBLIC + evento.imagenes[(evento.imagenes.length - 1) + index].uri + evento.imagenes[(evento.imagenes.length - 1) + index + index].nombre, function(err) {
                            if (err) {
                                console.log(err)
                                return res.status(500).send(err)
                            }
                        })
                    })
                } else if (req.files.imagenes != undefined && req.files.imagenes.length == undefined) {
                    req.files.imagenes.mv(config.PATH_PUBLIC + evento.imagenes[evento.imagenes.length - 1].uri + evento.imagenes[evento.imagenes.length - 1].nombre, function(err) {
                        if (err) {
                            console.log(err)
                            return res.status(500).send(err)
                        }
                    })
                }
            }
            console.log(evento)
            res.status(200).send({ message: 'Datos actualizados' })
        })
    })
}

exports.borrarEvento = (req, res) => {
    Eventos.findOneAndRemove({ 'id': req.body.id }, function(err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ message: 'Problema al borar evento' })
        }
        Avisos.findOneAndRemove({ 'id': req.body.id }, function(err) {
            if (err) {
                console.log(err)
                return res.status(500).send({ message: 'Problema al borar evento' })
            }
            res.status(200).send({ message: 'Evento eliminado' })
        })
    })
}