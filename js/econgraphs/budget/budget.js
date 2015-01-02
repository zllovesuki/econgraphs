econgraphs.functions.budget = {

    addBudgetMethods: function (b, params) {

        b.prices = b.prices || [];

        b.income = b.income || 0;

        b.bundle = b.bundle || [];

        b.setPrice = function(price, index) {
            b.prices[index] = price;
        };

        b.setPrices = function(prices) {
            b.prices = prices || b.prices;
            return b;
        };

        b.setIncome = function(income) {
            b.income = income || b.income;
            return b;
        };

        b.update = function(params) {
            if(params) {
                b.setPrices(params.prices);
                b.setIncome(params.income);
            }
        };

        // For now, b is a simple multiplication; could be adjusted for volume discounts, etc.
        b.expenditure = function(quantity,price) {
            return quantity * price;
        };

        b.cost = function(bundle,prices) {

            // used store prices (and potentially bundle) if none passed in
            bundle = bundle || b.bundle;
            prices = prices || b.prices;

            var totalCost = 0;

            for(var good=0; good < bundle.length; good++) {
                totalCost += b.expenditure(bundle[good], prices[good])
            }

            return totalCost;
        };

        b.isAffordable = function(bundle,prices,income) {

            // Use stored income if none passed in
            income = income || b.income;

            return (b.cost(bundle, prices) <= income)
        };

        b.area = function(xDomain,yDomain) {

            xDomain = domainAsObject(xDomain);
            yDomain = domainAsObject(yDomain);

            var areaPoints = [{x: xDomain.min, y:yDomain.min}];

            var constraintPoints = b.points(xDomain,yDomain).sort(sortObjects('x'));

            if(constraintPoints[0].y == yDomain.max) {
                areaPoints.push({x:xDomain.min, y:yDomain.max});
            }

            if (constraintPoints[1].x == xDomain.max) {
                constraintPoints.push({x: xDomain.max, y: yDomain.min});
            }

            return d3.merge([areaPoints,constraintPoints]);

        };

        b.update(params);

        return b;

    }

};