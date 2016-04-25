(function(window, saferoutes) {

    // map options
    var options = saferoutes.MAP_OPTIONS;
    element = document.getElementById('map-canvas');

    // map
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
    var marker = map.addMarker({
        lat: 37,
        lng: -122,
        visible: true,
        draggable: false,
        id: 555,
        icon: 'icons/fire.png',
        content: '<div style="color: #f00;">I like food</div>'
    });
    var marker2 = map.addMarker({
        lat: 37.2,
        lng: -122.2,
        visible: true,
        draggable: false,
        id: 556,
        icon: 'icons/abduction.png',
        content: '<div style="color: #f00;">' + 'test 2' + '</div>'
    });
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

    function readfile(url) {
        var file = new XMLHttpRequest();
        file.overrideMimeType('text/plain');
        file.open('GET', url, false);
        var crimes = [];
        file.onreadystatechange = function() {
            if (file.readyState === 4) {
                if (file.status === 200 || file.status == 0) {
                    var text = file.responseText;
                    var lines = text.split('\n');

                    // read a file line by line
                    for (var i = 0; i < lines.length; i++) {
                        var m1 = /^0 -12 Td \((.+)\) Tj/.exec(lines[i]);
                        if (m1 == null) {
                            continue;
                        }
                        line = m1[1].trim();
                        var m2 = /^C16\-\d\d\d\d\d(.+)/.exec(line);
                        if (m2 != null) {
                            console.log(m2[1]);
                        }
                        console.log('******************************');

                    }
                }
            }
        }
        file.send(null);
    }
    readfile('CPD4538.PDF');
    // var str = "LOCATION:   600 BLOCK OF E DANIEL ST                      KAMS BAR";
    // var match = //
    // console.log();

}(window, window.SafeRoutes || (window.SafeRoutes = {})));