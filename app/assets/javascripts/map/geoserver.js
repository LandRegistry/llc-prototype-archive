function configure_geoserver_layer_for_user(is_lr, organisation, geoserver_url) {
    var user_authority = GEOSERVER_CONFIG.la_dictionary[organisation];

    params = {
    'LAYERS': 'llc:boundaries',
    'VERSION': '1.1.1',
    'FORMAT': 'image/png',
    'TILED': true
    }

    if(is_lr) {
        params['STYLES'] = 'lr_user_style';
    } else {
        params['STYLES'] = 'la_user_style';
        params['ENV'] = 'la_name:' + user_authority;
    }
    GEOSERVER_CONFIG.boundaries_layer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            /*url: geoserver_url + '/geoserver/llc/wms?',*/
            params: params
        }),
        zIndex: MAP_CONFIG.boundary_layer_zindex
    });
}