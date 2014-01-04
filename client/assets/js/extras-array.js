/*
add some useful methods to the javascript array class. All operating on the built-in Array class, so no
need for any namespacing object.

Dave Crane 2005
*/

/*
append to end of array, optionally checking for duplicates
*/
if( !Array.prototype.append )
    Array.prototype.append=function(obj,nodup){
      if (!(nodup && this.contains(obj))){
        this[this.length]=obj;
      }
    }

/*
return index of element in the array
*/
if( !Array.prototype.indexOf )
    Array.prototype.indexOf=function(obj){
      var result=-1;
      for (var i=0;i<this.length;i++){
        if (this[i]==obj){
          result=i;
          break;
        }
      }
      return result;
    }

/*
return true if element is in the array
*/
if( !Array.prototype.contains )
    Array.prototype.contains=function(obj){
      return (this.indexOf(obj)>=0);
    }

/*
empty the array
*/
if( !Array.prototype.clear )
    Array.prototype.clear=function(){
      this.length=0;
    }

/*
insert element at given position in the array, bumping all
subsequent members up one index
*/
if( !Array.prototype.insertAt )
    Array.prototype.insertAt=function(index,obj){
      this.splice(index,0,obj);
    }

/*
remove element at given index
*/
if( !Array.prototype.removeAt )
    Array.prototype.removeAt=function(index){
      this.splice(index,1);
    }

/*
return index of element in the array
*/
if( !Array.prototype.remove )
    Array.prototype.remove=function(obj){
      var index=this.indexOf(obj);
      if (index>=0){
        this.removeAt(index);
      }
    }

Array.prototype.addInstanceOf = function( oInstance, obj, fncError ){
    if( obj instanceof Array ){
        for( var i=0, l=obj.length,itm=null; i<l; i++ ){
            this.addInstanceOf( obj[i], oInstance );
        }
    }else if( obj instanceof oInstance ){
        this.push(obj);
    }else{
        fncError = fncError || function(){};
        fncError(); 
    }
}

Array.prototype.addTypeOf = function( sType, obj, fncError ){
    if( obj instanceof Array ){
        for( var i=0, l=obj.length,itm=null; i<l; i++ ){
            this.addTypeOf( obj[i], sType );
        }
    }else if( typeof(obj) == sType ){
        this.push(obj);
    }else{
        fncError = fncError || function(){};
        fncError(); 
    }
}
