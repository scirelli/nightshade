module.exports = function() {

  function index(req, res) {
    res.render('cogito.jade'); 
  }

  function cogito(req, res) {
    res.render('cogito.jade');
  }

  function mobile(req, res) {
    res.render('mobile.jade');
  }

  return {
    index: index,
    cogito: cogito,
    mobile: mobile
  };
};