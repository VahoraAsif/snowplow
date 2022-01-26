 <?php
 
 ini_set('display_errors', 'On');
 error_reporting(E_ALL);

 $executionStartTime = microtime(true);
 $url = "https://corona-api.com/countries"; 

 
 $file = file_get_contents($url);
 $decode  = json_decode($file,true); 

 $code = $_REQUEST['code'];

 $result=array();
 foreach($decode['data'] as $row){
     if($row['code'] == $code){ 
     
         $result[] = $row;
        
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