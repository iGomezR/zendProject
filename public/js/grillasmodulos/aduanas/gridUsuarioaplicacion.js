table = "/factura/proyectoZend/public/index.php/aduanas/usuarioaplicacion/";
//table = "/proyectoZend/public/index.php/aduanas/usuarioaplicacion/";

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
                    "name": "id_usuario_aplicacion",
                    "label": "ID",
                    "id": "id_usuario_aplicacion",
                    "width": 5,
                    "align": "right",
                    "hidden": false
                },{
                    "name": "cod_grupo_usuario",
                    "label": "MODULO APLICACION",
                    "id": "cod_grupo_usuario",
                    "width": 9,
                    "align": "right",
                    "hidden": true
                },{
                    "name": "cod_usuario",
                    "label": "COD USUARIO",
                    "id": "cod_usuario",
                    "width": 9,
                    "align": "right",
                    "hidden": true
                },{
                    "name": "user",
                    "label": "USUARIO",
                    "id": "user",
                    "width": 13,
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
                    "name": "insert",
                    "label": "AGREGAR",
                    "id": "insert",
                    "width": 5,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "update",
                    "label":"MODIFICAR",
                    "id": "update",
                    "width": 5,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "delete",
                    "label": "BORRAR",
                    "id": "delete",
                    "width": 5,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "list",
                    "label": "LISTAR",
                    "id": "list",
                    "width": 5,
                    "align": "center",
                    "hidden": false
                },{
                    "name": "otros",
                    "label": "OTROS",
                    "id": "otros",
                    "width": 5,
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
                id_registro = $("#grillaRegistro").jqGrid('getCell', id, 'id_usuario_aplicacion');                    
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
    parametros.id_usuario_aplicacion= rowObject[1];
    parametros.cod_grupo_usuario= rowObject[2];
    parametros.cod_usuario= rowObject[3];
    parametros.user= rowObject[4];
    parametros.cod_aplicacion= rowObject[5];
    parametros.desc_aplicacion= rowObject[6];
    parametros.insert= rowObject[7];
    parametros.update= rowObject[8];
    parametros.delete= rowObject[9];
    parametros.list= rowObject[10];
    parametros.otros= rowObject[11];
  

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
                    "name": "usuarioid",
                    "label": "ID USER",
                    "id": "usuarioid",
                    "width": 5,
                    "align": "right",
                    "hidden": false
                },{
                    "name": "usuarioname",
                    "label": "USER",
                    "id": "usuarioname",
                    "width": 18,
                    "align": "left",
                    "hidden": false
                },{
                    "name": "aplicacioncod",
                    "label": "COD APLI",
                    "id": "aplicacioncod",
                    "width": 8,
                    "align": "right",
                    "hidden": true
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
                    "label": "MODIFICAR",
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

