//table = "/aduanas/detallegruposusuario/";
$().ready(function() {
    table = "usuarioaplicacion/";

    loadAutocompleteGrupos();
        $("#valida-aplicacion-name").click(function() {            
            var aplicacion = validaAplicacion();
            if(aplicacion !== "FAIL"){
                $('#aplicacion-name').prop('disabled', true);
                $('#agrega-aplicacion-grupo').prop('disabled', false);
            }
        });
        
        
        
        $("#agrega-aplicacion-grupo").click(function(){
            if(ValidaDatos() !== "FAIL"){
                var data = ValidaDatos();
                addAplication(data);
            }
        });
         
	$("#buscarregistro").click(function() {            
		 buscarRegistros();
	 });

	$("#cerrar-bot").click(function() {
		$("#modalEditar").hide();
                clearModalEditar();
	});

	$("#cancelar-bot").click(function() {
		$("#modalEditar").hide();
                clearModalEditar();
	});

	$('#modalEditar').modal({backdrop:false,show:false});


	$("#nuevoregistro").click(function() {
		$('#modalEditar').show();
                clearModalEditar();
                $('#agrega-aplicacion-grupo').prop('disabled', true);
                $('#usuario-name').prop('disabled', false);
                $('#aplicacion-name').prop('disabled', false);
                $('#valida-aplicacion-name').prop('disabled', false);
                
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

function loadAutocompleteGrupos() {
    $.getJSON("usuarioaplicacion/usuariodata", function(data) {
         var descripcionUsuario = [];
          $(data).each(function(key, value) {
            descripcionUsuario.push(value.USER);
            $('#usuario-name').append($('<option>', { 
                value: value.codigo,
                text : value.usuario 
            }));
            
            });
            $("#usuario-search").autocomplete({
             source: descripcionUsuario
            });
        

    });
    
    $.getJSON("usuarioaplicacion/aplicaciondata", function(data) {
        var descripcionAplicion = [];
        var codigoAplicacion = [];

        $(data).each(function(key, value) {
            descripcionAplicion.push(value.desc_aplicacion);
            codigoAplicacion.push(value.cod_aplicacion);
        });

        $("#aplicacion-name").autocomplete({
            source: descripcionAplicion
        });
        $("#aplicacion-search").autocomplete({
            source: descripcionAplicion 
        });

    });

}
function validaAplicacion() {
    var aplicationName = $('#aplicacion-name').val();
    
    if (aplicationName.length > 0) {
        $.ajax({
            url: table+'validaaplicacion',
            type: 'post',
            dataType: 'json',
            data: {
                "parametro": aplicationName
            },
            async: true,
            success: function(respuesta) {
               
                    if(aplicationName === respuesta.desc_aplicacion){
                        $("#aplicacion-cod").attr("value", respuesta.cod_aplicacion); 
                        $("#aplicacion-cod-modulo").attr("value", respuesta.cod_modulo);
                        
                        return "OK";
                    }else{
                        alert("Verifique el Nombre de la aplicacion");
                        return "FAIL";
                    }
                     
            },
            error: function(event, request, settings) {
                alert('No se encontro el valor');
            }
        });
    } else {
        alert("Agregue el nombre de una aplicacion");
        return "FAIL";
    }
}

function ValidaDatos(){
     
     var obj = new Object();
     
     obj.update = "NO";
     obj.delete = "NO";
     obj.list = "NO";
     obj.insert = "NO";
     obj.otros = "NO";
     
    $("input:checkbox:checked").each(function(){
        switch ($(this).val()) {
        case 'list':
            {
                obj.list = "SI";
                break;
            }
        case 'insert':
            {
                obj.insert = "SI";
                break;
            }
        case 'delete':
            {
                obj.delete = "SI";
                break;
            }
        case 'update':
            {
                obj.update = "SI";
                break;
            }
        case 'otros':
            {
                obj.otros = "SI";
                break;
            }
        }
    
        });
    obj.usuarioid = $("#usuario-name").find('option:selected').attr('value');
    obj.usuarioname = $("#usuario-name option:selected").text();
    obj.aplicacioncod = $("#aplicacion-cod").attr("value"); 
    obj.aplicacioncodmodulo = $("#aplicacion-cod-modulo").attr("value"); 
    obj.aplicacionname = $('#aplicacion-name').attr("value"); 
    
    
   if(obj.usuarioid < 0){
        alert("Ingrese un usuario");
        return "FAIL";
    }else if(obj.aplicacioncod.length < 1){
        alert("Ingrese una aplicacion o pantalla");
        return "FAIL";
    } else {
        return obj;
    }
}
function addAplication(data){
//        alert(JSON.stringify(data));
        
        if($('#id_usuario_aplicacion').val() > 0 && $('#id_usuario_aplicacion').val() !== null){
            $("#grillaModal").jqGrid("clearGridData", true).trigger("reloadGrid");
            
                var rows = jQuery("#grillaModal").jqGrid('getRowData');
                jQuery("#grillaModal").jqGrid('addRowData', (rows.length) + 1, data);
            
        } else {
                var rows = jQuery("#grillaModal").jqGrid('getRowData');
                jQuery("#grillaModal").jqGrid('addRowData', (rows.length) + 1, data);
                CleanFormItems("add");
                $('#usuario-name').prop('disabled', true);
                $('#agrega-aplicacion-grupo').prop('disabled', true);
        }
}

function CleanFormItems(where){
    
    if(where !== "add"){
        $("#usuario-name option[value=-1]").attr("selected", true);
    }
    $('#id_usuario_aplicacion').attr("value",null);
    $('#cod_grupo_usuario').attr("value",null);
    $('#aplicacion-name').prop('disabled', false);
    $('#aplicacion-cod').attr("value", null);
    $('#aplicacion-cod-modulo').attr("value", null);
    $('#aplicacion-name').attr("value", null);
    
}

function clearModalEditar(){
//     $("#grillaModal").trigger('reloadGrid');
    $("#grillaModal").jqGrid("clearGridData", true).trigger("reloadGrid");
     CleanFormItems();
}

function obtenerJsonFormulario(){
    var jsonObject = new Object();
    var dataObjectCompraDet = new Object(); 
    dataObjectCompraDet =  jQuery("#grillaModal").jqGrid('getRowData'); // saca datos de la grilla en formato json
    var rowsGrid= jQuery("#grillaModal").jqGrid('getRowData'); // saca tododos los datos, vamos a usar para sacar el length
    
    jsonObject.grilla = dataObjectCompraDet;
    jsonObject.rows = rowsGrid.length;
    jsonObject.id_editar = $('#id_usuario_aplicacion').val();
    
    if(jsonObject.rows > 0 && jsonObject.grilla !== null ){
        return jsonObject;
    }else {
        return null;
    }
}

function enviarParametrosRegistro(data){
//    	alert(JSON.stringify(data) );
	$.ajax({	
        url: table+'guardar',
        type: 'post',
        data: {"dataGrilla":data.grilla,"dataLength":data.rows,"id_editar":data.id_editar},
        dataType: 'json',
        async : true,
        success: function(respuesta){
        	if(respuesta == null){
        		mostarVentana("error","TIMEOUT");
        	} else if(respuesta.result == "EXITO") {
//        		mostarVentana("success-block-registro","datosalmacenadosexitosamente");
                        
                        $('#modalEditar').hide();
                        clearModalEditar();
                        $("#grillaRegistro").trigger("reloadGrid");
                              		
        	} else if(respuesta.result == "ERROR") {
        		if(respuesta.mensaje == 23505){
        			mostarVentana("warning","DuplicadoComision");
        		} else {
           			mostarVentana("warning","OcurrioError");
        		}
        	}
//        	$.unblockUI();
        },
        error: function(event, request, settings){
            alert(mostrarError("OcurrioError"));
//            $.unblockUI();
        }
    });	
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
	} else if(box == "success-block-registro"){
//		$("#error-block-modal").text(mensaje);
		$("#success-message-registro").show(500);
		setTimeout("ocultarErrorBlockModal()",5000);
	}
}

function editarRegistro(parametros){
        clearModalEditar();
	$("#modalEditar").show();
	$("#editar-nuevo").html("Editar Registro");
        $("#guardar-registro").html("Modificar");
        $("#agrega-aplicacion-grupo").html("Modificar");
        $('#usuario-name').prop('disabled', true);
        $('#aplicacion-name').prop('disabled', true);
        $('#valida-aplicacion-name').prop('disabled', true);
        $('#agrega-aplicacion-grupo').prop('disabled', false);
        
    $('#id_usuario_aplicacion').attr("value",parametros.id_usuario_aplicacion);
    $('#cod_grupo_usuario').attr("value",parametros.cod_grupo_usuario);
    $("#usuario-name option[value="+parametros.cod_usuario+"]").attr("selected", true);
    $('#aplicacion-cod').attr("value", parametros.cod_aplicacion);
   
    $('#aplicacion-name').attr("value", parametros.desc_aplicacion);
    
    if(parametros.update === 'SI') $('input[name=update]').attr('checked', true);   
    if(parametros.delete === 'SI') $('input[name=delete]').attr('checked', true);   
    if(parametros.list === 'SI') $('input[name=list]').attr('checked', true);   
    if(parametros.insert === 'SI') $('input[name=insert]').attr('checked', true);
    if(parametros.otros === 'SI') $('input[name=otros]').attr('checked', true);
    
    var insertdetails = new Object();
    insertdetails.usuarioid = parametros.cod_usuario;
    insertdetails.usuarioname = parametros.user;
    insertdetails.aplicacioncod = parametros.cod_aplicacion;
    insertdetails.aplicacioncodmodulo = $('#aplicacion-cod-modulo').attr("value");   
    insertdetails.aplicacionname = parametros.desc_aplicacion;
    insertdetails.update = parametros.update; 
    insertdetails.delete = parametros.delete; 
    insertdetails.list = parametros.list;
    insertdetails.insert = parametros.insert;
    insertdetails.otros = parametros.otros;
     validaAplicacion();
    $('#aplicacion-cod-modulo').attr("value", null);
    var rows = jQuery("#grillaModal").jqGrid('getRowData');
    jQuery("#grillaModal").jqGrid('addRowData', (rows.length) + 1, insertdetails);
            

}
function obtenerJsonBuscar(){
	var jsonObject = new Object();  
	if($('#usuario-search').attr("value") != null && $('#usuario-search').attr("value").length != 0){
		jsonObject.usuario= $('#usuario-search').attr("value");
	} else if($('#aplicacion-search').attr("value") != null && $('#aplicacion-search').attr("value").length != 0){
		jsonObject.aplicacion = $('#aplicacion-search').attr("value");
	} else {
            return false;
        }

	var dataString = JSON.stringify(jsonObject);
	return dataString;
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