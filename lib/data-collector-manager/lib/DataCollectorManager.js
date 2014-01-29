var Q = require('q'),
    util = require('util');

var STATUS = {};
STATUS.SELF = '\n\n\nDataCollectorManager: ';

var _workers = {};

function DataCollectorManager() {
}

function _success(data, defer) {
    console.log(STATUS.SELF, 'success', new Date());
    defer.resolve(data);
}

function _error(error, defer) {
    console.log(STATUS.SELF, 'error', error);
    defer.reject(new Error(error));
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
      console.log(STATUS.SELF, 'launching worker');
      console.log(worker);
      promise = _workers[worker].apply(this, arguments);
      promises.push(promise);
    }

    console.log(STATUS.SELF, 'promises', promises);
    Q.all(promises).then(function(data) { _success(data, defer); }, defer.reject, defer.notify);

    return defer.promise;
  }

};

module.exports = DataCollectorManager;
