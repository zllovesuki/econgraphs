econGraphsApp.controller('ASADController', function($scope){

    $scope.displayOptions = {
        showPhillipsCurve : false,
        showLaborMarket: false,
        keepInEquilibrium: false
    };

    $scope.macroParams = {
        nominal_wage: 10,
        output: 100,
        price_level: 100,
        ad_shift: 0,
        potential_gdp: 100,
        nairu: 6,
        labor_force_size: 10,
        real_wage: 10,
        unemployment_rate: 6
    };

    $scope.ad_params = function(potential_gdp,ad_shift) {
        return {
            q: parseFloat(potential_gdp) + parseFloat(ad_shift),
            elasticity: -1,
            p: 100
        }
    };

    $scope.sras_params = function(potential_gdp,nominal_wage) {
        return {
            q: potential_gdp,
            elasticity: 1,
            p: 100 + 10*(parseFloat(nominal_wage) - 10)
        }
    };

    $scope.labor_demand_params = {
        q: 100,
        elasticity: -1,
        p: 10
    };

    $scope.labor_supply_params = {
        q: 100,
        elasticity: 1,
        p: 10
    };


    $scope.real_wage = function(nominal_wage,price_level) {
        var deflator = parseFloat(price_level/100);
        return Math.round(100*nominal_wage/deflator)/100;
    };

    $scope.phillipsCurve = function(inflation_rate) {
        var real_wage = $scope.real_wage($scope.macroParams.nominal_wage,inflation_rate + 100);
        return $scope.macroParams.nairu + ($scope.laborSuppliedAtRealWage(real_wage) - $scope.laborDemandedAtRealWage(real_wage))*0.1
    };

    // Function returning quantity of labor demanded at a particular real wage
    $scope.laborDemandedAtRealWage = function(w) {
        return LinearQuantityAtPrice($scope.labor_demand_params,w)
    };

    // Function returning quantity of labor supplied at a particular real wage
    $scope.laborSuppliedAtRealWage = function(w) {
        return LinearQuantityAtPrice($scope.labor_supply_params,w)
    };

    // Maximum price at which quantity demanded is greater than or equal to quantity supplied
    $scope.equilibriumPriceLevel = function() {
        var unrounded_price = LinearEquilibriumPrice(
            $scope.ad_params($scope.macroParams.potential_gdp,$scope.macroParams.ad_shift),
            $scope.sras_params($scope.macroParams.potential_gdp,$scope.macroParams.nominal_wage), 0);
        return Math.round(unrounded_price);
    };

    // Function returning quantity of labor demanded at a particular real wage
    $scope.aggregateDemandAtPriceLevel = function(p) {
        return LinearQuantityAtPrice($scope.ad_params($scope.macroParams.potential_gdp,$scope.macroParams.ad_shift),p)
    };

    // Function returning quantity of labor supplied at a particular real wage
    $scope.aggregateSupplyAtPriceLevel = function(p) {
        return LinearQuantityAtPrice($scope.sras_params($scope.macroParams.potential_gdp,$scope.macroParams.nominal_wage),p)
    };


    // Update graphs when any variables change
    $scope.$watchCollection("displayOptions",function(){ $scope.render() });
    $scope.$watchCollection("macroParams",function(){ $scope.render() });
    window.onresize = function() { $scope.render()};

    $scope.render = function(){

        $scope.macroParams.price_level = $scope.equilibriumPriceLevel();
        $scope.macroParams.real_wage = $scope.real_wage($scope.macroParams.nominal_wage,$scope.macroParams.price_level);
        $scope.macroParams.output = $scope.aggregateDemandAtPriceLevel($scope.macroParams.price_level);
        $scope.macroParams.unemployment_rate = $scope.macroParams.nairu + ($scope.laborSupplied - $scope.laborDemanded)*0.1;
        $scope.macroParams.inflation_rate = $scope.macroParams.price_level - 100;

        // Quantity demanded by all consumers at the current price, including consumer_tax
        $scope.laborDemanded = $scope.laborDemandedAtRealWage($scope.macroParams.real_wage);

        // Quantity supplied by all firms in the market at the current price
        $scope.laborSupplied = $scope.laborSuppliedAtRealWage($scope.macroParams.real_wage);

        // Cheating here
        $scope.surplus = ($scope.macroParams.real_wage > 10);

        //$scope.inEquilibrium = (Math.abs(($scope.marketParams.real_wage - $scope.equilibriumPrice())/$scope.equilibriumPrice()) < 0.01);


        d3.select('svg').remove();
        d3.select('svg').remove();
        d3.select('svg').remove();
        drawASADGraph($scope,"left_graph");
        drawLaborMarketGraph($scope,"center_graph");
        drawPhillipsCurveGraph($scope,"right_graph");

    }
});
