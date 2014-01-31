var Point  = require('./lib/point.js'),
    Shape  = require('./lib/shape.js'),
    Rect   = require('./lib/rectangle.js'),
    Circle = require('./lib/circle.js');

console.log( new Rect() );
console.log( new Rect(1,1,1,1) );
console.log( new Rect(new Point(2,2), new Point(3,3)) );
console.log( (new Rect(new Point(2,2), new Point(3,3))).area() );
console.log( (new Rect(new Point(2,2), new Point(3,3))).randPoint() );

var r = new Rect(new Point(-2,-2), new Point(-3,-3));
console.log(r.toString());
console.log(r.randPoint().toString());

console.log( (new Circle(new Point(), 10)).toString() );
var c = new Circle( 38.915479,-77.107729, 1609.34 );
console.log( c.toString() );

for( var i=0,l=100,p=null; i<l; i++ ){
    p = c.randPoint();
    console.log( p.x + ',' + p.y );
}

