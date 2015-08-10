/**
 * Core module.
 *
 * This module includes all core dependencies.
 * @namespace core
 */
(function() {
    'use strict';

    angular
        .module('app.core', [

            // Angular modules
            'ngAnimate',
            'ngSanitize',
            'ngRoute',

            // Cross-app modules

            // 3rd-party modules
            'ui.router'
        ]);
})();
