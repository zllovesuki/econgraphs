/**
 * This expects a graph, graph data, and data of the form
 *
 *   {
 *      x : 5,
 *      y : 5,
 *      alpha : 0.5
 *   }
 *
 * and draws an indifference curve showing the locus of all points (x',y') such that
 *
 *      alpha * ln(x) + (1-alpha) * ln(y) = alpha * ln(x') + (1-alpha) * ln(y')
 *
 */

function ln(x) {
    return Math.log(x);
}

// Given a quantity of one good, a total utility, and an alpha parameter, returns the quantity of the other good
// U(x,y) =
function otherGood(thisGood,u,alpha) {
    var uOverXtotheAlpha = u/Math.pow(thisGood,alpha);
    var oneOverOneMinusAlpha = 1 / (1 - alpha);
    return Math.pow(uOverXtotheAlpha,oneOverOneMinusAlpha);
}

// Establish general behavioral constants for this graph
function drawCobbDouglass(graph,$scope) {

    var allocation = $scope.allocation,
        alpha = $scope.utilityParams.alpha;

    var points = [],
        plotted_x = 0.1,
        prevent_infinite_loop = 0,
        u = Math.pow(allocation.x,alpha) * Math.pow(allocation.y,1 - alpha);

    drawDot(graph,allocation.x,allocation.y,demandColor);

    while (graph.x(plotted_x) < graph.width) {
        var calculated_y = otherGood(plotted_x,u,alpha);
        points = addPointToCurve(points,plotted_x,calculated_y,graph)
        plotted_x += 0.1;
        if (prevent_infinite_loop > 1000) {console.log('needed to break loop on x dimension'); break;}
        prevent_infinite_loop++
    }

    if(alpha < 1) {
        drawCurve(graph, points.reverse(), 15, demandColor, "U");
    }


    points=[];
    var plotted_y = 0.1;
    prevent_infinite_loop = 0;
    while (graph.y(plotted_y) > 0) {
        console.log('plotted y = ' + plotted_y + ', coordinate = ' + graph.y(plotted_y) + ', graph_height = ' + graph.height);
        var calculated_x = otherGood(plotted_y,u,(1 - alpha));
        points = addPointToCurve(points,calculated_x,plotted_y,graph)
        plotted_y += 0.1;
        if (prevent_infinite_loop > 1000) {console.log('needed to break loop on y dimension'); break;}
        prevent_infinite_loop++
    }

    if(alpha > 0) {
        drawCurve(graph, points, 15, demandColor, "");
    }


}