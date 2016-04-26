(function(window, saferoutes) {

    var options = saferoutes.MAP_OPTIONS;
    element = document.getElementById('map-canvas');
    map = saferoutes.create(element, options);

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

    for (var i = 4536; i < 4560; i++) {
        dir = 'data/CPD' + i + '.PDF';
        crimes = readfile(dir);

        for (var j = 0; j < crimes.length; j++) {
            crime = crimes[j];
            console.log(crime.location);
            console.log('***************');
            map.geocode({
                address: crime.location,
                success: function(results) {
                    map.addMarker({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                        content: 'test',
                        icon: 'icons/abduction.png'
                    })
                },
                error: function() {}
            });
        }
    }




}(window, window.SafeRoutes || (window.SafeRoutes = {})));
    // <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDK5S9WRR-34aN7iiD9gOaC_PnW1b7IwTc"></script>