<?php
/*
	unset($_SESSION["usuario"]);
  unset($_SESSION["idusuario"]);
  unset($_SESSION["administrador"]);

	$_SESSION["usuario"] = "";
  $_SESSION["idusuario"] = "";
  $_SESSION["administrador"] = "";
  header("Location : login.php");
  exit;
session_start();
//session_unregister() ;
session_unset();
session_destroy();
header("Location: index.php");
*/


	session_start();
	session_destroy();
	echo '<script>parent.location.href="public/index.php/menus/menu"</script>';

//	header("location:login.php");
?>