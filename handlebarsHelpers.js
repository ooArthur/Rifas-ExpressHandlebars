const Handlebars = require('handlebars');

// Helper para comparar se dois valores são iguais
Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});

// Helper para gerar uma range de números
Handlebars.registerHelper('range', function(start, end) {
    var array = [];
    for (var i = start; i <= end; i++) {
        array.push(i);
    }
    return array;
});

// Helper para verificar se um bilhete está disponível
Handlebars.registerHelper('isAvailable', function(billet, bilhetes) {
    for (var i = 0; i < bilhetes.length; i++) {
        if (bilhetes[i].numeroBilhete === billet) {
            return false;
        }
    }
    return true;
});

module.exports = Handlebars;