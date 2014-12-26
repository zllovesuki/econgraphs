econGraphsApp.controller('ProductionPossibilitiesController', function($scope){

    $scope.resources = {
        name: 'Labor',
        units: 'Workers',
        quantity : 150,
        diminishing_marginal_returns : 0
    };

    $scope.good_x = {
        name: 'Wine',
        units: 'Barrels',
        resources: 75,
        productivity: 2,
        quantity: 150,
        production_function: function (r) {
            return $scope.quantity_produced(r, $scope.good_x.productivity)
        }
    };

    $scope.good_y = {
        name: 'Cloth',
        units: 'Yards',
        resources: 75,
        productivity: 3,
        quantity: 225,
        production_function: function (r) {
            return $scope.quantity_produced(r, $scope.good_y.productivity)
        }
    };

    $scope.allocation = {
        percent_resources_used : 100,
        percent_resources_x : 50
    };

    $scope.displayOptions = {
        show_prod_function : false,
        show_mpl : false
    };

    $scope.quantity_produced = function(resources,productivity) {
        return Math.max(0,productivity * (resources - $scope.resources.diminishing_marginal_returns * resources * resources));
    };

    // inverse of quantity produced
    $scope.resources_used = function(quantity,productivity) {
        if ($scope.resources.diminishing_marginal_returns == 0) {
            return quantity / productivity;
        } else if(quantity == 0) {
            return 0;
        } else {
            var a = productivity*$scope.resources.diminishing_marginal_returns,
                b = productivity * -1,
                c = quantity
            return (-b - Math.sqrt(b * b - (4 * a * c))) / (2 * a);
        }
    };

    $scope.max_possible = function(productivity) {
        return $scope.quantity_produced($scope.resources.quantity, productivity);
    };

    // returns the quantity of resources dedicated to good y, for a given quantity dedicated to good x
    $scope.resource_frontier = function(good_x_resources) {
        if(good_x_resources <= $scope.resources.quantity) {
            return $scope.resources.quantity - good_x_resources;
        }
    };

    // returns the quantity of good y produced, for a given quantity of good y produced
    $scope.production_frontier = function (good_x_quantity) {
        if (good_x_quantity <= $scope.max_possible($scope.good_x.productivity)) {
            var good_x_resources = $scope.resources_used(good_x_quantity,$scope.good_x.productivity),
                good_y_resources = $scope.resource_frontier(good_x_resources);
            return $scope.quantity_produced(good_y_resources,$scope.good_y.productivity);
        }
    };


    // Update graphs when any variables change
    $scope.$watchCollection("displayOptions",function(){ $scope.render() });
    $scope.$watchCollection("allocation",function(){ $scope.render() });
    $scope.$watchCollection("resources", function (){ $scope.render() });
    $scope.$watchCollection("good_x",function(){ $scope.render() });
    $scope.$watchCollection("good_y",function(){ $scope.render() });
    window.onresize = function() { $scope.render()};

    $scope.render = function(){

        // Update resources allocated to goods X and Y
        $scope.good_x.resources = $scope.resources.quantity * ($scope.allocation.percent_resources_used * 0.01) * ($scope.allocation.percent_resources_x * 0.01);
        $scope.good_y.resources = $scope.resources.quantity * ($scope.allocation.percent_resources_used * 0.01) * ((100 - $scope.allocation.percent_resources_x) * 0.01);

        // Determine quantity produced of each good by those resources
        $scope.good_x.quantity = $scope.quantity_produced($scope.good_x.resources,$scope.good_x.productivity);
        $scope.good_y.quantity = $scope.quantity_produced($scope.good_y.resources, $scope.good_y.productivity);

        // Determine the maximum possible quantity of each good
        $scope.good_x.max = $scope.max_possible($scope.good_x.productivity);
        $scope.good_y.max = $scope.max_possible($scope.good_y.productivity);

        d3.select('svg').remove();
        d3.select('svg').remove();
        d3.select('svg').remove();
        d3.select('svg').remove();
        d3.select('svg').remove();
        d3.select('svg').remove();
        drawResourceGraph($scope,"left_graph");
        drawProductionPossibilitiesGraph($scope, "right_graph");
        if($scope.displayOptions.show_prod_function) {
            drawProductionFunctionGraph($scope,"left_2_graph",$scope.good_x)
        }
        if ($scope.displayOptions.show_prod_function) {
            drawProductionFunctionGraph($scope, "right_2_graph", $scope.good_y)
        }

    }
});
