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
        .attr("style", color);

}

// draw vertical dropline from x/y coordinate to horizontal axis
function drawVerticalDropline(graph,x,y,color,className) {

    // translate x and y to graph coordinates; if y="max" then use 0 (top of graph)
    var x_coord = graph.x(x),
        y_coord = (y == "max") ? 0 : graph.y(y);

    graph.vis.append("svg:line")
        .attr("class", className + " dropline")
        .attr("x1", x_coord)
        .attr("y1", graph.height + 25) // drop a little below the axis
        .attr("x2", x_coord)
        .attr("y2", y_coord)
        .attr("style", color);

}

function drawHorizontalDropline(graph,x,y,color,className) {

    // translate x and y to graph coordinates; if x="max" then use graph_width
    var x_coord = (x == "max") ? graph.width : graph.x(x),
        y_coord = graph.y(y);

    graph.vis.append("svg:line")
        .attr("class","price")
        // set line to extend from left boundary to right boundary
        .attr("x1", -35 )
        .attr("x2", x_coord)
        .attr("y1", y_coord)
        .attr("y2", y_coord)
        .attr("style", color);

}