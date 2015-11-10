
var hora = parseInt(document.getElementById("time").value);
hora = parseInt(hora) + 1;

//var hora = 898794156465;
function UR_Start(){
	hora+=1;
	document.getElementById("hora").innerHTML=parseInt(hora/3600%24).toString()+":"+parseInt(hora/600%6)+parseInt(hora/60%10).toString()+":"+parseInt(hora/10%6).toString()+parseInt(hora%10).toString()+" ";
        setInterval("UR_Start();",1000);
}



function mueveReloj(){
        momentoActual = new Date()
        hora = momentoActual.getHours()
        minuto = momentoActual.getMinutes()
        segundo = momentoActual.getSeconds()

        horaImprimible = hora + ":" + minuto + ":" + segundo

        document.getElementById("hora").innerHTML = horaImprimible;        
        setTimeout("mueveReloj()",1000)
}
