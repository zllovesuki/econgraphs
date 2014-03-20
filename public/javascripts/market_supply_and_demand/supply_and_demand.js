function quantityAtPrice(p,params) {
      return params.intercept + p*params.slope;
    }

    function equilibriumPrice(curves) {
      return (curves[0].intercept - curves[1].intercept)/(curves[1].slope - curves[0].slope);
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

// Establish general behavioral constants for this graph
function updateMarketCurves(vis,data) {

  updateSupplyCurve(vis,data);
  updateDemandCurve(vis,data);

}

function updateDemandCurve(vis,data) {

  intercept = data.demand.intercept;
  slope = data.demand.slope;
  color = setColor(demandColor);
  points = [
    { x : x(quantityAtPrice(maxPrice, data.demand)),
      y : y(maxPrice)},
    { x : x(quantityAtPrice(minPrice, data.demand)),
      y : y(minPrice)}];
  label_delta = 15;
  
  drawCurve(vis,points,label_delta,color,"demand");
  updateQuantityDemanded(vis,data);

}

function updateSupplyCurve(vis,data) {

  color = setColor(supplyColor);
  points = [
    { x : x(quantityAtPrice(minPrice, data.supply)),
      y : y(minPrice)},
    { x : x(quantityAtPrice(maxPrice, data.supply)),
      y : y(maxPrice)}];
  label_delta = -5;
  
  drawCurve(vis,points,label_delta,color,"supply");
  updateQuantitySupplied(vis,data);

}

function drawCurve(vis,points,label_delta,color,className) {

  // draw curve
  vis.append("svg:line")
    .attr("class", className + " curve")
    .attr("x1", points[0].x)
    .attr("y1", points[0].y)
    .attr("x2", points[1].x)
    .attr("y2", points[1].y)
    .attr("style", color)

  // label curve
  vis.append("svg:text")
    .attr("class","curveLabel")
    .attr("x", points[1].x)
    .attr("y", points[1].y + label_delta)
    .text(className);

}
