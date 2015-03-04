/* 
A linear function is a special polynomial defined either with two points or a point and a slope.
This function takes either of those and returns a polynomial of the form ax + by + c.
The params object is of the form: { definitionType: '', param1: foo, param2: bar }
*/

kg.functions.Linear = (function() {

    return function(params) {


        // Start with a polynomial of the form 0x - y = 0.

        var l = new kg.functions.Polynomial([
                {coefficient: 0, powers: [1,0]},
                {coefficient: -1, powers: [0,1]},
                {coefficient: 0, powers: [0,0]}
            ]);

        // Depending on the manner in which the function is parameterized,
        // The coefficients are determined in different ways and has different update functions

        switch(params.definitionType) {

            // {definitionType: 'slope-intercept', slope: #, intercept: #}
            // Given y = slope*x + intercept => slope*x + (-1)y + intercept = 0 
            // Note: this adds two methods to the object: setSlope, and setIntercept.
            case 'slope-intercept':

                l.setSlope = function(slope) {
                    l.slope = slope;
                    l.setCoefficient(1,slope);
                    return l;
                };

                l.setIntercept = function(intercept) {
                    l.intercept = intercept;
                    l.setCoefficient(3,intercept);
                    return l;
                };

                l.setSlope(params.slope).setIntercept(params.intercept);
                
                break;

            // {definitionType: 'point-slope', point{ x: #, y: #}, slope: #}
            // Given Y - y = slope(X - x) => slope*X - Y + (y - slope*x)
            // Note: this adds two methods to the object: updateSlope and updatePoint.
            case 'point-slope':

                l.slope = params.slope;
                l.point = params.point;

                l.setSlope = function(slope) {
                    l.slope = slope;
                    l.setCoefficient(1,slope).setCoefficient(3, l.point.y - l.slope*l.point.x);
                    return l;
                };

                l.setPoint = function(point) {
                    l.x = point.x;
                    l.y = point.y;
                    l.setCoefficient(3, l.y - l.slope*l.x);
                    return l;
                };

                l.setSlope(params.slope);
                l.setPoint(params.point);
                
                break;

            // {definitionType: 'point-point', points: [{x: #, y: #}, {x: #, y: #}]}
            case 'point-point':

                l.setPoints = function(points) {
                    var x1 = points[0].x,
                        x2 = points[1].x,
                        y1 = points[0].y,
                        y2 = points[1].y,
                        rise = y2 - y1,
                        run = x2 - x1;

                    // If x2 = x1, then it's a vertical line
                    if (run == 0) {
                        l.slope = 'undefined';
                        l.setCoefficient(1,1);
                        l.setCoefficient(2,0);
                        l.setCoefficient(3,-x1);
                        
                    } else {
                        l.slope = rise/run;
                        l.setCoefficient(1,l.slope);
                        l.setCoefficient(2,-1);
                        l.setCoefficient(3,y1 - l.slope*x1);    
                    }
                    return l;

                };

                l.setPoints(params.points);

                break;

            // {definitionType: 'standard', a: #, b: #, c: #} => f(x,y) = ax + by + c
            case 'standard':

                l.setCoefficients = function(coef) {
                    l.slope = -coef.a/coef.b;
                    l.setCoefficient(1, coef.a).setCoefficient(2, coef.b).setCoefficient(3, coef.c);
                };

                l.setCoefficients(params);

                break;
                
        }

        l.inverseSlope = function() {return inverse(l.slope)};

        l.a = function() { return l.terms[0].coefficient };
        l.b = function() { return l.terms[1].coefficient };
        l.c = function() { return l.terms[2].coefficient };

        l.yIntercept = function() {
            l.level = l.level || 0;
            if(l.b() == 0) {
                return 'undefined';
            } else {
                return (l.level-l.c())/l.b();
            }
        };

        l.xIntercept = function() {
            l.level = l.level || 0;
            if(l.a() == 0) {
                return 'undefined';
            } else {
                return (l.level-l.c())/l.a();
            }
        };

        l.yValue = function(x) {
            if(l.b() == 0) {
                return 'undefined';
            } else {
                return l.yIntercept() + l.slope*x;
            }
        };

        l.xValue = function(y) {
            if(l.a() == 0) {
                return 'undefined';
            } else {
                return l.xIntercept() + l.inverseSlope()*y;
            }
        };

        // Finds the two endpoints which define the segment of the line passing through
        // the rectangle defined by xDomain = {min: #, max: #} and yDomain = {min: #, max: #}
        l.points = function(xDomain,yDomain) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);
            
            var points = [];

            // Add intersection with bottom of vertical range,
            // if that point lies within the horizontal range.
            var xBottom = l.xValue(yDomain.min);
            if(inRange(xBottom, xDomain)) {
                points.push({x: xBottom, y: yDomain.min})
            }

            // Add intersection with top of vertical range,
            // if that point lies within the horizontal range.
            var xTop = l.xValue(yDomain.max);
            if(inRange(xTop, xDomain)) {
                points.push({x: xTop, y: yDomain.max})
            }

            if (points.length == 2) {
                return points.sort(sortObjects('x'));
            }

            // Add intersection with left border of horizontal range,
            // if that point lies within the vertical range.
            var yLeft = l.yValue(xDomain.min);
            if(inRange(yLeft, yDomain)) {
                if(points.length == 0 || points[0].x > xDomain.min){
                    points.push({x: xDomain.min, y: yLeft})
                }
            }

            if (points.length == 2) {
                return points.sort(sortObjects('x'));
            }

            // Add intersection with right border of horizontal range
            // if that point lies within the vertical range.
            var yRight = l.yValue(xDomain.max);
            if(inRange(yRight, yDomain)) {
                points.push({x: xDomain.max, y: yRight})
            }

            return points.sort(sortObjects('x'));
            
        };

        l.linearIntersection = function(ol,delta) {

            delta = delta || 0;

            var diffLine = new kg.functions.Linear({
                    definitionType: 'standard',
                    a: l.a()*ol.b()- l.b()*ol.a(),
                    b: l.b()*ol.b(),
                    c: ol.b()*l.c() - ol.c()*l.b() - delta
                }),
                x = diffLine.xIntercept(),
                y = l.yValue(x);

            /*delta = delta || 0;
            var x, y;

            if(l.b() == ol.b()) {
                x = (ol.c() - l.c())/(l.a() - ol.a());
                y = l.yValue(x)
            }

            else {
                y = (l.c() - ol.c() + l.a() - ol.a()) / (ol.b() - l.b());
                x = l.xValue(y)
            }*/

            return {x: x, y: y};
        };

        return l;

    }

}());