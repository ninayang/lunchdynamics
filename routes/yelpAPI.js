// Request API access: http://www.yelp.com/developers/getting_started/api_access
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'kX21ros95k75o9WON8lW7w',
  consumer_secret: 'IXJ-tOv9LjkfzEbezo3635S4C8U',
  token: '6o_mtnEv4ipVD7PW0x7WcRvq0_ZGtlcw',
  token_secret: 'ujJq0l5BHTBeDYzJRjfmZPB6xWQ',
});

console.log("hi");
// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({ term: 'food', location: '303 2nd St San Francisco CA' })
.then(function (data) {
  console.log(data);
})
.catch(function (err) {
  console.error(err);
});

// See http://www.yelp.com/developers/documentation/v2/business
yelp.business('yelp-san-francisco')
  .then(console.log)
  .catch(console.error);

yelp.phoneSearch({ phone: '+15555555555' })
  .then(console.log)
  .catch(console.error);

// A callback based API is also available:
yelp.business('yelp-san-francisco', function(err, data) {
  if (err) return console.log(error);
  console.log(data);
});