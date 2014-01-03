//*****************************************
// Author: Steve Cirelli
// File Desc: 
//*****************************************

if( vs == undefined ) var vs = {};

!function( vs ){
"use strict";
    vs.ISerializable = Class.create({
        /** ********************************
         * @Desc: What the user wants to serialize
         * *********************************/
        getSerializable:function(){},
        load:function( obj ){},
        getName:function(){}
    });

    vs.WatchListSerializable = Class.create( vs.ISerializable,{
        initialize:function( sName ){
            this.aWatchLists = new Array();
            this.sName = sName || 'vs.WatchListSerializable' + (new Date()).getTime();;
        },

        //@Override
        load:function( obj ){
            this.reconstitute( obj );
        },

        //@Override
        getSerializable:function(){
            return this.aWatchLists;
        },

        //@Override
        getName:function(){
            return this.sName;
        },

        addWatchList:function( oWatchList ) {
            var index = this.aWatchLists.indexOf( oWatchList );

            if( oWatchList instanceof vs.WatchList && index < 0 ){
                this.aWatchLists.push( oWatchList );
            }
            return this;
        },
        
        removeWatchList:function( oWatchList ) {
            var index = this.aWatchLists.indexOf( oWatchList );
            if( index >= 0 ){
                this.aWatchLists.splice(index,1);
            }
            return this;
        },

        updateWatchList:function( oWatchList ){
            var index = this.aWatchLists.indexOf( oWatchList );
            if( index >= 0 ){
                this.aWatchLists[index] = oWatchList;
            }
        },

        //@private
        reconstituteWatchList:function( obj ){
            var wrdlst = new Array();
            if( obj.sName && obj.aWatchItems && obj.aExtraSolrQueryParams ){
                for( var i=0,lst=obj.aWatchItems,l=lst.length; i<l; i++ ){
                    wrdlst.push( lst[i].sWord );
                }
                return new vs.WatchList( obj.sName, wrdlst.join(','), obj.aExtraSolrQueryParams );
            }
            return new vs.WatchList();
        },

        //@private
        reconstituteWatchLists:function( aWL ){
            this.aWatchLists = new Array();
            
            for( var i=0, l=aWL.length,itm=null; i<l; i++ ){
                this.addWatchList( this.reconstituteWatchList( aWL[i] ) );
            }
        },

        //@private
        reconstitute:function( obj ){
            if( obj instanceof Array ){
                this.reconstituteWatchLists( obj );
            }
        },

        getWatchLists:function(){
            return this.aWatchLists;
        }
    });

    vs.VisibleFacetSerializable = Class.create( vs.ISerializable,{
        initialize:function( sName, oSchemaMapping ){
            this.aFacets = new Array();
            this.oSchema = null;

            if( typeof(sName) == 'string' || sName instanceof String ){
                this.sName = sName;
                this.addSchema( oSchemaMapping );
            }else if( sName instanceof vs.ISolrSchemaVSColumn ){
                this.addSchema( sName );
            }
        },

        addSchema:function( oSchema ){
            if( oSchema instanceof vs.ISolrSchemaVSColumn ){
                this.oSchema = oSchema;
            }
        },
        
        getSerializable:function(){
            return this.oSchema.getFields();
        },

        getName:function(){
            return this.sName;
        },

        load:function( obj ){
            if( obj instanceof Array ){
                var oMap = this.oSchema.getMappedFields(),
                    aFieldProps = Object.keys( new vs.FieldMapping() );

                for( var i=0, l=obj.length,field=null,sn='',f=null; i<l; i++ ){
                    field = obj[i];
                    sn    = field.sSchemaName;
                    f     = oMap[sn];
                    if( f ){
                        for( var j=0, l2=aFieldProps.length,propName=null; j<l2; j++ ){
                            propName = aFieldProps[j];
                            f[propName] = field[propName];
                        }
                    }
                }
            }
        }
    });
}(vs);

//Preferences Singlton
function Preferences2( sPrefName, oSave ){
"use strict";
    /*if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;
   */ 
    if( Preferences2.prototype._singletonInstance ){
        return Preferences2.prototype._singletonInstance;
    }
    Preferences2.prototype._singletonInstance = this;

    this.oSerializable = {};

    this.aSaveObjs   = new Array()
    this.bDirty      = false;
    this.sPrefName   = sPrefName || 'Preferences';

    this.addSave = function( oSave ){
        if( oSave instanceof saveUtils.ISave ){
            this.aSaveObjs.push( oSave );
        }
        return this;
    };

    this.addSave( oSave );

    this.removeSave = function( oSave ){
        var index = this.aSaveObjs.indexOf( oSave );
        if( index >= 0 ){
            this.aSaveObjs.splice(index,1);
        }
        return this;
    };

    this.add = function( oItem ) {
        if( oItem instanceof vs.ISerializable ){
            var sName = oItem.getName(),
                index = this.oSerializable[ sName ];
            if( index ) throw 'An item with this name \'' + sName + '\' already exists.';

            this.oSerializable[sName] = oItem;
            this.makeDirty();
        }else{
            throw 'Preferences.add param 1 must be of type vs.ISerializable.';
        }
        return this;
    };
   
    /** ********************************
     * @Desc: 
     * @param: sName - string: Name of the item to delete
     * @return: boolean - if it was deleted or not
     * *********************************/
    this.remove = function( sName ) {
        if( sName instanceof vs.ISerializable ) sName = sName.getName();
        return delete this.oSerializable[sName];
    };
    
    this.update = function( oItem ){
        if( oItem instanceof vs.ISerializable ){
            this.oSerializable[oItem.getName()] = oItem;
            this.makeDirty();
        }
    };

    this.isDirty = function(){ return this.bDirty; };
    this.makeDirty = function(){ this.bDirty = true; };
    //@private
    this.makeNotDirty = function(){ this.bDirty = false; };

    this.getSerializable = function(){
        var oSerials = {};
        for( var itm in this.oSerializable ){
            oSerials[itm] = this.oSerializable[itm].getSerializable();
        }
        return oSerials;
    };

    this.save = function(){
        var oSerials = this.getSerializable();

        for( var i=0,lst=this.aSaveObjs, l=lst.length,itm=null; i<l; i++ ){
            itm = lst[i];
            itm.save( this.sPrefName, oSerials );
        }
        this.makeNotDirty();
    };
    
    this.load = function( sName ){
        var oData = this.aSaveObjs[0].load( this.sPrefName ),
            obj   = this.oSerializable[sName];

        if( !obj ) throw 'Preferences.load could not find \'' + sName + '\'.';
        if( oData ){
            oData = JSON.parse( oData );
            if( oData[sName] )
                obj.load(oData[sName]);
            else
                console.log('Preferences.load: nothing to laod.');
        }else{ 
            console.log('Could not load \'' + this.sPrefName + '\' prefeneces.'); return; 
        }

        return obj;
    };

    this.loadAll = function(){
        var oData = this.aSaveObjs[0].load( this.sPrefName ),
            s     = this.oSerializable,
            obj   = null;

        if( !oData ) { console.log('Could not load \'' + this.sPrefName + '\' prefeneces.'); return; }
        oData = JSON.parse( oData );

        for( var sName in s ){
            obj = s[sName];
            if( oData[sName] )
                obj.load(oData[sName]);
        }
    };

    this.get = function( sName ){
        return this.oSerializable[sName];
    };

    this.clear = function(){
        this.oSerializable = {};
    };

    this.getName = function(){
        return this.sPrefName;
    };

    this.getSaveObj = function( index ){
        index = index || 0;
        return this.aSaveObjs[index];
    };

    this.getSaveObjs = function( ){
        return this.aSaveObjs.slice(0);
    };
}

//Preferences Singlton
function Preferences( sPrefName, oSave ){
"use strict";
    /*if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;
   */ 
    if( Preferences.prototype._singletonInstance ){
        return Preferences.prototype._singletonInstance;
    }
    Preferences.prototype._singletonInstance = this;

    this.oSerializable = {
        aWatchLists:new Array(),
        aFacetsListVisiableFields:new Array()
    };

    this.aSaveObjs   = new Array()
    this.bDirty      = false;
    this.sPrefName   = sPrefName || 'Preferences';

    this.addSave = function( oSave ){
        if( oSave instanceof saveUtils.ISave ){
            this.aSaveObjs.push( oSave );
        }
        return this;
    };

    this.addSave( oSave );

    this.removeSave = function( oSave ){
        var index = this.aSaveObjs.indexOf( oSave );
        if( index >= 0 ){
            this.aSaveObjs.splice(index,1);
        }
        return this;
    };

    this.addWatchList = function( oWatchList ) {
        var index = this.oSerializable.aWatchLists.indexOf( oWatchList );

        if( oWatchList instanceof vs.WatchList && index < 0 ){
            this.oSerializable.aWatchLists.push( oWatchList );
            this.makeDirty();
        }
        return this;
    };
    
    this.removeWatchList = function( oWatchList ) {
        var index = this.oSerializable.aWatchLists.indexOf( oWatchList );
        if( index >= 0 ){
            this.oSerializable.aWatchLists.splice(index,1);
            this.makeDirty();
        }
        return this;
    };

    this.updateWatchList = function( oWatchList ){
        var index = this.oSerializable.aWatchLists.indexOf( oWatchList );
        if( index >= 0 ){
            this.oSerializable.aWatchLists[index] = oWatchList;
            this.makeDirty();
        }
    };

    this.isDirty = function(){ return this.bDirty; };
    //@private
    this.makeDirty = function(){ this.bDirty = true; };
    //@private
    this.makeNotDirty = function(){ this.bDirty = false; };

    this.save = function(){
        for( var i=0,lst=this.aSaveObjs, l=lst.length,itm=null; i<l; i++ ){
            itm = lst[i];
            itm.save( this.sPrefName, this.oSerializable );
        }
        this.makeNotDirty();
    };
    
    //@private
    this.reconstituteWatchList = function( obj ){
        var wrdlst = new Array();
        if( obj.sName && obj.aWatchItems && obj.aExtraSolrQueryParams ){
            for( var i=0,lst=obj.aWatchItems,l=lst.length; i<l; i++ ){
                wrdlst.push( lst[i].sWord );
            }
            return new vs.WatchList( obj.sName, wrdlst.join(','), obj.aExtraSolrQueryParams );
        }
        return new vs.WatchList();
    };

    //@private
    this.reconstituteWatchLists = function(){
        var aWL = this.oSerializable.aWatchLists;
        this.oSerializable.aWatchLists = new Array();
        
        for( var i=0, l=aWL.length,itm=null; i<l; i++ ){
            this.addWatchList( this.reconstituteWatchList( aWL[i] ) );
        }
    };

    //@private
    this.reconstitute = function(){
        this.reconstituteWatchLists();
    };

    this.load = function(){
        //for( var i=0,lst=this.aSave,l=lst.length,oData=null; i<l; i++ ){
            var oData = this.aSaveObjs[0].load( this.sPrefName );
            if( oData ){
                var s = this.oSerializable;
                oData = JSON.parse( oData );
                for( var i in oData ){
                    s[i] = oData[i];
                }
                this.reconstitute();
            }
        //}
    };

    this.getWatchLists = function(){
        return this.oSerializable.aWatchLists;
    };

    this.clear = function(){
        this.oSerializable.aWatchLists = new Array();
        this.oSerializable.aFacetsListVisiableFields = new Array();
    };

    this.getName = function(){
        return this.sName;
    };

    this.getSaveObj = function( index ){
        index = index || 0;
        return this.aSaveObjs[index];
    };
    this.getSaveObjs = function( ){
        return this.aSaveObjs.slice(0);
    };
}
