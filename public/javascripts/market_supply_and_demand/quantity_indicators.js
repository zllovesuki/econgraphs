// update both quantity demanded and quantity supplied indicators
function updateQuantityIndicators(vis,data,show_supply,show_demand,market,at_equilibrium_price){
	
	if(show_demand) updateQuantityDemanded(vis,data,market,at_equilibrium_price);
	if(show_supply) updateQuantitySupplied(vis,data,market,at_equilibrium_price);
    
}

// update quantity demanded indicator
function updateQuantityDemanded(vis,data,market,at_equilibrium_price) {

	price = y(data.price);
	quantity = market ? x(data.quantityDemanded) : x(data.individualQuantityDemanded);

	show_as_equilbrium = (market && at_equilibrium_price);

	if (show_as_equilibrium) {return}; // we only need to show one Q* if at equilibrium

	quantity_label = market ? "Q" : "q"; // label individual quantity demanded as "q", market as "Q"
	label_decoration = show_as_equilibrium ? "*" : "D";
	color = show_as_equilibrium ? setColor(equilibriumColor) : setColor(demandColor);

	drawDropline(vis,price,quantity,color,"demand");
	drawQuantityIndicator(vis,price,quantity,color,"demand");
	labelQuantity(vis,quantity,quantity_label,label_decoration,color);

}

// update quantity supplied indicator
function updateQuantitySupplied(vis,data,market,at_equilibrium_price) {

	price = y(data.price);
	quantity = x(data.quantitySupplied);
	
	show_as_equilbrium = (market && at_equilibrium_price)
	quantity_label = market ? "Q" : "q"; // label individual quantity supplied as "q", market as "Q"
	label_decoration = show_as_equilibrium ? "*" : "S"
	color = show_as_equilibrium ? setColor(equilibriumColor) : setColor(supplyColor);

	drawDropline(vis,price,quantity,color,"supply");
	drawQuantityIndicator(vis,price,quantity,color,"supply");
	labelQuantity(vis,quantity,quantity_label,label_decoration,color);

}

// draw circle at price/quantity combination
function drawQuantityIndicator(vis,price,quantity,color,className) {

	var r = "8px";

	vis.append("svg:circle")
		.attr("class", className + " quantityIndicator")
		.attr("r",r)
		.attr("cx", quantity)
		.attr("cy", price)
		.attr("style", color);

}

// draw vertical dropline from price/quantity combination to horizontal axis
function drawDropline(vis,price,quantity,color,className) {

	var droplineBottomCoordinate = height + 25; // drop a little below the axis

	vis.append("svg:line")
		.attr("class", className + " dropline")
		.attr("x1", quantity)
        .attr("y1", droplineBottomCoordinate) 
        .attr("x2", quantity)
        .attr("y2", price)
        .attr("style", color);

}

// label a quantity
function labelQuantity(vis,quantity,quantity_label,label_decoration,color) {

	var axisLabelCoordinate = height + 40;

	vis.append("svg:text")
    	.attr("class","quantityAxisLabel")
        .attr("x", quantity)
        .attr("y", axisLabelCoordinate)
        .attr("text-anchor","middle")
        .attr("font-style","oblique")
        .text(quantity_label);

    vis.append("svg:text")
    	.attr("class","quantityAxisLabelDecoration")
    	.attr("x", quantity + 6)
    	.attr("y", axisLabelCoordinate - 4)
    	.attr("text-anchor","start")
    	.attr("font-style","oblique")
        .attr("font-size",10)
        .text(label_decoration);

}

