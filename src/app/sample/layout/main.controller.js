(function () {
    'use strict';

    angular
        .module('app.sample.layout')
        .controller('SampleMain', SampleMain);

    /* @ngInject */
    function SampleMain() {
        var vm = this;
        vm.heading = 'Front-end Seed Project';
    }
})();
