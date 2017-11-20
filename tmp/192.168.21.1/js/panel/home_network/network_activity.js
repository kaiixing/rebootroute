
(function($) {

    $.fn.objAccess_Logs = function(InIt) {

        var _xmlname = '';
        var mapData;
        var _xml = '';
        var index = 0;

        var lastSelected = "All";

        var _arrayAccessCotrol = new Array(0);
        var _arrayDetailedLog = new Array(0);
        var _arrayConTimeLog = new Array(0);
        var _arrayKnownDevicesList = new Array(0);
        var _arrayKnownDevicesListFilter = new Array(0);
        var _xmlAccessControl;
        this.onLoad = function(flag) {
            _arrayAccessCotrol = new Array(0);
            _arrayDetailedLog = new Array(0);
            _arrayConTimeLog = new Array(0);
            _arrayKnownDevicesList = new Array(0);
            _arrayKnownDevicesListFilter = new Array(0);
            var timestamp, dest_ip, dest_port, src_ip, src_port, protocol, src_mac, name, freq;
            // var nameAC,start_timeAC,end_timeAC,daysAC,mac_addrAC,indexAccessControl=0;
            var nameKD, name_type, mac, blocked, conn_type, ip_address, connected, indexKnwnDevice = 0;
            var indexLog = 0;
            if (flag)
                this.loadHTML();

            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            _arrayKnownDevicesListFilter = new Array(0);
            index = 0;
            // document.getElementById("ltDeviceNameFilterSelect").innerHTML = "";
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            arrayLabels = document.getElementsByTagName("th");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("td");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("h1");
            lableLocaliztion(arrayLabels);

            //_xml=callProductXMLNoDuster(_xmlname);
            _xml = callProductXML("detailed_log");
            var login_time = $(_xml).find("login_time").text();
            if ("0" != arrLoginTime && "" != login_time) {
                var arrLoginTime = login_time.split(" ");
                login_time = arrLoginTime[1] + "/" + arrLoginTime[2] + "/" + arrLoginTime[0] + " " + arrLoginTime[3];
            }

            document.getElementById("lDateValue").innerHTML = jQuery.i18n.prop('lLogintime') + ' ' + login_time;
            // _xmlAccessControl=callProductXML("internet_access_control");

            $(_xml).find("pdp_detailed_log_list").each(function() {

                $(this).find("Item").each(function() {
                    _arrayDetailedLog[indexLog] = new Array(8);
                    _arrayDetailedLog[indexLog][0] = indexLog;
                    _arrayDetailedLog[indexLog][1] = $(this).find("pdp_name").text();
                    _arrayDetailedLog[indexLog][2] = $(this).find("cid").text();
                    _arrayDetailedLog[indexLog][3] = $(this).find("start_time").text();
                    _arrayDetailedLog[indexLog][4] = $(this).find("end_time").text();
                    _arrayDetailedLog[indexLog][5] = $(this).find("ip_type").text();
                    _arrayDetailedLog[indexLog][6] = $(this).find("ip_addr").text();
                    _arrayDetailedLog[indexLog][7] = $(this).find("ipv6_addr").text();
                    indexLog++;
                });
            });
            this.loadDetailedLogTableData(_arrayDetailedLog);

            indexLog = 0;
            $(_xml).find("con_time_list").each(function() {

                $(this).find("Item").each(function() {

                    client_mac = $(this).find("wifimac").text();
                    con_time = $(this).find("con_time").text();
                    discon_time = $(this).find("discon_time").text();

                    _arrayConTimeLog[indexLog] = new Array(4);
                    _arrayConTimeLog[indexLog][0] = indexLog;
                    _arrayConTimeLog[indexLog][1] = client_mac;
                    _arrayConTimeLog[indexLog][2] = con_time;
                    _arrayConTimeLog[indexLog][3] = discon_time;
                    indexLog++;
                });
            });
            this.loadConTimeLogTableData(_arrayConTimeLog);
        }



        this.addOption = function(id, text, value) {
            var opt = document.createElement("option");
            document.getElementById(id).options.add(opt);
            opt.text = text;
            opt.value = value;
        }
        this.addFilterOption = function(id, text, value) {
            if (!this.exist(text))
                this.addOption(id, text, value);

        }
        this.exist = function(text) {
            var flag = false;
            for (var i = 0; i < _arrayKnownDevicesListFilter.length; i++) {
                if (_arrayKnownDevicesListFilter[i] == text)
                    flag = true;
            }
            if (!flag)
                _arrayKnownDevicesListFilter[index++] = text;
            return flag;

        }


        this.loadOptionDataLogs = function() {
            for (var i = 0; i < _arrayKnownDevicesList.length; i++) {
                this.addOption("drpdwnDevcieNames", _arrayKnownDevicesList[i][2], _arrayKnownDevicesList[i][2]);
            }

        }
        indexLog = 0;

        this.loadDetailedLogTableData = function(arrayTableData) {
            // this.addOption("ltDeviceNameFilterSelect", "All", "");
            var tableAccessLogs = document.getElementById('tableAccessLogs');
            var tBodytable = tableAccessLogs.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableAccessLogs');
            if (arrayTableData.length == 0) {
                var row1 = tBodytable.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 8;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            }
            else {
                for (var i = 0; i < arrayTableData.length; i++) {
                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodytable.insertRow(i);

                    var pdpNameCell = row.insertCell(0);
                    pdpNameCell.innerHTML = arrayTableDataRow[1];

                    var cidCell = row.insertCell(1);
                    cidCell.innerHTML = arrayTableDataRow[2];

                    var startTimeCell = row.insertCell(2);
                    var startTime = arrayTableDataRow[3];
                    if ("0" != startTime) {
                        var arr = startTime.split(" ");
                        startTime = "<p style=\"margin:0 0;\">" + arr[1] + "/" + arr[2] + "/" + arr[0] + "</p><p style=\"margin:0 0;\">" + arr[3] + "</p>";
                    }
                    startTimeCell.innerHTML = startTime;

                    var endTime = arrayTableDataRow[4];
                    if ("0" != endTime) {
                        var arr = endTime.split(" ");
                        endTime = "<p style=\"margin:0 0;\">" + arr[1] + "/" + arr[2] + "/" + arr[0] + "</p><p style=\"margin:0 0;\">" + arr[3] + "</p>";
                    }
                    var endTimeCell = row.insertCell(3);
                    endTimeCell.innerHTML = endTime;

                    var IpTypeCell = row.insertCell(4);
                    var ipTypeStr = "Unkown";
                    var IPv4Addr = arrayTableDataRow[6];
                    var IPv6Addr = arrayTableDataRow[7];

                    if (0 == arrayTableDataRow[5]) {
                        ipTypeStr = "IPv4v6";
                    }
                    else if (1 == arrayTableDataRow[5]) {
                        ipTypeStr = "IPv4";
                        IPv6Addr = "N/A";
                    }
                    else if (2 == arrayTableDataRow[5]) {
                        ipTypeStr = "IPv6";
                        IPv4Addr = "N/A";
                    }

                    if (1 != arrayTableDataRow[5]) {
                        var IPv6AddrLeft = IPv6Addr.substr(0, 24);
                        var IPv6AddrRight = IPv6Addr.substr(24, 23);
                        IPv6Addr = "<p style=\"margin:0 0;\">" + IPv6AddrLeft + "</p><p style=\"margin:0 0;\">" + IPv6AddrRight + "</p>";
                    }

                    IpTypeCell.innerHTML = ipTypeStr;

                    var ipv4AddrCell = row.insertCell(5);
                    ipv4AddrCell.innerHTML = IPv4Addr;

                    var ipv6AddrCell = row.insertCell(6);
                    ipv6AddrCell.innerHTML = IPv6Addr;

                    var deleteCol = row.insertCell(7);
                    deleteCol.className = "close";
                    deleteCol.innerHTML = "<a href='#' onclick='deletelog(" + i + ")'><img src='images/close.png' alt='' border='0' /></a>";
                }
                if (arrayTableData.length > 30) {
                    sm("divDetailedLogFull", 350, 150);
                    document.getElementById("h1LogFullHeader").innerHTML = jQuery.i18n.prop(h1LogFullHeader);
					document.getElementById("lLogFull").innerHTML = jQuery.i18n.prop(lLogFull);
                }

            }
            Table.stripe(tableAccessLogs, "alternate", "table-stripeclass");
        }
        this.loadConTimeLogTableData = function(arrayTableData) {
            var tableAccessLogs = document.getElementById('tableClientAccessLogs');
            var tBodytable = tableAccessLogs.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableClientAccessLogs');
            if (arrayTableData.length == 0) {
                var row1 = tBodytable.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 4;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            }
            else {
                for (var i = 0; i < arrayTableData.length; i++) {
                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodytable.insertRow(i);
                    var clientmacCell = row.insertCell(0);
                    var contimeCell = row.insertCell(1);
                    var discontimeCell = row.insertCell(2);
                    var deleteColCell = row.insertCell(3);
                    clientmacCell.innerHTML = arrayTableDataRow[1];

                    var contime = arrayTableDataRow[2];
                    if ("0" != contime) {
                        var arr = contime.split(" ");
                        contime = "<p style=\"margin:0 0;\">" + arr[1] + "/" + arr[2] + "/" + arr[0] + "</p><p style=\"margin:0 0;\">" + arr[3] + "</p>";
                    }
                    contimeCell.innerHTML = contime;

                    var discontime = arrayTableDataRow[3];
                    if ("0" != discontime) {
                        var arr = discontime.split(" ");
                        discontime = "<p style=\"margin:0 0;\">" + arr[1] + "/" + arr[2] + "/" + arr[0] + "</p><p style=\"margin:0 0;\">" + arr[3] + "</p>";
                    }
                    discontimeCell.innerHTML = discontime;
                    
                    deleteColCell.className = "close";
                    deleteColCell.innerHTML = "<a href='#' onclick='deletecontimelog(" + i + ")'><img src='images/close.png' alt='' border='0' /></a>";
                }

            }
            Table.stripe(tableAccessLogs, "alternate", "table-stripeclass");
        }

        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/home_network/network_activity.html");
            Table.auto();


        }
        this.setXMLName = function(xmlname) {
            _xmlname = xmlname;
        }

        this.onPostSuccess = function() {
            this.onLoad(true);
        }
        this.postItem = function(index) {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();

            this.putMapElement("RGW/detailed_log/delete_index", index, itemIndex++);

            if (mapData.length > 0) {

                postXML("detailed_log", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
        }
        this.postItem_contime = function(index) {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();

            this.putMapElement("RGW/detailed_log/delete_con_time_index", index, itemIndex++);

            if (mapData.length > 0) {

                postXML("detailed_log", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
        }
        this.postItemKnwnDevice = function(deviceName, xmlString) {
            deviceName = encodeURIComponent(deviceName);
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();

            this.putMapElement("RGW/device_management/known_devices_list/item/name", deviceName, itemIndex++);
            if (mapData.length > 0) {

                var xmlStringArray = xmlString.split("</RGW>");
                xmlString = xmlStringArray[0];

                var stringKD = g_objXML.getXMLDocToString(g_objXML.createXML(mapData));
                var stringKDArray = stringKD.split("<RGW>");
                xmlString = xmlString + stringKDArray[1];
                postXML(_xmlname, xmlString);
                _networkActivityIntervalID = setInterval("g_objContent.onLoad(false)", _networkActivityInterval);
                //this.onLoad(false);
            }
        }
        this.putMapElement = function(xpath, value, index) {
            mapData[index] = new Array(2);
            mapData[index][0] = xpath;
            mapData[index][1] = value;
        }

        this.getAccessLogArrayItem = function(index) {
            return _arrayDetailedLog[index];
        }
        this.getAccessControlArrayItem = function(index) {
            return _arrayAccessCotrol[index];
        }
        this.getMacAddress = function(value) {
            for (var i = 0; i < _arrayKnownDevicesList.length; i++) {
                if (_arrayKnownDevicesList[i][2] == value)
                    return _arrayKnownDevicesList[i][4];
            }
            return null;
        }
        this.getNameByMacAddress = function(mac) {
            for (var i = 0; i < _arrayKnownDevicesList.length; i++) {
                if (_arrayKnownDevicesList[i][4] == mac)
                    return _arrayKnownDevicesList[i][2];
            }
            return "Custom";
        }
        return this.each(function() {
            _networkActivityIntervalID = setInterval("g_objContent.onLoad(false)", _networkActivityInterval);
        });
    }
})(jQuery);
function btnCancelLogFull() {
    hm();
}
function deletelog(index) {
    g_objContent.postItem(index);
}
function deletecontimelog(index) {
    g_objContent.postItem_contime(index);
}
function delAccessControlRule(index) {
    g_objContent.delPostItem(index);
}
function addAccessLogsRule(index) {
    clearInterval(_networkActivityIntervalID);
    var arrayItem = g_objContent.getAccessLogArrayItem(index);
    sm("MBAccessLogRule", 450, 300);
    document.getElementById("txtLogRulename").focus();
    document.getElementById("txtLogRulename").focus();
    localizeMBAccessLogRule();
    g_objContent.loadOptionDataLogs();
    document.getElementById("drpdwnDevcieNames").value = arrayItem[1];
    addMacAddress(arrayItem[8]);
    document.getElementById("drpdwnDevcieNames").disabled = true;
    document.getElementById("h1InternetAccessRule").innerHTML = jQuery.i18n.prop("h1InternetAccessRule1");
    disabledMac();
    //alert("addAccessLogsRule");
}
function addAccessControlRule() {
    clearInterval(_networkActivityIntervalID);
    sm("MBAccessLogRule", 450, 300);
    document.getElementById("txtLogRulename").focus();
    document.getElementById("txtLogRulename").focus();
    localizeMBAccessLogRule();
    g_objContent.loadOptionDataLogs();
    document.getElementById("h1InternetAccessRule").innerHTML = jQuery.i18n.prop("h1InternetAccessRule1");
    addMacAddress(null);
}
function btnCancelClickedAccessLogs() {
    hm();
    _networkActivityIntervalID = setInterval("g_objContent.onLoad(false)", _networkActivityInterval);
}

function txtLogRuleNameClicked() {
    document.getElementById("lErrorLogs").style.display = "none";
}

function btnOKClickedAppLogs() {
    clearInterval(_networkActivityIntervalID);
    var ruleName = document.getElementById("txtLogRulename").value;
    var deviceName = document.getElementById("drpdwnDevcieNames").value;
    var mac = getMacAddress();
    var days = getDays();
    var startTime = getStartTime();
    var endTime = getEndTime();
    var errorString = validate_rule(ruleName, deviceName, mac, startTime, endTime);
    if (errorString == "OK") {
        hm();
        g_objContent.postItem(ruleName, deviceName, mac, startTime, endTime, days);
    }
    else {
        document.getElementById("lErrorLogs").style.display = "block";
        document.getElementById("lErrorLogs").innerHTML = jQuery.i18n.prop(errorString);
    }

}
function btnCancelClickedLogs() {
    hm();
    _networkActivityIntervalID = setInterval("g_objContent.onLoad(false)", _networkActivityInterval);
}
function btnAlertOkClickedLogs() {
    hm();
    _networkActivityIntervalID = setInterval("g_objContent.onLoad(false)", _networkActivityInterval);
}
function addMacAddress(address) {
    //    alert(address);
    if (address == null)
        address = ":::::";
    var arraySplit = address.split(":");
    for (var i = 1; i <= 6; i++)
        document.getElementById("txtMac" + i.toString()).value = arraySplit[i - 1];
}
function getMacAddress() {
    var address = "";
    for (var i = 1; i <= 5; i++)
        address += document.getElementById("txtMac" + i.toString()).value + ":";
    address += document.getElementById("txtMac" + i.toString()).value;
    return address;
}
function drpdwnDevcieNamesChanged() {
    var linkObj = document.getElementById("drpdwnDevcieNames");
    var value = linkObj.options[linkObj.selectedIndex].value;
    if (value != "Custom") {
        addMacAddress(g_objContent.getMacAddress(value));
        disabledMac();
    }
    else {
        addMacAddress(null);
        enableMac()
    }
}
function editAccessLogsRule(index) {
    clearInterval(_networkActivityIntervalID);
    var arrayItem = g_objContent.getAccessControlArrayItem(index);
    sm("MBAccessLogRule", 450, 300);
    document.getElementById("txtLogRulename").focus();
    document.getElementById("txtLogRulename").focus();
    localizeMBAccessLogRule();
    g_objContent.loadOptionDataLogs();
    document.getElementById("txtLogRulename").value = arrayItem[1];
    document.getElementById("drpdwnDevcieNames").value = g_objContent.getNameByMacAddress(arrayItem[5]);
    document.getElementById("drpdwnDevcieNames").disabled = true;
    document.getElementById("txtLogRulename").disabled = true;

    addMacAddress(arrayItem[5]);
    disabledMac();
    addDays(arrayItem[4]);
    setStartTime(arrayItem[2]);
    setEndTime(arrayItem[3]);
}
function localizeMBAccessLogRule() {
    var arrayLabels = document.getElementsByTagName("label");
    lableLocaliztionMB(arrayLabels);
}
function lableLocaliztionMB(labelArray) {
    for (var i = 0; i < labelArray.length; i++) {
        if (jQuery.i18n.prop(labelArray[i].id) != null)
            getID(labelArray[i].id).innerHTML = jQuery.i18n.prop(labelArray[i].id);
        //   $("#"+labelArray[i].id).text(jQuery.i18n.prop(labelArray[i].id));

    }
}
function addDays(days) {
    if (days == null)
        days = "1,2,3,4,5,6";
    var arraySplit = days.split(",");
    for (var i = 0; i <= 6; i++)
        document.getElementById("tableMonth1" + i.toString()).checked = false;

    for (i = 0; i < arraySplit.length; i++)
        document.getElementById("tableMonth1" + arraySplit[i].toString()).checked = true;
}
function disabledMac() {
    for (var i = 1; i <= 6; i++)
        document.getElementById("txtMac" + i.toString()).disabled = true;
}
function enableMac() {
    for (var i = 1; i <= 6; i++)
        document.getElementById("txtMac" + i.toString()).disabled = false;
}
function getDays() {
    var days = "";

    for (var i = 0; i <= 6; i++) {
        if (document.getElementById("tableMonth1" + i.toString()).checked)
            days += i.toString() + ",";
    }
    days = days.slice(0, days.length - 1)
    return days;
}
function setStartTime(time) {
    var arraySplit = time.split(":");

    document.getElementById("txtLogStartTime1").value = arraySplit[0];
    document.getElementById("txtLogStartTime2").value = arraySplit[1];
    document.getElementById("txtLogStartTime3").value = "00";

}
function getStartTime() {
    var value;
    value = document.getElementById("txtLogStartTime1").value;
    value = value + ":" + document.getElementById("txtLogStartTime2").value;
    // value = value + ":" + document.getElementById("txtLogStartTime3").value;
    return value;
}
function setEndTime(time) {
    var arraySplit = time.split(":");

    document.getElementById("txtLogEndTime1").value = arraySplit[0];
    document.getElementById("txtLogEndTime2").value = arraySplit[1];
    document.getElementById("txtLogEndTime3").value = "00";
}
function getEndTime() {
    var value;
    value = document.getElementById("txtLogEndTime1").value;
    value = value + ":" + document.getElementById("txtLogEndTime2").value;
    //  value = value + ":" + document.getElementById("txtLogEndTime3").value;
    return value;
}
function validate_rule(ruleName, deviceName, mac, startTime, endTime) {
    var regex = /^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
    if (ruleName == "")
        return "EMPTY_RULE_NAME";
    if (!deviceNameValidation(ruleName))
        return "SPECIAL_CHARS_ARE_NOT_ALLOWED";
    if (!deviceNameValidation(deviceName))
        return "SPECIAL_CHARS_ARE_NOT_ALLOWED";
    if (!regex.test(mac))
        return "MAC_IS_NOT_VALID";
    if (!startTime.match(/^[0-2][0-9]\:[0-6][0-9]$/))
        return "INVALID_START_TIME";
    if (!endTime.match(/^[0-2][0-9]\:[0-6][0-9]$/))
        return "INVALID_END_TIME";
    if (!compareTimes(startTime, endTime))
        return "START_TIME_LESS_ERROR"
    return "OK";
}
function compareTimes(time1, time2) {
    var splitArray1 = time1.split(":");
    var splitArray2 = time2.split(":");
    for (var i = 0; i < 3; i++) {
        if (splitArray1[i] < splitArray2[i])
            return true;
    }
    return false;


}
function setFocus(controlID) {
    var str = document.getElementById(controlID).value;
    if (str.length == 2) {
        var c = controlID.toString().charAt(controlID.length - 1);
        c++;
        controlID = controlID.substring(0, controlID.length - 1);
        controlID = controlID + c;
        document.getElementById(controlID.toString()).focus();
    }
}

