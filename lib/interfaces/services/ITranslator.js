/**
 * ITranslator
 * Interface to describe a manager that is responsible for handling
 * worker functions and delegating work.
 * 
 * Follows Composite pattern
 */
function ITranslator() {

  /**
   * @var _workers - collection of workers referenced by generated id
   */
  var _workers = {};

}

ITranslator.prototype = {

  /**
   * translate
   * translates data to the Common Data Schema
   * @param data - structure depends on Class implementing IDataSource
   * @return promise
   */
  translate: function(data) {},

  /**
   * title
   */ 
  title: function(id) {},

  /**
   * description
   */
  description: function() {},

  /**
   * category
   */
  category: function() {},

  /**
   * location
   */
  location: function() {},

  /**
   * address
   */
  address: function() {},


  /**
   * externalLink
   */
  externalLink: function() {},

  /**
   * imageUrl
   */
  imageUrl: function() {},

  /**
   * metadata
   */
  metadata: function() {}
  
};