//cookieUtils namespace
if( !cookieUtils ){
	var cookieUtils = new Object();
}

;(function( cookieUtils ){
"use strict";
	cookieUtils.setCookie = function( name, value, expires, path, domain, secure ){
		if( expires ){
			expires = expires * 1000 * 60 * 60 * 24;//days to ms
		}
		if( !path ) path = '/';

		var expires_date = new Date( (new Date()).getTime() + (expires) );
		
		document.cookie = name + '=' + escape(value) +
						  ( (expires) ? ';expires=' + expires_date.toGMTString() : "" ) +
						  ( (path)    ? ';path='    + path : '' ) +
						  ( (domain)  ? ';domain='  + domain : '' ) +
						  ( (secure)  ? ';secure='  + secure : '' );
	}

	cookieUtils.getCookie = function( cookieName, raw ){
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
	}

	cookieUtils.deleteCookie = function( cookieName, path, domain ) {
		if( typeof(cookieName) != 'string' && !(cookieName instanceof String) ){
			return;
		}
		if( !path ) path = '/';
		document.cookie = cookieName + '= ' + 
						  ( (path)    ? ';path='    + path : '' ) +
						  ( (domain)  ? ';domain='  + domain : '' ) +
						  ';expires=Thu, 01-Jan-70 00:00:01 GMT;';
	}
})(cookieUtils);
