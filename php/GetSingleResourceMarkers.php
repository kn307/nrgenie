<?php
require "DBAccess.php";
header('Content-Type: application/json');
echo json_encode(getSingleResourceMarkers());