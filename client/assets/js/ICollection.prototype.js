//*****************************************
// Author: Steve Cirelli
// File Desc: 
//*****************************************

if( scUtils === undefined ) var scUtils = new Object();

!function(scUtils){
"use strict";
    scUtils.ICollection = Class.create(scUtils.IIterable, {
        initialize:function(){
            // Basic operations
            this.size = function(){};
            this.isEmpty = function(){};
            this.contains = function(oElement){};
            // optional
            this.add = function(oElement){};
            // optional
            this.remove = function(oElement){};
            this.iterator = function(){};

            // Bulk operations
            this.containsAll = function( oCollection ){};
            // optional
            this.addAll = function(oCollection){}; 
            // optional
            this.removeAll = function(oCollection){};
            // optional
            this.retainAll = function(oCollection){};
            // optional
            this.clear = function(){};

            // Array operations
            this.toArray = function(){};
        }
    });
}(scUtils);
