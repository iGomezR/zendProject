table = "/parametricos/Productos/";
mensajeWarning = new Array(
        "id-registro",
        "Complete el Id de Usuario por favor",
        "Complete el Nombre y Apellido por favor",
        "Ingrese Password",
        "Grupo Usuario",
        "Seleccione Grupo Usuario",
        "Confirme el password");
idCamposBusqueda = new Array("descripcionBusqueda");
idCamposGrilla = new Array("id-registro","desc_sucursal-modal","desc_producto-modal","compra_producto-modal",
                            "venta_producto-modal","cod_producto-modal","cod_sucursal-modal");
var jsonObjectRequest = new Object();  
$().ready(function() {
    loadAutocomplete();
    cargarSucursal();
    cargarParametrosDescuentos();
	$("#buscarregistro").click(function() {            
		 buscarRegistros();
	 });

	$("#cerrar-bot").click(function() {
		$("#modalEditar").hide();
                $("#grillaDetalleModal").jqGrid("clearGridData");
	});

	$("#cancelar-bot").click(function() {
		$("#modalEditar").hide();
                $("#grillaDetalleModal").jqGrid("clearGridData");
	});

	$('#modalEditar').modal({backdrop:false,show:false});



	$("#nuevoregistro").click(function() {
                jsonObjectRequest.detalles = new Array();
		$('#modalEditar').show();
                $('#divDatosDetalle').hide();                
		$('#'+idCamposGrilla[0]).attr("value",null);
		$('#accion').attr("value","nuevo");
		$("#guardar-registro").html("Guardar");
                $("#guardar-registro").hide();
		$("#editar-nuevo").html("Nuevo Registro"); 
                $("#labelDescuentos").html("Descuentos");                 
                $('#'+idCamposGrilla[1]).attr("disabled", false);
                $('#'+idCamposGrilla[2]).attr("disabled", false);
                $('#'+idCamposGrilla[3]).attr("disabled", false);
                $('#'+idCamposGrilla[4]).attr("disabled", false);                
		limpiarFormulario();
	});
        
	$('#guardar-registro').click(function() {
		 if(!confirm("Esta seguro de que desea almacenar los datos?"))
				return;
		 var data = obtenerJsonFormulario();                 
		if(data != null){
			enviarParametrosRegistro(data);
		}
	 });


	validarNumerosCampo();
	$("#addCabecera").click(function() {     
            //var jsonObject = new Object();  
            if($('#desc_sucursal-modal').attr("value") == -1 || $('#desc_sucursal-modal').attr("value").length == 0){
                mostarVentana("warning-registro","Debe seleccionar una sucursal");
                $('#desc_sucursal-modal').focus();
            } else if($('#desc_producto-modal').attr("value") == null || $('#desc_producto-modal').attr("value").length == 0){
                mostarVentana("warning-registro","Ingrese una descripcion");
                $('#desc_producto-modal').focus();
            } else if($('#compra_producto-modal').attr("value") == '' || $('#compra_producto-modal').attr("value").length == 0){
                mostarVentana("warning-registro","Ingrese un monto de compra del producto");
                $('#compra_producto-modal').focus();
            }else if($("#venta_producto-modal").attr("value").length == 0 && $("#venta_producto-modal").attr("value").length == 0){
                mostarVentana("warning-registro","Ingrese un monto de venta del producto");
                $('#venta_producto-modal').focus();
            }
            else {
                jsonObjectRequest.codigo = $('#'+idCamposGrilla[0]).attr("value");
                jsonObjectRequest.cod_sucursal = $("#"+idCamposGrilla[1]+" option:selected").val();
                jsonObjectRequest.desc_producto = $('#'+idCamposGrilla[2]).attr("value");
                jsonObjectRequest.compra_producto = $('#'+idCamposGrilla[3]).attr("value");
                jsonObjectRequest.venta_producto = $('#'+idCamposGrilla[4]).attr("value");
                //jsonObject.desc_grupo_usuario= $("#"+idCamposGrilla[7]+" option:selected").text();            
                $('#'+idCamposGrilla[1]).attr("disabled", true);
                $('#'+idCamposGrilla[2]).attr("disabled", true);
                $('#'+idCamposGrilla[3]).attr("disabled", true);
                $('#'+idCamposGrilla[4]).attr("disabled", true);
                $('#divDatosDetalle').show();
                //return jsonObject;
            }           
        
	});
        $("#selectFormaDescuento").change(function() {
            if($("#selectFormaDescuento option:selected").val() == 'P'){
                $('#inputValorDesde').attr("disabled", false);
                $('#inputValorHasta').attr("disabled", false);                
            }
            if($("#selectFormaDescuento option:selected").val() == 'M'){
                $('#inputValorDesde').attr("disabled", true);
                $('#inputValorHasta').attr("disabled", true);               
            }
        });        
        $("#addDetalle").click(function() {
            if($('#selectFormaDescuento').attr("value") == -1 || $('#selectFormaDescuento').attr("value").length == 0){
                mostarVentana("warning-registro","Debe seleccionar una Forma de Descuento");
                $('#selectFormaDescuento').focus();
            } else if($('#selectParametroDescuento').attr("value") == -1 || $('#selectParametroDescuento').attr("value").length == 0){
                mostarVentana("warning-registro","Ingrese un Tipo de Descuento");
                $('#selectParametroDescuento').focus();
            } else if($('#selectFormaDescuento').attr("value") == 'P' && ($('#inputValorDesde').attr("value") == '' || 
                    $('#inputValorDesde').attr("value").length == 0)){
                mostarVentana("warning-registro","Ingrese un Valor Desde");
                $('#inputValorDesde').focus();
            }else if($('#selectFormaDescuento').attr("value") == 'P' && ($("#inputValorHasta").attr("value").length == 0 || 
                    $("#inputValorHasta").attr("value").length == 0)){
                mostarVentana("warning-registro","Ingrese un Valor Hasta");
                $('#inputValorHasta').focus();
            }else if($("#inputDescuento").attr("value").length == 0 || $("#inputDescuento").attr("value").length == 0){
                mostarVentana("warning-registro","Ingrese un Valor de Descuento");
                $('#inputDescuento').focus();
            }else{
                addItem();                          
                $('#selectFormaDescuento').attr("value",-1);              
                $('#selectParametroDescuento').attr("value",-1);
                $('#inputValorDesde').attr("value",'');
                $('#inputValorHasta').attr("value",'');
                $('#inputDescuento').attr("value",'');               
            }                        
        }); 
});

function loadAutocomplete() {
    $.getJSON("productos/productodata", function(data) {
        var descripcionGrupo= [];
          $(data).each(function(key, value) {
            
                $('#descripcionBusqueda').append($('<option>', { 
                    value: value.cod_producto,
                    text : value.desc_producto 
                }));
                 descripcionGrupo.push(value.desc_producto);
         });
   

    });
}
function validarNumerosLetrasPorcentageEspacio(e) { // 1
	var te;
	if(document.all) {
		if (e.keyCode==37) return false; // %
		if (e.keyCode==63) return false; // guion bajo
		if (e.keyCode==95) return false; // guion bajo
		if (e.keyCode==8) return true; // back spacebar
	    if (e.keyCode==32) return true; // space bar
	    te = String.fromCharCode(e.keyCode); // 5
	} else {
		if (e.which==37) return false; // %
		if (e.which==0) return true; // izquierda,derecha,arriba,abajo
		if (e.which==95) return false; // guion bajo
		if (e.which==8) return true; // back space bar
	    if (e.which==32) return true; // space bar
	    te = String.fromCharCode(e.which); // 5
	}
    patron = /\w/;

    return patron.test(te); // 6
}


function enviarParametrosRegistro(data){
//	$.blockUI({
//        message: "Aguarde un momento por favor"
//    });

	var urlenvio = '';
	if(data.codigo != null && data.codigo.length != 0){
		urlenvio = table+'modificar';
	}else {
		urlenvio = table+'guardar';
	}
	var dataString = JSON.stringify(data);
	$.ajax({
        url: urlenvio,
        type: 'post',
        data: {"parametros":dataString},
        dataType: 'json',
        async : true,
        success: function(respuesta){
        	if(respuesta == null){
        		mostarVentana("error","TIMEOUT");
        	} else if(respuesta.result == "EXITO") {
        		mostarVentana("success-registro-listado","Los datos han sido almacenados exitosamente");
        		$('#modalEditar').hide();
        		$("#grillaRegistro").trigger("reloadGrid");
        	} else if(respuesta.result == "ERROR") {
        		if(respuesta.mensaje == 23505){
        			mostarVentana("warning-registro","Ya existe un registro con la descripcion ingresada");
        		} else {
        			mostarVentana("error-modal","Ha ocurrido un error");
        		}
        	}
        	$.unblockUI();
        },
        error: function(event, request, settings){
        	mostarVentana("error-registro-listado","Ha ocurrido un error");
    		$.unblockUI();
        }
    });
}


function obtenerJsonFormulario() {              
    return jsonObjectRequest;
}
function ocultarSuccessBlock(){
	$("#success-block").hide(500);
}

function ocultarInfoClean(){
	$("#info-block-listado").hide(500);
}

function ocultarErrorBlock(){
	$("#error-block").hide(500);
}

function ocultarErrorBlockList(){
	$("#error-block-registro-listado").hide(500);
}

function ocultarErrorBlockModal(){
	$("#error-block-modal").hide(500);
}

function ocultarWarningBlock(){
	$("#warning-block").hide(500);
}

function ocultarWarningBlockTitle(){
	$("#warning-block-registro-listado").hide(500);
}

function ocultarSuccessBlockTitle(){
	$("#success-block-registro-listado").hide(500);
}

function ocultarWarningRegistroBlock(){
	$("#warning-block-registro").hide(500);
}

function mostarVentana(box,mensaje){
	$("#success-block").hide();
	$("#info-block-listado").hide();
	if(box == "warning") {
		$("#warning-message").text(mensaje);
		$("#warning-block").show();
		setTimeout("ocultarWarningBlock()",5000);
	} else if(box == "warning-registro-listado") {
		$("#warning-message-registro-listado").text(mensaje);
		$("#warning-block-registro-listado").show();
		setTimeout("ocultarWarningBlockTitle()",5000);
	} else if(box == "success-registro-listado") {
		$("#success-message-registro-listado").text(mensaje);
		$("#success-block-registro-listado").show();
		setTimeout("ocultarSuccessBlockTitle()",5000);
	} else if(box == "warning-registro") {
		$("#warning-message-registro").text(mensaje);
		$("#warning-block-registro").show();
		setTimeout("ocultarWarningRegistroBlock()",5000);
	}  else if(box == "info") {
		$("#info-message").text(mensaje);
		$("#info-block-listado").show(500);
		setTimeout("ocultarInfoClean()",5000);
	} else if(box == "error"){
		$("#error-block").text(mensaje);
		$("#error-block").show(500);
		setTimeout("ocultarErrorBlock()",5000);
	} else if(box == "error-registro-listado"){
		$("#error-block-registro-listado").text(mensaje);
		$("#error-block-registro-listado").show(500);
		setTimeout("ocultarErrorBlockList()",5000);
	} else if(box == "error-modal"){
		$("#error-block-modal").text(mensaje);
		$("#error-block-modal").show(500);
		setTimeout("ocultarErrorBlockModal()",5000);
	}
}

function validarNumerosCampo(){
	 $("#"+idCamposGrilla[3]).keydown(function(event) {
	        // Allow: backspace, delete, tab, escape, and enter
	        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
	             // Allow: Ctrl+A
	            (event.keyCode == 65 && event.ctrlKey === true) ||
	             // Allow: home, end, left, right
	            (event.keyCode >= 35 && event.keyCode <= 39)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        else {
	            // Ensure that it is a number and stop the keypress
	            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
	                event.preventDefault();
	            }
	        }
	    });
	 $("#"+idCamposGrilla[4]).keydown(function(event) {
	        // Allow: backspace, delete, tab, escape, and enter
	        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
	             // Allow: Ctrl+A
	            (event.keyCode == 65 && event.ctrlKey === true) ||
	             // Allow: home, end, left, right
	            (event.keyCode >= 35 && event.keyCode <= 39)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        else {
	            // Ensure that it is a number and stop the keypress
	            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
	                event.preventDefault();
	            }
	        }
	    });        
	 $("#inputValorDesde").keydown(function(event) {
	        // Allow: backspace, delete, tab, escape, and enter
	        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
	             // Allow: Ctrl+A
	            (event.keyCode == 65 && event.ctrlKey === true) ||
	             // Allow: home, end, left, right
	            (event.keyCode >= 35 && event.keyCode <= 39)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        else {
	            // Ensure that it is a number and stop the keypress
	            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
	                event.preventDefault();
	            }
	        }
	    });            
	 $("#inputValorHasta").keydown(function(event) {
	        // Allow: backspace, delete, tab, escape, and enter
	        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
	             // Allow: Ctrl+A
	            (event.keyCode == 65 && event.ctrlKey === true) ||
	             // Allow: home, end, left, right
	            (event.keyCode >= 35 && event.keyCode <= 39)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        else {
	            // Ensure that it is a number and stop the keypress
	            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
	                event.preventDefault();
	            }
	        }
	    });            
	 $("#inputDescuento").keydown(function(event) {
	        // Allow: backspace, delete, tab, escape, and enter
	        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
	             // Allow: Ctrl+A
	            (event.keyCode == 65 && event.ctrlKey === true) ||
	             // Allow: home, end, left, right
	            (event.keyCode >= 35 && event.keyCode <= 39)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        else {
	            // Ensure that it is a number and stop the keypress
	            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
	                event.preventDefault();
	            }
	        }
	    });                        
}

function buscarRegistros(){
	var dataJson = obtenerJsonBuscar();
	$.blockUI({
        message: "Aguarde un momento por favor"
        });
	$.ajax({
        url: table+'buscar',
        type: 'post',
        data: {"data":dataJson},
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#grillaRegistro")[0].addJSONData(JSON.parse(respuesta));
        	var obj = JSON.parse(respuesta);
        	if(obj.mensajeSinFilas == true){
        		mostarVentana("info","No se encontraron registros con los parametros ingresados");
        	}
        	$.unblockUI();
        },
        error: function(event, request, settings){
            $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });
}

function editarRegistro(parametros){
	limpiarFormulario();
        $("#grillaDetalleModal").jqGrid("clearGridData");
	$("#modalEditar").show();
	$("#editar-nuevo").html("Editar Registro");
        $('#accion').attr("value","editar");
	$("#"+idCamposGrilla[0]).attr("value",parametros.codigo);
        $("#"+idCamposGrilla[1]+" option[value="+parametros.cod_sucursal+"]").attr("selected",true);
	$("#"+idCamposGrilla[2]).attr("value",parametros.desc_producto);
	$("#"+idCamposGrilla[3]).attr("value",parametros.compra_producto);
        $("#"+idCamposGrilla[4]).attr("value",parametros.venta_producto);
       
/*         if(parametros.estado === 'Activo')
            $('input[name='+idCamposGrilla[4]+']').attr('checked', true);            
        else
            $('input[name='+idCamposGrilla[4]+']').attr('checked', false);
*/
        
	$("#guardar-registro").html("Modificar");
        $("#guardar-registro").hide();
        $.ajax({
            url: '/carboneria/public/index.php/parametricos/productos/modaleditar',
            type: 'post',
            data: {
                "NumeroInterno": parametros.codigo
            },
            dataType: 'json',
            async: false,
            success: function(respuesta) {
                for (var i = 0; i < respuesta.length; i++) {
                    var insertdetails = new Object();
                    insertdetails.id_det_producto_descuento =respuesta[i].id_det_producto_descuento;
                    insertdetails.cod_sucursal = respuesta[i].cod_sucursal;
                    insertdetails.cod_producto = respuesta[i].cod_producto;
                    insertdetails.cod_parametro = respuesta[i].cod_parametro;                    
                    insertdetails.tipo_descuento_desc = respuesta[i].desc_parametro;
                    insertdetails.forma_descuento_desc = respuesta[i].forma_descuento_desc;
                    insertdetails.forma_descuento = respuesta[i].forma_descuento;
                    insertdetails.desde_valor = respuesta[i].desde_valor;
                    insertdetails.hasta_valor = respuesta[i].hasta_valor;
                    insertdetails.valor_descuento = respuesta[i].valor_descuento;
                    insertdetails.desc_producto = respuesta[i].desc_producto;
                    insertdetails.desc_sucursal = respuesta[i].desc_sucursal;

                    var rows = jQuery("#grillaDetalleModal").jqGrid('getRowData');
                    jQuery("#grillaDetalleModal").jqGrid('addRowData', (rows.length) + 1, insertdetails);
    //                                $("#grillaComprasModal")[0].addJSONData(respuesta[i]);
    //                                console.log(respuesta[i]);
                }

                $.unblockUI();
            },
            error: function(event, request, settings) {
                $.unblockUI();
                alert(mostrarError("OCURRIO UN ERROR"));
            }
        });        
}

function limpiarFormulario(){
	$("#error-block-modal").hide();
	$("#warning-block").hide();
	$("#warning-block-registro").hide();
	$("#success-block").hide();
        $("#auxiliar").attr("value",null);
	$("#"+idCamposGrilla[0]).attr("value",null);
	$("#"+idCamposGrilla[1]).attr("value",-1);
	$("#"+idCamposGrilla[2]).attr("value",null);
	$("#"+idCamposGrilla[3]).attr("value",null);
        $("#"+idCamposGrilla[4]).attr("value",null);  

	$("#selectFormaDescuento").attr("value",-1);
        $("#selectParametroDescuento").attr("value",-1);
	$("#inputValorDesde").attr("value",null);
	$("#inputValorHasta").attr("value",null);
        $("#inputDescuento").attr("value",null);     
        $("#grillaDetalleModal").jqGrid("clearGridData");
}



function obtenerJsonBuscar(){
	var jsonObject = new Object();  
	if($('#'+idCamposBusqueda[0]).attr("value") != null && $('#'+idCamposBusqueda[0]).attr("value").length != 0){
		jsonObject.descripcion = $('#'+idCamposBusqueda[0]).attr("value");
                $('#'+idCamposBusqueda[0]).attr("value",null);
	}

	var dataString = JSON.stringify(jsonObject);
	return dataString;
}

function cargarSucursal(){
	$.ajax({
        url: table+'sucursaldata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#desc_sucursal-modal").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function cargarParametrosDescuentos(){
	$.ajax({
        url: table+'parametrosdata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#selectParametroDescuento").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function addItem() {
//    alert("ingreso");    
    var data = obtenerJsonDetalles();
//    alert(JSON.stringify(data));
    if (data !== null) {
        $("#guardar-registro").show();
        var rows = jQuery("#grillaDetalleModal").jqGrid('getRowData');
        jQuery("#grillaDetalleModal").jqGrid('addRowData', (rows.length) + 1, data);
    }

}
function obtenerJsonDetalles() {
    var jsonObject = new Object();            
    jsonObject.id_det_producto_descuento = null;
    jsonObject.cod_sucursal = $("#"+idCamposGrilla[1]+" option:selected").val();
    jsonObject.desc_producto = $("#"+idCamposGrilla[2]+" option:selected").text();
    jsonObject.cod_producto = $("#"+idCamposGrilla[2]+" option:selected").val();
    jsonObject.desc_sucursal = $("#"+idCamposGrilla[1]+" option:selected").text();                    
    jsonObject.forma_descuento = $('#selectFormaDescuento').attr("value");
    if(jsonObject.forma_descuento == 'M'){
        jsonObject.forma_descuento_desc = 'Descuenta Cargamento';
        $('#inputValorDesde').attr("value",0);
        $('#inputValorHasta').attr("value",0);
    }
    else
        jsonObject.forma_descuento_desc = 'Porcentaje';    
    jsonObject.cod_parametro = $('#selectParametroDescuento').attr("value");
    jsonObject.tipo_descuento_desc = $("#selectParametroDescuento option:selected").text();  
    jsonObject.desde_valor = parseInt($('#inputValorDesde').attr("value"));
    jsonObject.hasta_valor = parseInt($('#inputValorHasta').attr("value"));
    jsonObject.valor_descuento = parseInt($('#inputDescuento').attr("value"));
//        alert(JSON.stringify(jsonObject));
    var codigoDetalle = jsonObjectRequest.detalles.length;
    jsonObjectRequest.detalles[codigoDetalle] = new Object();
    jsonObjectRequest.detalles[codigoDetalle].cod_sucursal = jsonObject.cod_sucursal;
    jsonObjectRequest.detalles[codigoDetalle].cod_producto = jsonObject.cod_producto;
    jsonObjectRequest.detalles[codigoDetalle].clave_parametro = jsonObject.cod_parametro;
    jsonObjectRequest.detalles[codigoDetalle].tipo_descuento = jsonObject.forma_descuento;
    jsonObjectRequest.detalles[codigoDetalle].desde_valor = jsonObject.desde_valor;
    jsonObjectRequest.detalles[codigoDetalle].hasta_valor = jsonObject.hasta_valor;
    jsonObjectRequest.detalles[codigoDetalle].valor_descuento = jsonObject.valor_descuento;
    return jsonObject;    
}




