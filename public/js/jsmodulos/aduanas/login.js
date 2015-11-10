$().ready(function() {
	


});

function validar() {
    if ($('#user').attr("value") === null || $('#user').attr("value").length === 0) {
        alert("Tipea tu usuario");
        return;
    } else if ($('#pass').attr("value") === null || $('#pass').attr("value").length === 0) {
        alert("Olvidaste tu contraseña");
        return;
    } else {
        return;
    }
}








