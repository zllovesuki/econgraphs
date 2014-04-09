
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'econgraphs.org' });
};

exports.demand = function(req, res){
  res.render('demand', { title: 'Individual and Market Demand' });
};

exports.about = function(req, res){
  res.render('about', { title: 'About EconGraphs' });
};