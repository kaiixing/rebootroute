var flag_hide = 1;
var cellular_save = 0;
var _WiFiIntervalSelectID;
var _WiFiConnInterval = 5000;
var SelectNetworkValue;
var BGScanTimeValue;
var BGScanPopupCancel;
var ManualNetworkSelect;
var searchNetworkStartTime = 0;
var bIsScanNetwork = false;
var pinStatus;
var zmscanstatus;
var bCompleteScanNetwork = false;
(function($) {

    $.fn.objManualNetwork = function(InIt) {
        var ip_divCustomeDNS1;
        var ip_divCustomeDNS2;
        var rdRadioMode;
        var xmlName = '';
		bCompleteScanNetwork = false;
        var controlMapExisting = new Array(0);
        var controlMapCurrent = new Array(0);
        var arrayISPProvider = new Array(0);
        var arrayMannualNetwork = new Array(0);
        var arrayDusterNetwork = new Array(0);

        var active_isp = '';
        var indexWN = 0;
        var network_select_done = 0;
        _arrayWirelessNws = new Array(0);


        this.onLoad = function() {
            this.loadHTML();
            $("#btUpdate1").prop("disabled", false);
            buttonLocaliztion("btUpdate");
            buttonLocaliztion("btUpdate1");
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            $("#scanNetworkWaiting").text(jQuery.i18n.prop("waitScanNetwork"));
            $("#selectEmptyNetworkTypeErrorTip").text(jQuery.i18n.prop("selectEmptyNetworkTypeErrorTip"));
            this.dispalyAllNone();
            xml = getData(xmlName);
            ManualNetworkSelect = 0;
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            $("#disconnectNetTip").text(jQuery.i18n.prop("disconnectNetTip"));
			if(zmscanstatus == 1){
			$("#lMannualNetwork").show();
			$("#Networkdropdown").show();
			zmscanstatus = 0;
			}else {
			$("#lMannualNetwork").hide();
			$("#Networkdropdown").hide();
			}
            proto = $(xml).find("proto").text();
            $(xml).find("cellular").each(function() {
                manual_network_check = $(this).find("manual_network_start").text();
                //network_param_value = $(this).find("network_param").text();
                auto_network = $(this).find("auto_network").text();
                bgscan_time_value = $(this).find("bgscan_time").text();
                network_select_done = $(this).find("network_select_done").text();

               var selectNWMode = $(this).find("select_NW_Mode").text();
               if(0 == selectNWMode)
               {
                    $("#txtCurrentScanMode").text(jQuery.i18n.prop("AutoSelectNWMode"));
               }
               else if(1 == selectNWMode)
               {
                    $("#txtCurrentScanMode").text(jQuery.i18n.prop("ManualSelectNWMode"));
               }
               else
               {
                    $("#txtCurrentScanMode").text(jQuery.i18n.prop("UnkownSelectNWMode"));
               }


                //pin_status:0--ready;1--pin enable;2--puk enable
                pinStatus = $(this).find("pin_status").text();

                //sim_status:0--sim card exist;1--sim card absent.
                if (0 == $(this).find("sim_status").text()) {
                    g_bSimCardExist = true;
                }


                $(this).find("mannual_network_list").each(function() {
                    if ($(this).find("Item").length > 0 ) {
						bCompleteScanNetwork = true;
						if(bIsScanNetwork){
                        	bIsScanNetwork = false;						
                        	confirm(jQuery.i18n.prop("completeScanNetwork"));
						}
                    }
                });
            });

            if (bIsScanNetwork) {
                $("#scanNetworkWaiting").show();
                $("#btUpdate1").prop("disabled", true);
                $("#btUpdate1").parent(".btnWrp:first").addClass("disabledBtn");
            }

            if (network_select_done == '2')//selece network failed
            {

            }
            document.getElementById("manual_network_check2div").style.display = "none";

            if (manual_network_check == '1' || manual_network_check == '2')
                document.getElementById("manual_network_check2").checked = true;
            else
                document.getElementById("manual_network_check2").checked = false;

            document.getElementById("BgScanTimedropdown").value = bgscan_time_value;
            BGScanTimeValue = bgscan_time_value;
            this.loadManualNetwork();
            var optionElements = document.getElementsByTagName("option");
            pElementLocaliztion(optionElements);
        }
        this.dispalyAllNone = function() {
        }
        this.clearControlArray = function() {
            controlMapExisting = null;
            controlMapCurrent = null;
            controlMapExisting = new Array(0);
            controlMapCurrent = new Array(0);
        }
        this.onPost = function(flag) {
            SelectNetworkChanged();

        }
        this.onPostSuccess = function() {
            this.onLoad();
        }

        this.getPostData = function() {
            return this.getManualNetworkData();
        }
        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/internet/manual_network.html");
        }
        this.updateIndex = function() {
            return index++;
        }

        this.loadManualNetwork = function(flag) {

            var network_name = "";
            var network_act = "";
            var network_plmn = "";
            var name_act_web = "";
            var name_act_plmn = "";
            var arrayindex = 0;
            var VarMannualNetwork;
            document.getElementById("ManualNetwork_div").style.display = "block";
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, 0, "RGW/wan/proto", proto);
            VarMannualNetwork = $(xml).find("plmm_name").text();

            function networkAct2Mode(networkAct) {
                var act_netmode = "";
                switch (networkAct) {
                    case "0":
                        act_netmode = '2G';
                        break;
                    case "1":
                        act_netmode = '2G C';
                        break;
                    case "2":
                        act_netmode = '3G';
                        break;
                    case "3":
                        act_netmode = '2G(EDGE)';
                        break;
                    case "4":
                        act_netmode = '3G(HSDPA)';
                        break;
                    case "5":
                        act_netmode = '3G(HSUPA)';
                        break;
                    case "6":
                        act_netmode = '3G(HSDPA+HSUPA)';
                        break;
                    case "7":
                        act_netmode = '4G(LTE)';
                        break;
                    default:
                        break;

                }
                return act_netmode;
            }

            // arrayDusterNetwork.push(VarMannualNetwork);
            $(xml).find("cellular").each(function() {
                network_param_value = $(this).find("network_param").text();
                SelectNetworkValue = network_param_value;
                $(this).find("mannual_network_list").each(function() {
                    $(this).find("Item").each(function() {
                        arrayDusterNetwork[arrayindex] = new Array(1);
                        arrayDusterNetwork[arrayindex][0] = $(this).find("name").text();
                        arrayDusterNetwork[arrayindex][1] = $(this).find("act").text();
                        arrayDusterNetwork[arrayindex][2] = $(this).find("plmm_name").text();
                        network_plmn = $(this).find("plmm_name").text();
                        network_name = $(this).find("name").text();
                        network_act = $(this).find("act").text();
                        arrayindex++;
						var t_network_name = network_name;
						if("cn" == getCookie("locale")){
							
						if(network_name == "CMCC")
							t_network_name = jQuery.i18n.prop("lCMCC");
						else if (network_name == "UNICOM")
							t_network_name = jQuery.i18n.prop("lUNICOM");
						else if (network_name == "CTCC")
							t_network_name = jQuery.i18n.prop("lCTCC");
							}
                        name_act_web = t_network_name + ' ' + networkAct2Mode(network_act);
                        name_act_plmn = network_name + '%' + network_act + '%' + network_plmn;
                        var opt = document.createElement("option");
                        document.getElementById("Networkdropdown").options.add(opt);
                        opt.text = name_act_web;
                        opt.value = name_act_plmn;
                    });
                });

                name_act_web = 'Auto';
                name_act_plmn = '30';
                var opt_auto = document.createElement("option");
                document.getElementById("Networkdropdown").options.add(opt_auto);
                opt_auto.id = 'dropdownAuto';
                opt_auto.text = name_act_web;
                opt_auto.value = name_act_plmn;
                //document.getElementById("Networkdropdown").selectedIndex = 0;

            });

            /*network_param_value is 30 when auto connect status*/
            if (network_param_value.length == 0 || network_param_value == "30") {
                $("#Networkdropdown").val("30");
            }
            else {
                $("#Networkdropdown").val(network_param_value);
            }


//            var networkParm = network_param_value.split("%");
//            var optionText = networkParm[0] + ' ' + networkAct2Mode(networkParm[1]);
//            var optHtmlText = "<option value=\"" + network_param_value + "\">" + optionText + "</option>";
//            $("#Networkdropdown").prepend(optHtmlText);
//            $("#Networkdropdown").val(optionText);

            //            $("#Networkdropdown").mousedown(function() {
            //                $("#Networkdropdown").children("option:first").hide();
            //            });
        }

        this.clearStatus = function() {
            for (var i = 0; i < _arrayWirelessNws.length; i++) {
                STATUSID = "Status" + i;
                document.getElementById(STATUSID).innerHTML = "";
            }
        }

        this.getManualNetworkData = function() {

            var mapData = new Array(0);
            controlMapCurrent[0][1] = document.getElementById("micdropdown").value;
            mapData = g_objXML.copyArray(controlMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(controlMapExisting, mapData, true);
            return mapData;
        }

        this.is_active_isp = function(isp) {
            if (isp == active_isp) {
                return true;
            }
            return false
        }
        this.putMapElement = function(xpath, value, index) {
            mapData[index] = new Array(2);
            mapData[index][0] = xpath;
            mapData[index][1] = value;
        }


        function SelectNetworkChanged() {
            var linkObj = document.getElementById("Networkdropdown");

            if (linkObj.selectedIndex == -1) {
                $("#selectEmptyNetworkTypeErrorTip").show();
                return;
            }
            var value = linkObj.options[linkObj.selectedIndex].value;
            var BGtimelinkObj = document.getElementById("BgScanTimedropdown");
            var BGtimevalue = BGtimelinkObj.options[BGtimelinkObj.selectedIndex].value;

            var itemIndex = 0;
            var mapData = new Array();
            if (BGScanTimeValue != BGtimevalue) {
                BGScanTimeValue = BGtimevalue;
                putMapElement(mapData, "RGW/wan/cellular/bgscan_time", BGScanTimeValue, itemIndex++);
                putMapElement(mapData, "RGW/wan/cellular/bgscan_time_action", 1, itemIndex++);
            }

                putMapElement(mapData, "RGW/wan/cellular/network_param", value, itemIndex++);				
		   		if (bCompleteScanNetwork || SelectNetworkValue != value) {
					putMapElement(mapData, "RGW/wan/cellular/network_param_action", 1, itemIndex++);
		   		}else{
					putMapElement(mapData, "RGW/wan/cellular/network_param_action", 0, itemIndex++);
				}
                putMapElement(mapData, "RGW/wan/cellular/network_select_done", 0, itemIndex++); //can select a specific network



    		if (document.getElementById("manual_network_check2").checked && 0 == manual_network_check){
				putMapElement(mapData, "RGW/wan/cellular/manual_network_start", 1, itemIndex++);        		
    		}else if(!document.getElementById("manual_network_check2").checked && (1 == manual_network_check || 2 == manual_network_check)){
        		putMapElement(mapData, "RGW/wan/cellular/manual_network_start", 0, itemIndex++);      
    		}    
    		

            postXML("wan", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));            
        }

        return this.each(function() {
        });
    }
})(jQuery);

function HideErrorTip()
{
	$("#selectEmptyNetworkTypeErrorTip").hide();
}

function btnCancelMannualNetwork() {
    hm();
}
function btnCancelMannualNetworkFail() {
    hm();
}
function localizeMBAddNewProfile() {
    var arrayLabels = document.getElementsByTagName("label");
    lableLocaliztionMBProfile(arrayLabels);
}
function lableLocaliztionMBProfile(labelArray) {
    for (var i = 0; i < labelArray.length; i++) {
        if (jQuery.i18n.prop(labelArray[i].id) != null)
            getID(labelArray[i].id).innerHTML = jQuery.i18n.prop(labelArray[i].id);
    }
}

function ManualNetworkChange() {
    var manualnetworkchecked;
    if (document.getElementById("manual_network_check2").checked)
        manualnetworkchecked = 1;
    else
        manualnetworkchecked = 0;
    var itemIndex = 0;
    mapData = null;
    mapData = new Array();
    putMapElement_test("RGW/wan/cellular/manual_network_start", manualnetworkchecked, itemIndex++);
    if (mapData.length > 0) {
        postXML("wan", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    }
}
function BgScanTimeDropdown() {
    var linkObj = document.getElementById("BgScanTimedropdown");
    var value = linkObj.options[linkObj.selectedIndex].value;
    BGScanTimeValue = value;
    //document.getElementById("CIdle").style.display = "none";
}
function conndropdownChanged() {
    var linkObj = document.getElementById("Cconndropdown");
    var value = linkObj.options[linkObj.selectedIndex].value;

    //document.getElementById("CIdle").style.display = "none";
}

function CancelS(d) {
    hm(d);
}

function ManualScanNetwork() {
    sm("ManualScanConfigure");
    //document.getElementById("CIdle").style.display = "none";
}

function conndropdownChanged() {
    var linkObj = document.getElementById("Cconndropdown");
    var value = linkObj.options[linkObj.selectedIndex].value;

    document.getElementById("CIdle").style.display = "none";
}

function CancelS(d) {
    hm(d);
}

function ManualScanNetwork() {
    // prohibit user to scan network if sim card is absent.
    if (!g_bSimCardExist) {
		showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lSimCardAbsent"));
        return;
    }
    if (1 == pinStatus || 2 == pinStatus) {
        if (1 == pinStatus) {
            showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lPinEnable"));
        }
        else {
			showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lPukEnable"));
        }
        createMenu(2);
        displayForm("mPinPuk");
        return;
    }

    sm("ManualScanConfigure", 250, 100);
    document.getElementById("h1manualnetwork").innerHTML = jQuery.i18n.prop("h1ManualScanNetwork");
    document.getElementById("lManualPromte").innerHTML = jQuery.i18n.prop("lManualPromte");
    document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
    buttonLocaliztion(document.getElementById("btnConfirm").id);
    //alert('DeleteSMS function');
}

function BackgroundScanPopup() {
    BGScanPopupCancel = 0;
    sm("BGScanTimePopup", 250, 100);
    document.getElementById("h1BGScanTime").innerHTML = jQuery.i18n.prop("h1BGScanTimePopup");
}

function btnCancelManualScanNetwork() {
    BGScanPopupCancel = 1;
    hm();
}

function btnCancelManualScanConfigure() {
    hm();
}
function btnCancelBGScanTimePopup() {
	hm();
	
    var linkObj = document.getElementById("Networkdropdown");
    var value = linkObj.options[linkObj.selectedIndex].value;
    var BGtimelinkObj = document.getElementById("BgScanTimedropdown");
    var BGtimevalue = BGtimelinkObj.options[BGtimelinkObj.selectedIndex].value;
    var itemIndex = 0;
    var mapData = new Array();
    
    putMapElement(mapData, "RGW/wan/cellular/bgscan_time", BGScanTimeValue, itemIndex++);
    putMapElement(mapData, "RGW/wan/cellular/bgscan_time_action", 1, itemIndex++);

    putMapElement(mapData, "RGW/wan/cellular/network_param", value, itemIndex++);

	if (bCompleteScanNetwork || SelectNetworkValue != value) {
		putMapElement(mapData, "RGW/wan/cellular/network_param_action", 1, itemIndex++);
	}else{
		putMapElement(mapData, "RGW/wan/cellular/network_param_action", 0, itemIndex++);
	}

    postXML("wan", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));

}
function btnManualScanConfirm() {
    var itemIndex = 0;
    var mapData = new Array();
    ManualNetworkSelect = 1;
    putMapElement(mapData, "RGW/wan/cellular/search_network", 1, itemIndex++);
    putMapElement(mapData, "RGW/wan/cellular/network_select_done", 0, itemIndex++); //can select a specific network



    //$("#Networkdropdown").empty();
    //var optionHtmlTxt = "<option id=\"dropdownAuto\" value=\"30\">Auto</option>"
    //$("#Networkdropdown").append(optionHtmlTxt);


    searchNetworkStartTime = new Date().getTime();;
    bIsScanNetwork = true;
    $("#scanNetworkWaiting").show();
    $("#btUpdate1").prop("disabled", true);
    $("#btUpdate1").parent(".btnWrp:first").addClass("disabledBtn");
	
    postXMLEx("wan", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)), undefined, QueryScanResult);
   
}

function QueryScanResult() {
    var xml = GetNetworkScanRetXml();
    if(null == xml)
    {
        setTimeout(QueryScanResult, 15000);
    }
    $(xml).find("cellular").each(function() {
        $(this).find("mannual_network_list").each(function() {
            //waiting 5min for UE to scan network.
            var currentTime = new Date().getTime();
            if (currentTime - searchNetworkStartTime > 300000) {
                showAlert(jQuery.i18n.prop("lScanNetworkTimeOut"));
                $("#scanNetworkWaiting").hide();
                $("#btUpdate1").prop("disabled", false);
                $("#btUpdate1").parent(".btnWrp:first").removeClass("disabledBtn");
                bIsScanNetwork = false;
                return;
            }
            if ($(this).find("Item").length > 0) {
                if (!bIsScanNetwork) {
                    return;
                }
				zmscanstatus =1;
				$("#lMannualNetwork").show();
				$("#Networkdropdown").show();
                $("#scanNetworkWaiting").hide();
                showMsgBox(jQuery.i18n.prop("lReminder"),jQuery.i18n.prop("completeScanNetwork"));
                $("#btUpdate1").prop("disabled", false);
                $("#btUpdate1").parent(".btnWrp:first").removeClass("disabledBtn");
                bIsScanNetwork = false;
                if ($("#mManulNetwork").hasClass("on")) {
                    $("#mManulNetwork").children("a:first").trigger("click");
                }
            }
            else {
                setTimeout(QueryScanResult, 15000);
            }

        });
    });
}



function putMapElement_test(xpath, value, index) {
    mapData[index] = new Array(2);
    mapData[index][0] = xpath;
    mapData[index][1] = value;
}


