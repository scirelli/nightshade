//------------------------------------------------
// Determins in the parameter is a number
// @param: n - anything
// @return: boolean - true if n is a number false
//          otherwise
//------------------------------------------------
Math.isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//------------------------------------------------
// Generates a random number using Math.random()
// in the given range between min and max.
// @param: min - Integer; lower bounds
// @param: max - Integer; upper bounds
// @return: a random number between min and max
//------------------------------------------------
Math.randomRange = function ( min, max ){
    if( isNaN(min) || isNaN(max) ) return NaN;
    return Math.random()*(max-min)+min;
}
Math.choose = function( array ){
    return array[ Math.randomRange(0,array.length-1) ];
}

Math.rnd = function(){
    return (Math.rnd.state = (12345 + 1103515245*Math.rnd.state)%0x80000000)/0x80000000;
}

Math.rndSeed = function(seed){
    Math.rnd.state = seed ? seed : (new Date).getTime();
}
Math.rndSeed();
Math.rndRange = function(  min, max ){
    if( isNaN(min) || isNaN(max) ) return NaN;
    return Math.rnd()*(max-min)+min;
}

//------------------------------------------------
// Converts a byte to a hex number.
// @param: n - number; a number in the range of 
//   0 to 255.
//------------------------------------------------
Math.byte2Hex = function(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

module.exports = {};
