'use strict';

var measuredElasticityAtPrice = function(quantityFunction,p) {
    var quantityAtP = quantityFunction(p),
        quantityOnePercentHigher = quantityFunction(p*1.01);
    return 100*(quantityOnePercentHigher - quantityAtP)/(0.5*quantityAtP + 0.5*quantityOnePercentHigher);
}

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

    it('original price is 45', function() {
      expect(scope.marketParams.price).toEqual(45);
    });

    it('price consumers pay should also be 45', function() {
      expect(scope.price_consumers_pay(45)).toEqual(45);
    });

    it('measured demand elasticity should match specified demand elasticity at any price', function() {
      for(var p=10;p<90;p++){
          expect(Math.round(measuredElasticityAtPrice(scope.quantityDemandedAtPrice,p)*10)).toEqual(Math.round(scope.demandParams.elasticity*10))
      }
    });

    it('measured supply elasticity should match specified supply elasticity at any price', function() {
      for(var p=10;p<90;p++){
          expect(Math.round(measuredElasticityAtPrice(scope.quantitySuppliedAtPrice,p)*20)).toEqual(Math.round(scope.supplyParams.elasticity*20))
      }
    });

  });



});
