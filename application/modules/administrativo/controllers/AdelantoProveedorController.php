<?php

class Administrativo_AdelantoproveedorController extends Zend_Controller_Action
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
        $parametrosNamespace->jsGrip = '/js/grillasmodulos/administrativo/gridAdelantoProveedor.js';
        $parametrosNamespace->Application_Model_DbTable = "Application_Model_DbTable_Adelantoproveedor";
        $parametrosNamespace->busqueda = array('desc_proveedor');
        $parametrosNamespace->lock ();
    }
    public function creartablasAction()
    {        
        $table = new Zend_ModelCreator('adelanto_proveedor','carboneria_gical');
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
                ->from(array('d' => 'adelanto_proveedor'), 
                       array(
                            'd.cod_adelanto',
                            'd.cod_proveedor',
                            'd.fecha_adelanto',
                            'd.monto_adelanto',
                            'd.estado_adelanto',
                            'a.desc_proveedor'))
                ->join(array('a' => 'proveedor'), 'd.cod_proveedor = a.cod_proveedor');
//        die($select);
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
                    if($item["estado_adelanto"] == 'P')
                        $estado_adelanto = 'Pendiente';
                    else
                        $estado_adelanto = 'Entregado';                    
			$arrayDatos ['cell'] = array(
                            $item["cod_adelanto"],
                            null,
                            trim(utf8_encode($item["desc_proveedor"])),
                            $item["fecha_adelanto"],
                            $item["monto_adelanto"],
                            $estado_adelanto,                            
                            $item["cod_proveedor"],
                            $item["estado_adelanto"]);
			$arrayDatos ['columns'] = array(
                            "id",
                            "modificar",
                            "desc_proveedor",
                            "fecha_adelanto",
                            "monto_adelanto",
                            "desc_estado_adelanto",
                            "cod_proveedor",
                            "estado_adelanto",);
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

        $servCon = new Application_Model_DataService($parametrosNamespace->Application_Model_DbTable);
        $where =null;

        if($rowData->descripcion != null){
                $where.="UPPER($parametrosNamespace->busqueda) like '".strtoupper(trim($rowData->descripcion))."%'";
        }

        $parametrosNamespace->parametrosBusqueda = $where;
        $parametrosNamespace->lock ();


        $result = $servCon->getRowsByWhere($where);
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
                    $servCon->deleteRowById(array("cod_adelanto"=>$id));
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
            $applicationModel = new Application_Model_Adelantoproveedor();
            self::almacenardatos($applicationModel,$rowData);
	}

	public function modificarAction(){
            $this->_helper->viewRenderer->setNoRender ( true );
            $json_rowData = $this->getRequest ()->getParam ( "parametros" );
            $rowData = json_decode($json_rowData);
            $rowClass = new Application_Model_Adelantoproveedor();
		if($rowData->idRegistro != null){
				$rowClass->setCod_adelanto($rowData->idRegistro);
			}
            self::almacenardatos($rowClass,$rowData);
	}

        public function almacenardatos($rowClass,$rowData){
     	try{
                $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
     		$service = new Application_Model_DataService($parametrosNamespace->Application_Model_DbTable);
        	$db = Zend_Db_Table::getDefaultAdapter();
        	$db->beginTransaction();
                $rowClass->setCod_proveedor($rowData->cod_proveedor);
                $rowClass->setFecha_adelanto($rowData->fecha_adelanto);
                $rowClass->setMonto_adelanto($rowData->monto_adelanto);
                if($rowData->idRegistro == null){
                    $rowClass->setEstado_adelanto('P');    
                }else $rowClass->setEstado_adelanto('E');
                
                $result = $service->saveRow($rowClass);
	    	$db->commit();
	    	echo json_encode(array("result" => "EXITO"));
        }catch( Exception $e ) {
	    	echo json_encode(array("result" => "ERROR","mensaje"=>$e->getCode()));
		$db->rollBack();
	}
    }
    public function proveedordataAction() {
        $this->_helper->viewRenderer->setNoRender ( true );
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                 ->from(array('A' => 'proveedor'), array('distinct(A.cod_proveedor)', 'A.desc_proveedor'))
                 ->order(array('A.desc_proveedor'));        
        $result = $db->fetchAll($select);
        $htmlResult = '<option value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
             $htmlResult .= '<option value="'.$arr["cod_proveedor"].'">' .trim(utf8_decode($arr["desc_proveedor"])).'</option>';	
        }
        echo  $htmlResult;
    } 

}

