angular.module('lib.services.communicator', [])
  .factory('Communicator', function($rootScope) {

    var communicator = {};

    /**
     * channel, event namespace
     * for broadcasting and listening
     */
    communicator.CHANNEL = '__COMMUNICATOR_SERVICE__';
    communicator.ALERT_CHANNEL = '__COMMUNICATOR_ALERT_CHANNEL__';

    /**
     * map channels
     */
    communicator.MAP_SET_CENTER_CHANNEL = '__COMMUNICATOR_MAP_SET_CENTER_CHANNEL__';
    communicator.MAP_MARKER_SELECTED_CHANNEL = '__COMMUNICATOR_MAP_MARKER_SELECTED_CHANNEL__';

    /**
     * packet to be sent
     */
    communicator.packet = {};

    communicator.send = function(channel, packet) {
      if(packet) {
        communicator.packet = packet;
        $rootScope.$broadcast(channel || communicator.CHANNEL);
      }
      else{
        console.log('Communicator: packet is required');
      }
    };

    return communicator;
  });
