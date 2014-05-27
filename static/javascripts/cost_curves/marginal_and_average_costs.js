function drawCostCurveGraph($scope,id) {

    var cost_curve_graph_data = {
        id : id,
        dimensions : {height: 500, width: $("#" + id).width()},
        margin : {top: 10, right: 50, bottom: 100, left: 70},
        x_axis : {title: "Quantity Produced (Units)", min: 0, max: 100, ticks: 10},
        y_axis : {title: "Price and Cost (Dollars per unit)", min: 0, max: 60, ticks: 10}
    };

    var quantity = $scope.firmSupplyParams.quantity,
        price = $scope.marketParams.price;

    var showVC = $scope.displayOptions.showVariableCosts;

    var graph = createGraph(cost_curve_graph_data),
        domain = {min: 5, max: 95, step: 1},
        range = {min: 0, max: 60},
        mc_label = {text: "MC", delta: 0, reverse: true},
        avc_label = {text: "AVC", delta: 6, reverse: true},
        atc_label = {text: "ATC", delta: -6, reverse: true};

    // Draw curves
    drawFunction($scope.marginal_cost,domain,range,graph,supplyColor,mc_label);
    drawFunction($scope.average_total_cost,domain,range,graph,atcColor,atc_label);
    if(showVC) {drawFunction($scope.average_variable_cost,domain,range,graph,avcColor,avc_label)};

    // Indicate price
    drawHorizontalDropline(graph,"max",price,priceColor,"price");
    addLabel(graph,"axis",price,'P','','',"axisLabel");

    // Indicate quantity supplied
    drawVerticalDropline(graph,quantity,price,supplyColor,"supply");
    drawDot(graph,quantity,price,priceColor,"supply");
    if (quantity > 0) {drawDot(graph,quantity,$scope.current_average_total_cost,atcColor,"supply")}
    addLabel(graph,quantity,"axis",'q','s','','axisLabel');

    // Add box representing profit/loss unless firm is breaking even or shut down
    if(!$scope.isBreakingEven && quantity > 0) {drawBox(graph,0,price,quantity,$scope.current_average_total_cost,$scope.profitOrLossColor,$scope.profitOrLossLabel)}

}