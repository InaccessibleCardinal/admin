<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Martin Integrated - Admin Console</title>
        <link href="../css/reset.css" rel="stylesheet" type="text/css">
        <link href="css/login-style.css" rel="stylesheet" type="text/css">
    </head>
<body>
<?php include 'partials/header.php'?>
<?php 
    session_start();
    /* Check Login form submitted */
    if(isset($_POST['Submit'])){
    
        $logins = array('person@website.com' => 'admin');
    /* Check and assign submitted Username and Password to new variable */
        $Username = isset($_POST['username']) ? $_POST['username'] : '';
        $Password = isset($_POST['password']) ? $_POST['password'] : '';

    /* Check Username and Password existence in defined array */
    if (isset($logins[$Username]) && $logins[$Username] == $Password){
    /* Success: Set session variables and redirect to Protected page  */
        $_SESSION['UserData']['Username']=$logins[$Username];
        header("location:index.php");
        exit;   
    } else {
        /*Error message */    
        $msg="<span class='login-error-message'>Invalid Login Credentials</span>";
        }
    }
?>
<?php
    $whitelist = array(
        '192.168.1.17', 
        '::1',
        '76.184.192.93'
    );
    $lockoutHtml = '<div class="message-404"><h1>' .
    'Sorry, this webpage is unavailable.</h1></div>';

    if (!in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
        die($lockoutHtml);
    }  
?>
<div class="login-wrapper">
    <form action="" method="post" name="Login_Form">
        <?php if(isset($msg)){?>
        <div>
            <?php echo $msg;?>
        </div>
        <?php } ?>
        <div>
            <h1 class="login-headline">Admin Console</h1>
        </div>
        <div>
            <label class="login-label">Username: </label>
            <input name="username" type="text" class="login-input">   
            <label class="login-label">Password: </label>
            <input name="password" type="password" class="login-input">
            <div class="login-button-container">
                <input name="Submit" type="submit" value="Login" class="login-button">
            </div>
        </div>
    </form>
</div>
</body>
</html>