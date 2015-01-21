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
        domain = {y: true, min: 0, max: 55, step: 0.25},
        range = {min: 0, max: 195},
        supplyLabel = {text: "S", reverse: true, delta: 15},
        demandLabel = {text: "D", reverse: true, delta: 5},
        showDemand = $scope.displayOptions.showDemand,
        showSupply = $scope.displayOptions.showSupply;

    // Draw demand and supply curves
    if(showDemand) {drawFunction($scope.quantityDemandedAtPrice,domain,range,graph,demandColor,demandLabel)}
    if(showSupply) {drawFunction($scope.quantitySuppliedAtPrice,domain,range,graph,supplyColor,supplyLabel)};

    var show_demand_point = (showDemand && pointInPlottedArea(price_consumers_pay,$scope.quantityDemanded,domain,range)),
        show_supply_point = (showSupply && pointInPlottedArea(price,$scope.quantitySupplied,domain,range)),
        show_price = (price >= range.min && price <= range.max),
        show_price_consumers_pay = (showDemand && price_consumers_pay != price && price_consumers_pay >= range.min && price_consumers_pay <= range.max);

    if($scope.inEquilibrium && showDemand && showSupply) {

        // only show equilibrium if equilibrium price is in range
        if(show_price) {

             // Indicate equilibrium price
            drawHorizontalDropline(graph,"max",price,equilibriumColor,"price");
            addLabel(graph,"axis",price,'P','*','',"axisLabel");

            // Indicate price consumers pay, if tax rate > 0
            if(show_price_consumers_pay) {
                drawHorizontalDropline(graph,"max",price_consumers_pay,equilibriumColor,"price");
                addLabel(graph,"axis",price_consumers_pay,'P','C','',"axisLabel");
            }

            // Indicate equilibrium quantity
            drawVerticalDropline(graph,$scope.quantityDemanded,price_consumers_pay,equilibriumColor,"demand");
            drawDot(graph,$scope.quantityDemanded,price_consumers_pay,equilibriumColor,"demand");
            drawDot(graph,$scope.quantityDemanded,price,equilibriumColor,"supply");
            addLabel(graph,$scope.quantityDemanded,"axis",'Q','*','','axisLabel');

        }

    } else {

        // Indicate price
        drawHorizontalDropline(graph,"max",price,priceColor,"price");
        addLabel(graph,"axis",price,'P','','',"axisLabel");

        // Indicate price consumers pay, if tax rate > 0 and in range
        if(show_price_consumers_pay) {
            drawHorizontalDropline(graph,"max",price_consumers_pay,priceColor,"price");
            addLabel(graph,"axis",price_consumers_pay,'P','C','',"axisLabel");
        }

        // Indicate quantity demanded if in range
        if(show_demand_point) {
            drawVerticalDropline(graph,$scope.quantityDemanded,price_consumers_pay,demandColor,"demand");
            drawDot(graph,$scope.quantityDemanded,price_consumers_pay,demandColor,"demand");
            addLabel(graph,$scope.quantityDemanded,"axis",'Q','D','','axisLabel');
        }

        // Indicate quantity supplied if in range
        if(show_supply_point) {
            drawVerticalDropline(graph,$scope.quantitySupplied,price,supplyColor,"supply");
            drawDot(graph,$scope.quantitySupplied,price,supplyColor,"supply");
            addLabel(graph,$scope.quantitySupplied,"axis",'Q','S','','axisLabel');
        }


        // Indicate shortage or surplus if both supply and demand points are in range
        if(show_demand_point && show_supply_point) {
            drawSegment(graph,$scope.quantitySupplied,3,$scope.quantityDemanded,3,priceColor,"surplusOrShortage",($scope.surplus? "Surplus" : "Shortage"),0,15,"Middle")
        }

    }

}
