var MAP_CONTROLS = {}

MAP_CONTROLS.current_interaction = null
MAP_CONTROLS.current_style = draw_layer_styles.NONE
// Used to generate IDs for newly created features
MAP_CONTROLS.feature_id = 0

// Toolbar Of Available Map Controls
MAP_CONTROLS.draw_controls = function () {
  var container = document.createElement('div')
  container.id = 'draw-controls'
  container.className = 'ol-control'
  container.appendChild(MAP_CONTROLS.polygon_button())
  container.appendChild(MAP_CONTROLS.point_button())
  container.appendChild(MAP_CONTROLS.line_button())
  //container.appendChild(MAP_CONTROLS.circle_button())
  container.appendChild(MAP_CONTROLS.edit_button())
  container.appendChild(MAP_CONTROLS.copy_button())
  container.appendChild(MAP_CONTROLS.remove_button())
  container.appendChild(MAP_CONTROLS.remove_all_button())
  container.appendChild(MAP_CONTROLS.undo_button())

  ol.control.Control.call(this, {
    element: container
  })
}

// Draw Circle Button
MAP_CONTROLS.circle_button = function () {
  var button = document.createElement('button')
  button.setAttribute('class', 'map-button circle')

  var handlePoint = function () {
    MAP_CONTROLS.add_draw_interaction('Circle', button)
  }

  button.addEventListener('click', handlePoint, false)
  return button
}

// Draw Circle Button
MAP_CONTROLS.undo_button = function () {
  var button = document.createElement('button')
  button.setAttribute('class', 'map-button undo')

  var handlePoint = function () {
    MAP_CONTROLS.current_interaction.removeLastPoint()
  }
  button.addEventListener('click', handlePoint, false)
  return button
}

// Draw Point Button
MAP_CONTROLS.point_button = function () {
  var button = document.createElement('button')
  button.setAttribute('class', 'map-button point')

  var handlePoint = function () {
    MAP_CONTROLS.add_draw_interaction('Point', button)
  }

  button.addEventListener('click', handlePoint, false)
  return button
}

// Draw Line Button
MAP_CONTROLS.line_button = function () {
  var button = document.createElement('button')
  button.setAttribute('class', 'map-button line')
  var handleLine = function () {
    MAP_CONTROLS.add_draw_interaction('LineString', button)
  }

  button.addEventListener('click', handleLine, false)
  return button
}

    // Draw Polygon Button
MAP_CONTROLS.polygon_button = function () {
  var button = document.createElement('button')
  button.setAttribute('class', 'map-button polygon')
  var handlePolygon = function () {
    MAP_CONTROLS.add_draw_interaction('Polygon', button)
  }

  button.addEventListener('click', handlePolygon, false)
  return button
}

    // Draw Polygon Button
MAP_CONTROLS.copy_button = function () {
  var button = document.createElement('button')
  button.setAttribute('class', 'map-button copy')
//   var handlePolygon = function () {
//     MAP_CONTROLS.add_draw_interaction('Polygon', button)
//   }

//   button.addEventListener('click', handlePolygon, false)
  return button
}

// Edit Features Button
MAP_CONTROLS.edit_button = function () {
  var button = document.createElement('button')
  button.setAttribute('class', 'map-button edit')
  var handleEdit = function () {
    map.removeInteraction(MAP_CONTROLS.current_interaction)
    var toggled_on = MAP_CONTROLS.toggle_button(button)

    if (toggled_on) {
      MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.EDIT)

      MAP_CONTROLS.current_interaction = new ol.interaction.Modify({
        features: MAP_CONFIG.draw_features,
        style: draw_layer_styles.style[draw_layer_styles.EDIT]
      })

      map.addInteraction(MAP_CONTROLS.current_interaction)
      $('#edit-button').trigger('edit:toggled')
      if (MAP_CONTROLS.snap_to_controls.snap_to_enabled) {
        map.addInteraction(snap_to_interaction)
      }
    }
  }

  button.addEventListener('click', handleEdit, false)

  return button
}

// Remove Features Button
MAP_CONTROLS.remove_button = function () {
  var button = document.createElement('button')
  button.setAttribute('class', 'map-button remove')
  var handleRemove = function () {
    map.removeInteraction(MAP_CONTROLS.current_interaction)
    var toggled_on = MAP_CONTROLS.toggle_button(button)

    if (toggled_on) {
      MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.REMOVE)

      MAP_CONTROLS.current_interaction = new ol.interaction.Select({
        layers: [MAP_CONFIG.draw_layer]
      })

      MAP_CONTROLS.current_interaction.getFeatures().on('add', function (event) {
        var feature_id = event.element.getProperties().id

        MAP_CONTROLS.remove_selected_feature(feature_id)
        MAP_CONTROLS.current_interaction.getFeatures().clear()
      })

      map.addInteraction(MAP_CONTROLS.current_interaction)
    }
  }

  button.addEventListener('click', handleRemove, false)

  return button
}

MAP_CONTROLS.remove_all_button = function () {
  var button = document.createElement('button')
  button.setAttribute('class', 'map-button remove-all')
  var handleRemoveAll = function () {
    map.removeInteraction(MAP_CONTROLS.current_interaction)
    $('#active-control').removeAttr('id')

    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.NONE)
    MAP_CONFIG.draw_source.clear()
  }

  button.addEventListener('click', handleRemoveAll, false)

  return button
}

// Toggle/Untoggle Control
MAP_CONTROLS.toggle_button = function (button) {
    // Clear any active controls
  var is_active_control = button.id == 'active-control'
  $('#active-control').removeAttr('id')
  if (is_active_control) {
    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.NONE)
    MAP_CONTROLS.current_interaction = null
    return false
  } else {
    button.setAttribute('id', 'active-control')
    return true
  }
}

// Remove Drawn Feature
MAP_CONTROLS.remove_selected_feature = function (id) {
  var features = MAP_CONFIG.draw_source.getFeatures()
  var feature = $.grep(features, function (feature) { return feature.getProperties().id == id })
  MAP_CONFIG.draw_source.removeFeature(feature[0])
}

// Add Draw Interactions
MAP_CONTROLS.add_draw_interaction = function (type, button) {
    // Remove the previous interaction
  map.removeInteraction(MAP_CONTROLS.current_interaction)
    // Toggle the draw control as needed
  var toggled_on = MAP_CONTROLS.toggle_button(button)

  if (toggled_on) {
    MAP_CONTROLS.toggle_draw_layer_style(draw_layer_styles.DRAW)

    MAP_CONTROLS.current_interaction = new ol.interaction.Draw({
      features: MAP_CONFIG.draw_features,
      type: type,
      style: draw_layer_styles.style[draw_layer_styles.DRAW]
    })

    MAP_CONTROLS.current_interaction.on('drawend', function (event) {
      event.feature.setProperties({
        'id': Date.now()
      })
    })

    map.addInteraction(MAP_CONTROLS.current_interaction)
    if (MAP_CONTROLS.snap_to_controls.snap_to_enabled) {
      map.addInteraction(snap_to_interaction)
    }
  }
}

// Toggle Feature Styles on draw layer for current style
MAP_CONTROLS.toggle_draw_layer_style = function (style) {
  MAP_CONTROLS.current_style = style
  MAP_CONFIG.draw_layer.setStyle(draw_layer_styles.style[style])
}

ol.inherits(MAP_CONTROLS.draw_controls, ol.control.Control)

// Snap To Button
MAP_CONTROLS.snap_to_controls = {}

MAP_CONTROLS.snap_to_controls.snap_to_available = false,
MAP_CONTROLS.snap_to_controls.snap_to_enabled = false

// Enables the snap to button only
MAP_CONTROLS.snap_to_controls.enable_snap_to_button = function () {
  if (document.getElementById('snap-to')) {
    document.getElementById('snap-to').className = document.getElementById('snap-to').className.replace(' disabled-btn', '')
    document.getElementById('snap-to-button').disabled = false
    MAP_CONTROLS.snap_to_controls.snap_to_available = true
  }
}

// Disables the snap to button only
MAP_CONTROLS.snap_to_controls.disable_snap_to_button = function () {
  if (document.getElementById('snap-to')) {
    $('#snap-to').addClass('disabled-btn')
    document.getElementById('snap-to-button').disabled = true
    MAP_CONTROLS.snap_to_controls.snap_to_available = false
  }
}

// Disables the snap to button and snap to interaction
MAP_CONTROLS.snap_to_controls.disable_snap_to = function () {
  MASTER_MAP_VECTOR_LAYER.disable()
  MAP_CONTROLS.snap_to_controls.disable_snap_to_button()
  MAP_CONTROLS.snap_to_controls.snap_to_enabled = false
  document.getElementById('snap-to-button').className = document.getElementById('snap-to-button').className.replace('active', '')
  map.removeInteraction(snap_to_interaction)
}

var snap_to_interaction = new ol.interaction.Snap({
  source: MASTER_MAP_VECTOR_LAYER.layer.getSource(),
  edge: true,
  vertex: true,
  pixelTolerance: 7.5
})

MAP_CONTROLS.snap_to = function () {
  var button = document.createElement('button')
  button.id = 'snap-to-button'
  button.disabled = true
  var handleSnapTo = function () {
    if (MAP_CONTROLS.snap_to_controls.snap_to_enabled) {
            // Disable the snap to interaction and vector layer, but not the snap to button
      MASTER_MAP_VECTOR_LAYER.disable()
      map.removeInteraction(snap_to_interaction)
      MAP_CONTROLS.snap_to_controls.snap_to_enabled = false
      document.getElementById('snap-to-button').className = document.getElementById('snap-to-button').className.replace('active', '')
    } else {
            // Enable the snap to interaction and vector layer
      MASTER_MAP_VECTOR_LAYER.enable()
      map.addInteraction(snap_to_interaction)
      MAP_CONTROLS.snap_to_controls.snap_to_enabled = true
      $('#snap-to-button').addClass('active')
    }
  }

  button.addEventListener('click', handleSnapTo, false)

  var snap_to_div = document.createElement('div')
  snap_to_div.id = 'snap-to'
  snap_to_div.className = 'ol-control disabled-btn'

  snap_to_div.appendChild(button)

  ol.control.Control.call(this, {
    element: snap_to_div
  })
}

ol.inherits(MAP_CONTROLS.snap_to, ol.control.Control)
