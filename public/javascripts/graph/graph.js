/**
 * This expects graph_data of the form
 *
 *   {
 *      id : "myGraph1", <-- id of the div where the graph belongs
 *      dimensions : {height: 500, width: 700}, <-- graph dimension in pixels
 *      margin : {top: 10, right: 100, bottom: 100, left: 70}, <-- position of axes within overall graph area
 *      x_axis : {title: "Quantity", min: 0, max: 100, ticks: 10}, <-- x axis information
 *      y_axis : {title: "Price", min: 0, max: 10, ticks: 5} <-- y axis information
 *   }
 *
 * and returns the x and y scales as functions, as well as the visualization d3 object itself:
 *
 *   {
 *      x : [d3.scale object],
 *      y : [d3.scale object],
 *      vis : [d3 object],
 *      width : 500,
 *      height: 700
 *   }
 *
 * Note that there may be a way to query the d3 object for its scale, width, and height; TODO see how to do this.
 */

function createGraph(graph_data) {

    var graph_width, graph_height, x, y, vis;

    // The width and height of the drawn graph are the width and height of the alloted space, minus the margins.
    graph_width = graph_data.dimensions.width - graph_data.margin.left - graph_data.margin.right;
    graph_height = graph_data.dimensions.height - graph_data.margin.top - graph_data.margin.bottom;

    // Create the D3 scales for the x and y dimensions
    x = d3.scale.linear()
            .range([0, graph_width])
            .domain([graph_data.x_axis.min, graph_data.x_axis.max]);
    y = d3.scale.linear()
            .range([graph_height, 0])
            .domain([graph_data.y_axis.min, graph_data.y_axis.max]);

    // Create the D3 visualization object
    vis = d3.select("#" + graph_data.id)
            .append("svg")
                .attr("width", graph_data.dimensions.width)
                .attr("height", graph_data.dimensions.height)
                    .append("g")
                        .attr("transform", "translate(" + graph_data.margin.left + "," + graph_data.margin.top + ")");

    // Add x axis
    vis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + graph_height + ")")
        .call(d3.svg.axis().scale(x).orient("bottom"))

        // Label x axis
        .append("text")
            .attr("x", graph_width / 2 )
            .attr("y", "4em")
            .style("text-anchor", "middle")
            .text(graph_data.x_axis.title);

    // Add y axis
    vis.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"))

        // Label y axis
        .append("text")
                .attr("transform","rotate(-90)")
                .attr("x", -graph_height / 2 )
                .attr("y", "-4em")
                .style("text-anchor", "middle")
                .text(graph_data.y_axis.title);

    // Return JSON representing graph. This is usually called 'graph' by the code that uses it.
    return { x : x, y : y, vis : vis, width : graph_width, height: graph_height};

}