var Q          = require("q"),
    FS         = require("q-io/fs"),
    o          = require('../../Math'),
    shapes     = require('../../shapes'),
    Categories = require('../../categories'),
    aWords     = require(__dirname + '/../data/brit-a-z.json'),
    szWords    = aWords.length;

function FauxData(){
    'use strict';
}

FauxData.prototype = {
    rndWords:function( nMax ){
        'use strict';
        var aRtn = [];
        for( var i=0,l=aWords.length; i<nMax; i++ ){
            aRtn.push(aWords[~~Math.randomRange(0,l)]);
        }
        return aRtn;
    },
    rndWord:function(){
        'use strict';
        var l = aWords.length;
        return aWords[~~Math.randomRange(0,l)];
    },
    rndCats:function( oShape, nMax ){
        'use strict';
        nMax = parseInt(nMax,10) || 1000;
        var oRtn = {};
        

        for( var i=0,a=Categories.aCategories,l=a.length,itm=null,aCat=null; i<l; i++ ){
            itm  = a[i];
            aCat = oRtn[itm.shortname] = [];
            for( var j=0,k=Math.randomRange(0,nMax),sWord='',catItem=null,p=0; j<k; j++ ){
                catItem = new Categories.CatItem();

                catItem.title = this.rndWords(Math.randomRange(0,10)).join(' ');
                catItem.description = this.rndWords(Math.randomRange(0,500)).join(' ');
                catItem.categories.push('wtf','are','categories','on','an','item','that','is','already','under','a','category','idiot.');

                catItem.metadata.source = this.rndWord();
                catItem.metadata.source_id = 'http://www.' + this.rndWord() + '.com';

                p = oShape.randPoint();
                catItem.location.lat = p.x;
                catItem.location.lon = p.y;
                catItem.location.address = ~~Math.randomRange(1,9999) + ' ' + this.rndWords(Math.randomRange(0,2)).join(' ') + ', ' + this.rndWord() + ', ' + this.rndWord() + ' ' + ~~Math.randomRange(10000,99999);

                aCat.push(catItem);
            }
        }
        return oRtn;
    }
};

module.exports = FauxData;
