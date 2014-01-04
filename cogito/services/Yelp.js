module.exports = function(OAuth, Geocoder, YelpConfig) {

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

  function search(callback) {
    OAuth.client(YelpConfig);

    var params = {
      term: 'food',
      location: 'Washington DC',
      // category_filter: 'active',
      deals_filter: true,
      limit: 10
    };

    OAuth.get('http://api.yelp.com/v2/search', params, function(err, data, res) {
      try{
        data =  JSON.parse(data);
      }
      catch(e) {}

      var items = data.businesses,
          geocodedData = [],
          index = 0,
          address;

      items.forEach(function(item, index) {
        address = _getAddress(item); 

        if(address) {
          console.log('making a geocoder query', address);
          Geocoder.query(address, function(err, res) {
            var geoData = '';
            res.on('data', function(data) {
              geoData += data;
            });

            res.on('end', function() {
              console.log('geocoder ended', geoData);
              try{
                geoData = JSON.parse(geoData);
              }
              catch(e) {
                return;
              };

              ++index;

              geoData = Geocoder.extractor(geoData.results);

              if(geoData) {
                console.log('geodata had something', geoData);
                item['_location'] = geoData;
                item['_location']
                if(index == items.length) {
                  console.log('index reached length');
                  callback(data);
                }
              }
              else{
                callback([]);
              }
            });
          });
        }
        else {
          console.log('address was not found from yelp results');
          callback([]);
        }
      });

    });
  }

  return {
    search: search
  };

}