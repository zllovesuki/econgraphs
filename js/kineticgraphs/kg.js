function test(n) {
    n = n || 2;
    return n + 1;
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