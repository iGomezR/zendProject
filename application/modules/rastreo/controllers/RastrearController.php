<?php
//llamada al controller compra
//http://infocomedor/compras/compra?userSession=fede&sucursalSession=1&codUsuarioSession=1&monedaSession=1#
class Menus_MenuController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        
    }
    public function sucursaldataAction() {
        $this->_helper->viewRenderer->setNoRender ( true );
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                 ->from(array('C' => 'sucursal'), array('distinct(C.cod_sucursal)', 'C.desc_sucursal'))
                 ->order(array('C.desc_sucursal'));
        $result = $db->fetchAll($select);
        $htmlResult = '<option style="size: 30px" value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
             $htmlResult .= '<option style="size: 30px" value="'.$arr["cod_sucursal"].'">' .trim(utf8_encode($arr["desc_sucursal"])).'</option>';	
        }
        echo  $htmlResult;
     }	
       
    public function usuariodataAction(){
        $this->_helper->viewRenderer->setNoRender ( true );
        $json_rowData = $this->getRequest ()->getParam ("parametros");
        $json_rowData = str_replace("\\", '', $json_rowData);	
        //$json_rowData = '{"username":"ghghhg","password":"sddsd","SelecAgencia":"1"}';
        $rowData = json_decode($json_rowData);
        $where =null;
        $where.="UPPER(USER) = '".strtoupper(trim($rowData->username))."'";
        $where.="password = '".trim($rowData->password)."'";
        $db = Zend_Db_Table::getDefaultAdapter();
        $htmlResult['resultado'] = '-1';
        $select = $db->select()
                 ->from(array('C' => 'usuarios'), array('C.CODIGO','C.USUARIO','A.COD_SUCURSAL','A.DESC_SUCURSAL'))
                 ->join(array( 'A' =>  'sucursal' ), 'C.COD_SUCURSAL = A.COD_SUCURSAL')
                 ->where(" UPPER(USER) = '".strtoupper(trim($rowData->username))."'")
                 ->where("password = '".trim($rowData->password)."'")
                 ->where("A.cod_sucursal = ".trim($rowData->SelecAgencia));
//echo $select;die();        
        $result = $db->fetchAll($select);
        $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
        $parametrosNamespace->unlock ();        
        foreach ($result as $arr) {                         
            $htmlResult['resultado'] = trim(utf8_encode($arr["CODIGO"]));   
          //  session_name("sesion");
            //session_start();
//echo 'usuario : '.$arr["USUARIO"].' sucursal : '.$arr["DESC_SUCURSAL"].'<br>';           
            $_SESSION['username'] = trim($rowData->username);
            $_SESSION['cod_usuario'] = trim(utf8_encode($arr["CODIGO"]));
            $_SESSION['desc_usuario'] = trim(utf8_encode($arr["USUARIO"]));
            $_SESSION['codAgencia'] = trim(utf8_encode($arr["COD_SUCURSAL"]));
            $_SESSION['nomAgencia'] = trim(utf8_encode($arr["DESC_SUCURSAL"]));
//echo 'usuario secion: '.$_SESSION['desc_usuario'].' sucursal secion: '.$_SESSION['nomAgencia'].'<br>'; 
            $parametrosNamespace->username = trim($rowData->username);
            $parametrosNamespace->cod_usuario = trim(utf8_encode($arr["CODIGO"]));
            $parametrosNamespace->desc_usuario = trim(utf8_encode($arr["USUARIO"]));
            $parametrosNamespace->codAgencia = trim(utf8_encode($arr["COD_SUCURSAL"]));
            $parametrosNamespace->nomAgencia = trim(utf8_encode($arr["DESC_SUCURSAL"]));            
        }
        $parametrosNamespace->lock ();                       
        echo $this->_helper->json ( $htmlResult);
    }  
}
