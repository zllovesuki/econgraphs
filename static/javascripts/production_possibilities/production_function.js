function drawProductionFunctionGraph($scope, id, good_data) {

    var good_initial = good_data.name[0],
        production_function_label = good_data.productivity + 'L' + good_initial;

    if($scope.resources.diminishing_marginal_returns > 0) {
        production_function_label += ' - ' + Math.round($scope.resources.diminishing_marginal_returns*10000) + '(.01L' + good_initial + ')^2'
    }

    var production_graph_data = {
        id: id,
        dimensions: {height: 300, width: 400},
        margin: {top: 10, right: 80, bottom: 100, left: 70},
        x_axis: {title:'Labor Producing ' + good_data.name, min: 0, max: 200, ticks: 10},
        y_axis: {title: good_data.name + " Produced (" + good_data.units + ")", min: 0, max: 500, ticks: 10}
    };

    var graph = createGraph(production_graph_data),
        domain = {min: 0, max: 200, step: 1},
        range = {min: 0, max: 500},
        label = {text: production_function_label, reverse: true, delta: -5};

    // Draw demand and supply curves
    drawFunction(good_data.production_function, domain, range, graph, demandColor, label);

    var show_resource_allocation = pointInPlottedArea(good_data.resources, good_data.quantity, domain, range),
        on_frontier = ($scope.allocation.percent_resources_used == 100),
        dot_color = on_frontier ? equilibriumColor : demandColor;

    if (show_resource_allocation) {

        drawHorizontalDropline(graph, good_data.resources, good_data.quantity, dot_color, "price");
        drawVerticalDropline(graph, good_data.resources, good_data.quantity, dot_color, "price");
        drawDot(graph, good_data.resources, good_data.quantity, dot_color, "demand");
        addLabel(graph, "axis", good_data.quantity, 'Q', good_data.name[0], '', "axisLabel");
        addLabel(graph, good_data.resources, "axis", $scope.resources.name[0], good_data.name[0], '', 'axisLabel');

    }

}

