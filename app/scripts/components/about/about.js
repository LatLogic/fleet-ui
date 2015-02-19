'use strict';

/**
 * @ngdoc function
 * @name frontendSeedApp.components.about:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the about page
 */
angular.module('frontendSeedApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.today = new Date();
  });
