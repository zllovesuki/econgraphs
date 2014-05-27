// If u = (thisGood^alpha * otherGood*(1-alpha), solves for otherGood as a function of thisGood, u, and alpha.
function otherGood(thisGood,u,alpha) {
    var uOverXtotheAlpha = u/Math.pow(thisGood,alpha);
    var oneOverOneMinusAlpha = 1 / (1 - alpha);
    return Math.pow(uOverXtotheAlpha,oneOverOneMinusAlpha);
}

// Establish general behavioral constants for this graph
function drawCobbDouglass($scope, id) {

    var indifference_curve_graph_data = {
            id : id,
            dimensions : {height: 500, width: 500},
            margin : {top: 10, right: 100, bottom: 100, left: 70},
            x_axis : {title: "Units of Good X", min: 0, max: 10, ticks: 10},
            y_axis : {title: "Units of Good Y", min: 0, max: 10, ticks: 10}
    };

    var allocation = $scope.allocation,
        alpha = $scope.utilityParams.alpha,
        u = Math.pow(allocation.x,alpha) * Math.pow(allocation.y,1 - alpha);

    var graph = createGraph(indifference_curve_graph_data),
        x_domain = {min: 0.1, max: 9.9, step: 0.1},
        y_domain = {min: 0.1, max: 9.9, step: 0.1, y:true},
        x_label = {text: (alpha == 1) ? '' : 'I', delta: -6, reverse: true},
        y_label = {text: (alpha == 1) ? 'I' : '', delta: -6};

    var xForY = function(y) { return otherGood(y,u,alpha)},
        yForX = function(x) { return otherGood(x,u,1-alpha)};

    // Draw curves
    drawFunction(xForY,x_domain,y_domain,graph,demandColor,x_label);
    drawFunction(yForX,y_domain,x_domain,graph,demandColor,y_label);

    // Draw allocation
    drawDot(graph,allocation.x,allocation.y,demandColor);

}