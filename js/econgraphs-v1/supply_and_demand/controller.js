econGraphsApp.controller('SupplyAndDemandController', function($scope){

    $scope.displayOptions = {
        snapToEquilibriumPrice : false,
        curveType : "Constant Elasticity",
        showDemand: true,
        showSupply: true
    };

    $scope.marketParams = {
        price : 45,
        tax_rate : 0,
        consumer_fraction : 100
    };

    $scope.elasticityControls = {
        demand : 50,
        supply : 60
    }

    $scope.perfectly_inelastic_demand = function() {return ($scope.elasticityControls.demand == 100)};
    $scope.perfectly_inelastic_supply = function() {return ($scope.elasticityControls.supply == 100)};


    $scope.display_demand_elasticity = function() {
        if($scope.perfectly_inelastic_demand()) { return "Perfectly Inelastic"}
        else return Math.round($scope.demandParams.elasticity*100)/100;
    }

    $scope.display_supply_elasticity = function() {
        if($scope.perfectly_inelastic_supply()) {return "Perfectly Inelastic"}
        else return Math.round($scope.supplyParams.elasticity*100)/100;
    }

    $scope.demandParams = {
        q : 40,
        elasticity : ($scope.elasticityControls.demand - 100)/$scope.elasticityControls.demand,
        p : 30
    };


    $scope.supplyParams = {
        q : 60,
        elasticity : (100 - $scope.elasticityControls.supply)/$scope.elasticityControls.supply,
        p : 30
    };

    // Function returning market price plus tax paid by consumers
    $scope.price_consumers_pay = function(p) { return p*(1 + $scope.marketParams.tax_rate*.01) };

    // Function returning market price minus tax paid by firms
    $scope.price_firms_receive = function(p) { return p };

    // Function returning quantity demanded at a particular price (inclusive of taxes)
    $scope.quantityDemandedAtPrice = function(p) {
        if($scope.displayOptions.curveType == "Linear") {
            return LinearQuantityAtPrice($scope.demandParams,p);
        } else {
            return CE_QuantityAtPrice($scope.demandParams,p);
        }
    };

    // Function returning quantity supplied at a particular price (inclusive of taxes)
    $scope.quantitySuppliedAtPrice = function(p) {
        if($scope.displayOptions.curveType == "Linear") {
            return LinearQuantityAtPrice($scope.supplyParams,p);
        } else {
            return CE_QuantityAtPrice($scope.supplyParams,p);
        }
    };

    // Function returning surplus at a given market price, given the implied (possibly different) prices consumers pay and firms receive
    $scope.surplusAtPrice = function(p) {
        return $scope.quantitySuppliedAtPrice($scope.price_firms_receive(p)) - $scope.quantityDemandedAtPrice($scope.price_consumers_pay(p));
    };

    // Maximum price at which quantity demanded is greater than or equal to quantity supplied
    $scope.equilibriumPrice = function() {
        if ($scope.displayOptions.curveType == "Linear") {
            return LinearEquilibriumPrice($scope.demandParams, $scope.supplyParams, $scope.marketParams.tax_rate)
        } else {
            return CE_EquilibriumPrice($scope.demandParams, $scope.supplyParams, $scope.marketParams.tax_rate)
        }
        ;
    }

        /*function() {

        var p = 0;

        // Return immediately if the lowest price in range causes a surplus
        if ($scope.surplusAtPrice(p) > 0) {
            return null;
        }

        // Increase price until the next highest price causes a surplus
        while(p <= 55) {
            if ($scope.surplusAtPrice(p + 0.01) > 0)
            {
                return p;
            } else {
                p+=0.01;
            }
        }
        return null;

    };*/

    $scope.$watchCollection("elasticityControls",function() {

        $scope.demandParams.elasticity = ($scope.elasticityControls.demand - 100)/$scope.elasticityControls.demand;
        $scope.supplyParams.elasticity = (100 - $scope.elasticityControls.supply)/$scope.elasticityControls.supply;

    })

    // Update graphs when any variables change
    $scope.$watchCollection("displayOptions",function(){ $scope.render() });
    $scope.$watchCollection("marketParams",function(){ $scope.render() });
    $scope.$watchCollection("demandParams",function(){ $scope.render() });
    $scope.$watchCollection("supplyParams",function(){ $scope.render() });
    window.onresize = function() { $scope.render()};

    $scope.render = function(){

        if($scope.displayOptions.snapToEquilibriumPrice) {$scope.marketParams.price = $scope.equilibriumPrice()}

        // Quantity demanded by all consumers at the current price, including consumer_tax
        $scope.quantityDemanded = $scope.quantityDemandedAtPrice($scope.price_consumers_pay($scope.marketParams.price));

        // Quantity supplied by all firms in the market at the current price
        $scope.quantitySupplied = $scope.quantitySuppliedAtPrice($scope.marketParams.price);

        // Boolean indicating whether the current price results in a surplus
        $scope.surplus = $scope.surplusAtPrice($scope.marketParams.price) > 0 && !$scope.inEquilibrium;

        // Boolean indicating whether the current price results in a shortage
        $scope.shortage = $scope.surplusAtPrice($scope.marketParams.price) < 0 && !$scope.inEquilibrium;

        // Boolean indicating whether the current price is an equilibrium price
        $scope.inEquilibrium = (Math.abs(($scope.marketParams.price - $scope.equilibriumPrice())/$scope.equilibriumPrice()) < 0.01);


        d3.select('svg').remove();
        drawMarketGraph($scope,"graph");

    }
});
