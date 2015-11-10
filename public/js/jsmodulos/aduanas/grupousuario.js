$().ready(function() {
        
        preguntarporpermisos(12,'true');
	$("#buscarregistro").click(function() {            
		 buscarRegistros();
	 });
         
         $("activo").click(function(){
            $("#activo").prop("checked", true);  // para poner la marca
//            $("#activo").prop("checked", false); // para quitar la marca
 
         });

	$("#cerrar-bot").click(function() {
		$("#modalEditar").hide();
	});

	$("#cancelar-bot").click(function() {
		$("#modalEditar").hide();
	});

	$('#modalEditar').modal({backdrop:false,show:false});



	$("#nuevoregistro").click(function() {
                preguntarporpermisos(12,'false');
		$('#modalEditar').show();
                cleanModal();
                $("#activo").attr("value",0);
		$("#guardar-registro").html("Guardar");
		$("#editar-nuevo").html("Nuevo Registro");		
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

function preguntarporpermisos(id,accion){
    
    $.blockUI({
        message: "Aguarde un momento por favor"
    });
       var datos = new Object();
       datos.id = id;
       datos.accion = accion;
       
	$.ajax({
//        url:'/proyectoZend/public/index.php/common/common/permisosdata2',
        url:'/factura/proyectoZend/public/index.php/common/common/permisosdata2',
        type: 'post',
        data: {"datos":datos},
        dataType: 'json',
        async : false,
        success: function(respuesta){
                if(respuesta.result === "EXITO") {
        		cargarGrillaRegistro();
        	} else if(respuesta.result === "SINPERMISO") {
                        alert("No tiene permisos");
        		mostarVentana("error-modal","NO TIENE PERMISOS");
                }else if(respuesta.result === "NO") {
                        $('#desc_grupo').hide();
                        
                } else if(respuesta.result === "SI") {
                        //MOSTRAR BOTON
                        $('#desc_grupo').show();
                       
                }
                $.unblockUI();
        },
        error: function(event, request, settings){
        	mostarVentana("error-registro-listado","Ha ocurrido un error");
    		$.unblockUI();
        }
    });
    
}

function validarNumerosLetrasPorcentageEspacio(e) { // 1
	var te;
	if(document.all) {
		if (e.keyCode==37) return false; // %
		
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
	if(data.cod_grupo != null && data.cod_grupo.length != 0){
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

    if ($('#desc_grupo').attr("value") == null || $('#desc_grupo').attr("value").length == 0) {
        mostarVentana("warning-registro", "Complete la descripcion");
    }
    else {
        var estado = '';
        jsonObject.cod_grupo = $('#cod_grupo-modal').attr("value");
        jsonObject.desc_grupo = $('#desc_grupo').attr("value");
        if($('#activo').attr("checked"))  estado = 'S'; else estado = 'N';
        jsonObject.activo = estado;
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
	$("#cod_grupo-modal").attr("value",parametros.cod_grupo);
	$("#desc_grupo").attr("value",parametros.desc_grupo);
         if(parametros.activo == 'S')
            $('input[name=activo]').attr('checked', true);            
        else
            $('input[name=activo]').attr('checked', false);  
//	$("#activo").attr("value",parametros.activo);          
	$("#guardar-registro").html("Modificar");
}

function limpiarFormulario(){
	$("#error-block-modal").hide();
	$("#warning-block").hide();
	$("#warning-block-registro").hide();
	$("#success-block").hide();
        $("#cod_grupo").attr("value",null);
	$("#desc_grupo").attr("value",null);
	$("#activo").attr("value",null);
	
       
}



function obtenerJsonBuscar(){
	var jsonObject = new Object();  
	if($('#descripcionBusqueda').attr("value") != null && $('#descripcionBusqueda').attr("value").length != 0){
		jsonObject.descripcionBusqueda = $('#descripcionBusqueda').attr("value");
	} else {
            return false;
        }

	var dataString = JSON.stringify(jsonObject);
	return dataString;
}

function cleanModal(){
    $("#cod_grupo-modal").attr("value",null);
    $("#desc_grupo").attr("value",null);
    $("#activo").attr("value",null);
    
}






