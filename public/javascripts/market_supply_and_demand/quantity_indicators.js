// update both quantity demanded and quantity supplied indicators
function updateQuantityIndicators(vis,data){
	
	updateQuantityDemanded(vis,data);
	updateQuantitySupplied(vis,data);
    
}

// update quantity demanded indicator
function updateQuantityDemanded(vis,data) {

	price = y(data.price);
	quantity = x(data.quantityDemanded);
	label = (data.price == data.equilibriumPrice) ? "Q*" : "QD"
	color = (data.price == data.equilibriumPrice) ? setColor(equilibriumColor) : setColor(demandColor);
	
	drawDropline(vis,price,quantity,color,"demand");
	drawQuantityIndicator(vis,price,quantity,color,"demand");
	labelQuantity(vis,quantity,label);

}

// update quantity supplied indicator
function updateQuantitySupplied(vis,data) {

	price = y(data.price);
	quantity = x(data.quantitySupplied);
	label = (data.price == data.equilibriumPrice) ? "Q*" : "QS"
	color = (data.price == data.equilibriumPrice) ? setColor(equilibriumColor) : setColor(supplyColor);

	drawDropline(vis,price,quantity,color,"supply");
	drawQuantityIndicator(vis,price,quantity,color,"supply");
	labelQuantity(vis,quantity,label);

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
function labelQuantity(vis,quantity,label,color) {

	var axisLabelCoordinate = height + 40;

	vis.append("svg:text")
    	.attr("class","quantityAxisLabel")
        .attr("x", quantity)
        .attr("y", axisLabelCoordinate)
        .attr("text-anchor","middle")
        .text(label);

}

