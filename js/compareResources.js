var compareGraph;

function handleResourceTypeDropdownClick(resourceType) {
    if (compareGraph !== undefined) {
        compareGraph.destroy();
    }
    var dropDown = $("#countrySelectDropdown");
    dropDown.html("");
    var countries = [];
    countryMarkers.forEach(function (countryMarker) {
        countryMarker.resourceDataSets.forEach(function (resourceDataSet) {
            if (resourceDataSet.resourceDataSetTitle.includes(resourceType)) {
                countries.push(countryMarker.countryName);
            }
        });
    });
    var dropdownContent = "";
    countries.forEach(function (country) {
        dropdownContent += "<option class='dropdownItem'>" + country + "</option>";
    });
    if (countries.length === 0) {
        dropDown.attr("disabled", true);
    } else {
        dropDown.html(dropdownContent);
        dropDown.attr("disabled", false);
    }
    dropDown.selectpicker("refresh");
}

function handleCountrySelectDropdownChange(countries) {
    if (countries.length === 0) {
        compareGraph.destroy();
    } else {
        var resourceDataSets = [];
        var resourceType = $("#resourceTypeDropdown").find("option:selected").val();
        countries.forEach(function (country) {
            countryMarkers.forEach(function (countryMarker) {
                if (countryMarker.countryName === country) {
                    countryMarker.resourceDataSets.forEach(function (resourceDataSet) {
                        if (resourceDataSet.resourceDataSetTitle.includes(resourceType)) {
                            resourceDataSets.push(resourceDataSet);
                        }
                    });
                }
            });
        });
        fillCompareGraph(resourceDataSets, countries);
    }
}

function fillCompareGraph(resourceDataSets, countryNames) {
    if (compareGraph !== undefined) {
        compareGraph.destroy();
    }
    var labels = [];
    resourceDataSets[0].dataPoints.forEach(function(dataPoint) {
        if (resourceDataSets[0].xAxisName === "Year") {
            var yValue = dataPoint.yValue.substring(0, 4);
        } else {
            var yValue = dataPoint.yValue;
        }
        labels.push(yValue);
    });

    var dataSets = [];
    var i = 0;
    resourceDataSets.forEach(function (resourceDataSet) {
        var values = [];
        var fillColours = [];
        var borderColours = [];
        var normalColour = "#" + intToRGB(hashCode(countryNames[i]));
        var normalColourFill = hexToRgbA(normalColour, 0.6);
        var normalColourBorder = hexToRgbA(normalColour, 1);
        var forecastColour = shadeBlendConvert(0.5, normalColour);
        var forecastColourFill = hexToRgbA(forecastColour, 0.6);
        var forecastColourBorder = hexToRgbA(forecastColour, 1);
        resourceDataSet.dataPoints.forEach(function(dataPoint) {
            values.push(dataPoint.xValue);
            if (!dataPoint.isForecasted) {
                fillColours.push(normalColourFill);
                borderColours.push(normalColourBorder);
            } else {
                fillColours.push(forecastColourFill);
                borderColours.push(forecastColourBorder);
            }
        });

        dataSets.push({
            label: countryNames[i],
            fill: false,
            lineTension: 0.1,
            backgroundColor: fillColours,
            borderColor: borderColours,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: borderColours,
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: borderColours,
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: values,
            spanGaps: false
        });
        i++;
    });

    var chartCtx = $("#compareResourceCanvas");
    compareGraph = new Chart(chartCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: dataSets
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: resourceDataSets[0].yAxisName
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: resourceDataSets[0].xAxisName
                    }
                }]
            },
            legend: {
                onClick: function(event, legendItem) {}
            }
        }
    });
}