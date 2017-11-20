(function($) {

    $.fn.objCustom_FW = function(InIt) {

        var _xmlname = '';
        var mapData;
        var _xml = '';
        var _arrayTableDataCustomFW = new Array(0);
        var _enableStatus = null;
        var filer_mode;
        var rdRadioIPFilterMode;

        this.onLoad = function() {
            _arrayTableDataCustomFW = new Array(0);

            var indexCustomFW = 0;
            var ruleName;
            var enabled;
            var srcIPAddress;
            var srcPort;
            var dstIPAddress;
            var dstPort;
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
            buttonID = document.getElementById("btnCancel").id;
            buttonLocaliztion(buttonID);

            buttonID = document.getElementById("btnTriggerOk").id;
            buttonLocaliztion(buttonID);

            buttonID = document.getElementById("btnAddRule").id;
            buttonLocaliztion(buttonID);


            _xml = callProductXML(_xmlname);
            $(_xml).find("custom_fw").each(function() {
                filer_mode = $(this).find("custom_rules_mode").text();
            });
            $(_xml).find("custom_rules_list").each(function() {
                $(this).find("Item").each(function() {
                    ruleName = UniDecode($(this).find("rule_name").text());
                    ruleName = decodeURIComponent(ruleName);
                    enabled = $(this).find("enabled").text();
                    srcIPAddress = $(this).find("src_ip").text();
                    srcPort = $(this).find("src_port").text();
                    dstIPAddress = $(this).find("dst_ip").text();
                    dstPort = $(this).find("dst_port").text();
                    protocol = $(this).find("proto").text();
                    _arrayTableDataCustomFW[indexCustomFW] = new Array(8);
                    _arrayTableDataCustomFW[indexCustomFW][0] = indexCustomFW;
                    _arrayTableDataCustomFW[indexCustomFW][1] = ruleName;
                    _arrayTableDataCustomFW[indexCustomFW][2] = enabled;
                    _arrayTableDataCustomFW[indexCustomFW][3] = srcIPAddress;
                    _arrayTableDataCustomFW[indexCustomFW][4] = srcPort;
                    _arrayTableDataCustomFW[indexCustomFW][5] = dstIPAddress;
                    _arrayTableDataCustomFW[indexCustomFW][6] = dstPort;
                    _arrayTableDataCustomFW[indexCustomFW][7] = protocol;
                    indexCustomFW++;
                });
            });
            rdRadioIPFilterMode.setRadioButton(filer_mode);
            this.loadTableData(_arrayTableDataCustomFW);
        }

        this.addRadios = function() {
            _enableStatus = $("#rbRuleEnable").enabled_disabled("rbRuleEnable");
            $("#rbRuleEnableEnabled").css("width", "20px");
            $("#rbRuleEnableDisabled").css("width", "20px");
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

            var tableCustomFW = document.getElementById('tableCustomFW');
            var tBodytable = tableCustomFW.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableCustomFW');
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
                    var enabledCol = row.insertCell(2);
                    var srcIPAddressCol = row.insertCell(3);
                    var srcPort = row.insertCell(4);
                    var dstIPAddressCol = row.insertCell(5);
                    var dstPort = row.insertCell(6);
                    var protocolCol = row.insertCell(7);
                    var closeCol = row.insertCell(8);

                    indexCol.style.display = 'none';
                    indexCol.innerHTML = arrayTableDataRow[0];
                    var _name = decodeURIComponent(arrayTableDataRow[1]);
                    ruleNameCol.innerHTML = "<a href='#' onclick='customFWRuleClicked(" + i + ")'>" + _name + "</a>";
                    enabledCol.innerHTML = arrayTableDataRow[2];
                    srcIPAddressCol.innerHTML = ((arrayTableDataRow[3] == "NA")?"N/A":arrayTableDataRow[3]);
                    srcPort.innerHTML = ((arrayTableDataRow[4] == "NA")?"N/A":arrayTableDataRow[4]);
                    dstIPAddressCol.innerHTML = ((arrayTableDataRow[5] == "NA")?"N/A":arrayTableDataRow[5]);
                    dstPort.innerHTML = ((arrayTableDataRow[6] == "NA")?"N/A":arrayTableDataRow[6]);
                    protocolCol.innerHTML = arrayTableDataRow[7];
                    closeCol.className = "close";
                    closeCol.innerHTML = "<a href='#' onclick='deleteCustomFWRule(" + i + ")'><img src='images/close.png' alt='' border='0' /></a>";
                }
            }
            Table.stripe(tableCustomFW, "alternate", "table-stripeclass");
        }

        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/home_network/custom_fw_rules.html");
            rdRadioIPFilterMode = $("#rdRadioIPFilterMode").allow_deny("rdRadioIPFilterMode");
            Table.auto();
            _lastSortValue = true;
        }
        this.setXMLName = function(xmlname) {
            _xmlname = xmlname;
        }

        this.postCustomFWItem = function(index, isDeleted, name, enabled, src_ip, src_nm, src_port, dst_ip, dst_nm, dst_port, protocol) {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();

            if (isDeleted) {
				var _name = UniEncode(_arrayTableDataCustomFW[index][1]);
                 _name = encodeURIComponent(_name);
                this.putMapElement("RGW/custom_fw/custom_rules_list/Item#index", index, itemIndex++);
                this.putMapElement("RGW/custom_fw/custom_rules_list/Item/rule_name#delete", _name, itemIndex++);
            } else {
                name = encodeURIComponent(name);
                this.putMapElement("RGW/custom_fw/custom_rules_list/Item#index", index, itemIndex++);
                this.putMapElement("RGW/custom_fw/custom_rules_list/Item/rule_name", name, itemIndex++);
                this.putMapElement("RGW/custom_fw/custom_rules_list/Item/enabled", enabled, itemIndex++);
                if (src_ip != "...") {
                    if (src_nm.length > 0)
                        src_ip = src_ip + "/" + src_nm;
                    this.putMapElement("RGW/custom_fw/custom_rules_list/Item/src_ip", src_ip, itemIndex++);
                } else
                    this.putMapElement("RGW/custom_fw/custom_rules_list/Item/src_ip", "NA", itemIndex++);
                if (src_port != ":")
                    this.putMapElement("RGW/custom_fw/custom_rules_list/Item/src_port", src_port, itemIndex++);
                else
                    this.putMapElement("RGW/custom_fw/custom_rules_list/Item/src_port", "NA", itemIndex++);
                if (dst_ip != "...") {
                    if (dst_nm.length > 0)
                        dst_ip = dst_ip + "/" + dst_nm;
                    this.putMapElement("RGW/custom_fw/custom_rules_list/Item/dst_ip", dst_ip, itemIndex++);
                } else
                    this.putMapElement("RGW/custom_fw/custom_rules_list/Item/dst_ip", "NA", itemIndex++);
                if (dst_port != ":")
                    this.putMapElement("RGW/custom_fw/custom_rules_list/Item/dst_port", dst_port, itemIndex++);
                else
                    this.putMapElement("RGW/custom_fw/custom_rules_list/Item/dst_port", "NA", itemIndex++);

                this.putMapElement("RGW/custom_fw/custom_rules_list/Item/proto", protocol, itemIndex++);
            }
            if (mapData.length > 0) {
                postXML(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
        }
        this.putMapElement = function(xpath, value, index) {
            mapData[index] = new Array(2);
            mapData[index][0] = xpath;
            mapData[index][1] = value;
        }
        this.getTableCustomFWDataRow = function(index) {
            return _arrayTableDataCustomFW[index];
        }

        this.onPost = function () {
            var _filter_mode;
            var itemIndex=0;
            mapData=null;
            mapData = new Array();
            _filter_mode = rdRadioIPFilterMode.getRadioButton();

            this.putMapElement("RGW/custom_fw/custom_rules_mode_action", 1, itemIndex++);
            this.putMapElement("RGW/custom_fw/custom_rules_mode", _filter_mode, itemIndex++);
            if(mapData.length > 0) {
                postXML(_xmlname,g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
        }
        return this.each(function() {
        });
    }
})(jQuery);

function addCustomFWRule() {
    if (document.getElementById("tableCustomFW").rows.length <= 8) {
        sm("MBCustomFW", 400, 280);
        localizeMB1();
        g_objContent.addRadios();
        g_objContent.setRadioStatus("1");
    } else {
        showAlert(jQuery.i18n.prop("MaxRuleError"));
    }
}

function deleteCustomFWRule(index) {

    g_objContent.postCustomFWItem(index, true);

}

function customFWRuleClicked(index) {
    sm("MBCustomFW", 400, 280);
    localizeMB1();
    g_objContent.addRadios();
    document.getElementById("txtRulename").focus();
    document.getElementById("txtRulename").focus();
    var data = g_objContent.getTableCustomFWDataRow(index);

    document.getElementById("txtRulename").value = data[1];
    document.getElementById("txtRulename").disabled = true;
    g_objContent.setRadioStatus(data[2]);

    if ("" != data[3] && "NA" != data[3]  ) {
        var ip = data[3].split("/")[0];
        var netmask = data[3].split("/")[1];
        if (undefined != ip.split(".")[0]) {
            document.getElementById("txtSrcIPAddress1").value = ip.split(".")[0];
        }
        if (undefined != ip.split(".")[1]) {
            document.getElementById("txtSrcIPAddress2").value = ip.split(".")[1];
        }
        if (undefined != ip.split(".")[2]) {
            document.getElementById("txtSrcIPAddress3").value = ip.split(".")[2];
        }
        if (undefined != ip.split(".")[3]) {
            document.getElementById("txtSrcIPAddress4").value = ip.split(".")[3];
        }
        if (undefined != netmask) {
            document.getElementById("txtSrcIPNetMask").value = netmask;
        }
    }

    if ("" != data[4]&& "NA" != data[4]) {
        if (undefined != data[4].split(":")[0]) {
            document.getElementById("txtSrcPortRange1").value = data[4].split(":")[0];
        }
        if (undefined != data[4].split(":")[1]) {
            document.getElementById("txtSrcPortRange2").value = data[4].split(":")[1];
        }
    }

    if ("" != data[5]&& "NA" != data[5]) {
        var ip = data[5].split("/")[0];
        var netmask = data[5].split("/")[1];
        if (undefined != ip.split(".")[0]) {
            document.getElementById("txtDstIPAddress1").value = ip.split(".")[0];
        }
        if (undefined != ip.split(".")[1]) {
            document.getElementById("txtDstIPAddress2").value = ip.split(".")[1];
        }
        if (undefined != ip.split(".")[2]) {
            document.getElementById("txtDstIPAddress3").value = ip.split(".")[2];
        }
        if (undefined != ip.split(".")[3]) {
            document.getElementById("txtDstIPAddress4").value = ip.split(".")[3];
        }
        if (undefined != netmask)
            document.getElementById("txtDstIPNetMask").value = netmask;
    }

    if ("" != data[6]&& "NA" != data[6]) {
        if (undefined != data[6].split(":")[0]) {
            document.getElementById("txtDstPortRange1").value = data[6].split(":")[0];
        }
        if (undefined != data[6].split(":")[1]) {
            document.getElementById("txtDstPortRange2").value = data[6].split(":")[1];
        }
    }

    if (undefined != data[7]) {
        document.getElementById("fwdSelect").value = data[7];
    }

}

function btnOKClickedCustomFW() {

    var name, enabled, src_ip, src_netmask, src_port, dst_ip, dst_netmask, dst_port, protocol;

    name = document.getElementById("txtRulename").value;
    if ("" == name) {
        document.getElementById("lCustomFWError").style.display = "block";
        document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lEmptyName");
        return;
    }

    /*if(isChineseChar(name)) {
        document.getElementById("lCustomFWError").style.display = "block";
        document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lRuleNameIsChinese");
        return;
    } */

    if (!deviceNameValidationchinese(name)) {
        document.getElementById("lCustomFWError").style.display = "block";
        document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lCustomFWSpecialCharsNotAllowed");
        return;
    }
		//name = UniEncode(document.getElementById("txtRulename").value);
    document.getElementById("lCustomFWError").style.display = "none";

    if (name != "") {
        enabled = g_objContent.getRadioStatus();
        src_ip = document.getElementById("txtSrcIPAddress1").value + "." +
                 document.getElementById("txtSrcIPAddress2").value + "." +
                 document.getElementById("txtSrcIPAddress3").value + "." +
                 document.getElementById("txtSrcIPAddress4").value;

        src_netmask = document.getElementById("txtSrcIPNetMask").value;

        src_port = document.getElementById("txtSrcPortRange1").value + ":" +
                   document.getElementById("txtSrcPortRange2").value;

        dst_ip = document.getElementById("txtDstIPAddress1").value + "." +
                 document.getElementById("txtDstIPAddress2").value + "." +
                 document.getElementById("txtDstIPAddress3").value + "." +
                 document.getElementById("txtDstIPAddress4").value;

        dst_netmask = document.getElementById("txtDstIPNetMask").value;

        dst_port = document.getElementById("txtDstPortRange1").value + ":" +
                   document.getElementById("txtDstPortRange2").value;

        protocol = document.getElementById("fwdSelect").value;

        var flag = isValidRule(src_ip, src_netmask, src_port, dst_ip, dst_netmask, dst_port);
        if (flag == 0) {
			name =UniEncode(name);
            name = encodeURIComponent(name);
            hm();
            g_objContent.postCustomFWItem(0, false, name, enabled, src_ip, src_netmask, src_port, dst_ip, dst_netmask, dst_port, protocol);
        } else if (flag == 1) {
            document.getElementById("lCustomFWError").style.display = "block";
            document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lIncorrectSrcIP");
        } else if (flag == 2) {
            document.getElementById("lCustomFWError").style.display = "block";
            document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lIncorrectDstIP");
        } else if (flag == 3) {
            document.getElementById("lCustomFWError").style.display = "block";
            document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lIncorrectPort");
        } else if (flag == 4) {
            document.getElementById("lCustomFWError").style.display = "block";
            document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lIncorrectPort");
        } else if (flag == 5) {
            document.getElementById("lCustomFWError").style.display = "block";
            document.getElementById("lCustomFWError").innerHTML = jQuery.i18n.prop("lAtleastOne");
        }
    }
}

function btnCancelClickedCustomFW() {
    hm();
}

function localizeMB1() {
    document.getElementById("h1CustomFWRule").innerHTML = jQuery.i18n.prop("h1CustomFWRule");
    document.getElementById("lRuleName_fw").innerHTML = jQuery.i18n.prop("lRuleName_fw");
    document.getElementById("lStatus_fw").innerHTML = jQuery.i18n.prop("lStatus_fw");
    document.getElementById("lSrcIP").innerHTML = jQuery.i18n.prop("lSrcIP");
    document.getElementById("lSrcPort").innerHTML = jQuery.i18n.prop("lSrcPort");
    document.getElementById("lDstIP").innerHTML = jQuery.i18n.prop("lDstIP");
    document.getElementById("lDstPort").innerHTML = jQuery.i18n.prop("lDstPort");
    document.getElementById("lProtocol").innerHTML = jQuery.i18n.prop("lProtocol");
    document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
}

function is_valid_netmask_num(nm) {
    ret = true;
    if (nm.length > 0) {
        if (!isNumber(nm))
            ret = false;
        if (Number(nm) < 1 || Number(nm) > 32)
            ret = false;
    }
    return ret;
}

function isValidRule(ip1, nm1, ports1, ip2, nm2, ports2) {
    var flag = 0;

    if (ip1 == "..." && ports1 == ":" && ip2 == "..." && ports2 == ":")
        flag = 5;

    if (ip1 != "...") {
        if (!isIPFULL(ip1, true))
            flag = 1;
        if (!is_valid_netmask_num(nm1))
            flag = 1;
    } else {
        if (nm1.length > 0)
            flag = 1;
    }
    if (ip2 != "...") {
        if (!isIPFULL(ip2, true))
            flag = 2;
        if (!is_valid_netmask_num(nm2))
            flag = 2;
    } else {
        if (nm2.length > 0)
            flag = 2;
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

    if (ports2 != ":") {
        var port21 = ports2.split(":")[0];
        var port22 = ports2.split(":")[1];
        if (!(isNumber(port21) && isNumber(port22)))
            flag = 3;
        if (Number(port21) > 65535 || Number(port21) < 1)
            flag = 3;
        if (Number(port22) > 65535 || Number(port22) < 1)
            flag = 3;
        if (Number(port21) > Number(port22))
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


