$().ready(function() {  
	$("#buscarperiodo").click(function() {
		 buscarPeriodos();
	 });
	
	$("#cerrar-bot").click(function() {
		$("#modalEditar").hide();
	});
	
	$("#cancelar-bot").click(function() {
		$("#modalEditar").hide();
	});
	
	$('#modalEditar').modal({backdrop:false,show:false});
	
	
	
	$("#nuevoperiodo").click(function() {
		$('#modalEditar').show();
		$('#id-periodo').attr("value",null);
		$("#guardar-periodo").html("Guardar");
		 $("#editar-nuevo").html("Nuevo Periodo");
		 limpiarFormulario();
	});
	
	$('#guardar-periodo').click(function() {  
		 if(!confirm("Esta seguro de que desea almacenar los datos?"))
				return; 
		 var data = obtenerJsonFormulario();
		if(data != null){
			enviarParametrosPeriodo(data);
		}
	 });
	
	
	validarNumerosCampo();
	
	 
});

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


function enviarParametrosPeriodo(data){
	$.blockUI({
        message: "Aguarde un momento por favor"
    });
	
	var urlenvio = '';
	if(data.idperiodo != null && data.idperiodo.length != 0){
		urlenvio = '/parametricos/periodo/modificar';
	}else {
		urlenvio = '/parametricos/periodo/guardar';
	}
	var dataString = JSON.stringify(data);
	
	$.ajax({	
        url: urlenvio,
        type: 'post',
        data: {"parametrosPeriodo":dataString},
        dataType: 'json',
        async : true,
        success: function(respuesta){
        	if(respuesta == null){
        		mostarVentana("error","TIMEOUT");
        	} else if(respuesta.result == "EXITO") {
        		mostarVentana("success-periodo-listado","Los datos han sido almacenados exitosamente");
        		$('#modalEditar').hide();
        		$("#grillaPeriodos").trigger("reloadGrid");
        	} else if(respuesta.result == "ERROR") {
        		if(respuesta.mensaje == 23505){
        			mostarVentana("warning-periodo","Ya existe un Periodo con la descripcion ingresada");
        		} else {
        			mostarVentana("error-modal","Ha ocurrido un error");
        		}
        	}
        	$.unblockUI();
        },
        error: function(event, request, settings){
        	mostarVentana("error-periodo-listado","Ha ocurrido un error");
    		$.unblockUI();
        }
    });	
}


function obtenerJsonFormulario() {
	var jsonObject = new Object();

	if($('#descripcionperiodo-modal').attr("value") == null || $('#descripcionperiodo-modal').attr("value").length == 0){
    	mostarVentana("warning-periodo","Complete una Descripcion del Periodo por favor");
	} else if($('#cantidaddiasperiodo-modal').attr("value") == null || $('#cantidaddiasperiodo-modal').attr("value").length == 0){
		mostarVentana("warning-periodo","Complete la Cantidad de Dias del Periodo por favor");
	} else {
		jsonObject.cantidaddias = $('#cantidaddiasperiodo-modal').attr("value");
		jsonObject.descripcionperiodo = $('#descripcionperiodo-modal').attr("value");
		jsonObject.idperiodo = $('#id-periodo').attr("value");
		
		return jsonObject;
	}
    return null;
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
	$("#error-block-periodo-listado").hide(500);
}

function ocultarErrorBlockModal(){
	$("#error-block-modal").hide(500);
}

function ocultarWarningBlock(){
	$("#warning-block").hide(500);
}

function ocultarWarningBlockTitle(){
	$("#warning-block-periodo-listado").hide(500);
}

function ocultarSuccessBlockTitle(){
	$("#success-block-periodo-listado").hide(500);
}

function ocultarWarningPeriodoBlock(){
	$("#warning-block-periodo").hide(500);
}

function mostarVentana(box,mensaje){
	$("#success-block").hide();
	$("#info-block-listado").hide();
	if(box == "warning") {
		$("#warning-message").text(mensaje);
		$("#warning-block").show();
		setTimeout("ocultarWarningBlock()",5000);
	} else if(box == "warning-periodo-listado") {
		$("#warning-message-periodo-listado").text(mensaje);
		$("#warning-block-periodo-listado").show();
		setTimeout("ocultarWarningBlockTitle()",5000);
	} else if(box == "success-periodo-listado") {
		$("#success-message-periodo-listado").text(mensaje);
		$("#success-block-periodo-listado").show();
		setTimeout("ocultarSuccessBlockTitle()",5000);
	} else if(box == "warning-periodo") {
		$("#warning-message-periodo").text(mensaje);
		$("#warning-block-periodo").show();
		setTimeout("ocultarWarningPeriodoBlock()",5000);
	}  else if(box == "info") {
		$("#info-message").text(mensaje);
		$("#info-block-listado").show(500);
		setTimeout("ocultarInfoClean()",5000);
	} else if(box == "error"){
		$("#error-block").text(mensaje);
		$("#error-block").show(500);
		setTimeout("ocultarErrorBlock()",5000);
	} else if(box == "error-periodo-listado"){
		$("#error-block-periodo-listado").text(mensaje);
		$("#error-block-periodo-listado").show(500);
		setTimeout("ocultarErrorBlockList()",5000);
	} else if(box == "error-modal"){
		$("#error-block-modal").text(mensaje);
		$("#error-block-modal").show(500);
		setTimeout("ocultarErrorBlockModal()",5000);
	}
}

function validarNumerosCampo(){
	 $("#cantidaddiasperiodo-modal").keydown(function(event) {
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

function buscarPeriodos(){
	var dataJson = obtenerJsonBuscar();
	$.blockUI({
        message: "Aguarde un momento por favor"
    });
	$.ajax({
        url: '/parametricos/periodo/buscar',
        type: 'post',
        data: {"data":dataJson},
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#grillaPeriodos")[0].addJSONData(JSON.parse(respuesta));
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

function editarPeriodo(parametros){
	limpiarFormulario();
	$("#modalEditar").show();
	$("#editar-nuevo").html("Editar Periodo");
	$("#id-periodo").attr("value",parametros.id);
	$("#descripcionperiodo-modal").attr("value",parametros.descripcionperiodo);
	$("#cantidaddiasperiodo-modal").attr("value",parametros.diasperiodo);
	$("#guardar-periodo").html("Modificar");
}

function limpiarFormulario(){
	$("#error-block-modal").hide();
	$("#warning-block").hide();
	$("#warning-block-periodo").hide();
	$("#success-block").hide();
	$("#id-periodo").attr("value",null);
	$("#descripcionperiodo-modal").attr("value",null);
	$("#cantidaddiasperiodo-modal").attr("value",null);
}



function obtenerJsonBuscar(){
	var jsonObject = new Object();
	
	if($('#descripcionperiodo').attr("value") != null && $('#descripcionperiodo').attr("value").length != 0){
		jsonObject.descripcion = $('#descripcionperiodo').attr("value");
	}
	
	var dataString = JSON.stringify(jsonObject);
	return dataString;
}
