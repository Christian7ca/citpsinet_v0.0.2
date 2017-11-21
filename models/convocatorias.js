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

const Archivos = new Schema({
    uri: { type: String, default: "/files/convocatorias/" },
    nombre: { type: String, required: true }
})

const Convocatoria = new Schema({
    id: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    descripcion: { type: String, required: true },
    contacto: { type: String, required: true },
    fecha_inicio: { type: String, required: true },
    fecha_final: { type: String, required: true },
    imagen: [Imagen],
    imagenes: [Imagenes],
    archivos: [Archivos]
})

module.exports = mongoose.model('Convocatoria', Convocatoria)