agrupamientoGrids = "";
primeraVez = true;
table = "/factura/proyectoZend/public/index.php/aduanas/registroctacliente/";
campos = new Array('Id Registro','Fecha','Moneda','Cotizacion','Cliente','Clase Liq.','Nro. Liq.','Concepto','Centro','Valor');
camposId = new Array('id_registro','fecha_registro','desc_moneda','cotizacion','desc_cliente','clase_liquidacion',
'nro_liquidacion','desc_concepto_cta_cliente','desc_centro_costos_cta_cliente','valor','cod_moneda','cod_cliente',
'cod_concepto_cta_cliente','cod_centro_costos_cta_cliente');

$(document).ready(function(){
	cargarGrillaRegistro();
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
 * Bloquea la pantalla a trav?s de un contenedor de tal manera que el usuario no pueda realizar ninguna acci?n
 */
function bloquearPantalla() {
	$.blockUI({message: "Aguarde un momento por favor"});
}
/**
 * Desbloquea la pantalla de tal manera que el usuario pueda realizar acci?nes o invocar eventos en la vista
 */
function desbloquearPantalla() {
    $.unblockUI();
}
/**
 * Carga la tabla visual con el listado de registros. La estructura de la tabla es especificada.
 */
function cargarGrillaRegistro() {
	jQuery("#grillaRegistro").jqGrid({
		"url":table+'listar',
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
       	"pager": '#paginadorRegistro',
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
        "name" : camposId[0],
        "label" : campos[0],
        "id" : camposId[0],
        "width" : 90,
        "sortable" : false,
        "align":"left",
        "search" : false,
        "remove" : false,
        "hidden" : false
       },
       {
        "title" : false,
        "name" : camposId[3],
        "label" : campos[1],
        "id" : camposId[3],
        "search" : false,
        "remove" : false,
        "width" : 90,
        "align":"left",
        "sortable" : false,
        "hidden" : false
       	},
       {
        "title" : false,
        "name" : camposId[10],
        "label" : campos[2],
        "id" : camposId[10],
        "search" : false,
        "remove" : false,
        "width" : 90,
        "align":"left",
        "sortable" : false,
        "hidden" : false
       	},
       {
        "title" : false,
        "name" : camposId[3],
        "label" : campos[3],
        "id" : camposId[3],
        "search" : false,
        "remove" : false,
        "width" : 90,
        "align":"left",
        "sortable" : false,
        "hidden" : false
       	},
       {
        "title" : false,
        "name" : camposId[4],
        "label" : campos[4],
        "id" : camposId[4],
        "search" : false,
        "remove" : false,
        "width" : 90,
        "align":"left",
        "sortable" : false,
        "hidden" : false
       	},
       {
        "title" : false,
        "name" : camposId[5],
        "label" : campos[5],
        "id" : camposId[5],
        "search" : false,
        "remove" : false,
        "width" : 90,
        "align":"left",
        "sortable" : false,
        "hidden" : false
       	},
       {
        "title" : false,
        "name" : camposId[6],
        "label" : campos[6],
        "id" : camposId[6],
        "search" : false,
        "remove" : false,
        "width" : 90,
        "align":"left",
        "sortable" : false,
        "hidden" : false
       	},
       {
        "title" : false,
        "name" : camposId[7],
        "label" : campos[7],
        "id" : camposId[7],
        "search" : false,
        "remove" : false,
        "width" : 90,
        "align":"left",
        "sortable" : false,
        "hidden" : false
       	},
       {
        "title" : false,
        "name" : camposId[8],
        "label" : campos[8],
        "id" : camposId[8],
        "search" : false,
        "remove" : false,
        "width" : 90,
        "align":"left",
        "sortable" : false,
        "hidden" : false
       	},
       {
        "title" : false,
        "name" : camposId[9],
        "label" : campos[9],
        "id" : camposId[9],
        "search" : false,
        "remove" : false,
        "width" : 90,
        "align":"left",
        "sortable" : false,
        "hidden" : false
       	}                        
     ]
    }).navGrid('#paginadorRegistro',{
        add:false,
        edit:false,
        del:false,
        view:true,
        search:false,
        refresh:false});
	$("#grillaRegistro").setGridWidth($('#contenedor').width());

	$("#grillaRegistro").jqGrid('navButtonAdd','#paginadorRegistro',{
		buttonicon :'ui-icon-trash',
		caption: "",
		title: "Eliminar fila seleccionada",
		onClickButton : function (){
			borrar();	//Funcion de borrar
		}
	});
}
/**
 * Elimina una fila de la tabla visual de registros
 */
function borrar(){
	var id = $("#grillaRegistro").jqGrid('getGridParam','selrow');	        
	if( id == false ){
		alert("Para eliminar un registro debe seleccionarlo previamente.");
	}else{
		if(!confirm("?Esta seguro de que desea eliminar el registro seleccionado?"))
			return;
                id_registro = $("#grillaRegistro").jqGrid('getCell', id, 'id_registro');                    
		$.ajax({
	        url: table+'eliminar',
	        type: 'post',
	        data: {"id":id_registro},
	        dataType: 'json',
	        async : false,
	        success: function(data){
	        	if(data.result == "ERROR"){
                                if(data.mensaje == 23504) {
                                        mostarVentana("warning-registro-listado","No se puede eliminar el Registro por que esta siendo utilizado");
			        } else {
			        	mostarVentana("warning-registro-listado","Ha ocurrido un error");
				    }
				} else {
					mostarVentana("success-registro-listado","Los datos han sido eliminados exitosamente");
				    $("#grillaRegistro").trigger("reloadGrid");
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
 * M?todo que carga la funcionalidad de Edici?n de filas de la tabla visual del registro
 */
function cargarLinkModificar ( cellvalue, options, rowObject )
{
	var parametros = new Object();
        parametros.idRegistro = rowObject[2];
        parametros.fechaRegistro = rowObject[3];
        parametros.modena = rowObject[14];
        parametros.cotizacion = rowObject[5];
        parametros.cliente = rowObject[15];
        parametros.clase = rowObject[18];
        parametros.nroLiquidacion = rowObject[8];
        parametros.concepto = rowObject[16];
        parametros.centro = rowObject[17];
        parametros.valor = rowObject[11];
        parametros.observacion = rowObject[19];
        parametros.codusuario = rowObject[12];
        parametros.borrado = rowObject[13];
        
	json = JSON.stringify(parametros);
	return "<a><img title='Editar' src='/factura/proyectoZend/public/css/images/edit.png' data-toggle='modal'  onclick='editarRegistro("+json+");'/></a>";
}





