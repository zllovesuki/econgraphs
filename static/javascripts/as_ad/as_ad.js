function drawASADGraph($scope,id) {

    var as_ad_graph_data = {
        id : id,
        dimensions : {height: 400, width: 400},
        margin : {top: 10, right: 50, bottom: 100, left: 70},
        x_axis : {title: "Output", min: 80, max: 120, ticks: 10},
        y_axis : {title: "Price Level", min: 80, max: 120, ticks: 10}
    };
    
    var price_level = $scope.macroParams.price_level,
        output = $scope.macroParams.output,
        aggregate_demand = $scope.aggregateDemandAtPriceLevel,
        aggregate_supply = $scope.aggregateSupplyAtPriceLevel;

    var graph = createGraph(as_ad_graph_data),
        domain = {y: true, min: 80, max: 120, step: 0.25},
        range = {min: 80, max: 120},
        supplyLabel = {text: "SRAS", reverse: true, delta: 15},
        demandLabel = {text: "AD", reverse: false, delta: -20};

    // Draw demand and supply curves
    drawFunction(aggregate_demand,domain,range,graph,demandColor,demandLabel);
    drawFunction(aggregate_supply,domain,range,graph,supplyColor,supplyLabel);

    if(pointInPlottedArea(price_level,output,domain,range)) {

         // Indicate equilibrium price
            drawHorizontalDropline(graph,"max",price_level,equilibriumColor,"price");
            addLabel(graph,"axis",price_level,'P','','',"axisLabel");

            // Indicate equilibrium quantity
            drawVerticalDropline(graph,output,price_level,equilibriumColor,"demand");
            drawDot(graph,output,price_level,equilibriumColor,"demand");
            addLabel(graph,output,"axis",'Y','','','axisLabel');

    }

}

