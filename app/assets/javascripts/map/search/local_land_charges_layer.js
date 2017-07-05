var LOCAL_LAND_CHARGES_LAYER = {};

LOCAL_LAND_CHARGES_LAYER.toggle_llc_layer_extents = function (value) {
    SEARCH_PAGE.llc_layer.setVisible(value);
}

// Draw Local Land Charges on Map
LOCAL_LAND_CHARGES_LAYER.draw_local_land_charges = function(local_land_charges) {

    if (!!local_land_charges && local_land_charges.constructor === Array) {
        
        var features = LOCAL_LAND_CHARGES_LAYER.build_features_from_json(local_land_charges)

        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var style = llc_layer_styles.standard_style[feature.getGeometry().getType()];
            feature.setStyle(style);
        }

        SEARCH_PAGE.llc_source.addFeatures(features);
    }

    LOCAL_LAND_CHARGES_LAYER.add_table_entry_for_land_charges();
};

LOCAL_LAND_CHARGES_LAYER.build_features_from_json = function(local_land_charges_json) {
    
    features = []
    
    for (var j = 0; j < local_land_charges_json.length; j++) {
        local_land_charge = local_land_charges_json[j]

        var m_names = new Array("January", "February", "March",
                "April", "May", "June", "July", "August", "September",
                "October", "November", "December");
                
        var end_date = null
        
        if (local_land_charge.cancelled) {
            date = new Date(local_land_charge.item['end-date'])
            end_date = date.getDate() + " " + m_names[date.getMonth()] + " " + date.getFullYear()
        }
        for (var i = 0; i < local_land_charge.geometry.features.length; i++) {
            feature = local_land_charge.geometry.features[i];
            feature['id'] = feature.properties.id;
            feature["properties"] = {   "display_id": local_land_charge.display_id, "type": local_land_charge.type,
                                        "cancelled": local_land_charge.cancelled, "end_date": end_date };
            features.push(feature);
        }
    }

    var geo_json = {
        'type': 'FeatureCollection',
        'crs': {
            'type': 'name',
            'properties': {
                'name': 'EPSG:27700'
            }
        },
        'features': features
    }

    var options = {
        'dataProjection': 'EPSG:27700',
        'featureProjection': 'EPSG:27700'
    }

    return (new ol.format.GeoJSON()).readFeatures(geo_json, options);
};

// Filter Local Land Charges on Map by Drawn Features
LOCAL_LAND_CHARGES_LAYER.filter_local_land_charges = function() {
    var llc_features = [];

    var currentZoom = MAP_HELPERS.get_zoom_level(map)
    if (currentZoom < MAP_CONFIG.draw_layer_zoom_threshold) {
        return
    }

    llc_features = SEARCH_PAGE.fetched_results.filter(
        // Filter Land Charges which intersect with drawn features
        LOCAL_LAND_CHARGES_LAYER.intersects_with_draw_features_filter
    );

    //Remove previous llc_features from the source before repopulating
    SEARCH_PAGE.llc_source.clear();

    for (var i = 0; i < llc_features.length; i++) {
        SEARCH_PAGE.llc_source.addFeature(llc_features[i]);
    }

    LOCAL_LAND_CHARGES_LAYER.add_table_entry_for_land_charges();
}

// Display List of Local Land Charges on Table
LOCAL_LAND_CHARGES_LAYER.add_table_entry_for_land_charges = function() {
    var features = SEARCH_PAGE.llc_features.getArray();
    var done_ids = []
    var charge_count = 0
    for (var i = 0; i < features.length; i++) {
        feature = features[i];
        display_id = feature.getProperties().display_id
        if ($.inArray(display_id, done_ids) == -1) {
            charge_count++;
            done_ids.push(display_id)
        }
    }
    $( "#llc-results" ).html('')
    if (!charge_count) {
        $(".result-count").html("No land charges in viewable area");
    } else if (charge_count == 1){
        $(".result-count").html("There is " + charge_count + " land charge in this area");
    } else {
        $(".result-count").html("There are " + charge_count + " land charges in this area");
    }

    var done_ids = []
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var display_id = feature.getProperties().display_id;
        if ($.inArray(display_id, done_ids) != -1) {
            continue
        }
        var type = feature.getProperties().type;
        var cancelled = feature.getProperties().cancelled;
        var end_date = feature.getProperties().end_date;
        
        var local_land_charge_html =	"<div class='charge-list-item' id='" + display_id + "'>" +
        								"<h3 class='heading-small'>" + type + "</h3>" +
        								"<p class='font-small'><span class='bold-small'>ID:</span> " + display_id;
        									
        if (cancelled) {
        	local_land_charge_html +=	"<br><span class='bold-xsmall'>Cancelled on " + end_date;
        }

        local_land_charge_html += "</p><div class='charge-list-options'>"

        if (CAN_VIEW) {
            local_land_charge_html +=	"<a class='charge-list-option' href='/view-land-charge/" + display_id + "'>View</a>"
        }

        if (!cancelled && CAN_EDIT) {
            local_land_charge_html +=	"<a class='charge-list-option' href='/modify-land-charge/" + display_id + "'>Update</a>"
        }

        local_land_charge_html += "</div></div>";

        $( "#llc-results" ).append(local_land_charge_html);
        done_ids.push(display_id)
    }

    LOCAL_LAND_CHARGES_LAYER.add_hover_listeners();
};

// Filter Functions
LOCAL_LAND_CHARGES_LAYER.intersects_with_draw_features_filter = function(feature) {
    var draw_features = MAP_CONFIG.draw_features.getArray();
    var feature_extent = feature.getGeometry().getExtent();

    if (draw_features.length == 0) {
        return true
    }

    for (var i = 0; i < draw_features.length; i++) {
        var draw_feature_extent = draw_features[i].getGeometry().getExtent();

        if (ol.extent.intersects(draw_feature_extent, feature_extent)) {
            return true;
        }
    }

    return false;
}

LOCAL_LAND_CHARGES_LAYER.add_hover_listeners = function() {
    //Add Hover Bindings for table elements
    $(".charge-list-item").hover(
        function() {
            $(this).css("background-color", "lightyellow");
            // Style map for this disp_id
             LOCAL_LAND_CHARGES_LAYER.set_map_style_by_disp_id(SEARCH_PAGE.llc_features.getArray(),
                    $(this).attr('id'), llc_layer_styles.selected_style);
        },

        function() {
            $(this).removeAttr('style');
            // Style map for this disp_id
            LOCAL_LAND_CHARGES_LAYER.set_map_style_by_disp_id(SEARCH_PAGE.llc_features.getArray(),
                    $(this).attr('id'), llc_layer_styles.standard_style);
        }
    );
}

LOCAL_LAND_CHARGES_LAYER.set_map_style_by_disp_id = function(features, disp_id, style) {
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        if (feature.getProperties().display_id == disp_id) {
            var feature_type = feature.getGeometry().getType();
            feature.setStyle(style[feature_type]);
        }
    }
}