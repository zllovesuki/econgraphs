    function quantityDemandedAtPrice(p,data,number) {
      return (number * data.alpha * data.income) / (100 * p)
    }

    function quantitySuppliedAtPrice(p,data,number) {
      return (10 + p*0.6)*number; // hard coded for now
    }

    function equilibriumPrice(data) {
      for(p = minPrice; p <= maxPrice; p++) {
        qd = quantityDemandedAtPrice(p, data, data.consumers/1000);
        qs = quantitySuppliedAtPrice(p, data, 1);
        var percent_difference = Math.abs(qd - qs)/qd;
        if(percent_difference < 0.05) {return p}
      };
      return 0;
  
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
function updateMarketCurves(vis,data,show_supply,show_demand,market) {

  if(show_supply) updateSupplyCurve(vis,data,market);
  if(show_demand) updateDemandCurve(vis,data,market);

}

function updateDemandCurve(vis,data,market) {

  number = market ? data.consumers/1000 : 1;
  color = demandColor;
  points = []
  for(p = minPrice; p <= maxPrice; p += 0.25) {
    qd = quantityDemandedAtPrice(p, data, number);
    if (x(qd) <= width) { points.push({ x : x(qd),y : y(p)}) };
  };
  label_delta = 15;
  
  drawCurve(vis,points,label_delta,color,"demand");

}

function updateSupplyCurve(vis,data,market) {

  number = 1; // can update later if have number of firms as a variable
  color = supplyColor;
  points = []
  for(p = maxPrice; p >= minPrice; p -= 0.25) {
    points.push({ x : x(quantitySuppliedAtPrice(p, data, number)),
      y : y(p)})
  };
  label_delta = -5;
  
  drawCurve(vis,points,label_delta,color,"supply");

}

var curveFunction = d3.svg.line()
    .x(function(d) {return d.x;}).y(function(d) {return d.y;}).interpolate("linear");

function drawCurve(vis,points,label_delta,color,className) {

  // draw curve
  vis.append("svg:path")
    .attr("class", className + " curve")
    .attr("d", curveFunction(points))
    .attr("stroke",color)
    .attr("fill","none")
    

  // label curve
  vis.append("svg:text")
    .attr("class","curveLabel")
    .attr("x", points[0].x)
    .attr("y", points[0].y + label_delta)
    .text(className);

}
