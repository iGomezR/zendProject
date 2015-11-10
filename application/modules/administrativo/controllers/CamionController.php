<?php

class Administrativo_CamionController extends Zend_Controller_Action
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
        $parametrosNamespace->jsGrip = '/js/grillasmodulos/administrativo/gridCamion.js';
        $parametrosNamespace->Application_Model_DbTable = "Application_Model_DbTable_Camion";
        $parametrosNamespace->busqueda = array('desc_proveedor','marca_camion','modelo_camion','anho_camion','peso_neto_camion','chapa_camion');
        $parametrosNamespace->lock ();
    }
    public function creartablasAction()
    {        
        $table = new Zend_ModelCreator('orden_de_entrada','carboneria_gical');
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
                ->from(array('d' => 'camion'), 
                       array(
                            'd.cod_camion',
                            'd.cod_proveedor',
                            'd.marca_camion',
                            'd.modelo_camion',
                            'd.anho_camion',
                            'd.peso_neto_camion',
                            'a.desc_proveedor',
                            'd.chapa_camion'))
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
			$arrayDatos ['cell'] = array(
                            $item["cod_camion"],
                            null,
                            trim(utf8_encode($item["desc_proveedor"])),
                            trim(utf8_encode($item["marca_camion"])),
                            trim(utf8_encode($item["modelo_camion"])),
                            $item["anho_camion"],
                            $item["peso_neto_camion"],
                            $item["cod_proveedor"],
                            trim(utf8_encode($item["chapa_camion"])));
			$arrayDatos ['columns'] = array(
                            "id",
                            "modificar",
                            "desc_proveedor",
                            "marca_camion",
                            "modelo_camion",
                            "anho_camion",     
                            "peso_neto_camion",    
                            "cod_proveedor",
                            "chapa_camion");
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
/*
        $servCon = new Application_Model_DataService($parametrosNamespace->Application_Model_DbTable);
        $where =null;

        if($rowData->descripcion != null){
            echo "where : ".$parametrosNamespace->busqueda[0]."<br>";
                $where.="UPPER(".$parametrosNamespace->busqueda[0].") like '".strtoupper(trim($rowData->descripcion))."%'";
        }

        $parametrosNamespace->parametrosBusqueda = $where;
        $parametrosNamespace->lock ();


        $result = $servCon->getRowsByWhere($where);
        $pagina = self::obtenerPaginas($result,$cantidadFilas,$page);
        $jsondata = $this->_helper->json ( $pagina );
        echo $jsondata;
*/        
                $db = Zend_Db_Table::getDefaultAdapter();
                $select = $db->select()
                ->from(array('d' => 'camion'), 
                       array(
                            'd.cod_camion',
                            'd.cod_proveedor',
                            'd.marca_camion',
                            'd.modelo_camion',
                            'd.anho_camion',
                            'd.peso_neto_camion',
                            'a.desc_proveedor'))
                ->join(array('a' => 'proveedor'), 'd.cod_proveedor = a.cod_proveedor');

                if($rowData->descripcion != null){
                    foreach ($parametrosNamespace->busqueda as $key => $value) {
                        $select->orWhere("UPPER(".$value.") like '%".strtoupper(trim($rowData->descripcion))."%'");
                    }                         
                }                
                $result = $db->fetchAll($select);
        //die($select);        
		$parametrosNamespace->lock();
                $pagina = self::obtenerPaginas($result,$cantidadFilas,$page);
		echo $this->_helper->json ( $pagina );        
    }

    public function eliminarAction(){
		$this->_helper->viewRenderer->setNoRender ( true );
		$id = $this->getRequest ()->getParam ( "id" );
                $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		try{
                    $db = Zend_Db_Table::getDefaultAdapter();
                    $db->beginTransaction();
                    $servCon = new Application_Model_DataService($parametrosNamespace->Application_Model_DbTable);
                    $servCon->deleteRowById(array("cod_camion"=>$id));
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
            $applicationModel = new Application_Model_Camion();
            self::almacenardatos($applicationModel,$rowData);
	}

	public function modificarAction(){
            $this->_helper->viewRenderer->setNoRender ( true );
            $json_rowData = $this->getRequest ()->getParam ( "parametros" );
            $rowData = json_decode($json_rowData);
            $rowClass = new Application_Model_Camion();
		if($rowData->idRegistro != null){
				$rowClass->setCod_camion($rowData->idRegistro);
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
                $rowClass->setMarca_camion(trim(utf8_decode($rowData->marca_camion)));
                $rowClass->setModelo_camion(trim(utf8_decode($rowData->modelo_camion)));
                $rowClass->setAnho_camion($rowData->anho_camion);
                $rowClass->setPeso_neto_camion($rowData->peso_neto_camion);
                $rowClass->setChapa_camion(strtoupper($rowData->chapa_camion));
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

