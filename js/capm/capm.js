var app = angular.module('MyApp', []);

app.controller('Controller', function ($scope) {
    
    $scope.params = {
        beta: 1,
        rf: 0.01,
        T: 7,
        sigma: 0.17,  // historic volatility of US market
        MRP: 0.06,
        S0: 1,
        numDraws: 10,
        showDraws: false
    };

    function debounce(fn,time) {
        var timerID;
        return function() {
            var self = this;
            var args = arguments;
            if(timerID) {
                clearTimeout(timerID)
            }
            timerID = setTimeout(function(){
                fn.apply(self,args)
            },time)
        }
    }

    // create a 121 x numDraws matrix of shocks
    function updateShocks() {

        var numDraws = 1000; // can set to $scope.params.numDraws
        var T = 50; // can set to $scope.params.T

        $scope.epsilon = new Array(numDraws);

        // for each stock
        for(var s=0; s<numDraws; s++) {

            // initialize with shock of zero in period 0
            var stock_shocks = new Array(T*12 + 1);

            stock_shocks[0] = 0;

            // generate an array of 120 shocks (values of epsilon) ~ N(0,1)
            for(var t=1; t<=T*12; t++) {
                stock_shocks[t] = d3.random.normal(0,1)();
            }
            $scope.epsilon[s] = stock_shocks;
        }
    }

    updateShocks();

    function stockData(params, epsilon_array) {
        
        // initialize with a stock value of S0 in period 0
        var stock_values = new Array(12*params.T + 1), sum = 0;

        stock_values[0] = params.S0;

        for(var t=1; t<=12*params.T; t++) {
            sum += epsilon_array[t];
            stock_values[t] = params.S0*Math.exp((params.t_coeff * t) + (params.sum_coeff * sum ));
        }
        return stock_values;
    }

    function generateData(params, shocks) {

        var rfcc = Math.log(1 + params.rf),
            MRPcc = Math.log(1 + params.MRP),
            betacc = [Math.log(1 + params.rf + (params.beta*params.MRP)) - rfcc ] / MRPcc;

        var stockValueParams = {
            t_coeff: (rfcc + betacc*MRPcc - 0.5*Math.pow(betacc*params.sigma,2))/12,
            sum_coeff: betacc * params.sigma * Math.pow(12,-0.5),
            S0: params.S0,
            T: params.T
        };
        
        var data_matrix = new Array(params.numDraws);
        for(var s=0; s<params.numDraws; s++) {
            data_matrix[s] = stockData(stockValueParams, shocks[s]);
        }
        return data_matrix;
    }

    function riskFreeInPeriod(t) {
        var rfcc = Math.log(1+$scope.params.rf);
        return $scope.params.S0*Math.exp(rfcc*t/12)
    }

    function valuesInPeriod(data_matrix,t) {
        return data_matrix.map(function(stock_values){return stock_values[t]});
    }

    $scope.plotdata = function(data_matrix, showDraws) {
        var data_array = [],
            vt = [];
        for(var t=0; t<=12*$scope.params.T; t++) {
            vt = valuesInPeriod(data_matrix,t).sort(d3.ascending);
            data_array[t] = {
                date: t/12,
                pct05: d3.quantile(vt,0.05),
                pct25: d3.quantile(vt,0.25),
                pct50: d3.quantile(vt,0.50),
                pct75: d3.quantile(vt,0.75),
                pct95: d3.quantile(vt,0.95),
                mean: d3.mean(vt),
                riskFree: riskFreeInPeriod(t)
            };
            if(showDraws) {data_array[t].allValues = valuesInPeriod(data_matrix,t)}
        }
        return data_array;
    };

    function update() {
        $scope.params.beta = parseFloat($scope.params.beta);
        $scope.params.rf = parseFloat($scope.params.rf);
        $scope.params.T = parseInt($scope.params.T);
        $scope.params.sigma = parseFloat($scope.params.sigma);
        $scope.params.MRP = parseFloat($scope.params.MRP);
        var d = new Date().getTime();
        $scope.data = generateData($scope.params, $scope.epsilon);
        console.log("generateData time ", (new Date().getTime() - d)/1000, "s");
        makeChart($scope.plotdata($scope.data, $scope.params.showDraws));

    }
    //$scope.data = generateData($scope.params, $scope.epsilon);
    $scope.$watchCollection('params', debounce(update,100));

    $scope.updateShocks = function() {
        updateShocks();
        update();
    };

    update();
    
});