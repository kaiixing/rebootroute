var autoreboot_enabled='',autoreboot_time='',autoreboot_hour='',autoreboot_minute='';
(function ($) {
    $.fn.objReboot = function (InIt) {
		var xmlName = '';
        this.onLoad = function () {
            this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            var buttonID = document.getElementById("btRebootRouter").id;
            buttonLocaliztion(buttonID);
			
			var hard_ver = getHardware_Version();
			if(hard_ver=="Ver.A"||hard_ver == "Ver.D"){
			document.getElementById("SRebootTimeUpdate").value = jQuery.i18n.prop("btUpdate_time");
			$("#lt_AutoReboot_stcEnabledAutoReboot").html( jQuery.i18n.prop("lt_portFilter_stcEnabledPortFilter"));
			$("#lt_AutoReboot_stcDisabledAutoReboot").html( jQuery.i18n.prop("lt_portFilter_stcDisabledPortFilter"));
				$("#divrebotdiv").show();
			var xml = getData("autoreboot");
			$(xml).find("auto_reboot").each(function() {
			 autoreboot_enabled = $(this).find("autoreboot_enabled").text();
			 autoreboot_time = $(this).find("autoreboot_time").text();
			 autoreboot_hour = autoreboot_time.substring(0,autoreboot_time.indexOf(":"));
			 autoreboot_minute = autoreboot_time.substring(autoreboot_time.indexOf(":")+1);
			 $("#trerouter_hour").val(autoreboot_hour);
			 $("#trerouter_minute").val(autoreboot_minute);
			 if (1 == autoreboot_enabled) {
                $("#enabledAutoReboot").prop("checked", true);
            } else {
                $("#disabledAutoReboot").prop("checked", true);
            }
			 if(autoreboot_enabled == 1)
			 	$("#divautorebootSet").show();
			 else
			 	$("#divautorebootSet").hide();
			});
			}else{
				$("#divrebotdiv").hide();
			}
        }

        this._Reboot=function() {
            var xml = getData(xmlName);
            sm('rebootRouterModalBox',319,170);
            document.getElementById("h1RebootRouter").innerHTML = jQuery.i18n.prop("h1RebootRouter");
            document.getElementById("lRebootedRouter").innerHTML = jQuery.i18n.prop("lRebootedRouter");


            afterRebootID =  setInterval("afterReboot()", 45000);
        }

        this.onPost  =  function  () {
            if (confirm("Are you sure you want to Reboot the Router?")) {
                var xml = getData(xmlName);
                sm('rebootRouterModalBox',319,170);
                document.getElementById("h1RebootRouter").innerHTML = jQuery.i18n.prop("h1RebootRouter");
                document.getElementById("lRebootedRouter").innerHTML = jQuery.i18n.prop("lRebootedRouter");


                afterRebootID =  setInterval("afterReboot()", 45000);

            }

        }
		this.onPostSuccess  =  function  () {
            this.onLoad()
        }

        this.afterReboot = function () {
            hm();
            clearInterval(afterRebootID);
            clearAuthheader();
        }

        this.setXMLName = function (_xmlname) {
            xmlName = _xmlname;
        }

        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/router/reboot_router.html");
        }

        return this.each(function () {
        });

    }
})(jQuery);
function SaveRebootOnTimeData(){
	$("lrebootTimeErrorLogs").hide();
	if(!isNumber($("#trerouter_hour").val())||!isNumber($("#trerouter_minute").val())||
		$("#trerouter_hour").val()==''||$("#trerouter_minute").val() == ''||
		$("#trerouter_hour").val().length > 2 ||$("#trerouter_minute").val().length >2||
		parseInt($("#trerouter_hour").val())>= 24||parseInt($("#trerouter_minute").val())>=60){
		$("lrebootTimeErrorLogs").html(jQuery.i18n.prop("lreboothourerror"));
		$("lrebootTimeErrorLogs").show();
		return;
	}
	if($("#trerouter_hour").val().length == 1){
		$("#trerouter_hour").val('0'+$("#trerouter_hour").val());
		}
	if($("#trerouter_minute").val().length ==1){
		$("#trerouter_minute").val('0'+$("#trerouter_minute").val());
		}
	var rdenabledAutoReboot,rdenrboothour,rdenrbootminute,rdenrboottime;
	rdenrboothour = $("#trerouter_hour").val();
	rdenrbootminute = $("#trerouter_minute").val();
	if(document.getElementById('enabledAutoReboot').checked)
		rdenabledAutoReboot = 1;
		else
		rdenabledAutoReboot = 0;
	if(rdenabledAutoReboot == 0 && autoreboot_enabled ==0)
		return;

	if(rdenabledAutoReboot ==1 && autoreboot_enabled ==1 && parseInt(rdenrboothour) == parseInt(autoreboot_hour) && parseInt(rdenrbootminute) == parseInt(autoreboot_minute))
		return;
	rdenrboottime = rdenrboothour+":"+rdenrbootminute
	 var mapData = new Array();
    putMapElement(mapData, "RGW/auto_reboot/autoreboot_enabled", rdenabledAutoReboot, 0);
    putMapElement(mapData, "RGW/auto_reboot/autoreboot_time", rdenrboottime, 1);

    postXML("auto_reboot", g_objXML.getXMLDocToString(g_objXML.createXML(mapData )));
	}
function autoRebootradio(){
	if (document.getElementById('enabledAutoReboot').checked) {
       $("#divautorebootSet").show(); 
    } else {
       $("#divautorebootSet").hide(); 
    }
	}
function rebootRouter() {
    sm('rebootRouterBox',360,120);
    document.getElementById("btnRebootOK").innerHTML = jQuery.i18n.prop("btnRebootOK");
    document.getElementById("btnModalCancle").innerHTML = jQuery.i18n.prop("btnModalCancle");
    document.getElementById("h1RebootRouter").innerHTML = jQuery.i18n.prop("h1RebootRouter");
    document.getElementById("lQueryRebootedRouter").innerHTML = jQuery.i18n.prop("lQueryRebootedRouter");

}
function OnRebootOK() {
    hm();
    g_objContent._Reboot();
}
function onRebootCancle() {
    hm();
}
