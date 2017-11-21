'use strict'

exports.Capitalize = function(str) {
    return str.toLowerCase().replace(/^\w|\s\w/g, function(letter) {
        return letter.toUpperCase();
    })
}