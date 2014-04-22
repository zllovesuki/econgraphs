// update both quantity demanded and quantity supplied indicators
function updateQuantityIndicators(graph,data,show_supply,show_demand,market,at_equilibrium_price){
	
	if(show_demand) updateQuantityDemanded(graph,data,market,at_equilibrium_price);
	if(show_supply) updateQuantitySupplied(graph,data,market,at_equilibrium_price);
    
}

// update quantity demanded indicator
function updateQuantityDemanded(graph,data,market,at_equilibrium_price) {

	var price = graph.y(data.price),
        quantity = market ? graph.x(data.quantityDemanded) : graph.x(data.individualQuantityDemanded),
        show_as_equilibrium = (market && at_equilibrium_price);

	if (show_as_equilibrium) {return} // we only need to show one Q* if at equilibrium

	var quantity_label = market ? "Q" : "q", // label individual quantity demanded as "q", market as "Q"
	    label_decoration = show_as_equilibrium ? "*" : "D",
        color = show_as_equilibrium ? setColor(equilibriumColor) : setColor(demandColor);

	drawDropline(graph,price,quantity,color,"demand");
	drawQuantityIndicator(graph,price,quantity,color,"demand");
	labelQuantity(graph,quantity,quantity_label,label_decoration,color);

}

// update quantity supplied indicator
function updateQuantitySupplied(graph,data,market,at_equilibrium_price) {

	var price = graph.y(data.price),
        quantity = graph.x(data.quantitySupplied),
        show_as_equilibrium = (market && at_equilibrium_price),
        quantity_label = market ? "Q" : "q", // label individual quantity supplied as "q", market as "Q"
        label_decoration = show_as_equilibrium ? "*" : "S",
        color = show_as_equilibrium ? setColor(equilibriumColor) : setColor(supplyColor);

	drawDropline(graph,price,quantity,color,"supply");
	drawQuantityIndicator(graph,price,quantity,color,"supply");
	labelQuantity(graph,quantity,quantity_label,label_decoration,color);

}

// draw circle at price/quantity combination
function drawQuantityIndicator(graph,price,quantity,color,className) {

	var r = "8px";

	graph.vis.append("svg:circle")
		.attr("class", className + " quantityIndicator")
		.attr("r",r)
		.attr("cx", quantity)
		.attr("cy", price)
		.attr("style", color);

}

// draw vertical dropline from price/quantity combination to horizontal axis
function drawDropline(graph,price,quantity,color,className) {

	var droplineBottomCoordinate = graph.height + 25; // drop a little below the axis

	graph.vis.append("svg:line")
		.attr("class", className + " dropline")
		.attr("x1", quantity)
        .attr("y1", droplineBottomCoordinate) 
        .attr("x2", quantity)
        .attr("y2", price)
        .attr("style", color);

}

// label a quantity
function labelQuantity(graph,quantity,quantity_label,label_decoration,color) {

	var axisLabelCoordinate = graph.height + 40;

	graph.vis.append("svg:text")
    	.attr("class","quantityAxisLabel")
        .attr("x", quantity)
        .attr("y", axisLabelCoordinate)
        .attr("text-anchor","middle")
        .attr("font-style","oblique")
        .text(quantity_label);

    graph.vis.append("svg:text")
    	.attr("class","quantityAxisLabelDecoration")
    	.attr("x", quantity + 6)
    	.attr("y", axisLabelCoordinate - 4)
    	.attr("text-anchor","start")
    	.attr("font-style","oblique")
        .attr("font-size",10)
        .text(label_decoration);

}

