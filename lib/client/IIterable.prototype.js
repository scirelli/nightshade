//*****************************************
// Author: Steve Cirelli
// File Desc: 
//*****************************************

if( scUtils === undefined ) var scUtils = new Object();
!function( scUtils ){
"user strict";
    scUtils.IIterable = Class.create({
        initialize:function(){
            this.iterator = function(){ }
        }
    });
}(scUtils);
