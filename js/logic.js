//Create API endpoint inside queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define markersize for magnitude
function markerSize(magnitude) {
  return magnitude * 5;
};

// Define colors depending on the magnitude of the earthquake
function colorRange(magnitude) {

  switch (true) {
    case magnitude > 5.0:
      return 'darkred';
      break;
  
    case magnitude >= 4.0:
      return 'red';
      break;
    
    case magnitude >= 3.0:
      return 'orange';
      break;
  
    case magnitude >= 2.0:
      return 'yellow';
      break;
  
    case magnitude >= 1.0:
      return 'lightgreen';
      break;
  
      case magnitude >= 0:
      return 'green';
  };
};

// Perform get request to the query URL
d3.json(queryURL, function(data) {
  console.log(data);
  createFeatures(data.features);
});

// Function to create features for the map
function createFeatures(earthquakeData) {
  // Create function for each feature and popupcontaining earthquake data
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Location: " + feature.properties.place + 
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: colorRange(feature.properties.mag),
        color: "black",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 0.7
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

//Create map
function createMap(earthquakes) {

  // Define maps and layers
  var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });


   var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Define basemaps
  var baseMaps = {
    "Street Map": streetMap,
    "Dark Map": darkMap
  };

  //Create overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map giving it satelliteMap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3,
    layers: [streetMap, earthquakes]
  });
  
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// Create the legend
var legend = L.control({
  position: "bottomright"
});


legend.onAdd = function(myMap) {
  var legend_loc = L.DomUtil.create("div", "info legend"),
  levels = [0, 1, 2, 3, 4, 5]
  
  legend_loc.innerHTML+='Magnitude<br><hr>'
  // Loop through magnitude intervals and generate a label with a colored square for each interval
  for (var i = 0; i < levels.length; i++) {
    
      legend_loc.innerHTML +=
      '<i style="background:' + colorRange(levels[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
      levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<br>' : '+');

  }
  return legend_loc;
};

// Add legend to the map
legend.addTo(myMap);
};
