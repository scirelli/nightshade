//*****************************************
// Author: Steve Cirelli
// File Desc: Logging for ext
//*****************************************
var LOGTYPE = new Object();
DefineProps.addProperty( LOGTYPE, 'ERROR',   1 );
DefineProps.addProperty( LOGTYPE, 'E',       1 );
DefineProps.addProperty( LOGTYPE, 'WARNING', 2 );
DefineProps.addProperty( LOGTYPE, 'W',       2 );
DefineProps.addProperty( LOGTYPE, 'MESSAGE', 3 );
DefineProps.addProperty( LOGTYPE, 'M',       3 );

var ISCLogger = Class.create({
    initialize:function(){
    },
    log:function(){
        throw 'ISCLogger.log unimplemented.'; 
    },
    error:function(){
        throw 'ISCLogger.error unimplemented.'; 
    },
    warn:function(){
        throw 'ISCLogger.warn unimplemented.'; 
    }
});

var ILogMsg = Class.create({
            setMsg:function( sMsg ){ },
            setType:function( nType ){ },
            getMsg:function(){ },
            getType:function(){ }
});

var ASCExtLogger = Class.create( ISCLogger, {
    initialize:function( oPanelToAddLogTo ){
        this.oAddToPanel = oPanelToAddLogTo;
        this.sStoreId    = 'SCExtLoggerStore';
        this.oSCLoggerMsg = this.createMsgClass();
        this.oStore      = this.createStore();
        this.oLogPanel   = this.createPanel();
    },

    //@protected
    createMsgClass:function(){
        return Class.create(ILogMsg, {
            initialize:function( sMsg, nType, dDate ){
                this.sMsg = '';
                this.nType = LOGTYPE.MESSAGE;
                this.setType(nType);
                this.setMsg(sMsg);
                this.sTimeStamp = dDate instanceof Date ? dDate : new Date();
            },

            setMsg:function( sMsg ){
                sMsg = JSON.stringify(sMsg) || '';
                switch(this.nType){
                    case LOGTYPE.ERROR:
                        this.sMsg = this.red(sMsg);
                        break;
                    case LOGTYPE.WARNING:
                        this.sMsg = this.yellow(sMsg);
                        break;
                    case LOGTYPE.MESSAGE:
                    default:
                        this.sMsg = sMsg;
                }
            },

            setType:function( nType ){
                this.nType = parseInt(nType) || LOGTYPE.MESSAGE;
            },
            getMsg:function(){
                return this.sMsg;
            },
            getType:function(){
                return this.nType;
            },
            //@private
            red:function( sMsg ){
                return '<font style="color:red">' + sMsg + '</font>';
            },
            //@private
            yellow:function( sMsg ){
                return '<font style="color:#BFC900">' + sMsg + '</font>';
            }
        });
    },

    //@protected
    createStore:function(){
        var store = Ext.create('Ext.data.ArrayStore', {
            // store configs
            storeId: this.sStoreId,
            // reader configs
            fields: Object.keys( new this.oSCLoggerMsg() ), 
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: ''
                }
            }
        });
        return store;
    },

    //@protected
    createPanel:function(){
        throw 'ASCExtLogger.createPanel unimplemented.'; 
    },

    //@protected
    logToConsole:function(oMsg){
        var nType = oMsg.getType();
        switch(oMsg.nType){
            case LOGTYPE.ERROR:
                console.error(oMsg.getMsg());
                break;
            case LOGTYPE.WARNING:
                console.warn(oMsg.getMsg());
                break;
            case LOGTYPE.MESSAGE:
            default:
                console.log(oMsg.getMsg());
        }
    },

    log:function( $super, oMsg ){
        if( oMsg instanceof this.oSCLoggerMsg == false ){
            oMsg = new this.oSCLoggerMsg( oMsg, LOGTYPE.MESSAGE );
        }
        this.logToConsole( oMsg ); 
        this.oStore.insert( 0, oMsg );
        return oMsg;
    },

    error:function( $super, oMsg ){
        if( oMsg instanceof this.oSCLoggerMsg == false ){
            oMsg = new this.oSCLoggerMsg( oMsg, LOGTYPE.ERROR );
        }
        oMsg.setType( LOGTYPE.ERROR );
        this.log( oMsg );
        return oMsg;
    },

    warn:function( $super, oMsg ){
        if( oMsg instanceof this.oSCLoggerMsg == false ){
            oMsg = new this.oSCLoggerMsg( oMsg, LOGTYPE.WARNING );
        }
        oMsg.setType( LOGTYPE.WARNING );
        this.log( oMsg );
        return oMsg;
    },

    getLogPanel:function(){
        return this.oLogPanel;
    }
});

var SCExtLogger = Class.create( ASCExtLogger, {
    initialize:function( $super, oPanelToAddLogTo ){
        $super( oPanelToAddLogTo );
    },

    //@private
    createMsgClass:function($super){
        return $super();
    },

    //@private
    createPanel:function(){
        var me = this;
        var panel = Ext.create('Ext.grid.Panel', {
            title: 'Log',
            store: this.sStoreId,
            columns: [
                { text: 'Type', dataIndex: 'nType', renderer:function( value, metadata, record, rowIndex, colIndex, store, view ){ 
                    var nType = parseInt(value);
                    switch(nType){
                        case LOGTYPE.ERROR:
                            return record.raw.red('Error');
                        case LOGTYPE.WARNING:
                            return record.raw.yellow('Warning');
                        case LOGTYPE.MESSAGE:
                        default:
                        return 'Log'; 
                    }
                }},
                { text: 'Message', dataIndex: 'sMsg', flex: 1 },
                { text: 'Date',    dataIndex: 'sTimeStamp' }
            ],
            flex:1
        });
        return panel;
    }
});
