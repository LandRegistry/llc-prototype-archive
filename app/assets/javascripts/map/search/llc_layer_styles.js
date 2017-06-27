// Styles for LLC Layer
llc_layer_styles = {
    Point: "Point",
    Polygon: "Polygon",
    LineString: "LineString",

    // Non-highlighted styles for llc_layer features
    standard_style: {
        "Point": new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                stroke: new ol.style.Stroke({
                    color: '#0658e5',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: [255, 255, 255, 1]
                })
            })
        }),
        "Polygon": new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 255, 255, 0.7]
            }),
            stroke: new ol.style.Stroke({
                color: '#0658e5',
                width: 1
            })
        }),
        "LineString": new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 255, 255, 0.7]
            }),
            stroke: new ol.style.Stroke({
                color: '#0658e5',
                width: 1
            })
        })
    },
    // Highlighted styles for llc_layer features
    selected_style: {
        "Point": new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                stroke: new ol.style.Stroke({
                    color: '#0658e5',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: '#0658e5'
                })
            })
        }),
        "Polygon": new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 255, 255, 0.7]
            }),
            stroke: new ol.style.Stroke({
                color: '#0658e5',
                width: 3
            })
        }),
        "LineString": new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 255, 255, 0.7]
            }),
            stroke: new ol.style.Stroke({
                color: '#0658e5',
                width: 3
            })
        })
    }
}