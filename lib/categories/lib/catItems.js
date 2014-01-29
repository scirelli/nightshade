function CatItem(){
    'use strict';
    this.title = '';
    this.description = '';
    this.categories = [];
    this.metadata = new CatItem.MetaData();
    this.location = new CatItem.Location();
}
CatItem.MetaData = function( source, source_id ){
    'use strict';
    this.source    = source + '';
    this.source_id = source_id + '';
}

CatItem.Location = function( fLat, fLon, sAddress ){
    'use strict';
    this.address = sAddress + '';
    this.lat     = parseFloat(fLat) || 0;
    this.lon     = parseFloat(fLon) || 0;
};

module.exports = CatItem;
