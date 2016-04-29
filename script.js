(function(window, saferoutes) {

    // initialization 
    var options = saferoutes.MAP_OPTIONS;
    element = document.getElementById('map-canvas');
    map = saferoutes.create(element, options);


    // create searchbox and position it
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
    // adjust map bounds upon being changed and perform search when user enters new place.
    adjustBounds(map.gMap);
    var markers = [];
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        clearMarkers(markers);
        // for each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map.gMap,
                title: place.name,
                position: place.geometry.location
            }));
            expandViewPort(place, bounds);
        });
        map.gMap.fitBounds(bounds);
        map.zoom(17);
    });

//// searchbar api 

    function clearMarkers(markers) 
    {
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
    }  
    function expandViewPort(place, bounds)
    {
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } 
        else {
            bounds.extend(place.geometry.location);
        }
    }
    function adjustBounds(map) {
        map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
        });
    }



//// directions implementation

    var origin_place_id = null;
    var destination_place_id = null;
    var travel_mode = google.maps.TravelMode.WALKING;
    var origin_input = document.getElementById('origin-input');
    var destination_input = document.getElementById('destination-input');
    var modes = document.getElementById('mode-selector');

    adjustBounds(map.gMap);
    var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
    origin_autocomplete.bindTo('bounds', map.gMap);
    var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
    destination_autocomplete.bindTo('bounds', map.gMap);

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    
    setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
    setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
    setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);
    origin_autocomplete.addListener('place_changed', function() {
        clearMarkers(markers)
        var place = origin_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        expandViewportToFitPlace(map.gMap, place);

        // If the place has a geometry, store its place ID and route if we have
        // the other place ID
        origin_place_id = place.place_id;
        // route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
    });

    destination_autocomplete.addListener('place_changed', function() {
        clearMarkers(markers)
        var place = destination_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        expandViewportToFitPlace(map.gMap, place);

        // If the place has a geometry, store its place ID and route if we have
        // the other place ID
        destination_place_id = place.place_id;
        // route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
    });
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map.gMap);
    var search = document.getElementById('search');
    search.addEventListener("click", function() {
        route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
    });


//// directions api

    function setupClickListener(id, mode) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
            travel_mode = mode;
        });
    }

    function expandViewportToFitPlace(map, place) {
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
    }

    function route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay) {
        if (!origin_place_id || !destination_place_id) {
          return;
        }
        directionsService.route({
            origin: {'placeId': origin_place_id},
            destination: {'placeId': destination_place_id},
            travelMode: travel_mode,
            provideRouteAlternatives: true
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                for (var i = 0, len = response.routes.length; i < len; i++) {
                    if (i == 0) {
                        response.routes[i] = new google.maps.DirectionsRenderer({
                            map: map.gMap,
                            panel: document.getElementById('right-panel'),
                            directions: response,
                            routeIndex: i,
                            polylineOptions: {
                                strokeColor: "blue",
                                clickable: true,
                                strokeWeight: 5
                            }
                        });
                    } else {
                    response.routes[i] = new google.maps.DirectionsRenderer({
                            map: map.gMap,
                            panel: document.getElementById('right-panel'),
                            directions: response,
                            routeIndex: i,
                            polylineOptions: {
                                strokeOpacity: 1.0-i*0.1,
                                strokeColor: "grey",
                                strokeWeight: 3

                            }
                        });
                    }
                }
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    

    

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
                content: '<b>TITLE:</b> ' + crime.type + '<br/>' +
                    '<b>CRIME ID:</b> ' + crime.id + '<br/>' +
                    '<b>DATE:</b> ' + crime.date_occurred + ', ' + crime.time_occurred + '</div><br/>' +
                    '<b>LOCATION:</b> ' + crime.location + '</div><br/>' +
                    '<b>DESCRIPTION:</b> ' + crime.summary + '</div><br/>',
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

}(window, window.SafeRoutes || (window.SafeRoutes = {})));

function checkbox_changed() {
    if (document.getElementById("Assault").checked) {
        map.showBy(function(marker) {
            return marker.icon === 'icons/revolt.png';
        });
    } else {
        map.hideBy(function(marker) {
            return marker.icon === 'icons/revolt.png';
        });
    }
    if (document.getElementById("Theft").checked) {
        map.showBy(function(marker) {
            return marker.icon === 'icons/bank.png';
        });
    } else {
        map.hideBy(function(marker) {
            return marker.icon === 'icons/bank.png';
        });
    }
    if (document.getElementById("Fire").checked) {
        map.showBy(function(marker) {
            return marker.icon === 'icons/fire.png';
        });
    } else {
        map.hideBy(function(marker) {
            return marker.icon === 'icons/fire.png';
        });
    }
    if (document.getElementById("Other").checked) {
        map.showBy(function(marker) {
            return marker.icon === 'icons/caution.png';
        });
    } else {
        map.hideBy(function(marker) {
            return marker.icon === 'icons/caution.png';
        });
    }

}
