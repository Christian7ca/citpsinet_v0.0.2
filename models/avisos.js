'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Aviso = new Schema({
    id: { type: String, unique: true, required: true },
    autor: { type: String, required: true },
    imagen: { type: String, unique: true, required: true },
    endPoint: { type: String, default: '#' },
    caducidad: { type: String, required: true }
})

module.exports = mongoose.model('Aviso', Aviso)