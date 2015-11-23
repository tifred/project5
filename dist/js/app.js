var initialLocations=[{name:"Brooklyn",state:"NY",visible:!0},{name:"Queens",state:"NY",visible:!0},{name:"Harlem",state:"NY",visible:!0},{name:"Hell's Kitchen",state:"NY",visible:!0},{name:"Washington Heights",state:"NY",visible:!0},{name:"Soho",state:"NY",visible:!0}],Location=function(i){this.name=ko.observable(i.name),this.state=ko.observable(i.state),this.visible=ko.observable(i.visible)},ViewModel=function(){var i=this;this.locList=ko.observableArray([]),this.prompt=ko.observable("Type Location Here"),this.toggleListView=ko.observable(!0),this.showFilterError=ko.observable(!1),this.buildList=function(){initialLocations.forEach(function(t){i.locList.push(new Location(t))})},this.buildList(),this.buildMap=function(){var t=[];i.locList().forEach(function(i){i.visible()&&t.push(""+i.name()+", "+i.state())}),window.addEventListener("load",initializeMap(t,!1))},this.buildMap(),this.filterList=function(t){var e=$(t).children("input").val(),s=new RegExp(e);this.showFilterError(!0),i.locList().forEach(function(t){var e=t.name()+t.state();s.test(e)?t.visible(!0):t.visible(!1),s.test(e)&&i.showFilterError(!1)}),this.buildMap()},this.reset=function(){document.getElementById("filter-form").reset(),i.prompt("Type Location Here"),this.showFilterError(!1),i.locList().forEach(function(i){i.visible(!0)}),this.buildMap()},this.edit=function(){this.prompt("")},this.toggleListPanel=function(){this.toggleListView(!this.toggleListView())},this.bounceMarker=function(i){var t=[];t.push(""+i.name()+", "+i.state()),window.addEventListener("load",initializeMap(t,!0))}};ko.applyBindings(new ViewModel);