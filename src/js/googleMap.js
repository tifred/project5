/*
The rough order in which things happen:

  "map" variable is set up to attach final map to an HTML element.
  "initializeMap calls "pinPoster".
  "pinPoster" loops through locations array, gets "results" object from Google.
  "callback" is run on each set of results.
  "callback" does ajax query with New York Times API for extra info on each location.
  "callback" calls "createMapMarker".
  "createMapMarker" makes the marker, makes the info window.
  "createMapMarker" sets up event listener to bounce marker on click OR starts a bounce now.
*/


var map;                    // declares a global map variable
var currentMarker = null;   // used to ensure only one marker bounces at a time.

// initializeMap: the main function.
// Run from ViewModel in the "app.js" file.
// "locations" is an array with elements like: "Brooklyn, NY"
// "bounce" is a boolean:
//    true means to set one single location's marker bouncing right now.
//    false means to set an event listener to make that happen later.

// Note: if bounce was set to true when initializeMap was called,
// then the "locations" array was also set to only have a single location in it.
// That is the marker that will be set to bounce now.

function initializeMap(locations, bounce) {

  // Empty now, but may be useful in future.
  var mapOptions = {};

  // build instance of map from Google's constructor.
  // the final map image will be part of the "#map" element in the HTML.

  map = new google.maps.Map(document.querySelector('#map'), mapOptions);

  // Build map marker and info window per location.

  function createMapMarker(placeData, nytInfo) {

    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;       // name of the place from the place service
    var bounds = window.mapBounds;                // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location.
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    var infoWindow = new google.maps.InfoWindow({
      content: nytInfo
    });

    // oneBounceOnly: a helper function.
    // When marker is clicked, stop bouncing on any other bouncing markers.
    // Uses the currentMarker variable, which must be global.

    function oneBounceOnly(marker) {
        if (currentMarker) currentMarker.setAnimation(null);
        currentMarker = marker;
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    // Here is where the boolean parameter "bounce" matters.
    // If bounce is true, open the info window and bounce the marker NOW.
    // There will only be one location in the locations array.

    // Otherwise, set up an event listener to open the info window
    // and bounce the marker when there is a click LATER.

    if (bounce) {
        infoWindow.open(map, marker);
        oneBounceOnly(marker);
    } else {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
        oneBounceOnly(marker);
      });
    }

    // This is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // Fit the map to the new marker
    map.fitBounds(bounds);
    // Center the map
    map.setCenter(bounds.getCenter());
  }

  // callback: run by service.textSearch when it gets results back.
  // This handles data from both Google's Map API and the NYT's API.
  // There is error handling for both.

  // Use "status" to be sure results were received from Google's Map API.
  // If results don't come back, return error message to #map element.
  // You can test this by mangling "google.maps.places.PlacesServiceStatus.OK" below.
  // Change "OK" to "XXOK" and it will fail.

  // If results do come back, call New York Times data API.
  // Build string "nytinfo" of "li"s with the first three most recent articles about location.
  // Uses an AJAX call with a done and fail method.
  // It's important to acquire this info before running createMapMarker.
  // That function must have all the info from the NYT API, or it will have no info to display.
 
  // If results don't come back from NYT, display error in infoWindow.
  // You can test this by changing "api.nytimes" to "apiXX.nytimes".

  // Finally, call createMapMarker with results array and nytInfo string.

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var name = results[0].formatted_address.split(",")[0];
      var nytQuery = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + name + '&sort=newest&api-key=8d6910d8cc45e32cb31931220a4d3c4b:5:73416722';
      $.getJSON(nytQuery)
         .done(function(data) {
           var items = [];
           items.push("<ul>");
           for (var i = 0; i < 3; i++ ) {
             items.push( "<li class='article'> <a href='" + data.response.docs[i].web_url + "'> " + data.response.docs[i].headline.main + "</a> <p>" + data.response.docs[i].snippet + "</p> </li>");
           }
           items.push("</ul>");
           var nytInfo = items.join("");
           createMapMarker(results[0], nytInfo);
         })
         .fail(function() {
           var failText = "<p>Failed to Load the NYT articles.  Sorry.</p>";
           var nytInfo = failText;
           createMapMarker(results[0], nytInfo);
         });
    } else {
      $('#map').append('<h3>No results from Google Maps API.  Consider yourself lost.</h3>');
    }
  }

  function pinPoster(locations) {

    var service = new google.maps.places.PlacesService(map);

    // Iterate through the array of locations.
    // Create a search object for each location.
    // The callback will then go on to call createMapMarker.

    for (var i = 0; i < locations.length; i++) {
      // The search request object:
      var request = {
        query: locations[i]
      };
      // Go get results for the given query from Google.
      // When the results arrive, run the callback function.
      service.textSearch(request, callback);
    }
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // pinPoster(locations) creates pins on the map for each location.
  // This is the real start of the function.
  pinPoster(locations);
}

// Vanilla JS way to listen for resizing of the window and adjust map bounds
window.addEventListener('resize', function(e) {
  map.fitBounds(mapBounds);
});
