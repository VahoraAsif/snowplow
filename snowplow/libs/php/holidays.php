<?php
  ini_set('display_errors', 'On');
  error_reporting(E_ALL);
 $executionStartTime = microtime(true);
 $api_key = '67d7e4c962cf6611600f1e5469275dc4d54edfe6';

 $url = 'https://calendarific.com/api/v2/holidays?'.'&api_key=' . $api_key . '&country='. urlencode($_REQUEST['country']). '&year=2022&type=national';
 

 $ch = curl_init();
 curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);

    curl_close($ch);   
    
    $decode = json_decode($result,true);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode['response'];
    
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output); 

    ?>