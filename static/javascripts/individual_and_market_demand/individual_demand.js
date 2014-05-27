function drawIndividualDemandGraph($scope,id) {

    var individual_demand_graph_data = {
        id : id,
        dimensions : {height: 500, width: 500},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: "Quantity (Units)", min: 0, max: 20, ticks: 10},
        y_axis : {title: "Price (Dollars per unit)", min: 0, max: 60, ticks: 10}
    };

    var graph = createGraph(individual_demand_graph_data),
        domain = {y: true, min: 5, max: 55, step: 0.25},
        range = {min: 0, max: 20},
        label = {text: "d", delta: 15};

    // Draw market demand curve
    drawFunction($scope.individualQuantityDemandedAtPrice,domain,range,graph,demandColor,label);

    // Indicate price
    drawHorizontalDropline(graph,"max",$scope.price,priceColor,"price");
    addLabel(graph,"axis",$scope.price,'P','','',"axisLabel");

    // Indicate quantity demanded if in range
    if($scope.individualQuantityDemanded >= range.min && $scope.individualQuantityDemanded <= range.max) {
        drawVerticalDropline(graph,$scope.individualQuantityDemanded,$scope.price,demandColor,"demand");
        drawDot(graph,$scope.individualQuantityDemanded,$scope.price,demandColor,"demand");
        addLabel(graph,$scope.individualQuantityDemanded,"axis",'q','d','','axisLabel');
    }


}