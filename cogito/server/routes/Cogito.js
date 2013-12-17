module.exports = function() {

  function index(req, res) {
    res.render('cogito.jade'); 
  }

  function cogito(req, res) {
    res.render('cogito.jade');
  }

  return {
    index: index,
    cogito: cogito 
  };
}