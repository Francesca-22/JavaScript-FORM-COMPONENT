<?php
	session_start();

	//imagecreatefrompng :: create a new image 
	//from file or URL
	$img = imagecreatefrompng('captcha.png');
	// Set the background color of image
	$img_background_color = imagecolorallocate($img, 37, 37, 37);
	$img  = imagecreatetruecolor(80,19);
	//displaying the random text on the captcha 
	$numero = rand(1, 9); 
	$numero2 = rand(1, 9);
	
	$_SESSION['check'] = ($numero+$numero2); 
	//The function imagecolorallocate creates a 
	//color using RGB (red,green,blue) format.
	// Fill background with above selected color
	imagefill($img, 0, 0, $img_background_color);
	$white = imagecolorallocate($img, 255, 255, 255); 
	imagestring($img, 8, 8, 1, $numero." + ".$numero2." =", $white);
	header ("Content-type: image/png"); 
	imagepng($img);
?>
