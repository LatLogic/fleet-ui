(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('indicators', indicators);

    /* ngInject */
    function indicators() {

        return {
            getMachineIconClass: getMachineIconClass,
            getUnitIconClass: getUnitIconClass,
            getUnitActiveClass: getUnitActiveClass,
            getUnitLoadClass: getUnitLoadClass
        };

        function getMachineIconClass(machine) {
            if (machine.Metadata.indexOf('role=rds') >= 0) {
                return 'fa fa-database';
            } else if (machine.Metadata.indexOf('role=processing') >= 0) {
                return 'fa fa-cogs';
            }
        }

        function getUnitIconClass(unit) {
            return unit.Unit.endsWith('.timer') ? 'fa fa-clock-o' : 'fa fa-cog';
        }

        function getUnitActiveClass(unit) {
            return unit.Active.toLowerCase();
        }

        function getUnitLoadClass(unit) {
            return unit.Load.toLowerCase();
        }
    }
})();
