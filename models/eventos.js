'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Imagenes = new Schema({
    uri: { type: String, default: "/images/avisos/" },
    nombre: { type: String, required: true }
})

const Imagen = new Schema({
    uri: { type: String, default: "/images/avisos/" },
    nombre: { type: String, required: true }
})

const Evento = new Schema({
    id: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    descripcion: { type: String, required: true },
    contacto: { type: String, required: true },
    fecha_inicio: { type: String, required: true },
    fecha_final: { type: String, required: true },
    imagen: [Imagen],
    imagenes: [Imagenes],
})

module.exports = mongoose.model('Evento', Evento)