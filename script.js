(function(window, saferoutes) {

    var options = saferoutes.MAP_OPTIONS;
    element = document.getElementById('map-canvas');
    map = saferoutes.create(element, options);
    var searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));
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
    }); 
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

    for (var i = 4536; i < 4538; i++) {
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