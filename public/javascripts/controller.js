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

    $scope.equilibriumPrice = ($scope.demand.intercept - $scope.supply.intercept)/($scope.supply.slope - $scope.demand.slope);

    var snapToEquilibriumPrice = function(p,pe) {
        var percent_difference_from_pe = Math.abs(p - pe)/pe;
        if (percent_difference_from_pe < 0.05) {
            return pe
        } else {
            return p
        }
    }

    $scope.$watch("price",function(){ $scope.render() });

    $scope.render = function(){

        $scope.price = snapToEquilibriumPrice($scope.price, $scope.equilibriumPrice);
        $scope.quantityDemanded = quantityAtPrice($scope.price, $scope.demand)
        $scope.quantitySupplied = quantityAtPrice($scope.price, $scope.supply)

        d3.select('svg').remove();
        d3.select('svg').remove();
        var vis1 = drawGraphAxes("#graph1");
        updateMarketCurves(vis1,$scope);
        updatePrice(vis1,$scope);
        var vis2 = drawGraphAxes("#graph2");
        updateMarketCurves(vis2,$scope);
        updatePrice(vis2,$scope);    

}});

