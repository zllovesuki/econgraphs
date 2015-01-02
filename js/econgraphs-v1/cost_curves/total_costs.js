function drawTotalCostAndRevenueGraph($scope,id) {

    var cost_curve_graph_data = {
        id : id,
        dimensions : {height: 500, width: $("#" + id).width()},
        margin : {top: 10, right: 50, bottom: 100, left: 70},
        x_axis : {title: "Quantity Produced (Units)", min: 0, max: 100, ticks: 10},
        y_axis : {title: "Total Cost and Revenue (Dollars)", min: 0, max: 5000, ticks: 10}
    };
    
    var quantity = $scope.firmSupplyParams.quantity,
        showVC = $scope.displayOptions.showVariableCosts;

    var graph = createGraph(cost_curve_graph_data),
        domain = {min: 0, max: 100, step: 0.25},
        range = {min: 0, max: 5000},
        tr_label = {text: "TR", delta: -2, reverse: true},
        vc_label = {text: "VC", delta: 8, reverse: true},
        tc_label = {text: "TC", delta: -8, reverse: true};

    // Draw curves
    drawFunction($scope.total_revenue,domain,range,graph,priceColor,tr_label);
    drawFunction($scope.total_cost,domain,range,graph,atcColor,tc_label);
    if(showVC) {drawFunction($scope.variable_cost,domain,range,graph,avcColor,vc_label)};

    // Indicate quantity supplied
    drawVerticalDropline(graph,quantity,Math.min($scope.current_total_revenue,$scope.current_total_cost),supplyColor,"TC");
    drawDot(graph,quantity,$scope.current_total_revenue,priceColor,"TR");
    drawDot(graph,quantity,$scope.current_total_cost,atcColor,"TC");
    addLabel(graph,quantity,"axis",'q','s','','axisLabel');

    // Indicate profit or loss if the firm isn't breaking even
    if(!$scope.isBreakingEven) {drawSegment(graph,quantity,$scope.current_total_revenue,quantity,$scope.current_total_cost,profitColor,"profit",$scope.profitOrLossLabel,5,5,"Start")}

}