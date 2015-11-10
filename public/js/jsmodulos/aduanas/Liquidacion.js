table = "/aduanas/Liquidacion/";
mensajeWarning = new Array("",
"Debe ingresar una fecha de operaci&oacute;n valida por favor",//1
"Debe seleccionar una clase de liquidaci&oacute;n por favor",//2
"Debe seleccionar un cliente por favor",//3
"Debe ingresar un numero de factura por favor",//4
"Debe ingresar una fecha de liquidaci&oacute;n valida por favor",//5
"Debe seleccionar un nro. de liquidacion por favor",//6
"Debe ingresar una fecha de depacho valida por favor",//7
"Debe ingresar un numero de despacho por favor",//8
"Debe ingresar un valor imponible por favor",//9
"Debe ingresar la nombre del importador  por favor",//10
"Debe ingresar la nombre del exportador  por favor",//11
"Debe ingresar un valor de aduana por favor",//12 y 13
"Debe ingresar un valor de flete por favor",//14 y 15
"Debe ingresar un valor de otros por favor",//16 y 17
"Debe ingresar un valor de despachante por favor",//18 y 19
"Debe ingresar un valor de descuento por favor",//20 y 21
"Debe ingresar un valor de complemento por favor",//22 y 23
"Debe ingresar una observaci&oacute;n por favor"//32
);
idCamposBusqueda = new Array("descripcionBusqueda");        
idCamposGrilla = new Array(
        "id-registro",//0
        "fechaOperacion-modal",//1
        "claseLiquidacion-modal",//2
        "cliente-modal",//3
        "nroFactura-modal",//4
        "fechaLiquidacion-modal",//5
        "nroLiquidacion-modal",//6
        "fechaDespacho-modal",//7
        "nroDespacho-modal",//8
        "valorImponible-modal",//9
        "importador-modal",//10
        "exportador-modal",//11
        "aduanaGs-modal",//12
        "aduanaDs-modal",//13
        "fleteGs-modal",//14
        "fleteDs-modal",//15
        "otrosGs-modal",//16
        "otrosDs-modal",//17
        "despachanteGs-modal",//18
        "despachanteDs-modal",//19
        "descuentoGs-modal",//20
        "descuentoDs-modal",//21
        "complementoGs-modal",//22
        "complementoDs-modal",//23
        "valoraCobrarGs-modal",//24
        "valoraCobrarDs-modal",//25
        "totalGastosGs-modal",//26
        "totalGastosDs-modal",//27
        "totalGastosDespachoGs-modal",//28
        "totalGastosDespachoDs-modal",//29
        "totalLiquidacionGs-modal",//30
        "totalLiquidacionDs-modal",//31        
        "obs-modal");//32
$().ready(function() {
        cargarComboCliente();
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
	} else if($('#'+idCamposGrilla[2]).attr("value") == 'Z' || $('#'+idCamposGrilla[2]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[2]);
	} else if($('#'+idCamposGrilla[3]).attr("value") == -1 || $('#'+idCamposGrilla[3]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[3]);
        } else if($('#'+idCamposGrilla[4]).attr("value") == null || $('#'+idCamposGrilla[4]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[4]);
        } else if($('#'+idCamposGrilla[5]).attr("value") == null || $('#'+idCamposGrilla[5]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[5]);
        } else if($('#'+idCamposGrilla[6]).attr("value") == null || $('#'+idCamposGrilla[6]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[6]);
        } else if($('#'+idCamposGrilla[7]).attr("value") == null || $('#'+idCamposGrilla[7]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[7]);
        } else if($('#'+idCamposGrilla[8]).attr("value") == null || $('#'+idCamposGrilla[8]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[8]);
        } else if($('#'+idCamposGrilla[9]).attr("value") == null || $('#'+idCamposGrilla[9]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[9]);
        } else if($('#'+idCamposGrilla[10]).attr("value") == null || $('#'+idCamposGrilla[10]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[10]);
        } else if($('#'+idCamposGrilla[11]).attr("value") == null || $('#'+idCamposGrilla[11]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[11]);        
        } else if(($('#'+idCamposGrilla[12]).attr("value") == null & $('#'+idCamposGrilla[13]).attr("value") == null) 
                || ($('#'+idCamposGrilla[12]).attr("value").length == 0 & $('#'+idCamposGrilla[13]).attr("value").length == 0)){
		mostarVentana("warning-registro",mensajeWarning[12]);
        } else if(($('#'+idCamposGrilla[14]).attr("value") == null & $('#'+idCamposGrilla[15]).attr("value") == null) 
                || ($('#'+idCamposGrilla[14]).attr("value").length == 0 & $('#'+idCamposGrilla[15]).attr("value").length == 0)){
		mostarVentana("warning-registro",mensajeWarning[13]);
        } else if(($('#'+idCamposGrilla[16]).attr("value") == null & $('#'+idCamposGrilla[17]).attr("value") == null) 
                || ($('#'+idCamposGrilla[16]).attr("value").length == 0 & $('#'+idCamposGrilla[17]).attr("value").length == 0)){
		mostarVentana("warning-registro",mensajeWarning[14]);
        } else if(($('#'+idCamposGrilla[18]).attr("value") == null & $('#'+idCamposGrilla[19]).attr("value") == null) 
                || ($('#'+idCamposGrilla[18]).attr("value").length == 0 & $('#'+idCamposGrilla[19]).attr("value").length == 0)){
		mostarVentana("warning-registro",mensajeWarning[15]);
        } else if(($('#'+idCamposGrilla[20]).attr("value") == null & $('#'+idCamposGrilla[21]).attr("value") == null) 
                || ($('#'+idCamposGrilla[20]).attr("value").length == 0 & $('#'+idCamposGrilla[21]).attr("value").length == 0)){
		mostarVentana("warning-registro",mensajeWarning[16]);
        } else if(($('#'+idCamposGrilla[22]).attr("value") == null & $('#'+idCamposGrilla[23]).attr("value") == null) 
                || ($('#'+idCamposGrilla[22]).attr("value").length == 0 & $('#'+idCamposGrilla[23]).attr("value").length == 0)){
		mostarVentana("warning-registro",mensajeWarning[17]);
        } else if($('#'+idCamposGrilla[32]).attr("value") == null || $('#'+idCamposGrilla[32]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[18]);        
        }     else {   
            
            
idCamposGrilla = new Array(
        "id-registro",//0
        "fechaOperacion-modal",//1
        "claseLiquidacion-modal",//2
        "cliente-modal",//3
        "nroFactura-modal",//4
        "fechaLiquidacion-modal",//5
        "nroLiquidacion-modal",//6
        "fechaDespacho-modal",//7
        "nroDespacho-modal",//8
        "valorImponible-modal",//9
        "importador-modal",//10
        "exportador-modal",//11
        "aduanaGs-modal",//12
        "aduanaDs-modal",//13
        "fleteGs-modal",//14
        "fleteDs-modal",//15
        "otrosGs-modal",//16
        "otrosDs-modal",//17
        "despachanteGs-modal",//18
        "despachanteDs-modal",//19
        "descuentoGs-modal",//20
        "descuentoDs-modal",//21
        "complementoGs-modal",//22
        "complementoDs-modal",//23
        "valoraCobrarGs-modal",//24
        "valoraCobrarDs-modal",//25
        "totalGastosGs-modal",//26
        "totalGastosDs-modal",//27
        "totalGastosDespachoGs-modal",//28
        "totalGastosDespachoDs-modal",//29
        "totalLiquidacionGs-modal",//30
        "totalLiquidacionDs-modal",//31        
        "obs-modal");//32
        
                
                fecha_operacion = $('#'+idCamposGrilla[1]).attr("value");                
                fecha_liquidacion = $('#'+idCamposGrilla[5]).attr("value");                
                fecha_despacho = $('#'+idCamposGrilla[7]).attr("value");                
                
                
		jsonObject.idRegistro = $('#'+idCamposGrilla[0]).attr("value");
                jsonObject.fechaOperacion = fecha_operacion.substring(6)+'-'+fecha_operacion.substring(3,5)+'-'+fecha_operacion.substring(0,2);
                jsonObject.claseLiquidacion = $('#'+idCamposGrilla[2]).attr("value");
                jsonObject.cliente = $('#'+idCamposGrilla[3]).attr("value");     
                jsonObject.nroFactura  = $('#'+idCamposGrilla[4]).attr("value");     
                jsonObject.fechaLiquidacion  = fecha_liquidacion.substring(6)+'-'+fecha_liquidacion.substring(3,5)+'-'+fecha_liquidacion.substring(0,2);
                jsonObject.nroLiquidacion  = $('#'+idCamposGrilla[6]).attr("value");     
                jsonObject.fechaDespacho  = fecha_despacho.substring(6)+'-'+fecha_despacho.substring(3,5)+'-'+fecha_despacho.substring(0,2);
                jsonObject.nroDespacho  = $('#'+idCamposGrilla[8]).attr("value");     
                jsonObject.valorImponible  = $('#'+idCamposGrilla[9]).attr("value");     
                jsonObject.importador  = $('#'+idCamposGrilla[10]).attr("value");     
                jsonObject.exportador  = $('#'+idCamposGrilla[11]).attr("value");     
                jsonObject.aduanaGs  = $('#'+idCamposGrilla[12]).attr("value");     
                jsonObject.aduanaDs  = $('#'+idCamposGrilla[13]).attr("value");     
                jsonObject.fleteGs  = $('#'+idCamposGrilla[14]).attr("value");     
                jsonObject.fleteDs  = $('#'+idCamposGrilla[15]).attr("value");     
                jsonObject.otrosGs  = $('#'+idCamposGrilla[16]).attr("value");     
                jsonObject.otrosDs  = $('#'+idCamposGrilla[17]).attr("value");   
                jsonObject.despachanteGs  = $('#'+idCamposGrilla[18]).attr("value");     
                jsonObject.despachanteDs  = $('#'+idCamposGrilla[19]).attr("value");     
                jsonObject.descuentoGs  = $('#'+idCamposGrilla[20]).attr("value");     
                jsonObject.descuentoDs  = $('#'+idCamposGrilla[21]).attr("value"); 
                jsonObject.complementoGs  = $('#'+idCamposGrilla[22]).attr("value");     
                jsonObject.complementoDs  = $('#'+idCamposGrilla[23]).attr("value");     
                jsonObject.obs  = $('#'+idCamposGrilla[32]).attr("value");                      
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
    //$("#"+idCamposGrilla[1]).attr("value",null);
    $("#"+idCamposGrilla[2]).attr("value",'Z');
    $("#"+idCamposGrilla[3]).attr("value",-1);
    $("#"+idCamposGrilla[4]).attr("value",null);
    //$("#"+idCamposGrilla[5]).attr("value",null);        
    $("#"+idCamposGrilla[6]).attr("value",null);                
    //$("#"+idCamposGrilla[7]).attr("value",null);                
    $("#"+idCamposGrilla[8]).attr("value",null);                
    $("#"+idCamposGrilla[9]).attr("value",null);                
    $("#"+idCamposGrilla[10]).attr("value",null);                
    $("#"+idCamposGrilla[11]).attr("value",null);                
    $("#"+idCamposGrilla[12]).attr("value",null);                
    $("#"+idCamposGrilla[13]).attr("value",null);                
    $("#"+idCamposGrilla[14]).attr("value",null);      
    $("#"+idCamposGrilla[15]).attr("value",null);        
    $("#"+idCamposGrilla[16]).attr("value",null);                
    $("#"+idCamposGrilla[17]).attr("value",null);                
    $("#"+idCamposGrilla[18]).attr("value",null);                
    $("#"+idCamposGrilla[19]).attr("value",null);                
    $("#"+idCamposGrilla[20]).attr("value",null);                
    $("#"+idCamposGrilla[21]).attr("value",null);                
    $("#"+idCamposGrilla[22]).attr("value",null);                
    $("#"+idCamposGrilla[23]).attr("value",null);                
    $("#"+idCamposGrilla[24]).attr("value",null);     
    $("#"+idCamposGrilla[25]).attr("value",null);        
    $("#"+idCamposGrilla[26]).attr("value",null);                
    $("#"+idCamposGrilla[27]).attr("value",null);                
    $("#"+idCamposGrilla[28]).attr("value",null);                
    $("#"+idCamposGrilla[29]).attr("value",null);                
    $("#"+idCamposGrilla[30]).attr("value",null);                
    $("#"+idCamposGrilla[31]).attr("value",null);                
    $("#"+idCamposGrilla[32]).attr("value",null);                
    
}
function obtenerJsonBuscar(){
	var jsonObject = new Object();  
	if($('#'+idCamposBusqueda[0]).attr("value") != null && $('#'+idCamposBusqueda[0]).attr("value").length != 0){
		jsonObject.descripcion = $('#'+idCamposBusqueda[0]).attr("value");
	}

	var dataString = JSON.stringify(jsonObject);
	return dataString;
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



