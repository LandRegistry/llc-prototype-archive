$(function() {
    // Feature Edited Event
    $("#edit-button").on('edit:toggled', function() {
        MAP_CONTROLS.current_interaction.on('modifyend', function(e) {
            LOCAL_LAND_CHARGES_LAYER.filter_local_land_charges();
        });
    });

    // Map LLC Feature Hover Event
    map.on('pointermove', function(browserEvent) {
        var coordinate = browserEvent.coordinate;
        var pixel = browserEvent.pixel;

        var hit = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            // If we hover over a LLC layer feature and there is currently no active interaction
            if (layer == SEARCH_PAGE.llc_layer && MAP_CONTROLS.current_style == draw_layer_styles.NONE) {
                document.body.style.cursor = 'pointer';

                var feature_disp_id = feature.getProperties().display_id;

                // Reset styles for previously selected feature
                if (SEARCH_PAGE.current_selected_feature != null) {
                    var disp_id = SEARCH_PAGE.current_selected_feature.getProperties().display_id;
                    LOCAL_LAND_CHARGES_LAYER.set_map_style_by_disp_id(SEARCH_PAGE.llc_features.getArray(),
                            disp_id, llc_layer_styles.standard_style);
                    $("#" + disp_id).removeAttr('style');
                }

                SEARCH_PAGE.current_selected_feature = feature;
                LOCAL_LAND_CHARGES_LAYER.set_map_style_by_disp_id(SEARCH_PAGE.llc_features.getArray(),
                        feature_disp_id, llc_layer_styles.selected_style);
               
                if (SEARCH_PAGE.current_row != feature_disp_id) {
                    var container = $("#llc-results");
                    SEARCH_PAGE.current_row = feature_disp_id;

                    container.scrollTop(0);
                    container.animate({
                       scrollTop: $("#" + feature_disp_id).offset().top - container.offset().top
                    });
                }

                $("#" + feature_disp_id).css("background-color", "lightyellow");
            }

            return true
        })

        if(!hit) {
            if (SEARCH_PAGE.current_selected_feature != null) {
                var feature = SEARCH_PAGE.current_selected_feature
                var feature_disp_id = feature.getProperties().display_id;
                LOCAL_LAND_CHARGES_LAYER.set_map_style_by_disp_id(SEARCH_PAGE.llc_features.getArray(),
                        feature_disp_id, llc_layer_styles.standard_style);
                $("#" + feature_disp_id).removeAttr('style');
                SEARCH_PAGE.current_selected_feature = null
            }
        }
    })

    // Map Pan End Listener
    map.on('moveend', function() {
        var currentZoom = MAP_HELPERS.get_zoom_level(map)

        if (currentZoom >= MAP_CONFIG.draw_layer_zoom_threshold) {
            SEARCH_PAGE.get_llc_in_bbox();
        } else {
            SEARCH_PAGE.llc_source.clear();
            $("#llc-results").html('');
            $(".result-count").html("No land charges in viewable area");
        }
    });

    // Map Draw Feature Added
    MAP_CONFIG.draw_features.on('add', function (event) {
       LOCAL_LAND_CHARGES_LAYER.filter_local_land_charges();
    })

    // Map Draw Feature Removed
    MAP_CONFIG.draw_features.on('remove', function (event) {
        LOCAL_LAND_CHARGES_LAYER.filter_local_land_charges();
    })
});