
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'econgraphs.org' });
};

exports.demand = function(req, res){
  res.render('demand', { title: 'Individual and Market Demand' });
};

exports.indifference = function(req, res){
    res.render('indifference', { title: 'Indifference Curves' });
};

exports.about = function(req, res){
  res.render('about', { title: 'About EconGraphs' });
};