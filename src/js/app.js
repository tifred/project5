/* 
   The initial locations.
   Using an object for each array element
   allows room to easily add more criteria in the future..
   e.g. "restaurant", "street", "address", "phone".
*/

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

/* 
   Location: Constructor that will be used for each location.
   All properties are observables.
*/

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.state = ko.observable(data.state);
  this.visible = ko.observable(data.visible);
};

var ViewModel = function() {
  var self = this;

  /* 
     locList is the main observable Array.
     It will hold all the objects built with the
     "Location" constructor.
  */

  this.locList = ko.observableArray([]);
  this.prompt = ko.observable("Type Location Here");
  this.toggleListView = ko.observable(false);
  this.showFilterError = ko.observable(false);
  this.searchInputValue = ko.observable("");
  this.listViewClasses = ko.observable("col-sm-3 hidden-xs");

  /* 
     buildList: Build the locList from the initialLocations array.
     This is how the initial list is displayed,
     in which all locations are visible.
  */

  this.buildList = function() {
    initialLocations.forEach(function(locItem) {
      self.locList.push(new Location(locItem));
    });
  };
  this.buildList();  // build it now.

  /*
     buildMap: Build the map.
     The mapLocations array contains all visible locations.
     Calls initializeMap, which is defined in the google.Map.js file.
     "false" parameter means DO NOT bounce the marker for each location.
     "true" parameter means DO bounce the marker for each location.
     (Note: this is unrelated to setting up event handlers to bounce markers.
     That happens in the google.Map.js file.)
     Only run after whole window is loaded, or errors may occur.
  */

  this.buildMap = function() {
    var mapLocations = [];
    self.locList().forEach(function(loc) {
      if (loc.visible()) {
        mapLocations.push('' + loc.name() + ', ' + loc.state() + '');
      }
    });
    window.addEventListener('load', initializeMap(mapLocations, false));
  };
  this.buildMap();  // build it now.

  /*
    filterList: Filter list and map of locations based on user input.
    formElement is the form element, passed in by Knockout.
    inputString is the value the user typed in.
    regexp is the same string, but formatted as a regular expression.
  */

  this.filterList = function(formElement) {
    var inputString = $(formElement).children("input").val();
    var regexp = new RegExp(inputString, 'i');
    this.updateAfterFilter(regexp);
  };

  /*
    filterListRealTime: Filter list and map of locations based on user input.
    but do it with every character typed, as it is typed.
    the observable "searchInputvalue" is updated via a 'textInput" binding.
  */

  this.filterListRealTime = function() {
    var regexp = new RegExp(this.searchInputValue(), 'i');
    this.updateAfterFilter(regexp);
  };

  /*
    updateAfterFilter: helper method used by both filter methods.
    The test method will return true if a match is found given the "place".
    based on that test,  the visible status of each location is 
    set to true or false.  The list view will update automatically because of a 
    foreach data-bind to the ul tag.

    Another test is done to decide whether to show an error 
    when no matches are found.
    Finally, the map is rebuilt.
  */

  this.updateAfterFilter = function(regexp) {
    this.showFilterError(true); // set error message to show unless a match is found.
    self.locList().forEach(function(loc) {
      var place =  loc.name() + loc.state();
      regexp.test(place) ? loc.visible(true) : loc.visible(false);
      // if any single match is found, set error message to NOT show.
      if (regexp.test(place)) {
        self.showFilterError(false);
      }
    });
    this.buildMap();
  };

  /*
    Reset: Reset button to clear the filter form.
    Sets all locations to visible.
    Returns "prompt" to original value.
    Sets "showFilterError" to false so the error will not display.
  */

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

  // Edit: Clear out the prompt text when a user clicks on the input filter field.

  this.edit = function() {
    this.prompt("");
  };

  /*
     toggleListPanel: Clicking on menu icon (only visible below 768px in width)
     will either hide or show the entire list panel.
     toggleListView is data bound to the div of the entire list view panel.
  */

  this.toggleListPanel = function() {
    this.toggleListView(!this.toggleListView());
    if (this.toggleListView()) {
      this.listViewClasses("col-sm-3");
    } else {
      this.listViewClasses("col-sm-3 hidden-xs");
    }
  };

  /*
    bounceMarker: Clicking on list item makes associated marker in map bounce.
    Only applies to the single, clicked-upon item.
    The "true" parameter means initializeMap will do the right thing
    for just this one location.  All other locations are left alone.
  */

  this.bounceMarker = function(loc) {
    var bounceLocation = [];
    bounceLocation.push('' + loc.name() + ', ' + loc.state() + '');
    window.addEventListener('load', initializeMap(bounceLocation, true));
  };
};
/*
  The line below will be run from the googleSuccess function
  in the "googleCallback.js" file.
  Don't want to build model until we know google maps could be reached.
  Keeping it here as a comment just for comprehension's sake.
  ko.applyBindings(new ViewModel());
*/
