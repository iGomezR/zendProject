<?php
class ZendExt_Db_Table_Abstract extends Zend_Db_Table_Abstract
{
	//this class abstract the db_table from the Zend library
	//this allows us to append the schema name to the front of the column name.
	//Eg: SELECT SCHEMANAME.TABLENAME.COLUMNNAME FROM TABLENAME;
	public function select()
	{ 
		require_once 'ZendExt/Db/Table/Select.php'; 
		return new ZendExt_Db_Table_Select($this); }
	} 
?>
