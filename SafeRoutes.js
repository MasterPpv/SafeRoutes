(function(window, google, List){

    var SafeRoutes = (function() {
        function SafeRoutes(element, options) {
            this.gMap = new google.maps.Map(element, options);
            this.geocoder = new google.maps.Geocoder();
            this.markers = List.create();
            this.prev_info = false;
            if (options.cluster) {
                this.markerClusterer = new MarkerClusterer(this.gMap, [], options.clusterer);
            }
        }
        SafeRoutes.prototype = {
            geocode: function(options) {
                this.geocoder.geocode({address: options.address}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        options.success.call(this, results, status);
                    } else {
                        options.error.call(this, status);
                    }
                });
            },
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
                var marker,
                    self = this;
                options.position = {
                    lat: options.lat,
                    lng: options.lng
                };
                marker = this._createMarker(options);
                if (options.cluster) {
                    this.markerClusterer.addMarker(marker);
                }
                this.markers.add(marker);
                if (options.content) {
                    this._on({
                        obj: marker,
                        event: 'click',
                        callback: function () {
                            var info = new google.maps.InfoWindow({ content: options.content });
                            console.log(info);
                            if( this.prev_info ) {
                                this.prev_info.close();
                            }
                            this.prev_info = info;
                            info.open(this.gMap, marker);
                        }
                    });
                }
                return marker;
            },
            findBy: function(callback) {
                return this.markers.find(callback);
            },
            removeBy: function(callback) {
                var self = this;
                self.markers.find(callback, function(markers) {
                    markers.forEach(function(marker) {
                        if (self.markerClusterer) {
                            self.markerClusterer.removeMarker(marker);
                        } else {
                            marker.setMap(null);
                        }
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
