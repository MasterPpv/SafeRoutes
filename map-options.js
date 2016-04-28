(function(window, google, saferoutes) {

    saferoutes.MAP_OPTIONS = {
        center: {
            lat: 40.110833,
            lng: -88.226944
        },
        zoom: 15,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        }
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
        // cluster: {
        //     options: {
        //         styles: [{
        //             url: 'clusterers/m1.png',
        //             height: 56,
        //             width: 55,
        //             textColor: '#f00',
        //             textSize: 14
        //         },
        //         {
        //             url: 'clusterers/m2.png',
        //             height: 56,
        //             width: 55,
        //             textColor: '#f00',
        //             textSize: 14
        //         }]
        //     }
        // }
    };

}(window, google, window.SafeRoutes || (window.SafeRoutes = {})));