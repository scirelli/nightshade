module.exports = function(INofitifaction, Class) {

  return Class.create( INotifications.ANotifier, {
      initialize:function($super){
        $super();
      }
  });
  
}