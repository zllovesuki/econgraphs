'use strict';

describe('Testing is occurring', function() {
    it('should perform a test', function() {
      expect(true).toEqual(true);
    });
})

/* jasmine specs for controllers go here */
describe('Supply and Demand', function() {

  beforeEach(module('econGraphsApp'));

  describe('Controller', function(){
    var scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('SupplyAndDemandController', {$scope: scope});
    }));

    it('should see that the original price is 45', function() {
      expect(scope.marketParams.price).toEqual(45);
    });

  });



});
