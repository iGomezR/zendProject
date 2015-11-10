<?php

class Administrativo_OrdendeanalisisController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
        $parametrosNamespace->unlock ();
        $parametrosNamespace->parametrosBusqueda = null;
        $parametrosNamespace->cantidadFilas = null;
        $parametrosNamespace->jsGrip = '/js/grillasmodulos/administrativo/gridOrdenDeAnalisis.js';
        $parametrosNamespace->Application_Model_DbTable = "Application_Model_DbTable_Ordendeanalisis";
        $parametrosNamespace->busqueda = "desc_producto";
        $parametrosNamespace->lock ();
    }
    public function creartablasAction()
    {        
        $table = new Zend_ModelCreator('orden_de_analisis','carboneria_gical');
    }
    public function listarAction() {
		$this->_helper->viewRenderer->setNoRender ( true );

		$cantidadFilas = $this->getRequest ()->getParam ( "rows" );
		if (! isset ( $cantidadFilas )) {
			$cantidadFilas = 10;
		}
		$parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		$parametrosNamespace->unlock();
		$parametrosNamespace->cantidadFilas = $cantidadFilas;

		$page = $this->getRequest ()->getParam ( "page" );
		if (! isset ( $page )) {
			$page = 1 ;
		}

		$this->view->headScript ()->appendFile ( $this->view->baseUrl () . '/js/bootstrap.js' );
	 	$this->view->headScript ()->appendFile ( $this->view->baseUrl () . $parametrosNamespace->jsGrip );

                 $db = Zend_Db_Table::getDefaultAdapter();
                $select = $db->select()
                ->from(array('d' => 'orden_de_analisis'), 
                       array(
                            'd.cod_cargamento',
                            'c.cod_proveedor',
                            'c.desc_proveedor',
                            'a.nro_orden_de_entrada',
                            'a.fecha_registro'))
                ->join(array('a' => 'orden_de_entrada'), 'd.cod_cargamento = a.cod_cargamento')
                ->join(array('c' => 'proveedor'), 'c.cod_proveedor = a.cod_proveedor')
                ->group('d.cod_cargamento',
                            'c.cod_proveedor',
                            'c.desc_proveedor',
                            'a.nro_orden_de_entrada',
                            'a.fecha_registro');

  //      die($select);
                $result = $db->fetchAll($select);
        
		$parametrosNamespace->lock();
                $pagina = self::obtenerPaginas($result,$cantidadFilas,$page);
		echo $this->_helper->json ( $pagina );
	}
        
	private function obtenerPaginas($result,$cantidadFilas,$page){
		$this->_paginator = Zend_Paginator::factory ($result);
	 	$this->_paginator->setItemCountPerPage ( $cantidadFilas );
	 	$this->_paginator->setCurrentPageNumber($page);
		$pagina ['rows'] = array ();
		foreach ( $this->_paginator as $item ) {    
                    $arrayDatos ['cell'] = array(
                        $item["cod_cargamento"],
                        null,
                        $item["nro_orden_de_entrada"],
                        trim(utf8_encode($item["desc_proveedor"])),
                        $item["fecha_registro"],
                        $item["cod_proveedor"]
                            );

                    $arrayDatos ['columns'] = array(
                        "id",
                        "modificar",
                        "nro_orden_de_entrada",
                        "desc_proveedor",
                        "fecha_registro",
                        "cod_proveedor"
                        );
                    array_push ( $pagina ['rows'],$arrayDatos);
		}
		$pagina ['records'] = count ( $result );
		$pagina ['page'] = $page;
		$pagina ['total'] = ceil ( $pagina ['records'] / $cantidadFilas );

		if($pagina['records'] == 0){
			$pagina ['mensajeSinFilas'] = true;
		}

		$parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		$parametrosNamespace->unlock ();
		$parametrosNamespace->listadoImpuestos = $pagina ['rows'];
		$parametrosNamespace->lock ();

		return $pagina;
	}

    public function buscarAction(){
        $this->_helper->viewRenderer->setNoRender ( true );

        $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
        $parametrosNamespace->unlock ();

        $cantidadFilas = $this->getRequest ()->getParam ( "rows" );
        if (! isset ( $cantidadFilas )) {
                $cantidadFilas = $parametrosNamespace->cantidadFilas;
        }
        $page = $this->getRequest ()->getParam ( "page" );
        if (! isset ( $page )) {
                $page = 1 ;
        }

        $json_rowData = $this->getRequest ()->getParam ("data");
        $rowData = json_decode($json_rowData);

        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
        ->from(array('d' => 'orden_de_analisis'), 
               array(
                    'd.id_orden_de_analisis',
                    'd.cod_cargamento',
                    'd.clave_parametro',
                    'd.resultado_analisis',
                    'd.cod_proveedor',
                    'c.desc_proveedor',
                    'a.nro_orden_de_entrada'))
        ->join(array('a' => 'orden_de_entrada'), 'd.cod_cargamento = a.cod_cargamento')
        ->join(array('c' => 'proveedor'), 'c.cod_proveedor = a.cod_proveedor');              
        if($rowData->descripcion != null){
                $select->where("UPPER($parametrosNamespace->busqueda) like '%".strtoupper(trim($rowData->descripcion))."%'");
        }
         $result = $db->fetchAll($select);
        

        $parametrosNamespace->parametrosBusqueda = $where;
        $parametrosNamespace->lock ();
       
        $pagina = self::obtenerPaginas($result,$cantidadFilas,$page);
        $jsondata = $this->_helper->json ( $pagina );
        echo $jsondata;
    }

    public function eliminarAction(){
		$this->_helper->viewRenderer->setNoRender ( true );
		$id = $this->getRequest ()->getParam ( "id" );           
                $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		try{
                    $db = Zend_Db_Table::getDefaultAdapter();
                    $db->beginTransaction();
                    $servCon = new Application_Model_DataService($parametrosNamespace->Application_Model_DbTable);
                    $servCon->deleteRowById(array("id_orden_de_analisis"=>$id));
                    $db->commit();
		    echo json_encode(array("result" => "EXITO"));
	    }catch( Exception $e ) {
	    	echo json_encode(array("result" => "ERROR","mensaje"=>$e->getCode()));
		$db->rollBack();
            }
	}

	public function guardarAction(){
            $this->_helper->viewRenderer->setNoRender ( true );
            $json_rowData = $this->getRequest ()->getParam ( "parametros" );
            $rowData = json_decode($json_rowData);
            $applicationModel = new Application_Model_Ordendeanalisis();
            self::almacenardatos($applicationModel,$rowData);
            //self::almacenardatos($rowData);
	}

	public function modificarAction(){
            $this->_helper->viewRenderer->setNoRender ( true );
            $json_rowData = $this->getRequest ()->getParam ( "parametros" );
            $rowData = json_decode($json_rowData);
            $rowClass = new Application_Model_Producto();
		if($rowData->codigo != null){
                    $rowClass->setId_orden_de_analisis($rowData->codigo);
		}
            self::almacenardatos($rowClass,$rowData);
	}

        public function almacenardatos($rowClass,$rowData){
     	try{                
                $db = Zend_Db_Table::getDefaultAdapter();
        	$db->beginTransaction();
                $service = new Application_Model_DataService('Application_Model_DbTable_Ordendeanalisis');
                foreach ($rowData->detalles as $row){                   
                    $rowClass->setCod_cargamento($row->cod_cargamento);
                    $rowClass->setClave_parametro($row->clave_parametro);
                    $rowClass->setResultado_analisis($row->resultado_analisis);
                    $result = $service->saveRow($rowClass); 
                }
	    	$db->commit();
                unset($service);
                unset($rowClass);                
	    	echo json_encode(array("result" => "EXITO"));
        }catch( Exception $e ) {
	    	echo json_encode(array("result" => "ERROR","mensaje"=>$e->getMessage()));
		$db->rollBack();
	}
    }

    public function sucursaldataAction() {
        $this->_helper->viewRenderer->setNoRender ( true );
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                 ->from(array('A' => 'sucursal'), array('distinct(A.cod_sucursal)', 'A.desc_sucursal'))
                 ->order(array('A.desc_sucursal'));        
        $result = $db->fetchAll($select);
        $htmlResult = '<option value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
             $htmlResult .= '<option value="'.$arr["cod_sucursal"].'">' .trim(utf8_decode($arr["desc_sucursal"])).'</option>';	
        }
        echo  $htmlResult;
    } 
    public function parametrosdataAction() {   
        $this->_helper->viewRenderer->setNoRender ( true );
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                 ->from(array('A' => 'parametros'), array('distinct(A.clave_parametro)','cod_parametro'))
                 ->where(" valor_parametro = 'A'")
                 ->order(array('A.clave_parametro'));        
        $result = $db->fetchAll($select);
        $htmlResult = '<option value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
             $htmlResult .= '<option value="'.$arr["cod_parametro"].'">' .trim(utf8_decode($arr["clave_parametro"])).'</option>';	
        }
        echo  $htmlResult;
 } 
    public function productodataAction() {
//        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                ->from(array('g' => 'producto'))
                ->order(array('g.desc_producto')
        );
        $result = $db->fetchAll($select);

        echo json_encode($result);
    } 
    
    public function modaleditarAction() {
//        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);

        $getNumeroInterno = json_decode($this->getRequest()->getParam("NumeroInterno"));
//        $getNumeroInterno = trim($NumeroInterno["NumeroInterno"]);

        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                ->from(array('A' => 'orden_de_analisis'), array('A.id_orden_de_analisis',
                    'A.cod_cargamento',
                    'PAR.clave_parametro as desc_clave_parametro',
                    'A.clave_parametro',
                    'A.resultado_analisis'))
                ->join(array('PAR' => 'parametros'), 'A.clave_parametro = PAR.cod_parametro')
                ->where("A.cod_cargamento = ?", $getNumeroInterno);       
//        print_r($select);
//        die();
        $result = $db->fetchAll($select);
        $option = array();
        foreach ($result as $value) {
            $id_orden_de_analisis = $value ['id_orden_de_analisis'];
            $cod_cargamento = $value ['cod_cargamento'];
            $desc_clave_parametro = $value ['desc_clave_parametro'];
            $clave_parametro = $value['clave_parametro'];
            $resultado_analisis = $value['resultado_analisis'];
                        
            $option1 = array("id_orden_de_analisis" => $id_orden_de_analisis, 
                "cod_cargamento" => $cod_cargamento, 
                "desc_clave_parametro" => $desc_clave_parametro,
                "clave_parametro" => $clave_parametro, 
                "resultado_analisis" => $resultado_analisis);
            array_push($option, $option1);
        }

        echo json_encode($option);
    }    
    public function cargamentopendientesdeanalisisdataAction() {
//        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $sql = 'SELECT a.nro_orden_de_entrada,cod_cargamento FROM carboneria_gical.orden_de_entrada a
                where not exists(select * from carboneria_gical.orden_de_analisis b
                where b.cod_cargamento = a.cod_cargamento)
                order by a.cod_cargamento';
        $db = Zend_Db_Table::getDefaultAdapter();
        $result = $db->fetchAll($sql);
//        Zend_Debug::dump($result);
        $htmlResult = '<option value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
             $htmlResult .= '<option value="'.$arr["cod_cargamento"].'">' .trim(utf8_decode($arr["nro_orden_de_entrada"])).'</option>';	
        }
        echo  $htmlResult;
    }
    public function cargamentoprocesadodeanalisisdataAction() {
//        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $sql = 'SELECT a.nro_orden_de_entrada,cod_cargamento FROM carboneria_gical.orden_de_entrada a
                where exists(select * from carboneria_gical.orden_de_analisis b
                where b.cod_cargamento = a.cod_cargamento)
                order by a.cod_cargamento';
        $db = Zend_Db_Table::getDefaultAdapter();
        $result = $db->fetchAll($sql);
//        Zend_Debug::dump($result);
        $htmlResult = '<option value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
             $htmlResult .= '<option value="'.$arr["cod_cargamento"].'">' .trim(utf8_decode($arr["nro_orden_de_entrada"])).'</option>';	
        }
        echo  $htmlResult;
    }    
    public function ordendeentradadataAction() {
//        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $json_rowData = $this->getRequest ()->getParam ( "parametros" );
        $rowData = json_decode($json_rowData);          
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
        ->from(array('d' => 'orden_de_entrada'), 
               array(
                    'd.cod_proveedor',
                    'd.cod_usuario_analista',
                    'd.fecha_registro',
                    'a.desc_proveedor',
                    'c.usuario'))
        ->join(array('a' => 'proveedor'), 'd.cod_proveedor = a.cod_proveedor')
        ->join(array('c' => 'usuarios'), 'd.cod_usuario_analista = c.codigo')
        ->where(" cod_cargamento = ".$rowData->cod_cargamento);
//        die($select);
        $result = $db->fetchAll($select);
        $option = array();
        foreach ($result as $value) {
            $cod_proveedor = ($value ['cod_proveedor']);
            $cod_usuario_analista = $value ['cod_usuario_analista'];
            $fecha_registro = $value ['fecha_registro'];
            $desc_proveedor = $value ['desc_proveedor'];
            $usuario = $value ['usuario'];
            $option = array("cod_proveedor" => $cod_proveedor, "cod_usuario_analista" => $cod_usuario_analista, 
                "fecha_registro" => $fecha_registro,"desc_proveedor" => $desc_proveedor,"desc_usuario_analista" => $usuario);
        }
//        echo $option;
        echo json_encode($option);
    }     
}

