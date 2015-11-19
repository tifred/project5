var initialLocations = [
  {
     name: "Zion",
     state: "Utah",
     visible: true
  },
  {
     name: "Canyonlands",
     state: "Utah",
     visible: true
  },
  {
     name: "Moab",
     state: "Utah",
     visible: true
  },
  {
     name: "Arches",
     state: "Utah",
     visible: true
  },
  {
     name: "Boulder",
     state: "Colorado",
     visible: true
  }
];

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.state = ko.observable(data.state);
  this.visible = ko.observable(data.visible);
};

var ViewModel = function() {
  var self = this;

  this.locList = ko.observableArray([]);

  initialLocations.forEach(function(locItem) {
    self.locList.push(new Location(locItem));
  });

  this.addToMap = function(name, state) {
    var request = {
      query: '' + name + ', ' + state + ''
    };
    console.log("from addToMap" + request);
    // Actually searches the Google Maps API for location data and runs the callback
    // function with the search results after each search.
    service.textSearch(request, callback);
  };

  initialLocations.forEach(function(locItem) {
    console.log(locItem.name + locItem.state);
    self.addToMap(locItem.name, locItem.state);
  });

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();


  // Vanilla JS way to listen for resizing of the window
  // and adjust map bounds
  window.addEventListener('resize', function(e) {
    //Make sure the map bounds get updated on page resize
    map.fitBounds(mapBounds);
  });



};

ko.applyBindings(new ViewModel());
