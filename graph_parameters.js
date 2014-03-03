var priceAxisLength = 100,
    quantityAxisLength = 100,
    price = [60],
    curves = [{
      curveType: "demand",
      intercept: 80, //quantity demanded when price is zero
      slope: -0.4,    //reduction in quantity demanded per unit increase in price
      color: demandColor
    },{
      curveType: "supply",
      intercept: 10, //quantity supplied when price is zero
      slope: 0.6,     //increase in quantity supplied per unit increase in price
      color: supplyColor
    }];
    