(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    /* ngInject */
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider

            // An abstract state for the dashboard place. We must do this to prevent
            // reload on simply a parameter change. The parameters that should prevent
            // reload are listed in the url of the child states.
            // Described here: https://github.com/angular-ui/ui-router/issues/1079
            .state('dashboard-main', {
                url: '/',
                abstract: true,
                templateUrl: 'app/dashboard/layout/main.html',
                controller: 'DashboardMain as vm'
            })

            // Defines the query parameters that can be used in the explore place
            .state('dashboard-main.dashboard-query', {
                url: '?keywords&view',
                data: {
                }
            });

        $urlRouterProvider.otherwise('/');
    }
})();
