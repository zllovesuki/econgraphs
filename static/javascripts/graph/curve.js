var curveFunction = d3.svg.line()
    .x(function(d) {return d.x;}).y(function(d) {return d.y;}).interpolate("linear");

function drawCurve(graph,points,label_delta,color,label) {

    // draw curve
    graph.vis.append("svg:path")
        .attr("class", label + " curve")
        .attr("d", curveFunction(points))
        .attr("stroke",color)
        .attr("fill","none");

    // label curve
    graph.vis.append("svg:text")
        .attr("class","curveLabel")
        .attr("x", points[0].x)
        .attr("y", points[0].y + label_delta)
        .text(label);

}
