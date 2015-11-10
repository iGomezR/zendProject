<?php

class Parametricos_ClienteController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
		$parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		$parametrosNamespace->unlock ();
		$parametrosNamespace->parametrosFormPlanes = null;
		$parametrosNamespace->columnasPlanes = array("Codigo Plan","Nombre","Producto","Costo del Plan","Moneda","Empresa","Sucursal");
		$parametrosNamespace->parametrosBusquedaPlanes = null;
		$parametrosNamespace->cantidadFilasPeriodo = null;
		$parametrosNamespace->lock ();
   	}
    
	public function formapagodataAction() {
       $this->_helper->viewRenderer->setNoRender ( true );
       $db = Zend_Db_Table::getDefaultAdapter();
       $select = $db->select()
                ->from(array('C' => 'DBCONEX.EMPRES'), array('distinct(C.EMPID)', 'C.EMPNM'))
                ->order(array('C.EMPNM'));
        $result = $db->fetchAll($select);
        $htmlCombo = '<option value="-1">---Seleccione---</option>';
        foreach ($result as $arr) {
			
			$htmlCombo .= '<option value="'.$arr["EMPID"].'">' .trim(utf8_encode($arr["EMPNM"])).'</option>';	
		}
		echo  $htmlCombo;
	}
	
         	
	public function listarAction() {
		$this->_helper->viewRenderer->setNoRender ( true );
		
		$parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		$parametrosNamespace->unlock ();
		
		$cantidadFilas = $this->getRequest ()->getParam ( "rows" );
		if (! isset ( $cantidadFilas )) {
			$cantidadFilas = 10;
		}
		
		$parametrosNamespace->cantidadFilasPeriodo = $cantidadFilas;
		
		$page = $this->getRequest ()->getParam ( "page" );
		if (! isset ( $page )) {
			$page = 1 ;
		}
		
		$this->view->headScript ()->appendFile ( $this->view->baseUrl () . '/js/bootstrap.js' );
	 	$this->view->headScript ()->appendFile ( $this->view->baseUrl () . '/js/gridPlanes.js' );
	 	
	 	$ser = new Application_Model_DataService('Application_Model_DbTable_Platar'); 
    	$fields = array(//id
    					'PLATAR.PTARID',
    					//idproducto
    					'PRODUC.COD_PRODUCTO',
    					//idmoneda
    					'PLATAR.PTARMONID',
    					//idempresa
    					'PLATAR.PTAREMPID',
    					//idsucursal
    					'PLATAR.PTARSUCID',
    					//nombre
    				    'PLATAR.PTARNM',
    					//producto
    				    'PRODUC.PRODS',
    					//costoplan
    					'PLATAR.PTARPRCFJ',
    					//moneda
    				    'MONEDA.MONNM',
    					//empresa
    				    'EMPRES.EMPNM',
    					//sucursal
    					'SUCURS.SUCNM',
    					//cantidadperiodosfact
    					'PLATAR.PTARCPRD',
    					//unidadmedida
    					'UNIDADMED.COD_UNIDAD_MEDIDA',
    					//periodofacturar
    					'PLATAR.PTARPRD',
    					//porcentajemora
    					'PLATAR.PORCENTAJE_MORA',
    					//cantidadlimitemensual
    					'PLATAR.PTARCLIM',
    					//montoinicialnocobrado
    					'PLATAR.PTARMINOC',
    					//cantidadunidadestarifariasnocobradas
    					'PLATAR.PTARCINOC',
    					//permitirpasarlimite
    				 	'PLATAR.PTARPERM',
    					//periodoespera
    					'PLATAR.PTARUESP',
    					//tiempoesperaaplicar
    					'PLATAR.PTARTESP',
    					//periodomulta
    					'PLATAR.COD_PERIODO_MULTA',
    					//porcentajemulta
    					'PLATAR.PORCENTAJE_MULTA',
    					//montomulta
    					'PLATAR.MONTO_MULTA',
    					//redondeomulta
    					'PLATAR.REDONDEO_PMULTA');
    	
    	$parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		$where = $parametrosNamespace->parametrosBusquedaPlanes;
		

    	$order = array('PLATAR.PTARID ASC');
    	$result = $ser->getRowsJoin($fields, array('Application_Model_DbTable_Produc', 
    											   'Application_Model_DbTable_Moneda',
    											   'Application_Model_DbTable_Empres',
    											   'Application_Model_DbTable_Sucurs',
    											   'Application_Model_DbTable_Unidadmed',
    											   'Application_Model_DbTable_Periodo'), array('Application_Model_DbTable_Periodo1',
											    											   'Application_Model_DbTable_Periodo2'),$where, $order,null);
											    	
    	
    	$pagina = self::obtenerPaginas($result,$cantidadFilas,$page);
		echo $this->_helper->json ( $pagina );
	}
	
	public function buscarAction(){
		$this->_helper->viewRenderer->setNoRender ( true );
		
		$parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		$parametrosNamespace->unlock ();
		
		$cantidadFilas = $this->getRequest ()->getParam ( "rows" );
		if (! isset ( $cantidadFilas )) {
			$cantidadFilas = $parametrosNamespace->cantidadFilasPeriodo;
		}
		$page = $this->getRequest ()->getParam ( "page" );
		if (! isset ( $page )) {
			$page = 1 ;
		}
		
		$plan = $this->getRequest ()->getParam ("data");
        $planes = json_decode($plan);
        
        $where =array();
        if($planes->empresa != null){
        	array_push($where,"PLATAR.PTAREMPID =".$planes->empresa);
        }
        
        if($planes->sucursal != null){
        	array_push($where,"EMPRES.EMPID =".$planes->empresa);
        	array_push($where,"SUCURS.SUCID =".$planes->sucursal);
        }
		
        if($planes->codigoplan != null){
        	array_push($where,"UPPER(PLATAR.PTARID) like '".strtoupper(trim($planes->codigoplan))."%'");
        }
        
        if($planes->nombreplan != null){
        	array_push($where,"UPPER(PLATAR.PTARNM) like '".strtoupper(trim($planes->nombreplan))."%'");
        }
        
		if($planes->idproducto != null){
        	array_push($where,"PLATAR.COD_PRODUCTO =".$planes->idproducto);
        }
        
        $ser = new Application_Model_DataService('Application_Model_DbTable_Platar'); 
    	$fields = array(//id
    					'PLATAR.PTARID',
    					//idproducto
    					'PRODUC.COD_PRODUCTO',
    					//idmoneda
    					'PLATAR.PTARMONID',
    					//idempresa
    					'PLATAR.PTAREMPID',
    					//idsucursal
    					'PLATAR.PTARSUCID',
    					//nombre
    				    'PLATAR.PTARNM',
    					//producto
    				    'PRODUC.PRODS',
    					//costoplan
    					'PLATAR.PTARPRCFJ',
    					//moneda
    				    'MONEDA.MONNM',
    					//empresa
    				    'EMPRES.EMPNM',
    					//sucursal
    					'SUCURS.SUCNM',
    					//cantidadperiodosfact
    					'PLATAR.PTARCPRD',
    					//unidadmedida
    					'UNIDADMED.COD_UNIDAD_MEDIDA',
    					//periodofacturar
    					'PLATAR.PTARPRD',
    					//porcentajemora
    					'PLATAR.PORCENTAJE_MORA',
    					//cantidadlimitemensual
    					'PLATAR.PTARCLIM',
    					//montoinicialnocobrado
    					'PLATAR.PTARMINOC',
    					//cantidadunidadestarifariasnocobradas
    					'PLATAR.PTARCINOC',
    					//permitirpasarlimite
    				 	'PLATAR.PTARPERM',
    					//periodoespera
    					'PLATAR.PTARUESP',
    					//tiempoesperaaplicar
    					'PLATAR.PTARTESP',
    					//periodomulta
    					'PLATAR.COD_PERIODO_MULTA',
    					//porcentajemulta
    					'PLATAR.PORCENTAJE_MULTA',
    					//montomulta
    					'PLATAR.MONTO_MULTA',
    					//redondeomulta
    					'PLATAR.REDONDEO_PMULTA');

    	$parametrosNamespace->parametrosBusquedaPlanes = $where;
		$parametrosNamespace->lock ();
    
    	$order = array('PLATAR.PTARID ASC');
    	$result = $ser->getRowsJoin($fields, array('Application_Model_DbTable_Produc', 
    											   'Application_Model_DbTable_Moneda',
    											   'Application_Model_DbTable_Empres',
    											   'Application_Model_DbTable_Sucurs',
    											   'Application_Model_DbTable_Unidadmed',
    											   'Application_Model_DbTable_Periodo'), array('Application_Model_DbTable_Periodo1',
											    											   'Application_Model_DbTable_Periodo2'),$where, $order,null);
											    	
    	$pagina = self::obtenerPaginas($result,$cantidadFilas,$page);
        $jsondata = $this->_helper->json ( $pagina );
		echo $jsondata;
    }
    
    private function obtenerPaginas($result,$cantidadFilas,$page){
		$this->_paginator = Zend_Paginator::factory ($result);
	 	$this->_paginator->setItemCountPerPage ( $cantidadFilas );
	 	$this->_paginator->setCurrentPageNumber($page);
		$pagina ['rows'] = array ();
    		
		foreach ( $this->_paginator as $item ) {
			$impues ['cell'] = array(null,$item["PTARID"],$item["COD_PRODUCTO"],$item["PTARMONID"],$item["EMPID"],$item["SUCID"],trim(utf8_encode($item["PTARNM"])),trim(utf8_encode($item["PRODS"])),$item["PTARPRCFJ"],trim(utf8_encode($item["MONNM"])),trim(utf8_encode($item["EMPNM"])),trim(utf8_encode($item["SUCNM"])),$item["PTARCPRD"],$item["COD_UNIDAD_MEDIDA"],$item["PTARPRD"],$item["PORCENTAJE_MORA"],$item["PTARCLIM"],$item["PTARMINOC"],$item["PTARCINOC"],$item["PTARPERM"],$item["PTARUESP"],$item["PTARTESP"],$item["COD_PERIODO_MULTA"],$item["PORCENTAJE_MULTA"],$item["MONTO_MULTA"],$item["REDONDEO_PMULTA"]);
			$impues ['columns'] = array("modificar","id","idproducto","idmoneda","idempresa","idsucursal","nombre","producto","costoplan","moneda","empresa","sucursal","cantidadperiodosfact","unidadmedida","periodofacturar","porcentajemora","cantidadlimitemensual","montoinicialnocobrado","cantidadunidadestarifariasnocobradas","permitirpasarlimite","periodoespera","tiempoesperaaplicar","periodomulta","porcentajemulta","montomulta","redondeomulta"); 
			array_push ( $pagina ['rows'],$impues);
		}
		$pagina ['records'] = count ( $result );
		$pagina ['page'] = $page;
		$pagina ['total'] = ceil ( $pagina ['records'] / $cantidadFilas );
		
    	if($pagina['records'] == 0){
			$pagina ['mensajeSinFilas'] = true;
		}
		
		$parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		$parametrosNamespace->unlock ();
		
		if($parametrosNamespace->datosProductoSelect != null) {
			$productoAttr = $parametrosNamespace->datosProductoSelect;
    		$pagina ['datosSelect'] = array("datosForm" => $productoAttr); 
			$parametrosNamespace->datosProductoSelect = null;
		//	$parametrosNamespace->datosProductoSelectList = null;
		} else if($parametrosNamespace->datosProductoSelectList != null) {
			$productoAttr = $parametrosNamespace->datosProductoSelectList;
    		$pagina ['datosSelectList'] = array("datosList" => $productoAttr); 
			$parametrosNamespace->datosProductoSelectList = null;
		//	$parametrosNamespace->datosProductoSelect = null;
		}
		$parametrosNamespace->listadoPlanes = $pagina ['rows'];
		$parametrosNamespace->lock ();
		
		return $pagina;
	}
	
	public function cargarabmproductoAction(){
		$this->_helper->viewRenderer->setNoRender ( true );
		$data = $this->getRequest ()->getParam ( "data" );
		$dataJson = json_decode($data);
		$parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		$parametrosNamespace->unlock ();
		$parametrosNamespace->datosProductoSelect = $data;
		$parametrosNamespace->parametrosFormPlanes = "S";
		$where = array();
		if($dataJson->comboempresa != null){
        	array_push($where,"PRODUC.PROEMPID=".$dataJson->comboempresa);
        }
        
		if($dataJson->combosucursal != null){
        	array_push($where,"EMPRES.EMPID =".$dataJson->comboempresa);
        	array_push($where,"SUCURS.SUCID =".$dataJson->combosucursal);
        }
		$parametrosNamespace->parametrosBusquedaProductos = $where;
	//	 	Zend_Debug::dump($dataJson);
    //		die();
   
		$parametrosNamespace->lock ();
	}
	
	public function cargarabmproductolistadoAction(){
		$this->_helper->viewRenderer->setNoRender ( true );
		$data = $this->getRequest ()->getParam ( "data" );
		$parametrosNamespace = new Zend_Session_Namespace ( 'parametros' );
		$parametrosNamespace->unlock ();
		$parametrosNamespace->datosProductoSelectList = $data;
		$parametrosNamespace->parametrosFormPlanes = "L";
		$parametrosNamespace->lock ();
	}
	
	public function guardarAction(){
		$this->_helper->viewRenderer->setNoRender ( true );
		$data = $this->getRequest ()->getParam ( "parametrosPlan" );
		$planData = json_decode($data);
		
		if($planData->modificar  == false) {
			$servMod = new Application_Model_DataService("Application_Model_DbTable_Platar");
        	$planD = $servMod->getRowById(array("PTARID" => $planData->codigoplan));
        	if($planD != false){
        		echo json_encode(array("result" => "ERROR","mensaje"=>"Ya existe un Plan con el codigo ingresado"));
        		return;
			}
        }
        $plan = new Application_Model_Platar();
        self::almacenardatos($plan, $planData, $servMod);
    }
    
	public function modificarAction(){
		$this->_helper->viewRenderer->setNoRender ( true );
		$servMod = new Application_Model_DataService("Application_Model_DbTable_Platar");
        $data = $this->getRequest ()->getParam ( "parametrosPlan" );
		$planData = json_decode($data);
		$plan = new Application_Model_Platar();
        self::almacenardatos($plan, $planData, $servMod);
	}
    
	public function almacenardatos($plan,$planData,$servMod){
		try{
			$db = Zend_Db_Table::getDefaultAdapter();
    		$db->beginTransaction();
        	$plan->setPtarid($planData->codigoplan);
		    $plan->setCod_producto($planData->idproducto);
			$plan->setPtarnm($planData->nombreplan);
			$plan->setPtarmonid($planData->moneda);
			$plan->setPtarcprd($planData->cantidadperiodos);
			$plan->setPtarempid($planData->empresa);
			$plan->setPtarsucid($planData->sucursal);
			$plan->setPtarud($planData->unidadtarifa);
			$plan->setPtarprd($planData->periodofacturacion);
			$plan->setPorcentaje_mora($planData->porcentajemora);
			$plan->setPtarprcfj($planData->costoplan);
			$plan->setPtarclim($planData->cantidadlimitemensual);
			$plan->setPtarminoc($planData->montoinicialnocobrado);
			$plan->setPtarcinoc($planData->cantidadunidadtarifasnocobradas);
			$plan->setPtarperm($planData->permitirpasarsi);
			$plan->setPtaruesp($planData->comboperiodoesp);
			$plan->setPtartesp($planData->tiempoespera);
			$plan->setCod_periodo_multa($planData->periodomulta);
			$plan->setRedondeo_pmulta($planData->redondeomulta);
			
			if($planData->formapago == "0")
				$plan->setPorcentaje_multa($planData->multa);
			else if($planData->formapago == "1")
				$plan->setMonto_multa($planData->multa);
			
			$codPlan = $servMod->saveRow($plan);
	    	
			$db->commit();
	    	echo json_encode(array("result" => "EXITO"));
        }catch( Exception $e ) {
        	$db->rollBack();
        	echo json_encode(array("result" => "ERROR","mensaje"=>$e->getCode()));
		}
		
	}
	
	public function eliminarAction(){
		$this->_helper->viewRenderer->setNoRender ( true );
		$id = $this->getRequest ()->getParam ( "id" );
		$db = Zend_Db_Table::getDefaultAdapter();
        $db->beginTransaction();
		try{
			$servCon = new Application_Model_DataService("Application_Model_DbTable_Platar");
			$planEliminar = $servCon->deleteRowById(array("PTARID" => $id));
			$db->commit();
		    echo json_encode(array("result" => "EXITO"));
	    }catch( Exception $e ) {
			$db->rollBack();
			echo json_encode(array("result" => "ERROR","mensaje"=>$e->getCode()));
		}
	}
}

