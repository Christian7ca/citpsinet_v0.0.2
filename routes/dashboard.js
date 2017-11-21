'use strict'

const express = require('express')
const dashboard = express.Router()
const uploadFiles = require('express-fileupload')
const config = require('./../config')
const helper = require('./../helpers/helpers')
const moment = require('moment')
const auth = require('./../auth/passport')
const controller = require('./../controllers/usuarios')
const Evento = require('./../controllers/eventos')
const Aviso = require('./../controllers/avisos')
const Convocatorias = require('./../controllers/convocatorias')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

dashboard.get('/', auth.Authenticated, auth.webMaster, (req, res) => {
    res.render('dashboard/template-dashboard', {
        titulo: "Dashboard",
        primerNombre: helper.Capitalize(req.user.primerNombre),
        apellidoPaterno: helper.Capitalize(req.user.apellidoPaterno),
        notificaciones: req.user.notificaciones.length
    })
})

/**
 * Endpoints de la sección Gestión de Eventos
 */

dashboard.get('/gestionar_eventos', auth.Authenticated, auth.webMaster, (req, res) => {
    res.render('dashboard/gestionar_eventos', {
        titulo: "Gestionar Eventos - Dashboard",
        primerNombre: helper.Capitalize(req.user.primerNombre),
        apellidoPaterno: helper.Capitalize(req.user.apellidoPaterno),
        notificaciones: req.user.notificaciones.length
    })
})

dashboard.post('/gestionar_eventos/new', auth.Authenticated, auth.webMaster, uploadFiles({ safeFileNames: true }), Evento.crearEvento)

dashboard.post('/gestionar_eventos/showEvents', auth.Authenticated, auth.webMaster, Evento.verEventos)

dashboard.post('/gestionar_eventos/getEventInfo', auth.Authenticated, auth.webMaster, Evento.verEvento)

dashboard.put('/gestionar_eventos/updateEvent', auth.Authenticated, auth.webMaster, uploadFiles({ safeFileNames: true }), Evento.actualizarEvento)

dashboard.delete('/gestionar_eventos/deleteEvent', auth.Authenticated, auth.webMaster, Evento.borrarEvento)


/**
 * Endpoints de la sección Gestion de Avios
 */

dashboard.get('/gestionar_avisos', auth.Authenticated, auth.webMaster, (req, res) => {
    res.render('dashboard/gestionar_avisos', {
        titulo: "Gestionar Avisos - Dashboard",
        primerNombre: helper.Capitalize(req.user.primerNombre),
        apellidoPaterno: helper.Capitalize(req.user.apellidoPaterno),
        notificaciones: req.user.notificaciones.length
    })
})

dashboard.post('/gestionar_avisos/newNotice', auth.Authenticated, auth.webMaster, uploadFiles({ safeFileNames: true }), Aviso.crearAviso)

dashboard.post('/gestionar_avisos/showNotices', auth.Authenticated, auth.webMaster, Aviso.verAvisos)

dashboard.delete('/gestionar_avisos/deleteNotice', auth.Authenticated, auth.webMaster, Aviso.borrarAviso)

dashboard.get('/logout', auth.Authenticated, controller.logout)


/**
 * Endpoints de la sección Gestion de Avios
 */

dashboard.get('/gestionar_convocatorias', auth.Authenticated, auth.webMaster, (req, res) => {
    res.render('dashboard/gestionar_convocatorias', {
        titulo: "Gestionar Convocaotrias - Dashboard",
        primerNombre: helper.Capitalize(req.user.primerNombre),
        apellidoPaterno: helper.Capitalize(req.user.apellidoPaterno),
        notificaciones: req.user.notificaciones.length
    })
})

dashboard.post('/gestionar_convocatorias/newAnnouncement', auth.Authenticated, auth.webMaster, uploadFiles({ safeFileNames: true }), Convocatorias.crearConvocatoria)

dashboard.post('/gestionar_convocatorias/updateAnnouncement', auth.Authenticated, auth.webMaster, uploadFiles({ safeFileNames: true }), Convocatorias.actualizarConvocatoria)

dashboard.post('/gestionar_convocatorias/showAnnouncements', auth.Authenticated, auth.webMaster, Convocatorias.verConvocatorias)

dashboard.post('/gestionar_convocatorias/showAnnouncement', auth.Authenticated, auth.webMaster, Convocatorias.verConvocatoria)

dashboard.post('/gestionar_convocatorias/deleteAnnouncement', auth.Authenticated, auth.webMaster, Convocatorias.eliminarConvocatoria)


module.exports = dashboard