module.exports = function(OAuth, Geocoder, YelpConfig) {

  var _geocodedData = [],
      _completedTasks = 0,
      _tasks = [],
      _yelpData = [];

  function _getAddress(item) {
    var address = '';
    if(item.location) {
      if(item.location && item.location.address && item.location.address.length > 0) {
        address += item.location.address[0];
      }

      if(item.location.city && item.location.state_code) {
        address += ' ' + item.location.city + ' ' + item.location.state_code; 
      }

      return address;
    }
    else {
      return false;
    }
    
  }

  function _reset() {
    _geocodedData = [];
    _completedTasks = [];
    _tasks = [];
    _yelpData = [];
  }

  function _checkIfComplete(callback) {
    _completedTasks++;
    console.log('completed tatsks', _completedTasks, _tasks.length);
    if(_completedTasks === _tasks.length) {
      callback(false, _yelpData);
      _reset();
    }
  }

  function _getlocationQuery(params) {
    params = params || {};

    if(params.lat && params.lon) {
      return params.lat + ',' + params.lon;
    }
    else {
      return null;
    }
  }

  function _getLatLon(address, item, callback) {
    Geocoder.query(address, function(error, geoData) {
      console.log('returned data');
      console.log(geoData);

      item['_location'] = geoData;
      _yelpData.push(item);

      _checkIfComplete(callback);
    });
  }

  function search(params, callback) {
    OAuth.client(YelpConfig);
 
    var yelpParams = {};
    yelpParams.ll = _getlocationQuery(params);
    yelpParams.category_filter = 'arts,active,food,yelpevents,nightlife';
    yelpParams.deals_filter = true;
    yelpParams.limit = 5;

    if(!yelpParams.ll) {
      delete yelpParams.ll
    }

    OAuth.get('http://api.yelp.com/v2/search', yelpParams, function(err, data, res) {
      var yelp;
      try {
        yelp =  JSON.parse(data);
      }
      catch(e) {}

      var yelpItems = yelp.businesses;

      console.log('yelp data returned', yelpItems);

      if(yelpItems.length == 0) {
        callback(false, []);
      }
      yelpItems.forEach(function(yelpItem, index) {

          var task = (function(item) {
              return function() {
                var address = _getAddress(item); 
                if(address) {
                  _getLatLon(address, item, callback);
                }
              };
          })(yelpItem);

          _tasks.push(task);
      });

      for(var task in _tasks) {
        if(_tasks.hasOwnProperty(task)) {
          _tasks[task]();
        }
      }

    });
  }

  return {
    search: search
  };

}


// Geocoder.query(address, function(err, res) {
//             var geoData = '';
//             res.on('data', function(data) {
//               geoData += data;
//             });

//             res.on('end', function() {
//               try{
//                 geoData = JSON.parse(geoData);
//               }
//               catch(e) {
//                 return;
//               };

//               ++index;

//               geoData = Geocoder.latLonExtractor(geoData.results);

//               console.log('testing geoData', geoData)
//               if(geoData) {
//                 item['_location'] = geoData;
//                 console.log(item);
//                 if(index == items.length) {
//                   callback(items);
//                 }
//               }
//               else{
//                 callback([]);
//               }
//             });
//           });