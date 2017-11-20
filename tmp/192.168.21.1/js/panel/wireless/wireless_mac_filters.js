
var _mac;
var _bmode;
var _mode_value;
var LIST_NUMBER;
var g_bDelAllowList = false;

(function($) {
    $.fn.objWMAC_Filters = function(InIt) {
        var controlMapExisting = new Array(0);
        var controlMapCurrent = new Array(0);
        var xml;
        var xmlName = '';
        var _enable;
        var _mode;
        var rdRadioMACFilters, rdRadioModeSettings;
        var _arrayTableData;
        this.onLoad = function() {
            var index = 0;
            var mac;
            _arrayTableData = new Array(0);
            this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            var buttonID = document.getElementById("btUpdate").id;
            buttonLocaliztion(buttonID);
	    buttonLocaliztion("btUpdate_Delete");

            var tableMACFilters;
            var tHeadtableMACFilters;

            xml = callProductXML(xmlName);

            $(xml).find("wlan_mac_filters").each(function() {
                _enable = $(this).find("enable").text();
                _mode = $(this).find("mode").text();
            });

            _bmode = _mode;

            rdRadioMACFilters.setRadioButton(_enable);
            rdRadioModeSettings.setRadioButton(_mode);
            changeMode();
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index++, "RGW/wlan_mac_filters/enable", _enable);
            controlMapExisting = g_objXML.putMapElement(controlMapExisting, index, "RGW/wlan_mac_filters/mode", _mode);
            controlMapCurrent = g_objXML.copyArray(controlMapExisting, controlMapCurrent);

            if (_enable == "0") {
                document.getElementById('mode_settings').style.display = 'none';
                document.getElementById('tableMACFilters').style.display = 'none';
                document.getElementById('mac_filters').style.display = 'none';
            }
            else {
                document.getElementById('mode_settings').style.display = 'block';
                document.getElementById('tableMACFilters').style.display = 'block';
                document.getElementById('mac_filters').style.display = 'block';
                buttonLocaliztion(document.getElementById("btnAddMACFilter").id);
                document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
            }

            tableMACFilters = document.getElementById('tableMACFilters');
            tHeadtableMACFilters = tableMACFilters.getElementsByTagName('th')[0];
            if (_mode == "1") {
                document.getElementById("lDenyList").innerHTML = jQuery.i18n.prop("lAllowList");
                tHeadtableMACFilters.innerHTML = jQuery.i18n.prop("thAllow");
                _mode_value = "allow";
            }
            else {
                document.getElementById("lDenyList").innerHTML = jQuery.i18n.prop("lDenyList");
                tHeadtableMACFilters.innerHTML = jQuery.i18n.prop("thDeny");
                _mode_value = "deny";
            }

            index = 0;

            $(xml).find(_mode_value + "_list").each(function() {
                $(this).find("Item").each(function() {
                    mac = $(this).find("mac").text();
                    _arrayTableData[index] = new Array(2);
                    _arrayTableData[index][0] = mac;
                    index++;
                });
            });
            this.loadTableData(_arrayTableData);

			if("allow" == _mode_value && _arrayTableData.length == 0 && g_bDelAllowList)
			{
				g_bDelAllowList= false;
				if(confirm(jQuery.i18n.prop("lMacEnableListEmpty"))){
    				mapData = new Array();
					putMapElement(mapData,"RGW/wlan_mac_filters/enable", 0, 0);
					postXML("wlan_mac_filters", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
				}
			}
        }

        this.GetMacAddrList = function() {
            return _arrayTableData;
        }

        this.loadTableData = function(arrayTableData) {

            var tableMACFilters = document.getElementById('tableMACFilters');
            var tBodytableMACFilters = tableMACFilters.getElementsByTagName('tbody')[0];

            clearTabaleRows('tableMACFilters');

			LIST_NUMBER = arrayTableData.length;
			var checkall = document.getElementById('lListCheckall');
            checkall.innerHTML = "<div><input type='checkbox'  id='DeleteAll' align='right' onchange='ListDeleteAll()' onclick='ListDeleteAll()' class='chk11'></div>";

            if (arrayTableData.length == 0) {
                var row1 = tBodytableMACFilters.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 2;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            }
            else {
                for (var i = 0; i < arrayTableData.length; i++) {
                   // var ind = tableMACFilters.rows.length;
                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodytableMACFilters.insertRow(-1);

                    var MACCol = row.insertCell(0);
                    var DelCol = row.insertCell(1);
				    DELETEID = "Delete" + i;

                    MACCol.innerHTML = arrayTableDataRow[0];
                   // DelCol.innerHTML = "<a href='#' onclick='Delete(" + ind + ")'><img src='images/close.png'   alt='' /></a>";
				    DelCol.innerHTML = "<div><input align='right' id=" + DELETEID + "  type='checkbox' onchange='MultiDelete(" + i + ")' onclick='MultiDelete(" + i + ")' class='chk11'></div>";
                }
            }
            Table.stripe(tableMACFilters, "alternate", "table-stripeclass");
        }

        this.onPost = function() {
            var _controlMap = this.getPostData();
            if (_controlMap.length > 0) {
                postXML("uapx_wlan_mac_filters", g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap)));
                //this.onLoad();
            }

        }
        this.onPostSuccess = function() {
            this.onLoad(true);
        }
        this.postItem = function(_mode, _mac) {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();

            this.putMapElement("RGW/wlan_mac_filters/" + _mode + "_list/Item#index", 1, itemIndex++);
            this.putMapElement("RGW/wlan_mac_filters/" + _mode + "_list/Item/mac", _mac, itemIndex++);

            if (mapData.length > 0) {
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
                //this.onLoad();
            }
        }

        this.putMapElement = function(xpath, value, index) {
            mapData[index] = new Array(2);
            mapData[index][0] = xpath;
            mapData[index][1] = value;
        }

        this.postItemRemoveDeviceEntry = function(index, _mode, _mac) {
            mapData = null;
            mapData = new Array();
            this.putMapElement("RGW/wlan_mac_filters/" + _mode + "_list/Item/mac#delete", _mac, index);

            if (mapData.length > 0) {
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
                //this.onLoad();
            }

        }
        this.getPostData = function() {
            var index = 0;
            var mapData = new Array(0);

            if (document.getElementById('rdRadioMACFiltersEnabled').checked)
                controlMapCurrent[index++][1] = 1;
            else
                controlMapCurrent[index++][1] = 0;

            if (document.getElementById('rdRadioModeSettingsAllow').checked)
                controlMapCurrent[index][1] = 1;
            else
                controlMapCurrent[index][1] = 2;

            mapData = g_objXML.copyArray(controlMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(controlMapExisting, mapData, true);
            return mapData;
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/wireless/wireless_mac_filters.html");

            rdRadioMACFilters = $("#rdRadioMACFilters").enabled_disabled("rdRadioMACFilters");
            rdRadioModeSettings = $("#rdRadioModeSettings").allow_deny("rdRadioModeSettings");

            Table.auto();
        }

        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }

        return this.each(function() {

        });
    }
})(jQuery);

function showMACFilters() {

    if (document.getElementById('rdRadioMACFiltersEnabled').checked) {
        document.getElementById('mode_settings').style.display = 'block';
        document.getElementById('tableMACFilters').style.display = 'block';
        document.getElementById('mac_filters').style.display = 'block';
        buttonLocaliztion(document.getElementById("btnAddMACFilter").id);
        document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
    }
    else {
        document.getElementById('mode_settings').style.display = 'none';
        document.getElementById('tableMACFilters').style.display = 'none';
        document.getElementById('mac_filters').style.display = 'none';

    }

}

function changeMode() {
    var tableMACFilters = document.getElementById('tableMACFilters');
    var tHeadtableMACFilters = tableMACFilters.getElementsByTagName('th')[0];
    document.getElementById("lErrorLogs1").style.display = "none";
    if (document.getElementById('rdRadioModeSettingsAllow').checked) {
        _mode_value = "allow";
        if (_bmode == "1") {
            document.getElementById("lDenyList").innerHTML = jQuery.i18n.prop("lAllowList");
            tHeadtableMACFilters.innerHTML = jQuery.i18n.prop("thAllow");
        }
    }
    else {
        _mode_value = "deny";
        if (_bmode == "2") {
            document.getElementById("lDenyList").innerHTML = jQuery.i18n.prop("lDenyList");
            tHeadtableMACFilters.innerHTML = jQuery.i18n.prop("thDeny");
        }
    }
}

function addMACFilter() {
   if(document.getElementById("tableMACFilters").rows.length > 8)
   {
	showAlert(jQuery.i18n.prop("lMacFilterItemError"))
	return;
   }

    if (_bmode == "1" && _mode_value == "deny") {
        document.getElementById("lErrorLogs1").style.color = "red";
        document.getElementById("lErrorLogs1").style.display = "block";
        document.getElementById("lErrorLogs1").innerHTML = jQuery.i18n.prop("AllowModeError");
    }
    else if (_bmode == "2" && _mode_value == "allow") {
        document.getElementById("lErrorLogs1").style.color = "red";
        document.getElementById("lErrorLogs1").style.display = "block";
        document.getElementById("lErrorLogs1").innerHTML = jQuery.i18n.prop("DenyModeError");
    }
    else {
        sm("MBMACFilterDlg", 500, 100);
        $("[id^='txtMac']").each(function() {
            $(this).focus(function() {
                $("#lMacError").hide();
            });
        });
    }

    localizeMBMACFilterDlg();

    document.getElementById("txtMac1").focus();
    document.getElementById("txtMac1").focus();

}

function getMACAddress() {
    var address = "";
    for (var i = 1; i <= 5; i++)
        address += document.getElementById("txtMac" + i.toString()).value + ":";
    address += document.getElementById("txtMac" + i.toString()).value;
    return address;
}

function btnAddClickedMACFilters() {
    _mac = getMACAddress();

    if (":::::" == _mac) {
        document.getElementById("lMacError").style.display = "block";
        document.getElementById("lMacError").innerHTML = jQuery.i18n.prop("MAC_ADDR_IS_EMPTY");
        return;
    }

    if (!validateMACAddress(_mac)) {
        document.getElementById("lMacError").style.display = "block";
        document.getElementById("lMacError").innerHTML = jQuery.i18n.prop("MAC_IS_NOT_VALID");
        return;
    }
    var macAddrList = g_objContent.GetMacAddrList();
    for (var idx = 0; idx < macAddrList.length; ++idx) {
        if (_mac == macAddrList[idx][0]) {
            document.getElementById("lMacError").style.display = "block";
            document.getElementById("lMacError").innerHTML = jQuery.i18n.prop("MAC_ADDR_EXIST");
            return;
        }
    }


    hm("MBMACFilterDlg");
    g_objContent.postItem(_mode_value, _mac);


}

function Delete(_index) {
    var tableMACFilters = document.getElementById('tableMACFilters');
    var trMACFilters = tableMACFilters.getElementsByTagName('tr')[_index];
    var tdMACFilters = trMACFilters.getElementsByTagName('td')[0];

    _mac = tdMACFilters.innerHTML;
    tableMACFilters.deleteRow(_index);
    g_objContent.postItemRemoveDeviceEntry(_index, _mode_value, _mac);
}

function btnCancelClickedMACFilters() {
    hm();
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
function localizeMBMACFilterDlg() {
    getID("h1AddMACFilter").innerHTML = jQuery.i18n.prop("h1AddMACFilter");
    getID("lMACAddress").innerHTML = jQuery.i18n.prop("lMACAddress");
    buttonLocaliztion(document.getElementById("btnAddMACFilter").id);
    document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
}

function validateMACAddress(mac) {
    var regex = /^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
    if (!regex.test(mac))
        return false;
    else
        return true;
}

function MultiDelete(index) {
    var nSelectItemCount = 0;
    for (var i = 0; i < LIST_NUMBER; i++) {
        if (document.getElementById("Delete" + i).checked) {
            ++nSelectItemCount;
        }
    }

    if (0 == nSelectItemCount) {
        $("#DeleteListdiv").hide();
    }
    else {
        $("#DeleteListdiv").show();
    }

    if (LIST_NUMBER == nSelectItemCount) {
        document.getElementById("DeleteAll").checked = true;
    }
    else {
        document.getElementById("DeleteAll").checked = false;
    }

}
function btnCancelDeleteListConfigure() {
	hm();
}

function DeleteList() {
	sm("DeleteListConfigure", 300, 100);
	document.getElementById("h1dellistConfigure").innerHTML = jQuery.i18n.prop("h1dellistConfigure");
	buttonLocaliztion(document.getElementById("btnOK_confirm").id);
	document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
	document.getElementById("lDeleteListMessage").innerHTML = jQuery.i18n.prop("lDeleteListMessage");
}

function btnDeleteListOKConfigure() {
    var Deletelist = '';
    for (i = 0; i < LIST_NUMBER; i++) {
        if (document.getElementById("Delete" + i).checked) {
            Deletelist += i + ',';
        }
    }

	var itemIndex = 0;
    mapData = null;
    mapData = new Array();
    
	putMapElement(mapData,"RGW/wlan_mac_filters/" + _mode_value + "_delete_index", Deletelist, itemIndex++);

    if (mapData.length > 0) {
		g_bDelAllowList= true;
        postXML("wlan_mac_filters", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    }
}

function ListDeleteAll() {
    if (document.getElementById("DeleteAll").checked) {
        if (LIST_NUMBER > 0) {
            document.getElementById("DeleteListdiv").style.display = "block";
        }

        for (var i = 0; i < LIST_NUMBER; i++) {
            document.getElementById("Delete" + i).checked = true;
        }
    }
    else {
        document.getElementById("DeleteListdiv").style.display = "none";
        for (var i = 0; i < LIST_NUMBER; i++) {
            document.getElementById("Delete" + i).checked = false;
        }
    }
}
