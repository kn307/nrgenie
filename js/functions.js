var mymap;

function generateMarkers() {
    var marker = L.marker([51.5, -0.09]).addTo(mymap);
    //marker.bindTooltip("UK data for 6 resources:</br><ul><li>Coal (1000 data points)</li><li>Solar (2000 data points)</li></ul>");
    marker.bindPopup("<div><canvas id='myChart' width='400' height='400'></canvas></div>");
    mymap.on("popupopen", function(e) {
        var chartCtx = $("#myChart");
        var myChart = new Chart(chartCtx, {
            type: "bar",
            data: {
                labels: ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013"],
                datasets: [
                    {
                        label: "# of Wind Turbines",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
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
                        data: [38, 44, 63, 80, 105, 150, 179, 222],
                        spanGaps: false,
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
                }
            }
        });
    });
}

function createPopupContent() {
    var html = "<canvas id='myChart' width='400' height='400'></canvas>";

}