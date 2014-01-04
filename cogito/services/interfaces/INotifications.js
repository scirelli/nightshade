//*****************************************
// Author: Steve Cirelli
// File Desc:
//*****************************************

module.exports = function(Class){

    var IListener = Class.create({
        onChange:function( ){ }
    });

    var INotifier = Class.create({
        change:function( obj ){},
        register:function( oListener ){},
        unregister:function( oListener ){},
        registered:function( oListener ){}
    });

    var ANotifier = Class.create(INotifier, {
        initialize:function( ){
            this.aListeners = new Array();
        },

        change:function( ){
            var aListeners = this.aListeners,
                args       = arguments;
            setTimeout(function(){
                for( var i=0, l=aListeners.length,itm=null; i<l; i++ ){
                    itm = aListeners[i];
                    itm.onChange.apply( itm, args );
                }
            },0);
        },

        register:function( oListener ){
            if( oListener instanceof IListener ){
                this.unregister(oListener);//Items can not be registered more than once
                this.aListeners.push( oListener );
            }else if( oListener instanceof Array ){
                for( var i=0, l=oListener.length; i<l; i++ ){
                    this.register( oListener[i] );
                }
            }else{
                throw 'ANotifier could not register ' + oListener;
            }
        },

        unregister:function( oListener ){
            if( oListener instanceof IListener ){
                var itm = this.aListeners.indexOf( oListener );
                if(itm < 0 ) return;
                return this.aListeners.splice( itm, 1 );
            }else if( oListener instanceof Array() ){
                for( var i=0, l=oListener.length; i<l; i++ ){
                    this.unregister( oListener[i] );
                }
            }
        },

        registered:function( oListener ){
            if( oListener instanceof IListener ){
                var itm = this.aListeners.indexOf( oListener );
                return itm < 0 ? false : true;
            }
            return false;
        }
    });


    this.IListener = IListener;
    this.INotifier = INotifier;;
    this.ANotifier = ANotifier;
};


