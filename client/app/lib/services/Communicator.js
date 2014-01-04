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
     * packet to be sent
     */
    communicator.packet = {};
    communicator.alertPacket = {};

    communicator.send = function(packet) {
      communicator.packet = packet;
      $rootScope.$broadcast(communicator.CHANNEL);
    };

    communicator.alert = function(packet) {
      communicator.alertPacket = packet;
      $rootScope.$broadcast(communicator.ALERT_CHANNEL);
    };

    return communicator;
  });
