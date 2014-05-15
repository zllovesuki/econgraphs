function drawIndividualDemandGraph($scope,id) {

    var individual_demand_graph_data = {
        id : id,
        dimensions : {height: 500, width: 500},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: "Quantity (Units)", min: 0, max: 20, ticks: 10},
        y_axis : {title: "Price (Dollars per unit)", min: 0, max: 60, ticks: 10}
    };

    var graph = createGraph(individual_demand_graph_data),
        label_delta = 15,
        points = [],
        minPrice = 5,
        maxPrice = 55;;

    // Generate points for demand curve
    for(var p = minPrice; p <= maxPrice; p += 0.25) {
        var qd = $scope.individualQuantityDemandedAtPrice(p);
        if (graph.x(qd) <= graph.width) { points.push({ x : graph.x(qd),y : graph.y(p)}) }
    }

    // Draw demand curve
    drawCurve(graph,points,label_delta,demandColor,"d");

    // Indicate price
    drawHorizontalDropline(graph,"max",$scope.price,priceColor,"price");
    addLabel(graph,"axis",$scope.price,'P','','',"axisLabel");

    // Indicate quantity demanded
    drawVerticalDropline(graph,$scope.individualQuantityDemanded,$scope.price,demandColor,"demand");
    drawDot(graph,$scope.individualQuantityDemanded,$scope.price,demandColor,"demand");
    addLabel(graph,$scope.individualQuantityDemanded,"axis",'q','d','','axisLabel');

}