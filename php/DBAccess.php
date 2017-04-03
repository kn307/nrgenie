<?php
require "dataModel/CountryMarker.php";
require "dataModel/SingleResourceMarker.php";
require "dataModel/ResourceDataSet.php";
require "dataModel/DataPoint.php";

define("SERVERNAME", "wad-db.cz9bxvxkh5xg.eu-west-1.rds.amazonaws.com");
define("DBUSERNAME", "mj468");
define("PASSWORD", "dbw4d6102");
define("SCHEMA", "NR_GENIE");

function getConnection()
{
    // Create connection
    $connection = mysqli_connect(SERVERNAME, DBUSERNAME, PASSWORD, SCHEMA);

    // Check connection
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }

    return $connection;
}

function getCountryMarkers() {
    $connection = getConnection();

    if (!($statement = $connection->prepare("SELECT * FROM CountryMarker"))) {
        echo "Prepare failed: (" . $connection->errno . ") " . $connection->error;
    }
    if (!$statement->execute()) {
        echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
    }

    $result = $statement->get_result();
    $countryMarkers = [];
    populateCountryMarkerList($countryMarkers, $result);

    foreach ($countryMarkers as $countryMarker) {
        if (!($statement = $connection->prepare("SELECT * FROM ResourceDataSet WHERE CountryMarkerID = (?)"))) {
            echo "Prepare failed: (" . $connection->errno . ") " . $connection->error;
        }
        if (!$statement->bind_param("i", $countryMarker->countryMarkerID)) {
            echo "Binding parameters failed: (" . $statement->errno . ") " . $statement->error;
        }
        if (!$statement->execute()) {
            echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
        }

        $dataSetsResult = $statement->get_result();
        $countryMarker->resourceDataSets = [];
        populateResourceDataSetList($countryMarker->resourceDataSets, $dataSetsResult);

        foreach ($countryMarker->resourceDataSets as $resourceDataSet) {
            if (!($statement = $connection->prepare("SELECT * FROM DataPoint WHERE ResourceDataSetID = (?)"))) {
                echo "Prepare failed: (" . $connection->errno . ") " . $connection->error;
            }
            if (!$statement->bind_param("i", $resourceDataSet->resourceDataSetID)) {
                echo "Binding parameters failed: (" . $statement->errno . ") " . $statement->error;
            }
            if (!$statement->execute()) {
                echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
            }

            $dataPointsResult = $statement->get_result();
            $resourceDataSet->dataPoints = [];
            populateResourceDataPoints($resourceDataSet, $dataPointsResult);
        }
    }

    $statement->close();
    $connection->close();
    return $countryMarkers;
}

function getSingleResourceMarkers() {
    $connection = getConnection();

    if (!($statement = $connection->prepare("SELECT srm.ResourceType, srm.CityName, srm.Longitude, srm.Latitude, srm.Description, rds.* FROM SingleResourceMarker srm JOIN ResourceDataSet rds ON srm.SingleResourceMarkerID = rds.SingleResourceMarkerID"))) {
        echo "Prepare failed: (" . $connection->errno . ") " . $connection->error;
    }
    if (!$statement->execute()) {
        echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
    }

    $result = $statement->get_result();
   // return $result->fetch_assoc();
    $singleResourceMarkers = [];
    populateSingleResourceMarkerList($singleResourceMarkers, $result);

    foreach ($singleResourceMarkers as $singleResourceMarker) {
        if (!($statement = $connection->prepare("SELECT * FROM DataPoint WHERE ResourceDataSetID = (?)"))) {
            echo "Prepare failed: (" . $connection->errno . ") " . $connection->error;
        }
        if (!$statement->bind_param("i", $singleResourceMarker->resourceDataSet->resourceDataSetID)) {
            echo "Binding parameters failed: (" . $statement->errno . ") " . $statement->error;
        }
        if (!$statement->execute()) {
            echo "Execute failed: (" . $statement->errno . ") " . $statement->error;
        }

        $dataPointsResult = $statement->get_result();
        $singleResourceMarker->resourceDataSet->dataPoints = [];
        populateResourceDataPoints($singleResourceMarker->resourceDataSet, $dataPointsResult);
    }

    $statement->close();
    $connection->close();
    return $singleResourceMarkers;
}

function populateCountryMarkerList(&$countryMarkersList, &$queryResult) {
    // Create an object for each result and copy in the details
    while ($row = $queryResult->fetch_assoc()) {
        $countryMarker = new CountryMarker();
        $countryMarker->countryMarkerID = $row['CountryMarkerID'];
        $countryMarker->countryName = $row['CountryName'];
        $countryMarker->latitude = $row['Latitude'];
        $countryMarker->longitude = $row['Longitude'];

        array_push($countryMarkersList, $countryMarker);
    }
}

function populateResourceDataSetList(&$resourceDataSetList, &$queryResult) {
    // Create an object for each result and copy in the details
    while ($row = $queryResult->fetch_assoc()) {
        $resourceDataSet = new ResourceDataSet();
        $resourceDataSet->resourceDataSetID = $row['ResourceDataSetID'];
        $resourceDataSet->resourceDataSetTitle = $row['ResourceDataSetTitle'];
        $resourceDataSet->xAxisName = $row['XAxisName'];
        $resourceDataSet->yAxisName = $row['YAxisName'];

        array_push($resourceDataSetList, $resourceDataSet);
    }
}

function populateSingleResourceMarkerList(&$singleResourceMarkersList, &$queryResult) {
    // Create an object for each result and copy in the details
    while ($row = $queryResult->fetch_assoc()) {

        $singleResourceMarker = new SingleResourceMarker();
        $singleResourceMarker->resourceType = $row['ResourceType'];
        $singleResourceMarker->cityName = $row['CityName'];
        $singleResourceMarker->latitude = $row['Latitude'];
        $singleResourceMarker->longitude = $row['Longitude'];
        $singleResourceMarker->description = $row['Description'];
        $singleResourceMarker->resourceDataSet = new ResourceDataSet();
    $singleResourceMarker->resourceDataSet->resourceDataSetID = $row['ResourceDataSetID'];
        $singleResourceMarker->resourceDataSet->resourceDataSetTitle = $row['ResourceDataSetTitle'];
        $singleResourceMarker->resourceDataSet->xAxisName = $row['XAxisName'];
        $singleResourceMarker->resourceDataSet->yAxisName = $row['YAxisName'];

        array_push($singleResourceMarkersList, $singleResourceMarker);
    }
}

function populateResourceDataPoints(&$resourceDataSet, &$queryResult) {
    // Create an object for each result and copy in the details
    while ($row = $queryResult->fetch_assoc()) {
        $dataPoint = new DataPoint();
        $dataPoint->xValue = $row['XValue'];
        $dataPoint->yValue = $row['YValue'];
        $dataPoint->isForecasted = $row['IsForecasted'];

        array_push($resourceDataSet->dataPoints, $dataPoint);
    }
}