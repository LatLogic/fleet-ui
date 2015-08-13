// Wrap vendor globals for abstraction from 3rd party libs and testability

/* global _:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('_', _);
})();
