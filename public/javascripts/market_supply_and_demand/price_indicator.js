function updatePrice(vis,data){

  price = y(data.price);
  label = (data.price == data.equilibriumPrice) ? "P*" : "P"
  color = (data.price == data.equilibriumPrice) ? setColor(equilibriumColor) : setColor(priceColor);

  // Draw line for price
  
  vis.append("svg:line")
        .attr("class","price")
        // set line to extend from left boundary to right boundary
        .attr("x1", -35 )
        .attr("x2", x(maxQuantity) )
        .attr("y1", price)
        .attr("y2", price)
        .attr("style", color);

  // Draw ais label

  vis.append("svg:text")
        .attr("class","priceAxisLabel")
        .attr("x", -50)
        .attr("y", price + 5)
        .text(label)
  
  // Update quantity indicators

  updateQuantityIndicators(vis,data);
}