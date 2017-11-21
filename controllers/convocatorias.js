'use strict'

const mongoose = require('mongoose')
const moment = require('moment')
const Avisos = require('./../models/avisos')
const Convocatorias = require('./../models/convocatorias')
const config = require('./../config')
mongoose.Promise = global.Promise

exports.crearConvocatoria = (req, res) => {
    var convocatoria = new Convocatorias
    var idConvocatoria = moment().unix()
    convocatoria.id = idConvocatoria
    convocatoria.autor = req.user.id
    convocatoria.titulo = req.body.nombre
    convocatoria.descripcion = req.body.descripcion
    convocatoria.contacto = req.body.contacto
    convocatoria.fecha_inicio = moment(req.body.inicio).unix()
    convocatoria.fecha_final = moment(req.body.final).unix()
    convocatoria.imagen.push({
        nombre: moment().add(2, 's').unix() + '.' + req.files.imagen.mimetype.split('/')[1]
    })

    if (req.files.imagenes != undefined && req.files.imagenes.length > 1) {
        req.files.imagenes.forEach((imagen, index, array) => {
            convocatoria.imagenes.push({
                nombre: moment().add((index + 1) * 10, 's').unix() + '.' + imagen.mimetype.split('/')[1]
            })
        })
    } else if (req.files.imagenes != undefined && req.files.imagenes.length == undefined) {
        convocatoria.imagenes.push({
            nombre: moment().add(10, 's').unix() + '.' + req.files.imagenes.mimetype.split('/')[1]
        })
    }

    if (req.files.archivos != undefined && req.files.archivos.length > 1) {
        req.files.archivos.forEach((archivo, index, array) => {
            var ext = archivo.mimetype.split('/')[1]
            if (ext == 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
                ext = 'docx'
            } else if (ext == 'msword') {
                ext = 'doc'
            }
            convocatoria.archivos.push({
                nombre: moment().add((index + 1) * 10, 's').unix() + '.' + ext
            })
        })
    } else if (req.files.archivos != undefined && req.files.archivos.length == undefined) {
        var ext = req.files.archivos.mimetype.split('/')[1]
        if (ext == 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
            ext = 'docx'
        } else if (ext == 'msword') {
            ext = 'doc'
        }
        convocatoria.archivos.push({
            nombre: moment().add(7, 's').unix() + '.' + ext
        })
    }

    convocatoria.save()
        .then((convocatoria) => {
            req.files.imagen.mv(config.PATH_PUBLIC + convocatoria.imagen[0].uri + convocatoria.imagen[0].nombre, function(err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send(err)
                }
            })

            if (convocatoria.imagenes.length > 1) {
                req.files.imagenes.forEach((imagen, index, array) => {
                    imagen.mv(config.PATH_PUBLIC + convocatoria.imagenes[index].uri + convocatoria.imagenes[index].nombre, function(err) {
                        if (err) {
                            console.log(err)
                            return res.status(500).send(err)
                        }
                    })
                })
            } else if (convocatoria.imagenes.length == 1) {
                req.files.imagenes.mv(config.PATH_PUBLIC + convocatoria.imagenes[0].uri + convocatoria.imagenes[0].nombre, function(err) {
                    if (err) {
                        console.log(err)
                        return res.status(500).send(err)
                    }
                })
            }

            if (convocatoria.archivos.length > 1) {
                req.files.archivos.forEach((archivo, index, array) => {
                    archivo.mv(config.PATH_PUBLIC + convocatoria.archivos[index].uri + convocatoria.archivos[index].nombre, function(err) {
                        if (err) {
                            console.log(err)
                            return res.status(500).send(err)
                        }
                    })
                })
            } else if (convocatoria.archivos.length == 1) {
                req.files.archivos.mv(config.PATH_PUBLIC + convocatoria.archivos[0].uri + convocatoria.archivos[0].nombre, function(err) {
                    if (err) {
                        console.log(err)
                        return res.status(500).send(err)
                    }
                })
            }
            //console.log(convocatoria)
            // Instanciamos el esquema de los avisos para guardalo en la DB
            var aviso = new Avisos
            aviso.id = idConvocatoria
            aviso.autor = req.user._id
            aviso.imagen = convocatoria.imagen[0].uri + convocatoria.imagen[0].nombre
            aviso.endPoint = `/convocatorias/${idConvocatoria}`
            aviso.caducidad = convocatoria.fecha_final
            aviso.save().then(() => {
                res.status(200).send({ message: 'Convocatoria y Aviso creado.', convocatoria: convocatoria })
            }).catch((err) => {
                console.log(err)
                return res.status(500).send('Convocatoria creado, sin embargo no se pudo crear el aviso para la misma.')
            })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send(err)
        })
}

exports.verConvocatorias = (req, res) => {
    Convocatorias.find()
        .where('fecha_final')
        .gte(moment().unix())
        .exec((err, convocatorias) => {
            if (err) {
                console.log(err)
                return res.status(500).send('Falla al extraer de la Base de datos')
            }
            res.status(200).send(convocatorias)
        })
}

exports.verConvocatoria = (req, res) => {

}

exports.actualizarConvocatoria = (req, res) => {

}

exports.eliminarConvocatoria = (req, res) => {

}