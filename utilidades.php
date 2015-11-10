<?php
  class Menu
  {
    function MenuJF ($arr_menu, $no, $idgrupo)
    {
      $str = "";

      foreach ($arr_menu as $val => $menu) {

       if ($menu[2] == $no) {
         $str_add = MenuJF ($arr_menu, $menu[0], $idgrupo);

         if ($str_add != "") {
            $str .= '	      <LI><A href="javascript: mos_ocu(' . "'content" . $menu[0] . "'" . ');">' . "#" . "SUBMENU" . trim($menu[0]) . "#". '</A></LI>' . "";
            $str .= '	      <UL id="content' . $menu[0] . '" style="DISPLAY: none">' . "";
         }
         else
         {
             $str .= '	      <LI><A href="#" Onclick="document.location.href = ' . "'" . '../ctr_sub_menu_dinamico/ctr_sub_menu_dinamico.php?vs_grupo=' . $_SESSION['vs_grupo'] . '&vs_subgrupo=' . $idgrupo  . '&vs_css=' . $_SESSION['vs_css'] . '&vs_cls=' . $_SESSION['vs_cls'] . '&vs_apl=';
             $strmio = '	      <LI><A href="#" Onclick="document.location.href = ' . "'" . '../ctr_sub_menu_dinamico/ctr_sub_menu_dinamico.php?vs_grupo=' . $_SESSION['vs_grupo'] . '&vs_subgrupo=' . $idgrupo  . '&vs_css=' . $_SESSION['vs_css'] . '&vs_cls=' . $_SESSION['vs_cls'] . '&vs_apl=';
             $str .= trim($menu[4]);
             $str .= "'" . '">' . "#" . "SUBMENU"  . trim($menu[0]) . "#" . '</A></LI>' . "";
         }

         $str_add = MenuJF ($arr_menu, $menu[0], $idgrupo);
         $str .= $str_add;

         if ($str_add != "") {
           $str .= '	   </UL>' . "";
         }
       }
      }
      return $str;
    }
    function MenuResult($op,$grupo,$subgrupo,$submenu,$css)
    {
        require_once './db_operation.php'; /* Traemos el archivo para establecer la conexion con la base de mysql */
       //session_start();

        switch ($op) {
            case 1: { //recuperar los grupos de modulos
                    $conecta = new Conexion();
                    $conecta->pconsulta = "SELECT MGRPOS,MGRDS,MGRID,MGRCSS FROM MENU_GRUPO ORDER BY MGRPOS";
                    $result = $conecta->query($conecta->pconsulta);
                    $valid  = "";
                    while ($row = mysql_fetch_array($result))
                    {
                        $posicion    = $row['MGRPOS'];
                        $descripcion = $row['MGRDS'];
                        $menuId      = $row['MGRID'];
                        $menuCSS     = $row['MGRCSS'];
                        $valid .= '<LI id="'.$menuCSS.'">';
                        $valid .= '<A class="0" href="#" Onclick="parent.iframeinf.location.href = \'menu_dinamico_cc_inferior.php?';
                        $valid .= 'vs_grupo='.$menuId;
                        $valid .= '&vs_subgrupo=0&vs_submenu=0&vs_css='.$menuCSS.'\'">'.$descripcion.'</A></LI>';
                    }
                    return $valid;
                    break;
                }
            case 2: { // recuperar el menu de cada grupo
                    $conecta = new Conexion();
                    $conecta->pconsulta = "SELECT grupo, subgrupo, descr_subgrupo, imagen FROM menu
                                           WHERE grupo = $grupo order by pos_menu;";
                    $result = $conecta->query($conecta->pconsulta);
                    $valid  = "";
                    while ($row = mysql_fetch_array($result))
                    {
                        $var_grupo      = $row['grupo'];
                        $var_subgrupo   = $row['subgrupo'];
                        $descr_subgrupo = $row['descr_subgrupo'];
                        $imagen         = $row['imagen'];
                        $valid          .= '<DIV class="clip">';
                        $valid          .= '<img src="public/images/bullets/'.$imagen.'" />';
                        $valid          .= '<H1>'.$descr_subgrupo.'</H1>';
                        $valid          .= $this->SubMenu($var_grupo,$var_subgrupo,0);
                        $valid          .= '</DIV>';
                            //<UL>
                              //  <LI><A href="javascript: mos_ocu('content1');">Listados por Agencia</A></LI>
                               // <UL id="content1" style="DISPLAY: none">
                                 //   <LI><A href="javascript: mos_ocu('content1');">Telefonía2</A></LI>
                                   // <LI><A href="javascript: mos_ocu('content1');">Telefonía3</A></LI>
                                //</UL>
                                //<LI><A href="javascript: mos_ocu('content1');">Listados por Clientes</A></LI>
                            //</UL>
                        //</DIV>;
                    }
                    return $valid;
                    break;
                }
            case 3: {
                    $conecta = new Conexion();
                    $request = trim(strtolower($_REQUEST['username']));
                    $conecta->pconsulta = "SELECT username FROM usuario";
                    $resultado = $conecta->executeQuery();
                    usleep(150000);
                    $valid = 'true';
                    while ($users = mysql_fetch_array($resultado)) {
                        if (strtolower($users['username']) == $request)
                            $valid = '"Este username ya ha sido registrado."';
                    }
                    echo $valid;
                }
            case 4: {
                    $conecta = new Conexion();
                    $request = trim(strtolower($_REQUEST['email']));
                    $conecta->pconsulta = "SELECT email FROM usuario";
                    $resultado = $conecta->executeQuery();
                    usleep(150000);
                    $valid = 'true';
                    while ($emails = mysql_fetch_array($resultado)) {
                        if (strtolower($emails['email']) == $request)
                            $valid = '"Este e-mail ya ha sido registrado."';
                    }
                    echo $valid;
                }
        }
        
    }
    function SubMenu($grupo,$subgrupo,$submenuHref)
    {
        $conecta = new Conexion();
        $conecta->pconsulta = "SELECT cod_grupomenu, cod_subgrupo, cod_submenu, desc_submenu, apl_submenu, pos_submenu,cod_submenuHref
                               FROM submenu
                               WHERE cod_grupomenu = $grupo
                               and cod_subgrupo = $subgrupo
                               and cod_submenuHref = $submenuHref
                               order by pos_submenu";
        $result = $conecta->query($conecta->pconsulta);
        $valid  = "";
        while ($row = mysql_fetch_array($result))
        {
            $var_cod_grupomenu  = $row['cod_grupomenu'];
            $var_cod_subgrupo   = $row['cod_subgrupo'];
            $var_cod_submenu    = $row['cod_submenu'];
            $var_desc_submenu   = $row['desc_submenu'];
            $var_apl_submenu    = trim($row['apl_submenu']);
            $var_pos_submenu    = $row['pos_submenu'];
            $var_cod_submenuHref= $row['cod_submenuHref'];
            $content            = 'content'.$var_cod_grupomenu.$var_cod_subgrupo.$var_cod_submenu;
            $valid          .= '<UL>';
            if($var_apl_submenu <> "" and $var_cod_submenuHref == 0) // NO TIENE SUBMENU
            {                
                $valid .= '<LI><A href="'.$var_apl_submenu.'">'.$var_desc_submenu.'</A></LI>';
            }
            if($var_apl_submenu == "" and $var_cod_submenuHref == 0)// TIENE VARIOS SUBMENU
            {
                $valid .= '<LI><A href="javascript: mos_ocu(\''.$content.'\');">'.$var_desc_submenu.'</A></LI>';
                //$valid .= $this->SubMenu($var_cod_grupomenu, $var_cod_subgrupo,$var_cod_submenuHref);
            }
            if($var_apl_submenu <> "" and $var_cod_submenuHref <> 0)// SUBMENU's
            {
                $valid .= '<LI><A href="javascript: mos_ocu(\''.$content.'\');">'.$var_desc_submenu.'</A></LI>';
            }
            $valid          .= '</UL>';
                //<UL>
                  //  <LI><A href="javascript: mos_ocu('content1');">Listados por Agencia</A></LI>
                   // <UL id="content1" style="DISPLAY: none">
                     //   <LI><A href="javascript: mos_ocu('content1');">Telefonía2</A></LI>
                       // <LI><A href="javascript: mos_ocu('content1');">Telefonía3</A></LI>
                    //</UL>
                    //<LI><A href="javascript: mos_ocu('content1');">Listados por Clientes</A></LI>
                //</UL>
            //</DIV>;
        }
        return $valid;
    }
  }
?>
