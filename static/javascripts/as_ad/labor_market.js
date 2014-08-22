function drawLaborMarketGraph($scope,id) {

    var labor_market_graph_data = {
        id : id,
        dimensions : {height: 400, width: 400},
        margin : {top: 10, right: 50, bottom: 100, left: 70},
        x_axis : {title: "Labor (Millions of Workers Employed)", min: 0, max: 200, ticks: 10},
        y_axis : {title: "Real Wage (W/P)", min: 5, max: 15, ticks: 10}
    };
    
    var real_wage = $scope.macroParams.real_wage,
        labor_demand = $scope.laborDemandedAtRealWage,
        labor_supply = $scope.laborSuppliedAtRealWage,
        labor_demanded = $scope.laborDemanded,
        labor_supplied = $scope.laborSupplied;

    var graph = createGraph(labor_market_graph_data),
        domain = {y: true, min: 5, max: 15, step: 1},
        range = {min: 0, max: 200},
        supplyLabel = {text: "LS", reverse: true, delta: 15},
        demandLabel = {text: "LD", reverse: false, delta: -15};

    // Draw demand and supply curves
    drawFunction(labor_demand,domain,range,graph,demandColor,demandLabel);
    drawFunction(labor_supply,domain,range,graph,supplyColor,supplyLabel);

    var show_demand_point = pointInPlottedArea(real_wage,labor_demanded,domain,range),
        show_supply_point = pointInPlottedArea(real_wage,labor_supplied,domain,range),
        show_wage = (real_wage >= range.min && real_wage <= range.max);

    if($scope.inLaborMarketEquilibrium) {

        // only show equilibrium if equilibrium price is in range
        if(show_wage) {

             // Indicate equilibrium price
            drawHorizontalDropline(graph,"max",real_wage,equilibriumColor,"price");
            addLabel(graph,"axis",real_wage,'W/P','*','',"axisLabel");

            // Indicate equilibrium quantity
            drawVerticalDropline(graph,$scope.quantityDemanded,price_consumers_pay,equilibriumColor,"demand");
            drawDot(graph,$scope.quantityDemanded,price_consumers_pay,equilibriumColor,"demand");
            drawDot(graph,$scope.quantityDemanded,price,equilibriumColor,"supply");
            addLabel(graph,$scope.quantityDemanded,"axis",'Q','*','','axisLabel');

        }

    } else {

        // Indicate real wage
        drawHorizontalDropline(graph,"max",real_wage,priceColor,"price");
        addLabel(graph,"axis",real_wage,'W/P','','',"axisLabel");

        // Indicate quantity demanded if in range
        if(show_demand_point) {
            drawVerticalDropline(graph,labor_demanded,real_wage,demandColor,"demand");
            drawDot(graph,labor_demanded,real_wage,demandColor,"demand");
            addLabel(graph,labor_demanded,"axis",'L','D','','axisLabel');
        }

        // Indicate quantity supplied if in range
        if(show_supply_point) {
            drawVerticalDropline(graph,labor_supplied,real_wage,supplyColor,"supply");
            drawDot(graph,labor_supplied,real_wage,supplyColor,"supply");
            addLabel(graph,labor_supplied,"axis",'L','S','','axisLabel');
        }


        // Indicate shortage or surplus if both supply and demand points are in range
        if(show_demand_point && show_supply_point) {
            drawSegment(graph,labor_supplied,3,labor_demanded,3,priceColor,"surplusOrShortage","",0,15,"Middle")
        }

    }

}

