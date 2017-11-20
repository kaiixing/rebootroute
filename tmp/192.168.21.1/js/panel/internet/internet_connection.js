var flag_hide = 1;
var cellular_save = 0;
var _WiFiIntervalSelectID;
var _WiFiConnInterval = 5000;
var PF_INDEX = 1;
var PF_DELETE_INDEX = 0;
var PDPCheckFlags = new Array(6);
var InternetconnectFlag;
var NetworkModeflag;
var bDisabledAutoDialInRoam = false;
var ConnectionModeflag;
var Preferred_NetworkModeflag;
var Preferred_LTETypeflag;
var mtuValue;
var gdAutoConfAPN = false;
var gRulename= "";
var gEngineerModel = 0;
var gEngineerQueryTimeInterval;
var gDialInRoaming = 0;

(function($) {

    $.fn.objInternetConn = function(InIt) {
        var ip_divCustomeDNS1;
        var ip_divCustomeDNS2;
        var rdRadioMode;
        var network_mode;
        var prefer_bootmode;
        var prefer_bootmode1;
        var prefer_bootmode2;
        var xmlName = '';
        var controlMapExisting = new Array(0);
        var PDPMapExisting = new Array(0);
        var controlMapCurrent = new Array(0);
        var arrayISPProvider = new Array(0);
        var arrayTF1Provider = new Array(0);
        var arrayTF2Provider = new Array(0);
        var arrayTF3Provider = new Array(0);
        var arrayTF4Provider = new Array(0);
        var arrayMannualNetwork = new Array(0);
        var arrayDusterNetwork = new Array(0);
        var pre_NW_mode = "0";
        var pre_prefer_bootmode = "1";
        var pre_prefer_bootmode1 = "3";
        var pre_prefer_bootmode2 = "5";
        var prefer_lte_type = '';
        var pre_prefer_lte_type = '';
        var _ftest = '';
		var wapn_selected_mode;
		var apn_selected_id
		var hard_ver = getHardware_Version();
	var bAutoSwitchFlag = false;
        for (var i = 0; i < PDPCheckFlags.length; i++) {
            PDPCheckFlags[i] = 0;
        }


        var active_isp = '';
        var indexWN = 0;
        _arrayWirelessNws = new Array(0);

        this.onLoad = function(flag) {
            if (flag) {
                this.loadHTML();
                buttonLocaliztion("btUpdate");
                if (flag_hide == 1) {
                    document.getElementById("ConfigureButton").style.display = 'none';
                    document.getElementById("ScanWirelessButton").style.display = 'none';
                }
                this.addIPBoxes();

                $("#RoamingDisableAutoDialCheckBox").click(function() {
                    if ($(this).prop("checked")) {
                        $("#Cconndropdown").prop("disabled", true);

                    } else {
                        $("#Cconndropdown").prop("disabled", false);
                    }
                });

                $("#txtMtuValue").focus(function() {
                    $("#lMtuInvalidTip").hide();
                });
            }

            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            document.getElementById('lIPErrorMsg').style.display = 'none';
	//wk-s
            document.getElementById('lQOSEnbale').style.display = 'none';
            document.getElementById('lLteAPN').style.display = 'none';
            document.getElementById('txtLteAPNname').style.display = 'none';
            document.getElementById('l4GAuthType').style.display = 'none';
            document.getElementById('Sel4GAuthType').style.display = 'none';
	//end
            lableLocaliztion(document.getElementsByTagName("label"));
            lableLocaliztion(document.getElementsByTagName("span"));
            lableLocaliztion(document.getElementsByTagName("em"));
            pElementLocaliztion(document.getElementsByTagName("option"));
			//jmm
			//
			$("#lMICI").hide();
			$("#selectpopup").hide();
			if(hard_ver=="Ver.B"){
       			document.getElementById("LWGLTGSwitch").style.display = "none";//jmm jp changed
       			$("#RoamingDisableAutoDialCheckBox").hide();
				$("#lRoamingDisableAutoDialTip").hide();
				$("#lMTULabel").hide();
				$("#txtMtuValue").hide();
				/*$("#lMICI").hide();
				$("#selectpopup").hide();*/
        	}else if(hard_ver=="Ver.C"){
       			document.getElementById("LWGLTGSwitch").style.display = "none";//jmm jp changed
       			$("#RoamingDisableAutoDialCheckBox").hide();
				$("#lRoamingDisableAutoDialTip").hide();
				$("#lMTULabel").hide();
				$("#txtMtuValue").hide();
				$("#APN_manual_select").html(jQuery.i18n.prop("llAPNSelectedMethodauto"));
				$("#APN_manual_edit").html(jQuery.i18n.prop("llAPNSelectedMethodmanual"));
				/*$("#lMICI").hide();
				$("#selectpopup").hide();*/
        	}else if(hard_ver=="Ver.D"){
       			document.getElementById("LWGLTGSwitch").style.display = "block";//jmm jp changed
				$("#RoamingDisableAutoDialCheckBox").show();
				$("#lRoamingDisableAutoDialTip").show();
				$("#lMTULabel").show();
				$("#txtMtuValue").show();
				$("#dropdown2Gonly").hide();
				$("#dropdown32Gonly").hide();
				/*$("#lMICI").show();
				$("#selectpopup").show();*/
        	}else{
				document.getElementById("LWGLTGSwitch").style.display = "block";//jmm jp changed
				$("#RoamingDisableAutoDialCheckBox").show();
				$("#lRoamingDisableAutoDialTip").show();
				$("#lMTULabel").show();
				$("#txtMtuValue").show();
				/*$("#lMICI").show();
				$("#selectpopup").show();*/
			}
			//jmm end
            this.dispalyAllNone();
            this.clearControlArray();

          //  document.getElementById("selectpopup").style.display = "block";
            $("#lAutoConfigureAPNCheckBox").text(jQuery.i18n.prop("lAutoConfigureAPNCheckBox"));
            clearInterval(_WiFiIntervalID);
            xml = getData(xmlName);
			

		_ftest = '1'//$(xml).find("zimistatus").text();
		wapn_selected_mode = $(xml).find("apn_selected_mode").text();
		apn_selected_id = $(xml).find("apn_selected_id").text();
		/*if(_ftest == '1'){
			document.getElementById("linternetcellular").style.display = 'none';
			document.getElementById("selectpopup").style.display = 'block';
		}
		else{
			document.getElementById("linternetcellular").style.display = 'none';
			document.getElementById("selectpopup").style.display = 'none';
		}*/

            connectedmode = $(xml).find("connect_mode").text();
            bDisabledAutoDialInRoam = ($(xml).find("Roaming_disable_auto_dial").text() == "1") ? true : false;
            $("#RoamingDisableAutoDialCheckBox").prop("checked", bDisabledAutoDialInRoam);
            mtuValue = $(xml).find("mtu").text();
            gdAutoConfAPN = ($(xml).find("auto_apn").text() == "1") ? true : false;
            $("#AutoConfigureAPNCheckBox").prop("checked", gdAutoConfAPN);
            $("#txtMtuValue").val(mtuValue);
            document.getElementById('Cconndropdown').value = connectedmode;
            ConnectionModeflag = connectedmode;
            proto = $(xml).find("proto").text();
            manual_network_check = $(xml).find("manual_network_start").text();
            if (manual_network_check == '1' || manual_network_check == '2')
                document.getElementById("manual_network_check2").checked = true;
            else
                document.getElementById("manual_network_check2").checked = false;

            gEngineerModel = $(xml).find("Engineering_mode").text();
            gEngineerQueryTimeInterval = $(xml).find("query_time_interval").text();
            $("#EngineeringModelSel").val(gEngineerModel);
			$("#txtqueryTimeInterval").val(gEngineerQueryTimeInterval);
      
			
            gVersion = $(xml).find("version_flag").text();
            var IsSwitchDisplay =  $(xml).find("disable_switch").text();
            if(""==IsSwitchDisplay|| 1==IsSwitchDisplay)
                document.getElementById("LWGLTGSwitch").style.display = "none";
            else if(hard_ver=="Ver.B"||hard_ver=="Ver.C")
                document.getElementById("LWGLTGSwitch").style.display = "none";//jmm jp changed
            else 
				document.getElementById("LWGLTGSwitch").style.display = "none";
            //hide auto switch interface in LWG-only and LTG-only modes

            
	    
            if(2 == gVersion) { 
                //$("#LTGVersion").hide();
                $("#VersionSel").empty().html('<option value="0" id="LWGVersion">WCDMA</option>');
                $("#autoSwitchCheckBox").hide();
                $("#lautoSwitch").hide();
                $("#VersionSel").val("0");
            } else if(3 == gVersion) {
                //$("#LWGVersion").hide();
                 $("#VersionSel").empty().html('<option value="1" id="LTGVersion">TD-SCDMA</option>');
                $("#autoSwitchCheckBox").hide();
                $("#lautoSwitch").hide();
                $("#VersionSel").val("1");
            } else {
                //$("#LTGVersion").show();
                //$("#LWGVersion").show();
                $("#VersionSel").empty().html('<option value="0" id="LWGVersion">WCDMA</option><option value="1" id="LTGVersion">TD-SCDMA</option>');
                $("#VersionSel").val(gVersion);

               
                $("#autoSwitchCheckBox").show();
                $("#lautoSwitch").show();
                if (1 == $(xml).find("auto_switch").text()) {
                    $("#autoSwitchCheckBox").prop("checked", true);
                    bAutoSwitchFlag = true;
                } else {
                    $("#autoSwitchCheckBox").prop("checked", false);
                    bAutoSwitchFlag = false;
                }
            }
	    
	    	gDialInRoaming = $(xml).find("Roaming_disable_dial").text();
			$("#DialInRoamingSel").val(gDialInRoaming);

            document.getElementById("micdropdown").value = proto;
            InternetconnectFlag = proto;
            if (manual_network_check == '2')
                proto = 'manual_network';
            switch (proto) {
                case 'cellular': {	
		
                        $("#divEngineeringModel").hide();
						if (1 == gEngineerModel)
						{
                        	$("#divQueryTimeInterval").show();
						}
					//document.getElementById("lMICI").style.display = "none";
					document.getElementById("linternetcellular").innerHTML = jQuery.i18n.prop("dropdownEnable");

                    document.getElementById("Cellular_div").style.display = "block";
                    document.getElementById("connectmode").style.display = "block";
                    //document.getElementById("divMtu").style.display = "block";
		    		document.getElementById("divAutoAPN").style.display = "block";
                    document.getElementById("workmode").style.display = "block";
                    document.getElementById("lWorkMode").innerHTML = jQuery.i18n.prop("lWorkMode");
                    network_mode = $(xml).find("NW_mode").text();
					document.getElementById('WorkModeropdown').value = network_mode;
                    NetworkModeflag = network_mode;
                    pre_NW_mode = network_mode;
                    prefer_lte_type = $(xml).find("prefer_lte_type").text();
                    pre_prefer_lte_type = prefer_lte_type;
                    Preferred_LTETypeflag = prefer_lte_type;
                    if (network_mode == '1') {
                        document.getElementById("bootmode").style.display = "block";
                        document.getElementById("lBootMode").innerHTML = jQuery.i18n.prop("lBootMode");
                        prefer_bootmode = $(xml).find("prefer_mode").text();
                        pre_prefer_bootmode = prefer_bootmode;
                        document.getElementById('BootModeropdown').value = prefer_bootmode;
                        Preferred_NetworkModeflag = prefer_bootmode;
                    } else
                        document.getElementById("bootmode").style.display = "none";

                    if (network_mode == '3') {
						/*if(hard_ver=="Ver.B")
                        document.getElementById("bootmode1").style.display = "none";//jmm jp changed
                        else*/
						document.getElementById("bootmode1").style.display = "block";//jmm jp changed
                        document.getElementById("lBootMode1").innerHTML = jQuery.i18n.prop("lBootMode1");
                        prefer_bootmode1 = $(xml).find("prefer_mode").text();
                        pre_prefer_bootmode1 = prefer_bootmode1;
                        if (prefer_bootmode1 != '4')
                            prefer_bootmode1 = '3';
                        document.getElementById('BootModeropdown1').value = prefer_bootmode1;
                        Preferred_NetworkModeflag = prefer_bootmode1;
                    } else
                        document.getElementById("bootmode1").style.display = "none";

                    if (network_mode == '4') {
                        document.getElementById("bootmode2").style.display = "block";
                        document.getElementById("lBootMode2").innerHTML = jQuery.i18n.prop("lBootMode2");
                        prefer_bootmode2 = $(xml).find("prefer_mode").text();
                        pre_prefer_bootmode2 = prefer_bootmode2;
                        if (prefer_bootmode2 != '6')
                            prefer_bootmode2 = '5';
                        document.getElementById('BootModeropdown2').value = prefer_bootmode2;
                        Preferred_NetworkModeflag = prefer_bootmode2;
                    } else
                        document.getElementById("bootmode2").style.display = "none";

                    if ((network_mode != '5') && (network_mode != '4')&&(network_mode != '6')) {
						if(hard_ver=="Ver.B"||hard_ver=="Ver.C")
                        document.getElementById("preferredLTEType").style.display = "none";//jmm jp changed
                        else 
						document.getElementById("preferredLTEType").style.display = "none";//jmm jp changed
                        document.getElementById("lsetLikeLTEType").innerHTML = jQuery.i18n.prop("lsetLikeLTEType");
                        document.getElementById('setLikeLTETypedropdown').value = prefer_lte_type;

                    } else
                        document.getElementById("preferredLTEType").style.display = "none";
                    //this.loadCellularData(false);
                    this.loadPDPData(false);
                    break;
                }
                //case 'wifi':{
                //      this.loadWiFiData(false);
                //    document.getElementById("btnScanWirelessNw").disabled = false;
                //      break;
                //}
                case 'disabled': {
					document.getElementById("lMICI").style.display = "block";//zmi test
					document.getElementById("linternetcellular").innerHTML = jQuery.i18n.prop("dropdownDisable");
					/*document.getElementById("button_cellular").style.display = "block";
					document.getElementById("btUpdate").style.display = "block";*/
					
                    this.loadDisabledData();
                    break;
                }
                case 'manual_network': {

                    this.loadManualNetwork();
                    break;
                }
            }
            this.copyControlArray();
        }
        this.addIPBoxes = function() {
            ip_divCustomeDNS1 = $("#divCustomeDNS1").ip_address("divCustomeDNS1");
            ip_divCustomeDNS2 = $("#divCustomeDNS2").ip_address("divCustomeDNS2");
        }
        this.clearIPBoxes = function() {
            ip_divCustomeDNS1 = null;
            document.getElementById("divCustomeDNS1").innerHTML = "";
            ip_divCustomeDNS2 = null;
            document.getElementById("divCustomeDNS2").innerHTML = "";
        }
        this.dispalyAllNone = function() {
            //  document.getElementById("customeDNS").style.display = "none";
            document.getElementById("Cellular_div").style.display = "none";
            //document.getElementById("WiFi_div").style.display = "none";
            //  document.getElementById("check2div").style.display = "none";
            document.getElementById('lIPErrorMsg').style.display = 'none';
            document.getElementById("workmode").style.display = "none";
            document.getElementById("bootmode").style.display = "none";
            document.getElementById("bootmode1").style.display = "none";
            document.getElementById("bootmode2").style.display = "none";
            document.getElementById("connectmode").style.display = "none";
            //document.getElementById("divMtu").style.display = "none";
            document.getElementById("divAutoAPN").style.display = "none";
            $("#divEngineeringModel").hide();
            $("#divQueryTimeInterval").hide();

        }
        this.clearControlArray = function() {
            controlMapExisting = null;
            controlMapCurrent = null;
            controlMapExisting = new Array(0);
            controlMapCurrent = new Array(0);
            arrayTF1Provider = null;
            arrayTF2Provider = null;
            arrayTF3Provider = null;
            arrayTF4Provider = null;
            arrayTF1Provider = new Array(0);
            arrayTF2Provider = new Array(0);
            arrayTF3Provider = new Array(0);
            arrayTF4Provider = new Array(0);
        }

        this.MtuValid = function() {
            var strMtuValue = $("#txtMtuValue").val();
            var r = /^\d{4}$/;
            var ret = r.test(strMtuValue);
            if (ret) {
                var value = parseInt(strMtuValue);
                if (value < 1000 || value > 1500) {
                    ret = false;
                }
            }
            return ret;
        }

        this.onPost = function(flag) {
            //enable version switch in LTG and LWG modes 
            if(0 == gVersion || 1 == gVersion) {
                var xmlDataMap = new Array;
                var idx = 0;          
             	if(bAutoSwitchFlag != $("#autoSwitchCheckBox").prop("checked"))
                {
                	if ($("#autoSwitchCheckBox").prop("checked")) {
                    	putMapElement(xmlDataMap, "RGW/wan/auto_switch", 1, idx++);
                	} else {
                    	putMapElement(xmlDataMap, "RGW/wan/auto_switch", 0, idx++);
                	}
                     putMapElement(xmlDataMap, "RGW/wan/auto_switch_action", 1, idx++);
                }
                            

                if (gVersion != $("#VersionSel").val()) {
                    putMapElement(xmlDataMap, "RGW/wan/version_flag", $("#VersionSel").val(), idx++);
                    putMapElement(xmlDataMap, "RGW/wan/version_flag_action", 1, idx++);
                }

				if(xmlDataMap.length > 0)
				{
					postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(xmlDataMap)));
				}                
            }

            if (this.isValid()) {
                document.getElementById('lIPErrorMsg').style.display = 'none';
                var dropdownvalue = document.getElementById("micdropdown").value;
                if (dropdownvalue == 'manual_network')
                    SelectNetworkChanged();
                else if (dropdownvalue == 'cellular') {
                    if (!this.MtuValid()) {
                        $("#lMtuInvalidTip").show();
                        return;
                    }
                    var _controlMap = this.getPostData();
                    for (var i = 0; i < _controlMap.length; i++) {
                        if (0 == i) {
                            if (PDPCheckFlags[i] != document.getElementById('pPDPdef_chk').checked) {
                                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap[i])));
                            }
                        }
                        if (1 == i) {
                            if (PDPCheckFlags[i] != document.getElementById('sPDPdef_chk').checked) {
                                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap[i])));
                            }
                        }
                        if (2 == i) {
                            if (PDPCheckFlags[i] != document.getElementById('pPDPded_chk').checked) {
                                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap[i])));
                            }
                        }
                        if (3 == i) {
                            if (PDPCheckFlags[i] != document.getElementById('s1PDPded_chk').checked) {
                                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap[i])));
                            }
                        }
                        if (4 == i) {
                            if (PDPCheckFlags[i] != document.getElementById('s2PDPded_chk').checked) {
                                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap[i])));
                            }
                        }
                        if (5 == i) {
                            if (PDPCheckFlags[i] != document.getElementById('s3PDPded_chk').checked) {
                                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap[i])));
                            }
                        }
                        if (6 == i) {                           
                            if(_controlMap[i].length > 0){
								postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap[i])));
                            }
                        }
                    }
                } else {
                	if("disabled" != InternetconnectFlag)
                	{			
            			var mapData = new Array();
            			mapData = putMapElement(mapData,"RGW/wan/proto", "disabled", 0);
						postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
					}
                   
                }
            }  
        }
		
        this.onPostSuccess = function() {   
                this.onLoad(false);           
        }
		
        this.isValid = function() {
            var protoData = document.getElementById("micdropdown").value;
            if (protoData == 'static') {
                if (!(ip_Gateway_Address.validIP(true) && ip_IP_Address.validIP(true) && ip_Mask.validIP(true) && ip_Primary_DNS_Address.validIP(true) && ip_Secondary_DNS_Address.validIP(false))) {
                    document.getElementById('lIPErrorMsg').style.display = 'block';
                    document.getElementById('lIPErrorMsg').innerHTML = jQuery.i18n.prop('lIPErrorMsg');
                    return false;
                }
            }

            return true;

        }
        this.getPostData = function() {
            var prototype = document.getElementById("micdropdown").value;
            switch (prototype) {
                case 'cellular': {
                    cellular_save = 1;
                    flag_hide = 1;
                    return this.getCellularPostData();
                    break;
                }
                case 'wifi': {
                    flag_hide = 0;
                    cellular_save = 0;
                    document.getElementById("ConfigureButton").style.display = 'block';
                    document.getElementById("ScanWirelessButton").style.display = 'block';
                    return this.getWiFiPostData();
                    break;
                }
                case 'disabled': {
                    flag_hide = 1;
                    cellular_save = 1;
                    return this.getDisabledPostData();
                    break;
                }
                case 'manual_network': {
                    flag_hide = 1;
                    cellular_save = 1;
                    return this.getManualNetworkData();
                    break;
                }
            }
        }
        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/internet/internet_connection.html");

            $("#autoSwitchCheckBox").click(function() {
                if ($("#autoSwitchCheckBox").prop("checked")) {
                    $("#VersionSel").val(gVersion);
                    //$("#VersionSel").prop("disabled", true);
                } /*else {
                    //$("#VersionSel").prop("disabled", false);
                }*/
            });
        }
        this.updateIndex = function() {
            return index++;
        }
        this.loadManualNetwork = function(flag) {

            var Network_name = "";
            var duster_name = "";
            var arrayindex;
            var VarMannualNetwork;
            //document.getElementById("ManualNetwork_div").style.display = "block";
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, 0, "RGW/wan/proto", proto);
            VarMannualNetwork = $(xml).find("plmm_name").text();
            // arrayDusterNetwork.push(VarMannualNetwork);
            $(xml).find("cellular").each(function() {
                $(this).find("mannual_network_list").each(function() {
                    $(this).find("Item").each(function() {
                        arrayDusterNetwork[arrayindex] = new Array(1);
                        arrayDusterNetwork[arrayindex][0] = $(this).find("plmm_name").text();
                        duster_name = $(this).find("plmm_name").text();
                        arrayindex++;
                        switch (duster_name) {
                            case "0":
                                Network_name = 'CMCC 2G';
                                break;
                            case "1":
                                Network_name = 'CMCC 2G C';
                                break;
                            case "2":
                                Network_name = 'CMCC 3G';
                                break;
                            case "3":
                                Network_name = 'CMCC 2G (EDGE)';
                                break;
                            case "4":
                                Network_name = 'CMCC 3G(HSDPA)';
                                break;
                            case "5":
                                Network_name = 'CMCC 3G(HSUPA)';
                                break;
                            case "6":
                                Network_name = 'CMCC 3G(HSDPA+HSUPA)';
                                break;
                            case "7":
                                Network_name = 'CMCC 3G(LTE)';
                                break;
                            case "8":
                                Network_name = 'CUCC 2G';
                                break;
                            case "9":
                                Network_name = 'CUCC 2G C';
                                break;
                            case "10":
                                Network_name = 'CUCC 3G';
                                break;
                            case "11":
                                Network_name = 'CUCC 2G (EDGE)';
                                break;
                            case "12":
                                Network_name = 'CUCC 3G(HSDPA)';
                                break;
                            case "13":
                                Network_name = 'CUCC 3G(HSUPA)';
                                break;
                            case "14":
                                Network_name = 'CUCC 3G(HSDPA+HSUPA)';
                                break;
                            case "15":
                                Network_name = 'CUCC 3G(LTE)';
                                break;
                            case "16":
                                Network_name = 'CTM 2G';
                                break;
                            case "17":
                                Network_name = 'CTM 2G C';
                                break;
                            case "18":
                                Network_name = 'CTM 3G';
                                break;
                            case "19":
                                Network_name = 'CTM 2G (EDGE)';
                                break;
                            case "20":
                                Network_name = 'CTM 3G(HSDPA)';
                                break;
                            case "21":
                                Network_name = 'CTM 3G(HSUPA)';
                                break;
                            case "22":
                                Network_name = 'CTM 3G(HSDPA+HSUPA)';
                                break;
                            case "23":
                                Network_name = 'CTM 3G(LTE)';
                                break;
                        }
                        var opt = document.createElement("option");
                        opt.text = Network_name;
                        opt.value = duster_name;
                    });
                });
            });

        }
        this.loadCellularData = function(flag) {
            var indexLoad = 1;
            var indexISP = 0;
            var indexNetwork = 0;
            return;
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, 0, "RGW/wan/proto", proto);

            var arrayLabels = document.getElementsByTagName("th");
            lableLocaliztion(arrayLabels);
            arrayLabels = document.getElementsByTagName("td");
            lableLocaliztion(arrayLabels);
            arrayLabels = document.getElementsByTagName("h1");
            lableLocaliztion(arrayLabels);

            document.getElementById("Cellular_div").style.display = "none";
            //   document.getElementById("check2div").style.display = "none";
            document.getElementById("WiFi_div").style.display = "none";
            document.getElementById("ManualNetwork_div").style.display = "none";
            var cdns1 = $(xml).find("cdns1").text();
            var cdns2 = $(xml).find("cdns2").text();
            var cdns_enable = $(xml).find("cdns_enable").text();

            if (cdns_enable == '1') {
                document.getElementById("check2").checked = true;
                document.getElementById("customeDNS").style.display = "block";
            } else
                document.getElementById("check2").checked = false;
            ip_divCustomeDNS1.setIP(cdns1);
            ip_divCustomeDNS2.setIP(cdns2);

            var ISP_name = "";
            var bgscan_value = "";
            $(xml).find("cellular").each(function() {
                bgscan_value = $(this).find("bgscan_time").text();
                $(this).find("isp_supported_list").each(function() {
                    $(this).find("Item").each(function() {
                        ISP_name = $(this).find("ISP").text();
                        arrayISPProvider[indexISP] = new Array(10);
                        arrayISPProvider[indexISP][0] = ISP_name;
                        var opt = document.createElement("option");
                        document.getElementById("Profiledropdown").options.add(opt);
                        opt.text = ISP_name;
                        opt.value = ISP_name;
                        arrayISPProvider[indexISP][1] = $(this).find("uname").text();
                        arrayISPProvider[indexISP][2] = $(this).find("pswd").text();
                        arrayISPProvider[indexISP][3] = $(this).find("baud").text();
                        arrayISPProvider[indexISP][4] = $(this).find("int1").text();
                        arrayISPProvider[indexISP][5] = $(this).find("int2").text();
                        arrayISPProvider[indexISP][6] = $(this).find("num").text();
                        arrayISPProvider[indexISP][7] = $(this).find("auth").text();
                        arrayISPProvider[indexISP][8] = $(this).find("connmode").text();
                        arrayISPProvider[indexISP][9] = $(this).find("idl").text();
                        indexISP++;
                    });
                });
            });

            if (arrayISPProvider[indexISP])
                delete (arrayISPProvider[indexISP]);

            this.loadTableData(arrayISPProvider);

            var ispValue = "";
            var init1 = "";
            var l = "";
            var username = "";
            var password = "";
            var value = 0;
            var nw_mode = $(xml).find("NW_mode").text();
            var pre_mode = $(xml).find("prefer_mode").text();
            var lte_type = $(xml).find("prefer_lte_type").text();

            ispValue = $(xml).find("ISP_name").text();

            document.getElementById("Profiledropdown").value = ispValue;
            document.getElementById("BgScanTimedropdown").value = bgscan_value;

            for (i = 0; i < arrayISPProvider.length; i++) {
                if (ispValue == arrayISPProvider[i][0])
                    value = i;
            }

            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/ISP_name", arrayISPProvider[value][0]);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/username", arrayISPProvider[value][1]);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/password", arrayISPProvider[value][2]);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/baudrate", arrayISPProvider[value][3]);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/init1", arrayISPProvider[value][4]);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/init2", arrayISPProvider[value][5]);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/accessnumber", arrayISPProvider[value][6]);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/advanced/auth_type", arrayISPProvider[value][7]);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/advanced/connectmode", arrayISPProvider[value][8]);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/advanced/idle", arrayISPProvider[value][9]);

            if (document.getElementById("check2").checked) {
                controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cdns_enable", "1");
            } else
                controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cdns_enable", "0");
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cdns1", ip_divCustomeDNS1.getIP());
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cdns2", ip_divCustomeDNS2.getIP());
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/bgscan_time", bgscan_value);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/NW_mode", nw_mode);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/prefer_mode", pre_mode);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/NW_mode_action", "0");
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/prefer_mode_action", "0");
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/prefer_lte_type", lte_type);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, indexLoad++, "RGW/wan/cellular/prefer_lte_type_action", "0");
        }

        this.loadPDPDataToBox = function(index) {
            var length = arrayISPProvider.length;
            var arrayTableDataRow;
            localizePDPProfile();
            if (length > index) {
                arrayTableDataRow = arrayISPProvider[index];
                var Rulename = arrayTableDataRow[0];
                var ConnNum = arrayTableDataRow[1];
                var pConnNum = arrayTableDataRow[2];
                var Enable = arrayTableDataRow[3];
                var ConnType = arrayTableDataRow[4];
                var IsDefault = arrayTableDataRow[5];
                var IsSecondary = arrayTableDataRow[6];
                var APNname = arrayTableDataRow[7];
                var IPType = arrayTableDataRow[8];
                var QCI = arrayTableDataRow[9];
                var HasTFT = arrayTableDataRow[10];
                var LteAPNname = arrayTableDataRow[11];

                document.getElementById("txtRulename").value = jQuery.i18n.prop("pPDPdef_lable");//Rulename;
                gRulename = Rulename;
                document.getElementById("txtAPNname").value = APNname;
                document.getElementById("txtLteAPNname").value = LteAPNname;
                document.getElementById("lIPTypedropdown").value = IPType;
                if (QCI > 0) {
                    document.getElementById("1QOSEnablechk").checked = true;
                    document.getElementById("lQOSEngine").style.display = "block";
                    document.getElementById("txtQOSQCI").value = QCI;
                } else {
                    document.getElementById("1QOSEnablechk").checked = false;
                    document.getElementById("lQOSEngine").style.display = "none";
                    document.getElementById("txtQOSQCI").value = "";
                }

                document.getElementById("txtenable").value = Enable;

                $("#Sel2G3GAuthType").val(arrayTableDataRow[12]);
                $("#txt2G3GUser").val(arrayTableDataRow[13]);
                $("#txt2G3GPassword").val(arrayTableDataRow[14]);
                if ("NONE" == arrayTableDataRow[12]) {
                    $("#div2G3GAuthEnabled").hide();
                } else {
                    $("#div2G3GAuthEnabled").show();
                }

                $("#Sel4GAuthType").val(arrayTableDataRow[15]);
                $("#txt4GUser").val(arrayTableDataRow[16]);
                $("#txt4GPassword").val(arrayTableDataRow[17]);
                if ("NONE" == arrayTableDataRow[15]) {
                    $("#div4GAuthEnabled").hide();
                } else {
		//wk-s
                    //$("#div4GAuthEnabled").show();
                    $("#div4GAuthEnabled").hide();
		//end
                	}
			//jmm addapn_selected_mode
			if(hard_ver=="Ver.C"){
			$("#divversionC").show();
			$("#Sel2G3GAuthTypeNONE").show();
			$("#lRuleename").hide();
			$("#txtRulename").hide();
			$("#APN_manual_select").html(jQuery.i18n.prop("llAPNSelectedMethodauto"));
			$("#APN_manual_edit").html(jQuery.i18n.prop("llAPNSelectedMethodmanual"));
			var apn_selected_mode = $(xml).find("apn_selected_mode").text();
			if(apn_selected_mode =="2"){
				var apn_list_num = $(xml).find("apn_list_num").text();
				if(apn_list_num == "0")
					$("#SAPNSelectedMethod").attr("disabled",true);
				else
					$("#SAPNSelectedMethod").attr("disabled",false);
				$("#SAPNSelectedMethod").val("2");
				$("#autoselectapn").hide();
				$("#txtAPNname").attr("disabled",false);
				//$("#lIPTypedropdown").attr("disabled",false);
				//$("#Sel2G3GAuthType").attr("disabled",false);
				$("#txt2G3GUser").attr("disabled",false);
				$("#txt2G3GPassword").attr("disabled",false);
				$("#SAPNSelectedList").html("");
				var apn_list = $(xml).find("apn_list_name").text();
				if(apn_list.length > 2){
				var arrayapnlist = 	apn_list.split(",");
				for(var i =0 ;i<arrayapnlist.length-1;i++){
					$("#SAPNSelectedList").append("<option value='"+i+"'>"+arrayapnlist[i]+"</option>");
				}
					}
				
			}else{
				//$("#Sel2G3GAuthTypeNONE").show();
				$("#SAPNSelectedMethod").attr("disabled",false);
				$("#autoselsecapn").show();
				$("#txtAPNname").attr("disabled",true);
				//$("#lIPTypedropdown").attr("disabled",true);
				//$("#Sel2G3GAuthType").attr("disabled",false);
				$("#txt2G3GUser").attr("disabled",true);
				$("#txt2G3GPassword").attr("disabled",true);
				$("#SAPNSelectedMethod").val("1")
				$("#SAPNSelectedList").html("");
				var apn_list = $(xml).find("apn_list_name").text();
				if(apn_list.length > 2){
				var arrayapnlist = 	apn_list.split(",");
				for(var i =0 ;i<arrayapnlist.length-1;i++){
					$("#SAPNSelectedList").append("<option value='"+i+"'>"+arrayapnlist[i]+"</option>");
				}
				if($("#Sel2G3GAuthType").val()	!=	"NONE"){
					$("#Sel2G3GAuthTypeNONE").hide();
				}
				var imsi_changed = $(xml).find("imsi_changed").text();
				if(arrayapnlist.length == 2 || imsi_changed == "1"){
					var apnid_selected_data = $(xml).find("apnid_selected_data").text();
					var array_tmp = apnid_selected_data.split('%');
					$("#txtAPNname").val(array_tmp[1]);
					if(array_tmp[2] == "0"){
						$("#lErrorLogs").hide();
						$("#Sel2G3GAuthType").val("NONE");
						//$("#divIpType").hide();
						$("#div2G3GAuthEnabled").hide();
						$("#edit_apn_list").show();
						
					}else if(array_tmp[2] == "1"){
						$("#lErrorLogs").hide();
						$("#Sel2G3GAuthType").val("PAP");
						$("#div2G3GAuthEnabled").show();
						$("#edit_apn_list").show();
						//$("#divIpType").hide();
						$("#txt2G3GUser").val(array_tmp[3]);
						$("#txt2G3GPassword").val(array_tmp[4]);
						$("#Sel2G3GAuthTypeNONE").hide();
					}else if(array_tmp[2] == "2"){
						$("#lErrorLogs").hide();
						$("#Sel2G3GAuthType").val("CHAP");
						$("#div2G3GAuthEnabled").show();
						$("#edit_apn_list").show();
						//$("#divIpType").hide();
						$("#txt2G3GUser").val(array_tmp[3]);
						$("#txt2G3GPassword").val(array_tmp[4]);
						$("#Sel2G3GAuthTypeNONE").hide();
					}
				}
				
				if(imsi_changed == "0"){
						var apnid_selected_set = $(xml).find("apnid_selected_set").text();
						if(apnid_selected_set == "")
							$("#SAPNSelectedList").val("0");
						else
							$("#SAPNSelectedList").val(apnid_selected_set);
						
					}else{
						$("#SAPNSelectedList").val("0");
					}
				}
			}
				
				}else{
					$("#divversionC").hide();
					$("#lRuleename").show();
					$("#txtRulename").show();
				}
			//jmm add end
                
            }
        }
        this.loadTFTTableData = function(arrayTableData, connnum) {
            var tableTFTProfiles = document.getElementById('tableTFTProfiles');
            var tBodytable = tableTFTProfiles.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableTFTProfiles');
            if (arrayTableData.length == 0) {
                var row1 = tBodytable.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 5;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            } else {
                for (var i = 0; i < arrayTableData.length; i++) {

                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodytable.insertRow(-1);
                    var RuleNameCol = row.insertCell(0);
                    var IPTypeCol = row.insertCell(1);
                    var RemoteIPCol = row.insertCell(2);
                    var LocalPortCol = row.insertCell(3);
                    var RemotePortCol = row.insertCell(4);
                    var closeCol = row.insertCell(5);

                    var _name = decodeURIComponent(arrayTableDataRow[0]);
                    RuleNameCol.innerHTML = "<a href='#' onclick='TFTProfileClicked(" + i + "," + connnum + ")'>" + _name + "</a>";
                    //IPType
                    if (arrayTableDataRow[17] == "0") {
                        IPTypeCol.innerHTML = jQuery.i18n.prop("tableNoData");
                        RemoteIPCol.innerHTML = jQuery.i18n.prop("tableNoData");
                    } else if (arrayTableDataRow[17] == "1") {
                        IPTypeCol.innerHTML = jQuery.i18n.prop("IPV4Radio");
                        RemoteIPCol.innerHTML = arrayTableDataRow[19];
                    } else if (arrayTableDataRow[17] == "2") {
                        IPTypeCol.innerHTML = jQuery.i18n.prop("IPV6Radio");
                        RemoteIPCol.innerHTML = arrayTableDataRow[19];
                    }
                    //LocalPort
                    if (arrayTableDataRow[2] == "0") {
                        LocalPortCol.innerHTML = jQuery.i18n.prop("tableNoData");
                    } else if (arrayTableDataRow[2] == "1") {
                        LocalPortCol.innerHTML = arrayTableDataRow[3];
                    }
                    //Remote Port
                    if (arrayTableDataRow[4] == "0") {
                        RemotePortCol.innerHTML = jQuery.i18n.prop("tableNoData");
                    } else if (arrayTableDataRow[4] == "1") {
                        RemotePortCol.innerHTML = arrayTableDataRow[5];
                    }
                    closeCol.className = "close";
                    closeCol.innerHTML = "<a href='#' onclick='deleteTFTProfile(" + i + "," + connnum + ")'><img src='images/close.png' alt='' border='0' /></a>";

                }
            }
            Table.stripe(tableTFTProfiles, "alternate", "table-stripeclass");
        }
        this.loadTFTTable = function(connnum) {
            var indexTF1 = 0;
            var indexTF2 = 0;
            var indexTF3 = 0;
            var indexTF4 = 0;

            var arrayLabels = document.getElementsByTagName("th");
            lableLocaliztion(arrayLabels);
            arrayLabels = document.getElementsByTagName("td");
            lableLocaliztion(arrayLabels);
            arrayLabels = document.getElementsByTagName("h1");
            lableLocaliztion(arrayLabels);
            if (connnum == 2) {
                $(xml).find("cellular").each(function() {
                    $(this).find("tf1_supported_list").each(function() {
                        $(this).find("Item").each(function() {
                            arrayTF1Provider[indexTF1] = new Array(22);
                            arrayTF1Provider[indexTF1][0] = $(this).find("rulename").text();
                            arrayTF1Provider[indexTF1][1] = $(this).find("direction").text();
                            arrayTF1Provider[indexTF1][2] = $(this).find("lportflag").text();
                            arrayTF1Provider[indexTF1][3] = $(this).find("locprot").text();
                            arrayTF1Provider[indexTF1][4] = $(this).find("rportflag").text();
                            arrayTF1Provider[indexTF1][5] = $(this).find("remport").text();
                            arrayTF1Provider[indexTF1][6] = $(this).find("PfId").text();
                            PF_INDEX = arrayTF1Provider[indexTF1][6] + indexTF1;
                            arrayTF1Provider[indexTF1][7] = $(this).find("EpIdx").text();
                            arrayTF1Provider[indexTF1][8] = $(this).find("HdrPresent").text();
                            arrayTF1Provider[indexTF1][9] = $(this).find("Hdr").text();
                            arrayTF1Provider[indexTF1][10] = $(this).find("TosPresent").text();
                            arrayTF1Provider[indexTF1][11] = $(this).find("Tos").text();
                            arrayTF1Provider[indexTF1][12] = $(this).find("TosMask").text();
                            arrayTF1Provider[indexTF1][13] = $(this).find("SpiPresent").text();
                            arrayTF1Provider[indexTF1][14] = $(this).find("SPI").text();
                            arrayTF1Provider[indexTF1][15] = $(this).find("FLPresent").text();
                            arrayTF1Provider[indexTF1][16] = $(this).find("FlowLable").text();
                            arrayTF1Provider[indexTF1][17] = $(this).find("IPType").text();
                            arrayTF1Provider[indexTF1][18] = $(this).find("RemoteIPFlag").text();
                            arrayTF1Provider[indexTF1][19] = $(this).find("RemoteIP").text();
                            arrayTF1Provider[indexTF1][20] = $(this).find("MaskFlag").text();
                            arrayTF1Provider[indexTF1][21] = $(this).find("NetMask").text();
                            indexTF1++;
                        });
                    });
                });
                this.loadTFTTableData(arrayTF1Provider, connnum);
            } else if (connnum == 4) {
                $(xml).find("cellular").each(function() {
                    $(this).find("tf2_supported_list").each(function() {
                        $(this).find("Item").each(function() {
                            arrayTF2Provider[indexTF2] = new Array(22);
                            arrayTF2Provider[indexTF2][0] = $(this).find("rulename").text();
                            arrayTF2Provider[indexTF2][1] = $(this).find("direction").text();
                            arrayTF2Provider[indexTF2][2] = $(this).find("lportflag").text();
                            arrayTF2Provider[indexTF2][3] = $(this).find("locprot").text();
                            arrayTF2Provider[indexTF2][4] = $(this).find("rportflag").text();
                            arrayTF2Provider[indexTF2][5] = $(this).find("remport").text();
                            arrayTF2Provider[indexTF2][6] = $(this).find("PfId").text();
                            arrayTF2Provider[indexTF2][7] = $(this).find("EpIdx").text();
                            arrayTF2Provider[indexTF2][8] = $(this).find("HdrPresent").text();
                            arrayTF2Provider[indexTF2][9] = $(this).find("Hdr").text();
                            arrayTF2Provider[indexTF2][10] = $(this).find("TosPresent").text();
                            arrayTF2Provider[indexTF2][11] = $(this).find("Tos").text();
                            arrayTF2Provider[indexTF2][12] = $(this).find("TosMask").text();
                            arrayTF2Provider[indexTF2][13] = $(this).find("SpiPresent").text();
                            arrayTF2Provider[indexTF2][14] = $(this).find("SPI").text();
                            arrayTF2Provider[indexTF2][15] = $(this).find("FLPresent").text();
                            arrayTF2Provider[indexTF2][16] = $(this).find("FlowLable").text();
                            arrayTF2Provider[indexTF2][17] = $(this).find("IPType").text();
                            arrayTF2Provider[indexTF2][18] = $(this).find("RemoteIPFlag").text();
                            arrayTF2Provider[indexTF2][19] = $(this).find("RemoteIP").text();
                            arrayTF2Provider[indexTF2][20] = $(this).find("MaskFlag").text();
                            arrayTF2Provider[indexTF2][21] = $(this).find("NetMask").text();
                            indexTF2++;
                        });
                    });
                });
                this.loadTFTTableData(arrayTF2Provider, connnum);
            } else if (connnum == 5) {
                $(xml).find("cellular").each(function() {
                    $(this).find("tf3_supported_list").each(function() {
                        $(this).find("Item").each(function() {
                            arrayTF3Provider[indexTF3] = new Array(22);
                            arrayTF3Provider[indexTF3][0] = $(this).find("rulename").text();
                            arrayTF3Provider[indexTF3][1] = $(this).find("direction").text();
                            arrayTF3Provider[indexTF3][2] = $(this).find("lportflag").text();
                            arrayTF3Provider[indexTF3][3] = $(this).find("locprot").text();
                            arrayTF3Provider[indexTF3][4] = $(this).find("rportflag").text();
                            arrayTF3Provider[indexTF3][5] = $(this).find("remport").text();
                            arrayTF3Provider[indexTF3][6] = $(this).find("PfId").text();
                            arrayTF3Provider[indexTF3][7] = $(this).find("EpIdx").text();
                            arrayTF3Provider[indexTF3][8] = $(this).find("HdrPresent").text();
                            arrayTF3Provider[indexTF3][9] = $(this).find("Hdr").text();
                            arrayTF3Provider[indexTF3][10] = $(this).find("TosPresent").text();
                            arrayTF3Provider[indexTF3][11] = $(this).find("Tos").text();
                            arrayTF3Provider[indexTF3][12] = $(this).find("TosMask").text();
                            arrayTF3Provider[indexTF3][13] = $(this).find("SpiPresent").text();
                            arrayTF3Provider[indexTF3][14] = $(this).find("SPI").text();
                            arrayTF3Provider[indexTF3][15] = $(this).find("FLPresent").text();
                            arrayTF3Provider[indexTF3][16] = $(this).find("FlowLable").text();
                            arrayTF3Provider[indexTF3][17] = $(this).find("IPType").text();
                            arrayTF3Provider[indexTF3][18] = $(this).find("RemoteIPFlag").text();
                            arrayTF3Provider[indexTF3][19] = $(this).find("RemoteIP").text();
                            arrayTF3Provider[indexTF3][20] = $(this).find("MaskFlag").text();
                            arrayTF3Provider[indexTF3][21] = $(this).find("NetMask").text();
                            indexTF3++;
                        });
                    });
                });
                this.loadTFTTableData(arrayTF3Provider, connnum);
            } else if (connnum == 6) {
                $(xml).find("cellular").each(function() {
                    $(this).find("tf4_supported_list").each(function() {
                        $(this).find("Item").each(function() {
                            arrayTF4Provider[indexTF4] = new Array(22);
                            arrayTF4Provider[indexTF4][0] = $(this).find("rulename").text();
                            arrayTF4Provider[indexTF4][1] = $(this).find("direction").text();
                            arrayTF4Provider[indexTF4][2] = $(this).find("lportflag").text();
                            arrayTF4Provider[indexTF4][3] = $(this).find("locprot").text();
                            arrayTF4Provider[indexTF4][4] = $(this).find("rportflag").text();
                            arrayTF4Provider[indexTF4][5] = $(this).find("remport").text();
                            arrayTF4Provider[indexTF4][6] = $(this).find("PfId").text();
                            arrayTF4Provider[indexTF4][7] = $(this).find("EpIdx").text();
                            arrayTF4Provider[indexTF4][8] = $(this).find("HdrPresent").text();
                            arrayTF4Provider[indexTF4][9] = $(this).find("Hdr").text();
                            arrayTF4Provider[indexTF4][10] = $(this).find("TosPresent").text();
                            arrayTF4Provider[indexTF4][11] = $(this).find("Tos").text();
                            arrayTF4Provider[indexTF4][12] = $(this).find("TosMask").text();
                            arrayTF4Provider[indexTF4][13] = $(this).find("SpiPresent").text();
                            arrayTF4Provider[indexTF4][14] = $(this).find("SPI").text();
                            arrayTF4Provider[indexTF4][15] = $(this).find("FLPresent").text();
                            arrayTF4Provider[indexTF4][16] = $(this).find("FlowLable").text();
                            arrayTF4Provider[indexTF4][17] = $(this).find("IPType").text();
                            arrayTF4Provider[indexTF4][18] = $(this).find("RemoteIPFlag").text();
                            arrayTF4Provider[indexTF4][19] = $(this).find("RemoteIP").text();
                            arrayTF4Provider[indexTF4][20] = $(this).find("MaskFlag").text();
                            arrayTF4Provider[indexTF4][21] = $(this).find("NetMask").text();
                            indexTF4++;
                        });
                    });
                });
                this.loadTFTTableData(arrayTF4Provider, connnum);
            }
        }
        this.saveUpdateCheckbox = function(arrayTableData) {
            var num = arrayTableData.length;
            if (num > 0) {
                if (arrayTableData[0][3] == "1") {
                    document.getElementById("pPDPdef_chk").checked = true;
                    PDPCheckFlags[0] = 1;
                } else {
                    document.getElementById("pPDPdef_chk").checked = false;
                    PDPCheckFlags[0] = 0;
                }
            }
            if (num > 1) {
                if (arrayTableData[1][3] == "1") {
                    document.getElementById("sPDPdef_chk").checked = true;
                    PDPCheckFlags[1] = 1;
                } else {
                    document.getElementById("sPDPdef_chk").checked = false;
                    PDPCheckFlags[1] = 0;
                }
            }
            if (num > 2) {
                if (arrayTableData[2][3] == "1") {
                    document.getElementById("pPDPded_chk").checked = true;
                    PDPCheckFlags[2] = 1;
                } else {
                    document.getElementById("pPDPded_chk").checked = false;
                    PDPCheckFlags[2] = 0;
                }
            }
            if (num > 3) {
                if (arrayTableData[3][3] == "1") {
                    document.getElementById("s1PDPded_chk").checked = true;
                    PDPCheckFlags[3] = 1;
                } else {
                    document.getElementById("s1PDPded_chk").checked = false;
                    PDPCheckFlags[3] = 0;
                }
            }
            if (num > 4) {
                if (arrayTableData[4][3] == "1") {
                    document.getElementById("s2PDPded_chk").checked = true;
                    PDPCheckFlags[4] = 1;
                } else {
                    document.getElementById("s2PDPded_chk").checked = false;
                    PDPCheckFlags[4] = 0;
                }
            }
            if (num > 5) {
                if (arrayTableData[5][3] == "1") {
                    document.getElementById("s3PDPded_chk").checked = true;
                    PDPCheckFlags[5] = 1;
                } else {
                    document.getElementById("s3PDPded_chk").checked = false;
                    PDPCheckFlags[5] = 0;
                }
            }
            pPDPdefChange();
            pPDPdedChange();
        }

        this.savePDPDataLocal = function(arrayISPProvider) {
            var indexLoad = 0;
            var index = 0
            for (index = 0; index < arrayISPProvider.length; index++) {
                indexLoad = 0;
                PDPMapExisting[index] = new Array(19);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item#index", index);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/rulename", arrayISPProvider[index][0]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/connnum", arrayISPProvider[index][1]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/pconnnum", arrayISPProvider[index][2]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/enable", arrayISPProvider[index][3]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/conntype", arrayISPProvider[index][4]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/default", arrayISPProvider[index][5]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/secondary", arrayISPProvider[index][6]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/apn", arrayISPProvider[index][7]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/iptype", arrayISPProvider[index][8]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/qci", arrayISPProvider[index][9]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/hastft", arrayISPProvider[index][10]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/lte_apn", arrayISPProvider[index][11]);

                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/authtype2g3", arrayISPProvider[index][12]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/usr2g3", arrayISPProvider[index][13]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/paswd2g3", arrayISPProvider[index][14]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/authtype4g", arrayISPProvider[index][15]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/usr4g", arrayISPProvider[index][16]);
                PDPMapExisting[index] = g_objXML.putMapElement(PDPMapExisting[index], indexLoad++, "RGW/wan/cellular/pdp_supported_list/Item/paswd4g", arrayISPProvider[index][17]);
            }
        }

        this.loadPDPData = function(flag) {
            var rulename = "";
            var indexISP = 0;
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, 0, "RGW/wan/proto", proto);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            $(xml).find("cellular").each(function() {
                $(this).find("pdp_supported_list").each(function() {
                    $(this).find("Item").each(function() {
                        rulename = $(this).find("rulename").text();
                        arrayISPProvider[indexISP] = new Array(18);
                        arrayISPProvider[indexISP][0] = rulename;
                        arrayISPProvider[indexISP][1] = $(this).find("connnum").text();
                        arrayISPProvider[indexISP][2] = $(this).find("pconnnum").text();
                        arrayISPProvider[indexISP][3] = $(this).find("enable").text();
                        arrayISPProvider[indexISP][4] = $(this).find("conntype").text();
                        arrayISPProvider[indexISP][5] = $(this).find("default").text();
                        arrayISPProvider[indexISP][6] = $(this).find("secondary").text();
                        arrayISPProvider[indexISP][7] = $(this).find("apn").text();
                        arrayISPProvider[indexISP][8] = $(this).find("iptype").text();
                        arrayISPProvider[indexISP][9] = $(this).find("qci").text();
                        arrayISPProvider[indexISP][10] = $(this).find("hastft").text();
                        arrayISPProvider[indexISP][11] = $(this).find("lte_apn").text();
                        arrayISPProvider[indexISP][12] = $(this).find("authtype2g3").text();
                        arrayISPProvider[indexISP][13] = $(this).find("usr2g3").text();
                        arrayISPProvider[indexISP][14] = $(this).find("paswd2g3").text();
                        arrayISPProvider[indexISP][15] = $(this).find("authtype4g").text();
                        arrayISPProvider[indexISP][16] = $(this).find("usr4g").text();
                        arrayISPProvider[indexISP][17] = $(this).find("paswd4g").text();
                        indexISP++;
                    });
                });
            });

            this.savePDPDataLocal(arrayISPProvider);
            this.saveUpdateCheckbox(arrayISPProvider);
        }

        this.loadTableData = function(arrayTableData) {
            var tableProfiles = document.getElementById('tableProfiles');
            var tBodytable = tableProfiles.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableProfiles');
            if (arrayTableData.length == 0) {
                var row1 = tBodytable.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 4;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            } else {
                var ispValue = $(xml).find("ISP_name").text();
                active_isp = ispValue;
                for (var i = 0; i < arrayTableData.length; i++) {
                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodytable.insertRow(-1);
                    var activeFlag = false;
                    var ProfileNameCol = row.insertCell(0);
                    var APNNameCol = row.insertCell(1);
                    var ConnModeCol = row.insertCell(2);
                    var closeCol = row.insertCell(3);

                    if (arrayTableDataRow[0] == ispValue) {
                        activeFlag = true;
                        arrayTableDataRow[8] = connectedmode;
                    }

                    var _name = decodeURIComponent(arrayTableDataRow[0]);
                    if (activeFlag) {
                        ProfileNameCol.innerHTML = "<a><img src=\"images/status-icon3.png\"</a>\&nbsp\&nbsp<a href='#' onclick='ProfileClicked(" + i + ")'>" + _name + "</a>";
                    } else {
                        ProfileNameCol.innerHTML = "<a><img src=\"images/status-icon2.png\"</a>\&nbsp\&nbsp<a href='#' onclick='ProfileClicked(" + i + ")'>" + _name + "</a>";
                    }
                    var APNName = arrayTableDataRow[4].substring(arrayTableDataRow[4].indexOf(',"') + 7, arrayTableDataRow[4].length);
                    var l = APNName.indexOf('",');
                    APNName = APNName.substring(0, l);
                    APNNameCol.innerHTML = APNName;
                    if (arrayTableDataRow[8] == "0") {
                        var ConnMode = jQuery.i18n.prop("lAlways");
                    } else {
                        var ConnMode = jQuery.i18n.prop("lManual");
                    }

                    ConnModeCol.innerHTML = ConnMode;
                    if (!activeFlag) {
                        closeCol.className = "close";
                        closeCol.innerHTML = "<a href='#' onclick='deleteProfile(" + i + ")'><img src='images/close.png' alt='' border='0' /></a>";
                    } else {
                        closeCol.className = "close";
                        closeCol.innerHTML = "&nbsp;&nbsp&nbsp";
                    }
                }
            }
            Table.stripe(tableProfiles, "alternate", "table-stripeclass");
        }

        this.getCellularPostData = function() {

            var pdp_number = arrayISPProvider.length;
            var indexLoad = 0;
            var proto_;

            var NW_modeObj = document.getElementById("WorkModeropdown");
            var NW_modeSelected = NW_modeObj.options[NW_modeObj.selectedIndex].value;
            var boot_modeObj = document.getElementById("BootModeropdown");
            var boot_modeSelected = boot_modeObj.options[boot_modeObj.selectedIndex].value;
            var boot_mode1Obj = document.getElementById("BootModeropdown1");
            var boot_mode1Selected = boot_mode1Obj.options[boot_mode1Obj.selectedIndex].value;
            var boot_mode2Obj = document.getElementById("BootModeropdown2");
            var boot_mode2Selected = boot_mode2Obj.options[boot_mode2Obj.selectedIndex].value;
            var selectLteTypeObj = document.getElementById("setLikeLTETypedropdown");
            var selectedLteType = selectLteTypeObj.options[selectLteTypeObj.selectedIndex].value;
            if(NW_modeSelected == "2"||NW_modeSelected == "5"||NW_modeSelected == "6")
                boot_modeSelected = "20"; //invalid value


            var proto_ = document.getElementById("micdropdown").value;
            var connmode = document.getElementById("Cconndropdown").value;

            PDPMapExisting[pdp_number] = new Array();


			if(proto_ != InternetconnectFlag){
            	PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/proto", proto_);
			}

			if(connmode != ConnectionModeflag){
            	PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/connect_mode", connmode);
			}

			if(NW_modeSelected != NetworkModeflag){
            	PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/NW_mode", NW_modeSelected);
			}
           
            if (NW_modeSelected != NetworkModeflag) { //改变主模式，则设置优先选择模式
                PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/NW_mode_action", "1");
                if (1 == NW_modeSelected) {
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode", boot_modeSelected);
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode_action", "1");
                }

                else if (3 == NW_modeSelected) {
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode", boot_mode1Selected);
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode_action", "1");
                } else if (4 == NW_modeSelected) {
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode", boot_mode2Selected);
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode_action", "1");
                }
            } else { //没有改变主模式，在优先选择模式改变的情况下才重新设置
                if (1 == NW_modeSelected && boot_modeSelected != pre_prefer_bootmode) {
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode", boot_modeSelected);
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode_action", "1");
                }

                else if (3 == NW_modeSelected && boot_mode1Selected != pre_prefer_bootmode1) {
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode", boot_mode1Selected);
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode_action", "1");
                } else if (4 == NW_modeSelected && boot_mode2Selected != pre_prefer_bootmode2) {
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode", boot_mode2Selected);
                    PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_mode_action", "1");
                }
            }


			if(selectedLteType != Preferred_LTETypeflag){				
            	PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_lte_type", selectedLteType);
			}

			if (selectedLteType != Preferred_LTETypeflag){
                PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/cellular/prefer_lte_type_action", "1");
            }

			
			if(bDisabledAutoDialInRoam != $("#RoamingDisableAutoDialCheckBox").prop("checked"))
			{
				if($("#RoamingDisableAutoDialCheckBox").prop("checked"))
				{
					PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/Roaming_disable_auto_dial", 1);
					
				}
				else{
					PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/Roaming_disable_auto_dial", 0);
					
				}
				PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/Roaming_disable_auto_dial_action", 1);
				
			}
						
           
            //MTU            
            if (mtuValue != $("#txtMtuValue").val()) {
				g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/mtu", $("#txtMtuValue").val());
                g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/mtu_action", "1");
            } 
			
            // AutoAPN     
            /*if ($("#AutoConfigureAPNCheckBox").prop("checked") != gdAutoConfAPN) {
				if ($("#AutoConfigureAPNCheckBox").prop("checked")) {
                	PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/auto_apn", 1);
            	} else {
                	PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/auto_apn", 0);
            	}
				
                PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/auto_apn_action", 1);
            } */
			
            //Engineer model
            if ($("#EngineeringModelSel").val() != gEngineerModel) {
                PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/Engineering_mode", $("#EngineeringModelSel").val());
				if(1 == $("#EngineeringModelSel").val()) //enabled
				{
					 PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/query_time_interval", $("#txtqueryTimeInterval").val());
				}
            }
			else
			{
				if(1 == gEngineerModel&& $("#txtqueryTimeInterval").val() != gEngineerQueryTimeInterval){
					PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/query_time_interval", $("#txtqueryTimeInterval").val());
				}
			}

			 // Dial in roaming status     
            if ($("#DialInRoamingSel").val() != gDialInRoaming) {				
                PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/Roaming_disable_dial", $("#DialInRoamingSel").val());      	
                PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/Roaming_disable_dial_action", 1);
            } 

                   
            if (pdp_number > 0) {
                if (document.getElementById("pPDPdef_chk").checked)
                    PDPMapExisting[0][4][1] = "1";
                else
                    PDPMapExisting[0][4][1] = "0";
            }
            if (pdp_number > 1) {
                if (document.getElementById("sPDPdef_chk").checked)
                    PDPMapExisting[1][4][1] = "1";
                else
                    PDPMapExisting[1][4][1] = "0";
            }
            if (pdp_number > 2) {
                if (document.getElementById("pPDPded_chk").checked)
                    PDPMapExisting[2][4][1] = "1";
                else
                    PDPMapExisting[2][4][1] = "0";
            }
            if (pdp_number > 3) {
                if (document.getElementById("s1PDPded_chk").checked)
                    PDPMapExisting[3][4][1] = "1";
                else
                    PDPMapExisting[3][4][1] = "0";
            }
            if (pdp_number > 4) {
                if (document.getElementById("s2PDPded_chk").checked)
                    PDPMapExisting[4][4][1] = "1";
                else
                    PDPMapExisting[4][4][1] = "0";
            }
            if (pdp_number > 5) {
                if (document.getElementById("s3PDPded_chk").checked)
                    PDPMapExisting[5][4][1] = "1";
                else
                    PDPMapExisting[5][4][1] = "0";
            }

            return PDPMapExisting;
        }

        this.loadWiFiData = function() {
            var arrayLabels = document.getElementsByTagName("th");
            lableLocaliztion(arrayLabels);
            buttonLocaliztion("btnScanWirelessNw");

            document.getElementById("WiFi_div").style.display = "block";
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, 0, "RGW/wan/proto", proto);

            indexWN = 0;
            _arrayWirelessNws = null;
            _arrayWirelessNws = new Array(0);
            sm("PleaseWait", 150, 100);
            $("#lPleaseWait").text(jQuery.i18n.prop("h1PleaseWait"));

            $(xml).find("wireless_network_list").each(function() {
                $(this).find("Item").each(function() {
                    SSID = $(this).find("ssid").text();
                    ENC = $(this).find("sec_mode").text();
                    CIPHER = $(this).find("cipher").text();
                    SIGNAL = $(this).find("signal").text();
                    CONN = $(this).find("connected").text();

                    KEYMGMT = $(this).find("key_mgmt").text();
                    _arrayWirelessNws[indexWN] = new Array(7);
                    _arrayWirelessNws[indexWN][0] = indexWN;
                    _arrayWirelessNws[indexWN][1] = SSID;
                    _arrayWirelessNws[indexWN][2] = ENC;
                    _arrayWirelessNws[indexWN][3] = CIPHER;
                    _arrayWirelessNws[indexWN][4] = SIGNAL;
                    _arrayWirelessNws[indexWN][5] = CONN;
                    _arrayWirelessNws[indexWN][6] = KEYMGMT;
                    indexWN++;
                });
            });
            this.loadWirelessNwsTableData(_arrayWirelessNws);
        }
        this.loadWirelessNwsTableData = function(arrayTableData) {
            var tableWNs = document.getElementById('tableWNs');
            var tBodytable = tableWNs.getElementsByTagName('tbody')[0];

            clearTabaleRows('tableWNs');
            tableWNs.rules = "rows";

            if (arrayTableData.length == 0) {
                var row1 = tBodytable.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 5;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            } else {
                for (var i = 0; i < arrayTableData.length; i++) {
                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodytable.insertRow(i);

                    var WirelessACCol = row.insertCell(0);
                    var StatusACCol = row.insertCell(1);
                    var TableBackgroundNormalColor = "#ffffff";
                    var TableBackgroundMouseoverColor = "#E6E6FA";

                    var createMouseOverHandler =
                    function(currentRow) {
                        return function() {
                            currentRow.style.cursor = 'pointer';
                            currentRow.style.backgroundColor = TableBackgroundMouseoverColor;
                        };
                    };
                    var createMouseOutHandler =
                    function(currentRow) {
                        return function() {
                            currentRow.style.backgroundColor = TableBackgroundNormalColor;
                        };
                    };

                    //row.onclick = createClickHandler(row,i);
                    row.onmouseover = createMouseOverHandler(row);
                    row.onmouseout = createMouseOutHandler(row);

                    IMGID = "imgSignalStrength" + i;
                    STATUSID = "Status" + i;

                    WirelessACCol.innerHTML = "<b><label>" + arrayTableDataRow[1] + "</label></b>";
                    if (arrayTableDataRow[2] == "Open") {
                        WirelessACCol.innerHTML += "<span>  </span>";
                    } else {
                        WirelessACCol.innerHTML += "<span>Secured with " + arrayTableDataRow[2] + "</span>";
                    }
                    StatusACCol.className = "close";
                    StatusACCol.innerHTML = "<div><label align='right' id=" + STATUSID + "></label><span><img id=" + IMGID + " align='right' alt='' border='0'/></span></div>";
                    //alert('StatusID is ' +STATUSID);
                    conn = arrayTableDataRow[5];
                    //alert('conn is ' +conn);
                    if (conn == "1") {
                        // document.getElementById(STATUSID).innerHTML = "<span>Connected</span>";
                        if (arrayTableDataRow[1] == "cmcc_open") {
                            if (arrayTableDataRow[6] == "IEEE8021X") {
                                WirelessACCol.innerHTML += "<span>  </span>";
                                WirelessACCol.innerHTML += "<span>Authenticated with 802.1X</span>";
                            } else if (arrayTableDataRow[6] == "NONE") {
                                WirelessACCol.innerHTML += "<span>Web open</span>";
                            }
                            // document.getElementById(STATUSID).innerHTML = "Connected";
                        }
                        document.getElementById(STATUSID).innerHTML = "<span>Connected</span><label class=\"link1\" id=\"wifiED\" onclick=\"WiFiED()\" onmousedown=\"WiFiED()\" onmouseover=\"this.style.cursor='pointer'\"></label>";
                        document.getElementById("wifiED").innerHTML = "<U><span style=\"color:#52587a;\">Disconnect</span></U>";
                        _WiFiIntervalID = setInterval("g_objContent.onLoad(false)", _WiFiInterval);
                    } else if (conn == "2") {
                        _WiFiIntervalID = setInterval("g_objContent.onLoad(false)", _WiFiConnInterval);

                        document.getElementById(STATUSID).innerHTML = "<img src='images/loading.gif' alt='' border='0'/>Aquaring network address";
                    } else if (conn == "0") {
                        _WiFiIntervalID = setInterval("g_objContent.onLoad(false)", _WiFiInterval);

                        document.getElementById(STATUSID).innerHTML = "Disconnected";
                    } else if (conn == "3") {
                        _WiFiIntervalID = setInterval("g_objContent.onLoad(false)", _WiFiConnInterval);

                        document.getElementById(STATUSID).innerHTML = "<img src='images/loading.gif' alt='' border='0'/>Connecting";
                    }
                    rssi = arrayTableDataRow[4];
                    if (rssi >= 70)
                        document.getElementById(IMGID).src = "images/5.png";
                    else if (rssi > 55 && rssi < 70)
                        document.getElementById(IMGID).src = "images/4.png";
                    else if (rssi > 40 && rssi <= 55)
                        document.getElementById(IMGID).src = "images/3.png";
                    else if (rssi > 25 && rssi <= 40)
                        document.getElementById(IMGID).src = "images/2.png";
                    else if (rssi > 10 && rssi <= 25)
                        document.getElementById(IMGID).src = "images/1.png";
                    else if (rssi >= 0 && rssi <= 10)
                        document.getElementById(IMGID).src = "images/0.png";
                }
                $('#tableWNs').find('tr').click(function() {
                    var index = $('tr').index(this) - 2;
                    var status = document.getElementById("Status" + index).innerHTML;
                    if (status == "" || status == "Disconnected") {
                        g_objContent.ConnecttoNw(index);
                    }
                });
            }
            Table.stripe(tableWNs, "alternate", "table-stripeclass");
            hm("PleaseWait");
        }
        this.clearStatus = function() {
            for (var i = 0; i < _arrayWirelessNws.length; i++) {
                STATUSID = "Status" + i;
                //alert(_arrayWirelessNws.length);
                //alert(STATUSID);
                document.getElementById(STATUSID).innerHTML = "";
            }
        }
        this.ConnecttoNw = function(index) {
            var data = g_objContent.getTableWNsDataRow(index);
            indexWNS = index;
            var message = '';
            var ssid = data[1];
            var enc = data[2];

            if (enc == "Open") {
                message = "You are connecting to the unsecured wireless network \"" + ssid + "\"";
                showConnectAlert(message);
            } else {
                message = "The network \"" + ssid + "\" requires a network key";
                showPSKAlert(message);
            }
        }
        this.Connect = function() {
            var data = g_objContent.getTableWNsDataRow(indexWNS);
            var index = 0;
            mapData = null;
            mapData = new Array();

            this.putMapElement("RGW/wan/wifi/ssid", data[1], index++);
            this.putMapElement("RGW/wan/wifi/enc", data[2], index++);
            this.putMapElement("RGW/wan/wifi/cipher", data[3], index++);

            if (data[2] != "Open") {
                var psk = document.getElementById("tbpsk").value;
                this.putMapElement("RGW/wan/wifi/psk", psk, index);
            }

            if (mapData.length > 0) {
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));

                _WiFiIntervalID = setInterval("g_objContent.onLoad(false)", _WiFiInterval);
                document.getElementById("Status" + indexWNS).innerHTML = "<img src='images/loading.gif' alt='' border='0'/>Connecting";
            }

        }
        this.getWiFiPostData = function() {

            var mapData = new Array(0);
            controlMapCurrent[0][1] = document.getElementById("micdropdown").value;
            mapData = g_objXML.copyArray(controlMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(controlMapExisting, mapData, true);
            return mapData;
        }

        this.getDisabledPostData = function() {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();
            putMapElement_test("RGW/wan/proto", "disabled", itemIndex++);
            return mapData;
        }

        this.getManualNetworkData = function() {

            var mapData = new Array(0);
            controlMapCurrent[0][1] = document.getElementById("micdropdown").value;
            mapData = g_objXML.copyArray(controlMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(controlMapExisting, mapData, true);
            return mapData;
        }
        this.postItem = function(isDeleted, Rulename, Enable, APNname, LteApnName, IPType, ConnNum, pConnNum, IsSecondary, IsDefault, QCI, HasTFT, txt2G3GAuthType, txt2G3GUserName, txt2G3GPasswd, txt4GAuthType, txt4GUserName, txt4GPasswd) {
            //APNname = encodeURI(APNname);
            var itemIndex = 0;
			//jmm add apn_selected_mode
			var vAPNSelectedMethod = $("#SAPNSelectedMethod").val();
			var vapn_selected_id = $("#SAPNSelectedList").val();
			//jmm add end
            mapData = null;
            mapData = new Array();
			if(hard_ver=="Ver.C"){
			if(vAPNSelectedMethod != wapn_selected_mode){
				this.putMapElement("RGW/selectapn/apn_selected_mode", vAPNSelectedMethod, itemIndex++);
			}
			this.putMapElement("RGW/selectapn/apnid_selected_action", "1", itemIndex++);
			if(vAPNSelectedMethod == "1"){
				this.putMapElement("RGW/selectapn/apnid_selected_set", vapn_selected_id, itemIndex++);
			}
			}
            if (IsSecondary == 0)//Secondary apply TFT setting
                this.putMapElement("RGW/wan/cellular/tft_apply_action", "2", itemIndex++);

            if (isDeleted) {
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item#index", itemIndex, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/rulename#delete", Rulename, itemIndex++);
            } else {
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item#index", itemIndex, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/rulename", Rulename, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/connnum", ConnNum, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/pconnnum", pConnNum, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/enable", Enable, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/conntype", "0", itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/default", IsDefault, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/secondary", IsSecondary, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/apn", APNname, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/lte_apn", LteApnName, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/iptype", IPType, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/qci", QCI, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/hastft", HasTFT, itemIndex++);

                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/authtype2g3", txt2G3GAuthType, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/usr2g3", txt2G3GUserName, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/paswd2g3", txt2G3GPasswd, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/authtype4g", txt4GAuthType, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/usr4g", txt4GUserName, itemIndex++);
                this.putMapElement("RGW/wan/cellular/pdp_supported_list/Item/paswd4g", txt4GPasswd, itemIndex++);
            }

            if (mapData.length > 0) {
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
        }
        this.posttftItem = function(Rulename, isDeleted, Connnum, remote_ip, IPType, local_port, remote_port, localport_flag, remoteport_flag, netmask_flag, netmask, pfindex, evaluation_index, protocol_number_flag, protocol_number, direction) {
            //ruleName = encodeURI(ruleName);
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();
            var RemoteIPFlag = 0;
            if (IPType != 0)
                RemoteIPFlag = 1;
            if (Connnum == 2) {
                this.putMapElement("RGW/wan/cellular/TFT_tables_index", Connnum, itemIndex++);
                this.putMapElement("RGW/wan/cellular/tft_apply_action", "1", itemIndex++);
                if (isDeleted) {
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item#index", itemIndex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/rulename#delete", Rulename, itemIndex++);
                } else {
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item#index", itemIndex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/rulename", Rulename, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/direction", direction, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/lportflag", localport_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/locprot", local_port, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/rportflag", remoteport_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/remport", remote_port, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/PfId", pfindex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/EpIdx", evaluation_index, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/HdrPresent", protocol_number_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/Hdr", protocol_number, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/TosPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/Tos", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/TosMask", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/SpiPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/SPI", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/FLPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/FlowLable", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/IPType", IPType, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/RemoteIPFlag", RemoteIPFlag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/RemoteIP", remote_ip, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/MaskFlag", netmask_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf1_supported_list/Item/NetMask", netmask, itemIndex++);
                }
            } else if (Connnum == 4) {
                this.putMapElement("RGW/wan/cellular/TFT_tables_index", Connnum, itemIndex++);
                this.putMapElement("RGW/wan/cellular/tft_apply_action", "1", itemIndex++);
                if (isDeleted) {
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item#index", itemIndex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/rulename#delete", Rulename, itemIndex++);
                } else {
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item#index", itemIndex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/rulename", Rulename, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/direction", direction, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/lportflag", localport_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/locprot", local_port, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/rportflag", remoteport_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/remport", remote_port, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/PfId", pfindex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/EpIdx", evaluation_index, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/HdrPresent", protocol_number_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/Hdr", protocol_number, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/TosPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/Tos", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/TosMask", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/SpiPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/SPI", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/FLPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/FlowLable", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/IPType", IPType, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/RemoteIPFlag", RemoteIPFlag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/RemoteIP", remote_ip, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/MaskFlag", netmask_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf2_supported_list/Item/NetMask", netmask, itemIndex++);
                }
            } else if (Connnum == 5) {
                this.putMapElement("RGW/wan/cellular/TFT_tables_index", Connnum, itemIndex++);
                this.putMapElement("RGW/wan/cellular/tft_apply_action", "1", itemIndex++);
                if (isDeleted) {
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item#index", itemIndex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/rulename#delete", Rulename, itemIndex++);
                } else {
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item#index", itemIndex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/rulename", Rulename, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/direction", direction, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/lportflag", localport_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/locprot", local_port, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/rportflag", remoteport_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/remport", remote_port, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/PfId", pfindex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/EpIdx", evaluation_index, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/HdrPresent", protocol_number_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/Hdr", protocol_number, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/TosPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/Tos", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/TosMask", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/SpiPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/SPI", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/FLPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/FlowLable", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/IPType", IPType, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/RemoteIPFlag", RemoteIPFlag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/RemoteIP", remote_ip, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/MaskFlag", netmask_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf3_supported_list/Item/NetMask", netmask, itemIndex++);
                }
            } else if (Connnum == 6) {
                this.putMapElement("RGW/wan/cellular/TFT_tables_index", Connnum, itemIndex++);
                this.putMapElement("RGW/wan/cellular/tft_apply_action", "1", itemIndex++);
                if (isDeleted) {
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item#index", itemIndex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/rulename#delete", Rulename, itemIndex++);
                } else {
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item#index", itemIndex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/rulename", Rulename, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/direction", direction, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/lportflag", localport_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/locprot", local_port, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/rportflag", remoteport_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/remport", remote_port, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/PfId", pfindex, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/EpIdx", evaluation_index, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/HdrPresent", protocol_number_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/Hdr", protocol_number, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/TosPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/Tos", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/TosMask", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/SpiPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/SPI", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/FLPresent", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/FlowLable", "0", itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/IPType", IPType, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/RemoteIPFlag", RemoteIPFlag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/RemoteIP", remote_ip, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/MaskFlag", netmask_flag, itemIndex++);
                    this.putMapElement("RGW/wan/cellular/tf4_supported_list/Item/NetMask", netmask, itemIndex++);
                }
            }
            if (mapData.length > 0) {
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
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
        this.copyControlArray = function() {
            controlMapCurrent = g_objXML.copyArray(controlMapExisting, controlMapCurrent);
        }
        this.loadDisabledData = function() {
            document.getElementById("WiFi_div").style.display = "none";
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, 0, "RGW/wan/proto", proto);
        }
        this.getTableProfilesDataRow = function(index) {
            return arrayISPProvider[index];
        }
        this.getTFTTableProfilesDataRow = function(index, connnum) {
            if (connnum == 2) {
                return arrayTF1Provider[index];
            } else if (connnum == 4) {
                return arrayTF2Provider[index];
            } else if (connnum == 5) {
                return arrayTF3Provider[index];
            } else if (connnum == 6) {
                return arrayTF4Provider[index];
            }
        }
        this.getTableWNsDataRow = function(index) {
            return _arrayWirelessNws[index];
        }
        this._ScanWirelessNws = function() {
            var index = 0;
            mapData = null;
            mapData = new Array();

            this.putMapElement("RGW/wlan_cli_scan/refresh", "1", index);

            if (mapData.length > 0) {
                postXML("wlan_cli_scan", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
        }

        return this.each(function() {
        });
    }
})(jQuery);

function AutoConfigureAPNCheckBoxChanged(){
	mapData = new Array();//(xmlDataMap, "RGW/selectapn/apnid_selected", 4, 0);
	if ($("#AutoConfigureAPNCheckBox").prop("checked") != gdAutoConfAPN) {
				if ($("#AutoConfigureAPNCheckBox").prop("checked")) {
					putMapElement(mapData,"RGW/wan/auto_apn", "1", 0);
                	//PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/auto_apn", 1);
            	} else {
            		putMapElement(mapData,"RGW/wan/auto_apn", "0", 0);
                	//PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/auto_apn", 0);
            	}
				putMapElement(mapData,"RGW/wan/auto_apn_action", "1", 1);
                //PDPMapExisting[pdp_number] = g_objXML.putMapElement(PDPMapExisting[pdp_number], indexLoad++, "RGW/wan/auto_apn_action", 1);
                postXML('wan',g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            } 



	
    //putMapElement_test("RGW/selectapn/apnid_selected", apnid_selected, 0);
	//putMapElement_test("RGW/selectapn/apnid_selected_action", "1", 1);
	
}
function setFocusID(id1, id) {
    var ip = document.getElementById(id1).value;
    /*if(ip>255){
            alert(jQuery.i18n.prop("lIPSettingInvalid"));
            // showAlert(jQuery.i18n.prop("lIPSettingInvalid"));
            document.getElementById(id1).focus();
            document.getElementById(id1).value = " ";
            document.getElementById(id1).focus();
            return;
        }*/
    if (document.getElementById(id1).value.toString().length == "3")
        document.getElementById(id).focus();
}

function deleteProfile(index) {
    document.getElementById("selectpopup").style.display = "none";
    var data = g_objContent.getTableProfilesDataRow(index);
    g_objContent.postItem(data[0], true);
}
function deleteTFTProfile(index, connnum) {
    var data = g_objContent.getTFTTableProfilesDataRow(index, connnum);
    g_objContent.posttftItem(data[0], true, connnum);
}

function TFTProfileClicked(index, connnum) {

    sm("MBTFTBox", 450, 250);
    var data = g_objContent.getTFTTableProfilesDataRow(index, connnum);
    localizeTFTProfile();

    document.getElementById("txttftRulename").value = data[0];
    document.getElementById("txttftRulename").disabled = true;

    document.getElementById("txttftPfindex").value = data[6];
    document.getElementById("txttftEvaindex").value = data[7];
    document.getElementById("txttftProtocolnumber").value = data[9];
    document.getElementById("directiondropdown").value = data[1];

    if (data[17] == 0) {//No IP
        document.getElementById("NoIPRadio").checked = true;
        document.getElementById("IPV4Radio").checked = false;
        document.getElementById("IPV6Radio").checked = false;
        document.getElementById("TFTv4Address").style.display = "none";
        document.getElementById("TFTv6Address").style.display = "none";

    } else if (data[17] == 1) {// IPV4

        document.getElementById("IPV4Radio").checked = true;
        document.getElementById("IPV6Radio").checked = false;
        document.getElementById("NoIPRadio").checked = false;
        document.getElementById("TFTv4Address").style.display = "block";
        document.getElementById("TFTv6Address").style.display = "none";
        if (data[18] == 1) {
            var ipv4 = data[19];
            document.getElementById("txtv4IP1").value = ipv4.split(".")[0];
            document.getElementById("txtv4IP2").value = ipv4.split(".")[1];
            document.getElementById("txtv4IP3").value = ipv4.split(".")[2];
            document.getElementById("txtv4IP4").value = ipv4.split(".")[3];
        }
        if (data[20] == 1) {
            var v4mask = data[21];
            document.getElementById("txtv4Netmask1").value = v4mask.split(".")[0];
            document.getElementById("txtv4Netmask2").value = v4mask.split(".")[1];
            document.getElementById("txtv4Netmask3").value = v4mask.split(".")[2];
            document.getElementById("txtv4Netmask4").value = v4mask.split(".")[3];

        }
    } else if (data[17] == 2) {//IPV6
        document.getElementById("IPV6Radio").checked = true;
        document.getElementById("IPV4Radio").checked = false;
        document.getElementById("NoIPRadio").checked = false;
        document.getElementById("TFTv4Address").style.display = "none";
        document.getElementById("TFTv6Address").style.display = "block";
        var ipv6 = data[19];
        if (data[18] == 1) {
            var ipv6 = data[19];
            document.getElementById("txtv6IP1").value = ipv6.split(":")[0];
            document.getElementById("txtv6IP2").value = ipv6.split(":")[1];
            document.getElementById("txtv6IP3").value = ipv6.split(":")[2];
            document.getElementById("txtv6IP4").value = ipv6.split(":")[3];
            document.getElementById("txtv6IP5").value = ipv6.split(":")[4];
            document.getElementById("txtv6IP6").value = ipv6.split(":")[5];
            document.getElementById("txtv6IP7").value = ipv6.split(":")[6];
            document.getElementById("txtv6IP8").value = ipv6.split(":")[7];
            document.getElementById("txtv6IP9").value = ipv6.split(":")[8];
            document.getElementById("txtv6IP10").value = ipv6.split(":")[9];
            document.getElementById("txtv6IP11").value = ipv6.split(":")[10];
            document.getElementById("txtv6IP12").value = ipv6.split(":")[11];
            document.getElementById("txtv6IP13").value = ipv6.split(":")[12];
            document.getElementById("txtv6IP14").value = ipv6.split(":")[13];
            document.getElementById("txtv6IP15").value = ipv6.split(":")[14];
            document.getElementById("txtv6IP16").value = ipv6.split(":")[15];
        }
        if (data[20] == 1) {
            var v6mask = data[21];
            document.getElementById("txtv6Netmask1").value = v6mask.split(":")[0];
            document.getElementById("txtv6Netmask2").value = v6mask.split(":")[1];
            document.getElementById("txtv6Netmask3").value = v6mask.split(":")[2];
            document.getElementById("txtv6Netmask4").value = v6mask.split(":")[3];
            document.getElementById("txtv6Netmask5").value = v6mask.split(":")[4];
            document.getElementById("txtv6Netmask6").value = v6mask.split(":")[5];
            document.getElementById("txtv6Netmask7").value = v6mask.split(":")[6];
            document.getElementById("txtv6Netmask8").value = v6mask.split(":")[7];
            document.getElementById("txtv6Netmask9").value = v6mask.split(":")[8];
            document.getElementById("txtv6Netmask10").value = v6mask.split(":")[9];
            document.getElementById("txtv6Netmask11").value = v6mask.split(":")[10];
            document.getElementById("txtv6Netmask12").value = v6mask.split(":")[11];
            document.getElementById("txtv6Netmask13").value = v6mask.split(":")[12];
            document.getElementById("txtv6Netmask14").value = v6mask.split(":")[13];
            document.getElementById("txtv6Netmask15").value = v6mask.split(":")[14];
            document.getElementById("txtv6Netmask16").value = v6mask.split(":")[15];
        }
    }
    if (data[2]) {
        document.getElementById("txtLocalPortRange1").value = data[3].split(":")[0];
        document.getElementById("txtLocalPortRange2").value = data[3].split(":")[1];
    }
    if (data[4]) {
        document.getElementById("txtRemotePortRange1").value = data[5].split(":")[0];
        document.getElementById("txtRemotePortRange2").value = data[5].split(":")[1];
    }
    sPDPtftRuleSave(connnum);
}

function micdropdownChanged() {
    g_objContent.clearControlArray();
	var hard_ver = getHardware_Version();
    var linkObj = document.getElementById("micdropdown");
    var value = linkObj.options[linkObj.selectedIndex].value;
    g_objContent.dispalyAllNone();
    clearInterval(_WiFiIntervalID);
    if (cellular_save == 0) {
        g_objContent.clearStatus();
    }

    if (value == "cellular") {
        //document.getElementById("Profiledropdown").innerHTML = "";
        //document.getElementById("lMICI").style.display = "none";
		document.getElementById("linternetcellular").style.display = "none";
$("#divEngineeringModel").hide();
		if (1 == gEngineerModel)
		{
        	$("#divQueryTimeInterval").show();
		}
        document.getElementById("Cellular_div").style.display = "block";
        document.getElementById("connectmode").style.display = "block";
        //document.getElementById("divMtu").style.display = "block";
	document.getElementById("divAutoAPN").style.display = "block";
        g_objContent.loadPDPData(false);
        document.getElementById("workmode").style.display = "block";
        document.getElementById("lWorkMode").innerHTML = jQuery.i18n.prop("lWorkMode");
        network_mode = $(xml).find("NW_mode").text();
        document.getElementById('WorkModeropdown').value = network_mode;
		NetworkModeflag = network_mode;
		pre_NW_mode = network_mode;
		if(hard_ver=="Ver.B"||hard_ver=="Ver.C")
        document.getElementById("preferredLTEType").style.display = "none";//jmm jp changed
        else
		document.getElementById("preferredLTEType").style.display = "none";//jmm jp changed
        document.getElementById("lsetLikeLTEType").innerHTML = jQuery.i18n.prop("lsetLikeLTEType");
        pre_lte_type = $(xml).find("prefer_lte_type").text();
        document.getElementById('setLikeLTETypedropdown').value = pre_lte_type;
        Preferred_LTETypeflag = pre_lte_type;
        if (network_mode == '1') {
            document.getElementById("bootmode").style.display = "block";
            document.getElementById("lBootMode").innerHTML = jQuery.i18n.prop("lBootMode");
            prefer_bootmode = $(xml).find("prefer_mode").text();
            if ("1" == prefer_bootmode || "2" == prefer_bootmode || "7" == prefer_bootmode) {
                document.getElementById('BootModeropdown').value = prefer_bootmode;
            } else {
                document.getElementById('BootModeropdown').value = "1";
            }

            Preferred_NetworkModeflag = prefer_bootmode;
        } else
            document.getElementById("bootmode").style.display = "none";
        if (network_mode == '3') {
			if(hard_ver=="Ver.B"||hard_ver=="Ver.C")
            document.getElementById("bootmode1").style.display = "none";//jmm jp changed
            else
			document.getElementById("bootmode1").style.display = "block";//jmm jp changed
            document.getElementById("lBootMode1").innerHTML = jQuery.i18n.prop("lBootMode1");
            prefer_bootmode1 = $(xml).find("prefer_mode").text();
            if (prefer_bootmode1 != '4')
                prefer_bootmode1 = '3';
            document.getElementById('BootModeropdown1').value = prefer_bootmode1;
            Preferred_NetworkModeflag = prefer_bootmode1;
        } else
            document.getElementById("bootmode").style.display = "none";
        if (network_mode == '4') {
            document.getElementById("bootmode2").style.display = "block";
            document.getElementById("lBootMode2").innerHTML = jQuery.i18n.prop("lBootMode2");
            prefer_bootmode2 = $(xml).find("prefer_mode").text();
            if (prefer_bootmode2 != '6')
                prefer_bootmode2 = '5';
            document.getElementById('BootModeropdown2').value = prefer_bootmode2;
            Preferred_NetworkModeflag = prefer_bootmode2;
        } else
            document.getElementById("bootmode").style.display = "none";
        if (network_mode != '5' && network_mode != '4') {
			if(hard_ver=="Ver.B"||hard_ver=="Ver.C")
            document.getElementById("preferredLTEType").style.display = "none";//jmm jp changed
            else
			document.getElementById("preferredLTEType").style.display = "none";//jmm jp changed
            document.getElementById("lsetLikeLTEType").innerHTML = jQuery.i18n.prop("lsetLikeLTEType");
            pre_lte_type = $(xml).find("prefer_lte_type").text();
            document.getElementById('setLikeLTETypedropdown').value = pre_lte_type;
            Preferred_LTETypeflag = pre_lte_type;
        } else
            document.getElementById("preferredLTEType").style.display = "none";
    } else if (value == "wifi") {
        g_objContent.loadWiFiData(false);
        document.getElementById("btnScanWirelessNw").disabled = true;
    } else if (value == "disabled") {
        g_objContent.loadDisabledData();
        $("#divEngineeringModel").hide();
        $("#divQueryTimeInterval").hide();
        document.getElementById("workmode").style.display = "none";
        document.getElementById("bootmode").style.display = "none";
        document.getElementById("bootmode1").style.display = "none";
        document.getElementById("bootmode2").style.display = "none";
        document.getElementById("preferredLTEType").style.display = "none";
	document.getElementById("divAutoAPN").style.display = "none";
    } else if (value == "manual_network") {
        MannualNetwork();
    }
    g_objContent.copyControlArray();
}
function workmoderopdownChanged() {
    var linkObj = document.getElementById("WorkModeropdown");
    var value = linkObj.options[linkObj.selectedIndex].value;
	var hard_ver = getHardware_Version();
    if (value == '1') {
        document.getElementById("bootmode").style.display = "block";
        document.getElementById("lBootMode").innerHTML = jQuery.i18n.prop("lBootMode");
        prefer_bootmode = $(xml).find("prefer_mode").text();
        if ("1" == prefer_bootmode || "2" == prefer_bootmode || "7" == prefer_bootmode) {
            document.getElementById('BootModeropdown').value = prefer_bootmode;
        } else {
            document.getElementById('BootModeropdown').value = "1";
        }
        Preferred_NetworkModeflag = prefer_bootmode;
    } else {
        document.getElementById("bootmode").style.display = "none";
    }

    if (value == '3') {
		/*if(hard_ver=="Ver.B")
        document.getElementById("bootmode1").style.display = "none";//jmm jp changed
        else*/
		document.getElementById("bootmode1").style.display = "block";//jmm jp changed
        document.getElementById("lBootMode1").innerHTML = jQuery.i18n.prop("lBootMode1");
        prefer_bootmode1 = $(xml).find("prefer_mode").text();
        if (prefer_bootmode1 != '4')
            prefer_bootmode1 = '3';
        document.getElementById('BootModeropdown1').value = prefer_bootmode1;
        Preferred_NetworkModeflag = prefer_bootmode1;
    } else {
        document.getElementById("bootmode1").style.display = "none";
    }

    if (value == '4') {
        document.getElementById("bootmode2").style.display = "block";
        document.getElementById("lBootMode2").innerHTML = jQuery.i18n.prop("lBootMode2");
        prefer_bootmode2 = $(xml).find("prefer_mode").text();
        if (prefer_bootmode2 != '6')
            prefer_bootmode2 = '5';
        document.getElementById('BootModeropdown2').value = prefer_bootmode2;
        Preferred_NetworkModeflag = prefer_bootmode2;
    } else {
        document.getElementById("bootmode2").style.display = "none";
    }

    if (value == '1' || value == '2' || value == '3') {
		if(hard_ver=="Ver.B"||hard_ver=="Ver.C")
        document.getElementById("preferredLTEType").style.display = "none";//jmm jp changed
        else
		document.getElementById("preferredLTEType").style.display = "none";//jmm jp changed
        document.getElementById("lsetLikeLTEType").innerHTML = jQuery.i18n.prop("lsetLikeLTEType");
        pre_lteType = $(xml).find("prefer_lte_type").text();
        document.getElementById('setLikeLTETypedropdown').value = pre_lteType;
        Preferred_LTETypeflag = pre_lteType;
    } else {
        document.getElementById("preferredLTEType").style.display = "none";
    }
}

function MannualNetwork() {
    //sm("MBMannualNetwork",450,250);
    //document.getElementById("h1MannualNetwork").innerHTML = jQuery.i18n.prop("h1MannualNetwork");

    var itemIndex = 0;
    mapData = null;
    mapData = new Array();
    putMapElement_test("RGW/wan/cellular/search_network", 1, itemIndex++);
    putMapElement_test("RGW/wan/proto", "manual_network", itemIndex++);
    if (mapData.length > 0) {
        postXML("wan", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    }
}
function SelectNetworkChanged() {
    g_objContent.clearControlArray();
    var value = linkObj.options[linkObj.selectedIndex].value;
    g_objContent.dispalyAllNone();
    var itemIndex = 0;
    mapData = null;
    mapData = new Array();
    putMapElement_test("RGW/wan/cellular/network_param", value, itemIndex++);
    if (mapData.length > 0) {
        postXML("wan", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));

    }
}
function AddtoProfileList() {
    document.getElementById("selectpopup").style.display = "none";
    sm("MBAddNewProfile", 450, 250);
    document.getElementById("txtProfilename").focus();
    localizeMBAddNewProfile();
    document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
    buttonLocaliztion(document.getElementById("btnOk").id);
    document.getElementById("dropdown_auto").innerHTML = jQuery.i18n.prop("dropdown_auto");
    document.getElementById("dropdown_manual").innerHTML = jQuery.i18n.prop("dropdown_manual");
    document.getElementById("h1AddNewProfile").innerHTML = jQuery.i18n.prop("h1AddNewProfile");
}
function btnCancelMannualNetwork() {
    hm();
}
function btnCancelClickedProfile() {
    hm();
  //  document.getElementById("selectpopup").style.display = "block";
    // document.getElementById("selectpopup").style.display = "block";
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
function ShowASettings() {
    if (document.getElementById("chkAdvanced").checked)
        document.getElementById("AdvancedSettings").style.display = "block";
    else
        document.getElementById("AdvancedSettings").style.display = "none";
}
function localizePDPProfile() {
    localizeMBAddNewProfile();
    document.getElementById("h1Popup_PDP").innerHTML = jQuery.i18n.prop("h1Popup_PDP");
    document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
    buttonLocaliztion(document.getElementById("btnOK_PDP").id);
}
function localizeTFTProfile() {
    localizeMBAddNewProfile();
    document.getElementById("h1AddTFTRule").innerHTML = jQuery.i18n.prop("h1AddTFTRule");
    document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
    buttonLocaliztion(document.getElementById("btnAddTFTRule").id);
}

function btnOKPDPSetting() {
    //var Rulename = document.getElementById("txtRulename").value;
    var Rulename = gRulename;
    var APNname = document.getElementById("txtAPNname").value;
//wk-s
    //var LteApnName = document.getElementById("txtLteAPNname").value;
    var LteApnName = document.getElementById("txtAPNname").value;
//end
    var IPType = document.getElementById("lIPTypedropdown").value;
    //var QosEnable = document.getElementById("1QOSEnablechk").value;
    var QCI;
    var ConnNum = document.getElementById("txtconnnum").value;
    var pConnNum = document.getElementById("txtpconnnum").value;
    var IsSecondary = document.getElementById("txtsecondary").value;
    var IsDefault = document.getElementById("txtdefault").value;
    var Enable = document.getElementById("txtenable").value;

    var txt2G3GAuthType = $("#Sel2G3GAuthType").val();
    var txt2G3GUserName = $("#txt2G3GUser").val();
    var txt2G3GPasswd = $("#txt2G3GPassword").val();
    if ("NONE" == txt2G3GAuthType) {
        txt2G3GUserName = "NULL";
        txt2G3GPasswd = "NULL";
    }
//wk-s
	var strUserName = $.trim(txt2G3GUserName);
	if(strUserName == "")
		txt2G3GUserName = "NULL";
	var strPasswd = $.trim(txt2G3GPasswd);
	if(strPasswd == "")
		txt2G3GPasswd = "NULL";

    //var txt4GAuthType = $("#Sel4GAuthType").val();
    //var txt4GUserName = $("#txt4GUser").val();
    //var txt4GPasswd = $("#txt4GPassword").val();
    var txt4GAuthType = txt2G3GAuthType;
    var txt4GUserName = txt2G3GUserName;
    var txt4GPasswd = txt2G3GPasswd;
//end
    if ("NONE" == txt4GAuthType) {
        txt4GPasswd = "NULL";
        txt4GUserName = "NULL";
    }


    var HasTFT = 0;
    var isDeleted = 0;
    if (document.getElementById("1QOSEnablechk").checked) {
        QCI = document.getElementById("txtQOSQCI").value;
        var regEx = /^[1-9]\d*$/; ///正整数
        if (!regEx.test(QCI)) {
            $("#qciCheckError").show();
            $("#qciCheckError").text(jQuery.i18n.prop("lQciCheckError"));
            return;
        }
    } else {
        QCI = 0;
    }

    if (("NONE" == txt2G3GAuthType && isChineseChar(txt2G3GUserName)) || ("NONE" == txt4GAuthType && isChineseChar(txt4GUserName))) {
        document.getElementById("lErrorLogs").style.display = "block";
        document.getElementById("lErrorLogs").innerHTML = jQuery.i18n.prop("APN_AHTU_USER_NAME_INVALIDEATE");
        return;
    }

//wk-s
	var strApn = $.trim(APNname);
	if(strApn == "")
		APNname = "NULL";
//end

    var errorString = validatePDP(Rulename, APNname, LteApnName,txt2G3GUserName,txt2G3GPasswd);
    if (errorString == "OK") {
        hm();
        g_objContent.postItem(isDeleted, Rulename, Enable, APNname, LteApnName, IPType, ConnNum, pConnNum, IsSecondary, IsDefault, QCI, HasTFT, txt2G3GAuthType, txt2G3GUserName, txt2G3GPasswd,txt4GAuthType, txt4GUserName, txt4GPasswd);
    } else {
        document.getElementById("lErrorLogs").style.display = "block";
        document.getElementById("lErrorLogs").innerHTML = jQuery.i18n.prop(errorString);
    }
}
function btnOKClickedProfile() {
    var Profilename = document.getElementById("txtProfilename").value;
    var APNname = document.getElementById("txtAPNname").value;
//wk-s
    //var LteAPNname = document.getElementById("txtLteAPNname").value;
    var LteAPNname = document.getElementById("txtAPNname").value;
//end
    var Username = document.getElementById("txtUsername").value;
    var Password = document.getElementById("txtPassword").value;
    var AccessNumber = document.getElementById("txtAccessNumber").value;
    var ConnMode = document.getElementById("Cconndropdown").value;
    var Idle = "600";
    var idle = document.getElementById("txtIdle").value;

    var errorString = validate(Profilename, APNname, Username, Password, AccessNumber, ConnMode, Idle);
    if (errorString == "OK") {
        hm();
        g_objContent.postItem(Profilename, false, APNname, LteAPNname,Username, Password, AccessNumber, ConnMode, Idle);
    } else {
        document.getElementById("lErrorLogs").style.display = "block";
        document.getElementById("lErrorLogs").innerHTML = jQuery.i18n.prop(errorString);
    }
}
function check2Change() {
    if (document.getElementById("check1").checked)
        document.getElementById("localeDiv").style.display = "block";
    else
        document.getElementById("localeDiv").style.display = "none";
}
function check1Change() {
    if (document.getElementById("check2").checked)
        document.getElementById("customeDNS").style.display = "block";
    else
        document.getElementById("customeDNS").style.display = "none";
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
//jmm add apn_selected_mode
function APNSelectedListChanged(){
	$("#edit_apn_list").hide();
	$("#lErrorLogs").html(jQuery.i18n.prop("llAPNSelectedListchecking"));
	$("#lErrorLogs").show();
	var apnid_selected = $("#SAPNSelectedList").val();
	mapData = new Array();
    putMapElement_test("RGW/selectapn/apnid_selected", apnid_selected, 0);
	//putMapElement_test("RGW/selectapn/apnid_selected_action", "1", 1);
	postAPNXML('apnlist',g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
	
}

function APNSelectedMethodChanged(){
	var vAPNSelectedMethod = $("#SAPNSelectedMethod").val();
	if (vAPNSelectedMethod == 1){//auto select
			//$("#divIpType").hide();
			APNSelectedListChanged();
			$("#autoselectapn").show();
			$("#edit_apn_list").hide();
			$("#txtAPNname").attr("disabled",true);
			//$("#lIPTypedropdown").attr("disabled",true);
			//$("#Sel2G3GAuthType").attr("disabled",false);
			$("#txt2G3GUser").attr("disabled",true);
			$("#txt2G3GPassword").attr("disabled",true);
			/*var apnid_selected_data = $(xml).find("apnid_selected_data").text();
			var array_tmp = apnid_selected_data.split('%');
			var capn_list = $(xml).find("apn_list_name").text();
			var arrayapnlist = 	capn_list.split(",");
			if($("#SAPNSelectedList").val != "0" || arrayapnlist.length == 2){
				$("#txtAPNname").val(array_tmp[1]);
				if(array_tmp[2] == "0"){
					$("#lErrorLogs").hide();
					$("#Sel2G3GAuthType").val("NONE");
					//$("#divIpType").hide();
					$("#div2G3GAuthEnabled").hide();
					$("#edit_apn_list").show();
					$("#Sel2G3GAuthTypeNONE").show();
				}else if(array_tmp[2] == "1"){
					$("#lErrorLogs").hide();
					$("#Sel2G3GAuthType").val("PAP");
					$("#div2G3GAuthEnabled").show();
					$("#edit_apn_list").show();
					//$("#divIpType").hide();
					$("#txt2G3GUser").val(array_tmp[3]);
					$("#txt2G3GPassword").val(array_tmp[4]);
					$("#Sel2G3GAuthTypeNONE").hide();
				}else if(array_tmp[2] == "2"){
					$("#lErrorLogs").hide();
					$("#Sel2G3GAuthType").val("CHAP");
					$("#div2G3GAuthEnabled").show();
					$("#edit_apn_list").show();
					//$("#divIpType").hide();
					$("#txt2G3GUser").val(array_tmp[3]);
					$("#txt2G3GPassword").val(array_tmp[4]);
					$("#Sel2G3GAuthTypeNONE").hide();
				}
			}*/
			
		}else{
			//$("#divIpType").show();
			$("#Sel2G3GAuthTypeNONE").show();
			$("#autoselectapn").hide();
			$("#edit_apn_list").show();
			$("#txtAPNname").attr("disabled",false);
			//$("#lIPTypedropdown").attr("disabled",false);
			//$("#Sel2G3GAuthType").attr("disabled",false);
			$("#txt2G3GUser").attr("disabled",false);
			$("#txt2G3GPassword").attr("disabled",false);
		}
}
//jmm add apn_selected_mode end
function BgScanTimeDropdown() {
    var linkObj = document.getElementById("BgScanTimedropdown");
    var value = linkObj.options[linkObj.selectedIndex].value;

    document.getElementById("CIdle").style.display = "none";
}
function conndropdownChanged() {
    var linkObj = document.getElementById("Cconndropdown");
    var value = linkObj.options[linkObj.selectedIndex].value;

}
function validatePDP(Rulename, APNname,LteApnName) {
    if (Rulename == "")
        return "EMPTY_RULE_NAME";
    if (APNname == "" || LteApnName == "")
        return "EMPTY_APN_NAME";
    if (!deviceNameValidation(Rulename))
        return "SPECIAL_CHARS_ARE_NOT_ALLOWED";
    if (!validateApnName(APNname) || !validateApnName(LteApnName))
        return "APN_NAME_INVALIDEATE";

    return "OK";
}

function validateApnName(APNname) {
    if (isChineseChar(APNname)) {
        return false;
    }

    if (APNname.toString().indexOf("%") != -1)
        return false;
    else if (APNname.toString().indexOf("^") != -1)
        return false;
    else if (APNname.toString().indexOf(";") != -1)
        return false;

    return true;
}

function validateTFT(Rulename, RemoteIP, IPType, LocalPort, RemotePort, LocalPortFlag, RemotePortFlag, pfindex, evaluation_index, protocol_number,protocol_number_flag,netmask,netmask_flag) {
    var flag = 0;
    if (Rulename == "") {
        flag = 1;
        return flag;
    }

    if (!deviceNameValidation(Rulename)) {
        flag = 2;
        return flag;
    }

    if (parseInt(pfindex) < 1 || parseInt(pfindex) > 8 || !isNumber(pfindex)) {
        return 6;
    }
    if (parseInt(evaluation_index) > 255 || parseInt(evaluation_index) < 0 || !isNumber(evaluation_index)) {
        return 7;
    }

    if(0 != protocol_number_flag) {
        if (parseInt(protocol_number) > 255 || parseInt(protocol_number) < 0 || !isNumber(protocol_number)) {
            return 8;
        }
    }


    if (IPType == 1) { //ipv4
        if (!isIPFULL(RemoteIP, true)) {
                return 5;
        }
        if(!isIPv4(netmask)){
            return 9;
        }
    }

     if (IPType == 2) { //ipv6
        if (!isIPv6(RemoteIP)) {
                return 5;
        }
        if (!isIPv6(netmask)) {
                return 9;
        }
    }


    if (LocalPortFlag != 0) {
        if (LocalPort != ":") {
            var LocalPort1 = LocalPort.split(":")[0];
            var LocalPort2 = LocalPort.split(":")[1];
            if (!(isNumber(LocalPort1) && isNumber(LocalPort2)))
                flag = 3;
            if (Number(LocalPort1) > 65535 || Number(LocalPort1) < 1)
                flag = 3;
            if (Number(LocalPort2) > 65535 || Number(LocalPort2) < 1)
                flag = 3;
            if (Number(LocalPort1) > Number(LocalPort2))
                flag = 3;
        }
    }
    if (RemotePortFlag != 0) {
        if (RemotePort != ":") {
            var RemotePort1 = RemotePort.split(":")[0];
            var RemotePort2 = RemotePort.split(":")[1];
            if (!(isNumber(RemotePort1) && isNumber(RemotePort2)))
                flag = 4;
            if (Number(RemotePort1) > 65535 || Number(RemotePort1) < 1)
                flag = 4;
            if (Number(RemotePort2) > 65535 || Number(RemotePort2) < 1)
                flag = 4;
            if (Number(RemotePort1) > Number(RemotePort2))
                flag = 4;
        }
    }
    return flag;
}
function validatePSKPassword() {
    if (document.getElementById('tbpsk').value != document.getElementById('tbre_psk').value) {
        document.getElementById('lPSKErrorMesPN').style.display = 'block';
        document.getElementById('lPSKErrorMesPN').innerHTML = jQuery.i18n.prop('lPassErrorMes');
        document.getElementById("tbpsk").value = '';
        document.getElementById("tbre_psk").value = '';
        return false;
    } else if (!(textBoxMinLength("tbpsk", 8) && textBoxMinLength("tbre_psk", 8))) {
        document.getElementById('lPSKErrorMesPN').style.display = 'block';
        document.getElementById('lPSKErrorMesPN').innerHTML = jQuery.i18n.prop('lminLengthError8');
        return false;
    } else if (!(textBoxMaxLength("tbpsk", 64) && textBoxMaxLength("tbre_psk", 64))) {
        document.getElementById('lPSKErrorMesPN').style.display = 'block';
        document.getElementById('lPSKErrorMesPN').innerHTML = jQuery.i18n.prop('lmaxLengthError64');
        return false;
    } else {
        document.getElementById('lPSKErrorMesPN').style.display = 'none';
    }
    return true;
}
function clearError() {
    document.getElementById('lPSKErrorMesPN').innerHTML = "";
    document.getElementById('lPSKErrorMesPN').style.display = 'none';
}
function CancelS(d) {
    hm(d);
    _WiFiIntervalID = setInterval("g_objContent.onLoad(false)", _WiFiInterval);
}
function btnConnectSelected() {
    g_objContent.clearStatus();
    _WiFiIntervalSelectID = setInterval("g_objContent.onLoad(false)", _WiFiInterval);
    g_objContent.Connect();
}
function btnConnectPSKSelected() {
    if (validatePSKPassword()) {
        g_objContent.clearStatus();
        _WiFiIntervalSelectID = setInterval("g_objContent.onLoad(false)", _WiFiInterval);
        g_objContent.Connect();
    }
}
function ScanWirelessNws() {
    g_objContent._ScanWirelessNws();
}
function showConnectAlert(message) {
    clearInterval(_WiFiIntervalSelectID);
    clearInterval(_WiFiIntervalID);

    buttonLocaliztion("btnConnectW");
    document.getElementById("btnCancel1").innerHTML = jQuery.i18n.prop("btnModalCancle");
    document.getElementById("lConfirmMessage1").innerHTML = message;
    document.getElementById("lConnect1").innerHTML = jQuery.i18n.prop("lConnect");
    sm("ConfirmMB", 350, 150);
}
function showPSKAlert(message) {
    clearInterval(_WiFiIntervalSelectID);
    clearInterval(_WiFiIntervalID);
    buttonLocaliztion("btnConnectWP");
    document.getElementById("btnCancel2").innerHTML = jQuery.i18n.prop("btnModalCancle");
    // document.getElementById("lConfirmMessage2").innerHTML = message;
    document.getElementById("lConnect2").innerHTML = jQuery.i18n.prop("lConnect");
    document.getElementById("lpsk").innerHTML = jQuery.i18n.prop("lpsk");
    document.getElementById("lRetypepsk").innerHTML = jQuery.i18n.prop("lRetypepsk");

    sm("PSKMB", 350, 180);
}

function preset_webportal() {

    sm("MBConfigure", 200, 100);
    document.getElementById("h1Configure").innerHTML = jQuery.i18n.prop("h1Configure");
}

function btnCancelConfigure() {
    hm();
}
function bootmoderopdownChanged() {
	$("#l2preferredmo").show();
}
function btnOKConfigure() {
    var Username = document.getElementById("txtWUsername").value;
    var Password = document.getElementById("txtWPassword").value;

    var itemIndex = 0;
    mapData = null;
    mapData = new Array();
    putMapElement_test("RGW/wan/username_webportal", Username, itemIndex++);
    putMapElement_test("RGW/wan/password_webportal", Password, itemIndex++);
    if (mapData.length > 0) {
        postXML("wan", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    }
}

function putMapElement_test(xpath, value, index) {
    mapData[index] = new Array(2);
    mapData[index][0] = xpath;
    mapData[index][1] = value;
}

function pPDPdefChange() {

    if (document.getElementById("pPDPdef_chk").checked)
        $("#s_PDP_default :input").prop('disabled', false);
    else {
        $("#s_PDP_default :input").prop('disabled', true);
        $("#s_PDP_default :input").prop('checked', false);
    }
}

function pPDPdedChange() {
    if (document.getElementById("pPDPded_chk").checked) {
        $("#s1_PDP_dedicated :input").prop('disabled', false);
        $("#s2_PDP_dedicated :input").prop('disabled', false);
        $("#s3_PDP_dedicated :input").prop('disabled', false);
    } else {
        $("#s1_PDP_dedicated :input").prop('disabled', true);
        $("#s2_PDP_dedicated :input").prop('disabled', true);
        $("#s3_PDP_dedicated :input").prop('disabled', true);
    }
}

function pPDPdefClick() {
    var connnum = 1;
    var pconnum = 1;
    var is_secondary = 1;
    var is_default = 1;
    sm("Popup_PDP", 400, 150);
    localizePDPProfile();
    $("#divApnNmae").show();
    $("#divIpType").show();
    document.getElementById("txtconnnum").value = connnum;
    document.getElementById("txtpconnnum").value = pconnum;
    document.getElementById("txtsecondary").value = is_secondary;
    document.getElementById("txtdefault").value = is_default;
    g_objContent.loadPDPDataToBox(0);
    if (document.getElementById("pPDPdef_chk").checked)
        document.getElementById("txtenable").value = 1;
    else
        document.getElementById("txtenable").value = 0;
    g_objContent.loadPDPDataToBox(0);
}
function sPDPdefClick() {
    var connnum = 2;
    var pconnum = 1;
    var is_secondary = 0;
    var is_default = 1;
    sm("Popup_PDP", 400, 150);
    localizePDPProfile();
    $("#divApnNmae").hide();
    $("#divIpType").hide();
    document.getElementById("txtconnnum").value = connnum;
    document.getElementById("txtpconnnum").value = pconnum;
    document.getElementById("txtsecondary").value = is_secondary;
    document.getElementById("txtdefault").value = is_default;
    g_objContent.loadPDPDataToBox(1);
    if (document.getElementById("sPDPdef_chk").checked)
        document.getElementById("txtenable").value = 1;
    else
        document.getElementById("txtenable").value = 0;

}
function pPDPdedClick() {
    var connnum = 3;
    var pconnum = "NA";
    var is_secondary = 1;
    var is_default = 0;
    sm("Popup_PDP", 400, 200);
    localizePDPProfile();
    $("#divApnNmae").show();
    $("#divIpType").show();
    document.getElementById("txtconnnum").value = connnum;
    document.getElementById("txtpconnnum").value = pconnum;
    document.getElementById("txtsecondary").value = is_secondary;
    document.getElementById("txtdefault").value = is_default;
    g_objContent.loadPDPDataToBox(2);
    if (document.getElementById("pPDPded_chk").checked)
        document.getElementById("txtenable").value = 1;
    else
        document.getElementById("txtenable").value = 0;
}
function s1PDPdedClick() {
    var connnum = 4;
    var pconnum = 3;
    var is_secondary = 0;
    var is_default = 0;
    sm("Popup_PDP", 400, 200);
    localizePDPProfile();
    $("#divApnNmae").show();
    $("#divIpType").show();
    document.getElementById("txtconnnum").value = connnum;
    document.getElementById("txtpconnnum").value = pconnum;
    document.getElementById("txtsecondary").value = is_secondary;
    document.getElementById("txtdefault").value = is_default;
    g_objContent.loadPDPDataToBox(3);
    if (document.getElementById("s1PDPded_chk").checked)
        document.getElementById("txtenable").value = 1;
    else
        document.getElementById("txtenable").value = 0;
}
function s2PDPdedClick() {
    var connnum = 5;
    var pconnum = 3;
    var is_secondary = 0;
    var is_default = 0;
    sm("Popup_PDP", 400, 200);
    localizePDPProfile();
    $("#divApnNmae").show();
    $("#divIpType").show();
    document.getElementById("txtconnnum").value = connnum;
    document.getElementById("txtpconnnum").value = pconnum;
    document.getElementById("txtsecondary").value = is_secondary;
    document.getElementById("txtdefault").value = is_default;
    g_objContent.loadPDPDataToBox(4);
    if (document.getElementById("s2PDPded_chk").checked)
        document.getElementById("txtenable").value = 1;
    else
        document.getElementById("txtenable").value = 0;
}
function s3PDPdedClick() {
    var connnum = 6;
    var pconnum = 3;
    var is_secondary = 0;
    var is_default = 0;
    sm("Popup_PDP", 400, 200);
    localizePDPProfile();
    $("#divApnNmae").show();
    $("#divIpType").show();
    document.getElementById("txtconnnum").value = connnum;
    document.getElementById("txtpconnnum").value = pconnum;
    document.getElementById("txtsecondary").value = is_secondary;
    document.getElementById("txtdefault").value = is_default;
    g_objContent.loadPDPDataToBox(5);
    if (document.getElementById("s3PDPded_chk").checked)
        document.getElementById("txtenable").value = 1;
    else
        document.getElementById("txtenable").value = 0;
    g_objContent.loadPDPDataToBox(5);
}
function PDPColorChange(lableid) {
    var BackgroundNormalColor = "#FF0000";
    document.getElementById(lableid).style.color = BackgroundNormalColor;
    document.getElementById(lableid).style.cursor = "pointer";

}
function PDPColorRestore(lableid) {
    var BackgroundMouseoverColor = "#000000";
    document.getElementById(lableid).style.color = BackgroundMouseoverColor;
    document.getElementById(lableid).style.cursor = "default";
}

function btnCancel() {
    hm();
}
function QOSEnbaleChange() {
    if (document.getElementById("1QOSEnablechk").checked)
        document.getElementById("lQOSEngine").style.display = "block";
    else
        document.getElementById("lQOSEngine").style.display = "none";

    $("#qciCheckError").hide();
}





function btnCancelTFTBox() {
    hm();
}
function showTFTTableBox() {
    hm();
    sm("MBTFTBox", 500, 300);
    localizeTFTProfile();
}

function AddNewTFT(conn_num) {
    showTFTTableBox();
    sPDPtftRuleSave(conn_num);
    $("#txttftPfindex,#txttftEvaindex,#txttftProtocolnumber,#txttftRulename,#txtLocalPortRange1,#txtLocalPortRange2,#txtRemotePortRange1,#txtRemotePortRange2").focus(function() {
        $("#lTFTRuleError").hide();
    });
}
function sPDPtftClick(connnum) {
    $('#btnwrpAddTFT').empty();
    $('#btnwrpAddTFT').append("<input id=\"btnAddNewTFTRule\" type=\"button\" value=\"Add\" onclick=\"AddNewTFT(" + connnum + ")\"/>");
    //    document.getElementById("btnAddNewTFTRule").innerHTML = jQuery.i18n.prop("btnAddNewTFTRule");
    $("#btnAddNewTFTRule").val(jQuery.i18n.prop("btnAddNewTFTRule"));
    sm("Popup_TFT", 700, 150);
    g_objContent.loadTFTTable(connnum);
}
function s1PDPtftClick() {
    $('#btnwrpAddTFT').empty();
    $('#btnwrpAddTFT').append("<input id=\"btnAddNewTFTRule\" type=\"button\" value=\"Add\" onclick=\"AddNewTFT(4)\"/>");
    $("#btnAddNewTFTRule").val(jQuery.i18n.prop("btnAddNewTFTRule"));

    sm("Popup_TFT", 700, 200);
    g_objContent.loadTFTTable(4);
}
function s2PDPtftClick() {
    $('#btnwrpAddTFT').empty();
    $('#btnwrpAddTFT').append("<input id=\"btnAddNewTFTRule\" type=\"button\" value=\"Add\" onclick=\"AddNewTFT(5)\"/>");
    $("#btnAddNewTFTRule").val(jQuery.i18n.prop("btnAddNewTFTRule"));

    sm("Popup_TFT", 700, 200);
    g_objContent.loadTFTTable(5);
}
function s3PDPtftClick() {
    $('#btnwrpAddTFT').empty();
    $('#btnwrpAddTFT').append("<input id=\"btnAddNewTFTRule\" type=\"button\" value=\"Add\" onclick=\"AddNewTFT(6)\"/>");
    $("#btnAddNewTFTRule").val(jQuery.i18n.prop("btnAddNewTFTRule"));
    sm("Popup_TFT", 700, 200);
    g_objContent.loadTFTTable(6);
}

function sPDPtftRuleSave(connnum) {
    $('#SaveTFTRuleSpan').empty();
    $('#SaveTFTRuleSpan').append("<input id=\"btnAddTFTRule\" type=\"button\" value=\"Add\" onclick=\"btnSaveTFTRule(" + connnum + ")\"/>");
    $("#btnAddTFTRule").val(jQuery.i18n.prop("btnAddTFTRule"));
}
function s1PDPtftRuleSave() {
    $('#SaveTFTRuleSpan').empty();
    $('#SaveTFTRuleSpan').append("<input id=\"btnAddTFTRule\" type=\"button\" value=\"Add\" onclick=\"btnSaveTFTRule(4)\"/>");
    $("#btnAddTFTRule").val(jQuery.i18n.prop("btnAddTFTRule"));
}
function s2PDPtftRuleSave() {
    $('#SaveTFTRuleSpan').empty();
    $('#SaveTFTRuleSpan').append("<input id=\"btnAddTFTRule\" type=\"button\" value=\"Add\" onclick=\"btnSaveTFTRule(5)\"/>");
    $("#btnAddTFTRule").val(jQuery.i18n.prop("btnAddTFTRule"));
}
function s3PDPtftRuleSave() {
    $('#SaveTFTRuleSpan').empty();
    $('#SaveTFTRuleSpan').append("<input id=\"btnAddTFTRule\" type=\"button\" value=\"Add\" onclick=\"btnSaveTFTRule(6)\"/>");
    $("#btnAddTFTRule").val(jQuery.i18n.prop("btnAddTFTRule"));
}

function IPV4RadioChange() {
    if (document.getElementById("IPV4Radio").checked) {
        document.getElementById("TFTv6Address").style.display = "none";
        document.getElementById("TFTv4Address").style.display = "block";
    }
}
function IPV6RadioChange() {
    if (document.getElementById("IPV6Radio").checked) {
        document.getElementById("TFTv4Address").style.display = "none";
        document.getElementById("TFTv6Address").style.display = "block";
    }
}
function NoIPChange() {
    if (document.getElementById("NoIPRadio").checked) {
        document.getElementById("TFTv4Address").style.display = "none";
        document.getElementById("TFTv6Address").style.display = "none";
    }
}
function btnSaveTFTRule(Connnum) {

    var remote_ip;
    var IPType;
    var local_port;
    var remote_port;
    var Rulename = document.getElementById("txttftRulename").value;
    var HasTFT = 1;
    var isDeleted = 0;
    var localport_flag = 1;
    var remoteport_flag = 1;
    var isDeleted = 0;
    var pfindex = 0;
    var evaluation_index = 0;
    var protocol_number_flag = 1;
    var protocol_number = 0;
    var direction = 0;
    var netmask_flag = 1;
    var netmask;
    var netmask1, netmask2, netmask3, netmask4;
    var netmask5, netmask6, netmask7, netmask8;
    var netmask9, netmask10, netmask11, netmask12;
    var netmask13, netmask14, netmask15, netmask16;
    var linkObj = document.getElementById("directiondropdown");
    var value = linkObj.options[linkObj.selectedIndex].value;

    direction = value;
    if (document.getElementById("IPV6Radio").checked) {
        IPType = 2;
        remote_ip = document.getElementById("txtv6IP1").value + ":" +
                    document.getElementById("txtv6IP2").value + ":" +
                    document.getElementById("txtv6IP3").value + ":" +
                    document.getElementById("txtv6IP4").value + ":" +
                    document.getElementById("txtv6IP5").value + ":" +
                    document.getElementById("txtv6IP6").value + ":" +
                    document.getElementById("txtv6IP7").value + ":" +
                    document.getElementById("txtv6IP8").value + ":" +
                    document.getElementById("txtv6IP9").value + ":" +
                    document.getElementById("txtv6IP10").value + ":" +
                    document.getElementById("txtv6IP11").value + ":" +
                    document.getElementById("txtv6IP12").value + ":" +
                    document.getElementById("txtv6IP13").value + ":" +
                    document.getElementById("txtv6IP14").value + ":" +
                    document.getElementById("txtv6IP15").value + ":" +
                    document.getElementById("txtv6IP16").value;


        var netmask1 = document.getElementById("txtv6Netmask1").value;
        var netmask2 = document.getElementById("txtv6Netmask2").value;
        var netmask3 = document.getElementById("txtv6Netmask3").value;
        var netmask4 = document.getElementById("txtv6Netmask4").value;
        var netmask5 = document.getElementById("txtv6Netmask5").value;
        var netmask6 = document.getElementById("txtv6Netmask6").value;
        var netmask7 = document.getElementById("txtv6Netmask7").value;
        var netmask8 = document.getElementById("txtv6Netmask8").value;
        var netmask9 = document.getElementById("txtv6Netmask9").value;
        var netmask10 = document.getElementById("txtv6Netmask10").value;
        var netmask11 = document.getElementById("txtv6Netmask11").value;
        var netmask12 = document.getElementById("txtv6Netmask12").value;
        var netmask13 = document.getElementById("txtv6Netmask13").value;
        var netmask14 = document.getElementById("txtv6Netmask14").value;
        var netmask15 = document.getElementById("txtv6Netmask15").value;
        var netmask16 = document.getElementById("txtv6Netmask16").value;
        if ((netmask1 == "") || (netmask2 == "") || (netmask3 == "") || (netmask4 == "") ||
            (netmask5 == "") || (netmask6 == "") || (netmask7 == "") || (netmask8 == "") ||
            (netmask9 == "") || (netmask10 == "") || (netmask11 == "") || (netmask12 == "") ||
            (netmask13 == "") || (netmask14 == "") || (netmask15 == "") || (netmask16 == "")) {
            netmask_flag = 0;
            netmask = "0";
        }

        else {
            netmask = netmask1 + ":" +
                      netmask2 + ":" +
                      netmask3 + ":" +
                      netmask4 + ":" +
                      netmask5 + ":" +
                      netmask6 + ":" +
                      netmask7 + ":" +
                      netmask8 + ":" +
                      netmask9 + ":" +
                      netmask10 + ":" +
                      netmask11 + ":" +
                      netmask12 + ":" +
                      netmask13 + ":" +
                      netmask14 + ":" +
                      netmask15 + ":" +
                      netmask16;
        }



        var local_port2 = document.getElementById("txtLocalPortRange2").value;
        if ((local_port1 == "") || (local_port2 == "")) {
            localport_flag = 0;
            local_port1 = "0";
            local_port2 = "0";
        }

    } else if (document.getElementById("IPV4Radio").checked) {
        IPType = 1;
        remote_ip = document.getElementById("txtv4IP1").value + "." +
                    document.getElementById("txtv4IP2").value + "." +
                    document.getElementById("txtv4IP3").value + "." +
                    document.getElementById("txtv4IP4").value;
        netmask1 = document.getElementById("txtv4Netmask1").value;
        netmask2 = document.getElementById("txtv4Netmask2").value;
        netmask3 = document.getElementById("txtv4Netmask3").value;
        netmask4 = document.getElementById("txtv4Netmask4").value;
        if ((netmask1 == "") || (netmask2 == "") || (netmask3 == "") || (netmask4 == "")) {
            netmask_flag = 0;
            netmask = "0";
        } else {
            netmask = netmask1 + "." +
                      netmask2 + "." +
                      netmask3 + "." +
                      netmask4;
        }
    } else if (document.getElementById("NoIPRadio").checked) {
        IPType = 0;
        netmask_flag = 0
                       remote_ip = "0.0.0.0";
        netmask = "0";
    }
    var local_port1 = document.getElementById("txtLocalPortRange1").value;
    var local_port2 = document.getElementById("txtLocalPortRange2").value;
    if ((local_port1 == "") || (local_port2 == "")) {
        localport_flag = 0;
        local_port1 = "0";
        local_port2 ="0";
    }

    var remote_port1 = document.getElementById("txtRemotePortRange1").value;
    var remote_port2 = document.getElementById("txtRemotePortRange2").value;
    if ((remote_port1 == "") || (remote_port2 == "")) {
        remoteport_flag = 0;
        remote_port1 = "0";
        remote_port2 = "0";
    }

    local_port = local_port1 + ":" + local_port2;

    remote_port = remote_port1 + ":" + remote_port2;

    pfindex = document.getElementById("txttftPfindex").value;
    if (pfindex == "") {
        pfindex = 1;
    }


    evaluation_index = document.getElementById("txttftEvaindex").value;
    if (evaluation_index == "") {
        evaluation_index = 0;
    }


    protocol_number = document.getElementById("txttftProtocolnumber").value;
    if (protocol_number == "") {
        protocol_number_flag = 0;
        protocol_number = "0";
    }


    var errorflag = validateTFT(Rulename, remote_ip, IPType, local_port, remote_port, localport_flag, remoteport_flag, pfindex, evaluation_index, protocol_number,protocol_number_flag,netmask,netmask_flag);
    document.getElementById("lTFTRuleError").style.display = "block";
    if (errorflag == 0) {
        hm();
        document.getElementById("lTFTRuleError").style.display = "none";
        g_objContent.posttftItem(Rulename, isDeleted, Connnum, remote_ip, IPType, local_port, remote_port, localport_flag, remoteport_flag, netmask_flag, netmask, pfindex, evaluation_index, protocol_number_flag, protocol_number, direction);
    } else if (errorflag == 1) {
        document.getElementById("lTFTRuleError").innerHTML = jQuery.i18n.prop("lemptyTFTname");
    } else if (errorflag == 2) {
        document.getElementById("lTFTRuleError").innerHTML = jQuery.i18n.prop("lspecialTFTname");
    } else if (errorflag == 3) {
        document.getElementById("lTFTRuleError").innerHTML = jQuery.i18n.prop("lLocalPortInvalid");
    } else if (errorflag == 4) {
        document.getElementById("lTFTRuleError").innerHTML = jQuery.i18n.prop("lRemotePortInvalid");
    } else if (errorflag == 5) {
        document.getElementById("lTFTRuleError").innerHTML = jQuery.i18n.prop("lIncorrectIPAddress");
    } else if (errorflag == 6) {
        document.getElementById("lTFTRuleError").innerHTML = jQuery.i18n.prop("lDataPacketFilterIdError");
    } else if (errorflag == 7) {
        document.getElementById("lTFTRuleError").innerHTML = jQuery.i18n.prop("lAssessPrioritiesError");
    } else if (errorflag == 8) {
        document.getElementById("lTFTRuleError").innerHTML = jQuery.i18n.prop("lProtocolNumError");
    } else if (errorflag == 9) {
        document.getElementById("lTFTRuleError").innerHTML = jQuery.i18n.prop("lsubsetMaskError");
    }
}

function LteAuthTypeChanged() {
    if ("NONE" == $("#Sel4GAuthType").val()) {
        $("#div4GAuthEnabled").hide();
    } else {
//wk-s
        //$("#div4GAuthEnabled").show();
	$("#div4GAuthEnabled").hide();
//end
    }
}

function f2G3GAuthTypeChanged() {
    if ("NONE" == $("#Sel2G3GAuthType").val()) {
        $("#div2G3GAuthEnabled").hide();
    } else {
        $("#div2G3GAuthEnabled").show();
    }
}


function preferredmodeChanged(){
	$("#lpreferredmo").show();
		}
function EngineeringModelChanged() {
    if (1 == $("#EngineeringModelSel").val()) {
        $("#divQueryTimeInterval").show();
        $("#txtqueryTimeInterval").val(gEngineerQueryTimeInterval);
    } else {
        $("#divQueryTimeInterval").hide();
    }    
}
