function drawBox(graph,x1,y1,x2,y2,color,label) {

    var x = graph.x(Math.min(x1,x2)),
        y = graph.y(Math.max(y1,y2)),
        width = Math.abs(graph.x(x1) - graph.x(x2)),
        height = Math.abs(graph.y(y1) - graph.y(y2));


    // draw box
    graph.vis.append("svg:rect")
        .attr("x", x)
        .attr("y", y)
        .attr("height", height)
        .attr("width", width)
        .attr("stroke",color)
        .attr("fill",color)
        .attr("opacity",0.25);

    // label box

    graph.vis.append("svg:text")
        .attr("class","curveLabel")
        .attr("x", x + 0.5*width)
        .attr("y", y + 0.5*height + 5)
        .attr("text-anchor", "middle")
        .text(label)

}