table = "/parametricos/Usuario/";
mensajeWarning = new Array("Complete el Nombre por favor","Complete el Apellido por favor","FALTA EL PASSWORD");
idCamposGrilla = new Array("id-registro","nombreBusqueda-modal","apellido-modal","password-modal");

$().ready(function() {
	$("#buscarregistro").click(function() {
		 buscarRegistros();
	 });

	$("#cerrar-bot").click(function() {
		$("#modalEditar").hide();
	});

	$("#cancelar-bot").click(function() {
		$("#modalEditar").hide();
	});

	$('#modalEditar').modal({backdrop:false,show:false});



	$("#nuevoregistro").click(function() {
		$('#modalEditar').show();
                //ID de registro
		$('#'+idCamposGrilla[0]).attr("value",null);
		$("#guardar-registro").html("Guardar");
		 $("#editar-nuevo").html("Nuevo Registro");
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


	//validarNumerosCampo();


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


function enviarParametrosRegistro(data){
	$.blockUI({
        message: "Aguarde un momento por favor"
    });

	var urlenvio = '';
	if(data.idRegistro != null && data.idRegistro.length != 0){
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
	var jsonObject = new Object();

	if($('#'+idCamposGrilla[1]).attr("value") == null || $('#'+idCamposGrilla[1]).attr("value").length == 0){
            mostarVentana("warning-registro",mensajeWarning[1]);
	} else if($('#'+idCamposGrilla[2]).attr("value") == null || $('#'+idCamposGrilla[2]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[2]);
	} else if($('#'+idCamposGrilla[3]).attr("value") == null || $('#'+idCamposGrilla[3]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[3]);
        }
        else {
		jsonObject.idRegistro = $('#'+idCamposGrilla[0]).attr("value");
                jsonObject.nombreUsuario = $('#'+idCamposGrilla[1]).attr("value");
                jsonObject.apellidoUsuario = $('#'+idCamposGrilla[2]).attr("value");
                jsonObject.passwordUsuario = $('#'+idCamposGrilla[3]).attr("value");
     
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
	 $("#"+idCamposGrilla[1]).keydown(function(event) {
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
	$("#modalEditar").show();
	$("#editar-nuevo").html("Editar Registro");
	$("#"+idCamposGrilla[0]).attr("value",parametros.idRegistro);
	$("#"+idCamposGrilla[1]).attr("value",parametros.nombreUsuario);
	$("#"+idCamposGrilla[2]).attr("value",parametros.apellidoUsuario);
	$("#"+idCamposGrilla[3]).attr("value",parametros.passwordUsuario);
       ;
	$("#guardar-registro").html("Modificar");
}

function limpiarFormulario(){
	$("#error-block-modal").hide();
	$("#warning-block").hide();
	$("#warning-block-registro").hide();
	$("#success-block").hide();
	$("#"+idCamposGrilla[0]).attr("value",null);
	$("#"+idCamposGrilla[1]).attr("value",null);
	$("#"+idCamposGrilla[2]).attr("value",null);
	$("#"+idCamposGrilla[3]).attr("value",null);
     
}



function obtenerJsonBuscar(){
	var jsonObject = new Object();

	if($('#'+idCamposGrilla[1]).attr("value") != null && $('#'+idCamposGrilla[1]).attr("value").length != 0){
		jsonObject.descripcion = $('#'+idCamposGrilla[1]).attr("value");
	}

	var dataString = JSON.stringify(jsonObject);
	return dataString;
}






