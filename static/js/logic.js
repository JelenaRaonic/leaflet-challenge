/// API 
// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

/// DATA LOADING for EARTHQUAKE
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    console.log("data loaded sucessfully", data);
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// CREATE A MAP OBJECT.
let myMap = L.map("map", {
    center: [37.09, -122.71],
    zoom: 3,
    //layers: [street, earthquakes]
  });
  
  
  // ADD A TILE LAYER (background map image)
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }).addTo(myMap);

//FUNCTION 
//to determine circle size and transforming negative values to positive with absolute value
function circleSize(magnitude){
    return getRadius(magnitude);
}

function getRadius(magnitude){
    return Math.sqrt(Math.abs(magnitude))*90000;
}

//determine a color
function getcolor(depth){
    if (depth<= 10) return "#F8B195";
    else if (depth<=30) return "#F67280";
    else if (depth<=50) return "#C06C84";
    else if (depth<=70) return "#6C5B7B";
    else if (depth<=90) return "#4B3B59";
    else return "black";
};

// popups that provide additional information about the earthquake when its associated marker is clicked.
function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place,time and date, magnitude and depth of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Place: ${feature.properties.place}</h3><hr />
                     <h3>Time and date: ${new Date(feature.properties.time)}</h3><hr />
                     <h3>Magnitude: ${(feature.properties.mag)}</h3><hr />
                     <h3>Depth: ${(feature.geometry.coordinates[2])}</h3>/>
                     `);
  }


    // Create GeoJSON layer group
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        //point to layer used to alter markers
        pointToLayer: function(feature, latlng){
            //determine style of markers based on properties
            var markers = {
                radius: circleSize(feature.properties.mag),
                fillColor: getcolor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity : 0.8
            }

            return L.circle(latlng, markers);
        }

      });

      earthquakes.addTo(myMap);
    
}


//Create a legend that will provide context for map data
 // Set up the legend.
 var legend = L.control({ position: "bottomleft" });

 legend.onAdd = function(myMap) {
     var div = L.DomUtil.create("div", "info legend");
     var grades = [0, 10, 30, 50, 70, 90];
     var colors = ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#4B3B59", "black"];
   
     // Loop through the grades and create a label with a colored square for each interval
     for (var i = 0; i < grades.length; i++) {
         div.innerHTML +=
             '<i style="background:' + colors[i] + '"></i> ' +
             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
     }
     return div;
 };

 // Add legend to the map
 legend.addTo(myMap);





  