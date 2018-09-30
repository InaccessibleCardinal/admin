<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Martin Integrated - Admin Console</title>
        <link href="../css/reset.css" rel="stylesheet" type="text/css">
        <link href="css/login-style.css" rel="stylesheet" type="text/css">
        <link rel="stylesheet" type="text/css" media="screen" href="css/main.css" />
    </head>
    <body>
<?php include 'partials/header.php'?>
<?php 
    session_start();
    $_SESSION['timestamp'] = time();
    if(!isset($_SESSION['UserData']['Username'])){
        session_destroy();
        header("location:login.php");
        exit;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($data['destroy']) {
        
        session_destroy();
        header("location:login.php");
        exit;
    }
?>
        <div class="logout-link-container">
            <a href="logout.php" class="logout-link" id="logout-link">Logout</a>
            <span class="pipe">|</span>
            <a href="documentation.php" target="_blank" class="logout-link">How To Use This App</a>
        </div>
        <div>
            <div id="target" class="job-list-wrapper"></div>
            <div class="button">
                <button id="edit" class="edit">Edit Existing Jobs?</button>
            </div>
            <div id="add-job-form" class="add-job-form"></div>
            <div id="save-button-container" class="save-button-container"></div>  
        </div>
        <script>
        'use strict';
        if (typeof Worker !== 'undefined') {
            let w = new Worker('js/redirectSW.js');
            w.onmessage = function(e) {
                window.location = 'http://localhost/martin-integrated/admin/login.php';
            }
            window.addEventListener('click', function(e) {
                let link = document.getElementById('logout-link');
                if (e.target !== link) {
                    w.postMessage('restart');
                } else {
                    w.terminate();
                }
            });
        }
        
        </script>
        <script src="js/main.js"></script>
    </body>
</html>