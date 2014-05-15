function drawTotalCostAndRevenueGraph($scope,id) {

    var cost_curve_graph_data = {
        id : id,
        dimensions : {height: 500, width: 500},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: "Quantity Produced (Units)", min: 0, max: 100, ticks: 10},
        y_axis : {title: "Total Cost and Revenue (Dollars)", min: 0, max: 5000, ticks: 10}
    };
    
    var quantity = $scope.firmSupplyParams.quantity,
        showVC = $scope.displayOptions.showVariableCosts;

    var graph = createGraph(cost_curve_graph_data),
        tc_curve_points = [],
        tr_curve_points = [],
        vc_curve_points = [],
        minQuantity = 0,
        maxQuantity = 95;

    // Generate points for three curves
    for(var q = maxQuantity; q >= minQuantity; q -= 0.5) {
        addPointToCurve(tc_curve_points,q,$scope.total_cost(q),graph);
        addPointToCurve(vc_curve_points,q,$scope.variable_cost(q),graph);
        addPointToCurve(tr_curve_points,q,$scope.total_revenue(q),graph);
    }

    // Draw curves
    drawCurve(graph,tr_curve_points,0,priceColor,"TR");
    if(showVC) {drawCurve(graph,vc_curve_points,6,avcColor,"VC")}
    drawCurve(graph,tc_curve_points,-6,atcColor,"TC");

    // Indicate quantity supplied
    drawVerticalDropline(graph,quantity,Math.min($scope.current_total_revenue,$scope.current_total_cost),supplyColor,"TC");
    drawDot(graph,quantity,$scope.current_total_revenue,priceColor,"TR");
    drawDot(graph,quantity,$scope.current_total_cost,atcColor,"TC");
    addLabel(graph,quantity,"axis",'q','s','','axisLabel');

    // Indicate profit or loss if the firm isn't breaking even
    if(!$scope.isBreakingEven) {drawSegment(graph,quantity,$scope.current_total_revenue,quantity,$scope.current_total_cost,profitColor,"profit",$scope.profitOrLossLabel,5,5,"Start")}

}