function CatItem(){
    'use strict';
}
CatItem.MetaData = function( source, source_id ){
    'use strict';
    this.source    = source + '';
    this.source_id = source_id + '';
}

CatItem.Location = function( fLat, fLon, sAddress ){
    'use strict';
    this.address = sAddress + '';
    this.lat     = parseFloat(fLat);
    this.lon     = parseFloat(fLon);
};

CatItem.prototype = {
    "title":'',
    "description":'',
    "categories":'',
    "metadata":new CatItem.MetaData(),
    "location":new CatItem.Location()
};

module.exports = CatItem;
