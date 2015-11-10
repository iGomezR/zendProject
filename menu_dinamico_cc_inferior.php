<?php
 require_once './utilidades.php';
 session_start();
 if (isset($_GET['vs_grupo']))
     $grupo = $_GET['vs_grupo'];
 else
     $grupo = 1;
 if (isset($_GET['vs_subgrupo']))
     $subgrupo = $_GET['vs_subgrupo'];
 else $subgrupo = 0;
 if (isset($_GET['vs_submenu']))
     $submenu = $_GET['vs_submenu'];
 else $submenu = 0;
 if (isset($_GET['vs_css']))
     $css = $_GET['vs_css'];
 else
     $css = "administrativo";
?>
<HTML>
	<HEAD>
	<title>Crazy Design</title>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<LINK href="public/css/estilo.css" rel="stylesheet" type="text/css" />
                <LINK id= "lkestilo" href="public/css/<?php echo $css ?>.css" rel="stylesheet" type="text/css" />
                <SCRIPT src="public/js/script.js" type="text/javascript"> </SCRIPT>
                <SCRIPT src="public/js/hora.js" type="text/javascript">  </SCRIPT>
	</HEAD>

	<BODY onload="UR_Start()" background="public/images/backs/back_body_administrativo.jpg">
		<DIV id="contenido">
                    <DIV class="columna">
                        <!--
                        <DIV class="clip">
                            <img src="_menu/images/bullets/bullet_informes_gerenciales.jpg" />
                            <H1>Informes Gerenciales</H1>
                            <UL>
                                <LI><A href="javascript: mos_ocu('content1');">Listados por Agencia</A></LI>
                                <UL id="content1" style="DISPLAY: none">
                                    <LI><A href="javascript: mos_ocu('content1');">Telefonía2</A></LI>
                                    <LI><A href="javascript: mos_ocu('content1');">Telefonía3</A></LI>
                                </UL>
                                <LI><A href="javascript: mos_ocu('content1');">Listados por Clientes</A></LI>
                            </UL>
                        </DIV>
                        <DIV class="clip">
                            <img src="_menu/images/bullets/bullet_ventas.jpg" />
                            <H1>Catastro Agencia</H1>
                            <ul>
                                <LI><A href="javascript: mos_ocu('content1');">Agencia</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Barrio</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Ciudad</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Division Politica</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Pais</A></LI>
                            </ul>
                        </DIV>
                        <DIV class="clip">
                            <img src="_menu/images/bullets/bullet_clientes.jpg" />
                            <H1>Clientes</H1>
                            <ul>
                                <LI><A href="javascript: mos_ocu('content1');">Alta Cliente</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Documento Cliente</A></LI>
                            </ul>
                        </DIV>
                        <DIV class="clip">
                            <img src="_menu/images/bullets/bullet_facturacion.jpg" />
                            <H1>Envio y Entrega</H1>
                            <UL>
                                <LI><A href="javascript: mos_ocu('content1');">Envio</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Anulacion de Envio</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Entrega</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Anulacion de Entrega</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Movimiento de Caja</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Alta Caja Empleado</A></LI>
                            </UL>
                        </DIV>
                        <DIV class="clip">
                            <img src="_menu/images/bullets/bullet_cobranzas.jpg" />
                            <H1>Parametricos</H1>
                            <ul>
                                <LI><A href="javascript: mos_ocu('content1');">Moneda</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Grupo Servicio Encomiendas</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Servicio Encomiendas</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Subdivision</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Tipo Documento</A></LI>
                            </ul>
                        </DIV>
                        <DIV class="clip">
                            <img src="_menu/images/bullets/bullet_informes_gerenciales.jpg" />
                            <H1>Usuarios</H1>
                            <ul>
                                <LI><A href="javascript: mos_ocu('content1');">Usuario</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Empleado</A></LI>
                                <LI><A href="javascript: mos_ocu('content1');">Usuario Agencia</A></LI>
                            </ul>
                        </DIV>
                        -->
                        <?php
                            $op = 2;
                            $menu = new Menu();
                            $resultado = $menu->MenuResult($op,$grupo,$subgrupo,$submenu,$css);
                            echo $resultado;
                            unset($meu);
                            unset($resultado);
                        ?>
                    </DIV>
                </DIV>
        </BODY>
</HTML>
