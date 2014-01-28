var Shape = require('./shape.js'),
    Point = require('./point.js'),
    o     = require('../../Math');

function Rect( x1, y1, x2, y2 ){
    'use strict';

    this.topLeft = new Point();
    this.botRight = new Point();
    
    if( x1 instanceof Point && y1 instanceof Point ){
        this.topLeft = x1;
        this.botRight = y1;
    }else if( isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) ){
        //do nothing
    }else{
        this.topLeft = new Point(x1,y1);
        this.botRight = new Point(x2,y2);
    }
    this.width  = Math.abs(this.topLeft.x-this.botRight.x);
    this.height = Math.abs(this.topLeft.y-this.botRight.y);
}

Rect.prototype.getWidth = function(){
    'use strict';
    return this.width;
};

Rect.prototype.getHeight = function(){
    'use strict';
    return this.height;
};

Rect.prototype.area = function(){
    'use strict';
    return this.width * this.height;
};

Rect.prototype.randPoint = function(){
    'use strict';
    return new Point(
        Math.randomRange( this.topLeft.x, this.botRight.x),
        Math.randomRange( this.topLeft.y, this.botRight.y)
    );
};

Rect.prototype.toString = function(){
    'use strict';
    return this.topLeft.toString() + ' ' + this.botRight.toString();
};

module.exports = Rect;
