(function() {
    'use strict';

    angular
        .module('app')
        .constant('appConfig', {
            UNIT_REFRESH_DELAY: 5000,  // 5 secs

            MAX_MACHINE_SLOTS: 18,

            // How to identify a unit name as a timer
            IS_TIMER: function(unitName) {
                return unitName.endsWith('.timer')
            },

            // How to identify a unit name as being paired with another (i.e. foo.timer to foo.service)
            IS_PAIRED: function(name1, name2) {
                // TODO maybe this should be based off the "X-Fleet" section "MachineOf" setting
                return name1.split('.').slice(0, -1).join('.') === name2.split('.').slice(0, -1).join('.');
            }
        });
})();
