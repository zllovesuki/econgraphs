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
        mc_curve_points = [],
        atc_curve_points = [],
        avc_curve_points = [],
        minQuantity = 5,
        maxQuantity = 95;

    // Generate points for three curves
    for(var q = maxQuantity; q >= minQuantity; q -= 0.5) {
        addPointToCurve(mc_curve_points,q,$scope.marginal_cost(q),graph);
        addPointToCurve(atc_curve_points,q,$scope.average_total_cost(q),graph);
        addPointToCurve(avc_curve_points,q,$scope.average_variable_cost(q),graph);
    }

    // Draw curves
    drawCurve(graph,mc_curve_points,0,supplyColor,"MC");
    drawCurve(graph,atc_curve_points,-6,atcColor,"ATC");
    if(showVC) {drawCurve(graph,avc_curve_points,6,avcColor,"AVC")}

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