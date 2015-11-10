table = "/administrativo/ordendeanalisis/";
mensajeWarning = new Array(
        "id-registro",
        "Complete el Id de Usuario por favor",
        "Complete el Nombre y Apellido por favor",
        "Ingrese Password",
        "Grupo Usuario",
        "Seleccione Grupo Usuario",
        "Confirme el password");
idCamposBusqueda = new Array("descripcionBusqueda");
idCamposGrilla = new Array("id-registro","selectNro_orden_de_entrada","desc_proveedor",'desc_usuario_analista',"selectClaveParametro","resultado_analisis",
'fecha_registro');

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
                $("#addDetalle").show();
                $('#divDatosDetalle').hide();                
		$('#'+idCamposGrilla[0]).attr("value",null);
		$('#accion').attr("value","nuevo");
		$("#guardar-registro").html("Guardar");
                $("#guardar-registro").hide();
		$("#editar-nuevo").html("Nuevo Registro"); 
                $("#labelDescuentos").html("Descuentos");
                $('#'+idCamposGrilla[1]).attr("value", '');
                $('#'+idCamposGrilla[1]).attr("disabled", false);
                $('#'+idCamposGrilla[2]).attr("disabled", false);
                $('#'+idCamposGrilla[3]).attr("disabled", false);
                $('#'+idCamposGrilla[4]).attr("disabled", false);  
                cargamentopendientesdeanalisis();
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
        $("#addDetalle").click(function() {                           
            if($('#selectNro_orden_de_entrada').attr("value") == -1 || $('#selectNro_orden_de_entrada').attr("value").length == 0){
                mostarVentana("warning-registro","Debe seleccionar una Orden de Entrada");
                $('#selectNro_orden_de_entrada').focus();
            } else if($('#selectClaveParametro').attr("value") == -1 || $('#selectClaveParametro').attr("value").length == 0){
                mostarVentana("warning-registro","Debe seleccionar un Tipo de Analisis");
                $('#selectClaveParametro').focus();
            } else if($('#resultado_analisis').attr("value") == null || ($('#resultado_analisis').attr("value") == '')){
                mostarVentana("warning-registro","Debe ingresar un resultado del analisis");
                $('#resultado_analisis').focus();
            }
            else{
                $('#divDatosDetalle').show();
                addItem();                          
                $('#selectNro_orden_de_entrada').attr("disabled",true);              
                $('#selectClaveParametro').attr("value",-1);
                $('#resultado_analisis').attr("value",'');            
            }                        
        }); 
        $("#selectNro_orden_de_entrada").change(function() {
                var jsonObject = new Object();
                jsonObject.cod_cargamento = $('#selectNro_orden_de_entrada').val();
                var dataString = JSON.stringify(jsonObject);
                $.ajax({
                    url: table+'ordendeentradadata',
                    type: 'post',
                    data: {"parametros":dataString},
                    dataType: 'json',
                    async : false,
                    success: function(respuesta){
                            $("#desc_proveedor").attr('value',respuesta.desc_proveedor);
                            $("#desc_usuario_analista").attr('value',respuesta.desc_usuario_analista);
                            $("#fecha_registro").attr('value',respuesta.fecha_registro);
                            //$("#desc_proveedor").html(respuesta.desc_proveedor);
                            //$("#desc_usuario_analista").html(respuesta.desc_usuario_analista);                         
                    },
                    error: function(event, request, settings){
                     //   $.unblockUI();
                        alert("Ha ocurrido un error");
                    }
                });	            
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
    $("#"+idCamposGrilla[5]).keydown(function(event) {
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
        cargamentoprocesadodeanalisis();
        $("#grillaDetalleModal").jqGrid("clearGridData");
        $("#addDetalle").hide();        
	$("#modalEditar").show();
	$("#editar-nuevo").html("Editar Registro");
        $('#accion').attr("value","editar");
        $("#"+idCamposGrilla[1]+" option[value="+parametros.codigo+"]").attr("selected",true);
        $('#'+idCamposGrilla[1]).attr("disabled", true);

        var jsonObject = new Object();
        jsonObject.cod_cargamento = $('#selectNro_orden_de_entrada').val();
        var dataString = JSON.stringify(jsonObject);
        $.ajax({
            url: table+'ordendeentradadata',
            type: 'post',
            data: {"parametros":dataString},
            dataType: 'json',
            async : false,
            success: function(respuesta){
                    $("#desc_proveedor").attr('value',respuesta.desc_proveedor);
                    $("#desc_usuario_analista").attr('value',respuesta.desc_usuario_analista);
                    $("#fecha_registro").attr('value',respuesta.fecha_registro);
                    //$("#desc_proveedor").html(respuesta.desc_proveedor);
                    //$("#desc_usuario_analista").html(respuesta.desc_usuario_analista);                         
            },
            error: function(event, request, settings){
             //   $.unblockUI();
                alert("Ha ocurrido un error");
            }
        });	            

/*         if(parametros.estado === 'Activo')
            $('input[name='+idCamposGrilla[4]+']').attr('checked', true);            
        else
            $('input[name='+idCamposGrilla[4]+']').attr('checked', false);
*/
        
	$("#guardar-registro").html("Modificar");
        $("#guardar-registro").hide();
        $.ajax({
            url: '/carboneria/public/index.php/administrativo/ordendeanalisis/modaleditar',
            type: 'post',
            data: {
                "NumeroInterno": parametros.codigo
            },
            dataType: 'json',
            async: false,
            success: function(respuesta) {
                for (var i = 0; i < respuesta.length; i++) {
                    var insertdetails = new Object();
                    insertdetails.id_orden_de_analisis =respuesta[i].id_orden_de_analisis;
                    insertdetails.cod_cargamento = respuesta[i].cod_cargamento;
                    insertdetails.desc_clave_parametro = respuesta[i].desc_clave_parametro;
                    insertdetails.clave_parametro = respuesta[i].clave_parametro;                    
                    insertdetails.resultado_analisis = respuesta[i].resultado_analisis;
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
        $("#"+idCamposGrilla[4]).attr("value",-1);  
        $("#"+idCamposGrilla[5]).attr("value",null);
        $("#"+idCamposGrilla[6]).attr("value",null);
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
        	$("#"+idCamposGrilla[4]).html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function cargamentopendientesdeanalisis(){
	$.ajax({
        url: table+'cargamentopendientesdeanalisisdata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#selectNro_orden_de_entrada").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function cargamentoprocesadodeanalisis(){
	$.ajax({
        url: table+'cargamentoprocesadodeanalisisdata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#selectNro_orden_de_entrada").html(respuesta);
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
/*                
$idCamposGrilla = array("id-registro","selectNro_orden_de_entrada","desc_proveedor",'desc_usuario_analista',
"selectClaveParametro","resultado_analisis");
*/     
    jsonObject.id_orden_de_analisis = null;
    jsonObject.cod_cargamento = $("#"+idCamposGrilla[1]+" option:selected").val();
    jsonObject.desc_clave_parametro = $("#"+idCamposGrilla[4]+" option:selected").text();
    jsonObject.clave_parametro = $("#"+idCamposGrilla[4]+" option:selected").val();
    jsonObject.resultado_analisis = $("#"+idCamposGrilla[5]).attr("value");
//        alert(JSON.stringify(jsonObject));
    var codigoDetalle = jsonObjectRequest.detalles.length;
    jsonObjectRequest.detalles[codigoDetalle] = new Object();
    jsonObjectRequest.detalles[codigoDetalle].cod_cargamento = jsonObject.cod_cargamento;
    jsonObjectRequest.detalles[codigoDetalle].desc_clave_parametro = jsonObject.desc_clave_parametro;
    jsonObjectRequest.detalles[codigoDetalle].clave_parametro = jsonObject.clave_parametro;
    jsonObjectRequest.detalles[codigoDetalle].resultado_analisis = jsonObject.resultado_analisis;
    return jsonObject;    
}




