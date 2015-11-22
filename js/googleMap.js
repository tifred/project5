var map;    // declares a global map variable
var currentMarker = null;

function initializeMap(locations, bounce) {

  // var locations;

  var mapOptions = {
    mapTypeId:google.maps.MapTypeId.TERRAIN
  };

    map = new google.maps.Map(document.querySelector('#map'), mapOptions);
//  map = new google.maps.Map(document.querySelector('#map'));

  function createMapMarker(placeData, nytInfo) {

    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name,
    });
    marker.map.setZoom(12);

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      // content: '<img src="http://placehold.it/250x200">'
      content: nytInfo
    });

    function oneBounceOnly(marker) {
        if (currentMarker) currentMarker.setAnimation(null);
        currentMarker = marker;
        marker.setAnimation(google.maps.Animation.BOUNCE);
    };

    if (bounce) {
	infoWindow.open(map, marker);
        oneBounceOnly(marker);
    } else {
      google.maps.event.addListener(marker, 'click', function() {
	infoWindow.open(map, marker);
        oneBounceOnly(marker);
      });
    }

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
    }
  }

  function pinPoster(locations) {

    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    // WAS: for (var place in locations) 

    for (var i = 0; i < locations.length; i++) {

      // the search request object
      var request = {
        query: locations[i]
      };
      
      service.textSearch(request, callback);
    }
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);
}



// Calls the initializeMap() function when the page loads
// window.addEventListener('load', initializeMap(locations));

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});
