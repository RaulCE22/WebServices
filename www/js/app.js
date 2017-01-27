
'use strict';

(function(){
var app = angular.module('Ficheros', ['ngRoute','app.general.controller','jsonFormatter']);

app.run(function (){

  console.log('Angular cargado');

})
app.config(function($routeProvider) {
    //console.log('Iniciando angular config ...');
    /* Routing */
    $routeProvider
            .when('/', {
                controller: 'mainController as main',
                templateUrl: 'main.html'
            })
            .otherwise({ redirectTo: '/'});
})

})();
