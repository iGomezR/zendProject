table = "/administrativo/Usuarios/";
mensajeWarning = new Array(
        "id-registro",
        "Complete el Id de Usuario por favor",
        "Complete el Nombre y Apellido por favor",
        "Ingrese Password",
        "Grupo Usuario",
        "Seleccione Grupo Usuario",
        "Confirme el password");
idCamposBusqueda = new Array("descripcionBusqueda");
idCamposGrilla = new Array("id-registro",
                            "user-modal",
                            "usuario-modal",
                            "password-modal",
                            "estado-modal",
                            "borrado-modal",
                            "cod-grupo-usuario-modal",
                            "desc-grupo-usuario-modal",
                            "confirma-password");

$().ready(function() {
    loadAutocompleteGrupos();
        $("#"+idCamposGrilla[5]).hide();
        $("#"+idCamposGrilla[5]+'-idioma').hide();
        $("#"+idCamposGrilla[6]).hide();
        $("#"+idCamposGrilla[6]+'-idioma').hide();
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
		$('#'+idCamposGrilla[0]).attr("value",null);
                $('input[name='+idCamposGrilla[4]+']').attr('checked', true);
		$('#accion').attr("value","nuevo");
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
function loadAutocompleteGrupos() {
    $.getJSON("usuarios/grupodata", function(data) {
        var descripcionGrupo= [];
          $(data).each(function(key, value) {
            
                $('#desc-grupo-usuario-modal').append($('<option>', { 
                    value: value.cod_grupo_usuario,
                    text : value.desc_grupo_usuario 
                }));
                 descripcionGrupo.push(value.desc_grupo_usuario);
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
	var jsonObject = new Object();
        var accion = $('#accion').attr("value");
                    
        if($('#user-modal').attr("value") == null || $('#user-modal').attr("value").length == 0){
            mostarVentana("warning-registro","Complete el ID Usuario");
	} else if($('#usuario-modal').attr("value") == null || $('#usuario-modal').attr("value").length == 0){
            mostarVentana("warning-registro","Complete el Nombre y Apellido del usuario");
	} else if($('#desc-grupo-usuario-modal').attr("value") == -1 || $('#desc-grupo-usuario-modal').attr("value").length == 0){
		mostarVentana("warning-registro","Seleccione un grupo");
        }else if($("#auxiliar").attr("value").length == 0 && $("#password-modal").attr("value").length == 0){
                    mostarVentana("warning-registro","Cargue el password");
        } else if($("#auxiliar").attr("value").length == 0 && $('#confirma-password').attr("value").length == 0){
            mostarVentana("warning-registro","Confirme el password");
        }else if($('#password-modal').attr("value") !== $('#confirma-password').attr("value")){
            mostarVentana("warning-registro","Los passwords ingresados no coinciden, favor verifique");
        }
        else {
                
                if($('#'+idCamposGrilla[4]).attr("checked")) $estado = 'A'; else $estado = 'D';
                if($('#'+idCamposGrilla[5]).attr("checked")) $borrado = 0; else $borrado = 1;
		jsonObject.codigo = $('#'+idCamposGrilla[0]).attr("value");
                jsonObject.user = $('#'+idCamposGrilla[1]).attr("value");
                jsonObject.usuario = $('#'+idCamposGrilla[2]).attr("value");
                jsonObject.cod_grupo_usuario = $("#"+idCamposGrilla[7]+" option:selected").val();
                jsonObject.desc_grupo_usuario= $("#"+idCamposGrilla[7]+" option:selected").text();
               
                jsonObject.estado = $estado;
                jsonObject.borrado = $borrado; 
                if(accion == "editar" && $("#password-modal").attr("value").length !== 0 ){
                     if($('#confirma-password').attr("value").length == 0){
                        mostarVentana("warning-registro","Confirme el password");
                         return null;
                    }else if($('#password-modal').attr("value") !== $('#confirma-password').attr("value")){
                        mostarVentana("warning-registro","Los passwords ingresados no coinciden, favor verifique");
                         return null;
                    } else {
                        jsonObject.password = $("#password-modal").attr("value") ;
                        jsonObject.change = "true";
                    }

                } else if(accion == "nuevo"){
                    jsonObject.password = $("#password-modal").attr("value") ;
                    jsonObject.change = "false";
                } else {
                    jsonObject.password = $("#auxiliar").attr("value");
                    jsonObject.change = "false";
                }
                
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
        $('#accion').attr("value","editar");
	$("#"+idCamposGrilla[0]).attr("value",parametros.codigo);
	$("#"+idCamposGrilla[1]).attr("value",parametros.user);
	$("#"+idCamposGrilla[2]).attr("value",parametros.usuario);
        $("#"+idCamposGrilla[7]+" option[value="+parametros.cod_grupo_usuario+"]").attr("selected",true);
	$("#auxiliar").attr("value",parametros.password);
       
         if(parametros.estado === 'Activo')
            $('input[name='+idCamposGrilla[4]+']').attr('checked', true);            
        else
            $('input[name='+idCamposGrilla[4]+']').attr('checked', false);

	$("#"+idCamposGrilla[5]).attr("value",parametros.borrado);
        
	$("#guardar-registro").html("Modificar");
}

function limpiarFormulario(){
	$("#error-block-modal").hide();
	$("#warning-block").hide();
	$("#warning-block-registro").hide();
	$("#success-block").hide();
        $("#auxiliar").attr("value",null);
	$("#"+idCamposGrilla[0]).attr("value",null);
	$("#"+idCamposGrilla[1]).attr("value",null);
	$("#"+idCamposGrilla[2]).attr("value",null);
	$("#"+idCamposGrilla[3]).attr("value",null);
        $("#"+idCamposGrilla[8]).attr("value",null);
//	$("#"+idCamposGrilla[4]).attr("value",null);
	$("#"+idCamposGrilla[5]).attr("value",0);
        $("#"+idCamposGrilla[6]).attr("value",null);
	$("#"+idCamposGrilla[7]).attr("value",null);
        
       
     
}



function obtenerJsonBuscar(){
	var jsonObject = new Object();  
	if($('#'+idCamposBusqueda[0]).attr("value") != null && $('#'+idCamposBusqueda[0]).attr("value").length != 0){
		jsonObject.descripcion = $('#'+idCamposBusqueda[0]).attr("value");
	}

	var dataString = JSON.stringify(jsonObject);
	return dataString;
}






