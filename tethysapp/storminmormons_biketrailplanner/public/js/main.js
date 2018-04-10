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

$("#app-actions").hide();
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
        skyBottomColor:"#4682B4",
        skyTopColor:"#B0E0E6",
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





            var index;
            if (data.value.features[0]["attributes"]["Shape_Length"] > data.value.features[1]["attributes"]["Shape_Length"]) {
                epWidget.set("profileGeometry", leastcost0.geometry);
                index = 0;
            } else {
                epWidget.set("profileGeometry", leastcost1.geometry);
                index = 1;
            }
            on(epWidget, "elevation-values", function(data) {
                console.log("Forward Gained: " + data)
            })
            gpInfo = new Geoprocessor ("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/SurfaceInfo2/GPServer/Add%20Surface%20Information")
            gpInfo.setOutputSpatialReference({wkid: 26912});

            var info_params = {
                "Input_Feature_Class": data
            };
            console.log(info_params);
            gpInfo.submitJob(info_params).then(completeCallback1, errBack1, statusCallback1);

            function completeCallback1(result) {
                gpInfo.getResultData(result.jobId, "Output_Feature_Class").then(drawResult1, drawResultErrBack1);
            }

            function drawResult1(data1) {
                console.log(data1);
            }

            function drawResultErrBack1(err) {
                console.log("draw result error1: ", err);
            }

            function statusCallback1(data1) {
                console.log(data1.jobStatus);
            }

            function errBack1(err) {
                console.log("gp error: ", err);
            }


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
        if (check_input() == "all") {
            gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Path_all3/GPServer/Path_all3");
        } else if (check_input() == "none") {
            gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/FasterLeastCostPath/GPServer/FasterLeastCostPath");
        } else if (check_input() == "Schools") {
            gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Path_school/GPServer/Path_school");
        } else if (check_input() == "Parks") {
            gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Path_parks/GPServer/Path_parks");
        } else if (check_input() == "Stations") {
            gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Path_Stations/GPServer/Path_stations");
        } else if (check_input() == "SchoolsAndParks") {
            gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Path_st_pk/GPServer/Path_st_pk");
        } else if (check_input() == "SchoolsAndStations") {
            gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/cost_st_sch/GPServer/Path_st_sch");
        } else if (check_input() == "ParksAndStations") {
            gp = new Geoprocessor("http://geoserver2.byu.edu/arcgis/rest/services/StorminMormons/Path_st_pk/GPServer/Path_st_pk");
        }
        gp.setOutputSpatialReference({wkid: 102100});

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

