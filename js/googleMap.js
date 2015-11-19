var map;    // declares a global map variable

var mapOptions = {
  disableDefaultUI: true
};

/* 
For the map to be displayed, the googleMap var must be
appended to #mapDiv in resumeBuilder.js. 
*/
map = new google.maps.Map(document.querySelector('#map'), mapOptions);


/*
createMapMarker(placeData) reads Google Places search results to create map pins.
placeData is the object returned from search results containing information
about a single location.
*/
function createMapMarker(placeData) {

  // The next lines save location data from the search result object to local variables
  var lat = placeData.geometry.location.lat();  // latitude from the place service
  var lon = placeData.geometry.location.lng();  // longitude from the place service
  var name = placeData.formatted_address;   // name of the place from the place service
  var bounds = window.mapBounds;            // current boundaries of the map window

  // marker is an object with additional data about the pin for a single location
  var marker = new google.maps.Marker({
    map: map,
    position: placeData.geometry.location,
    title: name
  });

  // infoWindows are the little helper windows that open when you click
  // or hover over a pin on a map. They usually contain more information
  // about a location.
  var infoWindow = new google.maps.InfoWindow({
    content: name
  });

  // hmmmm, I wonder what this is about...
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map, marker);
  });

  // this is where the pin actually gets added to the map.
  // bounds.extend() takes in a map location object
  bounds.extend(new google.maps.LatLng(lat, lon));
  // fit the map to the new marker
  map.fitBounds(bounds);
  // center the map
  map.setCenter(bounds.getCenter());
}

/*
callback(results, status) makes sure the search returned results for a location.
If so, it creates a new map marker for that location.
*/
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMapMarker(results[0]);
  }
}


// creates a Google place search service object. PlacesService does the work of
// actually searching for location data.
var service = new google.maps.places.PlacesService(map);

/*
    // the search request object
    var request = {
      query: locations[place]
    };

    // Actually searches the Google Maps API for location data and runs the callback
    // function with the search results after each search.
    service.textSearch(request, callback);
*/

/*
// Sets the boundaries of the map based on pin locations
window.mapBounds = new google.maps.LatLngBounds();


// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});
*/
