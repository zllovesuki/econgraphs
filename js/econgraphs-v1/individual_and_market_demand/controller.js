/**
 * Created by cmakler on 5/12/14.
 */

econGraphsApp.controller('IndividualAndMarketDemandController', function($scope){

    $scope.price = 20;
    $scope.consumers = 4000;
    $scope.income = 400;
    $scope.alpha = 50;

    // Function returning quantity demanded by an individual at a particular price
    $scope.individualQuantityDemandedAtPrice = function(p) {
        return ($scope.income * $scope.alpha) / (p*100);
    }

    // Function returning quantity demanded by all consumers at a particular price
    $scope.quantityDemandedAtPrice = function(p) {
        return $scope.individualQuantityDemandedAtPrice(p)*$scope.consumers/1000; // This number is in thousands
    }

    // Update graphs when any variables change
    $scope.$watch("price",function(){ $scope.render() });
    $scope.$watch("consumers",function(){ $scope.render() });
    $scope.$watch("income",function(){ $scope.render() });
    $scope.$watch("alpha",function(){ $scope.render() });
    window.onresize = function() { $scope.render()};

    $scope.render = function(){

        // Quantity demanded by an individual at the current price
        $scope.individualQuantityDemanded = $scope.individualQuantityDemandedAtPrice($scope.price);

        // Quantity demanded by all consumers at the current price
        $scope.quantityDemanded = $scope.quantityDemandedAtPrice($scope.price);

        // Quantity demanded by all consumers, as shown in text (rounded)
        $scope.shownQuantityDemanded = Math.round($scope.individualQuantityDemanded*10)*$scope.consumers/10;

        d3.select('svg').remove();
        d3.select('svg').remove();

        drawIndividualDemandGraph($scope,"left_graph");
        drawMarketGraph($scope,"right_graph");

    }
});