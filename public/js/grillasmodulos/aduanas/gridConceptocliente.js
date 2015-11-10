table = "/factura/proyectoZend/public/index.php/aduanas/conceptocliente/";
//table = "/proyectoZend/public/index.php/aduanas/conceptocliente/";
//campos = new Array('Id Registro', 'Descripcion');
//camposId = new Array('cod_centro_costos_cta_cliente', 'desc_centro_costos_cta_cliente');

$(document).ready(function() {
    cargarGrillaRegistro();
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
                    },
                    {
                        "title": false,
                        "name": "cod_concepto_cta_cliente",
                        "label": "Codigo concepto",
                        "id": "cod_concepto_cta_cliente",
                        "sortable": false,
                        "width": 12,
                        "align": "right",
                        "search": false,
                        "remove": false,
                        "hidden": false
                    },
                    {
                        "title": false,
                        "name": "desc_concepto_cta_cliente",
                        "label": "Descripcion Concepto cuenta",
                        "id": "desc_concepto_cta_cliente",
                        "width": 90,
                        "sortable": false,
                        "align": "left",
                        "search": false,
                        "remove": false,
                        "hidden": false
                    },
                    {
                        "title": false,
                        "name": "borrado",
                        "label": "Borrado",
                        "id": "borrado",
                        "search": false,
                        "remove": false,
                        "width": 90,
                        "align": "left",
                        "sortable": false,
                        "hidden": true
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
function borrar() {
    var id = $("#grillaRegistro").jqGrid('getGridParam', 'selrow');
    
//    id = $("#grillaRegistro").jqGrid('getCell', id, "cod_centro_costos_cta_cliente");
//    alert(id);
    if (id == false) {
        alert("Para eliminar un registro debe seleccionarlo previamente.");
    } else {
        if (!confirm("?Esta seguro de que desea eliminar el registro seleccionado?"))
            return;
    var jsonObject = new Object();
       
    jsonObject.cod_concepto_cta_cliente = $("#grillaRegistro").jqGrid('getCell', id, 'cod_concepto_cta_cliente');
    jsonObject.desc_concepto_cta_cliente = $("#grillaRegistro").jqGrid('getCell', id, 'desc_concepto_cta_cliente');
    jsonObject.borrado = 1;
    
    var dataString = JSON.stringify(jsonObject);

	
        
        $.ajax({
            url: table + 'modificar',
            type: 'post',
            data: {"parametros":dataString},
            dataType: 'json',
            async: false,
            success: function(data) {
                if (data.result == "ERROR") {
                    if (data.mensaje == 23504) {
                        mostarVentana("warning-registro-listado", "No se puede eliminar el Registro por que esta siendo utilizado");
                    } else {
                        mostarVentana("warning-registro-listado", "Ha ocurrido un error");
                    }
                } else {
                    mostarVentana("success-registro-listado", "Los datos han sido eliminados exitosamente");
                    $("#grillaRegistro").trigger("reloadGrid");
                }
            },
            error: function(event, request, settings) {
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
    parametros.cod_concepto_cta_cliente = rowObject[1];
    parametros.desc_concepto_cta_cliente = rowObject[2];
    parametros.borrado = rowObject[3];
  

    json = JSON.stringify(parametros);
    return "<a><img title='Editar' src='/factura/proyectoZend/public/css/images/edit.png' data-toggle='modal'  onclick='editarRegistro(" + json + ");'/></a>";
//    return "<a><img title='Editar' src='/proyectoZend/public/css/images/edit.png' data-toggle='modal'  onclick='editarRegistro(" + json + ");'/></a>";
}







