<?php

class Administrativo_UsuariosController extends Zend_Controller_Action
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
        $parametrosNamespace->jsGrip = '/js/grillasmodulos/administrativo/gridUsuarios.js';
        $parametrosNamespace->Application_Model_DbTable = "Application_Model_DbTable_Usuarios";
        $parametrosNamespace->busqueda = "usuario";
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
                ->from(array('d' => 'usuarios'), 
                       array('d.codigo',
                            'd.USER',
                            'd.usuario',
                            'd.cod_grupo_usuario',
                            'a.desc_grupo_usuario',
                            'd.password',
                            'd.estado',
                            'd.borrado'))
                ->join(array('a' => 'grupo_usuario'), 'd.cod_grupo_usuario = a.cod_grupo_usuario');

//        die($select);
                $result = $db->fetchAll($select);
        
		$parametrosNamespace->lock();
                $pagina = self::obtenerPaginas($result,$cantidadFilas,$page);
		echo $this->_helper->json ( $pagina );
	}
        
        public function grupodataAction() {
//        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                ->from(array('g' => 'grupo_usuario'))
                ->where("g.activo = 'S'")
                ->order(array('g.desc_grupo_usuario')
        );
        $result = $db->fetchAll($select);

        echo json_encode($result);
    }

	private function obtenerPaginas($result,$cantidadFilas,$page){
		$this->_paginator = Zend_Paginator::factory ($result);
	 	$this->_paginator->setItemCountPerPage ( $cantidadFilas );
	 	$this->_paginator->setCurrentPageNumber($page);
		$pagina ['rows'] = array ();
		foreach ( $this->_paginator as $item ) {
                        if($item["estado"] == 'A') 
                            $activo = 'Activo'; 
                        else 
                            $activo = 'Desactivado';
			$arrayDatos ['cell'] = array(
                            null,
                            $item["codigo"],
                            trim(utf8_encode($item["USER"])),
                            trim(utf8_encode($item["usuario"])),
                            trim(($item["cod_grupo_usuario"])),
                            trim(($item["desc_grupo_usuario"])),
                            $item["password"],
                             $activo,
                            $item["borrado"]
                                );
                        
			$arrayDatos ['columns'] = array(
                            "modificar",
                            "codigo",
                            "user",
                            "usuario",
                            "cod_grupo_usuario",
                            "desc_grupo_usuario",
                            "password","estado","borrado"
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
                ->from(array('d' => 'usuarios'), 
                       array('d.codigo',
                            'd.USER',
                            'd.usuario',
                            'd.cod_grupo_usuario',
                            'a.desc_grupo_usuario',
                            'd.password',
                            'd.estado',
                            'd.borrado'))
                ->join(array('a' => 'grupo_usuario'), 'd.cod_grupo_usuario = a.cod_grupo_usuario');
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
                    $servCon->deleteRowById(array("codigo"=>$id));
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
            $applicationModel = new Application_Model_Usuarios();
            $rowData->password = md5($rowData->password);
            self::almacenardatos($applicationModel,$rowData);
	}

	public function modificarAction(){
            $this->_helper->viewRenderer->setNoRender ( true );
            $json_rowData = $this->getRequest ()->getParam ( "parametros" );
            $rowData = json_decode($json_rowData);
            $rowClass = new Application_Model_Usuarios();
		if($rowData->codigo != null){
                    $rowClass->setCodigo($rowData->codigo);
		}
                if($rowData->change == "true"){
                   $rowData->password = md5($rowData->password); 
                }
            self::almacenardatos($rowClass,$rowData);
	}

        public function almacenardatos($rowClass,$rowData){
     	try{
                $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
     		$service = new Application_Model_DataService($parametrosNamespace->Application_Model_DbTable);
        	$db = Zend_Db_Table::getDefaultAdapter();
        	$db->beginTransaction();
                $rowClass->setUser(trim(utf8_decode($rowData->user)));
                $rowClass->setUsuario(trim(utf8_decode($rowData->usuario)));
                $rowClass->setCod_grupo_usuario(trim(utf8_decode($rowData->cod_grupo_usuario)));
                $rowClass->setPassword($rowData->password);
                $rowClass->setEstado($rowData->estado);
                $rowClass->setBorrado($rowData->borrado);
                
                $result = $service->saveRow($rowClass);
	    	$db->commit();
	    	echo json_encode(array("result" => "EXITO"));
        }catch( Exception $e ) {
	    	echo json_encode(array("result" => "ERROR","mensaje"=>$e->getMessage()));
		$db->rollBack();
	}
    }


}

