    function quantityDemandedAtPrice(p,data,number) {
      return (number * data.alpha * data.income) / (100 * p)
    }

    function quantitySuppliedAtPrice(p,data,number) {
      return (10 + p*0.6)*number; // hard coded for now
    }

    function equilibriumPrice(data) {
      for(var p = minPrice; p <= maxPrice; p++) {

        var qd = quantityDemandedAtPrice(p, data, data.consumers/1000),
            qs = quantitySuppliedAtPrice(p, data, 1),
            percent_difference = Math.abs(qd - qs)/qd;

        if(percent_difference < 0.05) {return p}
      }
      return 0;
  
    }

// Establish general behavioral constants for this graph
function updateMarketCurves(vis,data,show_supply,show_demand,market) {

  if(show_supply) updateSupplyCurve(vis,data,market);
  if(show_demand) updateDemandCurve(vis,data,market);

}

function updateDemandCurve(vis,data,market) {

  var number = market ? data.consumers/1000 : 1,
      color = demandColor,
      points = [],
      label_delta = 15;

  for(var p = minPrice; p <= maxPrice; p += 0.25) {
    var qd = quantityDemandedAtPrice(p, data, number);
    if (vis.x(qd) <= vis.width) { points.push({ x : vis.x(qd),y : vis.y(p)}) }
  }
  
  drawCurve(vis,points,label_delta,color,"demand");

}

function updateSupplyCurve(vis,data,market) {

  var number = 1, // can update later if have number of firms as a variable
      color = supplyColor,
      points = [],
      label_delta = 15;

  for(var p = maxPrice; p >= minPrice; p -= 0.25) {
    points.push({ x : vis.x(quantitySuppliedAtPrice(p, data, number)),
      y : vis.y(p)})
  }

  drawCurve(vis,points,label_delta,color,"supply");

}

var curveFunction = d3.svg.line()
    .x(function(d) {return d.x;}).y(function(d) {return d.y;}).interpolate("linear");

function drawCurve(vis,points,label_delta,color,className) {

  // draw curve
  vis.graph.append("svg:path")
    .attr("class", className + " curve")
    .attr("d", curveFunction(points))
    .attr("stroke",color)
    .attr("fill","none");

  // label curve
  vis.graph.append("svg:text")
    .attr("class","curveLabel")
    .attr("x", points[0].x)
    .attr("y", points[0].y + label_delta)
    .text(className);

}
