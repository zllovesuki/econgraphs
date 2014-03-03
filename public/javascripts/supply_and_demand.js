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

update();

function update(){

  /*
  Keep curves on graph
  */

  if (price[0] > maxPrice) { price[0] = maxPrice}; // Don't allow the price to go above maximum price
  if (price[0] < minPrice) { price[0] = minPrice}; // Don't allow the price to go below minimum price
  if (maxQuantityForCurve(curves[0]) > maxQuantity) {curves[0].intercept = maxQuantity};
  if (minQuantityForCurve(curves[0]) < minQuantity) {curves[0].intercept = minQuantity - priceAxisLength*curves[0].slope};
  if (minQuantityForCurve(curves[1]) < minQuantity) {curves[1].intercept = minQuantity};
  if (maxQuantityForCurve(curves[1]) > maxQuantity) {curves[1].intercept = maxQuantity - priceAxisLength*curves[1].slope};

  /*
  Establish equilibrium price. If close, snap to equilibrium.
  */

  var pe = equilibriumPrice(curves)
  if (Math.pow(y(price[0]) - y(pe), 2) < 10) { price[0] = pe }; // Snap to equilibrium
  

  /*
  Establish drag behavior using larger targets than the shown durves
  */

  var dragIntercept = d3.behavior.drag()
      .on("dragstart", function(d) {
            this.__origin__ = d.intercept;
          })
      .on("drag", function(d) {
            d.intercept = this.__origin__ += d3.event.dx*quantityAxisLength/width;
            update();
          })
      .on("dragend", function() {
            delete this.__origin__;
          });

  var dragPrice = d3.behavior.drag()
      .on("dragstart", function(d) {
            this.__origin__ = d;
          })
      .on("drag", function(d) {
            price[0] = this.__origin__ -= d3.event.dy*priceAxisLength/height;
            update();
          })
      .on("dragend", function() {
              delete this.__origin__;
          });
    

  var curveDraggers = vis.selectAll("line.curveDragger").data(curves)

      // set marker as line with class "demand"
      curveDraggers.enter().append("svg:line")
        .attr("class","curveDragger")
        .call(dragIntercept);

      // update coordinates
      curveDraggers
        .attr("x1", function(d) { return x(quantityAtPrice(minPrice,d))})
        .attr("y1", function(d) { return y(minPrice)})
        .attr("x2", function(d) { return x(quantityAtPrice(maxPrice,d))})
        .attr("y2", function(d) { return y(maxPrice)})

  var priceDragger = vis.selectAll("line.priceDragger").data(price);

      // set marker as thick invisible line with class PriceDragger
      priceDragger.enter()
        .append("svg:line")
          .attr("class","priceDragger")
          .call(dragPrice)

          // set line to extend from left boundary to right boundary
          .attr("x1", x(0.05*quantityAxisLength) )
          .attr("x2", x(maxQuantity) );

      // update vertical coordinate to current price
      priceDragger
        .attr("y1", function(d) { return y(d) })
        .attr("y2", function(d) { return y(d) });
    

  /* 
  Draw supply and demand curves
  */

  var curveLineIndicators = vis.selectAll("line.curve").data(curves)

      // set marker as line with class "demand"
      curveLineIndicators.enter().append("svg:line")
        .attr("class","curve")
        .call(dragIntercept);

      // update coordinates
      curveLineIndicators
        .attr("x1", function(d) { return x(quantityAtPrice(minPrice,d))})
        .attr("y1", function(d) { return y(minPrice)})
        .attr("x2", function(d) { return x(quantityAtPrice(maxPrice,d))})
        .attr("y2", function(d) { return y(maxPrice)})
        .attr("style", function(d) { return setColor(d.color)})


  var curveTextLabels = vis.selectAll("text.curveLabel").data(curves)

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

  var priceLineIndicator = vis.selectAll("line.price").data(price);

      // set marker as horizontal line with class price
      priceLineIndicator.enter()
        .append("svg:line")
          .attr("class","price")
          .call(dragPrice)
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

  var priceAxisLabel = vis.selectAll("text.priceAxisLabel").data(price)

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

  var quantityIndicators = vis.selectAll("circle.quantity").data(curves);

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

  var droplines = vis.selectAll("line.dropline").data(curves);

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

  var quantityAxisLabels = vis.selectAll("text.quantityAxisLabel").data(curves)

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

  if(price[0] == pe){

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
