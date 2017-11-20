
(function ($) {

    $.fn.objConnectedDev = function (InIt) {


        var _xmlname = '';

        var mapData;

        var _xml='';

        var _lastSortValue='';
        var _arrayTableData=new Array(0);
        this.onLoad = function (flag) {
            _arrayTableData=new Array(0);
            var index=0;
            var name;
            var name_type;
            var mac;
            var blocked;
            var conn_type;
            var ip_address;
            var connected;
            if(flag)
                this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("th");
            lableLocaliztion(arrayLabels);

            _xml=callProductXML(_xmlname);
				//var zmirename = $(_xml).find("zmirename").text();
			
			parsezmirename($(_xml).find("zmirename").text())
            $(_xml).find("Item").each(function() {
            	var name =decodeURIComponent($(this).find("name").text());
					var macaddress =$(this).find("mac").text().toUpperCase();
					for(x=0;x<nickName.length;x++){
					if(macaddress==nickName[x].mac.toUpperCase()){
						name = _utf8_decode(zUniDecode(nickName[x].name));
						break;

						}}
                //name = decodeURIComponent($(this).find("name").text());
                name_type = $(this).find("name_type").text();
                mac = $(this).find("mac").text();
                blocked = $(this).find("blocked").text();
                conn_type = $(this).find("conn_type").text();
                ip_address = $(this).find("ip_address").text();
                connected =  $(this).find("connected").text();
                conn_time =  $(this).find("conn_time").text();
                _arrayTableData[index]=new Array(8);

                _arrayTableData[index][0]=index;
                _arrayTableData[index][1]=blocked;
                _arrayTableData[index][2]=name;
                _arrayTableData[index][3]=ip_address;
                _arrayTableData[index][4]=mac;
                _arrayTableData[index][5]=conn_type;
                _arrayTableData[index][6]=name_type;
                _arrayTableData[index][7]=connected;
                _arrayTableData[index][8]=conn_time;
                index++;
            });

            this.loadTableData(_arrayTableData);
        }
        this.loadTableData = function(arrayTableData) {

            var tableConnectedDevice=document.getElementById('tableConnectedDevice');
            var tBodytableConnectedDevice = tableConnectedDevice.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableConnectedDevice');
            if(arrayTableData.length==0) {
                var row1 =  tBodytableConnectedDevice.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 7;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            } else {
                for(var i=0; i<arrayTableData.length; i++) {
                    var arrayTableDataRow=arrayTableData[i];


                    var row =  tBodytableConnectedDevice.insertRow(i);
                    var indexCol= row.insertCell(0);

                    var nameCol = row.insertCell(1);
                    var sortCol=row.insertCell(2);
                    //sortCol.className="status";
                    var ipCol = row.insertCell(3);
                    var macCol = row.insertCell(4);
                    var conn_typeCol = row.insertCell(5);

                    var conntimeCol=row.insertCell(6);
                    indexCol.style.display='none';
                    indexCol.innerHTML=arrayTableDataRow[0];
                    var buttonId="button"+i;

                    if(arrayTableDataRow[2] == 'unkown_marvell')
                        arrayTableDataRow[2] = ' ';
                    nameCol.innerHTML=arrayTableDataRow[2];
                    if(arrayTableDataRow[7]=='1')
                        sortCol.innerHTML="<a><img src='images/status-icon3.png'   alt='' /></a><label value='"+ arrayTableDataRow[7]+"'/> ";
                    else
                        sortCol.innerHTML="<a><img src='images/status-icon2.png'  alt='' /></a><label value='"+ arrayTableDataRow[7]+"'/>";
                    if(arrayTableDataRow[3]!='')
                        ipCol.innerHTML=arrayTableDataRow[3];
                    else
                        ipCol.innerHTML='--';
                    macCol.innerHTML=arrayTableDataRow[4];
                    conn_typeCol.innerHTML=arrayTableDataRow[5];
                    var connTime = arrayTableDataRow[8].split(",");
                    var nHour = parseInt(connTime[0]);
                    var nMinute = parseInt(connTime[1]);
                    var nSecond = parseInt(connTime[2]);
                    var connTimeInfo = (nHour > 1) ? (nHour   + " " +  jQuery.i18n.prop("ldHours") + " ") : (nHour  + " " +  jQuery.i18n.prop("ldHour") + " ");
                    connTimeInfo += (nMinute > 1) ? (nMinute  + " " +  jQuery.i18n.prop("ldMinutes") + " ") : (nMinute   + " " +  jQuery.i18n.prop("ldMinute") + " ");
                    connTimeInfo += (nSecond > 1) ? (nSecond  + " " +  jQuery.i18n.prop("ldSeconds")) : (nSecond   + " " +  jQuery.i18n.prop("ldSecond"));
                    conntimeCol.innerHTML = connTimeInfo;

                }

                //alert("reset lastcol: " +tableConnectedDevice.lastCol);
                //Table.sort(tableConnectedDevice,{'desc':_lastSortValue, 'col':3, 'overridesort':true});
                //Table.sort(tableConnectedDevice,{'desc':_lastSortValue,'re_sort':true});
            }
            Table.stripe(tableConnectedDevice,"alternate","table-stripeclass");
            if (_lastSortValue) {
                _lastSortValue = false;
        Table.sort(tableConnectedDevice, {'desc':true,'re_sort':false,'col':3});
            } else {
            Table.sort(tableConnectedDevice, {'re_sort':true,'col':3});
            }
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML ="";
            document.getElementById('Content').innerHTML = callProductHTML("html/home_network/connected_device.html");
            Table.auto();
            _lastSortValue = true;
        }
        this.setXMLName = function (xmlname) {
            _xmlname = xmlname;
        }
        this.postItem = function(index,isBlocked,renameFlag,name) {
            var itemIndex=0;
            mapData=null;
            mapData = new Array();

            this.putMapElement("RGW/device_management/known_devices_list/Item#index",_arrayTableData[index][0],itemIndex++);
            this.putMapElement("RGW/device_management/known_devices_list/Item/blocked",isBlocked,itemIndex++);
            this.putMapElement("RGW/device_management/known_devices_list/Item/mac",_arrayTableData[index][4],itemIndex++);
            if(renameFlag) {

                this.putMapElement("RGW/device_management/known_devices_list/Item/name",name,itemIndex++);
                this.putMapElement("RGW/device_management/known_devices_list/Item/name_type",2,itemIndex++);
            } else {
                this.putMapElement("RGW/device_management/known_devices_list/Item/name",_arrayTableData[index][2]);
                this.putMapElement("RGW/device_management/known_devices_list/Item/name_type",_arrayTableData[index][6],itemIndex++);
            }
            var connType=_arrayTableData[index][5];
            if(connType!='')
                this.putMapElement("RGW/device_management/known_devices_list/Item/con_type",connType,itemIndex++);

            if(mapData.length>0) {
                postXML(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
                //this.onLoad();
            }
        }
        this.onPostSuccess = function () {
            this.onLoad(true);
        }
        this.putMapElement = function(xpath,value,index) {
            mapData[index]=new Array(2);
            mapData[index][0]=xpath;
            mapData[index][1]=value;
        }
        this.getTableData = function() {
            return _arrayTableData;
        }
        this.getName = function(index) {
            return _arrayTableData[index][2];
        }
        this.getBlocked = function(index) {
            return _arrayTableData[index][1];
        }
        this.postItemRemoveDeviceEntry = function(index) {
            mapData=null;
            mapData = new Array();
            this.putMapElement("RGW/device_management/known_devices_list/Item/mac#delete",_arrayTableData[index][4],index);

            if(mapData.length>0) {
                postXML(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
                // this.onLoad();
            }

        }
        return this.each(function () {
            _connectedDeviceIntervalID = setInterval( "g_objContent.onLoad(false)", _connectedDeviceInterval);
        });
    }
})(jQuery);
var connetedDeviceSelectedIndex=0;
function showDlg(index) {
    clearInterval(_connectedDeviceIntervalID);
    connetedDeviceSelectedIndex=index;
    sm('box',350,200);

    getID("tbModal").value = g_objContent.getName(index);
    getID("tbModal").focus();
    getID("tbModal").focus();
    document.getElementById("btnModalOk").innerHTML=jQuery.i18n.prop("btnModalOk");
    document.getElementById("btnModalReset").innerHTML=jQuery.i18n.prop("btnModalReset");
    document.getElementById("lModalHeader").innerHTML=jQuery.i18n.prop("lModalHeader");
    document.getElementById("h1DeviceHeader").innerHTML=jQuery.i18n.prop("h1DeviceHeader");

}
function btnOkSelected() {
    _connectedDeviceIntervalID = setInterval( "g_objContent.onLoad()", _connectedDeviceInterval);

    var  index=connetedDeviceSelectedIndex;
    var strName=getID("tbModal").value;
    strName = encodeURIComponent(strName);
    if(strName!='') {
        if(deviceNameValidation(strName)) {
            g_objContent.postItem(index,g_objContent.getBlocked(index),true,strName);
            // hm('box');
        } else {
            getID("ErrInvalidName").style.display = "block";
            getID("ErrInvalidName").innerHTML = jQuery.i18n.prop("ErrInvalidName");
        }
    }
}
function btnCancelClicked() {
    _connectedDeviceIntervalID = setInterval( "g_objContent.onLoad()", _connectedDeviceInterval);
}

function btnRemoveSelected() {
    _connectedDeviceIntervalID = setInterval( "g_objContent.onLoad(false)", _connectedDeviceInterval);

    var  index=connetedDeviceSelectedIndex;
    //var strName=getID("tbModal").value;
    g_objContent.postItemRemoveDeviceEntry(index);
}

function blockUnblock(index,value) {
    g_objContent.postItem(index,value,false,null);
}

