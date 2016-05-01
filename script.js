(function(window, saferoutes) {

    // initialization
    var options = saferoutes.MAP_OPTIONS;
    element = document.getElementById('map-canvas');
    map = saferoutes.create(element, options);


    // create searchbox and position it
    var search_input = document.getElementById('search-input');
    var search_box = new google.maps.places.SearchBox(search_input);
    map.gMap.controls[google.maps.ControlPosition.TOP_LEFT].push(search_input);

    // adjust map bounds upon being changed and perform search when user enters new place.
    function adjust_bounds(map) {
        map.addListener('bounds_changed', function() {
            search_box.setBounds(map.getBounds());
        });
    }

    function clear_markers(markers) {
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
    }

    function expand_viewport(place, bounds) {
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }

    adjust_bounds(map.gMap);
    var markers = [];
    search_box.addListener('places_changed', function() {
        var places = search_box.getPlaces();
        if (places.length == 0) {
            return;
        }
        clear_markers(markers);

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
            expand_viewport(place, bounds);
        });
        map.gMap.fitBounds(bounds);
        map.zoom(17);
    });



    // directions implementation
    var origin_place_id = null;
    var destination_place_id = null;
    var travel_mode = google.maps.TravelMode.WALKING;
    var origin_input = document.getElementById('origin-input');
    var destination_input = document.getElementById('destination-input');

    adjust_bounds(map.gMap);
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

    setupClickListener('walking', google.maps.TravelMode.WALKING);
    setupClickListener('transit', google.maps.TravelMode.TRANSIT);
    setupClickListener('driving', google.maps.TravelMode.DRIVING);

    function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
    }

    origin_autocomplete.addListener('place_changed', function() {
        clear_markers(markers)
        var place = origin_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        expandViewportToFitPlace(map.gMap, place);
        origin_place_id = place.place_id;
        // route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
    });

    destination_autocomplete.addListener('place_changed', function() {
        clear_markers(markers)
        var place = destination_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        expandViewportToFitPlace(map.gMap, place);
        destination_place_id = place.place_id;
        // route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
    });

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setOptions({
                            map: map.gMap,
                            panel: document.getElementById('steps-panel'),
                            // routeIndex: i,
                            // polylineOptions: {
                            //     // strokeColor: "blue",
                            //     // clickable: true,
                            //     // strokeWeight: 5,
                            //     visible: true
                            // }

                        })
    var search = document.getElementById('search');
    search.addEventListener("click", function() {
        route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);
    });


    // directions api
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
                for (var i = 0; i < response.routes.length; i++) {
                    console.log(response.routes[i].summary);
                    // response.routes[i].summary =+ "  (Safety Rating = " + (Math.floor(50 * Math.random()) + 50) / 10 + ")";
                }
                console.log(response.routes);
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function pin_icon(str) {
        // if (str.indexOf('VEHICLE') > -1) {
        //     return 'icons/carrental.png'
        // }
        if (str.indexOf('FIRE') > -1) {
            return 'icons/fire.png'
        }
        if (str.indexOf('THEFT') > -1) {
            return 'icons/bank.png'
        }
        if (str.indexOf('FIREARM') > 1) {
            return 'icons/shooting.png'
        }
        if (str.indexOf('ALCOHOL') > 1) {
            return 'icons/bar.png'
        }
        if (str.indexOf('SEX') > 1) {
            return 'icons/rape.png'
        }
        if (str.indexOf('RAPE') > 1) {
            return 'icons/rape.png'
        }
        if (str.indexOf('BURGLARY') > 1) {
            return 'icons/robbery.png'
        }
        if (str.indexOf('BATTERY') > 1) {
            return 'icons/revolt.png'
        }
        if (str.indexOf('WEAPON') > 1) {
            return 'icons/shooting.png'
        }
        if (str.indexOf('ROBBERY') > 1) {
            return 'icons/robbery.png'
        }
        if (str.indexOf('MONEY') > 1) {
            return 'icons/bank.png'
        }
        else {
            return 'icons/caution.png'
        }
    }

    for (var i = 4531; i < 4560; i++) {
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
                icon: pin_icon(crime.summary + crime.type),
                crime: crime
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

    var crime_types = {
        'assault': 'revolt.png',
        'theft': 'bank.png',
        'fire': 'fire.png',
        'robbery': 'robbery.png',
        'sexual-assault': 'rape.png',
        'other': 'caution.png'
    }

    function check(crime_type, start_date) {

        if (document.getElementById(crime_type).checked) {
            map.showBy(function(marker) {
                var date_condition = (new Date(marker.crime.date_occurred)).getTime() > start_date.getTime();
                return marker.icon === 'icons/' + crime_types[crime_type] && date_condition;
            });
            map.hideBy(function(marker) {
                var date_condition = (new Date(marker.crime.date_occurred)).getTime() > start_date.getTime();
                return marker.icon === 'icons/' + crime_types[crime_type] && !date_condition;
            });
        } else {
            map.hideBy(function(marker) {
                return marker.icon === 'icons/' + crime_types[crime_type];
            });
        }
    }

    function checkbox_changed() {
        if (document.getElementById('all-dates').checked) {
            var start_date = new Date(0);
        }
        if (document.getElementById('month').checked) {
            var start_date = new Date(new Date() - 30 * 24 * 3600 * 1000);
        }
        if (document.getElementById('two-weeks').checked) {
            var start_date = new Date(new Date() - 14 * 24 * 3600 * 1000);
        }
        if (document.getElementById('week').checked) {
            var start_date = new Date(new Date() - 7 * 24 * 3600 * 1000);
        }

        for (var crime_type in crime_types) {
            check(crime_type, start_date);
        }
    }

    for (var crime_type in crime_types) {
        document.getElementById(crime_type).onchange = checkbox_changed;
    }
    var dates_filters = ['all-dates', 'month', 'two-weeks', 'week'];
    for (var i in dates_filters) {
        document.getElementById(dates_filters[i]).onchange = checkbox_changed;
    }

}(window, window.SafeRoutes || (window.SafeRoutes = {})));
