var minPrice = 5,
    maxPrice = 55;

function updatePrice(graph,data,show_supply,show_demand,market){

  var price = graph.y(data.price),
      at_equilibrium_price = (data.price == data.equilibriumPrice),
      show_as_equilibrium = (market && at_equilibrium_price),
      color = show_as_equilibrium ? setColor(equilibriumColor) : setColor(priceColor);

  drawHorizontalDropline(graph,"max",data.price,color,"price")

  // Draw axis label

  graph.vis.append("svg:text")
        .attr("class","priceAxisLabel")
        .attr("x", -50)
        .attr("y", price + 5)
        .attr("font-style","oblique")
        .text("P")

  // Add a star if at equilibrium

  if(show_as_equilibrium) {
    graph.vis.append("svg:text")
      .attr("class","quantityAxisLabelDecoration")
      .attr("x", -43)
      .attr("y", price + 1)
      .attr("text-anchor","start")
      .attr("font-style","oblique")
      .attr("font-size",10)
      .text("*");
  }

  
  
  // Update quantity indicators

  updateQuantityIndicators(graph,data,show_supply,show_demand,market,at_equilibrium_price);
}