<?php

    class Conexion{ // se declara una clase para hacer la conexion con la base de datos
        
        // se definen los datos del servidor de base de datos
        var $conn; 

	function Conexion() {
            // se definen los datos del servidor de base de datos
            $conection['server']="localhost";  /* server mysql */
            $conection['dbuser']="root";       /* user mysql */
            $conection['dbpass']="31f3d3x";	   /* password mysql */
            $conection['database']="rastreo";  /* base de datos */
	    // crea la conexion pasandole el servidor , usuario y clave
	    $conect= mysql_connect($conection['server'],$conection['dbuser'],$conection['dbpass']);

            if ($conect) {// si la conexion fue exitosa , selecciona la base
		mysql_select_db($conection['database']);
                $this->conn=$conect;
            }
            else{echo "no me conecte";}

	}

        function close(){ //Se cierra la conexion
            mysql_close($this->conn);
        }
        
        function getConexion() { // devuelve la conexion
            return $this->conn;
	}

        //Operaciones sobre la base de datos
        function select($table,$campo,$key)
        {
            $sql="SELECT * FROM $table WHERE $campo='$key'";
            //echo($sql);
            return mysql_query($sql,$this->conn);
        }

        //$table: nombre de la tabla,
        //$campo: nombre de las columnas,
        //$value: nuevo valor en c/ columna,
        //$key: campo discriminador,
        //$value_key: valor del campo discriminador
        function update($table,$campo,$value,$key,$value_key)
        {
            $sql="UPDATE $table SET $campo=$value WHERE $key=$value_key";
            echo($sql);
            return mysql_query($sql,$this->conn);
        }

        //$table: nombre de la tabla,
        //$key: campo discriminador,
        //$value_key: valor del campo discriminador
        function delete($table,$key,$value_key)
        {
            $sql="DELETE FROM $table WHERE $key=$value_key";
            //echo($sql);
            return mysql_query($sql,$this->conn);
        }

        //$table: nombre de la tabla,
        //$campo: nombre de las columnas (separados por coma),
        //$value: nuevo valor en c/ columna
        function insert($table,$campo,$value)
        {
            $sql="insert into $table ($campo) value ($value)";
//            echo($sql);
            if(mysql_query($sql,$this->conn))
                return mysql_insert_id();
            else
                return;
        }

        function select_join($sql,$campo,$key)
        {
            $sql= "$sql $campo='$key'";
            echo($sql);
            return mysql_query($sql,$this->conn);
        }

        function query($sql)
        {            
            //echo($sql);
            return mysql_query($sql,$this->conn);
        }

        function num_rows($query)   {
            return @mysql_num_rows($query);
        }
        

    }

    class sQuery   // se declara una clase para poder ejecutar las consultas, esta clase llama a la clase anterior
    {
	var $pconeccion;
	var $pconsulta;
	var $resultados;
	function sQuery()  // constructor, solo crea una conexion usando la clase "Conexion"
	{
		$this->pconeccion= new Conexion();
	}
	function executeQuery($sql)  // metodo que ejecuta una consulta y la guarda en el atributo $pconsulta
	{
		$this->pconsulta= mysql_query($sql,$this->pconeccion->getConexion());
		return $this->pconsulta;
	}
	function getResults()   // retorna la consulta en forma de result.
	{return $this->pconsulta;}

	function Close()	// cierra la conexion
	{$this->pconeccion->Close();}

	function Clean() // libera la consulta
	{mysql_free_result($this->pconsulta);}

	function getResultados() // debuelve la cantidad de registros encontrados
	{return mysql_affected_rows($this->pconeccion->getConexion()) ;}

	function getAffect() // devuelve las cantidad de filas afectadas
	{return mysql_affected_rows($this->pconeccion->getConexion()) ;}
    }
?>
