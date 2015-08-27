<?php
class LNF{
    private $baseUrl = 'http://ssel-apps.eecs.umich.edu/api/';
    private $cookieName = 'sselAuth_cookie';
    
    function getToolList(){
        return $this->apiCall("scheduler/resource-info?IsActive=true");
    }
    
    function getResource($id){
        return $this->apiCall("scheduler/resource?id=$id", true);
    }
    
    function authCheck(){
        return $this->apiCall("authcheck", true);
    }
    
    private function apiCall($path, $authorize = false){
        $context = null;
        
        if ($authorize){
            if(isset($_COOKIE[$this->cookieName])){
                $context = stream_context_create(array(
                    'http' => array(
                        'header'  => "Authorization: Forms ".$_COOKIE[$this->cookieName]
                    )
                ));
            }
        }
        
        $json = @file_get_contents($this->baseUrl.$path, false, $context);
        
        return json_decode($json);
    }
}