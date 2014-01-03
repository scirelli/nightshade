/** **************************** *
 * Author: Steve Cirelli
 * Desc:
 ** **************************** */

if( mu === undefined ){ var mu = {}; }

!function(mu){
    'use strict';

    mu.JSOAuth = function(){
        this.initialize.apply(this,arguments);
    };
    mu.JSOAuth.prototype = {
        initialize:function( sAccessToken, sRefreshToken, nExpiresIn, sTokenType ){
            this.access_token  = '';
            mu.JSOAuth.prototype.setAccessToken.call( sAccessToken );

            this.token_type    = "bearer";
            mu.JSOAuth.prototype.setTokenType.call(sTokenType);

            this.expires_in    = 3600;
            mu.JSOAuth.prototype.setExpiresIn.call( nExpiresIn );

            this.refresh_token = '';
            mu.JSOAuth.prototype.setRefreshToken.call( sRefreshToken );
            this.nStart        = 0;
        },
        getAccessToken:function(){
            return this.access_token;
        },
        getTokenType:function(){
            return this.token_type;
        },
        getExpiresIn:function(){
            return this.expires_in;
        },
        getRefreshToken:function(){
            return this.refresh_token;
        },
        expired:function(){
            var tmp = (new Date()).getTime();
            tmp = (tmp - this.nStart)/1000.0;
            return tmp >= this.expires_in;
        },
        setAccessToken:function( sAccessToken ){
            if( !sAccessToken ){ return; }
            this.access_token = sAccessToken;
            this.startTimer();
        },
        setTokenType:function( sTokenType ){
            if( !sTokenType ){ return; }
            this.token_type = sTokenType;
        },
        setExpiresIn:function( nSec ){
            nSec = parseInt(nSec);
            if( isNaN(nSec)  ){ return; }
            this.expires_in = nSec;
        },
        setRefreshToken:function( sRt ){
            if( !sRt ){ return; }
            this.refresh_token = sRt;
        },
        startTimer:function(){
            return this.nStart = (new Date()).getTime();
        }
    };
    
    mu.OAuth2URL = function(){
        this.initialize.apply( this, arguments );
    };
    mu.OAuth2URL.prototype = {
        initialize:function( sClient_id, sRedirect_uri ){
            this.sClient_id     = sClient_id || '';
            this.sRedirect_uri  = sRedirect_uri || window.location.baseURL;
            this.sResponse_type = 'token';
            this.sOAuthURL      = 'https://secure.meetup.com/oauth2/authorize';
        },
        getURL:function(){
            return this.sOAuthURL + '?response_type=' + this.sResponse_type + '&client_id=' + this.sClient_id + '&redirect_uri=' + this.sRedirect_uri;
        }
    }
}(mu);
