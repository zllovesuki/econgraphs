// create module for custom directives
var econGraphsApp = angular.module('econGraphsApp', []);

// controller business logic
econGraphsApp.controller('Controller', function($scope){

    $scope.price = 20;
    $scope.consumers = 4000;
    $scope.income = 400;
    $scope.alpha = 50;


    $scope.$watch("price",function(){ $scope.render() });
    $scope.$watch("consumers",function(){ $scope.render() });
    $scope.$watch("income",function(){ $scope.render() });
    $scope.$watch("alpha",function(){ $scope.render() });

    $scope.render = function(){

        $scope.equilibriumPrice = equilibriumPrice($scope);
        $scope.individualQuantityDemanded = quantityDemandedAtPrice($scope.price, $scope, 1);
        $scope.quantityDemanded = $scope.individualQuantityDemanded * $scope.consumers/1000;
        $scope.shownQuantityDemanded = Math.round($scope.individualQuantityDemanded*10)*$scope.consumers/10;
        $scope.quantitySupplied = quantitySuppliedAtPrice($scope.price, $scope, 1)
        $scope.shownQuantitySupplied = $scope.quantitySupplied * 1000;
        

        d3.select('svg').remove();
        d3.select('svg').remove();

        var individual_demand_graph_data = {
            id : "graph1",
            dimensions : {height: 500, width: 500},
            margin : {top: 10, right: 100, bottom: 100, left: 70},
            x_axis : {title: "Quantity (Units)", min: 0, max: 20, ticks: 10},
            y_axis : {title: "Price (Dollars per unit)", min: 0, max: 60, ticks: 10}
        };
        
        var individual_demand_graph = createGraph(individual_demand_graph_data);
        updateMarketCurves(individual_demand_graph,$scope,false,true,false);
        updatePrice(individual_demand_graph,$scope,false,true,false);

        var market_graph_data = {
            id : "graph2",
            dimensions : {height: 500, width: 500},
            margin : {top: 10, right: 100, bottom: 100, left: 70},
            x_axis : {title: "Quantity (Units)", min: 0, max: 100, ticks: 10},
            y_axis : {title: "Price (Dollars per unit)", min: 0, max: 60, ticks: 10}
        };

        var market_graph = createGraph(market_graph_data);
        updateMarketCurves(market_graph,$scope,true,true,true);
        updatePrice(market_graph,$scope,true,true,true);

}});

