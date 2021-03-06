<?php

class Administrativo_ProveedorController extends Zend_Controller_Action
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
        $parametrosNamespace->jsGrip = '/js/grillasmodulos/administrativo/gridProveedor.js';
        $parametrosNamespace->Application_Model_DbTable = "Application_Model_DbTable_Proveedor";
        $parametrosNamespace->busqueda = "desc_proveedor";
        $parametrosNamespace->lock ();
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
                ->from(array('d' => 'proveedor'), 
                       array(
                            'd.cod_proveedor',
                            'd.cod_sucursal',
                            'd.desc_proveedor',
                            'd.ruc_proveedor',
                            'd.direccion_proveedor',
                            'd.telefono_proveedor',
                            'a.desc_sucursal'))
                ->join(array('a' => 'sucursal'), 'd.cod_sucursal = a.cod_sucursal');

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
			$arrayDatos ['cell'] = array(
                            $item["cod_proveedor"],
                            null,
                            trim(utf8_encode($item["desc_sucursal"])),
                            trim(utf8_encode($item["desc_proveedor"])),
                            trim(utf8_encode($item["ruc_proveedor"])),
                            trim(utf8_encode($item["direccion_proveedor"])),
                            $item["telefono_proveedor"],
                            $item["cod_sucursal"]);
			$arrayDatos ['columns'] = array(
                            "id",
                            "modificar",
                            "desc_sucursal",
                            "desc_proveedor",
                            "ruc_proveedor",
                            "direccion_proveedor",
                            "telefono_proveedor",
                            "cod_sucursal");
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
                    $servCon->deleteRowById(array("cod_proveedor"=>$id));
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
            $applicationModel = new Application_Model_Proveedor();
            self::almacenardatos($applicationModel,$rowData);
	}

	public function modificarAction(){
            $this->_helper->viewRenderer->setNoRender ( true );
            $json_rowData = $this->getRequest ()->getParam ( "parametros" );
            $rowData = json_decode($json_rowData);
            $rowClass = new Application_Model_Proveedor();
		if($rowData->idRegistro != null){
				$rowClass->setCod_proveedor($rowData->idRegistro);
			}
            self::almacenardatos($rowClass,$rowData);
	}

        public function almacenardatos($rowClass,$rowData){
     	try{
                $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
     		$service = new Application_Model_DataService($parametrosNamespace->Application_Model_DbTable);
        	$db = Zend_Db_Table::getDefaultAdapter();
        	$db->beginTransaction();
                $rowClass->setCod_sucursal($rowData->cod_sucursal);
                $rowClass->setDesc_proveedor(trim(utf8_decode($rowData->desc_proveedor)));
                $rowClass->setRuc_proveedor(trim(utf8_decode($rowData->ruc_proveedor)));
                $rowClass->setDireccion_proveedor(trim(utf8_decode($rowData->direccion_proveedor)));
                $rowClass->setTelefono_proveedor($rowData->telefono_proveedor);
                $result = $service->saveRow($rowClass);
	    	$db->commit();
	    	echo json_encode(array("result" => "EXITO"));
        }catch( Exception $e ) {
	    	echo json_encode(array("result" => "ERROR","mensaje"=>$e->getCode()));
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

}

