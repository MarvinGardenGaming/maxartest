require(["esri/config",
"esri/Map",
"esri/views/MapView",
"esri/Graphic",
"esri/layers/GraphicsLayer",
"esri/rest/query",
"esri/rest/support/Query"], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, query, Query) {
  esriConfig.apiKey = "AAPKce89641cc45b40df94ad4fd62b2a151dCWdj16h6vaKos5YzxeQIEekEnIt1ociwXWZR9JFlYezDHhB9kcy8LQnWErOY2fwm";

  // Declaring the basemap
  const map = new Map({
    basemap: "arcgis-nova" // Basemap layer
  });
  
  // Setting up view, extent, zoom
  const view = new MapView({
    map: map,
    center: [-105.05678173, 39.67717782],
    zoom: 10, // scale: 72223.819286
    container: "viewDiv",
    constraints: {
      snapToZoom: false
    }
  });

  // Adding a graphics layer to the map
  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  //**NOTE**//
  // This is how I would typically perform a get call to retrieve the json. I am receiving a CORS error even though I'm passing in the proper headers. This may need to be set under the bucket's permissions tab in the CORS section where you change the CORS configuration via the text box.
  /*
  $.ajaxSetup({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  }
  });

    $.ajax({
      url: "https://geojson-example.s3.amazonaws.com/polygon.json"
    });
  */

  // Example of what the response would return
  const stringResponseExample = '{"type": "Polygon","coordinates": [[[-105.05678173,39.67717782],[-105.12923684,39.71973826],[-105.11209692,39.78921714],[-105.04509542,39.82991355],[-104.94147681,39.75029364],[-104.87603348,39.80896988],[-104.8316255,39.74849664],[-104.93446502,39.69396535],[-105.05678173,39.67717782]]]}';

  // Converting the response to json
  const jsonResponseExample = JSON.parse(stringResponseExample);

  // Create a polygon geometry
  const polygon = {
    type: jsonResponseExample.type.toLowerCase(),
    rings: [
        jsonResponseExample.coordinates[0] // Pull in the array of points
    ]
  };

  // Declaring max and min values for later use
  var minX;
  var minY;
  var maxX;
  var maxY;

  // Loop through all points in array
  for(let i = 0; i < jsonResponseExample.coordinates[0].length; i++){
    // Set this point to variable for easier readability
    var thisPoint = jsonResponseExample.coordinates[0][i];

    // if the min/max x/y values are null set them to first value returned else compare them to determine appropriate value. If it meets criteria update that value
    if(!minX || thisPoint[0] < minX){
      minX = thisPoint[0];
    }

    if(!maxX || thisPoint[0] > maxX){
      maxX = thisPoint[0];
    }

    if(!minY || thisPoint[1] < minY){
      minY = thisPoint[1];
    }

    if(!maxY || thisPoint[1] > maxY){
      maxY = thisPoint[1];
    }
  }

  // Create a minimum bounding rectangle geometry
  const minimumBoundingRectangle = {
    type: jsonResponseExample.type.toLowerCase(),
    rings: [
        [minX, minY],
        [minX, maxY],
        [maxX, maxY],
        [maxX, minY]
    ]
  };

  // Set fill color and opacity
  const purpleFill = {
    type: "simple-fill",
    color: [184, 0, 255, 0.3],  // Orange, opacity 80%
    outline: {
        color: [255, 255, 255],
        width: 1
    }
  };

  // Pass that to Graphic object
  const minimumBoundingRectangleGraphic = new Graphic({
    geometry: minimumBoundingRectangle,
    symbol: purpleFill,

  });

  // Add that graphic to the graphics layer
  graphicsLayer.add(minimumBoundingRectangleGraphic);

  // Set fill color and opacity
  const orangeFill = {
    type: "simple-fill",
    color: [227, 139, 79, 0.5],  // Orange, opacity 80%
    outline: {
        color: [255, 255, 255],
        width: 1
    }
  };

  // Pass that to Graphic object
  const polygonGraphic = new Graphic({
    geometry: polygon,
    symbol: orangeFill,

  });

  // Add that graphic to the graphics layer
  graphicsLayer.add(polygonGraphic);
});