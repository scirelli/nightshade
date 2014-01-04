//*****************************************
// Author: Steve Cirelli
// File Desc: 
//*****************************************
if( !Function.delay ){
    Function.prototype.delay = function( nTime ){
        var __method = this,
            args     = Array.prototype.slice.call( arguments, 1 );
        return window.setTimeout( function(){ 
            return __method.apply( __method, args );}, 
            nTime 
        );
    }
}

if( !Function.delay2 ){
    Function.prototype.delay2 = function( nTime, oScope ){
        var __method = this,
            args     = Array.prototype.slice.call( arguments, 2 );
        return window.setTimeout( function(){ 
                return __method.apply( oScope, args );
            }, 
            nTime 
        );
    }
}
if( !Function.defer ){
    Function.prototype.defer = function(){
        var args = new Array();
        args.push( 0.01 );
        for( var i=0, l=arguments.length,itm=null; i<l; i++ ){
            args.push( arguments[i] );
        }
        this.delay.apply(this, args );
    }
}

if( !Function.defer2 ){
    Function.prototype.defer2 = function( scope ){
        var args = Array.prototype.slice.call( arguments, 1 ),
            func = this;
        scope = scope || window;
        return window.setTimeout( function(){
            func.apply( scope, args );
        }, 0 );
    }
}
