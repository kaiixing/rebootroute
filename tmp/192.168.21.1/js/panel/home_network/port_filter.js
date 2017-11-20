(function($) {

    $.fn.objPortFilter = function(InIt) {

        var _xmlname = '';
        var _xml = '';
        var arrayPortFilterRules = new Array(0);
        this.onLoad = function() {
            document.getElementById('Content').innerHTML = callProductHTML("html/home_network/port_filter.html");
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("th");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("span");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("h1");
            lableLocaliztion(arrayLabels);

            buttonLocaliztion("lt_portFilter_btnAddPortFilterRules");
            buttonLocaliztion("lt_portFilter_btnAddRule");
            buttonLocaliztion("lt_portFilter_stcSave");
            $("#lt_portFilter_btnCancelAddRule").text(jQuery.i18n.prop("lt_portFilter_btnCancelAddRule"));


            _xml = callProductXML(_xmlname);

            $(_xml).find("port_filter").each(function() {
                filter_mode = $(this).find("port_filter_mode").text();
            });
            arrayPortFilterRules.length = 0; //
            var itemIdx = 0;
            $(_xml).find("port_filter_list").each(function() {
                $(this).find("Item").each(function() {
                    var ruleName = UniDecode($(this).find("rule_name").text());
					ruleName = decodeURIComponent(ruleName);
                    var protocol = $(this).find("protocol").text();
                    var triggerPort = $(this).find("trigger_port").text();
                    var responsePort = $(this).find("response_port").text();

                    arrayPortFilterRules[itemIdx] = new Array(5);
                    arrayPortFilterRules[itemIdx][0] = itemIdx;
                    arrayPortFilterRules[itemIdx][1] = ruleName;
                    arrayPortFilterRules[itemIdx][2] = protocol;
                    arrayPortFilterRules[itemIdx][3] = triggerPort;
                    arrayPortFilterRules[itemIdx][4] = responsePort;
                    ++itemIdx;
                });
            });
            this.loadTableData(arrayPortFilterRules);
            if (1 == filter_mode) {
                $("#enabledPortFilter").prop("checked", true);
            } else {
                $("#disabledPortFilter").prop("checked", true);
            }

        }

        this.onPostSuccess = function() {
            this.onLoad(true);
        }

        this.loadTableData = function(arrayTableData) {

            var tablePortFilter = document.getElementById('tablePortFilter');
            var tBodytable = tablePortFilter.getElementsByTagName('tbody')[0];
            clearTabaleRows('tablePortFilter');
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
                    var protocol = row.insertCell(2);
                    var triggerPort = row.insertCell(3);
                    var responsePort = row.insertCell(4);
                    var closeCol = row.insertCell(5);

                    indexCol.style.display = 'none';
                    indexCol.innerHTML = arrayTableDataRow[0];
                    var _name = decodeURIComponent(arrayTableDataRow[1]);
                    ruleNameCol.innerHTML = "<a href='#' onclick='PortFilterRuleClicked(" + i + ")'>" + _name + "</a>";
                    protocol.innerHTML = arrayTableDataRow[2];
                    triggerPort.innerHTML = arrayTableDataRow[3] ;
                    responsePort.innerHTML = arrayTableDataRow[4];
                    closeCol.className = "close";
                    closeCol.innerHTML = "<a href='#' onclick='deletePortFilterRule(" + i + ")'><img src='images/close.png' alt='' border='0' /></a>";
                }
            }
            Table.stripe(tablePortFilter, "alternate", "table-stripeclass");
        }


        this.setXMLName = function(xmlname) {
            _xmlname = xmlname;
        }

        this.postPortFilterItem = function(index, operationFlag, ruleName, protocol, triggerPort, responsePost) {
            var itemIndex = 0;
            var mapData = new Array();
			ruleName = UniEncode(ruleName);
            ruleName = encodeURIComponent(ruleName);
            if (0 == operationFlag /*isDeleted*/) {
                mapData = putMapElement(mapData, "RGW/port_filter/port_filter_list/Item#index", index, itemIndex++);
                mapData = putMapElement(mapData, "RGW/port_filter/port_filter_list/Item/rule_name#delete", ruleName, itemIndex++);
            } else {
                if (1 == operationFlag/*add*/) {
                    mapData = putMapElement(mapData, "RGW/port_filter/port_filter_list/Item#index", arrayPortFilterRules.length, itemIndex++);
                } else { /*edit*/
                    mapData = putMapElement(mapData, "RGW/port_filter/port_filter_list/Item#index", index, itemIndex++);
                }

                mapData = putMapElement(mapData, "RGW/port_filter/port_filter_list/Item/rule_name", ruleName, itemIndex++);
                mapData = putMapElement(mapData, "RGW/port_filter/port_filter_list/Item/protocol", protocol, itemIndex++);
                mapData = putMapElement(mapData, "RGW/port_filter/port_filter_list/Item/trigger_port", triggerPort, itemIndex++);
                mapData = putMapElement(mapData, "RGW/port_filter/port_filter_list/Item/response_port", responsePost, itemIndex++);
            }
            postXML(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
        }

        this.getTablePortFilterDataRow = function(index) {
            return arrayPortFilterRules[index];
        }

        this.onPost = function() {
            var filterMode;
            if ($("#enabledPortFilter").prop("checked")) {
                filterMode = 1;
            } else {
                filterMode = 0;
            }

            var itemIndex = 0;
            var mapData = new Array();

            mapData = putMapElement(mapData, "RGW/port_filter/port_filter_mode", filterMode, itemIndex++);
            postXML(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
        }

        return this.each(function() {
        });
    }
})(jQuery);

var operationFlag = -1;
var editPortFilterRuleItemIdx;
function addPortFilterRule() {
    operationFlag = 1;
    if (document.getElementById("tablePortFilter").rows.length <= 8) {
        sm("MBPortFilter", 400, 250);
        LocalMBPortFilter();
        $("#txtRulename").val("");
        $("#PortFilterProtocolSel").val("");
        $("#txtTriggerStartPort").val("");
        $("#txtTriggerEndPort").val("");
        $("#txtResponseStartPort").val("");
        $("#txtResponseEndPort").val("");
    } else {
        showAlert(jQuery.i18n.prop("MaxRuleError"));
    }
}

function deletePortFilterRule(index) {
    operationFlag = 0;
    var portItem = g_objContent.getTablePortFilterDataRow(index);
    var ruleName = portItem[1];
    g_objContent.postPortFilterItem(index, 0,ruleName);

}

function PortFilterRuleClicked(index) {
    sm("MBPortFilter", 400, 250);
    LocalMBPortFilter();
    operationFlag = 2;
    editPortFilterRuleItemIdx = index + 1;
    var data = g_objContent.getTablePortFilterDataRow(index);
    document.getElementById("txtRulename").disabled = true;
    document.getElementById("txtRulename").value = data[1];
    $("#txtRulename").val(data[1]);
    $("#PortFilterProtocolSel").val(data[2]);
    if("NA" != data[3]) {
        var triggerPort = data[3];
        $("#txtTriggerStartPort").val(triggerPort.split(":")[0]);
        $("#txtTriggerEndPort").val(triggerPort.split(":")[1]);
    } else {
        $("#txtTriggerStartPort").val("");
        $("#txtTriggerEndPort").val("");
    }

    if("NA" != data[4]) {
        var responsePort = data[4];
        $("#txtResponseStartPort").val(responsePort.split(":")[0]);
        $("#txtResponseEndPort").val(responsePort.split(":")[1]);
    } else {
        $("#txtResponseStartPort").val("");
        $("#txtResponseEndPort").val("");

    }

}

function AddRule() {
    var name = $("#txtRulename").val();
    var protocol = $("#PortFilterProtocolSel").val();
    var triggerStartPort = $("#txtTriggerStartPort").val();
    var triggerEndPort = $("#txtTriggerEndPort").val();
    var responseStartPort = $("#txtResponseStartPort").val();
    var responseEndPort = $("#txtResponseEndPort").val();

    if ("" == name) {
        document.getElementById("lPortFilterError").style.display = "block";
        document.getElementById("lPortFilterError").innerHTML = jQuery.i18n.prop("lEmptyName");
        return;
    }

    if (!deviceNameValidationchinese(name)) {
        document.getElementById("lPortFilterError").style.display = "block";
        document.getElementById("lPortFilterError").innerHTML = jQuery.i18n.prop("lCustomFWSpecialCharsNotAllowed");
        return;
    }
	name = $("#txtRulename").val();
    if (triggerStartPort == "" && responseStartPort == "") {
        document.getElementById("lPortFilterError").style.display = "block";
        document.getElementById("lPortFilterError").innerHTML = jQuery.i18n.prop("lStartPortIsEmpty");
        return;
    }

    //端口号取值1-65535
    if (!CheckPortNum(triggerStartPort) || !CheckPortNum(triggerEndPort) || !CheckPortNum(responseStartPort) || !CheckPortNum(responseEndPort)) {
        return;
    }

    if( (triggerStartPort != "" && triggerEndPort == "")
        || (triggerStartPort == "" && triggerEndPort != "") ) {
        document.getElementById("lPortFilterError").style.display = "block";
        document.getElementById("lPortFilterError").innerHTML = jQuery.i18n.prop("lTriggerPortIncomplete");
        return;
    }

    if((responseStartPort != "" && responseEndPort == "")
       || (responseStartPort == "" && responseEndPort != "")) {
        document.getElementById("lPortFilterError").style.display = "block";
        document.getElementById("lPortFilterError").innerHTML = jQuery.i18n.prop("lResponsePortIncomplete");
        return;
    }

    //起始端口号小于结束端口号
    if (triggerStartPort != "") {
        if (parseInt(triggerStartPort) > parseInt(triggerEndPort)) {
            document.getElementById("lPortFilterError").style.display = "block";
            document.getElementById("lPortFilterError").innerHTML = jQuery.i18n.prop("lStartPortLarger");
            return;
        }
    }

    //起始端口号小于结束端口号
    if (responseStartPort != "") {
        if (parseInt(responseStartPort) > parseInt(responseEndPort)) {
            document.getElementById("lPortFilterError").style.display = "block";
            document.getElementById("lPortFilterError").innerHTML = jQuery.i18n.prop("lStartPortLarger");
            return;
        }
    }

    name = encodeURIComponent(name);
    triggerPort = triggerStartPort + ":" + triggerEndPort;
    responsePort = responseStartPort + ":" + responseEndPort;

    if (responseStartPort == "") {
        responsePort = "NA";
    }

    if (triggerStartPort == "") {
        triggerPort = "NA";
    }



    hm();
    g_objContent.postPortFilterItem(editPortFilterRuleItemIdx, operationFlag, name, protocol, triggerPort, responsePort);
}

function LocalMBPortFilter() {
    $("#lt_portFilter_stcPortFilterDlgTitle").text(jQuery.i18n.prop("lt_portFilter_stcPortFilterDlgTitle"));
    var arrayLabels = document.getElementsByTagName("label");
    lableLocaliztion(arrayLabels);
}

function CheckPortNum(strPortNum) {
    if (strPortNum == "") {
        return true;
    }
    if (!isNumber(strPortNum)) {
        document.getElementById("lPortFilterError").style.display = "block";
        document.getElementById("lPortFilterError").innerHTML = jQuery.i18n.prop("lPortNumInvalide");
        return false;
    }
    var portNum = parseInt(strPortNum);
    if (portNum < 1 || portNum > 65535) {
        document.getElementById("lPortFilterError").style.display = "block";
        document.getElementById("lPortFilterError").innerHTML = jQuery.i18n.prop("lPortNumInvalide");
        return false;
    }
    return true;
}

function ClearVerifyError() {
    document.getElementById("lPortFilterError").style.display = "none";
}
