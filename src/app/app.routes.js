(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    /* ngInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard-main', {
                url: '/',
                templateUrl: 'app/dashboard/layout/main.html',
                controller: 'DashboardMain as vm'
            });

        $urlRouterProvider.otherwise('/');
    }
})();
