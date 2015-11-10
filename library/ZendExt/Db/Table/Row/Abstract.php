<?php
class ZendExt_Db_Table_Row_Abstract extends Zend_Db_Table_Row_Abstract
{
    protected function _getWhereQuery($useDirty = true)
    {
        $where = array();
        $db = $this->_getTable()->getAdapter();
        $primaryKey = $this->_getPrimaryKey($useDirty);
        $info = $this->_getTable()->info();
        $metadata = $info[Zend_Db_Table_Abstract::METADATA];
		$schema = $info[Zend_Db_Table_Abstract::SCHEMA];
        // retrieve recently updated row using primary keys
        $where = array();
        foreach ($primaryKey as $column => $value) {
            $tableName = $db->quoteIdentifier($info[Zend_Db_Table_Abstract::NAME], true);
            $type = $metadata[$column]['DATA_TYPE'];
            $columnName = $db->quoteIdentifier($column, true);
            $where[] = $db->quoteInto("{$schema}.{$tableName}.{$columnName} = ?", $value, $type);          
        }
        return $where;
    }
}