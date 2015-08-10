'use strict';

describe('SampleMain controller', function () {

  // load the controller's module
  beforeEach(module('app.sample.layout'));

  var ctrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    ctrl = $controller('SampleMain');
  }));

  it('should set the heading', function () {
    expect(ctrl.heading).toEqual('Front-end Seed Project');
  });
});
