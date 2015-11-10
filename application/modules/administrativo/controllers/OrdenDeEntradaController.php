<?php

class Administrativo_OrdendeentradaController extends Zend_Controller_Action
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
        $parametrosNamespace->jsGrip = '/js/grillasmodulos/administrativo/gridOrdenDeEntrada.js';
        $parametrosNamespace->Application_Model_DbTable = "Application_Model_DbTable_Ordendeentrada";
        $parametrosNamespace->busqueda = array('desc_proveedor','nro_orden_de_entrada');
        $parametrosNamespace->lock ();
    }
    public function creartablasAction()
    {        
        $table = new Zend_ModelCreator('lote_documento','carboneria_gical');
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
                ->from(array('d' => 'orden_de_entrada'), 
                       array(
                            'd.cod_proveedor',
                            'd.cod_camion',
                            'd.cod_chofer',
                            'd.nro_orden_de_entrada',
                            'd.fecha_registro',
                            'a.desc_proveedor',
                            'c.marca_camion',
                            'c.modelo_camion',
                            'c.anho_camion',
                            'ch.nombre_chofer',
                            'd.cod_cargamento',
                            'u.usuario',
                            'u.codigo',
                            'd.peso_total'))
                ->join(array('a' => 'proveedor'), 'd.cod_proveedor = a.cod_proveedor')
                ->join(array('c' => 'camion'), 'd.cod_camion = c.cod_camion')
                ->join(array('ch' => 'chofer'), 'd.cod_chofer = ch.cod_chofer')
                ->join(array('u' => 'usuarios'), 'd.cod_usuario_analista = u.codigo');
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
                        $camion = $item["marca_camion"].'-'.$item["modelo_camion"].'-'.$item["anho_camion"];
			$arrayDatos ['cell'] = array(
                            $item["cod_cargamento"],
                            null,
                            $item["nro_orden_de_entrada"],
                            trim(utf8_encode($item["desc_proveedor"])),
                            trim(utf8_encode($camion)),
                            trim(utf8_encode($item["nombre_chofer"])),
                            $item["usuario"],
                            $item["fecha_registro"],
                            $item["cod_proveedor"],
                            $item["cod_camion"],
                            $item["cod_chofer"],
                            $item["codigo"],
                            $item["peso_total"]);
			$arrayDatos ['columns'] = array(
                            "id",
                            "modificar",
                            "nro_orden_de_entrada",
                            "desc_proveedor",
                            "desc_camion",
                            "nombre_chofer",
                            "desc_analista",
                            "fecha_registro",
                            "cod_proveedor",
                            "cod_camion",
                            "cod_chofer",
                            "cod_usuario_analista",
                            "peso_total");
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
        ->from(array('d' => 'orden_de_entrada'), 
               array(
                    'd.cod_proveedor',
                    'd.cod_camion',
                    'd.cod_chofer',
                    'd.nro_orden_de_entrada',
                    'd.fecha_registro',
                    'a.desc_proveedor',
                    'c.marca_camion',
                    'c.modelo_camion',
                    'c.anho_camion',
                    'ch.nombre_chofer',
                    'd.cod_cargamento',
                    'u.usuario',
                    'u.codigo'))
        ->join(array('a' => 'proveedor'), 'd.cod_proveedor = a.cod_proveedor')
        ->join(array('c' => 'camion'), 'd.cod_camion = c.cod_camion')
        ->join(array('ch' => 'chofer'), 'd.cod_chofer = ch.cod_chofer')
        ->join(array('u' => 'usuarios'), 'd.cod_usuario_analista = u.codigo');

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
                    $servCon->deleteRowById(array("cod_cargamento"=>$id));
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
            $applicationModel = new Application_Model_Ordendeentrada();
            self::almacenardatos($applicationModel,$rowData);
	}

	public function modificarAction(){
            $this->_helper->viewRenderer->setNoRender ( true );
            $json_rowData = $this->getRequest ()->getParam ( "parametros" );
            $rowData = json_decode($json_rowData);
            $rowClass = new Application_Model_Ordendeentrada();
            if($rowData->idRegistro != null){
                $rowClass->setCod_cargamento($rowData->idRegistro);
            }
            self::almacenardatos($rowClass,$rowData);
	}

        public function almacenardatos($rowClass,$rowData){
     	try{
                $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
     		$service = new Application_Model_DataService($parametrosNamespace->Application_Model_DbTable);
        	$db = Zend_Db_Table::getDefaultAdapter();
        	$db->beginTransaction();
                if($rowData->idRegistro == null)
                    $nro_orden_de_entrada = $this->documentolotedataAction();
                else $nro_orden_de_entrada = $rowData->nro_orden_de_entrada;
                
                $rowClass->setCod_proveedor($rowData->cod_proveedor);
                $rowClass->setCod_camion($rowData->cod_camion);
                $rowClass->setCod_chofer($rowData->cod_chofer);  
                $rowClass->setCod_usuario_analista($rowData->cod_usuario_analista);
                $rowClass->setNro_orden_de_entrada($nro_orden_de_entrada);  
                //$rowClass->setFecha_registro($rowData->fecha_registro);
                $rowClass->setPeso_total($rowData->peso_total);
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
    public function camiondataAction() {
        $this->_helper->viewRenderer->setNoRender ( true );         
        $json_rowData = $this->getRequest ()->getParam ( "parametros" );
        $rowData = json_decode($json_rowData);        
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                 ->from(array('A' => 'camion'), array('distinct(A.cod_camion)', 'A.marca_camion','A.modelo_camion','A.anho_camion'))
                 ->where("A.cod_proveedor = ".$rowData->cod_proveedor)
                 ->order(array('A.marca_camion'));        
        $result = $db->fetchAll($select);
        $htmlResult = '<option value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
             $htmlResult .= '<option value="'.$arr["cod_camion"].'">' .trim(utf8_decode($arr["marca_camion"].'-'.$arr["modelo_camion"].'-'.
                     $arr["anho_camion"])).'</option>';	
        }
        echo  $htmlResult;
    }
    public function choferdataAction() {
        $this->_helper->viewRenderer->setNoRender ( true );
        $json_rowData = $this->getRequest ()->getParam ( "parametros" );
        $rowData = json_decode($json_rowData);         
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                 ->from(array('A' => 'chofer'), array('distinct(A.cod_chofer)', 'A.nombre_chofer'))
                 ->where("A.cod_proveedor = ".$rowData->cod_proveedor)
                 ->order(array('A.nombre_chofer'));        
        $result = $db->fetchAll($select);
        $htmlResult = '<option value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
             $htmlResult .= '<option value="'.$arr["cod_chofer"].'">' .trim(utf8_decode($arr["nombre_chofer"])).'</option>';	
        }
        echo  $htmlResult;
    }   
    public function usuariodataAction() {
        $parametrosNamespace = new Zend_Session_Namespace('parametros');
        $parametrosNamespace->unlock();
        $cod_sucursal = $parametrosNamespace->codAgencia;
        $parametrosNamespace->lock();         
        $this->_helper->viewRenderer->setNoRender ( true );
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                 ->from(array('A' => 'usuarios'), array('distinct(A.codigo)', 'A.usuario'))
                 ->order(array('A.usuario'))
                 ->where("A.tipo_usuario = 'A'")
                 ->where("A.cod_sucursal = ".$cod_sucursal);        
        $result = $db->fetchAll($select);
        $htmlResult = '<option value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
             $htmlResult .= '<option value="'.$arr["codigo"].'">' .trim(utf8_decode($arr["usuario"])).'</option>';	
        }
        echo  $htmlResult;
    }
    public function documentolotedataAction() {
        $parametrosNamespace = new Zend_Session_Namespace('parametros');
        $parametrosNamespace->unlock();
        $cod_sucursal = $parametrosNamespace->codAgencia;
        $parametrosNamespace->lock();        
        $this->_helper->viewRenderer->setNoRender ( true );
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                 ->from(array('A' => 'lote_documento'), array('distinct(A.cod_lote)', 'A.valor_actual','A.valor_hasta'))
                 ->where(" cod_sucursal = ".$cod_sucursal)
                 ->where(" estado_lote = 'A'")
                 ->order(array('A.fecha_activacion'))
                 ->limit(1,0);     
//die($select);        
        $result = $db->fetchAll($select);
        $valor_actual_return = -1;
        foreach ($result as $arr) {
             $valor_actual_return = $arr["valor_actual"];
             $valor_actual = $arr["valor_actual"];
             $valor_hasta = $arr["valor_hasta"];
             $cod_lote = $arr["cod_lote"];
        }
        //update de lote de documentos
        $table = new Application_Model_DbTable_Lotedocumento();
        $estado_lote = 'A';
        if($valor_actual+1 > $valor_hasta){
            $estado_lote = 'D';            
        }
        else{
            $valor_actual++;
        }
        $data = array(
            'valor_actual'      => $valor_actual,
            'estado_lote'      => $estado_lote
        );
        $where = $table->getAdapter()->quoteInto('cod_lote = ?', $cod_lote);
        $table->update($data, $where);        
        
        return  $valor_actual_return;
    }    
}

