Object.defineProperty = function(oObj, sPropName, obj){
    oObj[sPropName] = obj.value;
};

Object.freeze = function(){};
