(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    /* ngInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('sample-main', {
                url: '/',
                templateUrl: 'app/sample/layout/main.html',
                controller: 'SampleMain as vm'
            });

        $urlRouterProvider.otherwise('/');
    }
})();
