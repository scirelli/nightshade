//*****************************************
// Author: Steve Cirelli
// File Desc: 
//*****************************************

if( scUtils === undefined ) var scUtils = new Object();
!function( scUtils ){
"use strict";
    scUtils.IIterator = Class.create({
        initialize:function(){
            this.hasNext = function(){};// Returns true if the iteration has more elements.
            this.next = function(){};// Returns the next element in the iteration.
            this.remove = function(){};
        }
    });

    scUtils.ArrayIterator = Class.create(scUtils.IIterator, {
        initialize:function( array ){
            this.aArray = array || new Array();
            this.nPointer = 0;
            this.next = function(){
                return this.aArray[this.nPointer++];
            };
            this.hasNext = function(){
                return this.nPointer < this.aArray.length;
            };
            this.remove = function( oElement ){// Removes from the underlying collection the last element returned by the iterator (optional operation).
                this.nPointer = 0;
                return this.aArray.splice( this.aArray.indexOf(oElement),1);
            };
        }
    });
}(scUtils);
