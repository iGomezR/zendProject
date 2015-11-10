<?php
/**
 *
 * @author ANDRE
 * @version 
 */
require_once 'Zend/View/Interface.php';
/**
 * DateHelper helper
 *
 * @uses viewHelper Zend_View_Helper
 */
class Application_View_Helper_Date  extends Zend_View_Helper_Abstract
{
    /**
     * @var Zend_View_Interface extends Zend_View_Helper_Abstract
     */
    public $view;
    /**
     * 
     */
    public static function dateHelper ($_idElement)
    {
		$scr = 	'<input name="'. $_idElement.'" id="'. $_idElement.'" style="width:75px"> </input>'
				.'<script> '.
			   		'$(function() {	 '. 
				   		'$("#'. $_idElement.'").datepicker();'.
						'$("#'. $_idElement.'").datepicker( "option", "dateFormat", "dd-mm-yy");'.
						'$("#'. $_idElement.'").datepicker({changeYear:false});'.
						'$("#'. $_idElement.'").datepicker("setDate", new Date() );'.
					'});' .
				'</script> ';
				    	
        return $scr;
    }
    /**
     * Sets the view field 
     * @param $view Zend_View_Interface
     */
    public function setView (Zend_View_Interface $view)
    {

        $this->view = $view;
    }
}
