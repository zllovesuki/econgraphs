function updatePrice(vis,data,show_supply,show_demand,market){

  price = y(data.price);

  at_equilibrium_price = (data.price == data.equilibriumPrice);
  show_as_equilibrium = (market && at_equilibrium_price);
  label_decoration = show_as_equilibrium ? "*" : ""
  color = show_as_equilibrium ? setColor(equilibriumColor) : setColor(priceColor);

  // Draw line for price
  
  vis.append("svg:line")
        .attr("class","price")
        // set line to extend from left boundary to right boundary
        .attr("x1", -35 )
        .attr("x2", width)
        .attr("y1", price)
        .attr("y2", price)
        .attr("style", color);

  // Draw axis label

  vis.append("svg:text")
        .attr("class","priceAxisLabel")
        .attr("x", -50)
        .attr("y", price + 5)
        .attr("font-style","oblique")
        .text("P")

  // Add a star if at equilibrium

  if(show_as_equilibrium) {
    vis.append("svg:text")
      .attr("class","quantityAxisLabelDecoration")
      .attr("x", -43)
      .attr("y", price + 1)
      .attr("text-anchor","start")
      .attr("font-style","oblique")
      .attr("font-size",10)
      .text("*");
  }

  
  
  // Update quantity indicators

  updateQuantityIndicators(vis,data,show_supply,show_demand,market,at_equilibrium_price);
}