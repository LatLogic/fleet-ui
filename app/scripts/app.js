'use strict';

/**
 * @ngdoc overview
 * @name frontendSeedApp
 * @description
 * # frontendSeedApp
 *
 * Main module of the application.
 */
angular
  .module('frontendSeedApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'scripts/components/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'scripts/components/about/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
