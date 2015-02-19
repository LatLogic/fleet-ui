'use strict';

/**
 * @ngdoc function
 * @name frontendSeedApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendSeedApp
 */
angular.module('frontendSeedApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
