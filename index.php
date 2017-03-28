<?php
/* initialise session */
//session_start();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-gb">
<head>
    <title>NRGenie</title>
    <link href="css/leaflet.css" rel="stylesheet"/>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link href="css/main.css" rel="stylesheet"/>
    <script type="text/javascript" src="js/functions.js"></script>
    <script type="text/javascript" src="js/leaflet-src.js"></script>
    <script type="text/javascript" src="js/jquery-3.1.1.js"></script>
    <script type="text/javascript" src="js/Chart.bundle.js"></script>
</head>

<body>
<div id="map" class="map">
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

    //mymap.locate({setView: true, maxZoom: 16});
    generateMarkers();
//-->
</script>

</body>
</html>