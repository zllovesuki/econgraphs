/**
 * This expects a graph, graph data, and data of the form
 *
 *   {
 *      u : 5,
 *      alpha : 0.5
 *   }
 *
 * and draws an indifference curve showing the locus of all points (x,y) such that
 *
 *      ln U(x,y) = alpha * ln(x) + (1-alpha) * ln(y)
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

function drawIndifferenceCurveDim(graph,data) {

}

// Establish general behavioral constants for this graph
function drawCobbDouglass(graph,data) {

    var points = [],
        plotted_x = 0.1,
        prevent_infinite_loop = 0;

    while (graph.x(plotted_x) < graph.width) {
        console.log('plotted x = ' + plotted_x + ', coordinate = ' + graph.x(plotted_x) + ', graph_width = ' + graph.width);
        var y = otherGood(plotted_x,data.u,data.alpha);
        if (graph.y(y) > 0) {
            points.push({ x: graph.x(plotted_x), y: graph.y(y)})
        }
        plotted_x += 0.1;
        if (prevent_infinite_loop > 1000) {console.log('needed to break loop on x dimension'); break;}
        prevent_infinite_loop++
    }

    if(data.alpha < 1) {
        drawCurve(graph, points.reverse(), 15, demandColor, "U");
    }


    points=[];
    var plotted_y = 0.1;
    prevent_infinite_loop = 0;
    while (graph.y(plotted_y) > 0) {
        console.log('plotted y = ' + plotted_y + ', coordinate = ' + graph.y(plotted_y) + ', graph_height = ' + graph.height);
        var x = otherGood(plotted_y,data.u,(1 - data.alpha));
        if (graph.x(x) < graph.width) {
            points.push({ x: graph.x(x), y: graph.y(plotted_y)})
        }
        plotted_y += 0.1;
        if (prevent_infinite_loop > 1000) {console.log('needed to break loop on y dimension'); break;}
        prevent_infinite_loop++
    }

    if(data.alpha > 0) {
        drawCurve(graph, points, 15, demandColor, "");
    }


}