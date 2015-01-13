kgAngular.service('D3Helpers', function () {


    this.drawCircles = function (data, circles) {

        circles = circles.data(data);
        circles.exit().remove();
        circles.enter().append('circle').attr('r', 10);
        circles
            .attr('cx', function (d) {
                return d.cx
            })
            .attr('cy', function (d) {
                return d.cy
            })
            .attr('stroke', function(d) {
                return d.color
            })
            .attr('fill', function (d) {
                return d.color
            });
        return circles;

    };


    this.drawLines = function (data, lines) {

        lines = lines.data(data);
        lines.exit().remove();
        lines.enter().append('line')
            .attr('class', function(d) {
                return d.class
            });
        lines
            .attr('x1', function (d) {
                return d.x1
            })
            .attr('y1', function (d) {
                return d.y1
            })
            .attr('x2', function (d) {
                return d.x2
            })
            .attr('y2', function (d) {
                return d.y2
            })
            .attr('stroke-width', 2)
            .attr('stroke', function (d) {
                return d.color || '#666666'
            });

        return lines;

    };

    this.drawRects = function (data, rects) {

        rects = rects.data(data);
        rects.exit().remove();
        rects.enter().append('rect')
            .attr('class', function (d) {
                return d.class
            })
            .attr('fill-opacity', 0.3);;
        rects
            .attr('x', function (d) {
                return d.x
            })
            .attr('y', function (d) {
                return d.y
            })
            .attr('width', function (d) {
                return d.width
            })
            .attr('height', function (d) {
                return d.height
            })
            .attr('style', function(d) {
                return 'fill:' + d.color
            });

        return rects;

    };


    this.drawCurves = function (data,curves) {

        curves = curves.data(data);
        curves.exit().remove();
        curves.enter().append('svg:path').attr('fill','none');
        curves
            .attr('stroke-width', 2)
            .attr('stroke', function (d) {
                return d.color || '#666666'
            })
            .attr('d', function (d) {
                return d.points
            });
        return curves;

    };


    this.drawAreas = function(data,areas) {

        areas = areas.data(data);
        areas.exit().remove();
        areas.enter().append('svg:path')
            .attr('fill-opacity', 0.3);
        areas
            .attr('d', function (d) {
                return d.points
            })
            .attr('fill', function (d) {
                return d.color
            });
        return areas;

    };


    this.drawTexts = function (data,texts) {

        texts = texts.data(data);
        texts.exit().remove();
        texts.enter().append("svg:text");
        texts
            .attr("x", function (d) {
                return d.x
            })
            .attr("y", function (d) {
                return d.y
            })
            .attr("text-anchor", function (d) {
                return d.anchor
            })
            .attr("fill", function (d) {
                return d.color
            })
            .attr("font-size", 14)
            .attr("font-style", "oblique")
            .text(function (d) {
                return d.text
            });

        return texts;

    };


    this.drawAxes = function() {

    }


    this.addAxes = function(graph,x_axis,y_axis) {

        graph.xDomain = [x_axis.min || 0, x_axis.max || 10];
        graph.yDomain = [y_axis.min || 0, y_axis.max || 10];

        // Create the D3 scales for the x and y dimensions
        graph.x = d3.scale.linear()
            .range([0, graph.width])
            .domain(graph.xDomain);
        graph.y = d3.scale.linear()
            .range([graph.height, 0])
            .domain(graph.yDomain);

        graph.curveFunction = d3.svg.line()
            .x(function (d) {
                return graph.x(d.x);
            }).y(function (d) {
                return graph.y(d.y);
            }).interpolate("linear");

        graph.verticalArea = d3.svg.area()
            .x(function (d) {
                return graph.x(d.x);
            })
            .y0(function (d) {
                return graph.y(d.y0);
            })
            .y1(function (d) {
                return graph.y(d.y1);
            });

        graph.horizontalArea = d3.svg.area()
            .x0(function (d) {
                return graph.x(d.x0);
            })
            .x1(function (d) {
                return graph.x(d.x1);
            })
            .y(function (d) {
                return graph.y(d.y);
            });

        return graph;

    }

});