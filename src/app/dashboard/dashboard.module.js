(function () {
    'use strict';

    /* Module declaration for dashboard components */
    angular
        .module('app.dashboard', [
            'app.core',
            'app.dashboard.layout',
            'app.dashboard.machine',
            'app.dashboard.unit'
        ]);
})();
