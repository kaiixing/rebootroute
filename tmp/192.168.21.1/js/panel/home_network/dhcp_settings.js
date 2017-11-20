(function($) {

    $.fn.objDHCP_Settings = function(InIt) {
        var c_rdRadio;
        var dhcpv6Server;
        var c_ipControl_start;
        var c_ipControl_end;
        var c_controlMapExisting = new Array(0);
        var c_controlMapCurrent = new Array(0);
        var _arrayStaticIP = new Array(0);
        var c_xmlName = '';
        var strDnsName="";
        this.onLoad = function() {
            var index = 0;
            this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            document.getElementById("sTimeUint").innerHTML = jQuery.i18n.prop('lMinutes');
            buttonLocaliztion(document.getElementById("btnAddStaticIP").id);
            $("#lstatelessServer").text( jQuery.i18n.prop('lstatelessServer'));
            $("#lstatefullServer").text( jQuery.i18n.prop('lstatefullServer'));
            $("#DHCPV6title").text( jQuery.i18n.prop('DHCPV6title'));
            var xml = getData(c_xmlName);
            var linkObj = document.getElementById("drpdwn_DHCP_range");
            var value = linkObj.options[linkObj.selectedIndex].value;
            document.getElementById("drpdwn_DHCP_range").disabled = true;
            _arrayStaticIP = new Array(0);
            var index_table = 0;
            var mac_address, ip_address;
            var ip, val;
            ip = $(xml).find("ip").text();
            val = ip.split(".");
            document.getElementById("textbox3").value = val[2];
            document.getElementById("ip").innerHTML = value + document.getElementById("textbox3").value + '.1';
            c_controlMapExisting = g_objXML.putMapElement(c_controlMapExisting, index++, "RGW/lan/ip", ip);

            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);

            var buttonID = document.getElementById("btUpdate").id;
            buttonLocaliztion(buttonID);
            var status, start, end, lease_time;

            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("th");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("td");
            lableLocaliztion(arrayLabels);
	    lableLocaliztion(document.getElementsByTagName("span"));

            arrayLabels = document.getElementsByTagName("h1");
            lableLocaliztion(arrayLabels);
            dhcpv6Server = $(xml).find("dhcpv6server").text();
            if("0" == dhcpv6Server) {
                $("#statelessServerRadio").prop("checked",true);
            } else {
                $("#statefullServerRadio").prop("checked",true);
            }

            $("#txtDirectionURL").val($(xml).find("redirect_url").text());
            var redirectionFunction =   $(xml).find("redirect_enable").text();
            if(1 == redirectionFunction) {
                $("#divEnabledDirectionUrl").show();
                $("#RedirectionURLEnabled").prop("checked",true);
            } else {
                $("#divEnabledDirectionUrl").hide();
                $("#RedirectionURLDisabled").prop("checked",true);
            }

            strDnsName = $(xml).find("dns_name").text();
            $("#txtDnsName").val(strDnsName);


            $(xml).find("dhcp").each(function() {
                status = $(this).find("status").text();
                start = $(this).find("start").text();
                end = $(this).find("end").text();
                lease_time = $(this).find("lease_time").text();

                c_rdRadio.setRadioButton(status);
                rbDHCPClicked();

                setDHCPRange(start);
                c_ipControl_start.setIP(start);
                c_ipControl_end.setIP(end);
                c_ipControl_start.disableIP(true, true, true, false);
                c_ipControl_end.disableIP(true, true, true, false);
                document.getElementById("tbdhcplt").value = lease_time;

                c_controlMapExisting = g_objXML.putMapElement(c_controlMapExisting, index++, "RGW/lan/dhcp/status", status);
                c_controlMapExisting = g_objXML.putMapElement(c_controlMapExisting, index++, "RGW/lan/dhcp/start", start);
                c_controlMapExisting = g_objXML.putMapElement(c_controlMapExisting, index++, "RGW/lan/dhcp/end", end);
                c_controlMapExisting = g_objXML.putMapElement(c_controlMapExisting, index++, "RGW/lan/dhcp/lease_time", lease_time);
                c_controlMapCurrent = g_objXML.copyArray(c_controlMapExisting, c_controlMapCurrent);
            });
            $(xml).find("Fixed_IP_list").each(function() {
                $(this).find("Item").each(function() {

                    mac_address = $(this).find("mac").text();
                    ip_address = $(this).find("ip").text();
                    _arrayStaticIP[index_table] = new Array(3);
                    _arrayStaticIP[index_table][0] = index_table;
                    _arrayStaticIP[index_table][1] = mac_address;
                    _arrayStaticIP[index_table][2] = ip_address;

                    index_table++;

                });
            });

            this.loadStaticIPTableData(_arrayStaticIP);
        }

        this.GetStaticIp = function() {
            return _arrayStaticIP;
        }

        this.loadStaticIPTableData = function(arrayTableData) {
            // this.addOption("ltDeviceNameFilterSelect", "All", "");
            var tableStaticIP = document.getElementById('tableStaticIP');
            var tBodytable = tableStaticIP.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableStaticIP');
            if (arrayTableData.length == 0) {
                var row1 = tBodytable.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 3;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            } else {
                for (var i = 0; i < arrayTableData.length; i++) {
                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodytable.insertRow(i);
                    var mac = row.insertCell(0);
                    var ip = row.insertCell(1);
                    var deleteCol = row.insertCell(2);
                    mac.innerHTML = arrayTableDataRow[1];
                    ip.innerHTML = arrayTableDataRow[2];
                    deleteCol.className = "close";
                    deleteCol.innerHTML = "<a href='#' onclick='DeleteStaticIP(" + i + ")'><img src='images/close.png' alt='' border='0' /></a>";
                }
                if (arrayTableData.length > 30) {
                    showAlert(jQuery.i18n.prop("MaxStaticIpError"));
                    return;
                    //document.getElementById("h1LogFullHeader").innerHTML = "Static IP table Full";
                }

            }
            Table.stripe(tableStaticIP, "alternate", "table-stripeclass");
        }
        this.onPost = function() {

            if (this.isvalid()) {
                document.getElementById('lIPErrorMsg').style.display = 'none';
                var _controlMap = this.getPostData();
				if(strDnsName == $("#txtDnsName").val()) {
                    _controlMap = putMapElement(_controlMap,"RGW/lan/dns_name_action", 0,_controlMap.length);
                } else {
                    _controlMap = putMapElement(_controlMap,"RGW/lan/dns_name", $("#txtDnsName").val(),_controlMap.length);
                    _controlMap = putMapElement(_controlMap,"RGW/lan/dns_name_action", 1,_controlMap.length);
                }

                var dhcpv6serverFlag = $("#statelessServerRadio").prop("checked")?0:1;
                if(dhcpv6serverFlag != dhcpv6Server) {
                    _controlMap = putMapElement(_controlMap,"RGW/lan/dhcpv6server",dhcpv6serverFlag,_controlMap.length);
                }

                if($("#RedirectionURLEnabled").prop("checked")) {
                    _controlMap = putMapElement(_controlMap,"RGW/lan/redirect_url",$("#txtDirectionURL").val(),_controlMap.length);
                    _controlMap = putMapElement(_controlMap,"RGW/lan/redirect_enable",1,_controlMap.length);
                } else {
                    _controlMap = putMapElement(_controlMap,"RGW/lan/redirect_enable",0,_controlMap.length);
                }

                postXML(c_xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap)));
            }
        }
        this.postItem = function(mac, ip) {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();

            this.putMapElement("RGW/lan/Fixed_IP_list/Item#index", 1, itemIndex++);
            this.putMapElement("RGW/lan/Fixed_IP_list/Item/mac", mac, itemIndex++);
            this.putMapElement("RGW/lan/Fixed_IP_list/Item/ip", ip, itemIndex++);
            if (mapData.length > 0) {
                postXML(c_xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
                //this.onLoad();
            }
        }
        this.putMapElement = function(xpath, value, index) {
            mapData[index] = new Array(2);
            mapData[index][0] = xpath;
            mapData[index][1] = value;
        }
        this.postItemDelete = function(macAddr) {
            mapData = null;
            mapData = new Array();
            this.putMapElement("RGW/lan/Fixed_IP_list/Item/mac#delete", macAddr, 0);

            if (mapData.length > 0) {
                postXML(c_xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }

        }
        this.onPostSuccess = function() {
            this.onLoad(false);
        }
        this.isvalid = function() {
			var dhcpRange = $("#drpdwn_DHCP_range").val() + document.getElementById("textbox3").value + '.1';
            if(dhcpRange == c_ipControl_start.getIP())
            {
                document.getElementById('lIPErrorMsg').style.display = 'block';
                document.getElementById('lIPErrorMsg').innerHTML = jQuery.i18n.prop('lDhcpStartAddrError');
                return false;
            }
            if (!(c_ipControl_start.validIP(true) && c_ipControl_end.validIP(true))) {
                document.getElementById('lIPErrorMsg').style.display = 'block';
                document.getElementById('lIPErrorMsg').innerHTML = jQuery.i18n.prop('lIPErrorMsg');
                return false;
            }
            if (parseInt(getID("ipControl_starttext3").value) > parseInt(getID("ipControl_endtext3").value)) {
                document.getElementById('lIPErrorMsg').style.display = 'block';
                document.getElementById('lIPErrorMsg').innerHTML = jQuery.i18n.prop('lDhcpAddrRangeError');
                return false;
            }
            if (parseInt(getID("ipControl_endtext3").value) < parseInt(getID("ipControl_starttext3").value)) {
                document.getElementById('lIPErrorMsg').style.display = 'block';
                document.getElementById('lIPErrorMsg').innerHTML = jQuery.i18n.prop('lErrorMax');
                return false;
            }

            if (!isNumber(document.getElementById('tbdhcplt').value)) {
                document.getElementById('lIPErrorMsg').style.display = 'block';
                document.getElementById('lIPErrorMsg').innerHTML = jQuery.i18n.prop('lErrorNumber');
                return false;
            }
            if (!isIP(document.getElementById('textbox3').value)) {
                document.getElementById('lIPErrorMsg').style.display = 'block';
                document.getElementById('lIPErrorMsg').innerHTML = jQuery.i18n.prop('lIPErrorMsg');
                return false;
            }
            return true;
        }
        this.getPostData = function() {
            var index = 0;
            var mapData = new Array(0);
            if (c_rdRadio.getRadioButton() == "1") {
                c_controlMapCurrent[index++][1] = getDHCPIP();

                c_controlMapCurrent[index++][1] = c_rdRadio.getRadioButton();
                c_controlMapCurrent[index++][1] = c_ipControl_start.getIP();
                c_controlMapCurrent[index++][1] = c_ipControl_end.getIP();
                c_controlMapCurrent[index++][1] = document.getElementById("tbdhcplt").value;
                mapData = g_objXML.copyArray(c_controlMapCurrent, mapData);
                mapData = g_objXML.getChangedArray(c_controlMapExisting, mapData, true);
            } else {
                if (c_controlMapCurrent[1][1] != c_rdRadio.getRadioButton()) {
                    c_controlMapCurrent[1][1] = c_rdRadio.getRadioButton();
                    mapData[0] = new Array(2);
                    mapData[0] = c_controlMapCurrent[1];
                }
            }
            return mapData;
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/home_network/dhcp_settings.html");
            c_rdRadio = $("#rdRadio").enabled_disabled("rdRadio");
            var c_rdRadio1 = document.getElementById('rdRadioEnabled');
            var c_rdRadio2 = document.getElementById('rdRadioDisabled');
            c_rdRadio1.onclick = rbDHCPClicked;
            c_rdRadio2.onclick = rbDHCPClicked;

            c_ipControl_start = $("#ipControl_start").ip_address("ipControl_start");
            c_ipControl_end = $("#ipControl_end").ip_address("ipControl_end");
            // c_rdRadio1.innerHTML = jQuery.i18n.prop('lEnabled');
            //  c_rdRadio2.innerHTML = jQuery.i18n.prop('lDisabled');

        }
        this.setXMLName = function(_xmlname) {
            c_xmlName = _xmlname;
        }


        return this.each(function() {



        });
    }
})(jQuery);

function drpdwn_DHCP_rangeChanged() {
    var linkObj = document.getElementById("drpdwn_DHCP_range");
    var value = linkObj.options[linkObj.selectedIndex].value;
    var _ipControl_start = $().ip_address("ipControl_start");
    _ipControl_start.clearHTML();
    _ipControl_start.formatIP(value);
    var _ipControl_end = $().ip_address("ipControl_end");
    _ipControl_end.clearHTML();
    _ipControl_end.formatIP(value);
    document.getElementById("ip").innerHTML = value + document.getElementById("textbox3").value + '.1';
}

function rbDHCPClicked() {
    if (document.getElementById("rdRadioEnabled").checked) {
        document.getElementById("divEnabledDisabledContent").style.display = "block";
        document.getElementById("textbox3").disabled = false;
        $("#divStaticIpAddrList").show();
    }

    if (document.getElementById("rdRadioDisabled").checked) {
        document.getElementById("divEnabledDisabledContent").style.display = "none";
        document.getElementById("textbox3").disabled = true;
        $("#divStaticIpAddrList").hide();
    }


}
function setDHCPRange(start) {
    var linkObj = document.getElementById("drpdwn_DHCP_range");
    var value;
    if (start.search('192.168') != -1)
        linkObj.selectedIndex = 0;
    else if (start.search('10.0') != -1)
        linkObj.selectedIndex = 1;
    if (start.search('172.16') != -1)
        linkObj.selectedIndex = 2;
    value = linkObj.options[linkObj.selectedIndex].value;
    document.getElementById("ip").innerHTML = value + document.getElementById("textbox3").value + '.1';
}

function getDHCPIP() {
    var linkObj = document.getElementById("drpdwn_DHCP_range");
    var value = linkObj.options[linkObj.selectedIndex].value;
    value = value + document.getElementById("textbox3").value + '.1';
    return value;
}
function localizeMBStaticIPDlg() {
    getID("h1AddStaticIP").innerHTML = jQuery.i18n.prop("h1AddStaticIP");
    getID("lStaticIP_MAC").innerHTML = jQuery.i18n.prop("lStaticIP_MAC");
    getID("lStaticIP_IP").innerHTML = jQuery.i18n.prop("lStaticIP_IP");
    getID("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
    buttonLocaliztion(document.getElementById("btnAdd_dhcp").id);
}
function addStaticIP() {
    if (document.getElementById("tableStaticIP").rows.length > 30) {
        showAlert(jQuery.i18n.prop("MaxStaticIpError"));
        return;
    }

    sm("MBStaticIPDlg", 450, 150);
    localizeMBStaticIPDlg();

    document.getElementById("txtMac1").focus();
    document.getElementById("txtMac1").focus();
    $("[id^='txtMac'],[id^='txtSrcIPAddress']").focus(function() {
        $("#lMacIpError").hide();
    });
}
function btnCancelStaticIPSetting() {
    hm();
}

function btnCancelClickedStaticIP() {
    hm();
}
function btnAddStaticIPSetting() {
    var mac = getMACAddress();
    var ip = getIPAddress();
    var bMacAddrValid = validateMACAddress(mac);
    var bIpAddrValid = validateIPAddress(ip);

    if (":::::" == mac) {
        document.getElementById("lMacIpError").style.display = "block";
        document.getElementById("lMacIpError").innerHTML = jQuery.i18n.prop("MAC_ADDR_IS_EMPTY");
        return;
    }
    if ("..." == ip) {
        document.getElementById("lMacIpError").style.display = "block";
        document.getElementById("lMacIpError").innerHTML = jQuery.i18n.prop("IP_ADDR_IS_EMPTY");
        return;
    }

    var bMacIpExist = false;
    var arrStaticIp = g_objContent.GetStaticIp();
    for (var idx = 0; idx < arrStaticIp.length; ++idx) {
        if (mac == arrStaticIp[idx][1] || ip == arrStaticIp[idx][2]) {
            bMacIpExist = true;
            break;
        }
    }

    if (bMacIpExist) {
        document.getElementById("lMacIpError").style.display = "block";
        document.getElementById("lMacIpError").innerHTML = jQuery.i18n.prop("lMacIpExist");
        return;
    }


    if (bMacAddrValid && bIpAddrValid) {
        hm("MBStaticIPDlg");
        g_objContent.postItem(mac, ip);
    } else {
        document.getElementById("lMacIpError").style.display = "block";
        if (!bMacAddrValid) {
            document.getElementById("lMacIpError").innerHTML = jQuery.i18n.prop("MAC_IS_NOT_VALID");
        } else if (!bIpAddrValid) {
            document.getElementById("lMacIpError").innerHTML = jQuery.i18n.prop("IP_IS_NOT_VALID");
        }
    }

}
function getMacAddress() {
    var address = "";
    for (var i = 1; i <= 5; i++)
        address += document.getElementById("txtMac" + i.toString()).value + ":";
    address += document.getElementById("txtMac" + i.toString()).value;
    return address;
}
function getIPAddress() {
    var ip_address = "";
    ip_address = document.getElementById("txtSrcIPAddress1").value + "." +
                 document.getElementById("txtSrcIPAddress2").value + "." +
                 document.getElementById("txtSrcIPAddress3").value + "." +
                 document.getElementById("txtSrcIPAddress4").value;
    return ip_address;
}
function validateMACAddress(mac) {
var regex = /^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
    if (!regex.test(mac))
        return false;
    else
        return true;
}

function validateIPAddress(ip) {
    if (!isIPFULL(ip, true))
        return 0;
    else
        return 1;
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
function DeleteStaticIP(index) {
    var staticIP = g_objContent.GetStaticIp()[index];
    g_objContent.postItemDelete(staticIP[1]);
}
function RedirectionURLEnabledChange()
{
	$("#divEnabledDirectionUrl").show();
}

function RedirectionURLDisabledChange()
{
	$("#divEnabledDirectionUrl").hide();
}