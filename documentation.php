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
    if(!isset($_SESSION['UserData']['Username'])){
        session_destroy();
        header("location:login.php");
        exit;
    }
?>
    <div class="admin-container">
        <h1 class="admin-header">How To Use the Admin Console:<h1>
            <p>Docs coming soon</p>
    </div>
    <div style="margin-top: 50px;height:30px;background:#333"></div>
    </body>
</html>