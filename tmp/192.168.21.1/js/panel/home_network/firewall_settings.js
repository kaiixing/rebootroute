(function ($) {
    $.fn.objFirewall_Settings = function (InIt) {

        var rdRadioFirewall;

	var rdRadioIPSec;
	var rdRadioPPTP;
	var rdRadioL2TP;

        var controlMapExisting=new Array(0);
        var controlMapCurrent=new Array(0);

	var xmlName = '';

        this.onLoad = function () {
	    var index = 0;
	    this.loadHTML();
document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
	    var xml = getData(xmlName);

            var mode;

            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);

            var buttonID = document.getElementById("btUpdate").id;
            buttonLocaliztion(buttonID);

            mode=$(xml).find("mode").text();
            rdRadioFirewall.setRadioButton(mode);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting,index++, "RGW/firewall/mode",mode);

	    if ( mode == "0") {
		document.getElementById('vpn').style.display = 'none';
	    }
	    else {
		document.getElementById('vpn').style.display = 'block';
	    }

	    var ipsec_passthrough;
	    var pptp_passthrough;
	    var l2tp_passthrough;

            $(xml).find("vpn").each(function(){
		    ipsec_passthrough = $(this).find("ipsec_passthrough").text();
	    	    pptp_passthrough = $(this).find("pptp_passthrough").text();
		    l2tp_passthrough = $(this).find("l2tp_passthrough").text();
	    });
	    
	    rdRadioIPSec.setRadioButton(ipsec_passthrough);
	    controlMapExisting = g_objXML.putMapElement(controlMapExisting,index++, "RGW/firewall/vpn/ipsec_passthrough",ipsec_passthrough);
	    
	    rdRadioPPTP.setRadioButton(pptp_passthrough);
	    controlMapExisting = g_objXML.putMapElement(controlMapExisting,index++, "RGW/firewall/vpn/pptp_passthrough",pptp_passthrough);

	    rdRadioL2TP.setRadioButton(l2tp_passthrough);
	    controlMapExisting = g_objXML.putMapElement(controlMapExisting,index++, "RGW/firewall/vpn/l2tp_passthrough",l2tp_passthrough);

            controlMapCurrent = g_objXML.copyArray(controlMapExisting,controlMapCurrent);
        }

        this.onPost = function () {
	    var _controlMap = this.getPostData();
	    if(_controlMap.length>0) {
		postXML("firewall", g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap)));
		//this.onLoad();
	    }
        }
 this.onPostSuccess = function (){
        this.onLoad(false);
        }
        this.getPostData = function (){
            var index = 0;
            var mapData = new Array(0);
            controlMapCurrent[index++][1] = rdRadioFirewall.getRadioButton();

            controlMapCurrent[index++][1] = rdRadioIPSec.getRadioButton();
            controlMapCurrent[index++][1] = rdRadioPPTP.getRadioButton();
            controlMapCurrent[index++][1] = rdRadioL2TP.getRadioButton();

            mapData = g_objXML.copyArray(controlMapCurrent,mapData);
            mapData = g_objXML.getChangedArray(controlMapExisting,mapData,true);
            return mapData;
        }

        this.loadHTML =  function() {
	    document.getElementById('Content').innerHTML ="";
	    document.getElementById('Content').innerHTML = callProductHTML("html/home_network/firewall_settings.html");
	    rdRadioFirewall = $("#rdRadioFirewall").enabled_disabled("rdRadioFirewall");
	    rdRadioIPSec = $("#rdRadioIPSec").enabled_disabled("rdRadioIPSec");
	    rdRadioPPTP = $("#rdRadioPPTP").enabled_disabled("rdRadioPPTP");
	    rdRadioL2TP = $("#rdRadioL2TP").enabled_disabled("rdRadioL2TP");
        }

        this.setXMLName = function (_xmlname){
            xmlName = _xmlname;
        }

        return this.each(function () {
	    });
    }
})(jQuery);

function showVPN(){
    if ( document.getElementById('rdRadioFirewallEnabled').checked )
	document.getElementById('vpn').style.display = 'block';	
    else
	document.getElementById('vpn').style.display = 'none';	
}
