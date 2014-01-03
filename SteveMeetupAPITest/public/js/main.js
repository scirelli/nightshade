/** **************************** *
 * Author: Steve Cirelli
 * Desc:
 ** **************************** */

if( ns === undefined ){ var ns = {}; }

!function(ns){
    'use strict';
    var sClient_id    = 'go3qh5u6f73up2n9omrj0ue7li', //'YOUR_CONSUMER_KEY',
        sRedirect_uri = 'http://localhost:1337',      //'YOUR_CONSUMER_REDIRECT_URI',
        sOAuth2URL    = (new mu.OAuth2URL(sClient_id,sRedirect_uri)).getURL(); //'https://secure.meetup.com/oauth2/authorize?client_id=' + sClient_id + '&response_type=token&redirect_uri=' + sRedirect_uri;
    
    $(document).ready(function(){
        //Check localstorage for a recent token if not there or an expired token
        if( !window.location.hashObj.access_token ){
            window.location.href = sOAuth2URL;
        }
    });
}(ns);
