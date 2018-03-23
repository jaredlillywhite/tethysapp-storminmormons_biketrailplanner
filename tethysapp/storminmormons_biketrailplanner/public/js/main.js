function line_plot_modal() {
    $("#lineplotmod").modal('show')
}

function show_line_plot_button() {
    document.getElementById("lineplotbutton").style.visibility = "visible";
}
var app;
require([
  "esri/Map",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/geometry/Point",
  "esri/tasks/Geoprocessor",
  "esri/tasks/support/LinearUnit",
  "esri/tasks/support/FeatureSet",
  "esri/views/MapView",
  "dojo/domReady!"
], function(Map, GraphicsLayer, Graphic, Point, Geoprocessor, LinearUnit, FeatureSet, MapView){

	//a map with basemap
	var map = new Map({
    basemap: "satellite"
	});

    //a graphics layer to show input point and output polygon
    var graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    var view = new MapView({
    container: "viewDiv",
    map: map,
	center: [-111.7, 40.2],
	zoom: 10
    });

	// symbol for input point
	var markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [255, 0, 0],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
        };

	// symbol for buffered polygon
    var fillSymbol = {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [226, 119, 40, 0.75],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1
          }
        };

    var lineSymbol = {
        type: "simple-line", // autocasts as SimpleLineSymbol()
        color: [226, 119, 40],
        width: 4
      };

      var featureSet1 = new FeatureSet();
      var featureSet2 = new FeatureSet();

      function run_start(){
        view.on("click", startpoint);
      }
      function startpoint(event) {

          //graphicsLayer.removeAll();


          var point1 = new Point({
            longitude: event.mapPoint.longitude,
            latitude: event.mapPoint.latitude
            //longitude: -111.7,
            //latitude: 40.22
          });
          var point1graphic = new Graphic({
            geometry: point1,
            symbol: markerSymbol
          });
          graphicsLayer.add(point1graphic);
          var inputGraphicContainer1 = [];
          inputGraphicContainer1.push(point1graphic);
          //var featureSet1 = new FeatureSet();
          featureSet1.features = inputGraphicContainer1;
      }



            //var point1 = new Point({
            //    longitude: -111.7,
            //   latitude: 40.24
            //});
              // Create a graphic and add the geometry and symbol to it
            //var point1graphic = new Graphic({
            //    geometry: point1,
            //    symbol: markerSymbol
            //});
            //view.graphics.addMany([point1graphic, point2graphic]);
            //graphicsLayer.add(point1graphic);
            //var inputGraphicContainer1 = [];
            //inputGraphicContainer1.push(point1graphic);
            //var featureSet1 = new FeatureSet();
            //featureSet1.features = inputGraphicContainer1;



	// Geoprocessing service url
	var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/LeastCost/GPServer/LeastCostPath";
    //var gpUrl="http://geoserver2.byu.edu/arcgis/rest/services/sherry/BufferService/GPServer/Buffer%20Service";
    // create a new Geoprocessor
	var gp = new Geoprocessor(gpUrl);
	// define output spatial reference
    gp.outSpatialReference = { // autocasts as new SpatialReference()
          wkid: 102100 //EPSG3857
        };
	//add map click function
	function run_service(){
        view.on("click", bufferPoint);
    }

	//main function
    function bufferPoint(event) {

          //graphicsLayer.removeAll();

          show_line_plot_button()
          var point = new Point({
            longitude: event.mapPoint.longitude,
            latitude: event.mapPoint.latitude
            //longitude: -111.7,
            //latitude: 40.22
          });
          var inputGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol
          });
          graphicsLayer.add(inputGraphic);
          var inputGraphicContainer = [];
          inputGraphicContainer.push(inputGraphic);
          var featureSet = new FeatureSet();
          featureSet.features = inputGraphicContainer;

		  // input parameters
          var params = {
            //"Point": featureSet,
            //"Distance": bfDistance
            "Start":featureSet1,
            "End":featureSet
          };
          gp.submitJob(params).then(completeCallback, errBack, statusCallback);
    }

	function completeCallback(result){

        gp.getResultData(result.jobId, "leastcost_shp").then(drawResult, drawResultErrBack);

	}

	function drawResult(data){
	    var leastcost = data.value.features[0];
		leastcost.symbol = lineSymbol;
		//leastcost.symbol=fillSymbol;
		graphicsLayer.add(leastcost);
	}

	function drawResultErrBack(err) {
        console.log("draw result error: ", err);
    }

	function statusCallback(data) {
        console.log(data.jobStatus);
    }
    function errBack(err) {
        console.log("gp error: ", err);
    }
    function refresh(){
        graphicsLayer.removeAll();
    }
    app = {run_service: run_service, run_start:run_start, refresh:refresh};
});
