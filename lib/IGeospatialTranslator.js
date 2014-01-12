if( gst === undefined ) var gst = {};

!function(gst)
    gst.IGeoSpatialTranslator = function(){};

    gst.IGeoSpatialTranslator.prototype = {
        getTitle:function(){},
        getDesctioption:function(){}.
        getLocation:function(){},
        getExternalLink:function(){},
        getImageURL:function(){}
    }

    gst.IGeoSpatialTranslator.ILocation = function(){
        this.lat = 0.0;
        this.lon = 0.0;
        this.address = '';
    };
    gst.IGeoSpatialTranslator.ILocation.prototype = function(){
        getLat:function(){},
        getLon:function(){},
        getAddress:function(){}
    };

    gst.IGeoSpatialTranslator.ALocation = function(){
        
    }
}(gst);
