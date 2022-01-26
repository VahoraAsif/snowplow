<?php

$executionStartTime = microtime(true) / 1000;

$result = file_get_contents('../geoJSON/countryBorders.geo.json');

$decode = json_decode($result,true);

$name=array();
$iso_a2=array();

foreach($decode["features"] as $row){
    $name[] = $row['properties']['name'];
    $iso_a2[] = $row['properties']['iso_a2']; 
    }
$dropDown = array_combine($name, $iso_a2);





$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $dropDown;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>
