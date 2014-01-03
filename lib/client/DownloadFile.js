//*****************************************
// Author: Steve Cirelli
// File Desc: Down a file as if it were an ajax query.
// Requires the server to set a cookie 'fileDownload=1' if the file is transfered.
// Otherwise the server can output some error as the page contents.
//
// Requires cookieUtils to be included.
//*****************************************
//TODO:Cookie value should be the file name. in this case the hash of the url.
//Figure a better way then setTimeout.

if( !scUtils ) var scUtils = {};

!function(scUtils){
"use strict";
    scUtils.FileDownLoader = function( sURL, oData, sMethod, fncError, fncSucess ){
        this.sMethod   = sMethod || 'GET';
        this.oData     = oData;
        this.sURL      = sURL;
        this.fncError  = fncError || function(){};
        this.fncSucess = fncSucess || function(){};
        this.oForm     = null;
        this.oIFrame   = null;
        this.nInterval = 1000;
        this.sCookieName   = 'fileDownload';
        this.nIntervalID   = 0;
        this.nFailSafeTime = 3600000;//1hr
        this.nTotalTime    = 0;
        this.init();
    };

    scUtils.FileDownLoader.prototype.setInterval = function( nMilliSeconds ){
        this.nInterval = parseInt(nMilliSeconds);
    };
    
    scUtils.FileDownLoader.prototype.setCookieName = function( sName ){
        this.sCookieName = sName;
    };

    scUtils.FileDownLoader.prototype.setFailSafeTime = function( nMaxTime ){
        this.nFailSafeTime = nMaxTime;
    };
    
    scUtils.FileDownLoader.prototype.resetTotalTime = function(){
        this.nTotalTime = 0;
    };

    //@private
    scUtils.FileDownLoader.prototype.init = function(){
        this.oForm   = this.appendFormData( this.createForm() );
        this.oIFrame = this.createIFrame();
    };

    //@private
    scUtils.FileDownLoader.prototype.appendFormData = function( oForm ){
        var oInput = null,
            oData  = this.oData;

        for( var param in oData ){
            oInput = window.document.createElement('input');
            oInput.type = 'hidden';
            oInput.name = param;
            oInput.value = oData[param];
            oForm.appendChild(oInput);
        }
        return oForm;
    };

    //@private
    scUtils.FileDownLoader.prototype.createForm = function(){
        var oForm = window.document.createElement('form');
        oForm.action = this.sURL;
        oForm.method = this.sMethod;
        return oForm;
    };

    //@private
    scUtils.FileDownLoader.prototype.createIFrame = function(){
        var oIframe = window.document.createElement('iframe'),
            me      = this;

        oIframe.style.visibility = 'hidden';
        oIframe.style.display    = 'none';
        oIframe.src              = 'about:blank';
        return oIframe;
    };

    //@private
    scUtils.FileDownLoader.prototype.attachFormToFrame = function(){
        var me = this;

        window.document.body.appendChild(this.oIFrame);
        this.oIFrame.contentDocument.body.appendChild(this.oForm);
        this.oIFrame.addEventListener('load', function(){
            me.fncError( this.contentDocument.body.innerHTML );
        } );
    };

    //@private
    scUtils.FileDownLoader.prototype.cleanUp = function(){
        window.clearTimeout(this.nIntervalID); 
        document.body.removeChild( this.oIFrame );
        window.cookieUtils.deleteCookie( this.sCookieName );
        this.resetTotalTime();
    };

    //@private
    scUtils.FileDownLoader.prototype.checkCookie = function(){
        var me = this;
        this.nIntervalID = setTimeout( function(){
            var sCookieValue = window.cookieUtils.getCookie(me.sCookieName);
            me.nTotalTime += me.nInterval;
            if( sCookieValue == "1" || sCookieValue == 1 ){
                me.fncSucess();
                me.cleanUp();
                return;
            }
            if( me.nTotalTime >= me.nFailSafeTime ){
                me.fncError( me.nTotalTime + ' ms have elapsed.' );
                me.cleanUp();
                return;
            }
            me.checkCookie();
        }, me.nInterval);
    };
    
    scUtils.FileDownLoader.prototype.download = function(){
        this.attachFormToFrame();
        this.oForm.submit();
        this.checkCookie();
    };
}(scUtils);
