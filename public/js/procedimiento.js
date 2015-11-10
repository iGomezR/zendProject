$().ready(function() {  
	$('#crear-procedimiento').click(function() {  
		 if(!confirm("¿Esta seguro de que desea enviar los datos?"))
				return; 
		 var data = obtenerJsonFormulario("crear");
		if(data != null){
			enviarParametrosProcedimiento("crear",data);
		}
	 });
	
	$('#ejecutar-procedimiento').click(function() {  
		 if(!confirm("¿Esta seguro de que desea enviar los datos?"))
				return; 
		 var data = obtenerJsonFormulario("ejecutar");
		if(data != null){
			enviarParametrosProcedimiento("ejecutar",data);
		}
	 });
});

function obtenerJsonFormulario(operacion) {
	var jsonObject = new Object();

	if(operacion == "crear"){
		jsonObject.sqlprocedimiento = $('#sql-procedimiento').attr("value");
	} else if(operacion == "ejecutar") {
		jsonObject.nombreprocedimiento = $('#nombre-procedimiento').attr("value");
	}
		return jsonObject;
}

function enviarParametrosProcedimiento(operacion,data){
	$.blockUI({
        message: "Aguarde un momento por favor"
    });
	
	var urlenvio = '';
	if(operacion == "crear"){
		urlenvio = '/facturacion/procedure/crear';
	}else if(operacion == "ejecutar") {
		urlenvio = '/facturacion/procedure/ejecutarprueba';
	}
	
	
	var dataString = JSON.stringify(data);
	
	$.ajax({	
        url: urlenvio,
        type: 'post',
        data: {"data":dataString},
        dataType: 'json',
        async : true,
        success: function(respuesta){
        	if(respuesta.result == "EXITO") {
        		mostarVentana("success-procedure","Exito en la operacion");
        	} else if(respuesta.result == "ERROR") {
        			mostarVentana("error-modal",respuesta.mensaje);
        	}
        	$.unblockUI();
        },
        error: function(event, request, settings){
        	mostarVentana("error-procedure","Ha ocurrido un error");
    		$.unblockUI();
        }
    });	
}

function mostarVentana(box,mensaje){
	if(box == "success-procedure") {
		$("#success-procedure").text(mensaje);
		$("#success-procedure").show();
		setTimeout("ocultarSuccessProcedure()",5000);
	} else if(box == "error-procedure"){
		$("#error-procedure").text(mensaje);
		$("#error-procedure").show(500);
		setTimeout("ocultarErrorProcedure()",5000);
	}
}

function ocultarSuccessProcedure(){
	$("#success-procedure").hide(500);
}

function ocultarErrorProcedure(){
	$("#error-procedure").hide(500);
}