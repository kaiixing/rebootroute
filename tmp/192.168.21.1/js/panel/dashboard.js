var xml;
var wan_conn_status;
var lastSelPdpName = "";
var g_bSimCardExist = false;
var g_bNetworkConnected = false;
(function($) {
    $.fn.objdashboard = function(oInit) {
        var c_xmlName = '';
		var hard_ver = getHardware_Version();
        this.onLoad = function(flag) {
            var connDeviceValue;
            var wlan_enable;
            var defaultGateway;
            var conn_type;
            var proto_type="";
            var wan_link_status;
            var rssis;
            var roaming;
            var sim_status;
            var pin_status;
            var strURL;
            var regURL;
            var lanip;
            var wssid;
            var enc;
            var cipher;
            var sys_mode;
	    var Battery_status    //jmm add
	    var Battery_level     //jmm add
	    var Battery_percent;
		var Charger_status
	    var bConnectStatus = false;
	    //wk-s
		var rx_byte_all
		var tx_byte_all
	    //end
            var Battery_charging;
            var Battery_charge;
            var Battery_voltage;
            var Battery_charge_string;
            var Battery_voltage_percent;
            var Battery_connect;
            var data_conn_mode;
            var data_conn_mode_string;
            var channel;
            var pdpruleTxt = '';
            var pdpruleName = '';
            var NewSMSArrivedNum = 0;
            var IsLWGFlag = 0;
            var ISPName = '';
            var roamingNetworkName;
            var auto_apn;
            var connect_disconnect="";
			
            xml = getData(c_xmlName);
            if(!xml)
            {
            	g_objContent.onLoad(false);
            	return;
            }

            if (flag) {
                this.loadHTML();
				if(hard_ver=="Ver.B" ||hard_ver=="Ver.C"){
				$("#dtotalvalue").hide();
				$("#dcanusevalue").hide();
			}
                if ("dongle" == g_platformName) {
                    document.getElementById("wlan_settings").style.display = "none";
                    document.getElementById("wlan_enble").style.display = "none";
                    document.getElementById("networkImage").style.display = "none";
                    document.getElementById("image2").style.display = "none";
                }
                this.Localize();
            }

//jmm add start
		$(xml).find("batteryinfo").each(function() {

				Battery_status = $(this).find("Battery_status").text(); //jmm add
				Battery_level = $(this).find("Battery_level").text();  //jmm add
				Battery_percent = $(this).find("Battery_percent").text();
				Charger_status = $(this).find("Charger_status").text();
 
})

//jmm add end
			$(xml).find("wan").each(function() {
                $("#pdpRuleNameDropdown").empty();
                IsLWGFlag = $(this).find("LWG_flag").text();
                if("" == IsLWGFlag)
                {	 var login_text  = $(this).find("login_status").text();
				    if(login_text == "KICKOFF") {
				        AuthKickoff();
						return;
				    }else if(login_text == "TIMEOUT"){
					    AuthTimeout();
						return;
					}else if(login_text == "UNAUTHORIZED"){
						AuthUnAuth();
						return;
					}
                	g_objContent.onLoad(false);
            		return;
                }

                
                var bLastSelPdpExist = false;

                $(this).find("pdp_context_list").each(function() {
                    $(this).find("Item").each(function() {
                        if ("1" == $(this).find("success").text())
                            bConnectStatus = true;

                        pdpruleTxt = $(this).find("rulename").text();
                        pdpruleName = "selectValue" + $(this).find("rulename").text();
                        var opt = document.createElement("option");
                        document.getElementById("pdpRuleNameDropdown").options.add(opt);
                        opt.text = pdpruleTxt;
                        opt.value = pdpruleName;

                        if (lastSelPdpName == pdpruleName)
                            bLastSelPdpExist = true;
                    })
                })

                if (bConnectStatus) {
                    document.getElementById("globeImage").src = "images/globe.png";
                    document.getElementById("image1").src = "images/con-arrow.png";
                } else {
                    document.getElementById("globeImage").src = "images/globe_gr.png";
                    document.getElementById("image1").src = "images/discon-arrow.png";
                }

                if (!bLastSelPdpExist)
                    document.getElementById("pdpRuleNameDropdown").value = pdpruleName;
                else
                    document.getElementById("pdpRuleNameDropdown").value = lastSelPdpName;
                setDetailPDPInfo();

                wan_link_status = $(this).find("wan_link_status").text();
                wan_conn_status = $(this).find("wan_conn_status").text();
                rssis = $(this).find("rssi").text();
                sim_status = $(this).find("sim_status").text();
                if(0 == sim_status) {
                    g_bSimCardExist = true;
                } else {
                    g_bSimCardExist = false;
                }
                auto_apn = $(this).find("auto_apn").text();
                pin_status = $(this).find("pin_status").text();
                roaming = $(this).find("roaming").text();
                wssid = UniDecode($(this).find("ssid").text());
                enc = $(this).find("enc").text();
                cipher = $(this).find("cipher").text();
                sys_mode = $(this).find("sys_mode").text();
                Battery_charging = $(this).find("Battery_charging").text();
                Battery_charge = $(this).find("Battery_charge").text();
                Battery_voltage = $(this).find("Battery_voltage").text();
                Battery_connect = $(this).find("Battery_connect").text();
                data_conn_mode = $(this).find("sys_submode").text();
                ISPName = $(this).find("network_name").text();
				
				if(ISPName == "CHN-UNICOM" ||ISPName == "46001" ||ISPName == "46006"  )
					ISPName = jQuery.i18n.prop("lUNICOM");
				else if (ISPName == "CMCC" ||ISPName == "CHINA MOBILE" ||ISPName == "46000" ||ISPName == "46002" ||ISPName == "46007")
					ISPName = jQuery.i18n.prop("lCMCC");
				else if (ISPName == "46003" ||ISPName == "46005" ||ISPName == "46011")
					ISPName = jQuery.i18n.prop("lCTCC");
				else if(ISPName =="44001"||ISPName =="44002"||ISPName =="44003"||ISPName =="44009"||
						ISPName =="44010"||ISPName =="44011"||ISPName =="44012"||ISPName =="44013"||
						ISPName =="44014"||ISPName =="44015"||ISPName =="44016"||ISPName =="44017"||
						ISPName =="44018"||ISPName =="44019"||ISPName =="44021"||
						ISPName =="44022"||ISPName =="44023"||ISPName =="44024"||ISPName =="44025"||
						ISPName =="44026"||ISPName =="44027"||ISPName =="44028"||ISPName =="44029"||
						ISPName =="44030"||ISPName =="44031"||ISPName =="44032"||ISPName =="44033"||
						ISPName =="44034"||ISPName =="44035"||ISPName =="44036"||ISPName =="44037"||
						ISPName =="44038"||ISPName =="44039"||ISPName =="44049"||ISPName =="44058"||
						ISPName =="44060"||ISPName =="44061"||ISPName =="44062"||
						ISPName =="44063"||ISPName =="44064"||ISPName =="44065"||ISPName =="44066"||
						ISPName =="44067"||ISPName =="44068"||ISPName =="44069"||ISPName =="44087"||
						ISPName =="44099")
					ISPName = jQuery.i18n.prop("lnttdocomo");
				else if(ISPName =="44004"||ISPName =="44006"||ISPName =="44020"||ISPName =="44040"||ISPName =="44041"||
						ISPName =="44042"||ISPName =="44043"||ISPName =="44044"||ISPName =="44045"||
						ISPName =="44046"||ISPName =="44047"||ISPName =="44048"||ISPName =="44090"||
						ISPName =="44092"||ISPName =="44093"||ISPName =="44094"||
						ISPName =="44095"||ISPName =="44096"||ISPName =="44097"||ISPName =="44098")
					ISPName = jQuery.i18n.prop("lSoftBank");
				else if(ISPName =="44000")
					ISPName = jQuery.i18n.prop("lymobile");
				else if(ISPName =="44100")
					ISPName = jQuery.i18n.prop("lwcp");
                roamingNetworkName = $(this).find("roaming_network_name").text();
                setLabelValue("lDashRouterImeiValue", $(this).find("IMEI").text());


                if (wan_conn_status.indexOf("ppp", 0) != -1) {
                    wan_conn_status = wan_conn_status.substr(4);
                }

                if (wan_conn_status.indexOf("wifi", 0) != -1) {
                    wan_conn_status = wan_conn_status.substr(5);
                }

                conn_type = $(this).find("ConnType").text();
                proto_type = $(this).find("proto").text();
                connect_disconnect = $(this).find("connect_disconnect").text();
                if ("cellular" == connect_disconnect) {
                    g_bNetworkConnected = true;
                } else {
                    g_bNetworkConnected = false;
                }

            });

            $(xml).find("lan").each(function() {
                lanip = $(this).find("ip").text();
            });

            if("1" == auto_apn && "cellular" == proto_type) {
                //$("#divAutoApn").show();
                $(xml).find("wan").each(function() {
                    setLabelValue("pDashAutoApn_mmcValue", $(this).find("mmc").text());
                    setLabelValue("pDashAutoApn_mncValue", $(this).find("mnc").text());
                    setLabelValue("pDashAutoApn_OperatorNameValue", $(this).find("operator_name").text());
                    setLabelValue("pDashAutoApn_ApnValue", $(this).find("apn").text());
                    setLabelValue("pDashAutoApn_LteApnValue", $(this).find("lte_apn").text());
                    setLabelValue("pDashAutoApn_NetworkTypeValue", $(this).find("network_type").text());
                    setLabelValue("pDashAutoApn_authtype2g3gValue", $(this).find("authtype2g3g").text());
                    setLabelValue("pDashAutoApn_username2g3gValue", $(this).find("username2g3g").text());
                    setLabelValue("pDashAutoApn_password2g3gValue", $(this).find("password2g3g").text());
                    setLabelValue("pDashAutoApn_authtype4gValue", $(this).find("authtype4g").text());
                    setLabelValue("pDashAutoApn_username4gValue", $(this).find("username4g").text());
                    setLabelValue("pDashAutoApn_password4gValue", $(this).find("password4g").text());
                    var iptype = $(this).find("iptype").text();
                    if(0 == iptype) {
                        setLabelValue("pDashAutoApn_iptypeValue", "IPv4v6");
                    } else if(1 == iptype) {
                        setLabelValue("pDashAutoApn_iptypeValue", "IPv4");
                    } else if(2 == iptype) {
                        setLabelValue("pDashAutoApn_iptypeValue", "IPv6");
                    } else {
                        setLabelValue("pDashAutoApn_iptypeValue", "");
                    }
                });
            } else {
                $("#divAutoApn").hide();
            }


            if (proto_type == 'disabled' || connect_disconnect == 'disabled')
                conn_type = 'disabled';

            switch (conn_type) {
                case 'cellular':
                    if (sim_status == 1) {
                        document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"> </span><strong id=\"pSIMStatus\"></strong><br /><img id=\"imgSIMStatus\" src=\"\" alt=\"\" align=\"right\"/><label id=\"lSIMStatusValue\"></label>";
                        document.getElementById("Internet_DIV").style.display = "none";
                        document.getElementById("imgSIMStatus").src = "images/status-icon2.png";
                        //setLabelValue("lSIMStatusValue","Absent");
                        setLabelValueProp("lSIMStatusValue", "lSIMAbsent");
                    } else if (sim_status == 0) {
                        switch (pin_status) {
                            case "0":
                                if (roaming == 1) {
                                    document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pSignalStrength\"></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id=\"imgSignalStrength\" src=\"\" alt=\"\" align=\"baseline\"/><br /><strong id=\"pRoaming\"></strong><br /><label id=\"lRoaming\"></label><br /><br /><strong id=\"pCellular\" style=\"display:none\"></strong><label id=\"lcconnectivity\" style=\"display:none\"></label>";
                                    setLabelValue("lRoaming", "Active");
                                    $("#pISPName").text( jQuery.i18n.prop("pRoamingNetworkOperator"));
                                    setLabelValue("lISPName", roamingNetworkName); //roaming 状态下，运营商显示邋邋roaming_network_name

                                } else {
                                    document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pSignalStrength\"></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id=\"imgSignalStrength\" src=\"\" alt=\"\" align=\"baseline\"/><br /><strong id=\"pCellular\" style=\"display:none\">  </strong><label id=\"lcconnectivity\" style=\"display:none\"></label>";
                                    setLabelValue("lISPName", ISPName);
                                }
                                //  setLabelValue("lISPName", ISPName);
                                //document.getElementById("cellED").innerHTML = "disable";
                                var rssi = rssis * 1;


                                if (sys_mode == 3) { //GSM
                                   
                                        if (rssi <= 15)
                                            document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                        else if (rssi >= 16 && rssi <= 20)
                                            document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                        else if (rssi >= 21 && rssi <= 25)
                                            document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                        else if (rssi >= 26)
                                            document.getElementById("imgSignalStrength").src = "images/signal4.png";
                                    

                                } else if (sys_mode == 5) { //WCDMA
                                    
                                        if (rssi <= 25)
                                            document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                        else if (rssi >= 26 && rssi <=30)
                                            document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                        else if (rssi >= 31 && rssi <=35)
                                            document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                        else if (rssi >=36)
                                            document.getElementById("imgSignalStrength").src = "images/signal4.png";
                                    
                                    if(bConnectStatus)
                                    setLabelValue("lcconnectivitymode", "3G");
									else 
									document.getElementById("lcconnectivitymode").innerHTML = "3G"+jQuery.i18n.prop("ldisconnected"); 
                                } else if (sys_mode == 15) { //TD
                                   
                                        if (rssi <= 25)
                                            document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                        else if (rssi >= 26 && rssi <= 30)
                                            document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                        else if (rssi >= 31 && rssi <= 35)
                                            document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                        else if (rssi >= 36)
                                            document.getElementById("imgSignalStrength").src = "images/signal4.png";
                                    
									if(bConnectStatus)
                                    setLabelValue("lcconnectivitymode", "3G");
									else 
									document.getElementById("lcconnectivitymode").innerHTML = "3G"+jQuery.i18n.prop("ldisconnected"); 
                                } else if (sys_mode == 17) { //LTE

                                    if (rssi <= 23)
                                        document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                    else if (rssi >= 24 && rssi <= 32)
                                        document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                    else if (rssi >= 33 && rssi <= 39)
                                        document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                    else if (rssi >= 40)
                                        document.getElementById("imgSignalStrength").src = "images/signal4.png";
									if(bConnectStatus)
                                    setLabelValue("lcconnectivitymode", "4G");
									else 
									document.getElementById("lcconnectivitymode").innerHTML = "4G"+jQuery.i18n.prop("ldisconnected"); 
                                }
                                else
                                {
                                    setLabelValue("lcconnectivitymode", "No Service");
                                }

                                switch (data_conn_mode) {
                                    case '3':
                                        data_conn_mode_string = 'EDGE';
										if(bConnectStatus)
                                    	setLabelValue("lcconnectivitymode", "2G");
										else 
									document.getElementById("lcconnectivitymode").innerHTML = "2G"+jQuery.i18n.prop("ldisconnected"); 
                                        break;
                                    case '2':
                                        data_conn_mode_string = 'GPRS';
                                        break;
                                    case '5':
                                        data_conn_mode_string = 'HSDPA';
                                        break;
                                    case '6':
                                        data_conn_mode_string = 'HSUPA';
                                        break;
                                    case '7':
                                        data_conn_mode_string = 'HSDPA+HSUPA';
                                        break;
                                    case '17':
                                        data_conn_mode_string = 'LTE';
                                        break;
                                    default:
                                        data_conn_mode_string = 'EDGE';
                                        break;
                                }


                                //document.getElementById("cellED").innerHTML = jQuery.i18n.prop("lDisabled");
                                document.getElementById("Internet_DIV").style.display = "block";
                                //setLabelValueProp("lcconnectivity", "lEnabled");

                                break;
                            case "1":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pPINStatus\"></strong><br /><label id=\"lPINValue\"></label><label class=\"link1\" id=\"lPINStatusValue\" onclick=\"dashboardOnClick(2,'mPinPuk')\" onmousedown=\"dashboardOnClick(2,'mPinPuk')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lPINValue", "PIN");
                                setLabelValueProp("lPINStatusValue", "lPINrequired");
                                break;
                            case "2":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pPINStatus\"></strong><br /><label id=\"lPINValue\"></label><label class=\"link1\" id=\"lPINStatusValue\" onclick=\"dashboardOnClick(2,'mPinPuk')\" onmousedown=\"dashboardOnClick(2,'mPinPuk')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lPINValue", "PUK");
                                setLabelValueProp("lPINStatusValue", "lPINrequired");
                                break;
                            case "3":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"> </span><strong id=\"pSIMStatus\"></strong><br /><img id=\"imgSIMStatus\" src=\"\" alt=\"\" align=\"right\"/><label id=\"lSIMStatusValue\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                document.getElementById("imgSIMStatus").src = "images/status-icon2.png";
                                setLabelValueProp("lSIMStatusValue", "lSIMLocked");
                                break;
                            case "4":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"> </span><strong id=\"pSIMStatus\"></strong><br /><img id=\"imgSIMStatus\" src=\"\" alt=\"\" align=\"right\"/><label id=\"lSIMStatusValue\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                document.getElementById("imgSIMStatus").src = "images/status-icon2.png";
                                setLabelValueProp("lSIMStatusValue", "lSIMerror");
                                break;
                            case "48":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "PNPIN");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                            case "49":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "PNPUK");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                            case "50":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "PUPIN");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                            case "51":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "PUPUK");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                            case "52":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "SPPIN");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                            case "53":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "SPPUK");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                            case "54":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "PCPIN");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                            case "55":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "PCPUK");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                            case "56":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "SIMPIN");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                            case "57":
                                document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pMEPStatus\"></strong><br /><label id=\"lMEPValue\"></label><label class=\"link1\" id=\"lMEPStatusValue\" onclick=\"dashboardOnClick(2,'mMEPSetting')\" onmousedown=\"dashboardOnClick(2,'mMEPSetting')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                                document.getElementById("Internet_DIV").style.display = "none";
                                setLabelValue("lMEPValue", "SIMPUK");
                                setLabelValueProp("lMEPStatusValue", "lPINrequired");
                                break;
                        }
                    }
                    break;

                case 'wifi':
                    document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3WiFiConnection\"></span><strong id=\"pWiFiWirelessNw\">  </strong><br /><label id=\"lWiFiWirelessNwValue\">  </label><label class=\"link1\" id=\"WiFiED\" onclick=\"WiFiED()\" onmousedown=\"WiFiED()\" onmouseover=\"this.style.cursor='pointer';\"></label>"
                    if (wan_conn_status == "connected") {
                        document.getElementById("image1").src = "images/con-arrow.png";
                        document.getElementById("Internet_DIV").style.display = "block";
                        document.getElementById("WiFiED").innerHTML = "disconnect";
                        setLabelValue("lWiFiWirelessNwValue", wssid + " (" + enc + ")");
                    } else {
                        document.getElementById("Internet_DIV").style.display = "none";
                        document.getElementById("WiFiED").innerHTML = "connect";
                        setLabelValue("lWiFiWirelessNwValue", "Not connected");
                    }
                    break;

                default:
                    document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pISPName\"></strong><br /><label id=\"lISPName\" ></label><br/><br/><strong id=\"pCellularMode\"></strong><br /><label id=\"lcconnectivitymode\" ></label><br /><strong id=\"pSignalStrength\"></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id=\"imgSignalStrength\" src=\"\" alt=\"\" align=\"baseline\"/><br /><strong id=\"pCellular\" style=\"display:none\">  </strong><label id=\"lcconnectivity\" style=\"display:none\"></label>";

                    setLabelValue("lISPName", ISPName);
                    var rssi = rssis * 1;

                   if (sys_mode == 3) { //GSM
                                    if (IsLWGFlag) {
                                        if (rssi <= 15)
                                            document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                        else if (rssi >= 16 && rssi <= 20)
                                            document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                        else if (rssi >= 21 && rssi <= 25)
                                            document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                        else if (rssi >= 26)
                                            document.getElementById("imgSignalStrength").src = "images/signal4.png";
                                    } else {
                                        if (rssi <= 15)
                                            document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                        else if (rssi >= 16 && rssi <= 20)
                                            document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                        else if (rssi >= 21 && rssi <= 25)
                                            document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                        else if (rssi >= 26)
                                            document.getElementById("imgSignalStrength").src = "images/signal4.png";
                                    }
									if(bConnectStatus)
                                    setLabelValue("lcconnectivitymode", "2G");
									else 
									document.getElementById("lcconnectivitymode").innerHTML = "2G"+jQuery.i18n.prop("ldisconnected"); 
                                } else if (sys_mode == 5) { //WCDMA
                                    if (IsLWGFlag) {
                                        if (rssi < 17)
                                            document.getElementById("imgSignalStrength").src = "images/signal0.png";
                                        else if (rssi >= 17 && rssi < 22)
                                            document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                        else if (rssi >= 22 && rssi < 27)
                                            document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                        else if (rssi >= 27 && rssi < 31)
                                            document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                        else if (rssi >= 31 && rssi <= 96)
                                            document.getElementById("imgSignalStrength").src = "images/signal4.png";

                                    } else {
                                        if (rssi <= 25)
                                            document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                        else if (rssi >= 26 && rssi <=30)
                                            document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                        else if (rssi >= 31 && rssi <=35)
                                            document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                        else if (rssi >=36)
                                            document.getElementById("imgSignalStrength").src = "images/signal4.png";
                                    }
                                    if(bConnectStatus)
                                    setLabelValue("lcconnectivitymode", "3G");
									else 
									document.getElementById("lcconnectivitymode").innerHTML = "3G"+jQuery.i18n.prop("ldisconnected"); 
                                } else if (sys_mode == 15) { //TD
                                    if (IsLWGFlag) {
                                        if (rssi <= 25)
                                            document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                        else if (rssi >= 26 && rssi <= 30)
                                            document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                        else if (rssi >= 31 && rssi <= 35)
                                            document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                        else if (rssi >= 36)
                                            document.getElementById("imgSignalStrength").src = "images/signal4.png";
                                    } else {
                                        if (rssi == 0)
                                            document.getElementById("imgSignalStrength").src = "images/signal0.png";
                                        else if (rssi >= 100 && rssi < 122)
                                            document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                        else if (rssi >= 123 && rssi < 144)
                                            document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                        else if (rssi >= 144 && rssi < 166)
                                            document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                        else if (rssi >= 163 && rssi <= 191)
                                            document.getElementById("imgSignalStrength").src = "images/signal4.png";
                                    }
									if(bConnectStatus)
                                    setLabelValue("lcconnectivitymode", "3G");
									else 
									document.getElementById("lcconnectivitymode").innerHTML = "3G"+jQuery.i18n.prop("ldisconnected"); 
                                } else if (sys_mode == 17) { //LTE

                                    if (rssi <= 23)
                                        document.getElementById("imgSignalStrength").src = "images/signal1.png";
                                    else if (rssi >= 24 && rssi <= 32)
                                        document.getElementById("imgSignalStrength").src = "images/signal2.png";
                                    else if (rssi >= 33 && rssi <= 39)
                                        document.getElementById("imgSignalStrength").src = "images/signal3.png";
                                    else if (rssi >= 40)
                                        document.getElementById("imgSignalStrength").src = "images/signal4.png";
									if(bConnectStatus)
                                    setLabelValue("lcconnectivitymode", "4G");
									else 
									document.getElementById("lcconnectivitymode").innerHTML = "4G"+jQuery.i18n.prop("ldisconnected"); 
                                }
                                else
                                {
                                    setLabelValue("lcconnectivitymode", "No Service");
                                }
                    if (proto_type == 'cellular') {
                        if ("1" == pin_status) {
                            document.getElementById("Cellular").innerHTML = "<span class=\"heading1\" id=\"h3CellularConnection\"></span><strong id=\"pPINStatus\"></strong><br /><label id=\"lPINValue\"></label><label class=\"link1\" id=\"lPINStatusValue\" onclick=\"dashboardOnClick(2,'mPinPuk')\" onmousedown=\"dashboardOnClick(2,'mPinPuk')\" onmouseover=\"this.style.cursor=\'pointer\';\"></label>";
                            document.getElementById("Internet_DIV").style.display = "none";
                            setLabelValue("lPINValue", "PIN");
                            setLabelValueProp("lPINStatusValue", "lPINrequired");
                        } else {
                           // document.getElementById("cellED").innerHTML = jQuery.i18n.prop("lEnabled");
                            //setLabelValueProp("lcconnectivity", "lDisabled");
                        }
                    }
                    $("#imgSignalStrength").hide();
                    document.getElementById("Internet_DIV").style.display = "none";
                    break;
            }
            this.Localize();

            $(xml).find("WanStatistics").each(function() {
                //setLabelValue("lsentPackets", $(this).find("tx").text());
                //setLabelValue("lRecPackets", $(this).find("rx").text());
		rx_byte_all = $(this).find("rx_byte_all").text();
		tx_byte_all =$(this).find("tx_byte_all").text();
		var stat_mang_method =$(this).find("stat_mang_method").text();
		var mi_set_flag =$(this).find("mi_set_flag").text();
		var upper_value_month =$(this).find("upper_value_month").text();
		var upper_value_period =$(this).find("upper_value_period").text();
		var upper_value_unlimit =$(this).find("upper_value_unlimit").text();
		var total_used_month =$(this).find("total_used_month").text();
		var total_used_period =$(this).find("total_used_period").text();
		var total_used_unlimit =$(this).find("total_used_unlimit").text();
		var upper_value_daily =$(this).find("upper_value_daily").text();
		var total_used_daily =$(this).find("total_used_daily").text();
		var total_value_used;
		var upper_value;
		var value_can_use;
		switch(stat_mang_method){
		case "1":
			total_value_used=getWlanByte(total_used_month);
			upper_value=getWlanByte(upper_value_month);
			value_can_use=getWlanByte(parseInt(upper_value_month)-parseInt(total_used_month));
			break;
		case "2":
			total_value_used=getWlanByte(total_used_period);
			upper_value=getWlanByte(upper_value_period);
			value_can_use=getWlanByte(parseInt(upper_value_period)-parseInt(total_used_period));
			break;
		case "3":
			total_value_used=getWlanByte(total_used_unlimit);
			upper_value=getWlanByte(upper_value_unlimit);
			value_can_use=getWlanByte(parseInt(upper_value_unlimit)-parseInt(total_used_unlimit));
			break;
		case "4":
			total_value_used=getWlanByte(total_used_daily);
			upper_value=getWlanByte(upper_value_daily);
			value_can_use=getWlanByte(parseInt(upper_value_daily)-parseInt(total_used_daily));
			break;
		default:
			$("#dtotalvalue").hide();
			$("#dcanusevalue").hide();
			
			total_value_used=getWlanByte(parseInt(rx_byte_all)+parseInt(tx_byte_all));
			
		}
		var mRxbyte = getWlanByte(rx_byte_all);
		var mTxbyte = getWlanByte(tx_byte_all);
		var mTotalbyte = getWlanByte(parseInt(rx_byte_all)+parseInt(tx_byte_all));
				if(upper_value==""){
					setLabelValue("lsentPackets",jQuery.i18n.prop("flowunset"));
					setLabelValue("lTotalPackets", jQuery.i18n.prop("flowunset"));
				}else{
                	setLabelValue("lsentPackets",upper_value);
					if(parseInt(value_can_use)<0)
					document.getElementById("lTotalPackets").innerHTML = jQuery.i18n.prop("lflowup");
						else
					setLabelValue("lTotalPackets", value_can_use);}
                setLabelValue("lRecPackets", total_value_used);
				
                document.getElementById("traffic_reset_div").innerHTML = "<label class=\"link1\" id=\"resetTraffic\" style=\"display:none\" onclick=\"ResetTraffic()\" onmousedown=\"ResetTraffic()\" onmouseover=\"this.style.cursor='pointer';\"></label>";
                document.getElementById("resetTraffic").innerHTML = jQuery.i18n.prop("resetTraffic");
            });


            $(xml).find("lan").each(function() {
                setLabelValue("lRouterIP", $(this).find("ip").text());
             //   setLabelValue("lRouterMask", $(this).find("mask").text());
                setLabelValue("lRouterMAC", $(this).find("mac").text());
                run_days = $(this).find("run_days").text();
                if(run_days == "")
                    run_days = 0;
                if (run_days > 1)
                    run_days = run_days + " " + jQuery.i18n.prop("ldDays") + " ";
                else
                    run_days = run_days + " " + jQuery.i18n.prop("ldDay") + " ";
                setLabelValue("lDashRunDaysValue", run_days);

                run_hours = $(this).find("run_hours").text();
                if(run_hours == "")
                    run_hours = 0;
                if (run_hours > 1)
                    run_hours = run_hours + " " + jQuery.i18n.prop("ldHours") + " ";
                else
                    run_hours = run_hours + " " + jQuery.i18n.prop("ldHour") + " ";
                setLabelValue("lDashRunHoursValue", run_hours);

                run_minutes = $(this).find("run_minutes").text();
                if(run_minutes == "")
                    run_minutes = 0;
                if (run_minutes > 1)
                    run_minutes = run_minutes + " " + jQuery.i18n.prop("ldMinutes") + " ";
                else
                    run_minutes = run_minutes + " " + jQuery.i18n.prop("ldMinute") + " ";
                setLabelValue("lDashRunMinutesValue", run_minutes);

                run_seconds = $(this).find("run_seconds").text();
                if(run_seconds == "")
                    run_seconds = 0;
                if (run_seconds > 1)
                    run_seconds = run_seconds + " " + jQuery.i18n.prop("ldSeconds") + " ";
                else
                    run_seconds = run_seconds + " " + jQuery.i18n.prop("ldSecond") + " ";
                setLabelValue("lDashRunSecondsValue", run_seconds);
            });
            if (Battery_status == 3) {
            		setLabelValueProp("lDashChargeStatus", 'lIdle');

               // setLabelValueProp("lDashBatteryQuantity", 'lNoBattery');
            }	else if (Battery_status == 1&&Charger_status== 4) {
            		setLabelValueProp("lDashChargeStatus", "lChargingfull");

            }	else if (Battery_status == 1&&Charger_status== 5) {
            		setLabelValueProp("lDashChargeStatus", "lCharging_error");

            }	else if (Battery_status == 1) {
            		setLabelValueProp("lDashChargeStatus", "lCharging");

            }	else if (Battery_status == 4){
	    		setLabelValueProp("lDashChargeStatus", "lCharging_error");

            }	else if (Battery_status == 2){
	                setLabelValueProp("lDashChargeStatus", "lDischarge");

	    }  else
	    		setLabelValueProp("lDashChargeStatus", "lInchecking");
            if (Battery_level == 3){
                        setLabelValueProp("lDashBatteryQuantity", "lHigelevel");

            }	else if (Battery_level == 1){
                        setLabelValueProp("lDashBatteryQuantity", "lLowlevel");

            }	else if (Battery_level == 2){
                        setLabelValueProp("lDashBatteryQuantity", "lMiddlelevel");

			}	else if (Battery_level == 4){
                        setLabelValueProp("lDashBatteryQuantity", "lVerylowlevel");

	   		}	else
            		setLabelValueProp("lDashBatteryQuantity", "lInchecking");


            $(xml).find("wlan_security").each(function() {
                var mode = $(this).find("mode").text();
                if (mode == "Mixed") {
                    mode = "dropdownWPAWPA2";
                    setLabelValueProp("lSecurityModeValue", mode);
                } else
                    setLabelValue("lSecurityModeValue", mode);
                setLabelValue("lWirelessNwValue", UniDecode($(this).find("ssid").text()));

            });

            $(xml).find("sysinfo").each(function() {
				if(hard_ver == "Ver.D")
					setLabelValue("lDeviceModelValue", "MF885");
				else
                	setLabelValue("lDeviceModelValue", $(this).find("device_name").text());
				var mversion = $(this).find("version_num").text();
                setLabelValue("lSoftVersion", mversion.substring(0,mversion.indexOf("_")));
				var hversion = $(this).find("hardware_version").text();
                setLabelValue("lHardVersion",hversion.substring(hversion.indexOf(" ")));

            });
            $(xml).find("device_management").each(function() {
                connDeviceValue = $(this).find("nr_connected_dev").text();
                setLabelValue("lConnDeviceValue", connDeviceValue);
            });
            if (connDeviceValue == 0) {
                document.getElementById("networkImage").src = "images/network_gr.png";
                //document.getElementById("image2").src = "images/discon-arrow.png";
                document.getElementById("imgConnDevice").src = "images/status-icon2.png";
            } else {
                document.getElementById("networkImage").src = "images/network.png"
                        //document.getElementById("image2").src = "images/con-arrow.png";
                        document.getElementById("imgConnDevice").src = "images/status-icon3.png";
            }

            if ("mifi" == g_platformName) {
                $(xml).find("wlan_settings").each(function() {
                    setLabelValueEnabledDisabled("lWLANStatus", $(this).find("wlan_enable").text(), "imgWN");
                    wlan_enable = $(this).find("wlan_enable").text();
                    channel = $(this).find("channel").text();
                    if (channel != "0")
                        setLabelValue("lChannelNumber", $(this).find("channel").text());
                    else if (channel == "0")
                        setLabelValueProp("lChannelNumber", "dropdownWirelessAuto");
                    // setLabelValue("lChannelNumber",$(this).find("channel").text());
                });
                if (wlan_enable == 0) {
                    document.getElementById("wlan_settings").style.display = 'none';
                    document.getElementById("networkImage").src = "images/network_gr.png";
                    document.getElementById("image2").src = "images/discon-arrow.png";
                } else {
                    document.getElementById("wlan_settings").style.display = 'block';
                    document.getElementById("image2").src = "images/con-arrow.png";
                }


            }

            $(xml).find("dhcp").each(function() {
                setLabelValueEnabledDisabled("lDhcpServerValue", $(this).find("status").text(), "imgDhcpServerValue");
            });
	//wk-mark
	/*
            $(xml).find("message").each(function() {
                NewSMSArrivedNum = $(this).find("new_sms_num").text();
            });

            if (NewSMSArrivedNum >= 1) {
                var MessAgeNotification = "";
                if(1 == NewSMSArrivedNum)
                    MessAgeNotification = NewSMSArrivedNum + " " + jQuery.i18n.prop("lsmsOneNewArrivedSMS");
                else
                    MessAgeNotification = NewSMSArrivedNum + " " + jQuery.i18n.prop("lsmsMoreNewArrivedSMS");
                showMsgBox(jQuery.i18n.prop("lsmsNotification"), MessAgeNotification);
            }
	*/
	//end
        }
        this.onPostSuccess = function() {
            this.onLoad(false);
        }
        this.Localize = function() {
            $("h2,strong,a,span").each(function() {
                $(this).text(jQuery.i18n.prop($(this).attr("id")));
            });
        }

        this.loadHTML = function() {
            document.getElementById('mainColumn').innerHTML = "";
            document.getElementById('mainColumn').innerHTML = callProductHTML("html/dashboard.html");

        }
        this.setXMLName = function(_xmlname) {
            c_xmlName = _xmlname;
        }

        return this.each(function() {
            _dashboardIntervalID = setInterval("g_objContent.onLoad(false)", _dashboardInterval);
        });
    }
})(jQuery);
function setLabelValue(id, value) {
    document.getElementById(id).innerHTML = value;
}

function getWlanByte(byte) {
	var mByte = "";
	var gb = 1024*1024*1024;
	var mb = 1024*1024;
	var kb = 1024;

	if(byte>gb) //GB
	{
		mByte = (byte/gb).toFixed(2)+' '+"GB";
	}
	else if(byte>mb) //MB
	{
		mByte = (byte/mb).toFixed(2)+' '+"MB";
	}
	else if(byte>kb)//KB
	{
		mByte =(byte/kb).toFixed(2)+' '+"KB";
	}
	else //Byte
	{
		mByte = byte;
	}

	return mByte;
}

function setLabelValueProp(id, prop) {
    document.getElementById(id).innerHTML = jQuery.i18n.prop(prop);
}
function setLabelValueEnabledDisabled(id, flag, imgID) {
    document.getElementById(imgID).style.display = "block";
    if (flag == 1) {
        document.getElementById(id).innerHTML = jQuery.i18n.prop("lEnabled");
        document.getElementById(imgID).src = "images/status-icon3.png";

    } else {
        document.getElementById(id).innerHTML = jQuery.i18n.prop("lDisabled");
        document.getElementById(imgID).src = "images/status-icon2.png";
    }
}
function setDetailPDPInfo() {

    var connectionNum = "";
    var sucess = "";
    var defaultPDP = "";
    var secondaryPdp = "";
    var typeValue = "";
    var IPV4dnsServer1;
    var IPV4dnsServer2;
  //  var IPV6dnsServer1;
  //  var IPV6dnsServer2;
    var curconntime;
    var totalconntime;

    var linkObj = document.getElementById("pdpRuleNameDropdown");
    //empty pdp_context_list
    if (-1 == linkObj.selectedIndex) {
        document.getElementById("DetailPDP_DIV").style.display = "none";
        return;
    }

    var value = linkObj.options[linkObj.selectedIndex].value;
    lastSelPdpName = value;


    document.getElementById("DetailPDP_DIV").style.display = "block";

    $(xml).find("wan").each(function() {
		var auto_apn = $(this).find("auto_apn").text();
        $(this).find("pdp_context_list").each(function() {
            $(this).find("Item").each(function() {
                pdpruleName = "selectValue" + $(this).find("rulename").text();
                if (pdpruleName == value) {
                    defaultPDP = $(this).find("default").text();
                    secondaryPdp = $(this).find("secondary").text();
                    if (defaultPDP == "1") {
                        if (secondaryPdp == "0")
                            typeValue = jQuery.i18n.prop("SPDPType_Default") + ' ' + "Secondary APN";
                        else
                            typeValue = jQuery.i18n.prop("SPDPType_Default") + ' ' + "APN";
                    } else if (defaultPDP == "0") {
                        if (secondaryPdp == "0")
                            typeValue = jQuery.i18n.prop("SPDPType_Custom") + ' ' + "Secondary APN";
                        else
                            typeValue = jQuery.i18n.prop("SPDPType_Custom") + ' ' + "APN";
                    }

                    sucess = $(this).find("success").text();
                    if (sucess == "1")
                        setLabelValue("LpdpSuccess", jQuery.i18n.prop("lconnected"));
                    else if (sucess == "0")
                        setLabelValue("LpdpSuccess", jQuery.i18n.prop("ldisconnected"));
                    else if (sucess == "2")
                        setLabelValue("LpdpSuccess", jQuery.i18n.prop("lconnecting"));

					if(auto_apn == "1")
                    	setLabelValue("IpdpTypeValue", typeValue);
					else
						setLabelValue("IpdpTypeValue", jQuery.i18n.prop("SAPNMAN"));
                    setLabelValue("LIPV4AddValue", $(this).find("ipv4").text());

                    IPV4dnsServer1 = $(this).find("v4dns1").text();
                    IPV4dnsServer2 = $(this).find("v4dns2").text();
                    if (IPV4dnsServer2 != "")
                        IPV4dnsServer1 = IPV4dnsServer1 + "," + IPV4dnsServer2;
                    setLabelValue("LIPV4GatewayValue", $(this).find("v4gateway").text());
                    setLabelValue("LIPV4NetmaskValue", $(this).find("v4netmask").text());
					curconntime = $(this).find("curconntime").text();
                    totalconntime = $(this).find("totalconntime").text();
					setLabelValue("lDashCurConnValue", dateFormat(curconntime));
                    setLabelValue("lDashTotalConnValue", dateFormat(totalconntime));

                    return false;
                }

            })
        })
    })
}

function WiFiED() {
    if (wan_conn_status == "connected") {
        //alert("Implement disconnect");
        var mapData = new Array(0);

        //mapData = putMapElement(mapData,"RGW/wan/proto","wifi",0);
        mapData = putMapElement(mapData, "RGW/wan/wifi/ssid", "", 0);
        mapData = putMapElement(mapData, "RGW/wan/wifi/enc", "", 1);
        postXML("wan", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    } else {
        dashboardOnClick(2, 'mInternetConn');
    }
}

function ResetTraffic() {
    //alert("Unimplement traffic reset");
    var mapData = new Array(0);
    mapData = putMapElement(mapData, "RGW/statistics/WanStatistics/reset", "1", 0);
    postXML("statistics", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
}


function dateFormat(second) {
    var dd, hh, mm, ss;
    var dayUnit = "ldDay";
    var hourUnit = "ldHour";
    var minuteUnit = "ldMinute";
    var secondUnit = "ldSecond";
    second = typeof second === 'string' ? parseInt(second) : second;

    if (second < 0) {
        return "NA";
    }

    dd = second / (24 * 3600) | 0;
    second = Math.round(second) - dd * 24 * 3600;

    hh = second / 3600 | 0;
    second = Math.round(second) - hh * 3600;

    mm = second / 60 | 0;
    ss = Math.round(second) - mm * 60;

    if (dd > 1) {
        dayUnit = "ldDays";
    }
    if (hh > 1) {
        hourUnit = "ldHours";
    }
    if (mm > 1) {
        minuteUnit = "ldMinutes";
    }
    if (ss > 1) {
        secondUnit = "ldSeconds";
    }


    /* if (Math.round(dd) < 10) {
         dd = dd > 0 ? '0' + dd : '';
     }

     if (Math.round(hh) < 10) {
         hh = '0' + hh;
     }

     if (Math.round(mm) < 10) {
         mm = '0' + mm;
     }

     if (Math.round(ss) < 10) {
         ss = '0' + ss;
     }*/

    //if (dd.length > 0)
    return dd + ' ' + jQuery.i18n.prop(dayUnit) + ' ' + hh + ' ' + jQuery.i18n.prop(hourUnit) + ' ' + mm + ' ' + jQuery.i18n.prop(minuteUnit) + ' ' + ss + ' ' + jQuery.i18n.prop(secondUnit) + ' ';
    //else
    //return hh + ' ' + jQuery.i18n.prop(hourUnit) + ' ' + mm + ' ' + jQuery.i18n.prop(minuteUnit) + ' ' + ss + ' ' + jQuery.i18n.prop(secondUnit) + ' ';
}
