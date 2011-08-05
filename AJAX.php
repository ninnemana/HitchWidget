<?php
header('Content-Type: application/javascript; charset=utf-8');
switch ($_GET['action']) {
    case 'GetMake':
        $year = urlencode($_GET['year']);
        $url = 'http://api.curthitch.biz/AJAX.aspx?action=GetMake&year='.$year.'&dataType=JSON';
        $ch = curl_init();
        $timeout = 15;
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
        $data = curl_exec($ch);
        curl_close($ch);

        print sprintf('%s(%s);', handleMake, $data);
        break;
    
    case 'GetModel':
        $year = urlencode($_POST['year']);
        $make = urlencode($_POST['make']);
        $url = 'http://api.curthitch.biz/AJAX.aspx?action=GetModel&year='.$year.'&make='.$make.'&dataType=JSON';
        $ch = curl_init();
        $timeout = 15;
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
        $data = curl_exec($ch);
        curl_close($ch);
        print sprintf('%s(%s);', handleModel, $data);
        
        break;
        
    case 'GetStyle':
        $year = urlencode($_POST['year']);
        $make = urlencode($_POST['make']);
        $model = urlencode($_POST['model']);
        $url = 'http://api.curthitch.biz/AJAX.aspx?action=GetStyle&year='.$year.'&make='.$make.'&model='.$model.'&dataType=JSON';
        $ch = curl_init();
        $timeout = 15;
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
        $data = curl_exec($ch);
        curl_close($ch);
        echo $data;
        
        break;
    
    default:
        break;
}
?>
