function ShowHideContent () {
  var self = this

  self.escapeElementName = function (str) {
    result = str.replace('[', '\\[').replace(']', '\\]')
    return (result)
  }

  self.showHideRadioToggledContent = function () {
    $(".block-label input[type='radio']").each(function () {
      var $radio = $(this)
      var $radioGroupName = $radio.attr('name')
      var $radioLabel = $radio.parent('label')

      var dataTarget = $radioLabel.attr('data-target')

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (dataTarget) {
        // Set aria-controls
        $radio.attr('aria-controls', dataTarget)

        $radio.on('click', function () {
          // Select radio buttons in the same group
          $radio.closest('form').find('.block-label input[name=' + self.escapeElementName($radioGroupName) + ']').each(function () {
            var $this = $(this)

            var groupDataTarget = $this.parent('label').attr('data-target')
            var $groupDataTarget = $('#' + groupDataTarget)

            // Hide toggled content
            $groupDataTarget.hide()
            // Set aria-expanded and aria-hidden for hidden content
            $this.attr('aria-expanded', 'false')
            $groupDataTarget.attr('aria-hidden', 'true')
          })

          var $dataTarget = $('#' + dataTarget)
          $dataTarget.show()
          // Set aria-expanded and aria-hidden for clicked radio
          $radio.attr('aria-expanded', 'true')
          $dataTarget.attr('aria-hidden', 'false')
        })
      } else {
        // If the data-target attribute is undefined for a radio button,
        // hide visible data-target content for radio buttons in the same group

        $radio.on('click', function () {
          // Select radio buttons in the same group
          $('.block-label input[name=' + self.escapeElementName($radioGroupName) + ']').each(function () {
            var groupDataTarget = $(this).parent('label').attr('data-target')
            var $groupDataTarget = $('#' + groupDataTarget)

            // Hide toggled content
            $groupDataTarget.hide()
            // Set aria-expanded and aria-hidden for hidden content
            $(this).attr('aria-expanded', 'false')
            $groupDataTarget.attr('aria-hidden', 'true')
          })
        })
      }
    })
  }
  self.showHideCheckboxToggledContent = function () {
    $(".block-label input[type='checkbox']").each(function () {
      var $checkbox = $(this)
      var $checkboxLabel = $(this).parent()

      var $dataTarget = $checkboxLabel.attr('data-target')

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {
        // Set aria-controls
        $checkbox.attr('aria-controls', $dataTarget)

        // Set aria-expanded and aria-hidden
        $checkbox.attr('aria-expanded', 'false')
        $('#' + $dataTarget).attr('aria-hidden', 'true')

        // For checkboxes revealing hidden content
        $checkbox.on('click', function () {
          var state = $(this).attr('aria-expanded') === 'false' ? true : false

          // Toggle hidden content
          $('#' + $dataTarget).toggle()

          // Update aria-expanded and aria-hidden attributes
          $(this).attr('aria-expanded', state)
          $('#' + $dataTarget).attr('aria-hidden', !state)
        })
      }
    })
  }
}

$(document).ready(function () {
  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']")
  new GOVUK.SelectionButtons($blockLabels)

  $('.js-hidden').css('display', 'none')

  $('.js-hidden').attr('aria-hidden', 'true').hide()
  // Show and hide toggled content
  // Where .block-label uses the data-target attribute
  var toggleContent = new ShowHideContent()
  toggleContent.showHideRadioToggledContent()
  toggleContent.showHideCheckboxToggledContent()
})

// ####################
// map stuff
// ####################

'use strict'

const ZOOM_LEVEL = 2

var currentProjection = 'EPSG:3857'

var viaEuropaKey = 'demolreg2'

// Extent of the map in units of the projection (these match our base map)
var extent = [0, 0, 700000, 1300000]

// Fixed resolutions to display the map at (pixels per ground unit (meters when
// the projection is British National Grid))
var res = [
// res level scale
  2800.0000, // 0 10000000.0
  1400.0000, // 1 5000000.0
  700.0000, // 2 2500000.0
  280.0000, // 3 1000000.0
  140.0000, // 4 500000.0
  70.0000, // 5 250000.0
  28.0000, // 6 100000.0
  21.0000, // 7 75000.0
  14.0000, // 8 50000.0
  7.0000, // 9 25000.0
  2.8000, // 10 10000.0
  1.4000, // 11 5000.0
  0.7000, // 12 2500.0
  0.3500, // 13 1250.0
  0.1750 // 14 625.0
]

var zmax = 14
res.length = zmax + 1

proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs')

var bng = ol.proj.get('EPSG:27700')
bng.setExtent(extent)

var tileGrid = new ol.tilegrid.TileGrid({
  resolutions: res
})

var masterMapLayer = new ol.layer.Tile({
  name: 'OS Hybrid',
  extent: extent,
  source: new ol.source.TileImage({
    crossOrigin: null,
    extent: extent,
    projection: bng,
    tileGrid: new ol.tilegrid.TileGrid({
      origin: [extent[0], extent[1]],
      resolutions: res
    }),
    tileUrlFunction: function (tileCoord, pixelRatio, projection) {
      if (!tileCoord) {
        return ''
      }

      var x = tileCoord[1]
      var y = tileCoord[2]
      var z = tileCoord[0]

      if (x < 0 || y < 0) {
        return ''
      }

      var url = 'http://atlas1.viaeuropa.uk.com/viaeuropa/' + viaEuropaKey + '/hybrid_bng/' + z + '/' + x + '/' + y + '.png'
      return url
    }
  })
})

var masterMapView = new ol.View({
  resolutions: res,
  center: [446345.8, 179914.45],
  zoom: 3,
  projection: bng
})
// vector layer for controls
var source = new ol.source.Vector({
  wrapX: false
})
var vector = new ol.layer.Vector({
  source: source
})

// initiate map
var baseMaps = [ masterMapLayer, vector ]
var map = new ol.Map({
  target: 'map',
  layers: baseMaps,
  view: masterMapView
})

var typeSelect = document.getElementById('type')

var draw // global so we can remove it later
function addInteraction () {
  var value = typeSelect.value
  if (value !== 'None') {
    draw = new ol.interaction.Draw({
      source: source,
      type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
    })
    map.addInteraction(draw)
  }
}

/**
* Handle change event.
*/
typeSelect.onchange = function () {
  map.removeInteraction(draw)
  addInteraction()
}

addInteraction()

// Postcode search
var searchForm = document.getElementById('search')

searchForm.addEventListener('submit', function (e) {
  e.preventDefault()
  return openLayersPostCodeLookup(document.getElementById('location-search').value)
})

function openLayersPlacesLookup (searchQuery) {
  $.ajax({
    url: 'https://api.postcodes.io/places/' + searchQuery,
    success: function (data) {
      $('#error').slideUp('slow')
      console.log('Long: ' + data.result.longitude + ' Lat: ' + data.result.latitude)
      map.getView().setCenter(ol.proj.transform([ data.result.longitude, data.result.latitude], 'EPSG:4326', currentProjection))
      map.getView().setZoom(5)
    },
    error: function (err) {
      console.log('Postcode Not Found, error was: ' + err.message)
      $('#postcode-error').text('We could not find ' + searchQuery)
      $('#error').slideDown('slow')
    }
  })
}

function goBack () {
  window.history.back()
}
