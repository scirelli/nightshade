Ext.define('Ext.ux.extPrintWindow',{
    extend:'Ext.window.Window',
    alias:'widget.printwindow',
    cssLinks:'',
    renderTo:document.body,
    initComponent:function(){
        this.callParent(arguments);
    },
    show:function(){
        this.callParent(arguments);
    },
    hide:function(){
        this.callParent(arguments);
    },
    listeners:{
        afterrender:function( ths, eOpts ){
            var html = ths.body.dom.innerHTML;
            ths.removeAll();
            ths.add(
                {
                    xtype:'panel',
                    layout:'anchor',
                    vseHTML:html,
                    html:'<iframe id="' + sFrameId + '" width="100%" height="100%" src="' + sFrameId + '"></iframe>',
                    sFrameId:sFrameId,
                    listeners:{
                        afterrender:function(ths,eOpts){
                            var oWindow = window.frames[ths.sFrameId];
                            if( !oWindow ){
                                oWindow = window.frames;
                                for( var i=0, l=oWindow.length; i<l; i++ ){
                                    if( oWindow[i].frameElement.id == ths.sFrameId ){
                                        oWindow = oWindow[i];
                                        break;
                                    }
                                }
                            }
                            oWindow.vseHTML  = ths.vseHTML;
                            oWindow.cssLinks = ths.cssLinks;
                            oWindow.onload = function(){
                                this.document.head.innerHTML = this.cssLinks;
                                this.document.body.innerHTML = this.vseHTML; 
                            }
                        }
                    }
                }
            );
        }
    }
});
