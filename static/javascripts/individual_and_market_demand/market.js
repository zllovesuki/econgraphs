function drawMarketGraph($scope,id) {

    var market_graph_data = {
        id : id,
        dimensions : {height: 500, width: 500},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: "Quantity (Thousands of Units)", min: 0, max: 100, ticks: 10},
        y_axis : {title: "Price (Dollars per Unit)", min: 0, max: 60, ticks: 10}
    };

    var graph = createGraph(market_graph_data),
        label_delta = 15,
        demandPoints = [];

    // Generate points for demand and supply curves
    for(var p = $scope.minPrice; p <= $scope.maxPrice; p += 0.25) {

        var qd = $scope.quantityDemandedAtPrice(p);
        if (graph.x(qd) <= graph.width) { demandPoints.push({ x : graph.x(qd),y : graph.y(p)}) }

    }

    // Draw market demand curve
    drawCurve(graph,demandPoints,label_delta,demandColor,"D");

    // Indicate price
    drawHorizontalDropline(graph,"max",$scope.price,priceColor,"price");
    addLabel(graph,"axis",$scope.price,'P','','',"axisLabel");

    // Indicate quantity demanded
    drawVerticalDropline(graph,$scope.quantityDemanded,$scope.price,demandColor,"demand");
    drawDot(graph,$scope.quantityDemanded,$scope.price,demandColor,"demand");
    addLabel(graph,$scope.quantityDemanded,"axis",'Q','D','','axisLabel');

}

