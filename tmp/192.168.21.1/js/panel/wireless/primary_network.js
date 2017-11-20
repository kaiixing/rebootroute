var rbWiFiSetup = null;
var wps_enable;
var _net_mode;
var _strSecurityType = '';
var IsWpsMatch = false;
var WPSItervalID;
var g_strEncryptionMode;
var g_strWpa2PskPasswd="";
var g_strMixedPasswd="";
var ssidRegex = /^[a-z0-9]([a-z0-9\-._]*[a-z0-9])*$/i;
var wpsbtneffect;
var wpsbtneffect_load;
(function($) {

    $.fn.objWire_Sec = function(InIt) {

        var _controlMapExisting = new Array(0);
        var _controlMapCurrent = new Array(0);
        var _xmlname = '';
        var strSSID = '';
        // var _radEDNw = null;
        var _radVINwStatus = null;
        var _radKeyType = null;
        var ssid_bcast = '';
        var _xml = '';
        var _cipher = '';
		var hard_ver = getHardware_Version();
        this.onLoad = function(flag) {
            if (flag) {
                this.loadHTML();
                this.addRadios();
				if(hard_ver == "Ver.B"||hard_ver == "Ver.C")
			$("#drpdwnSecurityType").append("<option id=\"dropdownWEP\" value=\"WEP\">WEP</option>");
                buttonLocaliztion(document.getElementById("btUpdate").id);
            }
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            $("#lWpsCfgBtn").val(jQuery.i18n.prop("lWpsCfgBtn"));
            this.dispalyAllNone();
            _xml = getData(_xmlname);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            var optionElements = document.getElementsByTagName("option");
            pElementLocaliztion(optionElements);

            $(_xml).find("wlan_settings").each(function() {
                _net_mode = $(_xml).find("net_mode").text();
            });

            _strSecurityType = this.getMode();

            strSSID = $(_xml).find("ssid").text();
            document.getElementById("tbSSID").value = UniDecode(strSSID);

            $(_xml).find("autosleep_mi").each(function() {
                wpsbtneffect = $(_xml).find("wpsbtneffect").text();
            });
			
            var wapiSupport  = $(_xml).find("wapi_support").text();
            if(0 == wapiSupport)
            {
                $("#dropdownWAPI").hide();
            }
            else
            {
                $("#dropdownWAPI").show();
            }

            ssid_bcast = $(_xml).find("ssid_bcast").text();
            _radVINwStatus.setRadioButton(ssid_bcast);


            //切换到不加密模式会清空WPA2-PSK和MIXED 密码
            //事先保存密码，如果密码被清空显示保存的密码
            
			/*$(_xml).find("Mixed").each(function() {
                strPass = $(this).find("key").text();
				if("" != strPass)
                {
                    g_strMixedPasswd = strPass;
                }else{
                $(_xml).find("WPA2-PSK").each(function() {
                strPass = $(this).find("key").text();
				if("" != strPass)
                {
                    g_strWpa2PskPasswd = strPass;
                }
            });
                }
            }); */
			
            document.getElementById("drpdwnSecurityType").value = _strSecurityType;
            g_strEncryptionMode = _strSecurityType;

            switch (_strSecurityType) {
                case 'WPA2-PSK': {
                    if(1 == ssid_bcast) {
                        $("#divWpsCfgDlg").show();
                    } else {
                        $("#divWpsCfgDlg").hide();
                    }
                    this.loadWPA2_PSKData("WPA2-PSK");
                    break;
                }
                case 'Mixed': {
                    if(1 == ssid_bcast) {
                        $("#divWpsCfgDlg").show();
                    } else {
                        $("#divWpsCfgDlg").hide();
                    }
                    this.loadMixedData("Mixed");
                    break;
                }
                case 'WPA-PSK': {
                    if(1 == ssid_bcast) {
                        $("#divWpsCfgDlg").show();
                    } else {
                        $("#divWpsCfgDlg").hide();
                    }
                    this.loadWPA_PSKData("WPA-PSK");
                    break;
                }
                case 'None': {
                    if(1 == ssid_bcast) {
                        $("#divWpsCfgDlg").show();
                    } else {
                        $("#divWpsCfgDlg").hide();
                    }
                    this.loadDisabledData();
                    break;

                }
                case 'WEP': {
                    $("#divWpsCfgDlg").hide();
                    this.loadWEPData();
                    break;
                }
                case 'WAPI-PSK': {
                    $("#divWpsCfgDlg").hide();
                    this.loadWAPI_PSKData();
                    break;
                }
            }
			if(wpsbtneffect == 1){
				document.getElementById("DisableWPSBTNCheck").checked = true;
				document.getElementById('divWpsCfgDlg').style.display = 'block';
				
			}else{
				document.getElementById("DisableWPSBTNCheck").checked = false;
				document.getElementById('divWpsCfgDlg').style.display = 'none';
			}

            this.copyControlArray();
        }
        this.clearControlArray = function() {
            _controlMapExisting = null;
            _controlMapCurrent = null;
            _controlMapExisting = new Array(0);
            _controlMapCurrent = new Array(0);
        }
        this.copyControlArray = function() {
            _controlMapCurrent = g_objXML.copyArray(_controlMapExisting, _controlMapCurrent);
        }
        this.onPost = function(flag) {
            if (this.isValid()) {
                document.getElementById('lPassErrorMesPN').style.display = 'none';
                var _controlMap = this.getPostData();
                if (_controlMap.length > 0) {


                    if (flag) {
                        postXML(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap)));
                        //this.onLoad();
                    } else {
                        return _controlMap;
                    }

                }

            }
            return _controlMap;
        }
        this.onPostSuccess = function() {
            this.onLoad(false);
        }
        this.clearOption = function() {
            document.getElementById("divCipher").innerHTML = '<select id="drpdwnCipher" onchange="changedCiperSetting()"></select>';
        }
        this.getPostData = function() {

            var mode = document.getElementById("drpdwnSecurityType").value;
            switch (mode) {
                case 'WPA2-PSK': {
                    return this.getWPA2_PSKData();
                    break;
                }
                case 'Mixed': {
                    return this.getMixedData();
                    break;
                }
                /*  case 'WPA-PSK': {
                      return this.getWPA_PSKData();
                      break;
                  }*/
                case 'None': {
                    return this.getDisabledData();
                    break;

                }
                case 'WEP': {
                    return this.getWEPData();
                    break;
                }
                case 'WAPI-PSK': {
                    return this.getWAPI_PSKData();
                    break;
                }
            }
        }
        this.isValid = function() {
            var strSelected = document.getElementById("drpdwnSecurityType").value;
            if (strSelected == 'WPA2-PSK' || strSelected == 'Mixed' /*|| strSelected == 'WPA-PSK'*/) {
                if (isChineseChar($("#tbpass").val())) {
                    document.getElementById('lPassErrorMesPN').style.display = 'block';
                    document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lChineseCharError');
                    return false;

                }

                if (isChineseChar($("#tbpassText").val())) {
                    document.getElementById('lPassErrorMesPN').style.display = 'block';
                    document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lChineseCharError');
                    return false;

                }
                if (document.getElementById("tbpass").style.display == "block") {
                    if (!(textBoxMinLength("tbpass", 8) && textBoxMinLength("tbre_password", 8))) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lminLengthError8');
                        return false;
                    }
                }
                if (document.getElementById("tbpassText").style.display == "block")
                    if (!(textBoxMinLength("tbpassText", 8) && textBoxMinLength("tbre_passwordtext", 8))) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lminLengthError8');
                        return false;
                    }
                if (document.getElementById("tbpass").style.display == "block")
                    if (!(textBoxMaxLength("tbpass", 64) && textBoxMaxLength("tbre_password", 64))) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lmaxLengthError64');
                        return false;
                    }
                if (document.getElementById("tbpassText").style.display == "block")
                    if (!(textBoxMaxLength("tbpassText", 64) && textBoxMaxLength("tbre_passwordtext", 64))) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lmaxLengthError64');
                        return false;
                    }
            }
            if (strSelected == 'WEP') {
                var pass = '';
                var value = document.getElementById("tbpass").value;
                if (document.getElementById("tbpassText").style.display == "block")
                    value = document.getElementById("tbpassText").value;

                if (document.getElementById("drpdwnEncryType").value == '0') {
					var re1 = /^[0-9a-zA-Z]{5}$/;
					if (re1.test(value)) {
	                    if (document.getElementById("tbpassText").style.display == "block") {
	                        if (!(textBoxLength("tbpassText", 5))) {
	                            document.getElementById('lPassErrorMesPN').style.display = 'block';
	                            document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lLengthError5');
	                            return false;
	                        }
	                    } else {
	                        if (!(textBoxLength("tbpass", 5))) {
	                            document.getElementById('lPassErrorMesPN').style.display = 'block';
	                            document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lLengthError5');
	                            return false;
	                        }
	                    }
					}else{
					 	document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lInvalidPassword');
                        return false;

					}
                } else if (document.getElementById("drpdwnEncryType").value == '1') {
                    var re1 = /^[0-9a-fA-F]{10}$/;
                    if (!re1.test(value)) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lInvalidPassword');
                        return false;

                    } else {
                        pass = value;
                        document.getElementById("tbpass").value = pass;
                        document.getElementById("tbpassText").value = pass;
                    }
                } else if (document.getElementById("drpdwnEncryType").value == '2') {
                	var re1 = /^[0-9a-zA-Z]{13}$/;
					if (re1.test(value)) {
	                    if (document.getElementById("tbpassText").style.display == "block") {
	                        if (!(textBoxLength("tbpassText", 13))) {
	                            document.getElementById('lPassErrorMesPN').style.display = 'block';
	                            document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lLengthError13');
	                            return false;
	                        }
	                    } else {
	                        if (!(textBoxLength("tbpass", 13))) {
	                            document.getElementById('lPassErrorMesPN').style.display = 'block';
	                            document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lLengthError13');
	                            return false;
	                        }
	                    }
					}else{
					 	document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lInvalidPassword');
                        return false;

					}
                } else if (document.getElementById("drpdwnEncryType").value == '3') {
                    var re3 = /^[0-9a-fA-F]{26}$/;
                    if (!re3.test(value)) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lInvalidPassword');
                        return false;

                    } else {
                        pass = value;
                        document.getElementById("tbpass").value = pass;
                        document.getElementById("tbpassText").value = pass;
                    }
                }

            }
            if (strSelected == 'WAPI-PSK') {
                var pass = '';
                var value = _radKeyType.getRadioButton();
                if (value == '0') {
                    var re1 = /^[0-9]{8,64}$/;
                    var value1 = document.getElementById("tbpass").value;
                    if (document.getElementById("tbpassText").style.display == "block")
                        value1 = document.getElementById("tbpassText").value;

                    if (!re1.test(value1)) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lLengthError8_64');
                        return false;
                    }
                    value1 = document.getElementById("tbre_password").value;
                    if (document.getElementById("tbre_passwordtext").style.display == "block")
                        value1 = document.getElementById("tbpassText").value;

                    if (!re1.test(value1)) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lLengthError8_64');
                        return false;
                    }
                } else {
                    var re0 = /^[0-9a-fA-F]{8,64}$/;
                    var value1 = document.getElementById("tbpass").value;
                    if (document.getElementById("tbpassText").style.display == "block")
                        value1 = document.getElementById("tbpassText").value;

                    if (!re0.test(value1)) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lLengthError8_64hex');
                        return false;
                    }
                    value1 = document.getElementById("tbre_password").value;
                    if (document.getElementById("tbre_passwordtext").style.display == "block")
                        value1 = document.getElementById("tbpassText").value;

                    if (!re0.test(value1)) {
                        document.getElementById('lPassErrorMesPN').style.display = 'block';
                        document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lLengthError8_64hex');
                        return false;
                    }
                }
            }
            return true;
        }

        this.addRadios = function() {
            //_radEDNw =$("#nwRadio").enabled_disabled("nwRadio");
            _radVINwStatus = $("#nwRadiovisi").visible_invisible("nwRadiovisi");
            //   rbWiFiSetup = $("#rbWiFiSetup").enabled_disabled("rbWiFiSetup");
            _radKeyType = $("#RadioAH").ascii_hex("RadioAH");
            var c_rdRadio1 = document.getElementById('nwRadiovisiVisible');
            var c_rdRadio2 = document.getElementById('nwRadiovisiInvisible');
            c_rdRadio1.onclick = HideSsidClicked;
            c_rdRadio2.onclick = HideSsidClicked;
        }

        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/wireless/primary_network.html");
        }
        this.setXMLName = function(xmlname) {
            _xmlname = xmlname;
        }
        this.getMode = function() {
            var mode;
            if (navigator.appName.indexOf("Microsoft") != -1 && navigator.appVersion.indexOf("4.0 (compatible;") != -1) {
                mode = $(_xml).find("mode")[0].text;
            } else {
                // FIREFOX or others
                mode = $(_xml).find("mode")[0].textContent.toString();
            }
            return mode;
        }
        this.getNetMode = function() {
            var net_mode;
            if (navigator.appName.indexOf("Microsoft") != -1&& navigator.appVersion.indexOf("4.0 (compatible;") != -1) {
                net_mode = $(_xml).find("net_mode")[0].text;
            } else {
                // FIREFOX or others
                net_mode = $(_xml).find("net_mode")[0].textContent.toString();
            }
            return net_mode;
        }


        this.loadCommonSecurity = function(type) {
            var status = '';
            var strPass = '';
            var strCipher = '';
            var index = 0;
            var mode = "";
            //displayBlock("divCipher");
            displayBlock("lpass");
            //displayBlock("lwpa");
            displayBlock("lunmaskpass");
            displayBlock("chkUnmask");
            displayBlock("tbpass");
            mode = this.getMode();
            $(_xml).find(type).each(function() {
                strPass = $(this).find("key").text();
                strCipher = $(this).find("mode").text();
            });

            //切换到不加密模式会清空WPA2-PSK和MIXED 密码
            //事先保存密码，如果密码被清空显示保存的密码
/*            if("WPA2-PSK" == type)
            {
                if("" != strPass)
                {
                    g_strWpa2PskPasswd = strPass;
                }
                else
                {
                    strPass = g_strWpa2PskPasswd;
                }
            }
            if("Mixed" == type)
            {
                if("" != strPass)
                {
                    g_strMixedPasswd = strPass;
                }
                else
                {
                    strPass = g_strMixedPasswd;
                }
            }
*/
            document.getElementById("tbpass").maxLength = 64;
            document.getElementById("tbpassText").maxLength = 64;
            document.getElementById("tbre_password").maxLength = 64;
            document.getElementById("tbre_passwordtext").maxLength = 64;
            document.getElementById("tbpass").value = strPass;
            document.getElementById("tbre_password").value = strPass;
            document.getElementById("tbpassText").value = strPass;
            document.getElementById("tbre_passwordtext").value = strPass;
            document.getElementById("drpdwnCipher").value = strCipher;

            //   _controlMapExisting = g_objXML.putMapElement(_controlMapExisting,index++, "RGW/wlan_security/wps_enable", wps_enable);
            wpsbtneffect_load = wpsbtneffect;
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/ssid", strSSID);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/ssid_bcast", ssid_bcast);
			//_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/autosleep_mi/wpsbtneffect", wpsbtneffect);
			//_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/autosleep_mi/zm_enable_wps", "0");
			_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/mode", mode);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/" + type + "/key", strPass);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/" + type + "/mode", strCipher);
        }
        this.addOption = function(id, text, value) {
            var opt = document.createElement("option");
            document.getElementById(id).options.add(opt);
            opt.text = text;
            opt.value = value;

        }
        this.loadWPA2_PSKData = function(type) {
            clearPasswordCheckBox()
            if (_net_mode == 0) {
                this.addOption('drpdwnCipher', jQuery.i18n.prop('AES_Stronger'), 'AES-CCMP');
            } else {
                this.addOption('drpdwnCipher', jQuery.i18n.prop('TKIP_Strong'), 'TKIP');
                this.addOption('drpdwnCipher', jQuery.i18n.prop('AES_Stronger'), 'AES-CCMP');

                $(_xml).find("WPA-PSK").each(function() {
                    _cipher = $(this).find("mode").text();
                });

                if (_cipher == "TKIP") {
                    document.getElementById("drpdwnCipher").selectedIndex = 0;
                } else {
                    document.getElementById("drpdwnCipher").selectedIndex = 1;
                }
            }
            this.loadCommonSecurity(type);
        }

        this.loadWPA_PSKData = function(type) {
            clearPasswordCheckBox()
            if (_net_mode == 0) {
                this.addOption('drpdwnCipher', jQuery.i18n.prop('AES_Stronger'), 'AES-CCMP');
            } else {
                this.addOption('drpdwnCipher', jQuery.i18n.prop('TKIP_Strong'), 'TKIP');
                this.addOption('drpdwnCipher', jQuery.i18n.prop('AES_Stronger'), 'AES-CCMP');

                $(_xml).find("WPA-PSK").each(function() {
                    _cipher = $(this).find("mode").text();
                });

                if (_cipher == "TKIP") {
                    document.getElementById("drpdwnCipher").selectedIndex = 0;
                } else {
                    document.getElementById("drpdwnCipher").selectedIndex = 1;
                }
            }
            this.loadCommonSecurity(type);
        }
        this.loadMixedData = function(type) {
            clearPasswordCheckBox()
            this.addOption('drpdwnCipher', 'WPA-TKIP/WPA2-AES', 'AES-CCMP');
            this.loadCommonSecurity(type);

        }
        this.loadDisabledData = function() {
            var index = 0;
            var mode = '';

            mode = this.getMode();
			wpsbtneffect_load = wpsbtneffect;
            //_controlMapExisting = g_objXML.putMapElement(_controlMapExisting,index++, "RGW/wlan_security/wps_enable", wps_enable);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/ssid", strSSID);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/ssid_bcast", ssid_bcast);
			//_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/autosleep_mi/wpsbtneffect", wpsbtneffect);
			//_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/autosleep_mi/zm_enable_wps", "0");
			_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/mode", mode);
        }
        this.loadWAPI_PSKData = function() {
            var index = 0;
            var mode = '';
            var wapi_key_type;
            var wapi_key;
            clearPasswordCheckBox();
            displayBlock("div_wapi");
            displayBlock("chkUnmask");
            displayBlock("lpass");
            displayBlock("tbpass");
            displayBlock("lunmaskpass");

            $(_xml).find("WAPI-PSK").each(function() {
                wapi_key_type = $(this).find("key_type").text();
                wapi_key = $(this).find("key").text();
            });
            document.getElementById("tbpass").maxLength = 64;
            document.getElementById("tbpassText").maxLength = 64;
            document.getElementById("tbre_password").maxLength = 64;
            document.getElementById("tbre_passwordtext").maxLength = 64;
            document.getElementById("tbpass").value = wapi_key;
            document.getElementById("tbre_password").value = wapi_key;
            document.getElementById("tbpassText").value = wapi_key;
            document.getElementById("tbre_passwordtext").value = wapi_key;

            _radKeyType.setRadioButton(wapi_key_type);

            mode = this.getMode();
			wpsbtneffect_load = wpsbtneffect;
            //  _controlMapExisting = g_objXML.putMapElement(_controlMapExisting,index++, "RGW/wlan_security/wps_enable", wps_enable);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/ssid", strSSID);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/ssid_bcast", ssid_bcast);
			//_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/autosleep_mi/wpsbtneffect", wpsbtneffect);
			//_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/autosleep_mi/zm_enable_wps", "0");
			_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/mode", mode);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/WAPI-PSK/key_type", wapi_key_type);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/WAPI-PSK/key", wapi_key);
        }

        this.loadWEPData = function() {
            clearPasswordCheckBox();
            displayBlock("lAuth");
            displayBlock("drpdwnAuthType");
            displayBlock("lEncryption");
            displayBlock("drpdwnEncryType");
            displayBlock("chkUnmask");
            displayBlock("lpass");
            displayBlock("tbpass");
            displayBlock("lunmaskpass");

            var strPass = '';
            var strAuth = '';
            var strEncrypt = '';
            var status = '';
            var mode;
            var index = 0;
            mode = this.getMode();
            $(_xml).find("WEP").each(function() {
                strPass = $(this).find("key1").text();
                strAuth = $(this).find("auth").text();
                strEncrypt = $(this).find("encrypt").text();
            });
            document.getElementById("tbpass").maxLength = 28;
            document.getElementById("tbpassText").maxLength = 28;
            document.getElementById("tbre_password").maxLength = 28;
            document.getElementById("tbre_passwordtext").maxLength = 28;
            document.getElementById("tbpass").value = strPass;
            document.getElementById("tbre_password").value = strPass;
            document.getElementById("tbpassText").value = strPass;
            document.getElementById("tbre_passwordtext").value = strPass;

            document.getElementById("drpdwnAuthType").value = strAuth;
            document.getElementById("drpdwnEncryType").value = strEncrypt;
			wpsbtneffect_load = wpsbtneffect;
            //  _controlMapExisting = g_objXML.putMapElement(_controlMapExisting,index++, "RGW/wlan_security/wps_enable", wps_enable);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/ssid", strSSID);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/ssid_bcast", ssid_bcast);
			//_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/autosleep_mi/wpsbtneffect", wpsbtneffect);
			//_controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/autosleep_mi/zm_enable_wps", "0");
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/mode", mode);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/WEP/key1", strPass);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/WEP/auth", strAuth);
            _controlMapExisting = g_objXML.putMapElement(_controlMapExisting, index++, "RGW/wlan_security/WEP/encrypt", strEncrypt);
        }
        this.getCommonData = function() {
            var index = 0;
            var mapData = new Array(0);
            //  _controlMapCurrent[index++][1] = rbWiFiSetup.getRadioButton();
            var zmssid = UniEncode(document.getElementById("tbSSID").value);
			var wpsbtneffect_changed;
			//if(wpsbtneffect_load != wpsbtneffect)
			//	wpsbtneffect_changed = 1;
            _controlMapCurrent[index++][1] = zmssid.toLocaleUpperCase();
            _controlMapCurrent[index++][1] = _radVINwStatus.getRadioButton();
			//_controlMapCurrent[index++][1] = wpsbtneffect;
			//_controlMapCurrent[index++][1] = wpsbtneffect_changed;
            _controlMapCurrent[index++][1] = document.getElementById("drpdwnSecurityType").value;
            if (document.getElementById("tbpass").style.display == "block")
                _controlMapCurrent[index++][1] = document.getElementById("tbpass").value;
            if (document.getElementById("tbpassText").style.display == "block")
                _controlMapCurrent[index++][1] = document.getElementById("tbpassText").value;
            _controlMapCurrent[index++][1] = document.getElementById("drpdwnCipher").value;
            mapData = g_objXML.copyArray(_controlMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(_controlMapExisting, mapData, true);
            return mapData;
        }
        this.getWPA2_PSKData = function() {
            return this.getCommonData();
        }

        this.getWPA_PSKData = function() {
            return this.getCommonData();
        }
        this.getMixedData = function() {
            return this.getCommonData();
        }
        this.getDisabledData = function() {
            var mapData = new Array(0);
            var index = 0;
            //_controlMapCurrent[index++][1] = rbWiFiSetup.getRadioButton();
            var zmssid = UniEncode(document.getElementById("tbSSID").value);
			//if(wpsbtneffect_load != wpsbtneffect)
			//	wpsbtneffect_changed = 1;
            _controlMapCurrent[index++][1] = zmssid.toLocaleUpperCase();
            _controlMapCurrent[index++][1] = _radVINwStatus.getRadioButton();
			//_controlMapCurrent[index++][1] = wpsbtneffect;
			//_controlMapCurrent[index++][1] = wpsbtneffect_changed;
            _controlMapCurrent[index++][1] = "None";
            mapData = g_objXML.copyArray(_controlMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(_controlMapExisting, mapData, true);
            return mapData;
        }
        this.getWAPI_PSKData = function() {
            var mapData = new Array(0);
            var index = 0;
            // _controlMapCurrent[index++][1] = rbWiFiSetup.getRadioButton();
            var zmssid = UniEncode(document.getElementById("tbSSID").value);
			//if(wpsbtneffect_load != wpsbtneffect)
			//	wpsbtneffect_changed = 1;
            _controlMapCurrent[index++][1] = zmssid.toLocaleUpperCase();
            _controlMapCurrent[index++][1] = _radVINwStatus.getRadioButton();
			//_controlMapCurrent[index++][1] = wpsbtneffect;
			//_controlMapCurrent[index++][1] = wpsbtneffect_changed;
            _controlMapCurrent[index++][1] = document.getElementById("drpdwnSecurityType").value;
            _controlMapCurrent[index++][1] = _radKeyType.getRadioButton();
            if (document.getElementById("tbpass").style.display == "block")
                _controlMapCurrent[index++][1] = document.getElementById("tbpass").value;
            if (document.getElementById("tbpassText").style.display == "block")
                _controlMapCurrent[index++][1] = document.getElementById("tbpassText").value;
            mapData = g_objXML.copyArray(_controlMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(_controlMapExisting, mapData, true);
            return mapData;
        }
        this.getWEPData = function() {
            var index = 0;
            var mapData = new Array(0);
            //_controlMapCurrent[index++][1] = rbWiFiSetup.getRadioButton();
            var zmssid = UniEncode(document.getElementById("tbSSID").value);
			//if(wpsbtneffect_load != wpsbtneffect)
			//	wpsbtneffect_changed = 1;
            _controlMapCurrent[index++][1] = zmssid.toLocaleUpperCase();
            _controlMapCurrent[index++][1] = _radVINwStatus.getRadioButton();
			//_controlMapCurrent[index++][1] = wpsbtneffect;
			//_controlMapCurrent[index++][1] = wpsbtneffect_changed;
            _controlMapCurrent[index++][1] = document.getElementById("drpdwnSecurityType").value;
            if (document.getElementById("tbpass").style.display == "block")
                _controlMapCurrent[index++][1] = document.getElementById("tbpass").value;
            if (document.getElementById("tbpassText").style.display == "block")
                _controlMapCurrent[index++][1] = document.getElementById("tbpassText").value;
            _controlMapCurrent[index++][1] = document.getElementById("drpdwnAuthType").value;
            _controlMapCurrent[index++][1] = document.getElementById("drpdwnEncryType").value;
            mapData = g_objXML.copyArray(_controlMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(_controlMapExisting, mapData, true);
            return mapData;

        }

        this.dispalyAllNone = function() {
            document.getElementById("lAuth").style.display = "none";
            document.getElementById("drpdwnAuthType").style.display = "none";
            document.getElementById("lEncryption").style.display = "none";
            document.getElementById("drpdwnEncryType").style.display = "none";
            document.getElementById("tbpass").style.display = "none";
            document.getElementById('chkUnmask').style.display = 'none';
            document.getElementById('lpass').style.display = 'none';
            document.getElementById('chkUnmask').style.display = 'none';
            document.getElementById('lunmaskpass').style.display = 'none';
            document.getElementById('lRetypePassword').style.display = 'none';
            document.getElementById('tbre_password').style.display = 'none';
            document.getElementById('lwpa').style.display = 'none';
            document.getElementById('divCipher').style.display = 'none';
            document.getElementById('tbpassText').style.display = 'none';
            document.getElementById('tbre_passwordtext').style.display = 'none';
            document.getElementById('lPassErrorMesPN').style.display = 'none';
            document.getElementById('div_wapi').style.display = 'none';
        }

        return this.each(function() {
        });
    }
})(jQuery);

function HideSsidClicked() {
    if (document.getElementById("nwRadiovisiInvisible").checked) {
        var ret = confirm(jQuery.i18n.prop("lWpsDisabledInSsidHideStatus"));
        if(ret) {
            $("#divWpsCfgDlg").hide();
        } else {
            document.getElementById("nwRadiovisiVisible").checked = true;
        }

    } else {
        $("#divWpsCfgDlg").show();
    }
}



function ShowWPSCfgDlg() {
    sm("MBAddWPSClient", 300, 200);
    localizeWPSDialog();
    if (IsWpsMatch) {
        WPSItervalID = setInterval("QueryWpsStatus()", 3000);
    }
}


function QueryWpsStatus() {

    _WPSXML = callProductXML("uapxb_wlan_security_settings");
    var WPSStatus = $(_WPSXML).find("wps_status").text();

    $("#btnRegister").prop("disabled", false);
    $("#btnPush").prop("disabled", false);
    $("#txtRouterPinMB").prop("disabled", false);
    $("#divcancel_session").hide();

    IsWpsMatch = false;
    if (WPSStatus == 0) {
        $("#lWPSStatus").text("");
    } else if (WPSStatus == 1) {
        $("#btnRegister").prop("disabled", true);
        $("#btnPush").prop("disabled", true);
        $("#txtRouterPinMB").prop("disabled", true);
        $("#divcancel_session").show();
        $("#lWPSStatus").text(jQuery.i18n.prop("lWpsMatchPro"));
        IsWpsMatch = true;
    } else if (WPSStatus == 2) {
        $("#lWPSStatus").text(jQuery.i18n.prop("lWpsMatchSuccess"));
    } else if (WPSStatus == 3) {
        $("#lWPSStatus").text(jQuery.i18n.prop("lWpsMatchFailed"));
    } else if (WPSStatus == 4) {
        $("#lWPSStatus").text(jQuery.i18n.prop("lWpsMatchInterrupt"));
    } else if (WPSStatus == 5) {
        $("#lWPSStatus").text(jQuery.i18n.prop("lWpsPinCheckFail"));
    } else {
        $("#lWPSStatus").text("Unkown Error.");
    }

}

function QueryWpsStatusEx() {

    _WPSXML = callProductXML("uapxb_wlan_security_settings");
    var WPSStatus = $(_WPSXML).find("wps_status").text();
    if (WPSStatus == 1) {
        setTimeout("QueryWpsStatusEx", 1000);
    }  else if (WPSStatus == 3) {
        showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lWpsMatchFailed"));
    } else if (WPSStatus == 4) {
        showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lWpsMatchInterrupt"));
    } else if (WPSStatus == 5) {
        showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lWpsPinCheckFail"));
    }
}


function localizeWPSDialog() {
    $("#h1AddWPSClient").text(jQuery.i18n.prop("h1AddWPSClient"));
    $("#lWPStext").text(jQuery.i18n.prop("lWPStext"));
    $("#lCancelWpsSession").text(jQuery.i18n.prop("lCancelWpsSession"));
    $("#spanWPSPushButton").text(jQuery.i18n.prop("spanWPSPushButton"));
    $("#spanEnterPin").text(jQuery.i18n.prop("spanEnterPin"));
    $("#btnPush").val(jQuery.i18n.prop("btnPush"));
    $("#btnRegister").val(jQuery.i18n.prop("btnRegister"));
    $("#btnClose").val(jQuery.i18n.prop("btnClose"));

}

function btnPushClicked() {
    var mapData = new Array(0);
    mapData = putMapElement(mapData, "RGW/wlan_security/WPS/connect_method", 1, 0);
    postXML("uapxb_wlan_security_settings", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    clearInterval(WPSItervalID);
    IsWpsMatch = true;
}
function btnRegisterClicked() {
    var mapData = new Array(0);
    var client_pin = $("#txtRouterPinMB").val();
    if("-" == client_pin.substr(4,1)) {
        client_pin = client_pin.replace("-","");
    }

    if ((client_pin.length == 8 || client_pin.length == 4)&& Number(client_pin)) {
        mapData = putMapElement(mapData, "RGW/wlan_security/WPS/connect_method", 2,0);
        mapData = putMapElement(mapData, "RGW/wlan_security/WPS/wps_pin", client_pin,1);
        postXML("uapxb_wlan_security_settings", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
        IsWpsMatch = true;
        setTimeout(QueryWpsStatusEx, 3000);
    } else {
        $("#lWPSError").show();
        $("#lWPSError").text(jQuery.i18n.prop("lWPSPinError"));
    }
    clearInterval(WPSItervalID);
}


function cancelSessionClicked() {

    var mapData = new Array(0);
    mapData = putMapElement(mapData,"RGW/wlan_security/WPS/connect_method", 3,0);
    postXML("uapxb_wlan_security_settings", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    clearInterval(WPSItervalID);
    IsWpsMatch = true;
}

function WPSClientClose() {
    hm();
    clearInterval(WPSItervalID);
}

function changedCiperSetting() {
    var linkObj = document.getElementById("drpdwnCipher");
    var value = linkObj.options[linkObj.selectedIndex].value;
    if("TKIP" == value) {
        if($("#divWpsCfgDlg").show())
            $("#divWpsCfgDlg").hide()
        }

    if("AES-CCMP" == value) {
        if($("#divWpsCfgDlg").hide()) {
            var linkObj = document.getElementById("drpdwnSecurityType");
            var value = linkObj.options[linkObj.selectedIndex].value;
            switch (value) {

                case 'WPA2-PSK': {
                    $("#divWpsCfgDlg").show();
                    break;
                }

                case 'WPA-PSK': {
                    $("#divWpsCfgDlg").show();
                    break;
                }

            }
        }
    }

}

function RouterPinMBChange() {
    document.getElementById("lWPSError").style.display = "none";
}

function clearPasswordCheckBox() {
    document.getElementById("chkUnmask").checked = false;
    document.getElementById("tbpassText").style.display = "none";
    document.getElementById("tbre_passwordtext").style.display = "none"
}

function changedSecuritySetting() {

    var linkObj = document.getElementById("drpdwnSecurityType");
    var value = linkObj.options[linkObj.selectedIndex].value;
    g_objContent.dispalyAllNone();
    g_objContent.clearOption();
    g_objContent.clearControlArray();
    switch (value) {
        case 'WPA2-PSK': {
            $("#divWpsCfgDlg").show();
            g_objContent.loadWPA2_PSKData("WPA2-PSK");
            break;
        }
        case 'Mixed': {
            $("#divWpsCfgDlg").show();
            g_objContent.loadMixedData("Mixed");
            break;
        }
        case 'WPA-PSK': {
            $("#divWpsCfgDlg").show();
            g_objContent.loadWPA_PSKData("WPA-PSK");
            break;
        }
        case 'None': {
            var ret = confirm(jQuery.i18n.prop("lNoneEncrypModeTip"));
            if(!ret) {
                $("#drpdwnSecurityType").val(g_strEncryptionMode);
                changedSecuritySetting();
            }
            $("#divWpsCfgDlg").show();
            g_objContent.loadDisabledData();
            break;
        }
        case 'WEP': {

            if (_net_mode == 0) {
                showAlert(jQuery.i18n.prop("lnoWEPfor11n"));
                document.getElementById("drpdwnSecurityType").value = _strSecurityType;
                changedSecuritySetting();
            } else {
                var ret = confirm(jQuery.i18n.prop("lWpsDisabledInWepMode"));
                if(ret) {
                    $("#divWpsCfgDlg").hide();
                } else {
                    $("#drpdwnSecurityType").val(g_strEncryptionMode);
                    changedSecuritySetting();
                }
                g_objContent.loadWEPData();
            }

            break;
        }
        case 'WAPI-PSK': {
            $("#divWpsCfgDlg").hide();
            g_objContent.loadWAPI_PSKData();
            break;
        }
    }
    g_objContent.copyControlArray();
    g_strEncryptionMode = $("#drpdwnSecurityType").val();

}
function unmaskPassword() {
    var strPass = '';
    var strRepass = '';
    if (document.getElementById("chkUnmask").checked) {
        if (document.getElementById("tbpass").style.display == "block" || document.getElementById("tbpassText").style.display == "block") {
            strPass = document.getElementById("tbpass").value;
            document.getElementById("tbpassText").style.display = "block";
            document.getElementById("tbpass").style.display = "none";
            document.getElementById("tbpassText").value = strPass;
        }
        if (document.getElementById("tbre_password").style.display == "block" || document.getElementById("tbre_passwordtext").style.display == "block") {
            strRepass = document.getElementById("tbre_password").value;
            document.getElementById("tbre_passwordtext").style.display = "block";
            document.getElementById("tbre_password").style.display = "none";
            document.getElementById("tbre_passwordtext").value = strRepass;
        }

    } else {
        if (document.getElementById("tbpass").style.display == "block" || document.getElementById("tbpassText").style.display == "block") {
            strPass = document.getElementById("tbpassText").value;
            document.getElementById("tbpass").style.display = "block";
            document.getElementById("tbpassText").style.display = "none";
            document.getElementById("tbpass").value = strPass;
        }
        if (document.getElementById("tbre_password").style.display == "block" || document.getElementById("tbre_passwordtext").style.display == "block") {
            strRepass = document.getElementById("tbre_passwordtext").value;
            document.getElementById("tbre_password").style.display = "block";
            document.getElementById("tbre_passwordtext").style.display = "none";
            document.getElementById("tbre_password").value = strRepass;
        }


    }
}
function validateSecurityPassword() {
	var valid_ssid1_length = valid_ssid();
	if(valid_ssid1_length>31){
		document.getElementById('lSSIDErrorLogs').style.display = "block";
		document.getElementById("lSSIDErrorLogs").innerHTML = jQuery.i18n.prop('lSSIDErrorMes2');
		return;
		}else{
		document.getElementById('lSSIDErrorLogs').style.display = "none";
		}
	/*if(!valid_ssid1){
		document.getElementById('lSSIDErrorLogs').style.display = "block";
		document.getElementById("lSSIDErrorLogs").innerHTML = jQuery.i18n.prop('lSSIDErrorMes');
		return;
		}else{
		document.getElementById('lSSIDErrorLogs').style.display = "none";
		}*/
    if (document.getElementById('tbpass').style.display == "block") {
        if (document.getElementById('tbpass').value != document.getElementById('tbre_password').value) {
            document.getElementById('lPassErrorMesPN').style.display = 'block';
            document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lPassErrorMes');
            document.getElementById("tbre_password").value = '';
        } else {
            document.getElementById('lPassErrorMesPN').style.display = 'none';
            setData();
        }
    } else {
        if (document.getElementById('tbre_passwordtext').value != document.getElementById('tbpassText').value) {
            document.getElementById('lPassErrorMesPN').style.display = 'block';
            document.getElementById('lPassErrorMesPN').innerHTML = jQuery.i18n.prop('lPassErrorMes');
            document.getElementById("tbre_passwordtext").value = '';
        } else {
            document.getElementById('lPassErrorMesPN').style.display = 'none';
            setData();
        }
    }

}
function securityPasswordChanged() {
    if (!document.getElementById("chkUnmask").checked) {
        document.getElementById("tbre_password").value = '';
        document.getElementById('lRetypePassword').style.display = 'block';
        document.getElementById('tbre_password').style.display = 'block';
    } else {
        document.getElementById("tbre_passwordtext").value = '';
        document.getElementById('lRetypePassword').style.display = 'block';
        document.getElementById('tbre_passwordtext').style.display = 'block';

    }
}

function valid_ssid(){
	var s = document.getElementById('tbSSID').value
	 s= utf8.encode(s);
return s.length//(ssidRegex.test(document.getElementById('tbSSID').value));
}

function btnWpsSwitchSetting(){
	var mapData = new Array();
    putMapElement(mapData, "RGW/autosleep_mi/wpsbtneffect", wpsbtneffect, 0);
    putMapElement(mapData, "RGW/autosleep_mi/zm_enable_wps", 1, 1);
	postXML("uapxb_wlan_security_settings", g_objXML.getXMLDocToString(g_objXML.createXML(mapData )));
	hm();
	sm('rebootRouterModalBox',319,170);
    document.getElementById("h1RebootRouter").innerHTML = jQuery.i18n.prop("h1RebootRouter");
    document.getElementById("lRebootedRouter").innerHTML = jQuery.i18n.prop("lRebootedRouter");


    afterRebootID =  setInterval("afterReboot()", 45000);
}

function DisableWPSBTNCheckChange(){
	
    if (document.getElementById("DisableWPSBTNCheck").checked){
			document.getElementById('divWpsCfgDlg').style.display = 'block';
			wpsbtneffect = "1";
    }else {
    		document.getElementById('divWpsCfgDlg').style.display = 'none';
        	wpsbtneffect = "0";
    }
	if(wpsbtneffect != wpsbtneffect_load)
	sm("ZMWPSSWITCH", 300, 100);
	$("#h1WPSSWITCH").text(jQuery.i18n.prop("h1WPSSWITCH"));
	$("#lWPSswitchtext").text(jQuery.i18n.prop("lWPSswitchtext"));
	$("#btnOK_WPS").val(jQuery.i18n.prop("btnOK_WPS"));
	$("#btnCancel").text(jQuery.i18n.prop("btnCancel"));
}

function btnWpsSwitchCancel() {
	wpsbtneffect = wpsbtneffect_load;
	if(wpsbtneffect == 1){
				document.getElementById("DisableWPSBTNCheck").checked = true;
				document.getElementById('divWpsCfgDlg').style.display = 'block';
				
			}else{
				document.getElementById("DisableWPSBTNCheck").checked = false;
				document.getElementById('divWpsCfgDlg').style.display = 'none';
			}
    hm();
    //clearInterval(WPSItervalID);
}