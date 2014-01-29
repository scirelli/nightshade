var Shape = require('./shape.js'),
    Point = require('./point.js'),
    o     = require('../../Math');

function Circle( x, y, r ){
    'use strict';
    this.METERS_PER_DEGREE_AT_EQUATOR = 111300.0;//111,300 meters in 1 degree (Geographic coordinates)
    this.center = new Point();
    this.radius = 1.0;//In meters
    
    if( x instanceof Point ){
        this.center = x;
        this.radius = y;
    }else if( isNaN(x) || isNaN(y) ){
        //do nothing
    }else{
        this.center = new Point(x,y);
        this.radius = r;
    }
}

Circle.prototype.area = function(){
    'use strict';
    return 2*Math.PI * this.radius; 
};

Circle.prototype.radiusToDegrees = function(){
    'use strict';
    return this.radius/this.METERS_PER_DEGREE_AT_EQUATOR;//1 degree / 111300 meters
};

Circle.prototype.randPoint = function(){
    'use strict';
    var u = Math.random(),//random number one
        v = Math.random(),//random number two
        w = this.radiusToDegrees() * Math.sqrt(u), //sqrt unbiases the distance; without it, too many points would appear too close to the origin. This is a consequence of the "Pizza principle", which implies that fully half the points would appear within just one-quarter of the area if you did not take the square root.
        t = 2.0 * Math.PI * v,//Some random point around the circle
        x = w * Math.cos(t),
        x1 = x / Math.cos(this.center.y),
        y = w * Math.sin(t);

     return new Point(x1+this.center.x, y+this.center.y);
};

Circle.prototype.toString = function(){
    'use strict';
    return this.center.toString() + ' r: ' + this.radius;
};

module.exports = Circle;

