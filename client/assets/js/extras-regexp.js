RegExp.escape = function(str){
  var specials = /[.*+?|()\[\]{}\\$^]/g; // .*+?|()[]{}\$^
  return str.replace(specials, "\\$&");
}
