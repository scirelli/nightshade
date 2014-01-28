function Point( x,y,z ){
    'use strict';
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Point.prototype.toString = function(){
    'use strict';
    return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
};
module.exports = Point;
