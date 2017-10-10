var SEARCH_PAGE = {}
var CAN_VIEW = null
var CAN_EDIT = null
var $SCRIPT_ROOT

$(function() {
    // Add New Layer to Open Layers
    // for LLC
    map.addLayer(SEARCH_PAGE.llc_layer);

    // Search Click Event
    /*$('#search').on('click', function() {
        $.getJSON($SCRIPT_ROOT + '/_search/addresses', {
            search_term: $('#search_term').val(),
        }, function(response) {
            $("#search-error").html("")
            if (response.status == "success") {
                if ($("#error-summary")) {
                    $("#error-summary").remove();
                    $("#error-message-search").remove();
                    $("#search-fieldset").removeClass("form-group-error");
                }
                var extent = new ol.extent.boundingExtent(response.coordinates)

                map.getView().fit(extent, { duration: 1000, maxZoom: 14 });

            } else {
                if ($("#error-summary")) {
                    $("#error-summary").remove();
                    $("#error-message-search").remove();
                    $("#search-fieldset").removeClass("form-group-error");
                }
                var errorMsg = '<div id="error-summary" class="error-summary" role="group" ' +
                    'aria-labelledby="error-summary-heading-example-1" tabindex="-1">' +
                    '<h1 class="heading-medium error-summary-heading" id="error-summary-heading-example-1">' +
                    'There are errors on this page</h1>' +
                    '<ul id="error-summary-list" class="error-summary-list">' +
                    '<li><a href="#search_term">' + response.search_message + '</a></li>' +
                    '</ul></div>';

                var inlineMsg = '<span class="error-message" id="error-message-search">' + response.search_message + '</span>';
                $("#search-error").html(errorMsg);
                $("#search_term").before(inlineMsg);
                $("#search-fieldset").addClass("form-group-error");
            }
        });
    });*/

    // Search Enter Event
    /*$("#search_term").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#search").click();
        }
    });*/
});

// Open Layers Local Land Charge Display Layer
SEARCH_PAGE.llc_features = new ol.Collection();
SEARCH_PAGE.llc_source = new ol.source.Vector({ features: SEARCH_PAGE.llc_features });
SEARCH_PAGE.llc_layer = new ol.layer.Vector({ source: SEARCH_PAGE.llc_source });

// The last highlighted feature
SEARCH_PAGE.current_selected_feature = null;
SEARCH_PAGE.current_row = 0;
SEARCH_PAGE.fetched_results = [];

SEARCH_PAGE.init = function(can_view, can_edit) {
    CAN_VIEW = can_view
    CAN_EDIT = can_edit
}

SEARCH_PAGE.get_llc_in_bbox = function() {
    var extent = map.getView().calculateExtent(map.getSize());
    var boundingBoxBNG = SEARCH_PAGE.get_bounding_box_from_map(extent);

    $.getJSON($SCRIPT_ROOT + '/_search/local_land_charges', {
        boundingBox: JSON.stringify(boundingBoxBNG)
    }, function(local_land_charges) {
        SEARCH_PAGE.llc_source.clear();

        LOCAL_LAND_CHARGES_LAYER.draw_local_land_charges(local_land_charges);
        SEARCH_PAGE.fetched_results = SEARCH_PAGE.llc_features.getArray().slice(0);
        LOCAL_LAND_CHARGES_LAYER.filter_local_land_charges();
    });

    SEARCH_PAGE.llc_source.clear();
    LOCAL_LAND_CHARGES_LAYER.draw_local_land_charges(example_local_land_charges);
    SEARCH_PAGE.fetched_results = SEARCH_PAGE.llc_features.getArray().slice(0);

}

SEARCH_PAGE.get_bounding_box_from_map = function(extent) {
    var bounding_box = ol.geom.Polygon.fromExtent(extent).getCoordinates();

    return [bounding_box[0]];
};

// Reusable Function to convert array of coordinate pairs ( e.g. [[1,2], [3,4]] ) from one EPSG format to another
SEARCH_PAGE.convert_coordinates_array = function(coordinates_array, from, to) {
    var converted_coordinates = [];
    for (var i = 0; i < coordinates_array.length; i++) {
        var current_coordinates = ol.proj.transform(coordinates_array[i], from, to);
        converted_coordinates[i] = current_coordinates;
    }
    return converted_coordinates;
}