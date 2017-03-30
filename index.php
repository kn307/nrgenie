<?php
/* initialise session */
//session_start();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-gb">
<head>
    <title>NRGenie</title>
    <link rel="stylesheet" href="css/leaflet.css"/>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <style>
        .w3-left, .w3-right, .w3-badge {cursor:pointer}
        .w3-badge {height:13px;width:13px;padding:0}
    </style>
    <link rel="stylesheet" href="css/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css"/>
    <link rel="stylesheet" href="css/bootstrap-select.min.css"/>
    <link rel="stylesheet" href="css/main.css"/>
    <script type="text/javascript" src="js/utility.js"></script>
    <script type="text/javascript" src="js/mapFunctions.js"></script>
    <script type="text/javascript" src="js/compareResources.js"></script>
    <script type="text/javascript" src="js/leaflet.js"></script>
    <script type="text/javascript" src="js/jquery-3.1.1.js"></script>
    <script type="text/javascript" src="js/Chart.bundle.js"></script>
    <script type="text/javascript" src="js/spin.js"></script>
    <script type="text/javascript" src="js/leaflet.spin.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/bootstrap-select.min.js"></script>
</head>

<body>
<div id="map" class="map">
    <div class="leaflet-control" style="padding-left: 10px;padding-right: 10px; position:absolute; bottom:30px; width:100%;">
        <!-- Social Button HTML -->

        <!-- Twitter -->
        <a href="http://twitter.com/share?url=http://ec2-52-32-64-107.us-west-2.compute.amazonaws.com/&text=Checkout NR Genie&via=nrGenie" target="_blank" class="share-btn twitter" style="color: #ffffff;">
            <i class="fa fa-twitter"></i>
        </a>

        <!-- Google Plus -->
        <a href="https://plus.google.com/share?url=http://ec2-52-32-64-107.us-west-2.compute.amazonaws.com/" target="_blank" class="share-btn google-plus" style="color: #ffffff;">
            <i class="fa fa-google-plus"></i>
        </a>

        <!-- Facebook -->
        <a href="http://www.facebook.com/sharer/sharer.php?u=http://ec2-52-32-64-107.us-west-2.compute.amazonaws.com/" target="_blank" class="share-btn facebook" style="color: #ffffff;">
            <i class="fa fa-facebook"></i>
        </a>

        <!-- StumbleUpon (url, title) -->
        <a href="http://www.stumbleupon.com/submit?url=http://ec2-52-32-64-107.us-west-2.compute.amazonaws.com/&title=NR Genie" target="_blank" class="share-btn stumbleupon" style="color: #ffffff;">
            <i class="fa fa-stumbleupon"></i>
        </a>

        <!-- Reddit (url, title) -->
        <a href="http://reddit.com/submit?url=http://ec2-52-32-64-107.us-west-2.compute.amazonaws.com/&title=NR Genie" target="_blank" class="share-btn reddit" style="color: #ffffff;">
            <i class="fa fa-reddit"></i>
        </a>

        <!-- LinkedIn -->
        <a href="http://www.linkedin.com/shareArticle?url=http://ec2-52-32-64-107.us-west-2.compute.amazonaws.com/&title=NR Genie&summary=Check out NR Genie!&source=http://ec2-52-32-64-107.us-west-2.compute.amazonaws.com/" target="_blank" class="share-btn linkedin" style="color: #ffffff;">
            <i class="fa fa-linkedin"></i>
        </a>

        <!-- Email -->
        <a href="mailto:?subject=Check out NR Genie!&body=Checkout NR Genie! http://ec2-52-32-64-107.us-west-2.compute.amazonaws.com/" target="_blank" class="share-btn email" style="color: #ffffff;">
            <i class="fa fa-envelope"></i>
        </a>
    </div>
    <div class="leaflet-control container" style="position:absolute; top:10px; right:0; width:525px;">
        <button id="compareButton" class="btn btn-default" data-toggle="collapse" data-target="#comparePanel" style="float:right;">Compare Trends</button>
        <div id="comparePanel" class="panel-collapse collapse">
            <div class="comparePanel leaflet-popup-content-wrapper">
                <p style="padding:6px 12px; font-size:14px">Select resource statistics to compare:</p>
                <div class="dropdownDiv">
                    <select id="resourceTypeDropdown" class="selectpicker compareDropdown">
                        <option class="dropdownItem" selected="selected" hidden="hidden" disabled="disabled" value="placeholder">Resource Type</option>
                        <option class="dropdownItem">Crude Oil</option>
                        <option class="dropdownItem">Natural Gas</option>
                        <option class="dropdownItem">Wind Turbines</option>
                    </select>
                    <select id="countrySelectDropdown" class="selectpicker compareDropdown" multiple="multiple" disabled="disabled" title="Select Countries">
                    </select>
                </div>
                <canvas id='compareResourceCanvas' class='countryGraphCanvas' width='495px' height='420px'></canvas>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript"> <!--
    myMap = L.map('map', {
        center: [51.505, -0.09],
        zoom: 3,
        minZoom: 3,
        maxZoom: 5,
        worldCopyJump: true
        }
    );
    currentZoom = 3;

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9hY2hpbW1pbG5lciIsImEiOiJjajBoNGphMDQwMDQ3MzNxcmVhYmhnMG1uIn0.QtFJHG2sunTWf-Xt32JxzA', {
        attribution: "Map data &copy; <a href='http://openstreetmap.org'<OpenStreetMap&lt;/a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='http://mapbox.com'>Mapbox</a>",
        maxZoom: 18
    }).addTo(myMap);

    $("#compareButton").hide();
    $("#resourceTypeDropdown").selectpicker('val', 'placeholder');

    myMap.spin(true, {lines: 15, length: 10, scale: 2.0, color: "#FFF"});

    getCountryMarkers();
    getSingleResourceMarkers();
//-->
</script>

</body>
</html>