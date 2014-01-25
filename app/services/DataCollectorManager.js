var Q = require('Q');

var _workers = {};

function DataCollectorManager() {
}

DataCollectorManager.prototype = {

  /**
   * add
   * @param worker {Function}
   * @return null
   */
  add: function(worker) {
    if(typeof worker === 'function') {
      this.remove(worker);
      _workers[worker] = worker; 
    }
    else {
      throw 'DataCollectorManager: add() expects a function';
    }

    return;
  },

  remove: function(worker) {
    if(_workers.hasOwnProperty(worker)) {
      delete _workers[worker];
    }
  },

  delegate: function() {
    var defer = Q.defer(),
        promises = [],
        promise;

    for(var worker in _workers) {
      promise = _workers[worker].apply(this, arguments);
      promises.push(promise);
    }

    Q.all(promises).then(defer.resolve, defer.reject, defer.notify);

    return defer.promise;
  }

};

module.exports = DataCollectorManager;
