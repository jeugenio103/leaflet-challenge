// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);

  // 1.
  createFeatures(data.features);

});

// 2. 
function createFeatures(earthquakeData) {


  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
    <p>-Time and Date: ${new Date(feature.properties.time)}
    <br>-Details: <a href="${feature.properties.detail}"">${feature.properties.title}</a></p><hr>
    <h3>-Magnitude: ${feature.properties.mag}</h3>
    <h3>-Depth: ${feature.geometry.coordinates[2]}</h3>`);
  };

  //Magnitude Size
  function magSize(mag){
    if (mag < 0){
      return 2;
    } else if (mag == 0) {
      return 4;
    } else if (mag > 0) {
      return mag * 8;
    }

    //Color 
  }
  function depthColor(depth) {
    if (depth > -10 && depth < 10) {
        return "#98EE00";
    } else if (depth >= 10 && depth < 30) {
        return "#D4EE00";
    } else if (depth >= 30 && depth < 50) {
        return "#EECC00";
    } else if (depth >= 50 && depth < 70) {
        return "#EE9C00";
    } else if (depth >= 70 && depth < 90) {
        return "#EA822C";
    } else if (depth >= 90) {
        return "#EA2C2C";
    } else {
        return "black";
    }
  };

// Style function for use with the geoJSON layer
  function style(feature) {
      return {
          radius: magSize(feature.properties.mag),
          fillColor: depthColor(feature.geometry.coordinates[2]),
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      }
  };
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);  
    },
    style: style
});

// Send our earthquakes layer to the createMap function/
createMap(earthquakes);
};


// 3.
// createMap() takes the earthquake data and incorporates it into the visualization:

function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Creat an overlays object.
  let overlay={
    Earthquakes: earthquakes
  }
  // Create a new map.
  var myMap = L.map("map", {
    center: [
      30, -90
    ],
    zoom: 5,
    layers: [street,earthquakes]
  });

  // Create a layer control that contains our baseMaps.
  L.control.layers(baseMaps,overlay, {
    collapsed: false
  }).addTo(myMap);
  var legend = L.control({ position: "bottomright"});
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let magnitudeColor = [0, 1, 2, 3, 4, 5];
    let depthRange = ["-10 - 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90+"];
    let colorlabel = ["#98EE00", "#D4EE00", "#EECC00", "#EE9C00", "#EA822C", "#EA2C2C"]
    let labels = [];

    magnitudeColor.forEach(function(index) {
        labels.push("<li class = \"bob\">" + depthRange[index] + "</li> <li class = \"max\" style=\"background-color: " + colorlabel[index] + "\"> </li>");
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
 
  // Adding the legend to the map
  legend.addTo(myMap);

}