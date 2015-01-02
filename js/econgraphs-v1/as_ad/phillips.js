function drawPhillipsCurveGraph($scope,id) {

    var phillips_curve_graph_data = {
        id : id,
        dimensions : {height: 400, width: 400},
        margin : {top: 10, right: 100, bottom: 100, left: 70},
        x_axis : {title: "Unemployment Rate (%)", min: 0, max: 10, ticks: 10},
        y_axis : {title: "Inflation Rate (%)", min: -20, max: 20, ticks: 10}
    };

    var inflation_rate = $scope.macroParams.inflation_rate,
        unemployment_rate = $scope.macroParams.unemployment_rate;

    var graph = createGraph(phillips_curve_graph_data),
        domain = {y: true, min: -20, max: 20, step: 0.1},
        range = {min: 0, max: 10},
        phillipsLabel = {text: "PC", reverse: true, delta: -10};

    // Draw demand and supply curves
    drawFunction($scope.phillipsCurve,domain,range,graph,demandColor,phillipsLabel);

    var show_point = pointInPlottedArea(inflation_rate,unemployment_rate,domain,range);


    if(show_point) {

        // Indicate equilibrium inflation rate
        drawHorizontalDropline(graph,unemployment_rate,inflation_rate,demandColor,"demand");
        addLabel(graph,"axis",inflation_rate,'pi','','',"axisLabel");

        // Indicate equilibrium quantity
        drawVerticalDropline(graph,unemployment_rate,inflation_rate,demandColor,"demand");
        drawDot(graph,unemployment_rate,inflation_rate,demandColor,"supply");
        addLabel(graph,unemployment_rate,"axis",'U','','','axisLabel');

    }



}

