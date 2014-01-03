if( !String.prototype.trim ){
    String.prototype.trim = function () {
        return this.replace(/^\s*/, "").replace(/\s*$/, "");
    }
}

if( !String.prototype.ltrim ){
    String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};
}

if( !String.prototype.rtrim ){
    String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};
}

String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};

if( !String.prototype.camelize )
    String.prototype.camelize = function(){
        return this.replace(/_+(.)?/g, function(match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }

if( !String.prototype.seperate )
    String.prototype.seperate = function(){
        return this.replace(/_+(.)?/g, function(match, chr) {
            return chr ? ' ' + chr.toUpperCase() : '';
        });
    }

if( !String.prototype.capitalize )
    String.prototype.capitalize = function(){
        return this.charAt(0).toUpperCase() + this.substring(1);
    }

if( !String.prototype.endInSlash )
    String.prototype.endInSlash = function(){
        var sStr = this;
        if( /\/$/.test(this) == false ){
            sStr = this + '/';
        }
        return sStr;
    }

if( !String.prototype.endInBSlash )
    String.prototype.endInBSlash = function(){
        var sStr = this;
        if( /\$/.test(this) == false ){
            /*sStr = this + '\\';*/
        }
        return sStr;
    }

if( !String.prototype.escapeCSV )
    String.prototype.escapeCSV = function(){
        var sStr = this;
        sStr = sStr.replace(/"/g,'\\"').replace(/\n/g,"");
        return sStr;
    }

if( !String.prototype.htmlEscape )
    String.prototype.htmlEscape = function(){
        return String(this)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }

if( !String.prototype.htmlUnescape )
    String.prototype.htmlUnescape = function(){
        return String(this)
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }
