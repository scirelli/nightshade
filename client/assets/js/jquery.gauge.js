/*
 * jQuery Guage Plugin
 * version: 0.01 (11-22-2011)
 * @requires jQuery v1.3.2 or later
 * @author Steve Cirelli
 */
(function($){
"use strict";//Just don't cross the streams!!
    var $g_div = undefined,
        $g_innerDiv = undefined,
		namespace = 'gauge';

    function createGaugeDiv( context, settings ){
		var color = new Colors();
		var aColors = color.linearGradient( settings.unitLowColor, settings.unitHighColor, settings.unitCount );
            //a$InnerDivs = Array();
		$g_div = $('<div class="gaugeContainer"/>');
		$g_div.css('margin', '3px 3px 3px 3px');

		for( var i=0, l=aColors.length; i<l; i++ ){
			var div = $('<div/>');
			div.css({
				'width' :settings.unitWidth,
			    'height':settings.unitHeight,
			    'border':settings.borderWidth + 'px ' + 'solid black',
			    'margin-left': settings.unitSpacing+'px',
			    'float': 'left',
			    'background-color': aColors[i].toString('rgb')
			});
			div.data('unitColor', {
				unitColor:aColors[i]
			});
			if( settings.unitClass ){div.addClass(settings.unitClass);}
			//a$InnerDivs.push(div);
			$g_div.append( div );
		}
		context.append( $g_div );
    }

    var methods = {
        //------------------------------------------------
        // Initializes the gauge
        // @param: options {Object};
        //   Possilbe Options are:
        //------------------------------------------------
        init: function( options ) {
            var context = this;
			return this.each( function(){
                var settings = { 
                    unitHeight:5,
                    unitWidth:10,
                    unitSpacing:3,
                    unitClass:'',
                    unitHighColor: new Color(255,0,0),
                    unitLowColor:  new Color(255,255,20),
                    unitCount:5,
                    defaultLevel:1,//Only first unit shown
                    borderWidth:1,
                    containerClass:''
                };
				settings = $.extend(settings, options);

				var $this = $(this),
					data = $this.data(namespace);

				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					$this.data(namespace, {
						target : $this,
						settings: settings
					});
				}
				createGaugeDiv( $this, settings );
			});
        },

		setLevel: function( level ){
			return this.each( function(){
                var $elm = $('.gaugeContainer', this),
                    data = $(this).data(namespace);
                var children = $elm.children('div');

                if( level >= 1 && level <= data.settings.unitCount ){
                    for( var i=0, l=children.length; i<l; i++ ){
                        var c = $(children[i]);
                        var color = c.data('unitColor').unitColor;
                        if( i < level ){
                            c.css('background-color', color.toString('rgb'));
                        }else{
                            c.css('background-color', 'white');
                        }
                    }
                    
                }
			});
		}
	};

	//------------------------------------------------
	// The gauge function
	// @param: method {Object} {string}, {other}; Accepts an options object for init
	// using $.fn make it attach to an element
	//------------------------------------------------
	$.fn.gauge = function( method ) {
		if ( methods[method] ) {//calls the method given by first argument then removes that arg and applies the rest
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if( typeof method === 'object' || ! method ) {//Options obj
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.gauge' );
		}    
	}
})(jQuery);

