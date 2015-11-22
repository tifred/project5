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

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.state = ko.observable(data.state);
  this.visible = ko.observable(data.visible);
};

var ViewModel = function() {
  var self = this;

  this.locList = ko.observableArray([]);
  this.editing = ko.observable(false);
  this.prompt = ko.observable("Type Here");

  this.buildList = function() {
    initialLocations.forEach(function(locItem) {
      if (locItem.visible) {
	self.locList.push(new Location(locItem));
      }
    });
  };
  this.buildList();

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

  this.filterList = function(formElement) {
    var string = $(formElement).children("input").val();
    var str = new RegExp(string);
    self.locList().forEach(function(loc) {
      var place =  loc.name() + loc.state(); 
      str.test(place) ? loc.visible(true) : loc.visible(false);
    });
    this.buildMap();
  };

  this.reset = function() {
    document.getElementById("filter-form").reset();  // to clear the browser cache of input form
    self.prompt("Type Here");
    self.locList().forEach(function(loc) {
      loc.visible(true);
    });
    this.buildMap();
  };

  this.edit = function() {
    console.log("edit was run");
    this.prompt("");
  };

  this.bounceMarker = function(loc) {
    console.log(loc.name());
    var bounceLocation = [];
    bounceLocation.push('' + loc.name() + ', ' + loc.state() + '');
    window.addEventListener('load', initializeMap(bounceLocation, true));
  }; 
};
ko.applyBindings(new ViewModel());
