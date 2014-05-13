// draw dot at x/y coordinate
function drawDot(graph,x,y,color,className) {

    // translate x and y to graph coordinates
    var x_coord = graph.x(x),
        y_coord = graph.y(y);

    var r = "8px";

    graph.vis.append("svg:circle")
        .attr("class", className + " dot")
        .attr("r",r)
        .attr("cx", x_coord)
        .attr("cy", y_coord)
        .attr("stroke", color)
        .attr("fill", color);

}

// draw vertical dropline from x/y coordinate to horizontal axis
function drawVerticalDropline(graph,x,y,color,className) {

    // translate x and y to graph coordinates; if y="max" then use 0 (top of graph)
    var x_coord = graph.x(x),
        y_coord = (y == "max") ? 0 : graph.y(y);

    graph.vis.append("svg:line")
        .attr("class", className + ' dropline')
        .attr("x1", x_coord)
        .attr("y1", graph.height + 25) // drop a little below the axis
        .attr("x2", x_coord)
        .attr("y2", y_coord)
        .attr("stroke", color)
        .attr("fill", color);

}

function drawHorizontalDropline(graph,x,y,color,className) {

    // translate x and y to graph coordinates; if x="max" then use graph_width
    var x_coord = (x == "max") ? graph.width : graph.x(x),
        y_coord = graph.y(y);

    graph.vis.append("svg:line")
        .attr("class",className + ' dropline')
        // set line to extend from left boundary to right boundary
        .attr("x1", -35 )
        .attr("x2", x_coord)
        .attr("y1", y_coord)
        .attr("y2", y_coord)
        .attr("stroke", color)
        .attr("fill", color);

}

function drawSegment(graph,x1,y1,x2,y2,color,className,label,x_label_offset, y_label_offset,anchor) {

    // translate x and y to graph coordinates; if y="max" then use 0 (top of graph)
    var x1_coord = graph.x(x1),
        y1_coord = graph.y(y1),
        x2_coord = graph.x(x2),
        y2_coord = graph.y(y2);

    graph.vis.append("svg:line")
        .attr("class", className)
        .attr("x1", x1_coord)
        .attr("y1", y1_coord) // drop a little below the axis
        .attr("x2", x2_coord)
        .attr("y2", y2_coord)
        .attr("stroke", color)
        .attr("fill", color);

    // add label to segment midpoint

    graph.vis.append("svg:text")
        .attr("class","curveLabel")
        .attr("x", 0.5*x1_coord + 0.5*x2_coord + x_label_offset)
        .attr("y", 0.5*y1_coord + 0.5*y2_coord + y_label_offset)
        .attr("text-anchor", anchor)
        .text(label)
}