function drawProductionPossibilitiesGraph($scope,id) {

    var ppf_graph_data = {
        id : id,
        dimensions : {height: 400, width: 400},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: $scope.good_x.name + " Produced (" + $scope.good_x.units + ")", min: 0, max: 500, ticks: 10},
        y_axis : {title: $scope.good_y.name + " Produced (" + $scope.good_y.units + ")", min: 0, max: 500, ticks: 10}
    };
    
    var graph = createGraph(ppf_graph_data),
        domain = {min: 0, max: 500, step: 1},
        range = {min: 0, max: 500},
        label = {text: "Production Possibilities Frontier", reverse: false, delta: -5};

    // Draw demand and supply curves
    drawFunction($scope.production_frontier,domain,range,graph,demandColor,label);

    var show_resource_allocation = pointInPlottedArea($scope.good_x.quantity,$scope.good_y.quantity,domain,range),
        on_frontier = ($scope.allocation.percent_resources_used == 100),
        dot_color = on_frontier ? equilibriumColor : demandColor;

    if(show_resource_allocation) {

        drawHorizontalDropline(graph, $scope.good_x.quantity, $scope.good_y.quantity, dot_color, "price");
        drawVerticalDropline(graph, $scope.good_x.quantity, $scope.good_y.quantity, dot_color, "price");
        drawDot(graph, $scope.good_x.quantity, $scope.good_y.quantity, dot_color, "demand");
        addLabel(graph, "axis", $scope.good_y.quantity, 'Q', $scope.good_y.name[0], '', "axisLabel");
        addLabel(graph, $scope.good_x.quantity, "axis", 'Q', $scope.good_x.name[0], '', 'axisLabel');

    }

}

