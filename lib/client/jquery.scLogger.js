/*
 * jQuery Log Plugin
 * version: 0.01 (11-22-2011)
 * @requires jQuery v1.3.2 or later
 * @author Steve Cirelli
 * TODO: Finish this script. INCOMPLETE - Needs a lot more work.
 * To use just call $.log(msg)
 */
(function($){
"use strict";//Just don't cross the streams!!
    var msgLog = '',
        $g_div = undefined,
        $g_innerDiv = undefined,
        settings = { 
                $div:$('<div style="border:4px solid #000;"/>'),
                hidden:true,
                initMsg:'<div style="color:red; border:3px outset #FFF;"><center><h1 style="margin-right:auto; margin-left:auto;">Log</h1></center></div>',
                pos:'s'
            };

    var methods = {

        //------------------------------------------------
        // Initializes the logger
        // @param: options {Object};
        //   Possilbe Options are:
        //      $div {jQuery Object} - The div to place the log msgs
        //      hidden {boolean} - default true, hidden by default
        //      initMsg {string} - The title of the log box
        //      pos {string} - possible values n,s,e,w,north,south,east,west
        // Create the div, attach it to body and hide it
        // Options might be where to dock it.
        //------------------------------------------------
        init : function( options ) { 
            settings = $.extend( settings, options);
            //TODO: Finish the initialization
            createLogDiv();
            return $g_div;
        },
        show : function( ) {
            if($g_div)
                $g_div.show();
            return $g_div;
        },
        hide : function( ) { 
            if($g_div)
                $g_div.hide();
            return $g_div;
        },
        log : function( msg, priority ){
            var d = $('<fieldset style="border:1px solid #FFF;"/>'),
                h = $('<legend style="color:#15428b"/>'),
                dt = new Date(),
                hdrMsg = dt.toLocaleString();
            
            h.append(hdrMsg); 
            d.append(h)
            d.append(msg);
            if( $g_div ){
                $g_innerDiv.prepend( d );
            }else{
                createLogDiv();
            }
            return $g_div;
        }
    };

    //------------------------------------------------
    // The log function
    // @param: method {Object} {string}, {other}; Accepts an options object for init
    // using $.fn make it attach to an element
    //------------------------------------------------
    $.log = function( method ) {
        //var $this = $(this);

        if ( methods[method] ) {//calls the method given by first argument then removes that arg and applies the rest
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if( typeof method === 'string' || method instanceof String ){//if the just pass in the msg
            return methods['log'].apply( this, arguments);
        }else if( typeof method === 'object' || ! method ) {//Options obj
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.log' );
        }    
    }

    function createLogDiv( ){
        if( !$g_div ){
            $g_div = $('<div id="scLogger" style="position:absolute; top:20px; z-index:9999; border:5px ridge #CCC; background-color:#000; color:#0F0; height:200px; width:100%; overflow:scroll; overflow-x:hidden; padding:3px 3px 3px 3px; margin:3px 3px 3px 3px;" />');
            $g_innerDiv = $('<div />');
            
            $g_div.append( settings.initMsg );
            $g_div.append($g_innerDiv);

            $('body').append('<button id="btnShowLog" style="position:absolute; z-index:9999;">[Log +]</button>');
            $('body').append($g_div);
            $g_div.hide();

            $('#btnShowLog').toggle( function(){ 
                                            $(this).html('[Log -]'); 
                                            $('#scLogger').show();
                                        },
                                        function(){
                                            $(this).html('[Log +]');
                                            $('#scLogger').hide();
                                        }
            );
        }
        if( settings.hidden == true ){
            $('#btnShowLog').hide();
        }else{
            $('#btnShowLog').show();
        }
    }

})(jQuery);
