// Assumes x and y are numbers and xRange and yRange each have min and max properties
function pointInPlottedArea(x,y,xRange,yRange) {
    return (x >= xRange.min && x <= xRange.max && y >= yRange.min && y <= yRange.max)
}

function drawFunction(function_name,domain,range,graph,color,label) {
    var curve = [];
    for(var ind = domain.min; ind <= domain.max; ind += domain.step) {
        var dep = function_name(ind);
        if(pointInPlottedArea(ind,dep,domain,range)) {
            if(domain.y) {
                curve.push({ x : graph.x(dep),y : graph.y(ind)})
            } else {
                curve.push({ x : graph.x(ind),y : graph.y(dep)})
            }
        }
    }
    if(label.reverse) { curve = curve.reverse() }
    drawCurve(graph,curve,label.delta,color,label.text)
}

var curveFunction = d3.svg.line()
    .x(function(d) {return d.x;}).y(function(d) {return d.y;}).interpolate("linear");

// Draw the curve and label it
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


