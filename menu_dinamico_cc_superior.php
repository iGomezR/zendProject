<?php
require_once './utilidades.php';
//session_name("sesion");
session_start();
?>
<html>

<!--
1	Administrativo                	1	1	administrativo      	0
2	Operativo                     	2	2	operativo           	0
3	Preferencias                  	3	3	preferencias        	0
4	Mantenimiento                 	4	4	mantenimiento       	0

  foreach ({dts} as $linha) {
    $str_add .= '	<LI id="' . trim($linha[1]) . '"><A class="' . trim($linha[5]) . '" href="#" Onclick="parent.iframeinf.location.href = ' . "'" . '../ctr_menu_dinamico_cc_inf/ctr_menu_dinamico_cc_inf.php?vs_grupo=' . trim($linha[0]) . '&vs_frame=1&vs_subgrupo=0&vs_css=' . trim($linha[4]) . '&vs_cls=' . trim($linha[5]) . "'" . '">' . "#" . trim($linha[1]) . "#" . '</A></LI>' . "
";
  }
  	<LI id="Administrativo"><A class="0" href="#" Onclick="parent.iframeinf.location.href = 'menu_dinamico_cc_inf.hmtl?vs_grupo=1&vs_frame=1&vs_subgrupo=0&vs_css=administrativo&vs_cls=0'">#Administrativo#</A></LI>
-->

	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<title>Sistema de RastreoPY</title>
		<link href="public/css/style.css" rel="stylesheet" type="text/css" />
		<LINK href="public/css/estilo.css" rel="stylesheet" type="text/css" />

		<script src="public/js/script.js" type="text/javascript"></script>
                <script src="public/js/hora2.js" type="text/javascript"></script>
	</head>

	<body onload="mueveReloj(); fechaActual();" background="public/images/backs/back_body_administrativo.jpg">
            <SPAN class=TextBlock id=txtjs style="COLOR: #000000; FONT-FAMILY: ''; BACKGROUND-COLOR: transparent Caption =' ' name=''"></SPAN>
		<DIV id=cabecera>
                        <DIV id=logo>
                            <img src="public/images/logo_sistema.jpg" width="200" height="100" style="opacity:0.8;filter:alpha(opacity=80)" onmouseover="this.style.opacity=1;this.filters.alpha.opacity=100" onmouseout="this.style.opacity=0.8;this.filters.alpha.opacity=80"/>
                        </DIV>
			<DIV id="sup">
			Agencia: <span><?echo $_SESSION['nomAgencia'];?></span> Usuario: <span><?echo $_SESSION['desc_usuario']; ?>
			</DIV>
			<DIV id=baj>
				<UL id=tabs>
					<LI id=fecha>
                                            <font id="fecha_actual"> </font>
                                            <font id="hora"> </font>
                                        </LI>
<!--				$str .= $str_add; -->
<!--
					<LI id="Administrativo"><A class="0" href="#" Onclick= parent.iframeinf.location.href = 'menu_dinamico_cc_inferior.hmtl'>Administrativo</A></LI>
                                        <LI id="Operativo"><A class="0" href="#" Onclick= parent.iframeinf.location.href = 'menu_dinamico_cc_inferior.hmtl'>Tesoreria</A></LI>
                                        <LI id="Preferencias"><A class="0" href="#" Onclick= parent.iframeinf.location.href = 'menu_dinamico_cc_inferior.hmtl'>Contabilidad</A></LI>
                                        <LI id="Mantenimiento"><A class="0" href="#" Onclick= parent.iframeinf.location.href = 'menu_dinamico_cc_inferior.hmtl'>Mantenimiento</A></LI>
					<LI id=salir><A class="" OnClick="javascript:parent.close();" href="javascript:parent.close();">Salir</A></LI>-->
                                        <?php
                                            $menu = new Menu();
                                            $resultado = $menu->MenuResult(1,0,0,0,"");
                                            echo $resultado;
                                            unset($meu);
                                            unset($resultado);
                                        ?>
                                        <LI id=salir><a href="cerrar.php">Salir</a></LI>
                                        <!--
                                        <LI id=ayuda><a class="link" href="#" id="btnHelp" onclick ="javascript: window.open('../NSA2012/documentacion/ManualUsuarioNSA2012-V1.pdf');"><img src="images/iconos/info_icon.png" alt="Ayuda de Usuario" title="Ayuda de Usuario"/></a></LI>
                                        -->
				</UL>
			</DIV>
		</DIV>
		<input type="hidden" id="time" value=" time() ">
	</body>
</html>
