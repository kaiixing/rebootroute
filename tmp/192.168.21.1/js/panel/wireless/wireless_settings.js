var g_dual_band = '';
var g_channel = '';
var g_bandwidh = '';
var g_rfband = '';
var band40ASCEnable;
var _band40ACSRadio;
var wifiSleepTime = 15;

(function($) {
    $.fn.objWire_Set = function(InIt) {
        var controlMapExisting = new Array(0);
        var controlMapCurrent = new Array(0);
        var xmlName = '';
        var _rdRadioWN;
		var hard_ver = getHardware_Version();
        this.onLoad = function() {
            var index = 0;
            this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            document.getElementById("sSleepTimeUint").innerHTML = jQuery.i18n.prop("sSleepTimeUint");
            document.getElementById("sBeaconPeriod").innerHTML = jQuery.i18n.prop("sBeaconPeriod");
            $("#WifiModeInvalideTip").text(jQuery.i18n.prop("WifiModeInvalideTip"));
            var xml = getData(xmlName);

            lableLocaliztion(document.getElementsByTagName("label"));
            pElementLocaliztion(document.getElementsByTagName("option"));
            buttonLocaliztion("btUpdate");
            buttonLocaliztion("btUpdate0");
            var _wlan_enable;
            var _net_mode;
            var _channel;
            var _bandwidth;
            var _max_clients;
            var _proto = '';
            var _dual_band = '';
            var rf_band = '';
            var _beaconperiod;
            var _dtiminterval;
            var _sec_channel;
            var _ftest = '';
	    var _ap_isolate;
            // var xmlwan = getData('wan');
            // _proto = $(xmlwan).find("proto").text();
			if(hard_ver=="Ver.B"||hard_ver=="Ver.C"){
       			
       			$("#lMaxClients").hide();
				$("#MaxClientsdrpdwn").hide();
				
        	}else{
				
				$("#lMaxClients").show();
				$("#MaxClientsdrpdwn").show();
				
			}
            $(xml).find("wan").each(function() {
                _proto = $(this).find("proto").text();
		_ftest = '1'//$(this).find("zimistatus").text();
		if(_ftest == '1'){
			document.getElementById("rdRadioWN").style.display = 'none';
		}
		else{
			document.getElementById("rdRadioWN").style.display = 'none';
		}
            });
            $(xml).find("wlan_settings").each(function() {
				$("#Bandwidthdrpdwn").empty();
				if(0 == $(this).find("only_20m").text()) //support 20M and 40MHz
				{
					$("#Bandwidthdrpdwn").append("<option id='dropdownBWAuto' value='0'>Automatic (20/40 MHz)</option>");
					$("#Bandwidthdrpdwn").append("<option id='dropdownBW20' value='1'>20 MHz</option>"); 
					$("#Bandwidthdrpdwn").append("<option id='dropdownBW40' value='2'>40 MHz</option>");    					
					
				}else{ // only support 20MHz
					$("#Bandwidthdrpdwn").append("<option id='dropdownBW20' value='1'>20 MHz</option>"); 
				}
				pElementLocaliztion(document.getElementsByTagName("option"));

				
                _wlan_enable = $(this).find("wlan_enable").text();
                _rdRadioWN.setRadioButton(_wlan_enable);
                _dual_band = $(this).find("dual_band_support").text();
                g_dual_band = _dual_band;
                rf_band = $(this).find("rf_band").text();
                g_rfband = rf_band;
                _net_mode = $(this).find("net_mode").text();
                _channel = $(this).find("channel").text();
                g_channel = _channel;
                band40ASCEnable = $(this).find("band40_acs_enable").text();
                _bandwidth = $(this).find("bandwidth").text();
                g_bandwidh = _bandwidth;
               $("#Bandwidthdrpdwn").val(_bandwidth);
				_ap_isolate = $(this).find("ap_isolate").text();
				$("#ApIsolateSwitchSel").val(_ap_isolate);
				  

                //根据first_channe和last_channel显示起始信道，其他信道隐藏
                var firstChannel = parseInt($(this).find("first_channe").text());
                var lastChannel = parseInt($(this).find("last_channel").text());
				if(lastChannel == 14)
					lastChannel = 13;
                for(var nChannelIdx = 1; nChannelIdx < firstChannel; ++nChannelIdx) {
                    var optionId = "#dropdownCH" + nChannelIdx;
                    $(optionId).hide();
                }

                for(var nChannelIdx = lastChannel+1; nChannelIdx <= 14; ++nChannelIdx) {
                    var optionId = "#dropdownCH" + nChannelIdx;
                    $(optionId).hide();
                }

                for(var nChannelIdx = firstChannel; nChannelIdx <= lastChannel; ++nChannelIdx) {
                    var optionId = "#dropdownCH" + nChannelIdx;
                    $(optionId).show();
                }
                /*if(_dual_band == "1") {
                    document.getElementById("rfband_div").style.display = 'block';
                    document.getElementById("rfbanddrpdwn").value = rf_band;

                    if(rf_band == "1") { //2.4G
                        show_24GBand_div();

                        band40ASCEnable = $(this).find("band40_acs_enable").text();
                        _band40ACSRadio.setRadioButton(band40ASCEnable);

                        document.getElementById("Modedrpdwn").selectedIndex = _net_mode;
                        document.getElementById("Channeldrpdwn").value = _channel;
                    } else { //5G
                        show_5GBand_div();

                        document.getElementById("Modedrpdwn_50G").selectedIndex = _net_mode;
                        if(_bandwidth == "1") { //20M
                            show_5GBand_20M_option();
                            document.getElementById("Channeldrpdwn_50G_20M").value = _channel;
                        } else {
                            show_5GBand_40M_option();
                            document.getElementById("Channeldrpdwn_50G_40M").value = _channel;
                        }
                    }
                } else {*/
                document.getElementById("rfband_div").style.display = 'none';
                show_24GBand_div();
                _band40ACSRadio.setRadioButton(band40ASCEnable);
                document.getElementById("Modedrpdwn").selectedIndex = _net_mode;
                document.getElementById("Channeldrpdwn").value = _channel;
                // }


                wifiSleepTime = $(this).find("wifi_sleep_time").text();
                if (wifiSleepTime == '0') {
                    document.getElementById("DisableWifiAutoOffCheck").checked = true;
                    document.getElementById("lWifiOffTimeSet").style.display = 'none';
                } else {
                    document.getElementById("DisableWifiAutoOffCheck").checked = false;
                    document.getElementById("lWifiOffTimeSet").style.display = 'none';
                }

                document.getElementById("WifiSleepTime").value = wifiSleepTime;

                if (_proto == 'wifi')
                    document.getElementById("Channeldrpdwn").disabled = true;
                else
                    document.getElementById("Channeldrpdwn").disabled = false;

                //_bandwidth = $(this).find("bandwidth").text();
                //document.getElementById("Bandwidthdrpdwn").selectedIndex = _bandwidth;
                _max_clients = $(this).find("max_clients").text();
                document.getElementById("MaxClientsdrpdwn").selectedIndex = _max_clients - 1;
                _beaconperiod = $(this).find("beacon_period").text();
                _dtiminterval= $(this).find("dtim_interval").text();
                document.getElementById("BeaconPeriod").value = _beaconperiod;
                document.getElementById("DTIMInterval").value = _dtiminterval;

                _sec_channel = $(this).find("sec_channel").text();
                document.getElementById("SelAboveOrBelow").value = _sec_channel;
            });
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/wlan_enable", _wlan_enable);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/rf_band", rf_band);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/net_mode", _net_mode);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/channel", _channel);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/bandwidth", _bandwidth);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/max_clients", _max_clients);
            //controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/wifi_sleep_time", _sleep_time);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/band40_acs_enable", band40ASCEnable);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/beacon_period", _beaconperiod);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/dtim_interval", _dtiminterval);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/sec_channel", _sec_channel);
			controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_settings/ap_isolate", _ap_isolate);
			
            controlMapCurrent = g_objXML.copyArray(controlMapExisting, controlMapCurrent);

            if (1 == _wlan_enable) {
                document.getElementById('basic_settings').style.display = 'block';
                if (0 == $("#mWire_Sec").children("a").length) {
                    document.getElementById('3').onclick();
                }
            } else {
                document.getElementById('basic_settings').style.display = 'none';
                document.getElementById('mWire_Sec').innerHTML = "";
                //document.getElementById('mWMAC').innerHTML = "";
            }

            if (_net_mode == 1) {
                $("#Bandwidthdrpdwn").hide();
        		$("#lBandwidth").hide();
            } else {
                $("#Bandwidthdrpdwn").hide();
        		$("#lBandwidth").hide();
				if(1 == g_bandwidh){
					$("#lChannelChoose").hide();
        			$("#SelAboveOrBelow").hide();
				}else{
					$("#lChannelChoose").show();
        			$("#SelAboveOrBelow").show();
				}
					
            }

        }

        this.onPost = function() {
            if ($("#WifiModeInvalideTip").is(":visible")) {
                return;
            }
            /* var setting_sleep_time;
             if (document.getElementById("DisableWifiAutoOffCheck").checked)
                 setting_sleep_time = '0';
             else
                 setting_sleep_time = document.getElementById("WifiSleepTime").value;
             var errsleepString = sleep_time_validate(setting_sleep_time);*/

            var BeaconPeriod = document.getElementById("BeaconPeriod").value;
            var errBeaconPeriodString = BeaconPeriod_validate(BeaconPeriod);

            var  DTIMInterval= document.getElementById("DTIMInterval").value;
            var errDTIMIntervalString = DTIMInterval_validate(DTIMInterval);
            var IsPost = true;
            /* if (errsleepString != "OK") {
                 document.getElementById("lSleepTimeErrorLogs").style.display = "block";
                 document.getElementById("lSleepTimeErrorLogs").innerHTML = errsleepString;
                 IsPost = false;

             } else
                 document.getElementById("lSleepTimeErrorLogs").style.display = "none";*/

            if (errBeaconPeriodString != "OK") {
                document.getElementById("lBeaconPeriodErrorLogs").style.display = "block";
                document.getElementById("lBeaconPeriodErrorLogs").innerHTML = errBeaconPeriodString;
                IsPost = false;

            } else
                document.getElementById("lBeaconPeriodErrorLogs").style.display = "none";

            if (errDTIMIntervalString != "OK") {
                document.getElementById("lDTIMIntervalErrorLogs").style.display = "block";
                document.getElementById("lDTIMIntervalErrorLogs").innerHTML = errDTIMIntervalString;
                IsPost = false;

            } else
                document.getElementById("lDTIMIntervalErrorLogs").style.display = "none";

            if(!IsPost)
                return;
            var _controlMap = this.getPostData();
            if (_controlMap.length > 0) {
                postXML("uapxb_wlan_basic_settings", g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap)));
                //this.onLoad();
            }
        }

        this.getPostData = function() {
            var index = 0;
            var mapData = new Array(0);
            var Mode = document.getElementById("Modedrpdwn");
            var net_mode = Mode.options[Mode.selectedIndex].value;
            var rfband_drpdwn = document.getElementById("rfbanddrpdwn");
            var rfband_value = rfband_drpdwn.options[rfband_drpdwn.selectedIndex].value;
            var bandwidth_value = $("#Bandwidthdrpdwn").val();
     

            controlMapCurrent[index++][1] = _rdRadioWN.getRadioButton();
            if(g_dual_band == "1") {
                if(rfband_value == "1") { //2.4G
                    controlMapCurrent[index++][1] = rfband_value;
                    controlMapCurrent[index++][1] = document.getElementById("Modedrpdwn").selectedIndex;
                    //controlMapCurrent[index++][1] = document.getElementById("Channeldrpdwn").selectedIndex;
                    controlMapCurrent[index++][1] = $('#Channeldrpdwn').val();
                    controlMapCurrent[index++][1] = bandwidth_value;
                } else { //5G
                    if(bandwidth_value == "1") { //20MHz
                        controlMapCurrent[index++][1] = rfband_value;
                        controlMapCurrent[index++][1] = document.getElementById("Modedrpdwn_50G").selectedIndex;
                        controlMapCurrent[index++][1] = $('#Channeldrpdwn_50G_20M').val();
                        controlMapCurrent[index++][1] = bandwidth_value;

                    } else {
                        controlMapCurrent[index++][1] = rfband_value;
                        controlMapCurrent[index++][1] = document.getElementById("Modedrpdwn_50G").selectedIndex;
                        controlMapCurrent[index++][1] = $('#Channeldrpdwn_50G_40M').val();
                        controlMapCurrent[index++][1] = bandwidth_value;
                    }
                }
            } else {
                controlMapCurrent[index++][1] = rfband_value;
                controlMapCurrent[index++][1] = document.getElementById("Modedrpdwn").selectedIndex;
                controlMapCurrent[index++][1] = document.getElementById("Channeldrpdwn").selectedIndex;
                controlMapCurrent[index++][1] = $("#Bandwidthdrpdwn").val();
            }
            controlMapCurrent[index++][1] = document.getElementById("MaxClientsdrpdwn").selectedIndex + 1;
            /* if (document.getElementById("DisableWifiAutoOffCheck").checked)
                 controlMapCurrent[index++][1] = '0';
             else
                 controlMapCurrent[index++][1] = document.getElementById("WifiSleepTime").value;*/

            controlMapCurrent[index++][1] = _band40ACSRadio.getRadioButton();
            controlMapCurrent[index++][1] = document.getElementById("BeaconPeriod").value;
            controlMapCurrent[index++][1] = document.getElementById("DTIMInterval").value;
            controlMapCurrent[index++][1] = $("#SelAboveOrBelow").val();
			 controlMapCurrent[index++][1] = $("#ApIsolateSwitchSel").val();

            mapData = g_objXML.copyArray(controlMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(controlMapExisting, mapData, true);
            return mapData;
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/wireless/wireless_settings.html");
            _rdRadioWN = $("#rdRadioWN").enabled_disabled("rdRadioWN");
            _band40ACSRadio = $("#rdRadioBand40ACS").enabled_disabled("rdRadioBand40ACS");
        }
        this.onPostSuccess = function() {
            this.onLoad();
        }
        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }

        return this.each(function() {

        });
    }
})(jQuery);

function drpdwn_modeChanged() {
    $("#WifiModeInvalideTip").hide();
    if (0 == $("#Modedrpdwn").val()) { //802.11n

		 $("#Bandwidthdrpdwn").hide();
        $("#lBandwidth").hide();


		if(1 == $("#Bandwidthdrpdwn").val()){
			$("#lChannelChoose").hide();
        	$("#SelAboveOrBelow").hide();
		}else{
			$("#lChannelChoose").show();
        	$("#SelAboveOrBelow").show();
		}

        var mode = "";
        var _xml = getData("uapxb_wlan_security_settings");

        if (navigator.appName.indexOf("Microsoft") != -1&& navigator.appVersion.indexOf("4.0 (compatible;") != -1) {
            mode = $(_xml).find("mode")[0].text;
        } else {
            // FIREFOX or others
            mode = $(_xml).find("mode")[0].textContent.toString();
        }
        if (mode == "WEP") {
            $("#WifiModeInvalideTip").show();
        }		
        
    } else {
    	$("#Bandwidthdrpdwn").hide();
        $("#lBandwidth").hide();
		
		$("#lChannelChoose").show();
        $("#SelAboveOrBelow").show();       
    }
}

function EDWirelessNW() {
    if (document.getElementById('rdRadioWNEnabled').checked) {
        document.getElementById('basic_settings').style.display = 'block';
    } else {
        document.getElementById('basic_settings').style.display = 'none';
    }
}
function sleep_time_validate(sleep_time) {
    if (!isNumber(sleep_time))
        return jQuery.i18n.prop("lSleepTimeErrorLogs");
    if ((sleep_time > 60 || sleep_time < 10) && (sleep_time != 0))
        return jQuery.i18n.prop("lSleepTimeErrorLogs");
    return "OK";
}
function DisableWifiOffChange() {

    if (document.getElementById("DisableWifiAutoOffCheck").checked)
        document.getElementById("lWifiOffTimeSet").style.display = 'none';
    else {
        document.getElementById("lWifiOffTimeSet").style.display = 'none';
        document.getElementById("WifiSleepTime").value = '15';
    }
}
function drpdwn_modeChanged_50G() {
    var Mode = document.getElementById("Modedrpdwn_50G");
    var Bandwidth = document.getElementById("Bandwidthdrpdwn");
    var lBandwidth = document.getElementById("lBandwidth");
    var net_mode = Mode.options[Mode.selectedIndex].value;

    $("#WifiModeInvalideTip").hide();
    if (net_mode == 1) { //802.11a
        lBandwidth.style.display = 'none';
        Bandwidth.style.display = 'none';
    } else { //802.11n
        lBandwidth.style.display = 'none';
        Bandwidth.style.display = 'none';

        var mode = "";
        var _xml = getData("uapxb_wlan_security_settings");
        var mode;
        if (navigator.appName.indexOf("Microsoft") != -1 && navigator.appVersion.indexOf("4.0 (compatible;") != -1) {
            mode = $(_xml).find("mode")[0].text;
        } else {
            // FIREFOX or others
            mode = $(_xml).find("mode")[0].textContent.toString();
        }
        if (mode == "WEP") {
            $("#WifiModeInvalideTip").show();
        }
    }
}
/*function show_5GBand_div() {
    document.getElementById("80211_mode_div").style.display = 'none';
    document.getElementById("Channeldrpdwn").style.display = 'none';
    document.getElementById("band40ACS_div").style.display = 'none';

    document.getElementById("80211_mode_5G_div").style.display = 'block';
}*/

function show_24GBand_div() {
    document.getElementById("80211_mode_5G_div").style.display = 'none';
    //document.getElementById("Channeldrpdwn_50G_20M").style.display = 'none';
    //document.getElementById("Channeldrpdwn_50G_40M").style.display = 'none';

    document.getElementById("80211_mode_div").style.display = 'block';
    document.getElementById("Channeldrpdwn").style.display = 'block';
    document.getElementById("band40ACS_div").style.display = 'block';
}

/*function show_5GBand_20M_option() {
    document.getElementById("Channeldrpdwn_50G_40M").style.display = 'none';
    document.getElementById("Channeldrpdwn_50G_20M").style.display = 'block';
}

function show_5GBand_40M_option() {
    document.getElementById("Channeldrpdwn_50G_20M").style.display = 'none';
    document.getElementById("Channeldrpdwn_50G_40M").style.display = 'block';
}*/

function  rfband_drpdwnChanged() {
    var rfband_drpdwn = document.getElementById("rfbanddrpdwn");
    var rfband_value = rfband_drpdwn.options[rfband_drpdwn.selectedIndex].value;

    //var bandwidth_drpdwn = document.getElementById("Bandwidthdrpdwn");
    //var bandwidth_value = bandwidth_drpdwn.options[bandwidth_drpdwn.selectedIndex].value;


    //  if(rfband_value == "1") {
    show_24GBand_div();
    //document.getElementById("Channeldrpdwn_50G_20M").value = g_channel;
    _band40ACSRadio.setRadioButton(band40ASCEnable);
    if(1 == $("#Modedrpdwn").val()) {
        $("#Bandwidthdrpdwn").hide();
        $("#lBandwidth").hide();
    } else {
        $("#Bandwidthdrpdwn").hide();
        $("#lBandwidth").hide();
    }
    /* } else {
         show_5GBand_div();
         if(g_bandwidh == "1") {
             show_5GBand_20M_option();
             document.getElementById("Channeldrpdwn_50G_20M").value = g_channel;
         } else {
             show_5GBand_40M_option();
             document.getElementById("Channeldrpdwn_50G_20M").value = g_channel;
         }
         if(1 == $("#Modedrpdwn_50G").val()) {
             $("#Bandwidthdrpdwn").hide();
             $("#lBandwidth").hide();
         } else {
             $("#Bandwidthdrpdwn").show();
             $("#lBandwidth").show();
         }

     }*/
}

function drpdwn_bandwidthChanged() {
    // var rfband_drpdwn = document.getElementById("rfbanddrpdwn");
    //var rfband_value = rfband_drpdwn.options[rfband_drpdwn.selectedIndex].value;

    var bandwidth_drpdwn = document.getElementById("Bandwidthdrpdwn");
    var bandwidth_value = $("#Bandwidthdrpdwn").val();

    if(1 == bandwidth_value) {
		$("#SelAboveOrBelow").hide();
		$("#lChannelChoose").hide();      
	} else {
     	$("#SelAboveOrBelow").show();
		$("#lChannelChoose").show();        
    }

    /* if(rfband_value == "2") {
         if(bandwidth_value == "1") {
             show_5GBand_20M_option();
             document.getElementById("Channeldrpdwn_50G_20M").value = g_channel;
         } else {
             show_5GBand_40M_option();
             document.getElementById("Channeldrpdwn_50G_40M").value = g_channel;
         }
     }*/
}

function BeaconPeriod_validate(beaconperiod) {
    if (!isNumber(beaconperiod))
        return jQuery.i18n.prop("lBeaconPeriodErrorLogs");
    if ((beaconperiod < 50 || beaconperiod >4000))
        return jQuery.i18n.prop("lBeaconPeriodErrorLogs");
    return "OK";
}

function DTIMInterval_validate(dtimInterval) {
    if (!isNumber(dtimInterval))
        return jQuery.i18n.prop("lDTIMIntervalErrorLogs");
    if ((dtimInterval <1 || dtimInterval > 100))
        return jQuery.i18n.prop("lDTIMIntervalErrorLogs");
    return "OK";
}

function SetWifiSleepTime() {
    var setting_sleep_time;
    if (document.getElementById("DisableWifiAutoOffCheck").checked)
        setting_sleep_time = '0';
    else
        setting_sleep_time = document.getElementById("WifiSleepTime").value;
    var errsleepString = sleep_time_validate(setting_sleep_time);

    if (errsleepString != "OK") {
        document.getElementById("lSleepTimeErrorLogs").style.display = "block";
        document.getElementById("lSleepTimeErrorLogs").innerHTML = errsleepString;
        return;
    } else {
        document.getElementById("lSleepTimeErrorLogs").style.display = "none";
    }

    if(setting_sleep_time == wifiSleepTime) {
        return;
    }
    var mapData = new Array();
    putMapElement(mapData, "RGW/wlan_settings/wifi_sleep_time", setting_sleep_time, 0);
    putMapElement(mapData, "RGW/wlan_settings/wifi_sleep_action", 1, 1);

    postXML("uapxb_wlan_basic_settings", g_objXML.getXMLDocToString(g_objXML.createXML(mapData )));

}
