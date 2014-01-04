//*****************************************
// Author: Steve Cirelli
// File Desc: 
//*****************************************

//namespace
if( !saveUtils ) var saveUtils = new Object();

;(function( saveUtils ){
"use strict";
    saveUtils.ISave = Class.create({
        save:function(){},
        load:function(){}
    });

    saveUtils.SaveToCookies = Class.create(saveUtils.ISave,{
        initialize:function( name, value, expires, path, domain, secure ){
            this.sName    = name;
            this.sValue   = value;
            this.nExpires = expires || 0;
            //this.nExpires = this.nExpires * 1000 * 60 * 60 * 24;//days to ms
            this.sPath    = path || '/';
            this.sDomain  = domain;
            this.secure   = secure;
        },

        save:function( sKey, sValue ){
            sKey = sKey || this.sName;
            sValue = sValue || this.sValue;
            this.setCookie( sKey, sValue, this.nExpires, this.sPath, this.sDomain, this.secure );
        },

        setCookie:function( name, value, expires, path, domain, secure ){
            if( expires ){
                expires = expires * 1000 * 60 * 60 * 24;//days to ms
            }else{ expires = 0; }

            if( !path ) path = '/';

            var expires_date = new Date( (new Date()).getTime() + (expires) );
            
            document.cookie = name + '=' + escape(value) +
                              ( (expires) ? ';expires=' + expires_date.toGMTString() : "" ) +
                              ( (path)    ? ';path='    + path : '' ) +
                              ( (domain)  ? ';domain='  + domain : '' ) +
                              ( (secure)  ? ';secure='  + secure : '' );
        },
        
        load:function( sKey ){
            return this.getCookie( sKey );
        },

	    getCookie:function( cookieName, raw ){
            var aAllCookies = document.cookie.split(';');//name=value;name=value;...
            if( typeof(cookieName) != 'string' && !(cookieName instanceof String) ){
                return '';
            }

            for( var i=0, l=aAllCookies.length, aCook=''; i<l; i++ ){
                aCook = aAllCookies[i].split('=');
                if( aCook[0].replace(/^\s+|\s+$/g, '') == cookieName ){
                    if( aCook[1] ){
                        if( raw ){
                            return aCook[1];
                        }else{
                            return unescape(aCook[1].replace(/^\s+|\s+$/g, ''));
                        }
                    }else{
                        return '';
                    }
                }
            }
            return '';
        },

        deleteCookie:function( cookieName, path, domain ) {
            if( typeof(cookieName) != 'string' && !(cookieName instanceof String) ){
                return;
            }
            if( !path ) path = '/';
            document.cookie = cookieName + '= ' + 
                              ( (path)    ? ';path='    + path : '' ) +
                              ( (domain)  ? ';domain='  + domain : '' ) +
                              ';expires=Thu, 01-Jan-70 00:00:01 GMT;';
        }
    });

    saveUtils.ASaveToStorage = Class.create(saveUtils.ISave, {
        initialize:function( sKey, sValue ){
            this.sKey   = sKey;
            this.sValue = JSON.stringify(sValue);
            if( !Storage || !localStorage ){
                throw 'Browser does not support Storage/localStorage/sessionStorage.';
            }
            this.setStorageType();
        },

        setStorageType:function( sType ){
            switch(sType){
                case 'localStorage':
                case 'local':
                    this.oStorage = localStorage;
                    break;
                case 'sessionStorage':
                case 'session':
                default:
                    this.oStorage = sessionStorage;
            }
            return this.oStorage;
        },

        save:function( sKey, sValue ){
            sKey   = sKey || this.sKey;
            sValue = JSON.stringify(sValue) || this.sValue;

            this.oStorage[sKey] = sValue;
        },

        load:function( sKey ){
            sKey = sKey || this.sKey;
            return this.oStorage[sKey];
        }
    });

    saveUtils.SaveToLocalStorage = Class.create(saveUtils.ASaveToStorage,{
        initialize:function( $super, sKey, sValue ){
            $super(sKey, sValue);
            this.setStorageType('localStorage');
        }
    });

    saveUtils.SaveToSessionStorage = Class.create(saveUtils.ASaveToStorage,{
        initialize:function( $super, sKey, sValue ){
            $super(sKey, sValue);
            this.setStorageType('sessionStorage');
        }
    });
})(saveUtils);
