//table = "/factura/proyectoZend/public/index.php/parametricos/Usuarios/";
table = "/carboneria/public/index.php/parametricos/productos/";

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
       		"width" : 10,
       		"edittype" :'link',
       		"remove" : false,
       		"hidden" : false,
       		"classes" : "linkjqgrid",
       		"formatter" :cargarLinkModificar
       },
       	  {
	       		"title" : false,
	       		"name" : "desc_sucursal",
	       		"label" : "Sucursal",
	       		"id" : "desc_sucursal",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 50,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : false
       		},
       	  {
	       		"title" : false,
	       		"name" : "desc_producto",
	       		"label" : "Producto",
	       		"id" : "desc_producto",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 90,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : false
       		},
       	  {
	       		"title" : false,
	       		"name" : "compra_producto",
	       		"label" : "Monto Compra",
	       		"id" : "compra_producto",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 90,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : false
       		},
               
       	  {
	       		"title" : false,
	       		"name" : "venta_producto",
	       		"label" : "Monto Venta",
	       		"id" : "venta_producto",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 90,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : false
       		},
       	  {
	       		"title" : false,
	       		"name" : "cod_producto",
	       		"label" : "cod_producto",
	       		"id" : "cod_producto",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 90,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : true
       		}
                ,
       	  {
	       		"title" : false,
	       		"name" : "cod_sucursal",
	       		"label" : "cod_sucursal",
	       		"id" : "cod_sucursal",
	       		"search" : false,
	       		"remove" : false,
	       		"width" : 30,
	       		"align":"left",
	       		"sortable" : false,
	       		"hidden" : true
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
/*
id
modificar
desc_sucursal
desc_producto
compra_producto
venta_producto
cod_producto
cod_sucursal    
1,,ALMASOL,producto 1,1000,2000,1,1 - {"codigo":"1","desc_producto":"1000","compra_producto":"2000","venta_producto":"1"}     
     **/

    parametros.codigo = rowObject[6];
    parametros.cod_sucursal = rowObject[7];
    parametros.desc_producto = rowObject[3];
    parametros.compra_producto = rowObject[4];
    parametros.venta_producto = rowObject[5];       
    json = JSON.stringify(parametros);
//alert(rowObject+' - '+json);    
    return "<a><img title='Editar' src='/factura/proyectoZend/public/css/images/edit.png' data-toggle='modal'  onclick='editarRegistro("+json+");'/></a>";
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
                rowNum: 10,
                rowList: [10, 20, 30],
                colModel: [
                    {
                        name: 'id_det_producto_descuento',
                        label: 'id_det_producto_descuento',
                        id: "id_det_producto_descuento",
                        hidden: true,
                        width: 2,
                        sorttype: "int"

                    },
                     {
                        name: 'cod_sucursal',
                        label: 'cod_sucursal',
                        id: "cod_sucursal",
                        hidden: true,
                        width: 2,
                        sorttype: "int"

                    },
                     {
                        name: 'cod_producto',
                        label: 'cod_producto',
                        id: "cod_producto",
                        hidden: true,
                        width: 2,
                        sorttype: "int"

                    },                    
                      {
                        name: 'cod_parametro',
                        label: 'cod_parametro',
                        id: "cod_parametro",
                        hidden: true,
                        width: 2,
                        sorttype: "int"

                    },                                                                              
                    {
                        name: 'desc_producto',
                        label: 'Producto',
                        id: "desc_producto",
                        hidden: true,
                        width: 12

                    },
                    {
                        name: 'forma_descuento_desc',
                        label: 'Forma Descuento',
                        id: "forma_descuento_desc",
                        hidden: false,
                        width: 12
                    },                    
                    {
                        name: 'tipo_descuento_desc',
                        label: 'Tipo Descuento',
                        id: "tipo_descuento_desc",
                        hidden: false,
                        width: 12
                    },
                    {
                        "title": false,
                        "name": 'desde_valor',
                        "label": 'Desde Valor',
                        "id": 'desde_valor',
                        "align": "center",
                        "hidden": false,
                        width: 8,
                         sorttype: "int"
                    },
                    {
                        "title": false,
                        "name": 'hasta_valor',
                        "label": 'Hasta Valor',
                        "id": 'hasta_valor',
                        "align": "center",
                        "hidden": false,
                        width: 8,
                        sorttype: "int"
                    },
                    {
                        "title": false,
                        "name": 'valor_descuento',
                        "label": 'Descuento',
                        "id": 'valor_descuento',
                        "align": "center",
                        "sortable": false,
                        "hidden": false,
                        width: 8
                    }
                ],
                sortname: 'desc_producto',
                grouping: false,
                groupingView: {
                    groupField: ['desc_producto'],
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