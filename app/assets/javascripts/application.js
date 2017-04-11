function ShowHideContent() {
  var self = this;

  self.escapeElementName = function(str) {
    result = str.replace('[', '\\[').replace(']', '\\]')
    return(result);
  };

  self.showHideRadioToggledContent = function () {
    $(".block-label input[type='radio']").each(function () {

      var $radio = $(this);
      var $radioGroupName = $radio.attr('name');
      var $radioLabel = $radio.parent('label');

      var dataTarget = $radioLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (dataTarget) {

        // Set aria-controls
        $radio.attr('aria-controls', dataTarget);

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $radio.closest('form').find(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {
            var $this = $(this);

            var groupDataTarget = $this.parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.hide();
            // Set aria-expanded and aria-hidden for hidden content
            $this.attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

          var $dataTarget = $('#' + dataTarget);
          $dataTarget.show();
          // Set aria-expanded and aria-hidden for clicked radio
          $radio.attr('aria-expanded', 'true');
          $dataTarget.attr('aria-hidden', 'false');

        });

      } else {
        // If the data-target attribute is undefined for a radio button,
        // hide visible data-target content for radio buttons in the same group

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {

            var groupDataTarget = $(this).parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.hide();
            // Set aria-expanded and aria-hidden for hidden content
            $(this).attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

        });
      }

    });
  }
  self.showHideCheckboxToggledContent = function () {

    $(".block-label input[type='checkbox']").each(function() {

      var $checkbox = $(this);
      var $checkboxLabel = $(this).parent();

      var $dataTarget = $checkboxLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

        // Set aria-controls
        $checkbox.attr('aria-controls', $dataTarget);

        // Set aria-expanded and aria-hidden
        $checkbox.attr('aria-expanded', 'false');
        $('#'+$dataTarget).attr('aria-hidden', 'true');

        // For checkboxes revealing hidden content
        $checkbox.on('click', function() {

          var state = $(this).attr('aria-expanded') === 'false' ? true : false;

          // Toggle hidden content
          $('#'+$dataTarget).toggle();

          // Update aria-expanded and aria-hidden attributes
          $(this).attr('aria-expanded', state);
          $('#'+$dataTarget).attr('aria-hidden', !state);

        });
      }

    });
  }
}

$(document).ready(function() {

  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
  new GOVUK.SelectionButtons($blockLabels);

  // Show and hide toggled content
  // Where .block-label uses the data-target attribute
  var toggleContent = new ShowHideContent();
  toggleContent.showHideRadioToggledContent();
  toggleContent.showHideCheckboxToggledContent();

});

var locationSelected = sessionStorage.getItem("location")

// map stuff
  var geoserver = 'http://192.168.250.122:8080/geoserver'
  var longitude = -0.09;
  var latitude = 51.505;
  var map;
  var featureID;
  var vectorSource, featureOverlay;


  window.onload = function() {
    document.getElementById('geometry').setAttribute('style', 'display: none');
    document.getElementById('map-nav').setAttribute('style', 'display: block');
    if (typeof search !== 'undefined') {
      document.getElementById('mergeLabel').setAttribute('style', 'display: none');
    }
    initmap();
  }

// Initialise OpenLayers map
function initmap() {
  proj4.defs("EPSG:27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");

  var osm_default = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: geoserver + '/osm2/wms',
      params: {'FORMAT': 'image/png',
      'VERSION': '1.1.1',
      tiled: true,
      LAYERS: 'osm2:osm2',
    }
  })
  });

  var mastermap = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: geoserver + '/mastermap/wms',
      params: {'FORMAT': 'image/png',
      'VERSION': '1.1.1',
      tiled: true,
      LAYERS: 'mastermap:mastermap',
    }
  })
  });

  var wfs_features = new ol.Collection();
  wfsSource = new ol.source.Vector({features: wfs_features});

  var wfs = new ol.layer.Vector({
    source: wfsSource,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(6, 88, 229, 0)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(6, 88, 229, 0)',
        width: 3
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: 'rgba(6, 88, 229, 0)'
        })
      })
    })
  });

  mapProjection = 'EPSG:27700';
  coordinateProjection = 'EPSG:27700';

  var center = ol.proj.transform([293000.00, 92572.00], coordinateProjection, mapProjection);

  var olView = new ol.View({
    center: center,
    zoom: 13,
    minZoom: 8,
    maxZoom: 24,
    projection: mapProjection
  });

    // Draw/Modify features
    var features = new ol.Collection();
    vectorSource = new ol.source.Vector({features: features});
    featureOverlay = new ol.layer.Vector({
      source: vectorSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(6, 88, 229, 0.15)'
        }),
        stroke: new ol.style.Stroke({
          color: '#0658e5',
          width: 3
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#0658e5'
          })
        })
      })
    });

    var interactions = ol.interaction.defaults({doubleClickZoom: false});
    map = new ol.Map({
      layers: [wfs, osm_default, mastermap, featureOverlay],
      interactions: interactions,
      logo: false,
      controls: ol.control.defaults().extend([
        new ol.control.ZoomSlider(),
        new ol.control.Control({element: document.getElementById('openlayersForm')}),
        new ol.control.Control({element: document.getElementById('snap-to')}),
        new ol.control.Control({element: document.getElementById('nav-buttons')}),
        new ol.control.Control({element: document.getElementById('ol-tool-tip')})
        ]),
      target: 'map',
      view: olView
    });
    if (document.getElementById('geometry')) {
      applyGeoJSON();
    }

    var draw; // global so we can remove it later
    var select; // global so we can remove it later
    var selectedFeatureID;
    featureID = 0;
    var typeSelect = $('input[name="type"]:checked').val();
    var modify;

    var snap = new ol.interaction.Snap({
      source: wfs.getSource(),
      edge: true,
      vertex: true,
      pixelTolerance: 7.5
    });
    map.addInteraction(snap);

    function addInteraction() {
      typeSelect = $('input[name="type"]:checked').val();
      if (typeSelect == 'Remove') {
        select = new ol.interaction.Select({layers: [featureOverlay]});
        map.addInteraction(select);

        select.getFeatures().on('add', function (event) {
          selectedFeatureID = event.element.getId();
          removeFeature();
        });
      } else if (typeSelect == 'Copy') {
        select = new ol.interaction.Select({layers: [wfs], style: normal_style});
        map.addInteraction(select);

        select.on('select', function(e) {
                // Set current featureID to be the highest existing ID
                if (featureID == 0) {
                  featureID = getHighestId(vectorSource.getFeatures());
                }
                if (e.selected[0]) {
                  feature = e.selected[0];
                  if (typeof search !== 'undefined') {
                    vectorSource.clear();
                    featureID = 0;
                  }
                  featureID = featureID + 1;
                  feature.setId(featureID);
                  vectorSource.addFeature(feature);
                }
              });
      } else if (typeSelect == 'Edit') {
        modify = new ol.interaction.Modify({
          features: features,
                // the SHIFT key must be pressed to delete vertices, so
                // that new vertices can be drawn at the same position
                // of existing vertices
                deleteCondition: function(event) {
                  return ol.events.condition.shiftKeyOnly(event) &&
                  ol.events.condition.singleClick(event);
                }
              });

        map.addInteraction(modify);
        map.addInteraction(snap);
      } else if (typeSelect == 'Donut') {
        draw = new ol.interaction.Draw({
          type: 'Polygon'
        });

        draw.on('drawend', function (event) {
          var geometry = event.feature.getGeometry();
          var format = new ol.format.GeoJSON({defaultDataProjection: 'EPSG:27700'});

          for (var i = vectorSource.getFeatures().length - 1; i >= 0; i--) {
            var feature = vectorSource.getFeatures()[i].clone();
            feature.setId(vectorSource.getFeatures()[i].getId());
            var current_geom = feature.getGeometry();
            if (current_geom.getType() == 'Polygon' || current_geom.getType() == 'MultiPolygon') {
              vectorSource.removeFeature(vectorSource.getFeatures()[i]);
              var turfGeom = format.writeFeatureObject(event.feature);
              var turfCurrGeom = format.writeFeatureObject(feature);
              var newGeom = turf.difference(turfCurrGeom, turfGeom);
              if (newGeom != null) {
                feature.setGeometry(format.readFeature(newGeom).getGeometry());
                vectorSource.addFeature(feature);
              }
            }
          }
          if (typeof search == 'undefined') {
            splitMultiPolygons();
          }
        });

        map.addInteraction(draw);
        map.addInteraction(snap);
      } else {
        draw = new ol.interaction.Draw({
          features: features,
          type: /** @type {ol.geom.GeometryType} */ (typeSelect)
        });

            // Set current featureID to be the highest existing ID
            if (featureID == 0) {
              featureID = getHighestId(vectorSource.getFeatures());
            }

            if (typeof search !== 'undefined') {
              draw.on('drawend', function (event) {
                vectorSource.clear();
              })
            }

            if (typeSelect == 'Circle') {
              draw.on('drawend', function (event) {
                var geometry = event.feature.getGeometry();
                var poly = ol.geom.Polygon.fromCircle(geometry);
                var feature = new ol.Feature({
                  geometry: poly
                })
                featureID = featureID + 1;
                feature.setId(featureID);
                vectorSource.addFeature(feature);
              })
            } else {
              draw.on('drawend', function (event) {
                featureID = featureID + 1;
                event.feature.setId(featureID)
              })
            }
            map.addInteraction(draw);
            if (typeSelect != 'Circle') {
              map.addInteraction(snap);
            }
          }
        }

        features.on('add', function(event) {
          var feature = event.element;
          if (feature.getGeometry().getType() == 'Circle') {
            vectorSource.removeFeature(feature);
          }
        });

        function removeFeature() {
          var features = vectorSource.getFeatures();
          if (features != null && features.length > 0) {
            for (x in features) {
              var id = features[x].getId();
              if (id == selectedFeatureID) {
                map.removeInteraction(select);
                map.removeInteraction(draw);
                vectorSource.removeFeature(features[x]);
                featureOverlay.getSource();
                addInteraction();
                break;
              }
            }
          }
        }

    /**
     * Handle change event.
     */
     $('input[name="type"]').change(function() {
      typeSelect = $('input[name="type"]:checked').val();
      prevLabel = $('.active').not(document.getElementById('snap-to-label')).get(-1).id;
      $('input[name="' + this.name + '"]').prop("checked", false);
      $('label').not(document.getElementById('snap-to-label')).removeClass("active");
      if (typeSelect == 'Clear') {
        featureID = 0;
        vectorSource.clear();
        $('input[id="' + prevLabel.replace("Label", "") + '"]').prop("checked", true);
        $('label[id="' + prevLabel + '"]').addClass("active");
        snapToToggle = $('input[id="snap"]:checked').val();
        copySelected = $('input[id="copy"]:checked').val();
        populateWFSLayer(copySelected ? 'Copy' : '', snapToToggle);
      } else if (typeSelect == 'Merge') {
        mergePolygons();
        $('input[id="' + prevLabel.replace("Label", "") + '"]').prop("checked", true);
        $('label[id="' + prevLabel + '"]').addClass("active");
      } else {
        $(this).prop("checked", true);
        $('label[id="' + this.id + 'Label"]').addClass("active");

        snapToToggle = $('input[id="snap"]:checked').val();
        populateWFSLayer(typeSelect, snapToToggle);
      }


      map.removeInteraction(draw);
      map.removeInteraction(select);
      map.removeInteraction(modify);
      addInteraction();
      if (typeSelect == 'Edit') {
        editMode();
      } else {
        normalMode();
      }

        // Set 'help' text for each button
        if (typeSelect == 'Copy') {
          document.getElementById('ol-tool-tip').innerHTML = 'Click to draw geometry around an item.';
        } else if (typeSelect == 'Point') {
          document.getElementById('ol-tool-tip').innerHTML = 'Click to draw a point.';
        } else if (typeSelect == 'LineString') {
          document.getElementById('ol-tool-tip').innerHTML = 'Click to draw a line. Double-click to finish.';
        } else if (typeSelect == 'Polygon') {
          document.getElementById('ol-tool-tip').innerHTML = 'Click to draw each corner of a polygon. Double-click to finish.';
        } else if (typeSelect == 'Circle') {
          document.getElementById('ol-tool-tip').innerHTML = 'Click to position centre and drag to draw circle. Click to finish.';
        } else if (typeSelect == 'Donut') {
          document.getElementById('ol-tool-tip').innerHTML = 'Click to draw each corner of a polygon to be removed. Double-click to finish.';
        } else if (typeSelect == 'Edit') {
          document.getElementById('ol-tool-tip').innerHTML = 'Click and hold, then drag to edit';
        } else if (typeSelect == 'Remove') {
          document.getElementById('ol-tool-tip').innerHTML = 'Click item to remove.';
        }
      });

     addInteraction();

     map.on('moveend', function(evt){
      typeSelect = $('input[name="type"]:checked').val();
      snapToToggle = $('input[id="snap"]:checked').val();
      populateWFSLayer(typeSelect, snapToToggle);

      if (map.getView().getZoom() > 17) {
        document.getElementById('copy').disabled = false;
        document.getElementById('copyLabel').className = document.getElementById('copyLabel').className.replace(' disabled-btn', '');
        document.getElementById('snap').disabled = false;
        document.getElementById('snap-to-label').className = document.getElementById('snap-to-label').className.replace(' disabled-btn', '');
        setTitleAttribute('snapIcon', document.getElementById('snapIcon').getAttribute('title').replace(' as zoom level is too low', ''));
        setTitleAttribute('snapButton', document.getElementById('snapButton').getAttribute('title').replace(' as zoom level is too low', ''));
        setTitleAttribute('copyLabel', 'Copy from map');
        setTitleAttribute('copyIcon', 'Copy from map');
      } else {
        document.getElementById('copy').disabled = true;
        document.getElementById('copyLabel').className = 'btn btn-primary btn-sm disabled-btn';
        document.getElementById('snap').disabled = true;
        document.getElementById('snap-to-label').className = 'btn btn-primary btn-sm disabled-btn';
        if ($('input[id="copy"]:checked').val()) {
          $('input[name="type"]').prop("checked", false);
          $('label').not(document.getElementById('snap-to-label')).removeClass("active");
          $('input[id="point"]').prop("checked", true);
          $('label[id="pointLabel"]').addClass("active");
          map.removeInteraction(select);
          map.removeInteraction(draw);
          addInteraction();
        }
        $('input[id="snap"]').prop("checked", false);
        $('label[id="snap-to-label"]').removeClass("active");
        document.getElementById('snapIcon').className = 'glyphicon glyphicon-remove-circle icon-size';
        setTitleAttribute('snapIcon', 'Snap-to is off as zoom level is too low');
        setTitleAttribute('snapButton', 'Snap-to is off as zoom level is too low');
        setTitleAttribute('copyLabel', 'Copy-from is unavailable as zoom level is too low');
        setTitleAttribute('copyIcon', 'Copy-from is unavailable as zoom level is too low');
      }
    });

     document.getElementById('snap').onchange = function() {
      typeSelect = $('input[name="type"]:checked').val();
      snapToToggle = $('input[id="snap"]:checked').val();
      if (snapToToggle) {
        $('input[id="snap"]').prop("checked", true);
        $('label[id="snap-to-label"]').addClass("active");
        document.getElementById('snapIcon').className = 'glyphicon glyphicon-ok-circle icon-size';
        setTitleAttribute('snapIcon', 'Snap-to is on');
        setTitleAttribute('snapButton', 'Snap-to is on');
      } else {
        $('input[id="snap"]').prop("checked", false);
        $('label[id="snap-to-label"]').removeClass("active");
        document.getElementById('snapIcon').className = 'glyphicon glyphicon-remove-circle icon-size';
        setTitleAttribute('snapIcon', 'Snap-to is off');
        setTitleAttribute('snapButton', 'Snap-to is off');
      }

      populateWFSLayer(typeSelect, snapToToggle);
    };
  }

  function setTitleAttribute(elementId, value) {
    document.getElementById(elementId).setAttribute('alt', value);
    document.getElementById(elementId).setAttribute('title', value);
  }

  function populateWFSLayer(typeSelect, snapToToggle) {
    wfsSource.clear();
    if (map.getView().getZoom() > 17 && (typeSelect == 'Copy' || snapToToggle == 'on')) {
      var url = geoserver + '/mastermap/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=mastermap:topographicarea_style&outputFormat=text/javascript&format_options=callback:loadFeatures&srsname=EPSG:27700&bbox=';
      extent = map.getView().calculateExtent(map.getSize());
      $.ajax({url: url + extent, dataType: 'jsonp', jsonp: false});
    }
  }

/**
 * JSONP WFS callback function.
 * @param {Object} response The response object.
 */
 window.loadFeatures = function(data) {
  wfsSource.addFeatures((new ol.format.GeoJSON()).readFeatures(data))
};

normal_style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(6, 88, 229, 0.15)'
  }),
  stroke: new ol.style.Stroke({
    color: '#0658e5',
    width: 3
  }),
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
      color: '#0658e5'
    })
  })
});

edit_style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 0, 191, 0.15)'
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(255, 0, 191, 1)',
    width: 3
  }),
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 191, 1)'
    })
  })
});

function editMode() {
  var number = vectorSource.getFeatures().length;
  for (var i = 0; i < number; i++) {
    vectorSource.getFeatures()[i].setStyle(edit_style);
  }
}

function normalMode() {
  var number = vectorSource.getFeatures().length;
  for (var i = 0; i < number; i++) {
    vectorSource.getFeatures()[i].setStyle(normal_style);
  }
}

function extractGeometry() {
  mergePolygons();
  features = new ol.Collection(vectorSource.getFeatures());
  mapOutput(features);
}

function mapOutput(features) {
  if (features && features.getLength() > 0) {
    var options = {dataProjection: coordinateProjection, featureProjection: mapProjection};
        // Create GeometryCollection from features
        shapeString = ""
        shapeArray = new Array();
        for (i = 0; i < features.getArray().length; i++){
          shapeString = new ol.format.GeoJSON().writeGeometry(features.getArray()[i].getGeometry(), options);
          shapeArray.push(shapeString)
        }
        shapeString = shapeArray.join(',');
        crs = "{\"type\": \"name\",\"properties\": {\"name\": \"" + coordinateProjection + "\"}}"
        if (typeof search !== 'undefined') {
          geom = features.getArray()[0].getGeometry();
            // get 'type', 'coordinates' and 'crs' separately and construct GeoJSON string?
            shapeString = new ol.format.GeoJSON().writeGeometry(geom, options);
            shapeString = shapeString.replace("}", ",\"crs\": " + crs + "}");
          } else {
            shapeString = "{ \"type\": \"GeometryCollection\",\"geometries\": [" + shapeString + "],\"crs\": " + crs + "}"
          }
          document.getElementById('geometry').value = shapeString;
        } else {
          document.getElementById('geometry').value = '';
        }
      }

      function getHighestId(features) {
        var highId = 0;
        for (var i = 0; i < features.length; i++) {
          if (features[i].getId() > highId) {
            highId = features[i].getId();
          }
        }
        return highId;
      }


// Buttons to scroll the map
var baseMoveAmount = 19;
document.getElementById('move-up').onclick = function() {
  var center = map.getView().getCenter();
  moveAmount = Math.pow(2, (20 - map.getView().getZoom())) * baseMoveAmount;
  panTo(center[0], center[1] + moveAmount)
};

document.getElementById('move-down').onclick = function() {
  var center = map.getView().getCenter();
  moveAmount = Math.pow(2, (20 - map.getView().getZoom())) * baseMoveAmount;
  panTo(center[0], center[1] - moveAmount);
};

document.getElementById('move-left').onclick = function() {
  var center = map.getView().getCenter();
  moveAmount = Math.pow(2, (20 - map.getView().getZoom())) * baseMoveAmount;
  panTo(center[0] - moveAmount, center[1]);
};

document.getElementById('move-right').onclick = function() {
  var center = map.getView().getCenter();
  moveAmount = Math.pow(2, (20 - map.getView().getZoom())) * baseMoveAmount;
  panTo(center[0] + moveAmount, center[1]);
};

function panTo(x, y){
    // pan from the current center
    var pan = ol.animation.pan({
      source: map.getView().getCenter(),
      duration: 250
    });
    map.beforeRender(pan);
    // when we set the new location, the map will pan smoothly to it
    map.getView().setCenter([x, y]);
  };

function applyGeoJSON() {
  if (document.getElementById('geometry').value) {
    geojsonFeature = document.getElementById('geometry').value;

    var geomProjection = (new ol.format.GeoJSON()).readProjection(geojsonFeature).getCode();

    var options = {dataProjection: geomProjection, featureProjection: mapProjection};
    var geometry = (new ol.format.GeoJSON()).readGeometry(geojsonFeature, options)
    olFeatures = new Array();
    if (geometry instanceof ol.geom.GeometryCollection) {
      geometries = geometry.getGeometries();
      for (var j = 0; j < geometries.length; j++) {
        olFeature = new ol.Feature(geometries[j]);
        olFeatures.push(olFeature);
      }
    } else {
      var olFeature = new ol.Feature(geometry);
      olFeatures = [olFeature];
    }

    vectorSource.clear();
    generateUnsetFeatureIds(olFeatures);
    vectorSource.addFeatures(olFeatures);
    var olExtent = vectorSource.getExtent();
    map.getView().fit(olExtent, map.getSize());
    if (map.getView().getZoom() > 21) {
      map.getView().setZoom(21);
    }
  }
};

function generateUnsetFeatureIds(features) {
  currentId = getHighestId(features);
  for (var i = 0; i < features.length; i++) {
    if (features[i].getId() == null || features[i].getId() == 0) {
      currentId += 1;
      features[i].setId(currentId)
    }
  }
};

function lookupPostcode() {

  document.getElementById('postcode-error').setAttribute('style', 'display: none');
  document.getElementById('postcode-error').innerHTML = '';
  var xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
      // code for older browsers
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        jsonString = xmlhttp.responseText;
        json = JSON.parse(jsonString);
        if (json.result.country == "England") {
          var latitude = json.result.latitude;
          var longitude = json.result.longitude;
          map.getView().setCenter(ol.proj.transform([longitude, latitude], 'EPSG:4326', mapProjection));
          map.getView().setZoom(17);
        } else {
          document.getElementById('postcode-error').setAttribute('style', 'display: block');
          setTimeout(function(){
            document.getElementById('postcode-error').innerHTML = "Postcode not in England";
          }, 1000);
        }
      } else if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
        document.getElementById('postcode-error').innerHTML = '';
        document.getElementById('postcode-error').setAttribute('style', 'display: none');
      } else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
        document.getElementById('postcode-error').setAttribute('style', 'display: block');
        jsonString = xmlhttp.responseText;
        json = JSON.parse(jsonString);
        setTimeout(function(){
          document.getElementById('postcode-error').innerHTML = json.error;
        }, 1000);
      }
    };
    xmlhttp.open("GET", "http://api.postcodes.io/postcodes/" + document.getElementById('postcode').value, true);
    xmlhttp.send();
  };

  function mergePolygons() {
    var format = new ol.format.GeoJSON({defaultDataProjection: 'EPSG:27700'});
    for (var i = vectorSource.getFeatures().length - 1; i >= 0; i--) {
      for (var j = i - 1; j >= 0; j--) {
        var feature1 = vectorSource.getFeatures()[i];
        var geom1 = feature1.getGeometry();
        var feature2 = vectorSource.getFeatures()[j];
        var geom2 = feature2.getGeometry();
        if ((geom1.getType() == 'Polygon' || geom1.getType() == 'MultiPolygon') &&
          (geom2.getType() == 'Polygon' || geom2.getType() == 'MultiPolygon')) {
          var turfGeom1 = format.writeFeatureObject(feature1);
        var turfGeom2 = format.writeFeatureObject(feature2);
        if (turf.intersect(turfGeom1, turfGeom2) != null) {
          vectorSource.removeFeature(feature2);
          var newGeom = turf.union(turfGeom1, turfGeom2);
          feature1.setGeometry(format.readFeature(newGeom).getGeometry());
          break;
        }
      }
    }
  }
  if (typeof search == 'undefined') {
    splitMultiPolygons();
  }
}

function splitMultiPolygons() {
  featureID = getHighestId(vectorSource.getFeatures());
  for (var i = vectorSource.getFeatures().length - 1; i >= 0; i--) {
    var feature = vectorSource.getFeatures()[i];
    var current_geom = feature.getGeometry();
    if (current_geom.getType() == 'MultiPolygon') {
      vectorSource.removeFeature(vectorSource.getFeatures()[i]);
      var coords = current_geom.getCoordinates();
      for (var j = 0; j < coords.length; j++) {
        var newFeature = new ol.Feature({geometry: new ol.geom.Polygon(coords[j])});
        featureID = featureID + 1;
        newFeature.setId(featureID);
        vectorSource.addFeature(newFeature);
      }
    }
  }
}