module.exports = function(http, querystring, GeocodeConfig) {

  function latLonExtractor(results) {
    var first;
    if(results.length > 0) {
      first = results[0];
      try{
        return {
          lat: first.geometry.location.lat,
          lon: first.geometry.location.lng
        };
      }
      catch(e) {
        console.log('could not get geometry data from first item', first);
        return false;
      }
    }
    else {
      console.log('something else went wrong', results);
      return false;
    }
  }

  function query(address, callback) {
    var path = '/maps/api/geocode/json?' + querystring.stringify({address: address}) + '&sensor=true';

    var options = {
      hostname: 'maps.googleapis.com',
      port: 80,
      path: path,
      method: 'GET'
    };

    var request = http.request(options, function(res) {
      var geoData = '';
      res.on('data', function(data) {
        console.log('adding data');
        geoData += data;
      });

      res.on('end', function() {
        try{
          geoData = JSON.parse(geoData);
        }
        catch(e) {
          callback(true, e);
          return;
        };

        geoData = latLonExtractor(geoData.results);
        if(geoData) {
          callback(false, geoData);
          return;
        }
        else {
          callback(true, 'failed to extract lat lon from geocoder');
          return;
        }
      });

    });

    request.on('error', function(e) {
      callback(true, e);
    });


    request.end();
  }

  return {
    latLonExtractor: latLonExtractor,
    query: query
  };

}