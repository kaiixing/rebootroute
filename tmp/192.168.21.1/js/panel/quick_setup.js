(function($) {
    // changed
    $.fn.quick_setup = function(oInit) {
        this.loadHtml = function() {
			document.getElementById("navigation").style.width = '132px';
            document.getElementById("navigation").innerHTML = "<ul id ='menu' ><li ><a id='menuQuickSetup' class='on'>Quick Setup </a> </li> </ul>";

            document.getElementById("menuQuickSetup").innerHTML = jQuery.i18n.prop('quickSetupName');
            document.getElementById("mainColumn").innerHTML="";
            document.getElementById("mainColumn").innerHTML=callProductHTML("html/quick_setup.html");
            if ("dongle" == g_platformName) {
                document.getElementById("h1WirelessSeetings").style.display = "none";
            }
            document.getElementById("h1UserSettings").innerHTML = jQuery.i18n.prop('h1UserSettings');
            document.getElementById("h1InternetConnection").innerHTML = jQuery.i18n.prop('h1InternetConnection');
            document.getElementById("h1WirelessSeetings").innerHTML = jQuery.i18n.prop('h1WirelessSeetings');
            document.getElementById("h1DevicePlaceGuid").innerHTML = jQuery.i18n.prop('h1DevicePlaceGuid');
			document.getElementById("hFinished").innerHTML = jQuery.i18n.prop('hFinished');

            $('#uploadISPFileForm').ajaxForm( {
            success: function() {
                    hm();
                },
            error: function() {
                    hm();
                },
            beforeSend: function() {
                    if (document.getElementById("fileName").value.toString().lastIndexOf(".xml") == -1) {
                        showAlert(jQuery.i18n.prop("XMLExtError"));
                        return false;
                    } else { }
                    return true;
                }

            });
            var h1Elements = document.getElementsByTagName("h1");
            lableLocaliztion(h1Elements);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            showDiv("MBQuickSetupMainPage", 400, 220);
            addClassQSon("h1UserSettings");
            MBQuickSetupMainPageLoadData();
        }
        this.onPostSuccess = function() {
            username = username1;
            passwd = passwd1;
            hideDiv('MBQuickSetupPage2');
        }
        return this.each(function() {
        });
    }
})(jQuery);
var timezoneStringArrayQS =  new Array(2);
var indexString;
var g_router_username="";
var g_router_password="";
var g_multi_account="";
var selectedInternetConn = "disabled";
var g_QuickSetup;
var flagIpBoxAdded = false;
var g_InternetConnectionObj;
var g_PrimaryNetworkObj;
var username1,passwd1;
function quickSetup() {
	var hard_ver = getHardware_Version();
    //helpPage = "QuickSetup";
    // document.getElementById("quickSetup").innerHTML=jQuery.i18n.prop('quickSetupText');
    //document.getElementById("quickSetupSpan").innerHTML = document.getElementById("quickSetup").innerHTML + '|  <a href="#.">Help</a>  |  Log Out';
    document.getElementById("lableWelcome").innerHTML = jQuery.i18n.prop("lableWelcome");
    document.getElementById("quickSetupSpan").innerHTML = "<a href='#.' id='quickSetupspanlink' onclick=getHelp('QuickSetup')>Help</a>";
    document.getElementById("quickSetupspanlink").innerHTML = jQuery.i18n.prop("helpName");
    g_QuickSetup = $("#mainColumn").quick_setup();
    clearRefreshTimers();
    g_QuickSetup.loadHtml();
    if ("dongle" == g_platformName) {
        document.getElementById("btnNext1").onclick = btnQSNextClicked1;
        document.getElementById("btnBack1").onclick = btnBackClicked2;
    }
	if(hard_ver == "Ver.B"||hard_ver == "Ver.C")
			$("#drpdwnSecurityType").append("<option id=\"dropdownWEP\" value=\"WEP\">WEP</option>");
    document.getElementById("btnExit").innerHTML = jQuery.i18n.prop("btnExit");
    buttonLocaliztion(document.getElementById("btnNext").id);
}

function btnQSNextClicked() {
    username1 =  encodeURIComponent(document.getElementById("tbrouter_username").value);
    passwd1 =   encodeURIComponent(document.getElementById("tbrouter_password").value);
    //Post MBQuickSetupMainPage data [Admin, locale]

    if(validatePasswordQS()) {
        if(isValidAdminPage()) {


          

            showNextPage()

        }
    }
//End MBQuickSetupMainPage

//MBQuickSetupPage1 : Internet Connection Screen
}
var ICmapData = new Array();
var PNmapData;
var shwDlg = 0;

function btnFinishClicked(id) {
    var mapData = new Array();
    var index = 0;
	if(g_multi_account == "1")
	{
		if (passwd1 != g_router_password)
		{
			mapData = putMapElement(mapData,"RGW/management/account_management/account_action", 1, index++);//edit or add
			mapData = putMapElement(mapData,"RGW/management/account_management/account_username", username1, index++);
			mapData = putMapElement(mapData,"RGW/management/account_management/account_password", passwd1, index++);
            mapData = putMapElement(mapData,"RGW/management/router_user_list/Item#index", index, index++);
            mapData = putMapElement(mapData,"RGW/management/router_user_list/Item/username", username1, index++);
			mapData = putMapElement(mapData,"RGW/management/router_user_list/Item/password", passwd1, index++);
			mapData = putMapElement(mapData,"RGW/management/router_user_list/Item/authority", 1, index++);
		}
	}
	else
	{
	    if (username1 != g_router_username)
	        mapData = putMapElement(mapData, "RGW/management/router_username", username1, index++);
	    if (passwd1 != g_router_password)
	        mapData = putMapElement(mapData, "RGW/management/router_password", passwd1, index++);
	}
    // postXML("admin", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    mapData = putMapElement(mapData, "RGW/management/qs_complete", "1", index++);

    //ICmapData =  g_InternetConnectionObj.onPost(false);
    if(shwDlg==1) {
        ICmapData[userNameIndex][1] =userNameIspValue;

    }
    if(shwDlg==2) {

        ICmapData[passwordIndex][1] =passwordIspValue;
    }
    if(shwDlg==3) {
        ICmapData[userNameIndex][1] = userNameIspValue;
        ICmapData[passwordIndex][1] = passwordIspValue;
    }

    if ("mifi" == g_platformName) {
        var PNmapData = g_PrimaryNetworkObj.onPost(false);

        for (var i = 0; i < ICmapData.length; i++) {
            mapData = putMapElement(mapData, ICmapData[i][0], ICmapData[i][1], index++);
        }
        for (i = 0; i < PNmapData.length; i++) {
            mapData = putMapElement(mapData, PNmapData[i][0], PNmapData[i][1], index++);
        }
    }

    if (mapData.length > 0) {
        postXML("wizard", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    }
    shwDlg = 0;
}
function btnExitClicked(id) {

    hideDiv(id);

}
function btnQSNextClicked1() {
    //ICmapData =  g_objContent.onPost(false);
    g_objContent.onPost(false);
    if (document.getElementById("micdropdown").value == "usbmodem")

        if (g_objContent.isValid()) {
            if (shwDlg == 1) {
                sm("mbUserNameHeader", 350, 175);
                getID("h1UserNameHeader").innerHTML = jQuery.i18n.prop('h1RouterMessageHeader');
                getID("lISPUserName").innerHTML = jQuery.i18n.prop('lISPUserName');
                getID("btnModalSave").innerHTML = jQuery.i18n.prop('btnModalSave');

            }
            if (shwDlg == 3) {
                sm("mbUserNamePasswordHeader", 350, 240);
                getID("h1UserNamePasswordHeader").innerHTML = jQuery.i18n.prop('h1RouterMessageHeader');
                getID("lISPUserName1").innerHTML = jQuery.i18n.prop('lISPUserName1');
                getID("lISPPassword1").innerHTML = jQuery.i18n.prop('lISPPassword1');
                getID("btnModalSave").innerHTML = jQuery.i18n.prop('btnModalSave');
            }
            if (shwDlg == 2) {
                sm("mbPassNameHeader", 350, 175);
                getID("h1PassNameHeader").innerHTML = jQuery.i18n.prop('h1RouterMessageHeader');
                getID("lISPPass").innerHTML = jQuery.i18n.prop('lISPPass');
                getID("btnModalSave").innerHTML = jQuery.i18n.prop('btnModalSave');

            }

        }
    if (shwDlg == 0) {
        if ("dongle" == g_platformName) {
            document.getElementById("MBQuickSetupPage").style.display = "none";
            showDiv("MBQuickSetupPage3", 400, 220);
            buttonLocaliztion(document.getElementById("btnBack1").id);
            buttonLocaliztion(document.getElementById("btnFinish").id);
            MBQuickSetupPage3Localization();
            addClassQSon("h1DevicePlaceGuid");
        } else {
            showNextPage();
        }
    }

}
function showNextPage() {
    document.getElementById("MBQuickSetupMainPage").style.display = "none";
    showDiv("MBQuickSetupPage2",400,220);
    document.getElementById("btnExit3").innerHTML = jQuery.i18n.prop("btnExit3");
    buttonLocaliztion(document.getElementById("btnBack3").id);
    buttonLocaliztion(document.getElementById("btnFinish").id);
    g_objContent = null;
    g_objContent =  $("#MBQuickSetupPage2").objWire_Sec();
    g_objContent.setXMLName("uapxb_wlan_security_settings");
    g_objContent.addRadios();
    g_objContent.onLoad(false);
    g_PrimaryNetworkObj = g_objContent;
    addClassQSon("h1WirelessSeetings");
}

function MBQuickSetupPage3Localization() {
    getID("Microwave").innerHTML = jQuery.i18n.prop('Microwave');
    getID("Bluetooth_Devices").innerHTML = jQuery.i18n.prop('Bluetooth_Devices');
    getID("Cordless_Phone").innerHTML = jQuery.i18n.prop('Cordless_Phone');
    getID("ownDevices").innerHTML = jQuery.i18n.prop('ownDevices');
    getID("Baby_Monitor").innerHTML = jQuery.i18n.prop('Baby_Monitor');

}
function btnBackClicked1() {
    document.getElementById("MBQuickSetupPage2").style.display = "none";
    showDiv("MBQuickSetupMainPage",400,220);
    document.getElementById("btnExit").innerHTML = jQuery.i18n.prop("btnExit");
    buttonLocaliztion(document.getElementById("btnNext").id);
    g_objContent = g_InternetConnectionObj;
    addClassQSon("h1UserSettings");
    MBQuickSetupMainPageLoadData();
}
function btnBackClicked2() {
    shwDlg = 0;
    var prototype = document.getElementById("micdropdown").value;
    selectedInternetConn = prototype;
    if ("dongle" == g_platformName) {
        document.getElementById("MBQuickSetupPage3").style.display = "none";
    } else {
        document.getElementById("MBQuickSetupPage2").style.display = "none";
    }
    //showDiv("MBQuickSetupPage1",400,220);
    document.getElementById("MBQuickSetupMainPage").style.display = "block";
    //document.getElementById("divInternetConnectSet").innerHTML = callProductHTML("html/internet/internet_connection.html");
    $("#inter_help").hide();
    $("#divFormBox").hide();
    $("#divSaveButton").hide();
    $("#h1WirelessSeetings").removeClass("on");
    document.getElementById("btnFinish").innerHTML = jQuery.i18n.prop("btnFinish");
    buttonLocaliztion(document.getElementById("btnBack1").id);
    buttonLocaliztion(document.getElementById("btnFinish").id);
    g_objContent = null;
    g_objContent =  $("#MBQuickSetupPage1").objInternetConn();
    g_objContent.setXMLName("wan");
    // g_objContent.clearIPBoxes();
    g_objContent.addIPBoxes();
    g_objContent.onLoad(false);
    g_InternetConnectionObj = g_objContent;
    addClassQSon("h1UserSettings");

}
function btnBackClicked3() {
    document.getElementById("MBQuickSetupPage3").style.display = "none";
    showDiv("MBQuickSetupPage2",400,220);
    document.getElementById("btnExit3").innerHTML = jQuery.i18n.prop("btnExit3");
    buttonLocaliztion(document.getElementById("btnBack1").id);
    buttonLocaliztion(document.getElementById("btnNext3").id);

    addClassQSon("h1WirelessSeetings");
}
function showDiv(divid,width,height) {
    removeClassQS();
    document.getElementById(divid).style.display = "block";

}
function hideDiv(divid) {
    //document.getElementById("quickSetup").innerHTML=jQuery.i18n.prop('quickSetupText1');
    document.getElementById("lableWelcome").innerHTML = jQuery.i18n.prop("lableWelcome");
    document.getElementById("quickSetupSpan").innerHTML = '<a href="#."  onclick="quickSetup()" id="quickSetup" >Quick Setup</a>  |  <a href="#." id="HelpName" onclick="getMainHelp()">Help</a>  |  <a href="#."  id="LogOutName"  onclick="logOut()">Log Out</a>';
    document.getElementById("quickSetup").innerHTML = jQuery.i18n.prop("quickSetupName");
    document.getElementById("HelpName").innerHTML = jQuery.i18n.prop("helpName");
    document.getElementById("LogOutName").innerHTML = jQuery.i18n.prop("LogOutName");
    document.getElementById(divid).style.display = "none";
	document.getElementById("navigation").style.width = '956px';
    document.getElementById("navigation").innerHTML=" <ul id ='menu'></ul>";
    createMenuFromXML();
    createMenu(1);
   // initmb();
}
function MBQuickSetupMainPageLoadData() {
    var xmlAdmin = getData("admin");
    var xmlLocale = getData("locale");
    var index=0;
    var router_username_;
   	var router_password_;
   	var authority;
	var _arrayTableDataAccount = new Array(0);
	var indexAccount;
	var login_account_index;

    timezoneStringArrayQS[0] = new Array();
    timezoneStringArrayQS[1] = new Array();
    $(xmlAdmin).find("management").each(function(){
		g_multi_account = $(this).find("multi_account").text();
    });
	if(g_multi_account == "1")
	{
		 $(xmlAdmin).find("router_user_list").each(function() {
	                $(this).find("Item").each(function() {
						router_username_ = decodeURIComponent($(this).find("username").text());
	               		router_password_ = decodeURIComponent($(this).find("password").text());
	                    authority = $(this).find("authority").text();
						if(router_username_ == username)
						{
							login_account_index	= indexAccount;
						}
	                    _arrayTableDataAccount[indexAccount] = new Array(3);
	                    _arrayTableDataAccount[indexAccount][0] = router_username_;
	                    _arrayTableDataAccount[indexAccount][1] = router_password_;
	                    _arrayTableDataAccount[indexAccount][2] = authority;
	                    indexAccount++;

	                });
	         });
			 g_router_username =  _arrayTableDataAccount[login_account_index][0];
			 g_router_password =  _arrayTableDataAccount[login_account_index][1];
			 document.getElementById("tbrouter_username").value = g_router_username;
       		 document.getElementById("tbrouter_password").value = g_router_password;
       		 document.getElementById("tbreenter_password").value =g_router_password;
			 document.getElementById("tbrouter_username").readOnly = true;
	}
	else
	{
		 $(xmlAdmin).find("management").each(function(){
		 	 g_router_username = decodeURIComponent($(this).find("router_username").text());
      		 g_router_password = decodeURIComponent($(this).find("router_password").text());
       		 document.getElementById("tbrouter_username").value = g_router_username;
       		 document.getElementById("tbrouter_password").value = g_router_password;
       		 document.getElementById("tbreenter_password").value =g_router_password;
	     	 document.getElementById("tbrouter_username").readOnly = false;
		 });
	}
}

function validatePasswordQS() {
    if(document.getElementById('tbrouter_password').value!=document.getElementById('tbreenter_password').value) {
        document.getElementById('lPassErrorMes').style.display = 'block';
        document.getElementById('lPassErrorMes').innerHTML=jQuery.i18n.prop('lPassErrorMes');
        document.getElementById("tbreenter_password").value = '';
        return false;
    } else {
        document.getElementById('lPassErrorMes').style.display = 'none';
        return true;
    }
}
function putMapElement(controlMap,path,value,index) {
    controlMap[index] = new Array(2);
    controlMap[index][0] = path;
    controlMap[index][1] = value;
    return controlMap;
}
function removeClassQS() {
    document.getElementById("h1UserSettings").className="";
    document.getElementById("h1InternetConnection").className="";
    document.getElementById("h1WirelessSeetings").className="";
    document.getElementById("h1DevicePlaceGuid").className="";

}
function addClassQSon(id) {
    document.getElementById(id).className="on";
}
