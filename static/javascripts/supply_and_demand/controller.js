econGraphsApp.controller('SupplyAndDemandController', function($scope){

    $scope.minPrice = 5;
    $scope.maxPrice = 55;

    $scope.displayOptions = {
        snapToEquilibriumPrice : false
    }

    $scope.marketParams = {
        price : 45,
        tax : 0
    };

    $scope.elasticityControls = {
        demand : 50,
        supply : 60
    }

    $scope.demandParams = {
        level : 40,
        elasticity : ($scope.elasticityControls.demand - 100)/$scope.elasticityControls.demand,
        perfectly_elastic_price : 30
    };

    $scope.supplyParams = {
        level : 60,
        elasticity : (100 - $scope.elasticityControls.supply)/$scope.elasticityControls.supply,
        perfectly_elastic_price : 30
    };

    // Function returning quantity demanded/supplied for a given price, for constant elasticity function Q = A(P/B)^e
    var quantityAtPrice = function(curveParams,price) {
        return curveParams.level * Math.pow(price/curveParams.perfectly_elastic_price,curveParams.elasticity);
    };

    $scope.price_consumers_pay = function(p) { return p*1 + $scope.marketParams.tax*1 };

    $scope.price_firms_receive = function(p) { return p };

    // Function returning quantity demanded at a particular price (inclusive of taxes)
    $scope.quantityDemandedAtPrice = function(p) {
        return quantityAtPrice($scope.demandParams,p);
    };

    // Function returning quantity supplied at a particular price (inclusive of taxes)
    $scope.quantitySuppliedAtPrice = function(p) {
        return quantityAtPrice($scope.supplyParams,p);
    };

    // Function returning surplus at a given market price, given the implied (possibly different) prices consumers pay and firms receive
    $scope.surplusAtPrice = function(p) {
        return $scope.quantitySuppliedAtPrice($scope.price_firms_receive(p)) - $scope.quantityDemandedAtPrice($scope.price_consumers_pay(p));
    };

    // Maximum price at which quantity demanded is greater than or equal to quantity supplied
    $scope.equilibriumPrice = function() {

        var p = $scope.minPrice;
        $scope.equilibriumInRange = true;

        // Return immediately if the lowest price in range causes a surplus
        if ($scope.surplusAtPrice(p) > 0) {
            $scope.equilibriumInRange = false;
            return null;
        }

        // Increase price until the next highest price causes a surplus
        while(p <= $scope.maxPrice) {
            if ($scope.surplusAtPrice(p + 0.01) > 0)
            {
                return p;
            } else {
                p+=0.01;
            }
        }
        $scope.equilibriumInRange = false;
        return null;

    };

    $scope.$watchCollection("elasticityControls",function() {

        $scope.demandParams.elasticity = ($scope.elasticityControls.demand - 100)/$scope.elasticityControls.demand;
        $scope.supplyParams.elasticity = (100 - $scope.elasticityControls.supply)/$scope.elasticityControls.supply;

    })

    // Update graphs when any variables change
    $scope.$watchCollection("displayOptions",function(){ $scope.render() });
    $scope.$watchCollection("marketParams",function(){ $scope.render() });
    $scope.$watchCollection("demandParams",function(){ $scope.render() });
    $scope.$watchCollection("supplyParams",function(){ $scope.render() });

    $scope.render = function(){

        if($scope.displayOptions.snapToEquilibriumPrice) {$scope.marketParams.price = $scope.equilibriumPrice()}

        // Quantity demanded by all consumers at the current price, including tax
        $scope.quantityDemanded = $scope.quantityDemandedAtPrice($scope.marketParams.price*1 + $scope.marketParams.tax*1);

        // Quantity supplied by all firms in the market at the current price
        $scope.quantitySupplied = $scope.quantitySuppliedAtPrice($scope.marketParams.price);

        // Boolean indicating whether the current price results in a surplus
        $scope.surplus = $scope.surplusAtPrice($scope.marketParams.price) > 0 && !$scope.inEquilibrium;

        // Boolean indicating whether the current price results in a shortage
        $scope.shortage = $scope.surplusAtPrice($scope.marketParams.price) < 0 && !$scope.inEquilibrium;

        // Boolean indicating whether the current price is an equilibrium price
        $scope.inEquilibrium = ((Math.abs(($scope.marketParams.price - $scope.equilibriumPrice())/$scope.equilibriumPrice()) < 0.01) && $scope.equilibriumInRange);


        d3.select('svg').remove();
        drawMarketGraph($scope,"graph");

    }
});
