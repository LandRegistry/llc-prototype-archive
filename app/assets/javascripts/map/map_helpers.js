var MAP_HELPERS = {};

// This function will return the current zoom level.
// If the zoom level is undefined it will return the max zoom level.
// The map.getView().getZoom() function returns undefined when loading the search page with a search term saved in session (eg. when refreshing the page after searching).
// This function resolves the issue where no extents are drawn on the map when the page is initially loaded and zooms into the extent area.
// This is due to a rounding error when the zoom level is calculated to be outside of the resolution constraints
(function (MAP_HELPERS) {
  MAP_HELPERS.get_zoom_level = function (map) {
    var current_zoom_level = map.getView().getZoom()
    if (current_zoom_level || current_zoom_level === 0) {
      return Math.round(current_zoom_level)
    } else {
      return MAP_CONFIG.max_zoom_level
    }
  }
})(MAP_HELPERS);

(function (MAP_HELPERS) {
  MAP_HELPERS.zoom_map = function (geometry) {
    geojson_string = JSON.parse(geometry.replace(/&quot;/g, '"'))
    geojson = new ol.format.GeoJSON()
    feature = geojson.readFeature(geojson_string)
    extent = feature.getGeometry().getExtent()
    map.getView().fit(extent, {constrainResolution: false, duration: 500, easing: ol.easing.linear, maxZoom: 14})
  }
})(MAP_HELPERS)
