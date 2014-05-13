function addPointToCurve(curve,x,y,graph) {
    if (graph.y(y) <= graph.height && graph.y(y) >= 0 && graph.x(x) >= 0 && graph.x(x) <= graph.width) {
        curve.push({ x : graph.x(x),y : graph.y(y)})
    }
    return curve;
}

var curveFunction = d3.svg.line()
    .x(function(d) {return d.x;}).y(function(d) {return d.y;}).interpolate("linear");

function drawCurve(graph,points,label_delta,color,label) {

    if(points.length == 0) {
        return;
    }

    // draw curve
    graph.vis.append("svg:path")
        .attr("class", label + " curve")
        .attr("d", curveFunction(points))
        .attr("stroke",color)
        .attr("fill","none");

    // label curve

    var label_x = function() {
        if(points[0].x + 3 > graph.width - 15) {
            return graph.width - 15
        } else {
            return points[0].x + 3
        }
    }

    var label_y = function() {
        if(points[0].y < 15) {
            return 15 + label_delta
        } else {
            return points[0].y + label_delta
        }
    }

    graph.vis.append("svg:text")
        .attr("class","curveLabel")
        .attr("x", label_x)
        .attr("y", label_y)
        .attr("stroke", color)
        .attr("fill", color)
        .text(label)

}


