/**
 * Created by cmakler on 5/12/14.
 */

econGraphsApp.controller('CostCurvesController', function($scope){

    $scope.marketParams = {
        price : 45
    };

    $scope.firmSupplyParams = {
        quantity : 40,
        fixed_cost : 500,
        marginal_cost_parameter : 20, // see definition of cost function below
        linear_vc : 35,
        tertiary_vc : 0.01
    };

    $scope.displayOptions = {
        snapToOptimalQuantity : false,
        showVariableCosts : false
    };


    // Update graphs when any variables change
    $scope.$watchCollection("marketParams",function(){ $scope.render() });
    $scope.$watchCollection("firmSupplyParams",function(){ $scope.render() });
    $scope.$watchCollection("displayOptions",function(){ $scope.render() });
    window.onresize = function() { $scope.render()};

    $scope.render = function(){

        $scope.firmSupplyParams.quadratic_vc = $scope.firmSupplyParams.marginal_cost_parameter*0.01 - 1;

        // Function returning total variable cost of a given quantity
        $scope.variable_cost = function (q) {
            return ($scope.firmSupplyParams.linear_vc * q) + ($scope.firmSupplyParams.quadratic_vc * q * q) + ($scope.firmSupplyParams.tertiary_vc * q * q * q);
        };

        // Current variable cost
        $scope.current_variable_cost = $scope.variable_cost($scope.firmSupplyParams.quantity);

        // Function returning total cost of a given quantity
        $scope.total_cost = function(q) {
            return $scope.firmSupplyParams.fixed_cost*1 + $scope.variable_cost(q); //multiply by 1 so it doesn't do string addition
        };

        // Current total cost
        $scope.current_total_cost = $scope.total_cost($scope.firmSupplyParams.quantity);

        // Function returning total cost of a given quantity
        $scope.total_revenue = function(q) {
            return q * $scope.marketParams.price;
        };

        // Current total revenue
        $scope.current_total_revenue = $scope.total_revenue($scope.firmSupplyParams.quantity);


        // Function returning average variable cost of a given quantity
        $scope.average_variable_cost = function(q) {
            return $scope.variable_cost(q)/q;
        };

        // Current average variable cost
        $scope.current_average_variable_cost = $scope.average_variable_cost($scope.firmSupplyParams.quantity);


        // Function returning average total cost of a given quantity
        $scope.average_total_cost = function(q) {
            return $scope.total_cost(q)/q;
        };

        // Current average total cost
        $scope.current_average_total_cost = $scope.average_total_cost($scope.firmSupplyParams.quantity).round(2);

        // Function returning marginal cost of a given quantity (derivative of variable cost)
        $scope.marginal_cost = function(q) {
            return ($scope.firmSupplyParams.linear_vc) + (2 * $scope.firmSupplyParams.quadratic_vc * q) + (3 * $scope.firmSupplyParams.tertiary_vc * q * q)
        };

        // Current marginal cost
        $scope.current_marginal_cost = $scope.marginal_cost($scope.firmSupplyParams.quantity);

        // Boolean of whether the firm is running a profit or not
        $scope.isProfit = ($scope.current_total_revenue >= $scope.current_total_cost);

        // Profit or loss label
        $scope.profitOrLossLabel = $scope.isProfit ? "Profit" : "Loss";

        // Profit or loss color
        $scope.profitOrLossColor = $scope.isProfit ? profitColor : lossColor;

        // Per-unit profit
        $scope.unitProfitOrLoss = Math.abs($scope.marketParams.price - $scope.current_average_total_cost).toFixed(2);

        // Current profit or loss amount
        $scope.profitOrLoss = ($scope.unitProfitOrLoss * $scope.firmSupplyParams.quantity).toFixed(2);

        // Boolean of whether the firm is breaking even (profit/loss of less than 1% of cost)
        $scope.isBreakingEven = (($scope.profitOrLoss / $scope.current_total_cost) < 0.01);

        // Displayed total cost (rounded ATC*q)
        $scope.displayedTotalCost = $scope.current_average_total_cost * $scope.firmSupplyParams.quantity;

        $scope.optimal_quantity = function() {
            var q = 1;
            while ($scope.marginal_cost(q) > $scope.marginal_cost(q + 1)) {q ++} // increase quantity as long as MC is decreasing
            while ($scope.marginal_cost(q) < $scope.marketParams.price) {q++} // increase quantity as long as MC < P
            if ($scope.average_variable_cost(q) > $scope.marketParams.price) { return 0 } // shut down if P < AVC
            return q;
        };

        if($scope.displayOptions.snapToOptimalQuantity) {
            $scope.firmSupplyParams.quantity = $scope.optimal_quantity();
        }

        $scope.isShutDown = ($scope.firmSupplyParams.quantity == 0);

        //d3.select('svg').remove();
        //d3.select('svg').remove();

        drawTotalCostAndRevenueGraph($scope,"left_graph");
        drawCostCurveGraph($scope,"right_graph");

    }
});