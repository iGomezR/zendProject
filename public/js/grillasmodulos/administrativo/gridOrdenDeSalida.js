//table = "/factura/proyectoZend/public/index.php/administrativo/Usuarios/";
table = "/carboneria/public/index.php/administrativo/ordendesalida/";

$(document).ready(function(){
	cargarGrillaRegistro();
        cargarGrillaDetalleModal();
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
       	[  {
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
       		"width" : 2,
       		"edittype" :'link',
       		"remove" : false,
       		"hidden" : false,
       		"classes" : "linkjqgrid",
       		"formatter" :cargarLinkModificar
          },      
       	  {
	       		"title" : false,
	       		"name" : "nro_orden_de_entrada",
	       		"label" : "Orden de Entrada",
	       		"id" : "nro_orden_de_entrada",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 50,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : false
       		},
                {
	       		"title" : false,
	       		"name" : "desc_proveedor",
	       		"label" : "Proveedor",
	       		"id" : "desc_proveedor",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 90,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : false
       		},                
                {
	       		"title" : false,
	       		"name" : "fecha_registro",
	       		"label" : "Fecha Entrada",
	       		"id" : "fecha_registro",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 90,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : false
       		},
                {
	       		"title" : false,
	       		"name" : "cod_proveedor",
	       		"label" : "cod_proveedor",
	       		"id" : "cod_proveedor",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 90,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : true
       		},
                {
	       		"title" : false,
	       		"name" : "peso_tara",
	       		"label" : "peso_tara",
	       		"id" : "peso_tara",
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
	id = $("#grillaRegistro").jqGrid('getCell', id, 'id');
	if( id == false ){
		alert("Para eliminar un registro debe seleccionarlo previamente.");
	}else{
		if(!confirm("?Esta seguro de que desea eliminar el registro seleccionado?"))
			return;

		$.ajax({
	        url: table+'eliminar',
	        type: 'post',
	        data: {"id":id},
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
 * M?todo que carga la funcionalidad de Edici?n de filas de la tabla visual del registro anda
 */
function cargarLinkModificar ( cellvalue, options, rowObject )
{
    var parametros = new Object();          
    parametros.codigo = rowObject[0];
    parametros.peso_tara = rowObject[6];
    json = JSON.stringify(parametros);
//alert(rowObject+' - '+json);    
    return "<a><img title='Editar' src='../../css/images/edit.png' data-toggle='modal'  onclick='editarRegistro("+json+");'/></a>";
    //	return "<a><img title='Editar' src='/proyectoZend/public/css/images/edit.png' data-toggle='modal'  onclick='editarRegistro("+json+");'/></a>";
}

function cargarGrillaDetalleModal() {
    jQuery("#grillaDetalleModal").jqGrid(
            {
                datatype: "local",
                beforeRequest: bloquearPantalla,
                loadComplete: function() {
                    $.unblockUI();
                },
                serializeGridData: function() {
                },
                refresh: true,
                formatter: null,
                ExpandColumn: true,
                width: null,
                height: "auto",
                gridview: false,
                pager: '#paginadorDetalleModal',
                multiselect: false,
                viewrecords: true,
                autowidth: true,
                rowNum: 4,
                //rowList: [10, 20, 30],
                colModel: [
                    {
                        name: 'id_orden_de_analisis',
                        label: 'id_orden_de_analisis',
                        id: "id_orden_de_analisis",
                        hidden: true,
                        width: 2,
                        sorttype: "int"

                    },
                     {
                        name: 'cod_cargamento',
                        label: 'cod_cargamento',
                        id: "cod_cargamento",
                        hidden: true,
                        width: 2,
                        sorttype: "int"

                    },
                    {
                        name: 'desc_clave_parametro',
                        label: 'Tipo de Analisis',
                        id: "desc_clave_parametro",
                        hidden: false,
                        width: 12
                    },                    
                    {
                        name: 'clave_parametro',
                        label: 'clave_parametro',
                        id: "clave_parametro",
                        hidden: true,
                        width: 12
                    },
                    {
                        "title": false,
                        "name": 'resultado_analisis',
                        "label": 'Resultado Analisis',
                        "id": 'resultado_analisis',
                        "align": "center",
                        "hidden": false,
                        width: 8,
                         sorttype: "int"
                    }
                ],
                sortname: 'desc_clave_parametro',
                grouping: false,
                groupingView: {
                    groupField: ['desc_clave_parametro'],
                    groupSummary: [true],
                    groupColumnShow: [true],
                    groupCollapse: false,
                    groupOrder: ['asc']
                }

            }).navGrid('#paginadorDetalleModal', {
        add: false,
        edit: false,
        del: false,
        view: false,
        search: false,
        refresh: false});

//	$("#grillaDetalleModal").setGridWidth('100%');
    $("#grillaDetalleModal").jqGrid('setGridWidth', widthOfGrid(), true);

    

}
function widthOfGrid() {
    var windowsWidth = $(window).width();
    var gridWidth = ((70 * 94 * windowsWidth) / (100 * 100));
    return gridWidth;
}