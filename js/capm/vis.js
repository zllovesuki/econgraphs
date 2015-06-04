function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
    var legendWidth  = 200,
        legendHeight = 100;

    // clipping to make sure nothing appears behind legend
    /*svg.append('clipPath')
        .attr('id', 'axes-clip')
        .append('polygon')
        .attr('points', (-margin.left)                 + ',' + (-margin.top)                 + ' ' +
        (chartWidth - legendWidth - 1) + ',' + (-margin.top)                 + ' ' +
        (chartWidth - legendWidth - 1) + ',' + legendHeight                  + ' ' +
        (chartWidth + margin.right)    + ',' + legendHeight                  + ' ' +
        (chartWidth + margin.right)    + ',' + (chartHeight + margin.bottom) + ' ' +
        (-margin.left)                 + ',' + (chartHeight + margin.bottom));*/

    var axes = svg.append('g')
        .attr('clip-path', 'url(#axes-clip)');

    axes.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .call(xAxis)
        .append('text')
                .attr('x', chartWidth)
                .attr('dy', '-0.2em')
                .style('text-anchor', 'end')
        .text('Year');

    axes.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 10)
        .attr('dy', '0.5em')
        .style('text-anchor', 'end')
        .text('Value');



    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(50, 10)');

    legend.append('rect')
        .attr('class', 'legend-bg')
        .attr('width',  legendWidth)
        .attr('height', legendHeight);

    legend.append('rect')
        .attr('class', 'outer')
        .attr('width',  75)
        .attr('height', 20)
        .attr('x', 10)
        .attr('y', 10);

    legend.append('text')
        .attr('x', 115)
        .attr('y', 25)
        .text('5% - 95%');

    legend.append('rect')
        .attr('class', 'inner')
        .attr('width',  75)
        .attr('height', 20)
        .attr('x', 10)
        .attr('y', 40);

    legend.append('text')
        .attr('x', 115)
        .attr('y', 55)
        .text('25% - 75%');

    legend.append('path')
        .attr('class', 'median-line')
        .attr('d', 'M10,80L85,80');

    legend.append('text')
        .attr('x', 115)
        .attr('y', 85)
        .text('Median');
}

function drawPaths (svg, data, x, y) {
    var upperOuterArea = d3.svg.area()
        .interpolate('basis')
        .x (function (d) { return x(d.date) || 1; })
        .y0(function (d) { return y(d.pct95); })
        .y1(function (d) { return y(d.pct75); });

    var upperInnerArea = d3.svg.area()
        .interpolate('basis')
        .x (function (d) { return x(d.date) || 1; })
        .y0(function (d) { return y(d.pct75); })
        .y1(function (d) { return y(d.pct50); });

    var medianLine = d3.svg.line()
        .interpolate('basis')
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.pct50); });

    var meanLine = d3.svg.line()
        .interpolate('basis')
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.mean); });

    var riskFreeLine = d3.svg.line()
        .interpolate('basis')
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.riskFree); });

    var lowerInnerArea = d3.svg.area()
        .interpolate('basis')
        .x (function (d) { return x(d.date) || 1; })
        .y0(function (d) { return y(d.pct50); })
        .y1(function (d) { return y(d.pct25); });

    var lowerOuterArea = d3.svg.area()
        .interpolate('basis')
        .x (function (d) { return x(d.date) || 1; })
        .y0(function (d) { return y(d.pct25); })
        .y1(function (d) { return y(d.pct05); });

    svg.datum(data);

    if(data[0].hasOwnProperty('allValues')) {
        for(var i=0;i<data[0].allValues.length;i++) {
            svg.append('path')
                .attr('class','draw-line')
                .attr('d', d3.svg.line()
                    .interpolate('basis')
                    .x(function(d) {return x(d.date)})
                    .y(function(d) {return y(d.allValues[i])}))
        }
    }

    svg.append('path')
        .attr('class', 'area upper outer')
        .attr('d', upperOuterArea);

    svg.append('path')
        .attr('class', 'area lower outer')
        .attr('d', lowerOuterArea);

    svg.append('path')
        .attr('class', 'area upper inner')
        .attr('d', upperInnerArea);

    svg.append('path')
        .attr('class', 'area lower inner')
        .attr('d', lowerInnerArea);

    svg.append('path')
        .attr('class', 'median-line')
        .attr('d', medianLine);

    svg.append('path')
        .attr('class', 'mean-line')
        .attr('d', meanLine);

    svg.append('path')
        .attr('class', 'risk-free-line')
        .attr('d', riskFreeLine);
}

function startTransitions (svg, chartWidth, chartHeight, rectClip, x) {
    rectClip.transition()
        .duration(5000)
        .attr('width', chartWidth);
}

function makeChart (data) {
    var svgWidth  = 960,
        svgHeight = 500,
        margin = { top: 20, right: 20, bottom: 40, left: 40 },
        chartWidth  = svgWidth  - margin.left - margin.right,
        chartHeight = svgHeight - margin.top  - margin.bottom;

    var x = d3.scale.linear().range([0, chartWidth])
            .domain([0, d3.max(data, function (d) { return d.date; })]),
        y = d3.scale.linear().range([chartHeight, 0])
            .domain([0, d3.max(data, function (d) { return d.pct75; })]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom')
            .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
        yAxis = d3.svg.axis().scale(y).orient('left')
            .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

    d3.select('#graph').select('svg').remove();
    var svg = d3.select('#graph').append('svg')
        .attr('width',  svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
    drawPaths(svg, data, x, y);
}