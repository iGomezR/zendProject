table = "/factura/proyectoZend/public/index.php/aduanas/detallegruposusuario/";
//table = "/proyectoZend/public/index.php/aduanas/detallegruposusuario/";

$(document).ready(function() {
    cargarGrillaRegistro();
    cargarGrillaModal();
    
   
});

/**
 * Carga un tooltip a la columna especificada
 *
 * @param grid grilla en la cual se desea insertar un tooltip a alguna de sus columnas
 * @param iColumn	id de la columna que se desea modificar
 * @param text	es el texto que se exhibe en el tooltip de la columna
 */
function setTooltipsOnColumnHeader(grid, iColumn, text) {
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
        "url": table + 'listar',
        "mtype": "POST",
//    datatype : "local",
        "refresh": true,
        "datatype": "json",
        "height": "auto",
        "rownumbers": false,
        "ExpandColumn": "menu",
        "autowidth": true,
        "gridview": true,
        "multiselect": false,
        "viewrecords": true,
        "rowNum": 10,
        "formatter": null,
        "rowList": [10, 20, 30],
        "pager": '#paginadorRegistro',
        "viewrecords": true,
                "beforeRequest": bloquearPantalla,
        //"colNames":['modificar','nombre', 'sigla', 'porcentaje','montofijo','tipoaplicacion','empresa','sucursal'],
        "loadComplete": desbloquearPantalla,
        "colModel":
                [
                    {
                        "title": false,
                        "name": "modificar",
                        "label": " ",
                        "id": "modificar",
                        "align": "right",
                        "search": false,
                        "sortable": false,
                        "width": 1,
                        "edittype": 'link',
                        "remove": false,
                        "hidden": false,
                        "classes": "linkjqgrid",
                        "formatter": cargarLinkModificar
                    },{
                    "name": "id_det_grupo_usuario",
                    "label": "CODIGO",
                    "id": "id_det_grupo_usuario",
                    "width": 5,
                    "align": "right",
                    "hidden": false
                },{
                    "name": "cod_grupo_usuario",
                    "label": "COD_GRUP",
                    "id": "cod_grupo_usuario",
                    "width": 5,
                    "align": "right",
                    "hidden": true
                },{
                    "name": "desc_grupo_usuario",
                    "label": "GRUPO",
                    "id": "desc_grupo_usuario",
                    "width": 18,
                    "align": "left",
                    "hidden": false
                },{
                    "name": "cod_aplicacion",
                    "label": "COD APLI",
                    "id": "cod_aplicacion",
                    "width": 8,
                    "align": "right",
                    "hidden": true
                },{
                    "name": "desc_aplicacion",
                    "label": "APLICACION",
                    "id": "desc_aplicacion",
                    "width": 18,
                    "align": "left",
                    "hidden": false
                },{
                    "name": "permiso_insert",
                    "label": "AGREGAR",
                    "id": "permiso_insert",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "permiso_update",
                    "label":"MODIFICAR",
                    "id": "permiso_update",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "permiso_delete",
                    "label": "BORRAR",
                    "id": "permiso_delete",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "permiso_list",
                    "label": "LISTAR",
                    "id": "permiso_list",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "permiso_otros",
                    "label": "OTROS",
                    "id": "permiso_otros",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                }
                    
                   
                ]
    }).navGrid('#paginadorRegistro', {
        add: false,
        edit: false,
        del: false,
        view: true,
        search: false,
        refresh: false});
    $("#grillaRegistro").setGridWidth($('#contenedor').width());

    $("#grillaRegistro").jqGrid('navButtonAdd', '#paginadorRegistro', {
        buttonicon: 'ui-icon-trash',
        caption: "",
        id: "eliminar",
        title: "Eliminar fila seleccionada",
        onClickButton: function() {
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
                id_registro = $("#grillaRegistro").jqGrid('getCell', id, 'id_det_grupo_usuario');                    
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

function cargarLinkModificar(cellvalue, options, rowObject)
{
    var parametros = new Object();
    parametros.id_det_grupo_usuario= rowObject[1];
    parametros.cod_grupo_usuario= rowObject[2];
    parametros.desc_grupo_usuario= rowObject[3];
    parametros.cod_aplicacion= rowObject[4];
    parametros.desc_aplicacion= rowObject[5];
    parametros.permiso_insert= rowObject[6];
    parametros.permiso_update= rowObject[7];
    parametros.permiso_delete= rowObject[8];
    parametros.permiso_list= rowObject[9];
    parametros.permiso_otros= rowObject[10];
 

    json = JSON.stringify(parametros);
    return "<a><img title='Editar' src='/factura/proyectoZend/public/css/images/edit.png' data-toggle='modal'  onclick='editarRegistro(" + json + ");'/></a>";
//    return "<a><img title='Editar' src='/proyectoZend/public/css/images/edit.png' data-toggle='modal'  onclick='editarRegistro(" + json + ");'/></a>";
}

function widthOfGrid(){
      var windowsWidth = $(window).width();
      var gridWidth = ((62*90*windowsWidth)/(100*100));
      return gridWidth;
}

function cargarGrillaModal() {
    jQuery("#grillaModal").jqGrid({
         datatype : "local",
        "refresh": true,
        "height": "auto",
        "rownumbers": false,
        "ExpandColumn": "menu",
        "autowidth": true,
        "gridview": true,
        "multiselect": false,
        "viewrecords": true,
        "rowNum": 5,
        "rowList": [10, 20, 30],
        "pager": '#PaginadorModal',
        "beforeRequest": bloquearPantalla,
        "loadComplete": desbloquearPantalla,
        "colModel":
                [{
                    "name": "grupoid",
                    "label": "ID GRUP",
                    "id": "grupoid",
                    "width": 5,
                    "align": "right",
                    "hidden": false
                },{
                    "name": "gruponame",
                    "label": "GRUPO",
                    "id": "gruponame",
                    "width": 18,
                    "align": "left",
                    "hidden": false
                },{
                    "name": "aplicacioncod",
                    "label": "COD APLI",
                    "id": "aplicacioncod",
                    "width": 8,
                    "align": "right",
                    "hidden": false
                },{
                    "name": "aplicacioncodmodulo",
                    "label": "MOD APLI",
                    "id": "aplicacioncodmodulo",
                    "width": 8,
                    "align": "right",
                    "hidden": true
                },{
                    "name": "aplicacionname",
                    "label": "APLICACION",
                    "id": "aplicacionname",
                    "width": 18,
                    "align": "left",
                    "hidden": false
                },{
                    "name": "update",
                    "label": "MOD",
                    "id": "update",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "delete",
                    "label":"BORRAR",
                    "id": "delete",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "list",
                    "label": "LIST",
                    "id": "list",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "insert",
                    "label": "AGREGAR",
                    "id": "insert",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "otros",
                    "label": "OTROS",
                    "id": "otros",
                    "width": 6,
                    "align": "center",
                    "hidden": false
                }
                   
                ]
    }).navGrid('#PaginadorModal', {
        add: false,
        edit: false,
        del: false,
        view: true,
        search: false,
        refresh: false});
//    $("#grillaModal").setGridWidth($('#contendedor-grilla-modal').width());
    $("#grillaModal").jqGrid('setGridWidth', widthOfGrid(), true);
    
    $("#grillaModal").jqGrid('navButtonAdd', '#PaginadorModal', {
        buttonicon: 'ui-icon-trash',
        caption: "",
        id: "eliminarModal",
        title: "Eliminar fila seleccionada",
        onClickButton: function() {
            borrarModal();	//Funcion de borrar
        }
    });
        
}


function borrarModal() {
	var fila = $("#grillaModal").jqGrid('getGridParam', 'selrow');
	$('#grillaModal').jqGrid('delRowData',fila);
	return;
}

