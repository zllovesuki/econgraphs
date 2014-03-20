var margin = {top: 10, right: 100, bottom: 100, left: 70},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    minPrice = 5;
    maxPrice = 95;
    maxQuantity = 95;

function drawGraphAxes(id,x_label,y_label,x_axis_length,y_axis_length) {

    var vis = d3.select(id)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add x axis
    var x_axis = vis.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Label x axis
        x_axis.append("text")
            .attr("x", width / 2 )
            .attr("y", "4em")
            .style("text-anchor", "middle")
            .text(x_label);

    // Add y axis
    var y_axis = vis.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(y).orient("left"));

        // Label y axis
        y_axis.append("text")
            .attr("transform","rotate(-90)")
            .attr("x", -height / 2 )
            .attr("y", "-4em")
            .style("text-anchor", "middle")
            .text(y_label);

    return vis;

}