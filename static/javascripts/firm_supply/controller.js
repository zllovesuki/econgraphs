/**
 * Created by cmakler on 5/12/14.
 */

econGraphsApp.controller('FirmSupplyController', function($scope){

    $scope.price = 45;
    $scope.quantity = 40;
    $scope.fixed_cost = 500;
    $scope.marginal_cost_parameter = 20; // see definition of cost function below

    $scope.linear_vc = 35;
    $scope.tertiary_vc = 0.01;


    // Update graphs when any variables change
    $scope.$watch("price",function(){ $scope.render() });
    $scope.$watch("quantity",function(){ $scope.render() });
    $scope.$watch("fixed_cost",function(){ $scope.render() });
    $scope.$watch("marginal_cost_parameter",function(){ $scope.render() });

    $scope.render = function(){

        $scope.quadratic_vc = $scope.marginal_cost_parameter*0.01 - 1;

        // Function returning total variable cost of a given quantity
        $scope.variable_cost = function(q) {
            return ($scope.linear_vc * q) + ($scope.quadratic_vc * q * q) + ($scope.tertiary_vc * q * q * q);
        }

        // Current variable cost
        $scope.current_variable_cost = $scope.variable_cost($scope.quantity);

        // Function returning total cost of a given quantity
        $scope.total_cost = function(q) {
            return $scope.fixed_cost*1 + $scope.variable_cost(q);
        }

        // Current total cost
        $scope.current_total_cost = $scope.total_cost($scope.quantity);

        // Function returning total cost of a given quantity
        $scope.total_revenue = function(q) {
            return q * $scope.price;
        }

        // Current total revenue
        $scope.current_total_revenue = $scope.total_revenue($scope.quantity);


        // Function returning average variable cost of a given quantity
        $scope.average_variable_cost = function(q) {
            return $scope.variable_cost(q)/q;
        }

        // Current average variable cost
        $scope.current_average_variable_cost = $scope.average_variable_cost($scope.quantity);


        // Function returning average total cost of a given quantity
        $scope.average_total_cost = function(q) {
            return $scope.total_cost(q)/q;
        }

        // Current average total cost
        $scope.current_average_total_cost = $scope.average_total_cost($scope.quantity).round(2);

        // Function returning marginal cost of a given quantity (derivative of variable cost)
        $scope.marginal_cost = function(q) {
            return ($scope.linear_vc) + (2 * $scope.quadratic_vc * q) + (3 * $scope.tertiary_vc * q * q)
        }

        // Current marginal cost
        $scope.current_marginal_cost = $scope.marginal_cost($scope.quantity);

        // Boolean of whether the firm is running a profit or not
        $scope.isProfit = ($scope.current_total_revenue >= $scope.current_total_cost);

        // Profit or loss label
        $scope.profitOrLossLabel = $scope.isProfit ? "Profit" : "Loss";

        // Profit or loss color
        $scope.profitOrLossColor = $scope.isProfit ? profitColor : lossColor;

        // Per-unit profit
        $scope.unitProfitOrLoss = Math.abs($scope.price - $scope.current_average_total_cost)

        // Current profit or loss amount
        $scope.profitOrLoss = ($scope.unitProfitOrLoss * $scope.quantity).toFixed(2);

        // Boolean of whether the firm is breaking even (profit/loss of less than 1% of cost)
        $scope.isBreakingEven = ($scope.profitOrLoss / $scope.current_total_cost) < 0.01

        // Displayed total cost (rounded ATC*q)
        $scope.displayedTotalCost = $scope.current_average_total_cost * $scope.quantity

        d3.select('svg').remove();
        d3.select('svg').remove();

        drawTotalCostAndRevenueGraph($scope,"left_graph");
        drawCostCurveGraph($scope,"right_graph");

    }
});