/**
 * IManager
 * Interface to describe a manager that is responsible for handling
 * worker functions and delegating work.
 * 
 * Follows Composite pattern
 */
function IManager() {

  /**
   * @var _workers - collection of workers referenced by generated id
   */
  var _workers = {};

}

IManager.prototype = {

  /**
   * add
   * add worker
   */
  add: function(worker) {},

  /**
   * remove
   * remove worker
   */ 
  remove: function(id) {},

  /**
   * delegate
   * delegate all to all assigned workers
   */
  delegate: function() {}

};