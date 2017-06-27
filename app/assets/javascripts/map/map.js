var map = new ol.Map({
	layers: [MAP_CONFIG.base_layer, GEOSERVER_CONFIG.boundaries_layer, MAP_CONFIG.draw_layer],
    target: 'map',
    controls: ol.control.defaults({attribution: false}).extend([
        MAP_CONFIG.draw_controls,
        MAP_CONFIG.snap_to
    ]),
	view: new ol.View({
        projection: MAP_CONFIG.projection,
		resolutions: MAP_CONFIG.resolutions,
        center: MAP_CONFIG.default_center,
        zoom: MAP_CONFIG.default_zoom
    })
});

map.on('pointermove', function(browserEvent) {
    var coordinate = browserEvent.coordinate;
    var pixel = browserEvent.pixel;
    document.body.style.cursor = '';

    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer == MAP_CONFIG.draw_layer && MAP_CONTROLS.current_style == draw_layer_styles.REMOVE) {
            document.body.style.cursor = 'pointer';
        }
    })
})

map.on('moveend', function() {
    if (MAP_HELPERS.get_zoom_level(map) >= MAP_CONFIG.master_map_vector_layer_zoom_threshold) {
        if (!MAP_CONFIG.snap_to_controls.snap_to_available) {
            MAP_CONFIG.snap_to_controls.enable_snap_to_button()
        }
    } else {
        if (MAP_CONFIG.snap_to_controls.snap_to_available) {
            MAP_CONFIG.snap_to_controls.disable_snap_to()
        }
    }
});
