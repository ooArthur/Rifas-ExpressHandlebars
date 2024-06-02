const Handlebars = require('handlebars');

Handlebars.registerHelper('range', function(start, end) {
    var array = [];
    for (var i = start; i <= end; i++) {
        array.push(i);
    }
    return array;
});

Handlebars.registerHelper('isAvailable', function(billet, bilhetes) {
    for (var i = 0; i < bilhetes.length; i++) {
        if (bilhetes[i].numeroBilhete === billet) {
            return false;
        }
    }
    return true;
});

module.exports = Handlebars;