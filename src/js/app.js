// The initial locations.
// Using an object for each array element
// allows room to easily add more criteria.
// e.g. "restaurant", "street", "address", "phone"

var initialLocations = [
  {
     name: "Brooklyn",
     state: "NY",
     visible: true
  },
  {
     name: "Queens",
     state: "NY",
     visible: true
  },
  {
     name: "Harlem",
     state: "NY",
     visible: true
  },
  {
     name: "Hell's Kitchen",
     state: "NY",
     visible: true
  },
  {
     name: "Washington Heights",
     state: "NY",
     visible: true
  },
  {
     name: "Soho",
     state: "NY",
     visible: true
  }
];

// Location: Constructor that will be used for each location.
// All properties are observables.

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.state = ko.observable(data.state);
  this.visible = ko.observable(data.visible);
};

var ViewModel = function() {
  var self = this;

  // locList is the main observable Array.
  // It will hold all the objects built with the 
  // "Location" constructor.

  this.locList = ko.observableArray([]);
  this.prompt = ko.observable("Type Location Here");
  this.toggleListView = ko.observable(true);
  this.showFilterError = ko.observable(false);

  // buildList: Build the locList from the initialLocations array.
  // This is the initial list displayed, 
  // in which all locations are visible.

  this.buildList = function() {
    initialLocations.forEach(function(locItem) {
      self.locList.push(new Location(locItem));
    });
  };
  this.buildList();

  // buildMap: Build the map.
  // The mapLocations array contains all visible locations.
  // Calls initializeMap, which is defined in the google.Map.js file.
  // "false" parameter means to NOT bounce the marker for each location.
  // "true" parameter means DO bounce the marker for each location. 
  // Only run after whole window is loaded, or errors may occur.

  this.buildMap = function() {
    var mapLocations = [];
    self.locList().forEach(function(loc) {
      if (loc.visible()) {
        mapLocations.push('' + loc.name() + ', ' + loc.state() + '');
      }
    });
    window.addEventListener('load', initializeMap(mapLocations, false));
  };
  this.buildMap();

  // filterList: Filter list and map of locations based on user input.
  // formElement is the form element, passed in by Knockout.
  // inputString is the value the user typed in.
  // regexp is the same string, but formatted as a regular expression.
  // the test method will return true if a match is found given the "place".
  // based on that test,  the visible status of each location is set to true or false.
  // the list view will update automatically because of a foreach data-bind to the ul tag.
  // finally, the map is rebuilt.

  this.filterList = function(formElement) {
    var inputString = $(formElement).children("input").val();
    var regexp = new RegExp(inputString);
    this.showFilterError(true); // set error message to show unless a match is found.
    self.locList().forEach(function(loc) {
      var place =  loc.name() + loc.state();
      regexp.test(place) ? loc.visible(true) : loc.visible(false);
      // if any single match is found, set error message to NOT show.
      if (regexp.test(place)) {
        self.showFilterError(false)
      }
    });
    this.buildMap();
  };

  // Reset: Reset button to clear the filter form.
  // Sets all locations to visible.
  // Returns "prompt" to original value.

  this.reset = function() {
    // to clear the browser cache of input form:
    document.getElementById("filter-form").reset();  
    self.prompt("Type Location Here");
    this.showFilterError(false);
    self.locList().forEach(function(loc) {
      loc.visible(true);
    });
    this.buildMap();
  };

  // Edit: Clear out the prompt text when a user clicks on the form.

  this.edit = function() {
    this.prompt("");
  };

  // toggleListPanel: Clicking on menu icon (which is only visible below 768px in width)
  // Will either hide or show the entire list panel.
  // toggleListView is data bound to the div of the entire
  // list view panel.
  // I think this could be done more simply.

  this.toggleListPanel = function() {
    this.toggleListView(!this.toggleListView());
  };

  // bounceMarker: Clicking on list item makes associated marker in map bounce.
  // Only applies to the single, clicked-upon item.
  // The "true" parameter means initializeMap will do the right thing
  // for just this one location.  All other locations are left alone.
  
  this.bounceMarker = function(loc) {
    var bounceLocation = [];
    bounceLocation.push('' + loc.name() + ', ' + loc.state() + '');
    window.addEventListener('load', initializeMap(bounceLocation, true));
  };
};
ko.applyBindings(new ViewModel());
