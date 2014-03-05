// create module for custom directives
var econgraphsApp = angular.module('econgraphsApp', []);

// controller business logic
econgraphsApp.controller('Controller', function($scope){

    $scope.price = 25;

    $scope.supply = {
      curveType: "supply",
      intercept: 10, //quantity supplied when price is zero
      slope: 0.6,     //increase in quantity supplied per unit increase in price
      color: supplyColor
    }

    $scope.demand = {
      curveType: "demand",
      intercept: 80, //quantity demanded when price is zero
      slope: -0.4,    //reduction in quantity demanded per unit increase in price
      color: demandColor
    }
    
    $scope.$watch("price",function(){
        d3.select('svg').remove();
        var vis = drawGraphAxes("#graph");
        update(vis,$scope);    

})});

