
table = "/menus/menu/";


$().ready(function() {    
        cargarComboSucursal();
        userFocus();        
});

function cargarComboSucursal(){
	$.ajax({
        url: table+'sucursaldata',
        type: 'post',
        dataType: 'html',
        async : false,
        success: function(respuesta){
        	$("#SelecAgencia").html(respuesta);
        },
        error: function(event, request, settings){
         //   $.unblockUI();
            alert("Ha ocurrido un error");
        }
    });	
}
function hacerSubmit(){
    if($('#SelecAgencia').val() == 0){alert("Debe seleccionar sucursal!!");retunr;}
    document.submit();
}
function userFocus(){
    //document.getElementById('username').onfocus;
    $("#username").focus();
}
function passFocus(){
    //document.getElementById('password').onfocus;
        $("#password").focus();
}
function agenciaFocus()
{
    $("#SelecAgencia").focus();
}
function botonFocus()
{
    $("#signin_submit").focus();
}



