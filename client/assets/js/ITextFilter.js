//Virtual Stalker Email Namespace
if( scUtils === undefined ) var scUtils = new Object();

//*****************************************
// Author: Steve Cirelli
// File Desc: This class is meant to be used 
// with the Solr highlighting feature.
//*****************************************
!function(scUtils){
"use strict";
    scUtils.ITextFilter = Class.create({
        /** ********************************
         * @Desc: 
         * @param: sStr - String
         * @return: String
         * @throws: 
         * *********************************/
        filter:function( sStr ){
            throw 'TextFilter.filter not implemented.';
        }
    });

    scUtils.CompositeTextFilter = Class.create(scUtils.ITextFilter, {
        initialize:function(){
            this.aoTextFilters = new Array();
        },

        filter:function( sStr ){
            var filters = this.aoTextFilters;
            for( var i=0,l=filters.length, fltr = null; i<l; i++ ){
                fltr = filters[i];
                arguments[0] = fltr.filter.apply( fltr, arguments );
            }
            return arguments[0];
        },

        add:function( oTextFilter ){
            if( oTextFilter instanceof scUtils.ITextFilter ){
                this.aoTextFilters.push( oTextFilter );
            }
        }
    });

    scUtils.EscapeLTGTTextFilter = Class.create(scUtils.ITextFilter,{
        filter:function( sStr ){
            if( sStr === null || sStr === undefined || sStr == '' || (typeof(sStr) != 'string' && sStr instanceof String === false) ) return sStr;
            sStr = sStr.replace('<', '&lt;');
            sStr = sStr.replace('>', '&gt;');
            return sStr;
        }
    });

    scUtils.ConvertNLToBRTextFilter = Class.create(scUtils.ITextFilter,{
        filter:function( sStr ){
            if( sStr === null || sStr === undefined || sStr == '' || (typeof(sStr) != 'string' && sStr instanceof String === false) ) return sStr;
            var regex = /[\n\r\f]/g;
            sStr = sStr.replace(regex,'<br/>');
            return sStr;
        }
    });

    scUtils.TruncateTextFilter = Class.create(scUtils.ITextFilter,{
        initialize:function( nLen, sContText ){
            this.nLen = nLen || 23;
            this.sContText = sContText || '...';
        },
        filter:function( sStr, nLen, sContText ){
            if( sStr === null || sStr === undefined || sStr == '' || (typeof(sStr) != 'string' && sStr instanceof String === false) ) return sStr;
            sContText = sContText || this.sContText;
            nLen      = nLen || this.nLen;
            if( sStr.length > nLen ){
                sStr = sStr.substring(0, nLen-sContText.length) + sContText;
            }
            return sStr;
        }
    });

    scUtils.TrimTextFilter = Class.create(scUtils.ITextFilter,{
        filter:function( sStr ){
            if( sStr === null || sStr === undefined || sStr == '' || (typeof(sStr) != 'string' && sStr instanceof String === false) ) return sStr;
            return sStr.trim();
        }
    });

    scUtils.DistinguishTextFilter = Class.create(scUtils.ITextFilter,{
        initialize:function( oRegEx, sClass ){
            this.sClass = sClass || 'distinguished-text';
            this.oRegEx = oRegEx;
        },
        setRegEx:function( oRegEx ){
            if( oRegEx instanceof RegExp ){
                this.oRegEx = oRegEx;
            }else{
                throw 'scUtils.DistinguishTextFilter.setRegEx() param 1 must be of type RegExp.';
            }
        },
        filter:function( sStr ){
            if( sStr === null || sStr === undefined || sStr == '' || (typeof(sStr) != 'string' && sStr instanceof String === false) ) return sStr;
            var aMatches = sStr.match( this.oRegEx ) || [];

            for( var i=0, l=aMatches.length,itm=null,c=this.sClass,regex='',replaced={}; i<l; i++ ){
                itm = aMatches[i];
                //Has not been replaced yet.
                if( replaced[itm] === undefined ){
                    //this is probbaly a bad idea since the email address will be treated as a regex.
                    regex = new RegExp( RegExp.escape(itm), 'g' );
                    sStr = sStr.replace(regex, '<a href="#" class="'+ c +'">' + itm + '</a>' );
                    replaced[itm] = true;
                }
            }
            return sStr;
        }
    });

    scUtils.DistinguishEmailTextFilter = Class.create(scUtils.DistinguishTextFilter,{
        initialize:function( $super, sClass ){
            //Found here http://fightingforalostcause.net/misc/2006/compare-email-regex.php
            var reg = /[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?/ig; 
            sClass = sClass || 'email-address-distinguish';
            $super( reg, sClass );
        }
    });

    scUtils.DistinguishIPAddressTextFilter = Class.create(scUtils.DistinguishTextFilter,{
        initialize:function( $super, sClass ){
            //Found here http://www.regular-expressions.info/examples.html
            var oRegEx = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/ig;
            sClass = sClass || 'ip-address-distinguish';
            $super( oRegEx, sClass );
        }
    });

    scUtils.DistinguishURLTextFilter = Class.create(scUtils.DistinguishTextFilter,{
        initialize:function( $super, sClass ){
            //var oRegEx = /^(https?):\/\/(([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+(:([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+)?@)?(?#)((([a-z0-9][a-z0-9-]*[a-z0-9]\.)*[a-z][a-z0-9-]*[a-z0-9]|((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5]))(:\d+)?)(((\/+([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)*(\?([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?)?)?(#([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?$/ig;
             /*http://forums.devshed.com/javascript-development-115/regexp-to-match-url-pattern-493764.html */
           var oRegEx = new RegExp('(https?):\/\/' +                 // protocol
           '('+
           '([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+' +         // username
           '(:([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+)?' +     // password
           '@)?'+                                                     // auth requires @
           '('+
               '('+
                   '([a-z0-9][a-z0-9-]*[a-z0-9]\.)*' +                     // domain segments AND
                   '[a-z][a-z0-9-]*[a-z0-9]' +                                // top level domain  OR
                   '|((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.){3}' +
                   '(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])' +                // IP address
               ')'+
                '(:\d+)?' +                                             // port
           ')'+
           '('
               +'('+
                   '(\/+([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)*'+ // path
                   '(\\?([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)' +     // query string
               '?)'+
               '?'+
           ')?' +                                                  // path and query string optional
           '(#([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?'     // fragment
           ,'ig');
            //http://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
            //var oRegEx = new RegExp("(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
            sClass = sClass || 'url-distinguish';
            $super( oRegEx, sClass );
        }
    });

    scUtils.DistinguishCreditCardTextFilter = Class.create(scUtils.DistinguishTextFilter,{
        initialize:function( $super, sClass ){
            //Found here http://www.regular-expressions.info/examples.html
            var oRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$./ig;
            sClass = sClass || 'credit-card-distinguish';
            $super( oRegEx, sClass );
        }
    });
}(scUtils);
