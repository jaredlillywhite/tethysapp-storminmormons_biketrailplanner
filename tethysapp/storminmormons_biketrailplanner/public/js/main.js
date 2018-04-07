function check_input() {
    var schoolscheck = document.getElementById("schools").checked;
    var stationscheck = document.getElementById("train_stations").checked;
    var parkscheck = document.getElementById("local_parks").checked;

    if (schoolscheck && parkscheck && stationscheck) {
        return "all";
    } else if (schoolscheck && parkscheck && !(stationscheck)) {
        return "SchoolsAndParks";
    } else if (schoolscheck && !(parkscheck) && stationscheck) {
        return "SchoolsAndStations";
    } else if (schoolscheck && !(parkscheck) && !(stationscheck)) {
        return "Schools";
    } else if (!(schoolscheck) && parkscheck && stationscheck) {
        return "ParksAndStations";
    } else if (!(schoolscheck) && parkscheck && !(stationscheck)) {
        return "Parks";
    } else if (!(schoolscheck) && !(parkscheck) && stationscheck) {
        return "Stations";
    } else if (!(schoolscheck) && !(parkscheck) && !(stationscheck)) {
        return "none";
    }
}
console.log(check_input());

function line_plot_modal() {
    $("#lineplotmod").modal('show')
}

function show_line_plot_button() {
    document.getElementById("lineplotbutton").style.visibility = "visible";
}
var app;


function hide_buttons() {
    document.getElementById("waiting_output").innerHTML = '';
}

function hide_line_plot_button() {
    document.getElementById("lineplotbutton").style.visibility = "hidden";
}
function waiting_output() {
    var wait_text = "<strong>Calculating Path...</strong><br>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='/static/storminmormons_biketrailplanner/images/bikepedaling.gif'>";
    document.getElementById('waiting_output').innerHTML = wait_text;
}

    require([
      "esri/Color",
      "esri/map",
      "esri/graphic",
      "esri/units",
      "esri/graphicsUtils",
      "esri/dijit/ElevationProfile",
      "esri/tasks/Geoprocessor",
      "esri/tasks/FeatureSet",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/SimpleFillSymbol",
      "esri/layers/MapImageLayer",
      "esri/layers/FeatureLayer",
      "dojo/dom",
      "dojo/on",
      "dojo/domReady!"
    ], function(Color, Map, Graphic, Units, graphicsUtils, ElevationsProfileWidget, Geoprocessor, FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol,
                SimpleFillSymbol, MapImageLayer, FeatureLayer, dom, on) {

      var map, gp, epWidget;

      // Initialize map, GP and image params
      map = new Map("mapDiv", {
        basemap: "satellite",
        center: [-111.7, 40.2],
        zoom: 10
      });

    var chartOptions = {
        titleFontColor: "#ffffff",
        axisFontColor: "#ffffff",
        sourceTextColor: "white",
        busyIndicatorBackgroundColor: "#666"
    };

    var profileParams = {
        map: map,
        chartOptions: chartOptions,
        profileTaskUrl: "https://elevation.arcgis.com/arcgis/rest/services/Tools/ElevationSync/GPServer",
        scalebarUnits: Units.MILES
    };

    epWidget = new ElevationsProfileWidget(profileParams, dom.byId("profileChartNode"));
    epWidget.startup();

    var count = 0;
    var featureSet1 = new FeatureSet();
    var featureSet2 = new FeatureSet();

    if (check_input() == "all") {
        gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath");
    } else if (check_input() == "none") {
        gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath");
    } else if (check_input() == "Schools") {
        gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath");
    } else if (check_input() == "Parks") {
        gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath");
    } else if (check_input() == "Stations") {
        gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath");
    } else if (check_input() == "SchoolsAndParks") {
        gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath");
    } else if (check_input() == "SchoolsAndStations") {
        gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath");
    } else if (check_input() == "ParksAndStations") {
        gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath");
    }
    gp.setOutputSpatialReference({wkid: 102100});

    function run_start(){
      count = 100;
      map.on("click", startpoint);
    }

    function startpoint(event) {

        if (count == 100) {

        map.graphics.clear();
        var pointSymbol = new SimpleMarkerSymbol();
        pointSymbol.setOutline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 5);
        pointSymbol.setSize(20);
        pointSymbol.setColor(new Color([255, 0, 0, 0.75]));

        var graphic = new Graphic(event.mapPoint, pointSymbol);
        map.graphics.add(graphic);

        var features = [];
        features.push(graphic);
        featureSet1.features = features;

        count = count + 1;
        }
    }

	//add map click function
	function run_service(){
	    if (count == 101){
	    count = 200;
	    console.log(featureSet1.features);
        map.on("click", bufferPoint);
        return;
        }
    }
	//main function
    function bufferPoint(event) {
        if (count == 200){
        //graphicsLayer.removeAll();

        var pointSymbol = new SimpleMarkerSymbol();
        pointSymbol.setOutline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 5);
        pointSymbol.setSize(20);
        pointSymbol.setColor(new Color([255, 0, 0, 0.75]));

        var graphic = new Graphic(event.mapPoint, pointSymbol);
        map.graphics.add(graphic);

        var features = [];
        features.push(graphic);
        featureSet2.features = features;

		  // input parameters


        count = count + 1;
      }
    }
	function completeCallback(result){
        hide_buttons();
        gp.getResultData(result.jobId, "leastcost_shp").then(drawResult, drawResultErrBack);

	}

	function drawResult(data){
            lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 140, 0]), 5);
            console.log(data.value.features[0]);
            console.log(data.value.features[1]);
            console.log(data);
            var leastcost = data.value.features[0];
            var leastcost1 = data.value.features[1];
            leastcost.symbol = lineSymbol;
            leastcost1.symbol = lineSymbol;

            map.graphics.add(leastcost);
            map.graphics.add(leastcost1);

            epWidget.set("profileGeometry", leastcost1.geometry);

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
    function calculate(){

          var params = {
            //"Point": featureSet,
            //"Distance": bfDistance
            "Start":featureSet1,
            "End":featureSet2
          };
          waiting_output();
          gp.submitJob(params).then(completeCallback, errBack, statusCallback);
    }


    function refresh() {
        epWidget.clearProfile();
        map.graphics.clear();
        hide_line_plot_button();
        count = 0;
    }

    var schools_layer = new FeatureLayer ("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Utah_County_Schools/MapServer/0");
    var utah_county=new FeatureLayer("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/UtahCountyBoundary/FeatureServer/0");
    var commuter_rail_layer = new FeatureLayer ("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Utah_County_Commuter_Stations/FeatureServer/0");
    var parks_layer = new FeatureLayer ("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/UtahCountyLocalParks/MapServer/0");
//
    map.addLayer(schools_layer);
    map.addLayer(commuter_rail_layer);
    map.addLayer(parks_layer);
    map.addLayer(utah_county);
    schools_layer.setVisibility(document.getElementById("schools").checked);
    commuter_rail_layer.setVisibility(document.getElementById("train_stations").checked);
    parks_layer.setVisibility(document.getElementById("local_parks").checked);

//
    on(dom.byId("schools"), "change", function(){
        schools_layer.setVisibility(dom.byId("schools").checked);
    });
	on(dom.byId("train_stations"), "change", function(){
		commuter_rail_layer.setVisibility(dom.byId("train_stations").checked);
	});
	on(dom.byId("local_parks"), "change", function(){
	    parks_layer.setVisibility(dom.byId("local_parks").checked);
	});
     app = {run_service: run_service, run_start:run_start, refresh:refresh, calculate:calculate};
});



//require([
//  "esri/Map",
//  "esri/layers/GraphicsLayer",
//  "esri/layers/FeatureLayer",
//  "esri/layers/MapImageLayer",
//  "esri/Graphic",
//  "esri/geometry/Point",
//  "esri/tasks/Geoprocessor",
//  "esri/tasks/support/LinearUnit",
//  "esri/tasks/support/FeatureSet",
//  "esri/views/MapView",
//  "dojo/domReady!",
//  "dojo/dom",
//  "dojo/on"
//], function(Map, GraphicsLayer, FeatureLayer, MapImageLayer,Graphic, Point, Geoprocessor, LinearUnit, FeatureSet, MapView, domReady, dom, on){
//
//	//a map with basemap
//	var map = new Map({
//    basemap: "satellite"
//	});
//
//    //a graphics layer to show input point and output polygon
//    var graphicsLayer = new GraphicsLayer();
//    map.add(graphicsLayer);
//
//    var view = new MapView({
//    container: "viewDiv",
//    map: map,
//	center: [-111.7, 40.2],
//	zoom: 10
//    });
//
//	// symbol for input point
//	var markerSymbol = {
//          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
//          color: [255, 0, 0],
//          outline: { // autocasts as new SimpleLineSymbol()
//            color: [255, 255, 255],
//            width: 2
//          }
//        };
//
//	// symbol for buffered polygon
//    var fillSymbol = {
//          type: "simple-fill", // autocasts as new SimpleFillSymbol()
//          color: [226, 119, 40, 0.75],
//          outline: { // autocasts as new SimpleLineSymbol()
//            color: [255, 255, 255],
//            width: 1
//          }
//        };
//
//    var lineSymbol = {
//        type: "simple-line", // autocasts as SimpleLineSymbol()
//        color: [226, 119, 40],
//        width: 4
//      };
//
//
//
//    var count = 0;
//    var featureSet1 = new FeatureSet();
//    var featureSet2 = new FeatureSet();
//
//
//    function run_start(){
//      count = 100;
//      view.on("click", startpoint);
//    }
//
//    function startpoint(event) {
//
//          //graphicsLayer.removeAll();
//          if (count == 100) {
//
//
//          var point1 = new Point({
//            longitude: event.mapPoint.longitude,
//            latitude: event.mapPoint.latitude
//            //longitude: -111.7,
//            //latitude: 40.22
//          });
//          var point1graphic = new Graphic({
//            geometry: point1,
//            symbol: markerSymbol
//          });
//          graphicsLayer.add(point1graphic);
//          var inputGraphicContainer1 = [];
//          inputGraphicContainer1.push(point1graphic);
//          featureSet1.features = inputGraphicContainer1;
//          console.log(featureSet1.features)
//          count = count + 1;
//          }
//    }
//
//	// Geoprocessing service url
//	var gpUrl = "http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath";
//    //var gpUrl="http://geoserver2.byu.edu/arcgis/rest/services/sherry/BufferService/GPServer/Buffer%20Service";
//    // create a new Geoprocessor
//	var gp = new Geoprocessor(gpUrl);
//	// define output spatial reference
//    gp.outSpatialReference = { // autocasts as new SpatialReference()
//          wkid: 102100 //EPSG3857
//        };
//	//add map click function
//	function run_service(){
//	    if (count == 101){
//	    count = 200;
//	    console.log(featureSet1.features);
//        view.on("click", bufferPoint);
//        return;
//        }
//    }
//
//	//main function
//    function bufferPoint(event) {
//          if (count == 200){
//          //graphicsLayer.removeAll();
//
//          var point = new Point({
//            longitude: event.mapPoint.longitude,
//            latitude: event.mapPoint.latitude
//            //longitude: -111.7,
//            //latitude: 40.22
//          });
//          var inputGraphic = new Graphic({
//            geometry: point,
//            symbol: markerSymbol
//          });
//          graphicsLayer.add(inputGraphic);
//          var inputGraphicContainer = [];
//          inputGraphicContainer.push(inputGraphic);
//          //featureSet2 = new FeatureSet();
//          featureSet2.features = inputGraphicContainer;
//
//		  // input parameters
//		  console.log(featureSet2);
//
//          count = count + 1;
//          }
//    }
//	function completeCallback(result){
//        hide_buttons();
//        show_line_plot_button()
//        gp.getResultData(result.jobId, "leastcost_shp").then(drawResult, drawResultErrBack);
//
//	}
//
//	function drawResult(data){
//
//            console.log()
//            var leastcost = data.value.features[0];
//            var leastcost1 = data.value.features[1];
//            leastcost.symbol = lineSymbol;
//            leastcost1.symbol = lineSymbol;
//
//
//
//            //leastcost.symbol=fillSymbol;
//            graphicsLayer.add(leastcost);
//            graphicsLayer.add(leastcost1);
//
//	}
//
//	function drawResultErrBack(err) {
//        console.log("draw result error: ", err);
//    }
//
//	function statusCallback(data) {
//        console.log(data.jobStatus);
//    }
//    function errBack(err) {
//        console.log("gp error: ", err);
//    }
//    function calculate(){
//
//          var params = {
//            //"Point": featureSet,
//            //"Distance": bfDistance
//            "Start":featureSet1,
//            "End":featureSet2
//          };
//          waiting_output();
//          gp.submitJob(params).then(completeCallback, errBack, statusCallback);
//
//
//    }
//    function refresh(){
//        graphicsLayer.removeAll();
//        hide_line_plot_button();
//        count = 0;
//    }
//    var template = { // autocasts as new PopupTemplate()
//        title: "Station Information",
//        content: "<p>Station Info:</p>" + "<ul><li>Address: {ADDRESS}</li>" + "<li> Name: {NAME}</li>" + "<li>Park & Ride: {PARKNRIDE}</li></ul>",
//        fieldInfos: [{
//            fieldName: "ADDRESS",
//        }, {
//            fieldName: "NAME",
//        }, {
//            fieldName: "PARKNRIDE",
//        }]
//    };
//    var schools_layer = new MapImageLayer ({
//        url: "http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Utah_County_Schools/MapServer",
//        id: "schools_layer"
//    });
//    var utah_county=new FeatureLayer({
//        url:"http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/UtahCountyBoundary/FeatureServer",
//        id: "utah_county"
//    });
//    var commuter_rail_layer = new FeatureLayer ({
//        url: "http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Utah_County_Commuter_Stations/FeatureServer",
//        outFields: ["*"],
//        popupTemplate: template,
//        id: "commuter_rail_layer"
//    });
//    var parks_layer = new MapImageLayer ({
//        url: "http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/UtahCountyLocalParks/MapServer",
//        id: "parks_layer"
//    });
//
//    map.add(schools_layer);
//    map.add(commuter_rail_layer);
//    map.add(parks_layer);
//    map.add(utah_county);
//    schools_layer.visible = document.getElementById("schools").checked;
//    commuter_rail_layer.visible = document.getElementById("train_stations").checked;
//    parks_layer.visible = document.getElementById("local_parks").checked;
//
//
//    on(dom.byId("schools"), "change", function(){
//        schools_layer.visible = dom.byId("schools").checked;
//    });
//	on(dom.byId("train_stations"), "change", function(){
//		commuter_rail_layer.visible = dom.byId("train_stations").checked;
//	});
//	on(dom.byId("local_parks"), "change", function(){
//	    parks_layer.visible = dom.byId("local_parks").checked;
//	});
//    app = {run_service: run_service, run_start:run_start, refresh:refresh, calculate:calculate};
//});
