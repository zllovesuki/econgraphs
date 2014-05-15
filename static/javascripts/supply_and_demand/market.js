function drawMarketGraph($scope,id) {

    var market_graph_data = {
        id : id,
        dimensions : {height: 500, width: 800},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: "Quantity (Thousands of Units)", min: 0, max: 200, ticks: 10},
        y_axis : {title: "Price (Dollars per Unit)", min: 0, max: 60, ticks: 10}
    };
    
    var price = $scope.marketParams.price,
        price_consumers_pay = $scope.price_consumers_pay(price),
        price_firms_receive = $scope.price_firms_receive(price)

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
    drawCurve(graph,demandPoints,label_delta,demandColor,"D");
    drawCurve(graph,supplyPoints.reverse(),label_delta,supplyColor,"S");

    if($scope.inEquilibrium) {

        // Indicate equilibrium price
        drawHorizontalDropline(graph,"max",price,equilibriumColor,"price");
        addLabel(graph,"axis",price,'P','*','',"axisLabel");

        // Indicate price consumers pay, if tax > 0
        if($scope.marketParams.tax > 0) {
            drawHorizontalDropline(graph,"max",price_consumers_pay,equilibriumColor,"price");
            addLabel(graph,"axis",price_consumers_pay,'P','C','',"axisLabel");
        }
        drawHorizontalDropline(graph,"max",price,equilibriumColor,"price");


        // Indicate equilibrium quantity
        drawVerticalDropline(graph,$scope.quantityDemanded,price_consumers_pay,equilibriumColor,"demand");
        drawDot(graph,$scope.quantityDemanded,price_consumers_pay,equilibriumColor,"demand");
        drawDot(graph,$scope.quantityDemanded,price,equilibriumColor,"supply");
        addLabel(graph,$scope.quantityDemanded,"axis",'Q','*','','axisLabel');

    } else if($scope.equilibriumInRange) {

        // Indicate price
        drawHorizontalDropline(graph,"max",price,priceColor,"price");
        addLabel(graph,"axis",price,'P','','',"axisLabel");

        // Indicate price consumers pay, if tax > 0
        if($scope.marketParams.tax > 0) {
            drawHorizontalDropline(graph,"max",price_consumers_pay,priceColor,"price");
            addLabel(graph,"axis",price_consumers_pay,'P','C','',"axisLabel");
        }

        // Indicate quantity demanded
        drawVerticalDropline(graph,$scope.quantityDemanded,price_consumers_pay,demandColor,"demand");
        drawDot(graph,$scope.quantityDemanded,price_consumers_pay,demandColor,"demand");
        addLabel(graph,$scope.quantityDemanded,"axis",'Q','D','','axisLabel');

        // Indicate quantity supplied
        drawVerticalDropline(graph,$scope.quantitySupplied,price,supplyColor,"supply");
        drawDot(graph,$scope.quantitySupplied,price,supplyColor,"supply");
        addLabel(graph,$scope.quantitySupplied,"axis",'Q','S','','axisLabel');

        // Indicate shortage or surplus
        drawSegment(graph,$scope.quantitySupplied,3,$scope.quantityDemanded,3,priceColor,"surplusOrShortage",($scope.surplus? "Surplus" : "Shortage"),0,15,"Middle")

    }

}

