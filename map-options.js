(function(window, google, saferoutes) {

    saferoutes.MAP_OPTIONS = {
        center: {
            lat: 37,
            lng: -122
        },
        zoom: 10
        // disableDefaultUI: false,
        // scrollwheel: true,
        // draggable: true,
        // mapTypeId: google.maps.MapTypeId.ROADMAP,
        // mapTypeId: google.maps.MapTypeId.HYBRID,
        // mapTypeId: google.maps.MapTypeId.SATELLITE,
        // maxzoom: 11,
        // minzoom: 9,
        // zoomControlOptions: {
        //     position: google.maps.ControlPosition.BOTTOM_RIGHT,
        //     style: google.maps.ZoomControlStyle.SMALL, // or DEFAULT
        // },
        // panControlOptions: {
        //     position: google.maps.ControlPosition.BOTTOM_RIGHT,
        // }
    };

}(window, google, window.SafeRoutes || (window.SafeRoutes = {})));