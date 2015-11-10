<?php

class Administrativo_ProductosController extends Zend_Controller_Action
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
        $parametrosNamespace->jsGrip = '/js/grillasmodulos/administrativo/gridProductos.js';
        $parametrosNamespace->Application_Model_DbTable = "Application_Model_DbTable_Producto";
        $parametrosNamespace->busqueda = "desc_producto";
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
                ->from(array('d' => 'producto'), 
                       array(
                            'a.desc_sucursal',
                            'd.desc_producto',
                            'd.compra_producto',
                            'd.venta_producto',
                            'd.cod_producto',
                            'd.cod_sucursal'))
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
                            $item["cod_producto"],
                            null,
                            trim(utf8_encode($item["desc_sucursal"])),
                            trim(utf8_encode($item["desc_producto"])),
                            trim(($item["compra_producto"])),
                            trim(($item["venta_producto"])),
                            $item["cod_producto"],
                            $item["cod_sucursal"]
                                );
                        
			$arrayDatos ['columns'] = array(
                            "modificar",
                            "desc_sucursal",
                            "desc_producto",
                            "compra_producto",
                            "venta_producto",
                            "cod_producto","cod_sucursal"
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
                ->from(array('d' => 'producto'), 
                       array(
                            'a.desc_sucursal',
                            'd.desc_producto',
                            'd.compra_producto',
                            'd.venta_producto',
                            'd.cod_producto',
                            'd.cod_sucursal'))
                ->join(array('a' => 'sucursal'), 'd.cod_sucursal = a.cod_sucursal');                
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
                    $servCon->deleteRowById(array("cod_producto"=>$id));
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
            /*$json_rowData = '{"detalles":[
                              {"cod_sucursal":"1","cod_producto":"","clave_parametro":"3","tipo_descuento":"P","desde_valor":10,
                              "hasta_valor":11,"valor_descuento":1},
                              {"cod_sucursal":"1","cod_producto":"","clave_parametro":"3","tipo_descuento":"P","desde_valor":11,
                              "hasta_valor":12,"valor_descuento":2},
                              {"cod_sucursal":"1","cod_producto":"","clave_parametro":"4","tipo_descuento":"M","desde_valor":0,
                              "hasta_valor":0,"valor_descuento":5},
                              {"cod_sucursal":"1","cod_producto":"","clave_parametro":"2","tipo_descuento":"P","desde_valor":10,
                              "hasta_valor":11,"valor_descuento":1},
                              {"cod_sucursal":"1","cod_producto":"","clave_parametro":"2","tipo_descuento":"P","desde_valor":11,
                              "hasta_valor":12,"valor_descuento":2}],
                              "codigo":"","cod_sucursal":"1","desc_producto":"gfdgdfg","compra_producto":"4654","venta_producto":"465465"}';
             * 
             */
            $rowData = json_decode($json_rowData);
            //$applicationModel = new Application_Model_Producto();
            //self::almacenardatos($applicationModel,$rowData);
            self::almacenardatos($rowData);
	}

	public function modificarAction(){
            $this->_helper->viewRenderer->setNoRender ( true );
            $json_rowData = $this->getRequest ()->getParam ( "parametros" );
            $rowData = json_decode($json_rowData);
            $rowClass = new Application_Model_Producto();
		if($rowData->codigo != null){
                    $rowClass->setCod_producto($rowData->codigo);
		}
            self::almacenardatos($rowClass,$rowData);
	}

        public function almacenardatos($rowData){
     	try{
                $parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );                
                $rowClass = new Application_Model_Producto;
                $service = new Application_Model_DataService('Application_Model_DbTable_Producto');
     		//$service = new Application_Model_DataService($parametrosNamespace->Application_Model_DbTable);
        	$db = Zend_Db_Table::getDefaultAdapter();
        	$db->beginTransaction();
                $rowClass->setCod_sucursal($rowData->cod_sucursal);
                $rowClass->setDesc_producto(trim(utf8_decode($rowData->desc_producto)));
                $rowClass->setCompra_producto($rowData->compra_producto);
                $rowClass->setVenta_producto($rowData->venta_producto);                
                $result_cabecera = $service->saveRow($rowClass);                
                unset($service);
                unset($rowClass);
                $rowClass = new Application_Model_Detproductodescuento();
                $service = new Application_Model_DataService('Application_Model_DbTable_Detproductodescuento');
                $det_item_detalle = 1;  
                foreach ($rowData->detalles as $row){                   
                    $rowClass->setId_det_producto_descuento($row->id_det_producto_descuento);
                    $rowClass->setCod_sucursal($row->cod_sucursal);
                    $rowClass->setCod_producto($result_cabecera);
                    $rowClass->setClave_parametro($row->clave_parametro);
                    $rowClass->setTipo_descuento($row->tipo_descuento);
                    $rowClass->setDesde_valor($row->desde_valor);
                    $rowClass->setHasta_valor($row->hasta_valor);
                    $rowClass->setValor_descuento($row->valor_descuento);
                    $result = $service->saveRow($rowClass); 
                    $det_item_detalle++;
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
        $parametrosNamespace = new Zend_Session_Namespace('parametros');
        $parametrosNamespace->unlock();
        $cod_sucursal = $parametrosNamespace->codAgencia;
        $parametrosNamespace->lock();    
        $this->_helper->viewRenderer->setNoRender ( true );
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                 ->from(array('A' => 'parametros'), array('distinct(A.clave_parametro)','cod_parametro'))
                 ->where(" cod_sucursal = ".$cod_sucursal)
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
                ->from(array('DPD' => 'det_producto_descuento'), array('DPD.id_det_producto_descuento',
                    'DPD.cod_sucursal',
                    'DPD.cod_producto',
                    'DPD.clave_parametro',
                    'DPD.tipo_descuento',
                    'DPD.desde_valor',
                    'DPD.hasta_valor',
                    'DPD.valor_descuento',
                    'P.desc_producto',
                    'S.desc_sucursal',
                    'PAR.clave_parametro as desc_parametro'))
                ->join(array('P' => 'producto'), 'DPD.cod_producto = P.cod_producto')
                ->join(array('S' => 'sucursal'), 'DPD.cod_sucursal = S.cod_sucursal')
                ->join(array('PAR' => 'parametros'), 'DPD.clave_parametro = PAR.cod_parametro')
                ->where("DPD.cod_producto = ?", $getNumeroInterno);
//        print_r($select);
//        die();
        $result = $db->fetchAll($select);
        $option = array();
        foreach ($result as $value) {
            $id_det_producto_descuento = $value ['id_det_producto_descuento'];
            $cod_sucursal = $value ['cod_sucursal'];
            $cod_producto = $value ['cod_producto'];
            $cod_parametro = $value['clave_parametro'];
            if($value['tipo_descuento'] == 'M')
                $tipo_descuento = 'Descuenta Cargamento';
            else
                $tipo_descuento = 'Porcentaje';
            $desde_valor = $value['desde_valor'];
            $hasta_valor = $value['hasta_valor'];
            $valor_descuento = $value['valor_descuento'];
            $desc_producto = $value['desc_producto'];
            $desc_sucursal = $value['desc_sucursal'];
            $desc_parametro = $value['desc_parametro'];
                        
            $option1 = array("id_det_producto_descuento" => $id_det_producto_descuento, "cod_sucursal" => $cod_sucursal, 
                "cod_producto" => $cod_producto,
                "cod_parametro" => $cod_parametro, "forma_descuento_desc" => $tipo_descuento, "forma_descuento" => $value['tipo_descuento'],
                "desde_valor" => $desde_valor,'desc_parametro' => $value['desc_parametro'],
                "hasta_valor" => $hasta_valor, "valor_descuento" => $valor_descuento, "desc_producto" => $desc_producto,
                "desc_sucursal" => $desc_sucursal);
            array_push($option, $option1);
        }

        echo json_encode($option);
    }    
}

