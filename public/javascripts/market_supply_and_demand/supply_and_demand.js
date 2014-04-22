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
function updateMarketCurves(graph,data,show_supply,show_demand,market) {

  if(show_supply) updateSupplyCurve(graph,data,market);
  if(show_demand) updateDemandCurve(graph,data,market);

}

function updateDemandCurve(graph,data,market) {

  var number = market ? data.consumers/1000 : 1,
      color = demandColor,
      points = [],
      label_delta = 15;

  for(var p = minPrice; p <= maxPrice; p += 0.25) {
    var qd = quantityDemandedAtPrice(p, data, number);
    if (graph.x(qd) <= graph.width) { points.push({ x : graph.x(qd),y : graph.y(p)}) }
  }
  
  drawCurve(graph,points,label_delta,color,"demand");

}

function updateSupplyCurve(graph,data,market) {

  var number = 1, // can update later if have number of firms as a variable
      color = supplyColor,
      points = [],
      label_delta = 15;

  for(var p = maxPrice; p >= minPrice; p -= 0.25) {
    points.push({ x : graph.x(quantitySuppliedAtPrice(p, data, number)),
      y : graph.y(p)})
  }

  drawCurve(graph,points,label_delta,color,"supply");

}

