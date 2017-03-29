var myMap;
var currentZoom;
var graphSlideIndex;
var currentGraphSlideElements;
var currentGraphSlideDots;
var currentGraphSlideDataSets;

function getCountryMarkers() {
    $.getJSON( "php/GetCountryMarkers.php", function(data) {
        createCountryMarkers(data);
        myMap.on("zoomend", function (e) {
            var newZoom = myMap.getZoom();
            if ((currentZoom < 5) && newZoom === 5) {
                myMap.closePopup();
                $('.countryMarkerFade').fadeOut('slow');
                $('.singleResourceMarkerFade').fadeIn('slow');
            }
            else if (currentZoom === 5 && newZoom < 5) {
                myMap.closePopup();
                $('.singleResourceMarkerFade').fadeOut('slow');
                $('.countryMarkerFade').fadeIn('slow');
            }
            currentZoom = newZoom;
        });
    });
}

function getSingleResourceMarkers() {
    $.getJSON("php/GetSingleResourceMarkers.php", function(data) {
        createSingleResourceMarkers(data);
        //console.log(singleResourceMarkers);
        $(".singleResourceMarkerFade").hide();
    });
}

function createCountryMarkers(countryMarkerData) {
    countryMarkerData.forEach(function (countryMarker) {
        var latlng = L.latLng(countryMarker.latitude, countryMarker.longitude);
        var marker = L.marker(latlng).addTo(myMap);
        $(marker._icon).addClass("countryMarkerFade");


        var popupContent = "<div class='w3-content w3-display-container popupPanel'>";
        var slideshowClass = countryMarker.countryName + "Graphs";
        var slideshowDotsClass = countryMarker.countryName + "Dots";
        countryMarker.resourceDataSets.forEach(function(resourceDataSet) {
            var canvasID = ("ChartCanvas" + resourceDataSet.resourceDataSetID).replace(/\s/g,'');
            popupContent += "<canvas id='" + canvasID + "' class='countryGraphCanvas " + slideshowClass + "' width='400px' height='350px'></canvas>";
        });
        popupContent += "<div class='w3-center w3-container w3-section w3-large w3-text-black w3-display-bottommiddle' style='width:100%;z-index:999'>" +
                "<div class='w3-left w3-hover-text-khaki' onclick='incrementGraphSlide(-1)'>&#10094;</div>" +
                "<div class='w3-right w3-hover-text-khaki' onclick='incrementGraphSlide(1)'>&#10095;</div>";

        for (var i = 0; i < countryMarker.resourceDataSets.length; i++) {
            popupContent += "<span class='w3-badge " + slideshowDotsClass + " w3-border w3-transparent w3-hover-grey' onclick='setGraphSlide(" + i + ")'></span>";
        }
        popupContent += "</div></div>";
        marker.bindPopup(popupContent, {
            minWidth : 400
        }).on("popupopen", function() {
            graphSlideIndex = 0;
            currentGraphSlideElements = document.getElementsByClassName(slideshowClass);
            currentGraphSlideDots = document.getElementsByClassName(slideshowDotsClass);
            currentGraphSlideDataSets = countryMarker.resourceDataSets;
            showGraphSlide(graphSlideIndex);
        });

       // countryMarkers.push(marker);
    });
}

function incrementGraphSlide(n) {
    showGraphSlide(graphSlideIndex += n);
}

function setGraphSlide(n) {
    showGraphSlide(graphSlideIndex = n);
}

function showGraphSlide(n) {
    var i;
    if (n > currentGraphSlideElements.length - 1) {graphSlideIndex = 0}
    if (n < 1) {graphSlideIndex = currentGraphSlideElements.length - 1}
    for (i = 0; i < currentGraphSlideElements.length; i++) {
        currentGraphSlideElements[i].style.display = "none";
    }
    for (i = 0; i < currentGraphSlideDots.length; i++) {
        currentGraphSlideDots[i].className = currentGraphSlideDots[i].className.replace(" w3-grey", "");
    }
    currentGraphSlideElements[graphSlideIndex].style.display = "block";
    currentGraphSlideDots[graphSlideIndex].className += " w3-grey";
    fillGraphContext(currentGraphSlideDataSets[graphSlideIndex], currentGraphSlideElements[graphSlideIndex].id);
}

function createSingleResourceMarkers(singleResourceMarkerData) {
    singleResourceMarkerData.forEach(function (singleResourceMarker) {
        var icon = L.icon({
            iconUrl: getResourceIcon(singleResourceMarker.resourceType),
            //shadowUrl: 'leaf-shadow.png',
            iconSize:     [30, 45], // size of the icon
            //shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            //shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var latlng = L.latLng(singleResourceMarker.latitude, singleResourceMarker.longitude);
        var marker = L.marker(latlng, {icon: icon}).addTo(myMap);
        $(marker._icon).addClass("singleResourceMarkerFade");

        var canvasID = (singleResourceMarker.cityName + "ChartCanvas").replace(/\s/g,'');
        marker.bindPopup("<div class='popupPanel'><canvas id='" + canvasID + "' class='graphCanvas' width='400px' height='400px'></canvas></div>", {
            minWidth : 400
        }).on("popupopen", function() {
            fillGraphContext(singleResourceMarker.resourceDataSet, canvasID);
        });
    });
}

function fillGraphContext(resourceDataSet, canvasID) {
    var labels = [];
    var values = [];
    var fillColours = [];
    resourceDataSet.dataPoints.forEach(function(dataPoint) {
        labels.push(dataPoint.yValue);
        values.push(dataPoint.xValue);
        if (!dataPoint.isForecasted) {
            fillColours.push("rgba(75,192,192,0.4)");
        } else {
            fillColours.push("rgba(255,153,153,0.4)");
        }
    });

    var chartCtx = $("#" + canvasID);
    var myChart = new Chart(chartCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: resourceDataSet.resourceDataSetTitle,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: fillColours,
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: values,
                    spanGaps: false
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            legend: {
                onClick: function(event, legendItem) {}
            }
        }
    });
}

function refreshMarkers() {
    if (myMap.getZoom() === 5) {
        for (countryMarker in countryMarkers) {
            myMap.removeLayer(countryMarker);
        }
        for (singleResourceMarker in singleResourceMarkers) {
            singleResourceMarker.addTo(myMap);
        }
    } else {
        for (singleResourceMarker in singleResourceMarkers) {
            myMap.removeLayer(singleResourceMarker);
        }
        for (countryMarker in countryMarkers) {
            countryMarker.addTo(myMap);
        }

    }
}

function getResourceIcon(resourceType) {
    switch(resourceType) {
        case "Oil":
            return "images/oilIcon.png";
        case "Wind":
            return "images/windIcon.png";
        case "Gas":
            return "images/gasIcon.png";
    }
}