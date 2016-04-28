var map = new google.maps.Map(document.getElementById('map-canvas'),{
  center:{
    lat: 27.72,
    lng: 85.36
  },
  zoom:15
}); 
/* var marker = new google.maps.Marker({
  position:{
    lat: 27.72,
    lng: 85.36
  },
  map:map,
  draggable: true
}); */

var searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));

// place change event on search box
google.maps.event.addListener(searchBox, 'places_changed', function(){

  var places = searchBox.getPlaces();
  var marker = new google.maps.Marker({map:map})
  var bounds = new google.maps.LatLngBounds();
  var i, place;

  for(i = 0; place=places[i];i++) {
    console.log(place.geometry.location);
    bounds.extend(place.geometry.location);
    marker.setPosition(place.geometry.location);
  }
  map.fitBounds(bounds);
  map.setZoom(15);
});