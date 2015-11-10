agrupamientoGrids = "";
primeraVez = true;
$(document).ready(function(){
	cargarGrillaPeriodos();
});

/**
 * Carga un tooltip a la columna especificada
 *
 * @param grid grilla en la cual se desea insertar un tooltip a alguna de sus columnas	
 * @param iColumn	id de la columna que se desea modificar	
 * @param text	es el texto que se exhibe en el tooltip de la columna	
 */
function setTooltipsOnColumnHeader(grid, iColumn, text){
    var thd = jQuery("thead:first", grid[0].grid.hDiv)[0];  
    jQuery("tr.ui-jqgrid-labels th:eq(" + iColumn + ")", thd).attr("title", text);
}
/**
 * Bloquea la pantalla a trav�s de un contenedor de tal manera que el usuario no pueda realizar ninguna acci�n
 */
function bloquearPantalla() {
	$.blockUI({message: "Aguarde un momento por favor"});
}
/**
 * Desbloquea la pantalla de tal manera que el usuario pueda realizar acci�nes o invocar eventos en la vista
 */
function desbloquearPantalla() {
    $.unblockUI();
}
/**
 * Carga la tabla visual con el listado de Periodos. La estructura de la tabla es especificada.
 */
function cargarGrillaPeriodos() {
	jQuery("#grillaPeriodos").jqGrid({        
		"url":"/parametricos/periodo/listar",
		"mtype" : "POST",
       	"refresh": true,
       	"datatype" :"json",
       	"height" : "auto",
       	"rownumbers" : false,
        "ExpandColumn": "menu",
        "autowidth": true,
       	"gridview" : true,
       	"multiselect" : false,
       	"viewrecords" : true,
       	"rowNum":10,
       	"formatter": null,
       	"rowList":[10,20,30],
       	"pager": '#paginadorPeriodos',
        "viewrecords": true,
        "beforeRequest" : bloquearPantalla,
        //"colNames":['modificar','nombre', 'sigla', 'porcentaje','montofijo','tipoaplicacion','empresa','sucursal'],
        "loadComplete": desbloquearPantalla, 
       	"colModel":
       	[ {
       		"title" : false,
       		"name" : "id",
       		"label" : " ",
       		"id" : "id",
       		"sortable" : false,
       		"align":"right",
       		"search" : false,
       		"remove" : false,
       		"hidden" : true
       	   },
       	    {
       		"title" : false,
       		"name" : "modificar",
       		"label" : " ",
       		"id" : "modificar",
       		"align":"right",
       		"search" : false,
       		"sortable" : false,
       		"width" : 5,
       		"edittype" :'link',
       		"remove" : false,
       		"hidden" : false,
       		"classes" : "linkjqgrid",
       		"formatter" :cargarLinkModificar
       },
       {
	       		"title" : false,
	       		"name" : "nombre",
	       		"label" : "Descripcion",
	       		"id" : "nombre",
	       		"width" : 150,
	       		"sortable" : false,
	       		"align":"left",
	       		"search" : false,
	       		"remove" : false,
	       		"hidden" : false
       	  },
       	  {
	       		"title" : false,
	       		"name" : "cantidaddias",
	       		"label" : "Cantidad de dias",
	       		"id" : "cantidaddias",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 20,
	       		"align":"right",
	       		"sortable" : false,
	       		"hidden" : false
       		}]
    }).navGrid('#paginadorPeriodos',{
        add:false,
        edit:false,
        del:false,
        view:true,
        search:false,
        refresh:false});
	$("#grillaPeriodos").setGridWidth($('#contenedor').width());
	
	$("#grillaPeriodos").jqGrid('navButtonAdd','#paginadorPeriodos',{
		buttonicon :'ui-icon-trash',
		caption: "",
		title: "Eliminar fila seleccionada",
		onClickButton : function (){ 
			borrar();	//Funcion de borrar 
		} 
	}); 
}
/**
 * Elimina una fila de la tabla visual de Periodos
 */
function borrar(){
	var id = $("#grillaPeriodos").jqGrid('getGridParam','selrow'); 
	id = $("#grillaPeriodos").jqGrid('getCell', id, 'id');
	if( id == false ){
		alert("Para eliminar un registro debe seleccionarlo previamente."); 
	}else{
		if(!confirm("�Esta seguro de que desea eliminar el registro seleccionado?"))
			return; 

		$.ajax({
	        url: '/parametricos/periodo/eliminar',
	        type: 'post',
	        data: {"id":id},
	        dataType: 'json',
	        async : false,
	        success: function(data){
	        	if(data.result == "ERROR"){
					if(data.mensaje == 23504) {
						mostarVentana("warning-periodo-listado","No se puede eliminar el Periodo por que esta siendo utilizado");
			        } else {
			        	mostarVentana("warning-periodo-listado","Ha ocurrido un error");
				    }
				} else {
					mostarVentana("success-periodo-listado","Los datos han sido eliminados exitosamente");
				    $("#grillaPeriodos").trigger("reloadGrid");
				}
	        },
	        error: function(event, request, settings){
	            $.unblockUI();
	            alert("Ha ocurrido un error");
	        }
	    });
	}
	return false;
}
/**
 * M�todo que carga la funcionalidad de Edici�n de filas de la tabla visual de Periodos
 */
function cargarLinkModificar ( cellvalue, options, rowObject )
{
	var parametros = new Object();
	parametros.id = rowObject[0];
	parametros.descripcionperiodo = rowObject[2];
	parametros.diasperiodo = rowObject[3];
	json = JSON.stringify(parametros);
	return "<a><img title='Editar' src='/css/images/edit.png' data-toggle='modal'  onclick='editarPeriodo("+json+");'/></a>";
}
