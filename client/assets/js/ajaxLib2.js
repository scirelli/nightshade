//Author: Stephen Cirelli
//Create the object. Namespacing.
var net=new Object();              

//Member Constants
net.READY_STATE_UNINITIALIZED = 0;
net.READY_STATE_LOADING       = 1;
net.READY_STATE_LOADED        = 2;
net.READY_STATE_INTERACTIVE   = 3;
net.READY_STATE_COMPLETE      = 4;

//Constuctor
net.ContentLoader=function(url,onload,onerror,method,params,contentType){   
  this.url=url;
  this.onload=onload;
  this.onerror=(onerror) ? onerror : this.defaultError;
  this.loadXMLDoc(url, method, params, contectType);
}

net.ContentLoader.prototype={
    //-----------------------------
    // Name: loadXMLDoc
    // Desc: Setup the reques obj
    //-----------------------------
    loadXMLDoc:function(url, method, params, contentType){   
        if(!method){
            method="GET";
        }
        if(!contentType && method=="POST")
            contentType="application/x-www-form-urlencoded";

        if (window.XMLHttpRequest){//Mozilla   
            this.req=new XMLHttpRequest();             
        } else if (window.ActiveXObject){ //Windows            
            this.req=new ActiveXObject("Microsoft.XMLHTTP");   
        }

        if (this.req){
            try{
                this.req.onreadystatechange=net.ContentLoader.onReadyState;
                this.req.open(method,url,true);   
                if(contentType){
                    this.req.setRequestHeader("Content-Type", contentType);
                }
                this.req.send(params);             
            }catch (err){
                this.onerror.call(this);//Call the on error function with a context of 'this' obj (net obj)
            }
        }
    },

    //-----------------------------
    // Name: onReadyState()
    // Desc: call back for rdy state
    //       change
    //-----------------------------
    onReadyState:function(){   
        var req=this.req;
        var ready=req.readyState;

        if (ready==net.READY_STATE_COMPLETE){
            var httpStatus=req.status;
            if (httpStatus==200 || httpStatus==0){
                this.onload.call(this);
            }else{
                this.onerror.call(this);
            }
        }
    },

    //-----------------------------
    // Name: defaultError()
    // Desc: Default error handler
    //-----------------------------
    defaultError:function(){
        alert("error fetching data!"
              +"\n\nreadyState:"+this.req.readyState
              +"\nstatus: "+this.req.status
              +"\nheaders: "+this.req.getAllResponseHeaders());
    }
}
