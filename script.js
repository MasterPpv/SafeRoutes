(function(window, saferoutes) {

    var options = saferoutes.MAP_OPTIONS;
    element = document.getElementById('map-canvas');
    map = saferoutes.create(element, options);

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map.gMap's viewport.
    map.gMap.addListener('bounds_changed', function() {
      searchBox.setBounds(map.gMap.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map.gMap,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.gMap.fitBounds(bounds);
      map.zoom(17);
    });

  var origin_place_id = null;
  var destination_place_id = null;
  var travel_mode = google.maps.TravelMode.WALKING;
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map.gMap);
  var origin_input = document.getElementById('origin-input');
  var destination_input = document.getElementById('destination-input');
  var modes = document.getElementById('mode-selector');

  // map.gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
  // map.gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
  // map.gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map.gMap);
  var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map.gMap);

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, mode) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function() {
      travel_mode = mode;
    });
  }
  setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
  setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
  setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }

     origin_autocomplete.addListener('place_changed', function() {
     var place = origin_autocomplete.getPlace();
     if (!place.geometry) {
       window.alert("Autocomplete's returned place contains no geometry");
       return;
     }
     expandViewportToFitPlace(map.gMap, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    origin_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);
  });

  destination_autocomplete.addListener('place_changed', function() {
      console.log("hi");
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    expandViewportToFitPlace(map.gMap, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    destination_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);
  });

  function route(origin_place_id, destination_place_id, travel_mode,
                 directionsService, directionsDisplay) {

    if (!origin_place_id || !destination_place_id) {
      return;
    }
    directionsService.route({
      origin: {'placeId': origin_place_id},
      destination: {'placeId': destination_place_id},
      travelMode: travel_mode,
      provideRouteAlternatives: true
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        for (var i = 0, len = response.routes.length; i < len; i++) {
            if(i == 0)
            {
                response.routes[i] = new google.maps.DirectionsRenderer({
                    map: map.gMap,
                    directions: response,
                    routeIndex: i,
                    polylineOptions: {
                        // strokeColor: "#"+((1<<24)*Math.random()|0).toString(16),
                        strokeColor: "blue",
                        clickable: true,
                        strokeWeight: 5


                    }
                });
            }
            else
            {
            response.routes[i] = new google.maps.DirectionsRenderer({
                    map: map.gMap,
                    directions: response,
                    routeIndex: i,
                    polylineOptions: {
                        // strokeColor: "#"+((1<<24)*Math.random()|0).toString(16),
                        strokeOpacity: 1.0-i*0.1,
                        strokeColor: "grey",
                        strokeWeight: 3

                    }
                });
            }

      }
        directionsDisplay.setDirections(response);
    }
      else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

    // var input = document.getElementById('mapsearch')
    // var searchBox = new google.maps.places.SearchBox(input);
    // map.gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // map.gMap.addListener('bounds_changed', function() {
    //     searchBox.setBounds(map.gMap.getBounds());
    // });
    // google.maps.event.addListener(searchBox, 'places_changed', function(){

    //     var places = searchBox.getPlaces();
    //     var marker = new google.maps.Marker({map:map.gMap})
    //     var bounds = new google.maps.LatLngBounds();
    //     var i, place;

    //     for(i = 0; place=places[i];i++) {
    //         console.log(place.geometry.location);
    //         bounds.extend(place.geometry.location);
    //         marker.setPosition(place.geometry.location);
    //     }
    //     map.gMap.fitBounds(bounds);
    //     // map.gMap.setZoom(15);
    //     map.gMap.setCenter(marker.getPosition());
    // });
    // fire off events
    // map._on('click', function(e) {
    //     alert('you have just clicked');
    //     console.log(e);
    //     console.log(this);
    // });
    // map._on('dragend', function(e) {
    //     alert('done dragging');
    // });
    // var marker = map.addMarker({
    //     lat: 37,
    //     lng: -122,
    //     visible: true,
    //     draggable: false,
    //     id: 555,
    //     icon: 'icons/fire.png',
    //     content: '<div style="color: #f00;">fire icon</div>'
    // });
    // var marker2 = map.addMarker({
    //     lat: 37.2,
    //     lng: -122.2,
    //     visible: true,
    //     draggable: false,
    //     id: 556,
    //     icon: 'icons/abduction.png',
    //     content: '<div style="color: #00ff00;">' + 'test 2' + '</div>'
    // });
    // for (var i = 0; i < 40; i++) {
    //     map.addMarker({
    //         id: 1,
    //         lat: 40.110833 + Math.random(),
    //         lng: -88.226944 + Math.random(),
    //         content: 'this is a fire icon',
    //         icon: 'icons/fire.png'
    //     })
    // }
    // for (var i = 0; i < 40; i++) {
    //     map.addMarker({
    //         id: 2,
    //         lat: 40.110833 + Math.random(),
    //         lng: -88.226944 + Math.random(),
    //         content: 'this is a kidnap icon',
    //         icon: 'icons/abduction.png'
    //     })
    // }
    // console.log(map.markers);
    // map._removeMarker(marker2);
    // var found = map.findMarkerByLat(37);
    // console.log(map.markers);

    // var found  = map.findBy(function(marker) {
    //     return marker.lat === 37;
    // });
    // console.log(found)

    // map.removeBy(function(marker) {
    //     return marker.id === 556;
    // });

    // var randomArr = [1, 2, 3];

    // randomArr.forEach(function(item){
    //     alert(item);
    // });

    // console.log(crimes);
    // map.removeBy(function(marker) {
    //     // if (marker.id === 2) {
    //     //     console.log(marker);
    //     // }
    //     return marker.id === 2;
    // });

    function pin_icon(str) {

        if (str.indexOf('VEHICLE') > -1) {
            return 'icons/carrental.png'
        }
        if (str.indexOf('FIRE') > -1) {
            return 'icons/fire.png'
        }
        if (str.indexOf('THEFT') > -1) {
            return 'icons/bank.png'
        }
        if (str.indexOf('UNLAWFUL USE OF I.D.') > 1) {
            return 'icons/bar.png'
        }
        if (str.indexOf('ALCOHOL') > 1) {
            return 'icons/bar.png'
        }
        if (str.indexOf('SEX') > 1) {
            return 'icons/rape.png'
        }
        if (str.indexOf('BURGLARY') > 1) {
            return 'icons/bank.png'
        }
        if (str.indexOf('BATTERY') > 1) {
            return 'icons/revolt.png'
        }
        if (str.indexOf('WEAPON') > 1) {
            return 'icons/shooting.png'
        }
        if (str.indexOf('ROBBERY') > 1) {
            return 'icons/shooting.png'
        }
        else {
            return 'icons/caution.png'
        }
    }

    for (var i = 4536; i < 4550; i++) {
        var dir = 'data/CPD' + i + '.PDF';
        crimes = readfile(dir);
        for (var j = 0; j < crimes.length; j++) {
            var crime = crimes[j];
            map.addMarker({
                lat: 40.04 + 0.13 * Math.random(),
                lng: -88.3 + 0.13 * Math.random(),
                content: '<div style="color: #000000;">TITLE: ' + crime.type + '</div><br/>' +
                    '<div style="color: #000000;">CRIME ID: ' + crime.id + '</div><br/>' +
                    '<div style="color: #000000;">DATE: ' + crime.date_occurred + ', ' + crime.time_occurred + '</div><br/>' +
                    '<div style="color: #000000;">LOCATION: ' + crime.location + '</div><br/>' +
                    '<div style="color: #000000;">DESCRIPTION: ' + crime.summary + '</div><br/>',
                icon: pin_icon(crime.summary + crime.type)
            });

            // map.test({
            //     address: crime.location,
            //     success: function(results) {
            //         console.log(crime.location);
            //         console.log('***************');
            //         map.addMarker({
            //             lat: results[0].geometry.location.lat(),
            //             lng: results[0].geometry.location.lng(),
            //             content: crime.location + '\n' + crime.summary,
            //             icon: 'icons/abduction.png'
            //         })
            //     },
            //     error: function(status) {
            //         console.error(status);
            //     }
            // })
        }
    }
    // google.maps.event.addListener(map.gMap, "click", function(event) {
    //     infowindow.close();
    // });
 /*   var searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));

// place change event on search box
    google.maps.event.addListener(searchBox, 'places_changed', function(){

  var places = searchBox.getPlaces();
  var marker = new google.maps.Marker({map:map.gMap})
  var bounds = new google.maps.LatLngBounds();
  var i, place;

  for(i = 0; place=places[i];i++) {
    console.log(place.geometry.location);
    bounds.extend(place.geometry.location);
    marker.setPosition(place.geometry.location);
  }
  map.gMap.fitBounds(bounds);
  map.gMap.setZoom(15);
}); */



}(window, window.SafeRoutes || (window.SafeRoutes = {})));
    // <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDK5S9WRR-34aN7iiD9gOaC_PnW1b7IwTc"></script>