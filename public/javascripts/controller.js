// create module for custom directives
var econgraphsApp = angular.module('econgraphsApp', []);

// controller business logic
econgraphsApp.controller('Controller', function($scope){

    $scope.price = 30;
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
        $scope.shownQuantityDemanded = Math.round($scope.individualQuantityDemanded*10,0)*$scope.consumers/10;
        $scope.quantitySupplied = quantitySuppliedAtPrice($scope.price, $scope, 1)
        $scope.shownQuantitySupplied = $scope.quantitySupplied * 1000;
        

        d3.select('svg').remove();
        d3.select('svg').remove();
        
        x = d3.scale.linear()
            .range([0, width])
            .domain([0, 20]);

        y = d3.scale.linear()
            .range([height, 0])
            .domain([0, 60]);

        var vis1 = drawGraphAxes("#graph1","Quantity (Units)","Price (Dollars per Unit)");
        updateMarketCurves(vis1,$scope,false,true,false);
        updatePrice(vis1,$scope,false,true,false);
        
        x = d3.scale.linear()
            .range([0, width])
            .domain([0, 100]);

        y = d3.scale.linear()
            .range([height, 0])
            .domain([0, 60]);

        var vis2 = drawGraphAxes("#graph2","Quantity (Thousands of Units)","Price (Dollars per Unit)",100,100);
        updateMarketCurves(vis2,$scope,true,true,true);
        updatePrice(vis2,$scope,true,true,true);

}});

