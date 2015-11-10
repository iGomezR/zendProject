table = "/aduanas/Registroctacliente/";
mensajeWarning = new Array("",
"Debe ingresar una fecha valida por favor",
"Debe seleccionar una moneda por favor",
"Debe ingresar una cotizacion por favor",
"Debe seleccionar un cliente por favor",
"Debe seleccionar una clase por favor",
"Debe seleccionar un nro. de liquidacion por favor",
"Debe seleccionar un concepto por favor",
"Debe seleccionar un centro de costos por favor",
"Debe ingresar un valor por favor",
"Debe ingresar una observacion por favor"
);
idCamposBusqueda = new Array("descripcionBusqueda");
idCamposGrilla = new Array("id-registro","fecha-modal","moneda-modal","cotizacion-modal","nroDepartamento-modal",
        "cliente-modal","valorImponible-modal",
        "clase-modal","nroLiquidacion-modal","totalLiquidacion-modal",
        "concepto-modal","centro-modal","valor-modal","obs-modal","borrado-modal");        

$().ready(function() {
        cargarComboMoneda();
        cargarComboCliente();
        cargarComboCentroCosto();
        cargarComboConcepto();
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
function validarNumerosCampo2(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    //letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    letras = "0123456789,";
    especiales = [8, 37, 39, 46];
    //especiales = [46];

    tecla_especial = false
    for(var i in especiales) {
        if(key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    if(letras.indexOf(tecla) == -1 && !tecla_especial)
        return false;       
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
	} else if($('#'+idCamposGrilla[2]).attr("value") == -1 || $('#'+idCamposGrilla[2]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[2]);
	} else if($('#'+idCamposGrilla[3]).attr("value") == null || $('#'+idCamposGrilla[3]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[3]);
        } else if($('#'+idCamposGrilla[5]).attr("value") == -1 || $('#'+idCamposGrilla[5]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[4]);
        } else if($('#'+idCamposGrilla[7]).attr("value") == 'Z' || $('#'+idCamposGrilla[7]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[5]);
        } else if($('#'+idCamposGrilla[8]).attr("value") == -1 || $('#'+idCamposGrilla[8]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[6]);
        } else if($('#'+idCamposGrilla[10]).attr("value") == -1 || $('#'+idCamposGrilla[10]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[7]);
        } else if($('#'+idCamposGrilla[11]).attr("value") == -1 || $('#'+idCamposGrilla[11]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[8]);
        } else if($('#'+idCamposGrilla[12]).attr("value") == null || $('#'+idCamposGrilla[12]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[9]);
        } else if($('#'+idCamposGrilla[13]).attr("value") == null || $('#'+idCamposGrilla[13]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[10]);
        } else {                       
                if($('#'+idCamposGrilla[14]).attr("checked")) $borrado = 0; else $borrado = 1;
                fecha_aux = $('#'+idCamposGrilla[1]).attr("value");                
		jsonObject.idRegistro = $('#'+idCamposGrilla[0]).attr("value");
                jsonObject.fechaRegistro = fecha_aux.substring(6)+'-'+fecha_aux.substring(3,5)+'-'+fecha_aux.substring(0,2);
                jsonObject.modena = $('#'+idCamposGrilla[2]).attr("value");
                jsonObject.cotizacion = $('#'+idCamposGrilla[3]).attr("value");     
                jsonObject.cliente = $('#'+idCamposGrilla[5]).attr("value");     
                jsonObject.clase = $('#'+idCamposGrilla[7]).attr("value");     
                jsonObject.nroLiquidacion = $('#'+idCamposGrilla[8]).attr("value");     
                jsonObject.concepto = $('#'+idCamposGrilla[10]).attr("value");     
                jsonObject.centro = $('#'+idCamposGrilla[11]).attr("value");     
                jsonObject.valor = $('#'+idCamposGrilla[12]).attr("value");     
                jsonObject.observacion = $('#'+idCamposGrilla[13]).attr("value");     
                jsonObject.codusuario = '1';     
                jsonObject.borrado = '0';     
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
	$("#"+idCamposGrilla[1]).attr("value",parametros.fechaRegistro);
	$("#"+idCamposGrilla[2]).attr("value",parametros.modena);
        //$("#"+idCamposGrilla[2]+" option[value="+parametros.modena+"]").attr("selected",true);
	$("#"+idCamposGrilla[3]).attr("value",parametros.cotizacion);       
        $("#"+idCamposGrilla[5]).attr("value",parametros.cliente);       
        $("#"+idCamposGrilla[7]).attr("value",parametros.clase);   
        ClaseClienteOnChange();
	$("#"+idCamposGrilla[8]).attr("value",parametros.nroLiquidacion);       
        $("#"+idCamposGrilla[10]).attr("value",parametros.concepto);       
        $("#"+idCamposGrilla[11]).attr("value",parametros.centro);               
        $("#"+idCamposGrilla[12]).attr("value",parametros.valor);       
        $("#"+idCamposGrilla[13]).attr("value",parametros.observacion);    
        $("#"+idCamposGrilla[14]).attr("value",parametros.borrado);        
        NroLiquidacionOnChange();
	$("#guardar-registro").html("Modificar");
}

function limpiarFormulario(){
    $("#error-block-modal").hide();
    $("#warning-block").hide();
    $("#warning-block-registro").hide();
    $("#success-block").hide();
    $("#"+idCamposGrilla[0]).attr("value",null);
    $("#"+idCamposGrilla[1]).attr("value",null);
    $("#"+idCamposGrilla[2]).attr("value",-1);
    $("#"+idCamposGrilla[3]).attr("value",null);
    $("#"+idCamposGrilla[4]).attr("value",null);
    $("#"+idCamposGrilla[5]).attr("value",-1);        
    $("#"+idCamposGrilla[6]).attr("value",null);                
    $("#"+idCamposGrilla[7]).attr("value",-1);                
    $("#"+idCamposGrilla[8]).attr("value",-1);                
    $("#"+idCamposGrilla[9]).attr("value",null);                
    $("#"+idCamposGrilla[10]).attr("value",-1);                
    $("#"+idCamposGrilla[11]).attr("value",-1);                
    $("#"+idCamposGrilla[12]).attr("value",null);                
    $("#"+idCamposGrilla[13]).attr("value",null);                
    $("#"+idCamposGrilla[14]).attr("value",null);    
}



function obtenerJsonBuscar(){
	var jsonObject = new Object();  
	if($('#'+idCamposBusqueda[0]).attr("value") != null && $('#'+idCamposBusqueda[0]).attr("value").length != 0){
		jsonObject.descripcion = $('#'+idCamposBusqueda[0]).attr("value");
	}

	var dataString = JSON.stringify(jsonObject);
	return dataString;
}

function cargarComboMoneda(){
	$.ajax({
        url: table+'monedadata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#moneda-modal").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function cargarComboCliente(){
	$.ajax({
        url: table+'clientedata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#cliente-modal").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function cargarComboConcepto(){
	$.ajax({
        url: table+'conceptodata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#concepto-modal").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function cargarComboCentroCosto(){
	$.ajax({
        url: table+'centrocostodata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#centro-modal").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function ClaseClienteOnChange(){    
    if($('#'+idCamposGrilla[7]).attr("value") != 'Z' && $('#'+idCamposGrilla[5]).attr("value") > -1){        
	var jsonObject = new Object();  	
	jsonObject.cliente = $('#'+idCamposGrilla[5]).attr("value");
        jsonObject.clase = $('#'+idCamposGrilla[7]).attr("value");
	var dataJson = JSON.stringify(jsonObject);  
	$.ajax({
            url: table+'nroliquidaciondata',
            type: 'post',
            data: {"data":dataJson},
            dataType: 'html',
            async : false,
            success: function(respuesta){
                    $("#nroLiquidacion-modal").html(respuesta);
            },
            error: function(event, request, settings){
             //   $.unblockUI();
                alert("Ha ocurrido un error");
            }
        });        	
    }
}
function NroLiquidacionOnChange(){
    if($('#'+idCamposGrilla[8]).attr("value") > -1){        
	var jsonObject = new Object();  	
	jsonObject.nroliquidacion = $('#'+idCamposGrilla[8]).attr("value");
	var dataJson = JSON.stringify(jsonObject);  
	$.ajax({
            url: table+'liquidacionnrodespacho',
            type: 'post',
            data: {"data":dataJson},
            dataType: 'html',
            async : false,
            success: function(respuesta){
                    $("#nroDepartamento-modal").val(respuesta);
            },
            error: function(event, request, settings){
             //   $.unblockUI();
                alert("Ha ocurrido un error");
            }
        });
	$.ajax({
            url: table+'liquidacionvalorimponible',
            type: 'post',
            data: {"data":dataJson},
            dataType: 'html',
            async : false,
            success: function(respuesta){
                    $("#valorImponible-modal").val(respuesta);
            },
            error: function(event, request, settings){
             //   $.unblockUI();
                alert("Ha ocurrido un error");
            }
        });
	$.ajax({
            url: table+'liquidaciontotalliquidacion',
            type: 'post',
            data: {"data":dataJson},
            dataType: 'html',
            async : false,
            success: function(respuesta){
                    $("#totalLiquidacion-modal").val(respuesta);
            },
            error: function(event, request, settings){
             //   $.unblockUI();
                alert("Ha ocurrido un error");
            }
        });        
    }    
}


