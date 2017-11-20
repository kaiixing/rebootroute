
(function($) {
    $.fn.objDataTraffic = function(InIt) {
        var _xmlname = '';
        var _xml = '';
        var _lastSortValue = '';
        var _arrayTableData = new Array(0);
        this.onLoad = function(flag) {
            if (flag) {
                document.getElementById('Content').innerHTML = callProductHTML("html/home_network/data_traffic.html");
            }

            lableLocaliztion(document.getElementsByTagName("label"));
            lableLocaliztion(document.getElementsByTagName("th"));
			buttonLocaliztion("lBtnSave");
            buttonLocaliztion("lBtnOk");
            buttonLocaliztion("lBtnResetDevices");

            _xml = callProductXML(_xmlname);
            var index = 0;
            _arrayTableData.length = 0;
			var zmirename = $(_xml).find("zmirename").text();
			
			parsezmirename(zmirename)
            $(_xml).find("client_list").each(function() {
                $(this).find("Item").each(function() {
                    _arrayTableData[index] = new Array(15);
                    _arrayTableData[index][0] = index;
					var zminame =decodeURIComponent($(this).find("name").text());
					var macaddress =$(this).find("mac").text().toUpperCase();
					for(x=0;x<nickName.length;x++){
					if(macaddress==nickName[x].mac.toUpperCase()){
						zminame = _utf8_decode(zUniDecode(nickName[x].name));
						
						break;

						}}
                    _arrayTableData[index][1] = zminame;
					
                    _arrayTableData[index][2] = $(this).find("name_type").text();
                    _arrayTableData[index][3] = $(this).find("status").text();
                    _arrayTableData[index][4] = $(this).find("conn_type").text();
                    _arrayTableData[index][5] = $(this).find("mac").text();
                    _arrayTableData[index][6] = $(this).find("ip_address").text();
                    _arrayTableData[index][7] = $(this).find("conn_time_at").text();
                    _arrayTableData[index][8] = $(this).find("conn_time_for").text();
                    _arrayTableData[index][9] = $(this).find("rx_data_used").text();
                    _arrayTableData[index][10] = $(this).find("tx_data_used").text();
                    _arrayTableData[index][11] = $(this).find("rx_data_used_monthly").text();
                    _arrayTableData[index][12] = $(this).find("tx_data_used_monthly").text();
                    _arrayTableData[index][13] = $(this).find("rx_data_used_last3day").text();
                    _arrayTableData[index][14] = $(this).find("tx_data_used_last3day").text();
                    index++;
                });
            });
            this.loadTableData(_arrayTableData);
        }


        this.loadTableData = function(arrayTableData) {
            var tableDeviceInfo = document.getElementById('tableDeviceInfo');
            var tBodyDeviceInfo = tableDeviceInfo.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableDeviceInfo');
            if (arrayTableData.length == 0) {
                var row1 = tBodyDeviceInfo.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 7;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
                $("#divResetAllDevices").hide();
            } else {
                $("#divResetAllDevices").show();
                for (var i = 0; i < arrayTableData.length; i++) {
                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodyDeviceInfo.insertRow(i);
                    var nameCol = row.insertCell(0);
                    var macAddrCol = row.insertCell(1);
					var connflowused = row.insertCell(2);
                    var connTimeCol = row.insertCell(3);
                    var deviceStatusCol = row.insertCell(4);
                    var actionCol = row.insertCell(5);

                    nameCol.innerHTML = "<a href='#' onclick='ShowDeviceInfo(" + i + ")'>" + arrayTableDataRow[1] + "</a>"; ;
                    macAddrCol.innerHTML = arrayTableDataRow[5];
                    connTimeCol.innerHTML = dateFormat(arrayTableDataRow[8]);
					connflowused.innerHTML = FormatDataTraffic(parseInt(arrayTableDataRow[10]) + parseInt(arrayTableDataRow[9]));
                    var connType = arrayTableDataRow[4];

                    switch (arrayTableDataRow[3]) {
                        case "0":
                            deviceStatusCol.innerHTML = jQuery.i18n.prop("lDisConnection");
                            if("WIFI" == connType){
								actionCol.style.textAlign = "center";
                                actionCol.innerHTML = "<input type=\"button\" class=\"btnWrp\" value=\"" +  jQuery.i18n.prop("lBlock") + "\" onclick='SetBlockStatus(" + i + ")' style=\"padding-left: 3px;padding-right: 3px;\" />";
                            }break;
                        case "1":
                            deviceStatusCol.innerHTML = jQuery.i18n.prop("lConnection");
                            if("WIFI" == connType){
								actionCol.style.textAlign = "center";
                                actionCol.innerHTML = "<input type=\"button\" class=\"btnWrp\" value=\"" + jQuery.i18n.prop("lBlock") + "\" onclick='SetBlockStatus(" + i + ")' style=\"padding-left: 3px;padding-right: 3px;\" />";
                            }break;
                        case "2":
                            deviceStatusCol.innerHTML =  jQuery.i18n.prop("lBlocked");
                            if("WIFI" == connType){
								actionCol.style.textAlign = "center";
                                actionCol.innerHTML = "<input type=\"button\" class=\"btnWrp\" value=\"" + jQuery.i18n.prop("lUnBlock") + "\" onclick='SetUnblockStatus(" + i + ")' style=\"padding-left: 3px;padding-right: 3px;\" />";
                            }break;
                        default:
                            deviceStatusCol.innerHTML =  jQuery.i18n.prop("lUnkownStatus");
                    }
                }
            }
            Table.stripe(tableDeviceInfo, "alternate", "table-stripeclass");
        }

        this.setXMLName = function(xmlname) {
            _xmlname = xmlname;
        }

        this.ChangeDeviceStatus = function(actionFlag, macAddr) {
            var mapData = new Array();
            var idx = 0;
            putMapElement(mapData, "RGW/device_management/device_control/action", actionFlag, idx++);
            putMapElement(mapData, "RGW/device_management/device_control/mac", macAddr, idx++);
            postXML(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
        }

        this.onPostSuccess = function() {
            this.onLoad(true);
        }


        this.getTableRowData = function(index) {
            return _arrayTableData[index];
        }

        this.getTableData = function() {
            return _arrayTableData;
        }

        return this;
    }
})(jQuery);


function FormatDataTraffic(dataByte) {
    var formatData;
    if (dataByte > 1024 * 1024 * 1024) {
        var dataInGB = dataByte / (1024 * 1024 * 1024);
        formatData = dataInGB.toFixed(2) + "GB";
    } else if (dataByte > 1024 * 1024) {
        var dataInMB = dataByte / (1024 * 1024);
        formatData = dataInMB.toFixed(2) + "MB";
    } else if (dataByte > 1024) {
        var dataInKB = dataByte / 1024;
        formatData = dataInKB.toFixed(2) + "KB";
    } else {
        formatData = dataByte + "B";
    }

    return formatData;
}

function ShowDeviceInfo(index) {
    var deviceItemInfo = g_objContent.getTableRowData(index);
    sm("DeviceInfoDiv",440,540);
    lableLocaliztion(document.getElementsByTagName("h1"));
    lableLocaliztion(document.getElementsByTagName("a"));
    lableLocaliztion(document.getElementsByTagName("option"));
    lableLocaliztion(document.getElementsByTagName("label"));
    $("#txtDeviceName").val(deviceItemInfo[1]);
    $("#deviceNameAssignedSel").val(deviceItemInfo[2]);
    $("#deviceStatusSel").val(deviceItemInfo[3]);
    $("#ConnTypeSel").val(deviceItemInfo[4]);
    $("#txtIpAddr").val(deviceItemInfo[6]);
	if(deviceItemInfo[6]=="NA"){
		$("#ipnull").show();
		$("#txtIpAddr").val("None");
		
	}else{
		$("#ipnull").show();
	}
    $("#txtMacAddr").val(deviceItemInfo[5]);
    $("#txtLastConTime").val(deviceItemInfo[7]);
    $("#txtTotalConTime").val(dateFormat(deviceItemInfo[8]));

    $("#txtMonthSendData").val(FormatDataTraffic(parseInt(deviceItemInfo[12])));
    $("#txtMonthRecvData").val(FormatDataTraffic(parseInt(deviceItemInfo[11])));
    $("#txtMonthTotalData").val(FormatDataTraffic(parseInt(deviceItemInfo[11]) + parseInt(deviceItemInfo[12])));

    $("#txtLast3DaySendData").val(FormatDataTraffic(parseInt(deviceItemInfo[14])));
    $("#txtLast3DayRecvData").val(FormatDataTraffic(parseInt(deviceItemInfo[13])));
    $("#txtLast3DayTotalData").val(FormatDataTraffic(parseInt(deviceItemInfo[13]) + parseInt(deviceItemInfo[14])));

    $("#txtTotalSendData").val(FormatDataTraffic(parseInt(deviceItemInfo[10])));
    $("#txtTotalRecvData").val(FormatDataTraffic(parseInt(deviceItemInfo[9])));
    $("#txtTotalData").val(FormatDataTraffic(parseInt(deviceItemInfo[10]) + parseInt(deviceItemInfo[9])));
}

function SetBlockStatus(index) {
    //最多有支持8个block状态
    var tableData = g_objContent.getTableData();
    var nBlockStatusCount = 0;
    for (var i = 0; i < tableData.length; ++i) {
        if (2 == tableData[i][3]) {
            nBlockStatusCount++;
        }
    }

    if (nBlockStatusCount >= 8) {
        showMsgBox(jQuery.i18n.prop("lWarning"), jQuery.i18n.prop("lMaxBlockStatusTip"));
    }
    var deviceInfo = g_objContent.getTableRowData(index);
    var macAddr = deviceInfo[5];
    g_objContent.ChangeDeviceStatus(2, macAddr);
}

function SetStopStatus(index) {
    var deviceInfo = g_objContent.getTableRowData(index);
    var macAddr = deviceInfo[5];
    g_objContent.ChangeDeviceStatus(1, macAddr);
}

function SetUnblockStatus(index) {
    var deviceInfo = g_objContent.getTableRowData(index);
    var macAddr = deviceInfo[5];
    g_objContent.ChangeDeviceStatus(3, macAddr);
}


function ResetClients() {
    var mapData = new Array();
    putMapElement(mapData, "RGW/device_management/device_control/action", 4, 0);
    postXML("device_management", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
}
var MAX_NAME_LEN = 30;
var MAX_COUNT = 20;
var nickName;


function parsezmirename(zmirename){
	nickName=new Array();
	var zmiclient=zmirename.split("==");
	for(var x=0;x< zmiclient.length-1;x++){
		
		var zc = zmiclient[x].split("=");
		nickName[x]=new Object()
		nickName[x].mac=zc[0]
		nickName[x].name=zc[1]
	}
}


function updateNickName(lname,lmac){
	var zmin ="";

	for(x=0;x<nickName.length;x++){
		var compnicknamemac = nickName[x].mac
		if(compnicknamemac.toUpperCase()==lmac.toUpperCase()){
			if(nickName.length==1){
				nickName[0].mac=lmac;
				nickName[0].name=lname;
				break;
			}
			for(i=x+1;i<nickName.length;i++){
				nickName[i-1].mac =nickName[i].mac
				nickName[i-1].name =nickName[i].name
				}
			nickName.length = nickName.length -1;
			var nklen = nickName.length;
			nickName[nklen]=new Object()
			nickName[nklen].mac=lmac;
			nickName[nklen].name=lname;
			break;
		}else if(x==nickName.length-1){
			if(nickName.length>=20){
				for(i=1;i<nickName.length;i++){
				nickName[i-1].mac =nickName[i].mac
				nickName[i-1].name =nickName[i].name
				}
			}
			var nklen = nickName.length;
			nickName[nklen]=new Object()
			nickName[nklen].mac=lmac;
			nickName[nklen].name=lname;
			break;
		}
		
	}
		if(0==nickName.length){
			var nklen = nickName.length;
			nickName[nklen]=new Object()
			nickName[nklen].mac=lmac;
			nickName[nklen].name=lname;
			
		}
		for(var i =0;i<nickName.length;i++){
			
		zmin += nickName[i].mac+"="+nickName[i].name+"==";
		}
		return zmin;
	
	}
function renameClient() {
	var utf8name = utf8.encode($("#txtDeviceName").val());
	var name =zUniEncode(utf8name);
	var mac =$("#txtMacAddr").val();
	var specialchars =new RegExp('[/\\:*?\"<>|]');
	if(specialchars.test(name)){
		$("#zmirenameerror").html(jQuery.i18n.prop('nickNameIllegal'));
		$("#zmirenameerror").show();
			return;
	}
	if(utf8name.length>MAX_NAME_LEN){
		$("#zmirenameerror").html(jQuery.i18n.prop('nickNameTooLong'));
		$("#zmirenameerror").show();
			return;
	}
	for(var i =0;i<nickName.length;i++){
		if(name == nickName[i].name){
		$("#zmirenameerror").html(jQuery.i18n.prop('nickNameExist'))
		$("#zmirenameerror").show();
			return;
		}
	}
	
	var zmirc =updateNickName(name,mac);
	var mapData = new Array();
    putMapElement(mapData, "RGW/device_management/zmirename", zmirc, 0);
    postXML("device_management", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
}
function zUniEncode(string) {
    if (undefined == string) {
        return "";
    }
    var code = "";
    for (var i = 0; i < string.length; ++i) {
        var charCode = string.charCodeAt(i).toString(16);
        var paddingLen = 4 - charCode.length;
        code += charCode;
    }
    return code;
}
function zUniDecode(encodeString) {
    if (undefined == encodeString) {
        return "";
    }
    var deCodeStr = "";

    var strLen = encodeString.length / 2;
    for (var idx = 0; idx < strLen; ++idx) {
        deCodeStr += String.fromCharCode(parseInt(encodeString.substr(idx*2, 2), 16));
    }
    return deCodeStr;
}

    // private method for UTF-8 decoding
function _utf8_decode (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }