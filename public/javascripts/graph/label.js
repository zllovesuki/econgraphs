function addLabel(graph,x,y,text,sup,sub,className) {

    var x_coord = (x == "axis") ? -50 : graph.x(x),
        y_coord = (y == "axis") ? graph.height + 40 : graph.y(y) + 6;

    graph.vis.append("svg:text")
        .attr("class",className)
        .attr("x", x_coord)
        .attr("y", y_coord)
        .attr("text-anchor","middle")
        .attr("font-size",14)
        .attr("font-style","oblique")
        .text(text);

    graph.vis.append("svg:text")
        .attr("class",className)
        .attr("x", x_coord + 7)
        .attr("y", y_coord - 4)
        .attr("text-anchor","start")
        .attr("font-style","oblique")
        .attr("font-size",10)
        .text(sup);

    graph.vis.append("svg:text")
        .attr("class",className)
        .attr("x", x_coord + 7)
        .attr("y", y_coord + 4)
        .attr("text-anchor","start")
        .attr("font-style","oblique")
        .attr("font-size",10)
        .text(sub);

}