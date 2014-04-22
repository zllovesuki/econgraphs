function drawMarketGraph($scope,id) {

    var market_graph_data = {
        id : "graph2",
        dimensions : {height: 500, width: 500},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: "Quantity (Units)", min: 0, max: 100, ticks: 10},
        y_axis : {title: "Price (Dollars per unit)", min: 0, max: 60, ticks: 10}
    };

    var graph = createGraph(market_graph_data),
        label_delta = 15,
        demandPoints = [],
        supplyPoints = [];

    // Generate points for demand and supply curves
    for(var p = $scope.minPrice; p <= $scope.maxPrice; p += 0.25) {

        var qd = $scope.quantityDemandedAtPrice(p);
        if (graph.x(qd) <= graph.width) { demandPoints.push({ x : graph.x(qd),y : graph.y(p)}) }

        var qs = $scope.quantitySuppliedAtPrice(p);
        if (graph.x(qs) <= graph.width) { supplyPoints.push({ x : graph.x(qs),y : graph.y(p)}) }
    }

    // Draw demand and supply curves
    drawCurve(graph,demandPoints,label_delta,demandColor,"demand");
    drawCurve(graph,supplyPoints.reverse(),label_delta,supplyColor,"supply");

    if($scope.inEquilibrium) {

        // Indicate equilibrium price
        drawHorizontalDropline(graph,"max",$scope.price,equilibriumColor,"price");
        addLabel(graph,"axis",$scope.price,'P','*','',"axisLabel");

        // Indicate equilibrium quantity
        drawVerticalDropline(graph,$scope.quantityDemanded,$scope.price,equilibriumColor,"demand");
        drawDot(graph,$scope.quantityDemanded,$scope.price,equilibriumColor,"demand");
        addLabel(graph,$scope.quantityDemanded,"axis",'Q','*','','axisLabel');

    } else {

        // Indicate price
        drawHorizontalDropline(graph,"max",$scope.price,priceColor,"price");
        addLabel(graph,"axis",$scope.price,'P','','',"axisLabel");

        // Indicate quantity demanded
        drawVerticalDropline(graph,$scope.quantityDemanded,$scope.price,demandColor,"demand");
        drawDot(graph,$scope.quantityDemanded,$scope.price,demandColor,"demand");
        addLabel(graph,$scope.quantityDemanded,"axis",'Q','D','','axisLabel');

        // Indicate quantity supplied
        drawVerticalDropline(graph,$scope.quantitySupplied,$scope.price,supplyColor,"supply");
        drawDot(graph,$scope.quantitySupplied,$scope.price,supplyColor,"supply");
        addLabel(graph,$scope.quantitySupplied,"axis",'Q','S','','axisLabel');

    }

}

