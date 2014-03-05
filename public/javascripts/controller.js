// create module for custom directives
var econgraphsApp = angular.module('econgraphsApp', []);

// controller business logic
econgraphsApp.controller('Controller', function($scope){

    $scope.price = 25;

    $scope.supply = {
      curveType: "supply",
      intercept: 10, //quantity supplied when price is zero
      slope: 0.6,     //increase in quantity supplied per unit increase in price
      color: supplyColor
    }

    $scope.demand = {
      curveType: "demand",
      intercept: 80, //quantity demanded when price is zero
      slope: -0.4,    //reduction in quantity demanded per unit increase in price
      color: demandColor
    }
    
    $scope.$watch("price",function(){
        d3.select('svg').remove();      
        var margin = {top: 10, right: 100, bottom: 100, left: 100},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    r = "8px",
    maxPrice = 0.95*priceAxisLength,
    minPrice = 0.05*priceAxisLength,
    maxQuantity = 0.95*quantityAxisLength,
    minQuantity = 0.05*quantityAxisLength;

var x = d3.scale.linear()
            .range([0, width])
            .domain([0, quantityAxisLength]);

var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, priceAxisLength]);

var vis = d3.select("#graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add x axis
var x_axis = vis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.svg.axis().scale(x).orient("bottom"));

    // Label x axis
    x_axis.append("text")
        .attr("x", width / 2 )
        .attr("y", "4em")
        .style("text-anchor", "middle")
        .text("Quantity");

// Add y axis
var y_axis = vis.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));

    // Label y axis
    y_axis.append("text")
        .attr("transform","rotate(-90)")
        .attr("x", -height / 2 )
        .attr("y", "-3em")
        .style("text-anchor", "middle")
        .text("Price");

update(vis,$scope);
        

})});

