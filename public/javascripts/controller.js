// create module for custom directives
var econgraphsApp = angular.module('econgraphsApp', []);

// controller business logic
econgraphsApp.controller('Controller', function($scope){

    $scope.price = 30;

    $scope.consumers = 4000;

    $scope.supply = {
      curveType: "supply",
      intercept: 10, //quantity supplied when price is zero
      slope: 0.6,     //increase in quantity supplied per unit increase in price
      color: supplyColor
    }

    $scope.demand = {
      curveType: "demand",
      intercept: 20, //quantity demanded when price is zero
      slope: -0.2,    //reduction in quantity demanded per unit increase in price
      color: demandColor
    }

    var snapToEquilibriumPrice = function(p,pe) {
        var percent_difference_from_pe = Math.abs(p - pe)/pe;
        if (percent_difference_from_pe < 0.05) {
            return pe
        } else {
            return p
        }
    }

    $scope.$watch("price",function(){ $scope.render() });

    $scope.$watch("consumers",function(){ $scope.render() });


    $scope.render = function(){

        $scope.equilibriumPrice = Math.round(($scope.demand.intercept*$scope.consumers/1000 - $scope.supply.intercept)/($scope.supply.slope - $scope.demand.slope*$scope.consumers/1000));
        $scope.price = snapToEquilibriumPrice($scope.price, $scope.equilibriumPrice);
        $scope.individualQuantityDemanded = quantityAtPrice($scope.price, $scope.demand, 1)
        $scope.quantityDemanded = quantityAtPrice($scope.price, $scope.demand, $scope.consumers/1000)
        $scope.quantitySupplied = quantityAtPrice($scope.price, $scope.supply, 1)

        d3.select('svg').remove();
        d3.select('svg').remove();
        
        x = d3.scale.linear()
            .range([0, width])
            .domain([0, 20]);

        y = d3.scale.linear()
            .range([height, 0])
            .domain([0, 100]);

        var vis1 = drawGraphAxes("#graph1","Quantity (Units)","Price (Dollars per Unit)");
        updateMarketCurves(vis1,$scope,false,true,false);
        updatePrice(vis1,$scope,false,true,false);
        
        x = d3.scale.linear()
            .range([0, width])
            .domain([0, 100]);

        y = d3.scale.linear()
            .range([height, 0])
            .domain([0, 100]);

        var vis2 = drawGraphAxes("#graph2","Quantity (Thousands of Units)","Price (Dollars per Unit)",100,100);
        updateMarketCurves(vis2,$scope,true,true,true);
        updatePrice(vis2,$scope,true,true,true);    

}});

