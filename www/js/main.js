'use strict';

var finish_scorm;

(function(){
var app = angular.module('app.general.controller', []);

  app.controller('mainController', function(serviciosWs){
    console.log('main controller');
    var main = this;
    main.usuario = 'prua';
    main.contrasena = '1234';
    main.webserviceToken = '/wemoocws-portlet/api/secure/jsonws/api/get-token-for-login2';

    main.servicios = JSON.parse(localStorage.getItem("servicios"));
    main.entornos = JSON.parse(localStorage.getItem("entornos"));

    if (!main.entornos){

      main.entornos = [
        {url: 'https://wecorpsepedes.telefonicalearningservices.com', id: 0},
        {url: 'https://wecorpdemo.telefonicalearningservices.com', id: 1},
        {url: 'https://wecorp.telefonicalearningservices.com', id: 2}
      ]

    }
    main.entorno = main.entornos[0];

    if (!main.servicios){

      main.servicios = [
        {id: 0,
        url: '/wemoocws-portlet/api/secure/jsonws/api/get-token-for-login2',
        datos: ['login','password']},
        {id: 1,
        url: '/wemoocws-portlet/api/secure/jsonws/api/get-existing-courses-of-user',
        datos: ['userId']},
        {id: 2,
        url: '/wemoocws-portlet/api/secure/jsonws/api/get-courses-info-bycourse-id',
        datos: ['coursesId']},
        {id: 3,
        url: '/wemoocws-portlet/api/secure/jsonws/api/find-all-in-group',
        datos: ['groupId']},
        {id: 4,
        url: '/wemoocws-portlet/api/secure/jsonws/api/get-module-by-module-id',
        datos: ['moduleId']}
        ]

    }

    main.servicioSeleccionado = main.servicios[0];
    // main.datosInput = ['dato1','dato2'];
    main.datosInput = [];

    serviciosWs.configurar(main.entorno, main.usuario, main.contrasena);

    var funcionOk = function(mensaje){
      main.mensaje = mensaje;
      main.mostrarMensaje = true;
      main.mostrarSpinner = false;
    }
    var funcionError = function(mensaje){
      main.mensaje = mensaje;
      main.mostrarMensaje = true;
      main.mostrarSpinner = false;
    }

    main.configurar = function(){
      main.mostrarSpinner = true;
      serviciosWs.configurar(main.entorno.url, main.usuario, main.contrasena);
      serviciosWs.llamarWs(main.webserviceToken,{'login': main.usuario, 'password': main.contrasena}).then(funcionOk,funcionError);
    };
    main.llamarWs = function(){
      main.mostrarSpinner = true;
      var datoEnviar = {};
      for (var i = 0; i < main.datosInput.length; i++) {
        datoEnviar[main.servicioSeleccionado.datos[i]] = main.datosInput[i];
      }
      serviciosWs.llamarWs(main.servicioSeleccionado.url,datoEnviar).then(funcionOk,funcionError);
    };

    main.nuevoServicio = function(){

      main.servicios.push({
        id: main.servicios.length,
        url: 'url',
        datos: ['dato1','dato2']});

    };
    main.nuevoEntorno = function(){

      main.entornos.push({url: 'entorno', id: main.entornos.length});

    };

    main.borrarServicio = function(index){

      var r = confirm("¿Quieres borrarlo?");
      if (r == true) {
        main.servicios.splice(index,1);
      }

    };
    main.borrarEntorno = function(index){

      var r = confirm("¿Quieres borrarlo?");
      if (r == true) {
        main.entornos.splice(index,1);
      }

    };

    main.volver = function(){
      for (var i = 0; i < main.servicios.length; i++) {
        if((typeof main.servicios[i].datos) === 'string'){
          main.servicios[i].datos = main.servicios[i].datos.split(',');
        }
      }
      main.servicioSeleccionado = main.servicios[0];
      main.anadiendoLlamadas = false;
      main.anadiendoEntorno = false;

      localStorage.setItem("servicios", JSON.stringify(main.servicios));
      localStorage.setItem("entornos", JSON.stringify(main.entornos));

    };



  });

  app.service('serviciosWs',function($http,$q){

    var ENTORNO;
    var USUARIO;
    var CONTRASENA;
    var BASEAUTH;

    this.configurar = function(entorno,usuario,contrasena){
        ENTORNO = entorno;
        USUARIO = usuario;
        CONTRASENA = contrasena;
        BASEAUTH = 'Basic ' + $.base64.encode(usuario + ':' + contrasena);
    };

    this.llamarWs = function(url,datos){

      var q = $q.defer();
      var urlPeticion = ENTORNO + url;


      $http({
          url: urlPeticion,
          method: 'POST',
          withCredentials: true,
          timeout: 50000,
          headers: {
              'cache-control': 'no-cache, private, no-store, must-revalidate',
              'Authorization': BASEAUTH,
              'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
          },
          dataType : 'json', // Para esto es un XML!
          data: $.param(datos)
      }).then(function (data) {
        q.resolve(data);
      }, function (error) {
          q.reject(error);
      });

      return q.promise;
    }

  });

})();
