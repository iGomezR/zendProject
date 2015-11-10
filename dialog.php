<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Gesti&oacute;n de pago de cuotas - Escuela</title>
        <script type="text/javascript" src="public/js/jquery-latest.pack.js"></script>
        <script language="javascript" type="text/javascript">

            $(document).ready(function() {
                    //Get the A tag
                    var id = "#dialog2";

                    //Get the screen height and width
                    var maskHeight = $(document).height();
                    var maskWidth = $(window).width();

                    //Set heigth and width to mask to fill up the whole screen
                    $('#mask').css({'width':maskWidth,'height':maskHeight});

                    //transition effect
                    $('#mask').fadeIn(1000);
                    $('#mask').fadeTo("slow",0.8);

                    //Get the window height and width
                    var winH = $(window).height();
                    var winW = $(window).width();

                    //Set the popup window to center
                    $(id).css('top',  winH/2-$(id).height()/2);
                    $(id).css('left', winW/2-$(id).width()/2);

                    //transition effect
                    $(id).fadeIn(2000);

                //if close button is clicked
                $('.window .close').click(function (e) {
                    //Cancel the link behavior
                    e.preventDefault();

                    $('#mask').hide();
                    $('.window').hide();
                    window.location.href = $('#destino').val();
                });

                //if mask is clicked
                $('#mask').click(function () {
                    $(this).hide();
                    $('.window').hide();
                    window.location.href = $('#destino').val();
                });

            });

        </script>
        <style type="text/css">
            body {
                font-family:verdana;
                font-size:15px;
            }

            a {color:#333; text-decoration:none}
            a:hover {color:#ccc; text-decoration:none}

            #mask {
                position:absolute;
                left:0;
                top:0;
                z-index:9000;
                background-color:#000;
                display:none;
            }

            #boxes .window {
                position:absolute;
                left:0;
                top:0;
                width:440px;
                height:200px;
                display:none;
                z-index:9999;
                padding:20px;
            }
            
            #boxes #dialog2 {
                background:url(public/images/notice.png) no-repeat 0 0 transparent;
                width:326px;
                height:229px;
                padding:50px 0 20px 25px;
            }
        </style>
    </head>
    <body>
        <div id="boxes">
            <div id="dialog2" class="window">
                <p><?php echo $_GET[ 'titulo']; ?></p>
                <p><?php echo $_GET['mensaje']; ?></p>
                <input type="hidden" id="destino" value="<?php echo $_GET['destino']; ?>"></input>
                <input type="button" value="Volver" class="close"/>
            </div>
            <div id="mask"></div>
        </div>
        <script LANGUAGE="JavaScript">
            function redireccionar()
            {
                location.href= $("#destino").val();
            }
        setTimeout ("redireccionar()", 3000);
        </script>
    </body>
</html>
