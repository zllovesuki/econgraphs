function drawMarketDemandGraph($scope,id) {

    var market_graph_data = {
        id : id,
        dimensions : {height: 500, width: 500},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: "Quantity (Thousands of Units)", min: 0, max: 100, ticks: 10},
        y_axis : {title: "Price (Dollars per Unit)", min: 0, max: 60, ticks: 10}
    };

    var graph = createGraph(market_graph_data),
        domain = {y: true, min: 5, max: 55, step: 0.25},
        range = {min: 0, max: 100},
        label = {text: "D", delta: 15};

    // Draw market demand curve
    drawFunction($scope.quantityDemandedAtPrice,domain,range,graph,demandColor,label);

    // Indicate price
    drawHorizontalDropline(graph,"max",$scope.price,priceColor,"price");
    addLabel(graph,"axis",$scope.price,'P','','',"axisLabel");

    // Indicate quantity demanded if in range
    if($scope.quantityDemanded >= range.min && $scope.quantityDemanded <= range.max) {
        drawVerticalDropline(graph,$scope.quantityDemanded,$scope.price,demandColor,"demand");
        drawDot(graph,$scope.quantityDemanded,$scope.price,demandColor,"demand");
        addLabel(graph,$scope.quantityDemanded,"axis",'Q','D','','axisLabel');
    }

}

