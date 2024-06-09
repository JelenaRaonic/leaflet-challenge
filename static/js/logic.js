// CREATE A MAP OBJECT.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // ADD A TILE LAYER (background map image)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


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
    if (depth<= 10) return "#F0F8FF";
    else if (depth<=30) return "#00FFFF";
    else if (depth<=50) return "#6495ED";
    else if (depth<=70) return "#00008B";
    else if (depth<=90) return "#483D8B";
    else return "#191970";
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
      // Send our earthquakes layer to the createMap function/
    //createMap(earthquakes);
}


// Should I do function createMap(earthquakes)  where I create Map object + tile layer
// should I create layer control and pass it to Map object and add layer control on map 
// l.control.layer





//Create a legend that will provide context for map data
// Set up the legend.
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "info legend");
  
  var grades = [0,1,2,3,4,5];
  var colors  = ["#F0F8FF", "#00FFFF","#6495ED", "#00008B", "#483D8B", "#191970"];
  

  //loop throught the grades 
  for (var i=0; i<grades.length; i++){
    div.innerHTML += 
    '<i style = "background:' + getcolor(grades[i]) + '"></i>' + grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1]+'<br>': '+');
  }
  return div;
};

//Add legend to the map
legend.addTo(myMap);









  