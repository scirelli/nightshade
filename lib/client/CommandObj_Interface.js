if( scUtils === undefined ) scUtils = new Object();

!function( scUtils ){
"use strict";//Just don't cross the streams!!
    scUtils.ICommand = Class.create({
      initialize: function() {
      },
      execute: function() {
          console.log('Execute method not implemented.');
      },
      undo: function(){
          console.log('Undo method not implemented');
      }
    });

    //------------------------------------------------
    // Null command object. does nothing.
    //
    //------------------------------------------------
    scUtils.NullCommand = Class.create(scUtils.ICommand, {
        //------------------------------------------------
        // Initializes
        //------------------------------------------------
        initialize: function( ){
        },
        execute: function() {
            console.log('NullCommand.executed');
        },
        undo: function(){
            console.log('NullCommand.undoed');
        }
    });

    scUtils.CompositeCommand = Class.create(scUtils.ICommand,{
        initialize:function( oCommands ){
            this.aCommands = new Array();
            this.push( oCommands );
        },

        push:function( oCommand ){
            if( oCommand instanceof scUtils.ICommand ){
                this.aCommands.push(oCommand);
            }else if( oCommand instanceof Array ){
                for( var i=0, l=oCommand.length,itm=null; i<l; i++ ){
                    this.push( oCommand[i] ); 
                }
            }
        },

        execute:function(){
            for( var i=0, c=this.aCommands, l=c.length,itm=null; i<l; i++ ){
                c[i].execute();
            }
        },

        undo:function(){
            for( var i=0, c=this.aCommands, l=c.length,itm=null; i<l; i++ ){
                c[i].undo();
            }
        }
    });
}(scUtils);
