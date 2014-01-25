/**
 * IManager
 * Interface to describe a manager that is responsible for handling
 * worker functions and delegating work.
 * 
 * Follows Composite pattern
 */

/**
 * @var _workers - collection of workers referenced by generated id
 */
var _workers = {};


function IManager() {}

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
  remove: function(worker) {},

  /**
   * delegate
   * delegate all to all assigned workers
   */
  delegate: function() {}

};