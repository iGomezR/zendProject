<?php
class Conexion_ModelCreator
{
	
	public $_contenido;
	public $_contenidoTabla;
	public $_nombre;
	public $_campos;
	public $_fin = "\r\n" ; 
    function __construct ($_nombre, $_schema)
    {
    	if($_schema == null){
//	    	$_schema = 'DBCONEX1';
	    	$_schema = 'vsullow_factura';
    		
    	}
    	$this->_contenido = '';
    	if(!is_null($_nombre)){
    		$_nombre = strtolower($_nombre);
    		$this->_nombre = ucfirst($_nombre);
    		//Obtener Campos
			$db = Zend_Db_Table::getDefaultAdapter();
			$_campos = $db->describeTable($_nombre, $_schema);
			$db->closeConnection();
    		// *** Armar Clases y Extend
    		$this->_contenido = $this->encabezado($this->_nombre, $_schema, $_campos);
    		$this->_contenido = $this->definirCampos($this->_contenido, $_campos);
    		$this->_contenido = $this->crearGetters($this->_contenido, $_campos);
    		$this->_contenido = $this->crearSetters($this->_contenido, $_campos);
    		$this->_contenido = $this->crearGet($this->_contenido);
    		$this->_contenido = $this->crearArr($this->_contenido, $_campos);
    		$this->_contenido = $this->crearsetFrom($this->_contenido, $_campos);
    		$this->_contenido .= '} ?>';
    		$this->crearArch($this->_contenido,$this->_contenidoTabla, $_nombre);
    	}
    }
        public function crearArch($_contenido, $_contenidoTab, $_nombre ){
        	
 	      	$_carpetaTabla = 'C:\xampp\htdocs\factura\proyectoZend\application\models\DbTable\ ';
    		$_carpetaFilaTabla = 'C:\xampp\htdocs\factura\proyectoZend\application\models\ ';
    		$_filename = trim($_carpetaFilaTabla) . trim( ucfirst(strtolower($_nombre))). ".php"; 
    		$_filenameTab = trim($_carpetaTabla) . trim( ucfirst(strtolower($_nombre))). ".php"; 
    		$_archivo = fopen($_filename, "w");
       		 $_archivoTab = fopen($_filenameTab, "w");
       		 fwrite($_archivo, $_contenido);
       		 fwrite($_archivoTab, $_contenidoTab);
       		 fclose($_archivo);
       		 fclose($_archivoTab);
       		 
        }
    public function crearsetFrom($_contenido, $_campos){
    	$elarray = '';
    	foreach ($_campos as $_campo){
    		$elarray .= "'" .strtolower($_campo['COLUMN_NAME']) .  "', " ;
    	}
        $lar = strlen($elarray) -2;
        $elarray = substr($elarray, 0, $lar);
        $_contenido .= '    public function setFromArray(array $data) {' . $this->_fin;
        $_contenido .= '    	foreach (array(' .$elarray . ') as  $property) {' . $this->_fin ;
        $_contenido .= '    		if (isset($data[strtoupper($property)])) {' . $this->_fin;
        $_contenido .= '     			$this->{'. "'_'" . '. $property} = $data[strtoupper($property)];' . $this->_fin;
        $_contenido .= '    		}' . $this->_fin;
        $_contenido .= '    	}' . $this->_fin;
        $_contenido .= '    }' . $this->_fin;
        return $_contenido;
        	
    }
    
    public function crearArr($_contenido, $_campos){
		$_contenido .= '	public function toArr() {'  . $this->_fin;
		$_contenido .= '		return array(' . $this->_fin;
		foreach ($_campos as $_campo){
			$_contenido .= 	"			'" . $_campo['COLUMN_NAME'] ."' => $"."this->_" . strtolower($_campo['COLUMN_NAME']) . ", "  . $this->_fin;
		}
		$lar = strlen($_contenido) -4;
        $_contenido = substr($_contenido, 0, $lar);
		$_contenido .= ');' . $this->_fin;
    	$_contenido .=  '}' . $this->_fin;		
    	return $_contenido;    	
    }
    
    public function crearGet($_contenido){
		$_contenido .=  '	public function __get($propertyName) {' . $this->_fin;
        $_contenido .=  '		$getter = "get" . $propertyName;' . $this->_fin;
        $_contenido .=  '		if (!method_exists($this, $getter)) {' . $this->_fin;
        $_contenido .=  '    		throw new RuntimeException("Property by name " . $propertyName . " not found as part of this object.");' . $this->_fin;
        $_contenido .=  '		}' . $this->_fin;
        $_contenido .=  '		return $this->{$getter}();' . $this->_fin;
    	$_contenido .=  '	}' . $this->_fin;
    	return $_contenido;
    }
    
    public function crearGetters($_contenido, $_campos){
		foreach ($_campos as $_campo){
    		$_contenido .= '	public function get' . ucfirst(strtolower($_campo['COLUMN_NAME'])). '(){' . $this->_fin;
    		$_contenido .= '		return $this->_' . strtolower($_campo['COLUMN_NAME']). ';' . $this->_fin;
    		$_contenido .= '	}' . $this->_fin;
    	}
//    	 	Zend_Debug::dump($this->_contenido);
//    		die();
  		return  $_contenido; 	
    }
    
    
    public function crearSetters($_contenido, $_campos){
    	
		foreach ($_campos as $_campo){
    		$_contenido .= '	public function set' . ucfirst(strtolower($_campo['COLUMN_NAME'])). '($_' . strtolower($_campo['COLUMN_NAME']).'){' . $this->_fin;
    		$_contenido .= '		$this->_' . strtolower($_campo['COLUMN_NAME']). ' = $_'. strtolower($_campo['COLUMN_NAME']) .';' . $this->_fin;
    		$_contenido .= '	}' . $this->_fin;
    	}
  		return  $_contenido; 	
    }
    
    
    public function definirCampos($_contenido, $_campos){
    	
    	foreach ($_campos as $_campo){
    		$_contenido .= '	protected $_' . strtolower($_campo['COLUMN_NAME']) . ' = null;' .  $this->_fin;
    	}
    	$_contenido .= '	public $_data = null;'.  $this->_fin;
    	
    	return $_contenido;	
    }

    public function encabezado($_nombre, $_schema, $_campos){
        $extendRow = "ZendExt_Db_Table_Row_Abstract";
        $extendTable = "ZendExt_Db_Table_Abstract";
        $classRowName = 'Application_Model_';
        $classTableName = 'Application_Model_DbTable_';
		$_contenido =  '<?php ' . $this->_fin;
		$_contenido .= 'class ' . $classRowName . $_nombre . ' extends ' . $extendRow . ' {'.  $this->_fin ;
		$_contenido .=  '	protected $_tableClass = "' . $classTableName . $_nombre .'";' .  $this->_fin;
		
    	$_clave = '';
    	foreach ($_campos as $_campo){
    		if($_campo['PRIMARY'] == 1) {
    			$_clave .= "'" .strtoupper($_campo['COLUMN_NAME']) .  "', " ;
    		}
    	}
        $lar = strlen($_clave) -2;
        $_clave = substr($_clave, 0, $lar);
		$_contenidoTab =  '<?php ' . $this->_fin;
		$_contenidoTab .= 'class ' . $classTableName . $_nombre . ' extends ' . $extendTable . ' {'.  $this->_fin ;
		$_contenidoTab .=  '	protected $_schema = "' . strtoupper($_schema) . '";' .  $this->_fin;
		$_contenidoTab .=  '	protected $_name = "' . strtoupper($_nombre) . '";' .  $this->_fin;
		$_contenidoTab .=  '	public $_rowClass = "' . $classRowName . ucfirst(strtolower($_nombre)) .'";' .  $this->_fin;
		$_contenidoTab .=  '	public $_primary = array(' . $_clave . ');' .  $this->_fin;
		$_contenidoTab .=  '	public $_primary_auto = FALSE;' .  $this->_fin;
		
		$_contenidoTab .=  '	public $_esquema = "' . strtoupper($_schema) . '";' .  $this->_fin;
		$_contenidoTab .=  '	public $_nombre = "' . strtoupper($_nombre) . '";' .  $this->_fin;
		$_contenidoTab .=  '	public $_foreignkey = array();' .  $this->_fin;
		
		$_contenidoTab .=  '} ?>';
		
    	$this->_contenidoTabla = $_contenidoTab ;
		
		
		
		return $_contenido; 
 	}
}

/*    	

        $fin = "\r\n" ;
        $contenido = 'HOLA' . $fin ;
        $contenido1 = 'chau'. $fin;
        fwrite($_archivo, $contenido);
		
//		print_r($tabla);
		 foreach($tabla as $col){
		 	$columna = $col['COLUMN_NAME'];
//		 	$columna = $col['PK_NAME'];
		 	if($col['PRIMARY'] == 1) {
		 		echo 'Primari ' . $columna . '<br>';
		 		
		 	}
		 }
 		if($db){
//        	fwrite($_archivo,);
 		}
 		
		$db->closeConnection();
 		
        fclose($_archivo);
 		
    }
*/

?>