// JavaScript Document

/* ---------- FUNCI�N QUE CAMBIA DE TABS BARRA DERECHA ------- */
function tabSwitch(active, number, tab_prefix, content_prefix) {
	
	for (var i=1; i < number+1; i++) {
	  document.getElementById(content_prefix+i).style.display = 'none';
	  document.getElementById(tab_prefix+i).className = '';
	}
	document.getElementById(content_prefix+active).style.display = 'block';
	document.getElementById(tab_prefix+active).className = 'active';	
	
}
/*-----------------------------------------------------------------*/

var antes = 0
function menu(abc)
{
	//funcion que muestra solo el menu seleccionado, oculata los demas
	if (antes != 0 && antes != abc) document.getElementById(antes).style.display = 'none'
	if (document.getElementById(abc).style.display == 'none')
	   document.getElementById(abc).style.display = 'block'
	else
	   document.getElementById(abc).style.display = 'none'
	antes = abc
}

function mos_ocu(abc)
{
    //funcion que muestra el menu seleccionado, sin ocultar los demas
	if (document.getElementById(abc).style.display == 'none')
	   document.getElementById(abc).style.display = 'block'
	else
	   document.getElementById(abc).style.display = 'none'
}

function loadCSS(url) {
    var lnk = document.createElement('link');
    lnk.setAttribute('type', 'text/css' );
    lnk.setAttribute('rel', 'stylesheet' );
    lnk.setAttribute('href', url );
    
    //document.getElementsByTagName(�head�).item(0).appendChild(lnk);
    //parent.frames['iframesup'].getElementsByTagName('head').item(0).appendChild(lnk);
    //parent.frames['iframemeio'].getElementsByTagName('head').item(0).appendChild(lnk);
    //iframesup.getElementsByTagName('head').item(0).appendChild(lnk);
}

function fechaActual() {
    var fecha=new Date();
    var diames=fecha.getDate();
    var diasemana=fecha.getDay();
    var mes=fecha.getMonth() +1 ;
    var ano=fecha.getFullYear();
    var fecha_actual = "";
    
    var textosemana = new Array (7);
      textosemana[0]="Domingo";
      textosemana[1]="Lunes";
      textosemana[2]="Martes";
      textosemana[3]="Mi&eacute;rcoles";
      textosemana[4]="Jueves";
      textosemana[5]="Viernes";
      textosemana[6]="S&aacute;bado";

    var textomes = new Array (12);
      textomes[1]="Enero";
      textomes[2]="Febrero";
      textomes[3]="Marzo";
      textomes[4]="Abril";
      textomes[5]="Mayo";
      textomes[6]="Junio";
      textomes[7]="Julio";
      textomes[7]="Agosto";
      textomes[9]="Septiembre";
      textomes[10]="Octubre";
      textomes[11]="Noviembre";
      textomes[12]="Diciembre";

    /*document.write("Fecha completa: " + fecha + "<br>");
    document.getElementById("hora").innerHTML=parseInt(hora/3600%24).toString()+":"+parseInt(hora/600%6)+parseInt(hora/60%10).toString()+":"+parseInt(hora/10%6).toString()+parseInt(hora%10).toString()+" ";
    document.write("Dia mes: " + diames + "<br>");
    document.write("Dia semana: " + diasemana + "<br>");
    document.write("Mes: " + mes + "<br>");
    document.write("Año: " + ano + "<br>");
    document.write("Fecha: " + diames + "/" + mes + "/" + ano + "<br>");
    document.write("Fecha: " + textosemana[diasemana] + " " + diames + "/" + mes + "/" + ano + "<br>");
    document.write("Fecha: " + textosemana[diasemana] + ", " + diames + " de " + textomes[mes] + " de " + ano + "<br>");
    */
   fecha_actual = textosemana[diasemana] + ", " + diames + " de " + textomes[mes] + " de " + ano;
   document.getElementById("fecha_actual").innerHTML = fecha_actual;
}