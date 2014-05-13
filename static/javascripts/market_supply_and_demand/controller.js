/**
 * Created by cmakler on 5/12/14.
 */

econGraphsApp.controller('SupplyAndDemandController', function($scope){

    $scope.minPrice = 5;
    $scope.maxPrice = 55;

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

    // Function returning quantity supplied by all firms in the market at a particular price
    $scope.quantitySuppliedAtPrice = function(p) {
        return (10 + p*0.6); // hard coded for now
    }

    // Price at which quantity demanded is close to quantity supplied
    $scope.equilibriumPrice = function() {

        var threshold = 0.05; // how close do the two quantities need to be for the market to be 'in equilibrium?'
        for(var p = $scope.minPrice; p <= $scope.maxPrice; p++) {

            var qd = $scope.quantityDemandedAtPrice(p),
                qs = $scope.quantitySuppliedAtPrice(p),
                percent_difference = Math.abs(qd - qs)/qd;

            if(percent_difference < threshold) {return p}
        }
        return 0;

    }

    // Update graphs when any variables change
    $scope.$watch("price",function(){ $scope.render() });
    $scope.$watch("consumers",function(){ $scope.render() });
    $scope.$watch("income",function(){ $scope.render() });
    $scope.$watch("alpha",function(){ $scope.render() });

    $scope.render = function(){

        // Quantity demanded by an individual at the current price
        $scope.individualQuantityDemanded = $scope.individualQuantityDemandedAtPrice($scope.price);

        // Quantity demanded by all consumers at the current price
        $scope.quantityDemanded = $scope.quantityDemandedAtPrice($scope.price);

        // Quantity demanded by all consumers, as shown in text (rounded)
        $scope.shownQuantityDemanded = Math.round($scope.individualQuantityDemanded*10)*$scope.consumers/10;

        // Quantity supplied by all firms in the market at the current price
        $scope.quantitySupplied = $scope.quantitySuppliedAtPrice($scope.price);

        // Quantity supplied by all firms in the market, as shown in text (multiplied by 1000)
        $scope.shownQuantitySupplied = $scope.quantitySupplied * 1000;

        // Boolean indicating whether the current price results in a surplus
        $scope.surplus = ($scope.price > $scope.equilibriumPrice());

        // Boolean indicating whether the current price results in a shortage
        $scope.shortage = ($scope.price < $scope.equilibriumPrice());

        // Boolean indicating whether the current price is an equilibrium price
        $scope.inEquilibrium = ($scope.price == $scope.equilibriumPrice());


        d3.select('svg').remove();
        d3.select('svg').remove();

        drawIndividualDemandGraph($scope,"left_graph");
        drawMarketGraph($scope,"right_graph");

    }
});