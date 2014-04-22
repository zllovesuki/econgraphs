// update both quantity demanded and quantity supplied indicators
function updateQuantityIndicators(graph,data,show_supply,show_demand,market,at_equilibrium_price){
	
	if(show_demand) updateQuantityDemanded(graph,data,market,at_equilibrium_price);
	if(show_supply) updateQuantitySupplied(graph,data,market,at_equilibrium_price);
    
}

// update quantity demanded indicator
function updateQuantityDemanded(graph,data,market,at_equilibrium_price) {

	var y = data.price,
        x = market ? data.quantityDemanded : data.individualQuantityDemanded,
        show_as_equilibrium = (market && at_equilibrium_price);

	if (show_as_equilibrium) {return} // we only need to show one Q* if at equilibrium

	var quantity_label = market ? "Q" : "q", // label individual quantity demanded as "q", market as "Q"
	    label_decoration = show_as_equilibrium ? "*" : "D",
        color = show_as_equilibrium ? setColor(equilibriumColor) : setColor(demandColor);

	drawVerticalDropline(graph,x,y,color,"demand");
	drawDot(graph,x,y,color,"demand");
	labelQuantity(graph,x,quantity_label,label_decoration,color);

}

// update quantity supplied indicator
function updateQuantitySupplied(graph,data,market,at_equilibrium_price) {

	var y = data.price,
        x = data.quantitySupplied,
        show_as_equilibrium = (market && at_equilibrium_price),
        quantity_label = market ? "Q" : "q", // label individual quantity supplied as "q", market as "Q"
        label_decoration = show_as_equilibrium ? "*" : "S",
        color = show_as_equilibrium ? setColor(equilibriumColor) : setColor(supplyColor);

	drawVerticalDropline(graph,x,y,color,"supply");
	drawDot(graph,x,y,color,"supply");
	labelQuantity(graph,x,quantity_label,label_decoration,color);

}


// label a quantity
function labelQuantity(graph,x,quantity_label,label_decoration,color) {

	var axisLabelCoordinate = graph.height + 40;

	graph.vis.append("svg:text")
    	.attr("class","quantityAxisLabel")
        .attr("x", graph.x(x))
        .attr("y", axisLabelCoordinate)
        .attr("text-anchor","middle")
        .attr("font-style","oblique")
        .text(quantity_label);

    graph.vis.append("svg:text")
    	.attr("class","quantityAxisLabelDecoration")
    	.attr("x", graph.x(x) + 6)
    	.attr("y", axisLabelCoordinate - 4)
    	.attr("text-anchor","start")
    	.attr("font-style","oblique")
        .attr("font-size",10)
        .text(label_decoration);

}

