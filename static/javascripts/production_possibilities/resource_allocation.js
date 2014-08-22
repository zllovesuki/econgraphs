function drawResourceGraph($scope,id) {

    var resource_graph_data = {
        id : id,
        dimensions : {height: 400, width: 400},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: $scope.resources.units + " producing " + $scope.good_x.name, min: 0, max: 200, ticks: 10},
        y_axis : {title: $scope.resources.units + " producing " + $scope.good_y.name, min: 0, max: 200, ticks: 10}
    };
    
    var graph = createGraph(resource_graph_data),
        domain = {min: 0, max: 200, step: 1},
        range = {min: 0, max: 200},
        label = {text: "Resource Allocation Frontier", reverse: false, delta: -5};

    // Draw demand and supply curves
    drawFunction($scope.resource_frontier,domain,range,graph,demandColor,label);

    var show_resource_allocation = pointInPlottedArea($scope.good_x.resources,$scope.good_y.resources,domain,range),
        on_frontier = ($scope.allocation.percent_resources_used == 100),
        dot_color = on_frontier ? equilibriumColor : demandColor;

    if(show_resource_allocation) {

        drawHorizontalDropline(graph, $scope.good_x.resources, $scope.good_y.resources, dot_color, "price");
        drawVerticalDropline(graph, $scope.good_x.resources, $scope.good_y.resources, dot_color, "price");
        drawDot(graph, $scope.good_x.resources, $scope.good_y.resources, dot_color, "demand");
        addLabel(graph, "axis", $scope.good_y.resources, $scope.resources.name[0], $scope.good_y.name[0], '', "axisLabel");
        addLabel(graph, $scope.good_x.resources, "axis", $scope.resources.name[0], $scope.good_x.name[0], '', 'axisLabel');

    }

}

