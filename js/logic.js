/*Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

   * Your data markers should reflect the magnitude of the earthquake in their size and color. 
     Earthquakes with higher magnitudes should appear larger and darker in color.

   * Include popups that provide additional information about the earthquake when a marker is clicked.

   * Create a legend that will provide context for your map data.

   * Your visualization should look something like the map above.


   * to run this application run python -m http.server 
        -> make sure you open the terminal at the location the index.html file is located
   
   */

// We need to ccreate the map object and tell it it what level to zoom for the default view 
// Create API endpoint inside queryURL
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

// Create map
function createMap(earthquakes) {

    // Define maps and layers
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
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
    "Satellite Map": satelliteMap,
    "Dark Map": darkMap
  };

  // Create overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map giving it satelliteMap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3,
    layers: [satelliteMap, earthquakes]
  });
  
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

/** We can start by putting data on the map 
 * 
 *   Step 1: put the data on the map. 
 *        1.1 Since we are using geoJson data we need to use the L.geoJson function to plot the data on the map
 *        1.2 Resources -- https://leafletjs.com/reference-1.3.4.html#geojson
 * 
 * 
 *   Step 2: We can use the options in the GeoJson file to color our map 
 *        2.1: We need to color the map based on the Earthquake Manitude
 */

//function plotData

  // step 1.1 + 1.2 goes here

