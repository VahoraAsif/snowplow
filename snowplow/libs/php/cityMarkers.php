<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
 $executionStartTime = microtime(true);

 $url = "http://api.geonames.org/searchJSON?country=". $_REQUEST['country'] ."&maxRows=15&username=mahhamadaasif";
 $ch = curl_init();
 curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 curl_setopt($ch, CURLOPT_URL,$url);
 $result=curl_exec($ch);
 curl_close($ch);   
 $decode = json_decode($result,true);

 $name = array();
  foreach($decode['geonames'] as $row) {
     if($row['fclName'] === "city, village,...") {
         $name[] = $row;
     }
 }
 

 

 $output['status']['code'] = "200";
 $output['status']['name'] = "ok";
 $output['status']['description'] = "success";
 $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
 $output['data']= $name;
 header('Content-Type: application/json; charset=UTF-8');
 echo json_encode($output);
 

 ?>