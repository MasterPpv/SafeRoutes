(function(window, google, List){

    // just like creating an object but it stores a function not an object
    var SafeRoutes = (function() {
        function SafeRoutes(element, options) {
            this.gMap = new google.maps.Map(element, options);
            this.markers = List.create();
        }
        SafeRoutes.prototype = {
            zoom: function(level) {
                if (level) {
                    this.gMap.setZoom(level);
                } else {
                    return this.gMap.getZoom();
                }
            },
            _on: function(options) {
                var self = this;
                google.maps.event.addListener(options.obj, options.event, function(e) {
                    options.callback.call(self, e);
                });
            },
            addMarker: function(options) {
                var marker;
                options.position = {
                    lat: options.lat,
                    lng: options.lng
                };
                marker = this._createMarker(options);
                this.markers.add(marker);
                if (options.event) {
                    this._on({
                        obj: marker,
                        event: options.event.name,
                        callback: options.event.callback
                    });
                }
                if (options.content) {
                    this._on({
                        obj: marker,
                        event: 'click',
                        callback: function () {
                            var info = new google.maps.InfoWindow({
                                content: options.content
                            });
                            info.open(this.gMap, marker);
                        }
                    })
                }
                return marker;
            },
            findBy: function(callback) {
                return this.markers.find(callback);
            },
            removeBy: function(callback) {
                this.markers.find(callback, function(markers) {
                    markers.forEach(function(marker) {
                        marker.setMap(null);
                    });
                });
            },
            _createMarker: function(options) {
                options.map = this.gMap;
                return new google.maps.Marker(options);
            }
        };
        return SafeRoutes;
    }());

    SafeRoutes.create = function(element, options) {
        return new SafeRoutes(element, options);
    };

    window.SafeRoutes = SafeRoutes;

}(window, google, List));