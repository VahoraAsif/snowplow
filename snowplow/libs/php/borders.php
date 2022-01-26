<?php
 
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
 
    $executionStartTime = microtime(true);
    
    $file = file_get_contents("../geoJSON/countryBorders.geo.json");
    $decode  = json_decode($file,true); 
 
    $country = $_REQUEST['iso_a2'];

   
    foreach($decode["features"] as $row){
        if($row['properties']["iso_a2"] == $country){ 
            
            $result = $row;
            break;
        }
    }
   
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']=  $result;
    
   
   
    
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 

?>

