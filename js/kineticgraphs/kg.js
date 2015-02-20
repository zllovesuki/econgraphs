function test(n) {
    n = n || 2;
    return n + 1;
}

function calculateStep(min,max,samplePoints) {
    samplePoints = samplePoints || 51; // default to
    return(max - min)/(samplePoints - 1);
}

function inverse(n) {
    if(n == 'undefined') {
        return 0;
    } else if(n == 0) {
        return 'undefined'
    } else {
        return 1/n;
    }
}

function domainAsObject(domain) {
    if(domain.hasOwnProperty('min') && domain.hasOwnProperty('max')) {
        return domain;
    } else {
        return {min: domain[0], max: domain[1]};
    }
}

function pointAsObject(point) {
    return {x: point['x'] || point[0], y: point['y'] || point[1]};
}

function inRange(v, domain) {
    domain = domainAsObject(domain);
    if (v == 'undefined') {
        return false
    }
    return (v >= domain.min && v <= domain.max)
}

function onGraph(d,xDomain,yDomain){
    return (inRange(d.x,xDomain) && inRange(d.y, yDomain));
}

function sortObjects(key, descending) {
    return function (a, b) {
        var lower = descending ? a[key] : b[key],
            higher = descending ? b[key] : a[key];
        return lower > higher ? -1 : lower < higher ? 1 : lower <= higher ? 0 : NaN;
    }
}

function functionPoints(fn, xDomain, yDomain, params) {

    function getBoundary(minOrMax) {

        if (params.hasOwnProperty(minOrMax)) {
            return params[minOrMax]
        }

        if (dependentVariable == 'x') {
            return xDomain[minOrMax]
        }

        if (dependentVariable == 'y') {
            return yDomain[minOrMax]
        }

        return {min: 0, max: 100}[minOrMax];
    }

    xDomain = domainAsObject(xDomain);
    yDomain = domainAsObject(yDomain);

    var dependentVariable = params['dependentVariable'] || 'x',
        min = getBoundary('min'),
        max = getBoundary('max'),
        samplePoints = params['samplePoints'] || 51,
        step = calculateStep(min, max, samplePoints),
        points = [],
        candidatePoint = {x: 0, y: 0},
        ind = min;

    for (var i = 0; i < samplePoints; i++) {
        switch (dependentVariable) {
            case 'x':
                candidatePoint = {x: ind, y: fn(ind)}; // y as a function of x
                break;
            case 'y':
                candidatePoint = {x: fn(ind), y: ind}; // x as a function of y
                break;
            default:
                candidatePoint = pointAsObject(fn(ind)); // (x,y) as a function of t
        }
        if (candidatePoint.hasOwnProperty('x') && candidatePoint.hasOwnProperty('x') && onGraph(candidatePoint, xDomain, yDomain)) {
            points.push(candidatePoint);
        }
        ind += step;
    }

    return points;

}

var kg = { functions: {

    Generic: (function() {

        return function() {

            // Global setters

            this.setBases = function(bases) {
                if(bases) {
                    this.bases = bases;
                }
                if(!this.bases) {
                    this.bases = []
                }
                return this;
            };

            this.setLevel = function(level) {
                if(level instanceof Array) {
                    this.level = this.value(level)
                } else if(typeof level == 'number') {
                    this.level = level
                }
                return this;
            }

        }

    }())

} };