kgAngular.service('D3Helpers', function () {


    this.drawCircles = function (data, circles) {

        circles = circles.data(data);
        circles.exit().remove();
        circles.enter().append('circle');
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
            })
            .attr('r', function (d) {
                return d.r || 10;
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

    this.configLabel = function(labelParams) {


        var width = labelParams['width'] || 100,
            xOffset = labelParams['xOffset'] || 0,
            yOffset = labelParams['yOffset'] || 0,
            xCoord = labelParams['point']['x'] || labelParams['point'][0] || 0,
            yCoord = labelParams['point']['y'] || labelParams['point'][1] || 0,
            x = labelParams['graph'].x(xCoord) + xOffset,
            y = labelParams['graph'].y(yCoord) + yOffset - 20,
            align = labelParams['align'] || 'left';
        if(align == 'right') {
            x -= width;
        }
        if(align == 'center') {
            x -= 0.5*width;
        }
        return {
            html: labelParams['html'],
            x: x,
            y: y,
            align: align,
            width: width,
            math: true,
            size: '16pt'
        }
    };

    this.drawDivs = function(data,divs) {

        divs = divs.data(data);
        divs.exit().remove();
        divs.enter().append("div");
        divs
            .attr("class", function(d) {
                return d.math ? 'katex' : "";
            })
            .attr("style", function (d) {
                return "position: absolute; font-size: " + d.size + "; text-align: "+ d.align + "; left: " + d.x + "px; top: " + d.y + "px; color: " + d.color + "; width: " + d.width + "px";
            })
            .text(function(d) { return d.html});

        for (var i = 0; i < data.length; i++) {
            if (false != data[i].math) {
                var element = divs[0][i],
                    text = element.innerText;
                katex.render(text, element)
            }
        }

        return divs;
    };


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