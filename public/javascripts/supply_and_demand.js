// Establish general behavioral constants for this graph

var r = "8px",
    priceAxisLength = 100,
    quantityAxisLength = 100,
    maxPrice = 0.95*priceAxisLength,
    minPrice = 0.05*priceAxisLength,
    maxQuantity = 0.95*quantityAxisLength,
    minQuantity = 0.05*quantityAxisLength;

// Establish supply and demand functions

function quantityAtPrice(p,params) {
  return params.intercept + p*params.slope;
}

function equilibriumPrice(curves) {
  return (curves[0].intercept - curves[1].intercept)/(curves[1].slope - curves[0].slope);
}

function setColor(color) {
  return "stroke:" + color + "; fill:" + color
}

function minQuantityForCurve(curveParams) {
  if (curveParams.curveType == "demand") {
    return curveParams.intercept + priceAxisLength*curveParams.slope;
  } else {
    return curveParams.intercept;
  }
}

function maxQuantityForCurve(curveParams) {
  if (curveParams.curveType == "demand") {
    return curveParams.intercept;
  } else {
    return curveParams.intercept + priceAxisLength*curveParams.slope;
  }
}

function update(vis,scope){

  price = scope.price;
  supply = scope.supply;
  demand = scope.demand;

  priceData = [price];
  curveData = [demand,supply];

  /*
  Keep curves on graph
  */

  if (price > maxPrice) { price = maxPrice}; // Don't allow the price to go above maximum price
  if (price < minPrice) { price = minPrice}; // Don't allow the price to go below minimum price
  if (maxQuantityForCurve(demand) > maxQuantity) {demand.intercept = maxQuantity};
  if (minQuantityForCurve(demand) < minQuantity) {demand.intercept = minQuantity - priceAxisLength*demand.slope};
  if (minQuantityForCurve(supply) < minQuantity) {supply.intercept = minQuantity};
  if (maxQuantityForCurve(supply) > maxQuantity) {supply.intercept = maxQuantity - priceAxisLength*supply.slope};

  /*
  Establish equilibrium price. If close, snap to equilibrium.
  */

  var pe = equilibriumPrice(curveData)
  if (Math.pow(y(price) - y(pe), 2) < 10) { price[0] = pe }; // Snap to equilibrium
  
  /* 
  Draw supply and demand curves
  */

  var curveLineIndicators = vis.selectAll("line.curve").data(curveData)

      // set marker as line with class "demand"
      curveLineIndicators.enter().append("svg:line")
        .attr("class","curve");

      // update coordinates
      curveLineIndicators
        .attr("x1", function(d) { return x(quantityAtPrice(minPrice,d))})
        .attr("y1", function(d) { return y(minPrice)})
        .attr("x2", function(d) { return x(quantityAtPrice(maxPrice,d))})
        .attr("y2", function(d) { return y(maxPrice)})
        .attr("style", function(d) { return setColor(d.color)})


  var curveTextLabels = vis.selectAll("text.curveLabel").data(curveData)

      // set text
      curveTextLabels.enter().append("svg:text")
        .attr("class","curveLabel")
        .text(function(d) {return d.curveType});

      // set coordinates
      curveTextLabels
        .attr("x", function(d) { return x(maxQuantityForCurve(d))})
        .attr("y", function(d) {
          if (d.curveType == "demand") {return y(minPrice) + 15}
            else { return y(maxPrice) - 5}
        })
        

  /*
  Draw line for price
  */

  var priceLineIndicator = vis.selectAll("line.price").data(priceData);

      // set marker as horizontal line with class price
      priceLineIndicator.enter()
        .append("svg:line")
          .attr("class","price")
          // set line to extend from left boundary to right boundary
          .attr("x1", -35 )
          .attr("x2", x(maxQuantity) )

      // update vertical coordinate to current price
      priceLineIndicator
        .attr("y1", function(d) { return y(d) })
        .attr("y2", function(d) { return y(d) });

  /*
  Label price line
  */

  var priceAxisLabel = vis.selectAll("text.priceAxisLabel").data(priceData)

      // set text to display along axis
      priceAxisLabel.enter().append("svg:text")
        .attr("class","priceAxisLabel")
        .attr("x", -50)  

      // set vertical coordinate and text value
      priceAxisLabel
        .attr("y", function(d) { return y(d) + 5 })
        .text(function(d) {
          if (d == pe) {return "P*"} else { return "P"} // include * if at equilibrium
        });


  /*
  Draw dots for quantity demanded and supplied at price
  */

  var quantityIndicators = vis.selectAll("circle.quantity").data(curveData);

      // set marker as circle with class "quantity"
      quantityIndicators.enter()
        .append("svg:circle")
          .attr("class","quantity")
          .attr("r",r);

      // update current coordinates to (q(p), p)
      quantityIndicators
        .attr("cx", function(d) { return x(quantityAtPrice(price,d)) })
        .attr("cy", function(d) { return y(price) });

  /*
  Draw dropline for quantities demanded and supplied at price
  */

  var droplines = vis.selectAll("line.dropline").data(curveData);

      // set marker as line with class "dropline"
      droplines.enter()
        .append("svg:line")
          .attr("class","dropline")

      // update current coordinates to [(q(p), 0), (q(p), p)]
      droplines
        .attr("x1", function(d) { return x(quantityAtPrice(price,d)) })
        .attr("y1", function(d) { return height + 25 }) // drop a little below the axis
        .attr("x2", function(d) { return x(quantityAtPrice(price,d)) })
        .attr("y2", function(d) { return y(price) });
  
  /*
  Label quantities supplied and demanded
  */

  var quantityAxisLabels = vis.selectAll("text.quantityAxisLabel").data(curveData)

      // set text to display along axis
      quantityAxisLabels.enter().append("svg:text")
        .attr("class","quantityAxisLabel")
        .attr("y", height + 40)
        .attr("text-anchor","middle")   

      // set vertical coordinate and text value
      quantityAxisLabels
        .attr("x", function(d) { 
          var truePosition = x(quantityAtPrice(price,d))
          var equilibriumPosition = x(quantityAtPrice(pe,d))
          if (truePosition < equilibriumPosition) {
            return truePosition - 5
          } else if (truePosition > equilibriumPosition) {
            return truePosition + 5
          } else {
            return truePosition
          }
        })
        .text(function(d) {
          if (price == pe)
            { return "Q*" }
          else if (d.curveType == "demand")
            { return "QD" }
          else
            { return "QS" }
        });

  /*
  Add colors
  */

  if(price == pe){

      // color everything green if at equilibrium
      quantityIndicators.attr("style", setColor(equilibriumColor));
      droplines.attr("style", setColor(equilibriumColor));
      priceLineIndicator.attr("style", setColor(equilibriumColor));
      
    } else {

      // color everything the appropriate color otherwise
      quantityIndicators.attr("style", function(d) { return setColor(d.color)});
      droplines.attr("style", function(d) { return setColor(d.color)});
      priceLineIndicator.attr("style", setColor(priceColor)); 

    }

}
