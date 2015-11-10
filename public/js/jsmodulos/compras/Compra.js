
table = "/compras/compra/";
mensajeWarning = new Array("Seleccione un Proveedor por favor",//0
                    "Introdusca un Nro. de Factura por favor",//1
                    "Introdusca una Fecha de Emision por favor",//2
                    "Introdusca una Fecha de Vencimiento por favor",//3
                    "Seleccione una Forma de Pago por favor",//4
                    "Debe ingresar por lo menos un detalle"//5
                    );
idCamposModal = new Array("id-registro",        //0
                        "comboProveedorModal",  //1
                        "nroFacturaCompraModal",//2
                        "fechaEmisionModal",    //3
                        "fechaVencimientoModal",//4
                        "creditoModal",         //5
                        "comboFormaPagoModal",  //6
                        "comboInsumoModal",     //7
                        "montoCompraModal",     //8
                        "cantidadCompraModal",  //9
                        "unidadMedidaInsumoModal",//10
                        "impuestoInsumoModal"   //11
                        );
idCamposBusqueda = new Array("comboSucursaBusqueda","comboProveedorBusuqueda","nroFacturaCompra");
var contaDetalles = 0;
var contaDetallesImpuesto = 0;
var datosCompra = new Object();
datosCompra.detalles = new Array();
datosCompra.impuestos = new Array();

$().ready(function() {
    
        cargarComboSucursal();
        cargarComboProveedor();
        cargarComboInsumo();
        cargarComboFormaPago();
	$("#buscarregistro").click(function() {
		 buscarRegistros();
	 });
	$("#addDetalleRegistro").click(function() {
		 agregaDetalle();
	 });                  
	$("#cerrar-bot").click(function() {
		$("#modalEditar").hide();
	});
	$("#addDetalleRegistro").click(function() {
            $('#detallesDiv').show();
            $("#"+idCamposModal[7]+" option[value=-1]").attr("selected",true);
            $("#"+idCamposModal[8]).attr("value",null);
            $("#"+idCamposModal[9]).attr("value",null);
            $("#"+idCamposModal[10]).html("");
            $("#"+idCamposModal[11]).html("");
	});        

	$("#cancelar-bot").click(function() {
		$("#modalEditar").hide();
	});

	$('#modalEditar').modal({backdrop:false,show:false});



	$("#nuevoregistro").click(function() {
		$('#modalEditar').show();
                //$('#contenedorDetalles-modal').hide();
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
    
	if($('#'+idCamposModal[1]).attr("value") == -1 || $('#'+idCamposModal[1]).attr("value").length == 0){
            mostarVentana("warning-registro",mensajeWarning[0]);
	} else if($('#'+idCamposModal[2]).attr("value") == null || $('#'+idCamposModal[2]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[1]);
	} else if($('#'+idCamposModal[3]).attr("value") == null || $('#'+idCamposModal[3]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[2]);
	} else if($('#'+idCamposModal[4]).attr("value") == null || $('#'+idCamposModal[4]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[3]);
	} else if($('#'+idCamposModal[6]).attr("value") == -1 || $('#'+idCamposModal[6]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[4]);
	} else if(datosCompra.detalles.length == 0){
		mostarVentana("warning-registro",mensajeWarning[5]);
	}
        else {
                fechaFactura = $('#'+idCamposModal[3]).attr("value");
                fechaVencimiento = $('#'+idCamposModal[4]).attr("value");
                fechaFactura = fechaFactura.substr(6,4)+'-'+fechaFactura.substr(3,2)+'-'+fechaFactura.substr(0,2);
                fechaVencimiento = fechaVencimiento.substr(6,4)+'-'+fechaVencimiento.substr(3,2)+'-'+fechaVencimiento.substr(0,2);
                datosCompra.cabecera = new Object();
                datosCompra.cabecera.proveedor = $('#'+idCamposModal[1]).attr("value");
                datosCompra.cabecera.nroFactura = $('#'+idCamposModal[2]).attr("value");
                datosCompra.cabecera.fechaEmision = fechaFactura;
                datosCompra.cabecera.fechaVencimiento = fechaVencimiento;
		if($("input:radio[id="+idCamposModal[5]+"-si]")[0].checked == true){
			datosCompra.cabecera.credito = 'S';
		} else {
			datosCompra.cabecera.credito = 'N';
		}
                datosCompra.cabecera.formaPago = $('#'+idCamposModal[6]).attr("value");                
		return datosCompra;
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
	 $("#"+idCamposModal[2]).keydown(function(event) {
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
	 $("#"+idCamposModal[7]).keydown(function(event) {
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
	 $("#"+idCamposModal[8]).keydown(function(event) {
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
	$("#"+idCamposModal[0]).attr("value",parametros.idRegistro);
	$("#"+idCamposModal[1]).attr("value",parametros.descripcion);        
        $("#comboTipoInsumo-modal option[value="+parametros.idTipoInsumo+"]").attr("selected",true);
	$("#guardar-registro").html("Modificar");                
}

function limpiarFormulario(){
	$("#error-block-modal").hide();
	$("#warning-block").hide();
	$("#warning-block-registro").hide();
	$("#success-block").hide();
        $("#detallesDiv").hide();        
	$("#"+idCamposModal[0]).attr("value",null);
        $("#comboProveedorModal option[value=-1]").attr("selected",true);
        $("#"+idCamposModal[2]).attr("value",null);
	$("#"+idCamposModal[3]).attr("value",null);
	$("#"+idCamposModal[4]).attr("value",null);
	$("#"+idCamposModal[5]+"-no").attr("checked",true);
        $("#"+idCamposModal[6]+" option[value=-1]").attr("selected",true);        
        $("#tbodyGrillaDetalles").html("");                
        $("#totalCompra").html(0);
        $("#totalImpuesto").html(0);
        $("#"+idCamposModal[11]).html("");
}



function obtenerJsonBuscar(){
	var jsonObject = new Object();
        jsonObject.comboSucursal = null;
        jsonObject.comboProveedor = null;
        jsonObject.nroFacturaCompra = null;
        
	if($("#"+idCamposBusqueda[0]).attr("value") != null && $("#"+idCamposBusqueda[0]).attr("value").length != 0){
		jsonObject.comboSucursal = $("#"+idCamposBusqueda[0]).attr("value");
	}
	if($("#"+idCamposBusqueda[1]).attr("value") != null && $("#"+idCamposBusqueda[1]).attr("value").length != 0){
		jsonObject.comboProveedor = $("#"+idCamposBusqueda[1]).attr("value");
	}        
	if($("#"+idCamposBusqueda[2]).attr("value") != null && $("#"+idCamposBusqueda[2]).attr("value").length != 0){
		jsonObject.nroFacturaCompra = $("#"+idCamposBusqueda[2]).attr("value");
	}                
	var dataString = JSON.stringify(jsonObject);
	return dataString;
}

function cargarComboSucursal(){
	$.ajax({
        url: table+'sucursaldata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#comboSucursalBusqueda").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function cargarComboProveedor(){
	$.ajax({
        url: table+'proveedordata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#comboProveedorBusuqueda").html(respuesta);
                $("#comboProveedorModal").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function cargarComboInsumo(){
	$.ajax({
        url: table+'insumodata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#comboInsumoModal").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function cargarComboFormaPago(){
	$.ajax({
        url: table+'formapagodata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#comboFormaPagoModal").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}

function cargarDatosInsumo(){
    cargarUnidadMedidaInsumo();
    cargarImpuestoInsumo();
}
function cargarUnidadMedidaInsumo(){
	var dataJson = new Object();
	$.blockUI({
            message: "Aguarde un momento por favor"
        });
        dataJson.idInsumo = $('#'+idCamposModal[7]).attr("value");
	$.ajax({
        url: table+'unidadmedidadata',
        type: 'get',
        data: "dataUnidadMedida="+dataJson.idInsumo,
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#unidadMedidaInsumoModal").html(respuesta);
                $.unblockUI();
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
            $.unblockUI();
        }
    });	
}
function cargarImpuestoInsumo(){
	var dataJson = new Object();
	$.blockUI({
            message: "Aguarde un momento por favor"
        });
        dataJson.idInsumo = $('#'+idCamposModal[7]).attr("value");
	$.ajax({
        url: table+'insumoimpuestodata',
        type: 'get',
        data: "dataInsumo="+dataJson.idInsumo,
        dataType: 'html',
        async : false,
        success: function(respuesta){                
                var obj = JSON.parse(respuesta);              
        	$("#impuestoInsumoModal").html('Iva : '+obj.IMP_PORCENTAJE+'%');
                $("#idImpuestoInsumo").attr("value",obj.COD_IMPUESTO);
                $("#idImpuestoPorcentaje").attr("value",obj.IMP_PORCENTAJE);                
                $.unblockUI();
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
            $.unblockUI();
        }
    });	
}
function agregaDetalle(){

	if($('#'+idCamposModal[7]).attr("value") == -1 || $('#'+idCamposModal[7]).attr("value").length == 0){
            mostarVentana("warning-registro",mensajeWarning[5]);
	} else if($('#'+idCamposModal[8]).attr("value") == 0 || $('#'+idCamposModal[8]).attr("value") == null || 
            $('#'+idCamposModal[8]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[6]);
	} else if($('#'+idCamposModal[9]).attr("value") == 0 || $('#'+idCamposModal[9]).attr("value") == null || 
            $('#'+idCamposModal[9]).attr("value").length == 0){
		mostarVentana("warning-registro",mensajeWarning[7]);}
        else{            
            porcentajeImpuesto = $('#idImpuestoPorcentaje').attr("value");
            datosCompra.detalles[contaDetalles] = new Object();
            datosCompra.detalles[contaDetalles].insumoCompra = $('#'+idCamposModal[7]).attr("value");
            datosCompra.detalles[contaDetalles].montoCompra = $('#'+idCamposModal[8]).attr("value");
            datosCompra.detalles[contaDetalles].cantidadCompra = $('#'+idCamposModal[9]).attr("value");            
//            datosCompra.detalles[contaDetalles].codImpuesto = $('#idImpuestoInsumo').attr("value");            
//            datosCompra.detalles[contaDetalles].montoImpuesto = (parseInt(datosCompra.detalles[contaDetalles].montoCompra) * parseInt(porcentajeImpuesto))/100;
            //datosCompra.detalles[contaDetalles] = new Object();
            contaDetallesImpuesto = 0;
            datosCompra.detalles[contaDetalles].impuestos = new Array();
            datosCompra.detalles[contaDetalles].impuestos[contaDetallesImpuesto] = new Object();
            datosCompra.detalles[contaDetalles].impuestos[contaDetallesImpuesto].codImpuesto = $('#idImpuestoInsumo').attr("value");
            datosCompra.detalles[contaDetalles].impuestos[contaDetallesImpuesto].montoImpuesto = (parseInt(datosCompra.detalles[contaDetalles].montoCompra) * parseInt(porcentajeImpuesto))/100;
            
            montoImpuesto = datosCompra.detalles[contaDetalles].impuestos[contaDetallesImpuesto].montoImpuesto;
            insumoDescrip = $("#"+idCamposModal[7]+" option:selected").html();
            montoCompra = $('#'+idCamposModal[8]).attr("value");
            cantidadCompra = $('#'+idCamposModal[9]).attr("value")+" "+$('#'+idCamposModal[10]).html();            
            baseUrl = $('#baseUrl').attr("value");
            str = '<tr id="detalle'+contaDetalles+'">';
            str = str+'<input type="hidden" id="insumoId'+contaDetalles+'" name="insumoId'+contaDetalles+'" value="'+$('#'+idCamposModal[7]).attr("value")+'"/>';
            str = str+'<td><div id="insumoDescrip'+contaDetalles+'" name="insumoDescrip'+contaDetalles+'" align="left">'+insumoDescrip+'</div></td>';
            str = str+'<td><div id="cantidadCompra'+contaDetalles+'" name="cantidadCompra'+contaDetalles+'" align="left">'+cantidadCompra+'</div></td>';            
            str = str+'<td><div id="impuestoCompra'+contaDetalles+'" name="impuestoCompra'+contaDetalles+'" align="left">'+montoImpuesto+'</div></td>';            
            str = str+'<td><div id="montoCompra'+contaDetalles+'" name="montoCompra'+contaDetalles+'" align="left">'+montoCompra+'</div></td>';
            str = str+'<td><a class="btnAddDetalle" href="#" id="btnAdd" onclick ="javascript: recuperaCliente();"><img src="'+ baseUrl + '/css/images/delete.png" alt="Borrar" title="Borrar"/></a></td>';
            str = str+'</tr>';
            $("#tbodyGrillaDetalles").append(str);
            $("#totalCompra").html(parseInt(montoCompra)+parseInt($("#totalCompra").html()));
            $("#totalImpuesto").html(parseInt(montoImpuesto)+parseInt($("#totalImpuesto").html()));            
            contaDetallesImpuesto++;
            contaDetalles++;                                          
        }
}



