var DhcpStart;
var strRuleName = "";
var bEditRule = false;
var nEditRuleIdx;
(function($) {

    $.fn.objPort_Forward = function(InIt) {

        var _xmlname = '';
        var mapData;
        var _xml = '';
        var _arrayTableDataCustomPW = new Array(0);
        var _enableStatus = null;
        var _rdRadioPF;
        this.onLoad = function() {
            _arrayTableDataCustomPW = new Array(0);

            var indexCustomPW = 0;
            var ruleName;
            var enabled;
            var pfIPAddress;
            var pfPort;
            var protocol;
            var _xmlTemplate;

            this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("th");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("td");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("h1");
            lableLocaliztion(arrayLabels);

            var buttonID = document.getElementById("btnOk").id;
            buttonLocaliztion(buttonID);

            buttonID = document.getElementById("btUpdate").id;
            buttonLocaliztion(buttonID);

            buttonID = document.getElementById("btnAddRule").id;
            buttonLocaliztion(buttonID);


            _xml = callProductXML(_xmlname);
            var _portforward_enable = $(_xml).find("pf_enable").text();
            _rdRadioPF.setRadioButton(_portforward_enable);

            if (_portforward_enable == '0') {
                document.getElementById('pf_rules_settings').style.display = 'none';
                flag = 1;
            }

            DhcpStart = $(_xml).find("start").text();
            $(_xml).find("port_forwarding_list").each(function() {
                $(this).find("Item").each(function() {
                    ruleName = UniDecode($(this).find("rulename").text());
                    ruleName = decodeURIComponent(ruleName);
                    pfIPAddress = $(this).find("pw_ip").text();
                    pfPort = $(this).find("pw_port").text();
                    protocol = $(this).find("protocol").text();

                    _arrayTableDataCustomPW[indexCustomPW] = new Array(8);
                    _arrayTableDataCustomPW[indexCustomPW][0] = indexCustomPW;
                    _arrayTableDataCustomPW[indexCustomPW][1] = ruleName;
                    _arrayTableDataCustomPW[indexCustomPW][2] = pfIPAddress;
                    _arrayTableDataCustomPW[indexCustomPW][3] = pfPort;
                    _arrayTableDataCustomPW[indexCustomPW][4] = protocol;
                    indexCustomPW++;
                });
            });
            this.loadTableData(_arrayTableDataCustomPW);

        }

        this.addRadios = function() {
            _enableStatus = $("#rbRuleEnable").enabled_disabled("rbRuleEnable");
        }

        this.setRadioStatus = function(status) {
            _enableStatus.setRadioButton(status);
        }

        this.getRadioStatus = function() {
            return _enableStatus.getRadioButton();
        }
        this.onPostSuccess = function() {
            this.onLoad(true);
        }

        this.loadTableData = function(arrayTableData) {

            var tableCustomPW = document.getElementById('tableCustomPW');
            var tBodytable = tableCustomPW.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableCustomPW');
            if (arrayTableData.length == 0) {
                var row1 = tBodytable.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 8;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            } else {
                for (var i = 0; i < arrayTableData.length; i++) {
                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodytable.insertRow(-1);

                    var indexCol = row.insertCell(0);
                    var ruleNameCol = row.insertCell(1);
                    var pfIPAddressCol = row.insertCell(2);
                    var pfPort = row.insertCell(3);
                    var protocolCol = row.insertCell(4);
                    var closeCol = row.insertCell(5);

                    indexCol.style.display = 'none';
                    indexCol.innerHTML = arrayTableDataRow[0];
                    var _name = decodeURIComponent(arrayTableDataRow[1]);
                    ruleNameCol.innerHTML = "<a href='#' onclick='customPWRuleClicked(" + i + ")'>" + _name + "</a>";
                    if (arrayTableDataRow[2] == "0.0.0.0")
                        pfIPAddressCol.innerHTML = "Any";
                    else
                        pfIPAddressCol.innerHTML = arrayTableDataRow[2];
                    if (arrayTableDataRow[3] == "0:0")
                        pfPort.innerHTML = "Any";
                    else
                        pfPort.innerHTML = arrayTableDataRow[3];
                    protocolCol.innerHTML = arrayTableDataRow[4];
                    closeCol.className = "close";
                    closeCol.innerHTML = "<a href='#' onclick='deleteCustomPWRule(" + i + ")'><img src='images/close.png' alt='' border='0' /></a>";
                }
            }
            Table.stripe(tableCustomPW, "alternate", "table-stripeclass");
        }

        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/home_network/port_forwarding.html");
            _rdRadioPF = $("#rdRadioPF").enabled_disabled("rdRadioPF");
            Table.auto();
            _lastSortValue = true;
        }
        this.setXMLName = function(xmlname) {
            _xmlname = xmlname;
        }

        this.postCustomPWItem = function(index, isDeleted, name, pf_ip, pf_port, protocol) {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();
            var RadioPF;
            RadioPF = _rdRadioPF.getRadioButton();

            this.putMapElement("RGW/port_forwarding/pf_enable", RadioPF, itemIndex++);
            if (RadioPF == '1') { //enable
                if (isDeleted) {
					
                    var _name = UniEncode(_arrayTableDataCustomPW[index][1]);
					_name = encodeURIComponent(_name);
                    this.putMapElement("RGW/port_forwarding/port_forwarding_list/Item#index", index, itemIndex++);
                    this.putMapElement("RGW/port_forwarding/port_forwarding_list/Item/rulename#delete", _name, itemIndex++);
                } else {
                    name = encodeURIComponent(name);
                    this.putMapElement("RGW/port_forwarding/port_forwarding_list/Item#index", index, itemIndex++);
                    this.putMapElement("RGW/port_forwarding/port_forwarding_list/Item/rulename", name, itemIndex++);
                    if (pf_ip != "...") {
                        this.putMapElement("RGW/port_forwarding/port_forwarding_list/Item/pw_ip", pf_ip, itemIndex++);
                    } else
                        this.putMapElement("RGW/port_forwarding/port_forwarding_list/Item/pw_ip", "0", itemIndex++);
                    if (pf_port != ":")
                        this.putMapElement("RGW/port_forwarding/port_forwarding_list/Item/pw_port", pf_port, itemIndex++);
                    else
                        this.putMapElement("RGW/port_forwarding/port_forwarding_list/Item/pw_port", "0", itemIndex++);

                    this.putMapElement("RGW/port_forwarding/port_forwarding_list/Item/protocol", protocol, itemIndex++);
                }
            }
            if (mapData.length > 0) {
                postXML(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
        }
        this.postEnableItem = function() {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();
            var RadioPF;
            RadioPF = _rdRadioPF.getRadioButton();

            this.putMapElement("RGW/port_forwarding/pf_enable", RadioPF, itemIndex++);
            if (mapData.length > 0) {
                postXML(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
        }
        this.putMapElement = function(xpath, value, index) {
            mapData[index] = new Array(2);
            mapData[index][0] = xpath;
            mapData[index][1] = value;
        }
        this.getTableCustomPWDataRow = function(index) {
            return _arrayTableDataCustomPW[index];
        }

        return this.each(function() {
        });
    }
})(jQuery);

function EDPFRadio() {
    if (document.getElementById('rdRadioPFEnabled').checked) {
        document.getElementById('pf_rules_settings').style.display = 'block';
    } else {
        document.getElementById('pf_rules_settings').style.display = 'none';
        flag = 1;
    }
}

function addCustomPFRule() {
    if (document.getElementById("tableCustomPW").rows.length <= 8) {
        sm("MBCustomPW", 400, 250);
        localizeMBPF();
        bEditRule = false;
    } else {
        showAlert(jQuery.i18n.prop("MaxRuleError"));
    }
}

function setFocusID(id1, id) {
    if (document.getElementById(id1).value.toString().length == "3")
        document.getElementById(id).focus();
}

function deleteCustomPWRule(index) {

    g_objContent.postCustomPWItem(index, true);

}

function customPWRuleClicked(index) {

    localizeMBPF();
    sm("MBCustomPW", 400, 250);
    bEditRule = true;
    //g_objContent.addRadios();
    document.getElementById("txtRulename").focus();
    var data = g_objContent.getTableCustomPWDataRow(index);
    document.getElementById("txtRulename").disabled = true;
    document.getElementById("txtRulename").value = data[1];
    strRuleName = data[1];
    nEditRuleIdx = index;

    if (data[2] != "0.0.0.0") {

        document.getElementById("txtPWIPAddress3").value = DhcpStart.split(".")[2];
        document.getElementById("txtPWIPAddress3").attributes["readonly"].value = "readonly";
        document.getElementById("txtPWIPAddress4").value = data[2].split(".")[3];
    }

    if (data[3] != "0:0") {
        document.getElementById("txtPWPortRange1").value = data[3].split(":")[0];
        document.getElementById("txtPWPortRange2").value = data[3].split(":")[1];
    }
    document.getElementById("pfSelect").value = data[4];
}

function btnOKClickedCustomPW() {

    var name, enabled, src_ip, src_port, protocol;

    name = document.getElementById("txtRulename").value;

    if ("" == name) {
        document.getElementById("lCustomFWError").style.display = "block";
        document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lEmptyName");
        return;
    }

   /* if (isChineseChar(name)) {
        document.getElementById("lCustomFWError").style.display = "block";
        document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lRuleNameIsChinese");
        return;
    }*/

    if (!deviceNameValidationchinese(name)) {
    document.getElementById("lCustomFWError").style.display = "block";
        document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lCustomFWSpecialCharsNotAllowed");
        return;
    }
	name = UniEncode(document.getElementById("txtRulename").value);
    document.getElementById("lCustomFWError").style.display = "none";

    if (name != "") {
    src_ip = document.getElementById("txtPWIPAddress1").value + "." +
                 document.getElementById("txtPWIPAddress2").value + "." +
                 document.getElementById("txtPWIPAddress3").value + "." +
                 document.getElementById("txtPWIPAddress4").value;

        src_port = document.getElementById("txtPWPortRange1").value + ":" +
                   document.getElementById("txtPWPortRange2").value;

        protocol = document.getElementById("pfSelect").value;

        var flag = isValidPWRule(src_ip, src_port);
        if (src_ip == "...")
            src_ip = "0.0.0.0";
        if (src_port == ":")
            src_port = "0:0";
        if (flag == 0) {
            if (bEditRule && name != strRuleName) {
                g_objContent.postCustomPWItem(nEditRuleIdx, true);
            }
            name = encodeURIComponent(name);
            hm();
            g_objContent.postCustomPWItem(0, false, name, src_ip, src_port, protocol);
        } else if (flag == 1) {
            document.getElementById("lCustomFWError").style.display = "block";
            document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lIncorrectPWIP");
        } else if (flag == 3) {
            document.getElementById("lCustomFWError").style.display = "block";
            document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lIncorrectPort");
        } else if (flag == 4) {
            document.getElementById("lCustomFWError").style.display = "block";
            document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lIncorrectPort");
        } else if (flag == 5) {
            document.getElementById("lCustomFWError").style.display = "block";
            document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lPWAtleastOne");
        }
    }
}
function btnEnableSave() {
    g_objContent.postEnableItem();
}
function btnCancelClickedCustomPW() {
    hm();
}

function localizeMBPF() {
    document.getElementById("h1CustomPWRule").innerHTML = jQuery.i18n.prop("h1CustomPWRule");
    document.getElementById("lRuleName_pw").innerHTML = jQuery.i18n.prop("lRuleName_pw");
    document.getElementById("lIP_pw").innerHTML = jQuery.i18n.prop("lIP_pw");
    document.getElementById("lPort_pw").innerHTML = jQuery.i18n.prop("lPort_pw");
    document.getElementById("lProtocol_pw").innerHTML = jQuery.i18n.prop("lProtocol_pw");
    document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
    document.getElementById("txtPWIPAddress3").value = DhcpStart.split(".")[2];
    document.getElementById("txtPWIPAddress3").attributes["readonly"].value = "readonly";
}


function isValidPWRule(ip1, ports1) {
    var flag = 0;

    if (ip1 == "..." && ports1 == ":")
        flag = 5;

    if (ip1 != "...") {
        if (!isIPFULL(ip1, true))
            flag = 1;
    }

    if (ports1 != ":") {
        var port11 = ports1.split(":")[0];
        var port12 = ports1.split(":")[1];
        if (!(isNumber(port11) && isNumber(port12)))
            flag = 3;
        if (Number(port11) > 65535 || Number(port11) < 1)
            flag = 3;
        if (Number(port12) > 65535 || Number(port12) < 1)
            flag = 3;
        if (Number(port11) > Number(port12))
            flag = 4;
    }
    return flag;

}

function btnAlertOkClicked() {
    hm();
}

function txtRulenameClicked() {
    document.getElementById("lCustomFWError").style.display = "none";
}


