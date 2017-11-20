var gBattery_level = false;
var JSONObject;//={"data":{"changelogUrl":"","weight":"1","hash":"A77AED5F055C7DA64D1E4644424178D8","description":"1.??WEB HTML??????\r\n2.???????5s??2s\r\n3.????????\r\n4.????Timerout?10s??????????socket\r\n5.???????20?????WPS???????500ms\r\n6.????????????????\r\n7.????48?????????24??????\r\n8.??WEB?????????IE???????????\r\n9.??????/?????????????????/????????????100%??\r\n10.???????timer??????1????APP\r\n11.??WEB??????????\r\n12.??WEB??SD?LOG??\r\n13.??SD?LOG????\r\n14.???????USB?????????Wi-Fi\r\n15.????????\r\n16.????????\r\n17.???????????????????\r\n18.TF??????????????2s????????????????????\r\n19.????????????????\r\n20.??WEB?????\r\n21.?????Wi-Fi??14???\r\n22.??Marvell DSP?????crash??","link":"http://www.zimiker.com/pb05/fbf_0.2.35.bin","toVersion":"0.2.35","upgradeId":"4053","size":7241728},"code":"0"};
var mBattery_level;
var mSN;
var mChanne;
var mDate;
var DEFAULT_TOKEN = "8007236f-a2d6-4847-ac83-c49395ad6d65";
var mFullSwVersion;
var mProject_name;
var autoStartUpdate;

(function ($) {
    $.fn.objSoftUpdate = function (InIt) {
        var xmlName = '';
        this.onLoad = function () {

            var index = 0;
            this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            //var xml = callProductXMLNoDuster(xmlName);
            var xml = callProductXML(xmlName);

            lableLocaliztion(document.getElementsByTagName("label"));
            buttonLocaliztion("btUpgrade");
            buttonLocaliztion("btGetSoftVersion");
			buttonLocaliztion("ldownloadbtn");
			document.getElementById('otastatus').innerHTML = jQuery.i18n.prop("lotamessage4");

			$(xml).find("sysinfo").each(function() {
				var mversion = $(this).find("version_num").text();
                document.getElementById("lCurrentSoftVersionValue").innerHTML =   mversion.substring(0,mversion.indexOf("_"));
                document.getElementById("lCurrentSoftwareDateValue").innerHTML =   $(this).find("version_date").text();
            });
			$(xml).find("time_setting").each(function() {
				var tyear = $(this).find("year").text();
				var tmonth = $(this).find("month").text();
				var tday = $(this).find("day").text();
				var thour = $(this).find("hour").text();
				var tminute = $(this).find("minute").text();
				var tsecond = $(this).find("second").text();
                mDate = tyear+"-"+tmonth+"-"+tday+"--"+thour+":"+tminute+":"+tsecond;
            });
			var otaurl = combinURL();
			var data = postotaurl(otaurl);
        	}

        this.setXMLName = function (_xmlname) {
            xmlName = _xmlname;
        }
		this.onPostSuccess = function (){
			var OTAdata;
			JSONObject = "";
			var xml =getData("OTAdata");
	 		$(xml).find("CheckOTAdata").each(function() {
	 		OTAdata = $(this).find("miOTAdata").text();
		
	 		})
	 		if(OTAdata){
			JSONObject = eval('(' + OTAdata + ')');
			if(isEmptyObject(JSONObject.data)){
				document.getElementById('otastatus').innerHTML = jQuery.i18n.prop("lotamessage3");
				document.getElementById('lchangeLog').style.display = 'none';
			}else{
				if(typeof(JSONObject.data.link) == "undefined" || JSONObject.data.link == ""){
					document.getElementById('otastatus').innerHTML = jQuery.i18n.prop("lotamessage3");
					document.getElementById('lchangeLog').style.display = 'none';
				}else{
				document.getElementById('otastatus').innerHTML = jQuery.i18n.prop("lotamessage1")+JSONObject.data.toVersion+jQuery.i18n.prop("lotamessage5")+getWlanByte(JSONObject.data.size)+jQuery.i18n.prop("lotamessage2");
				document.getElementById('otalogs').style.display = 'block';
				document.getElementById('ldownloadsta').style.display = 'block';
				document.getElementById('lchangeLog').style.display = 'block';
				document.getElementById('ldownloadbtn').style.display = 'block';
				document.getElementById('lotachangelog').style.display = 'block';
				document.getElementById('lchangeLog').innerHTML = parseEnter2br(JSONObject.data.description);
				var ldownloadurl = JSONObject.data.link;
				if(ldownloadurl.indexOf("http://www.zimiker.com")>= 0||ldownloadurl.indexOf("http://erp.zimiker.com")>= 0)
				document.getElementById('ldownloadurl').href =ldownloadurl.substring(0,ldownloadurl.indexOf("/pb05/"))+":1080"+ldownloadurl.substring(ldownloadurl.indexOf("/pb05/")) ;
				else
				document.getElementById('ldownloadurl').href =ldownloadurl;
			}}}else document.getElementById('otastatus').innerHTML = jQuery.i18n.prop("lotamessage6");
}
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/router/software_upgrade.html");
            $('#uploadFileForm').ajaxForm({
            success: function() {
                    uploadfiledone();
                    //hm();
                },
            error: function() {
            		BurnFileFail();
                    //hm();
                }
            });

        }
        return this.each(function () {
        });
    }
})(jQuery);

function upgradeRouter() {	
	var hard_ver = getHardware_Version();
	if(hard_ver=="Ver.B"||hard_ver=="Ver.C"){
    clearInterval(autoStartUpdate);
    var status=1;
    var xml;

	if(isPowerBankCanUpgrade()){
	    if(document.getElementById("softVersionUpdateFile").value!="") {
	        if(document.getElementById("softVersionUpdateFile").value.toString().lastIndexOf(".bin")==-1) {
	            showAlert(jQuery.i18n.prop("BinExtError"));

	        } else {
				xml= callProductXMLNoDuster("upgrade_firmware");
				if(xml != null){
					status = $(xml).find("backup_status").text();
					if(status == "1"){
						upgradeRouterStart();
						
						
					}
					else{
						ConfirmBackupFirmWare();
					}
				}
				//ConfirmBackupFirmWare();
	        }
	    } else {
	       showAlert(jQuery.i18n.prop("lsoftwareError"));
	    }
	}
	else{
		showAlert(jQuery.i18n.prop("batterylow"));
	}}else{
		if(isPowerBankCanUpgrade()){
		    if(document.getElementById("softVersionUpdateFile").value!="") {
		        if(document.getElementById("softVersionUpdateFile").value.toString().lastIndexOf(".bin")==-1) {
		            showAlert(jQuery.i18n.prop("BinExtError"));

		        } else {
					upgradeRouterStart()	
		        }
			}else {
	       		showAlert(jQuery.i18n.prop("lsoftwareError"));
	    	}
		}else{
			showAlert(jQuery.i18n.prop("batterylow"));
		}
				
			}//jmm end
}

function upgradeRouter_bk() {
	clearInterval(autoStartUpdate);
	upLoadFileSuccess_bk();
  
	
	
}

function ConfirmBackupFirmWare() {
	sm('confirmBackUp',350,190);
	document.getElementById("btnBackupOK").innerHTML = jQuery.i18n.prop("btnBackupOK");
	document.getElementById("btnBackupCancle").innerHTML = jQuery.i18n.prop("btnBackupCancle");
	document.getElementById("h1ConfirmBackUp").innerHTML = jQuery.i18n.prop("h1RouterUpgrade");
	document.getElementById("lQueryConfirmBackUp").innerHTML = jQuery.i18n.prop("lQueryConfirmBackUp");
	document.getElementById("lConfirmBackUpWarning").innerHTML = jQuery.i18n.prop("lConfirmBackUpWarning");
}
function upgradeRouterStart() {
	stopInterval();
	var url;
	var host = window.location.protocol + "//" + window.location.host;
	url = host+getHeader("GET","upgrade");

	hm();
	sm('upgradeModalBox',350,170);
	document.getElementById("h1RouterUpgrade").innerHTML = jQuery.i18n.prop("h1RouterUpgrade");
	document.getElementById("lUploading").innerHTML = jQuery.i18n.prop("lUploading");
	document.getElementById("uploadFileForm").action = url;
	document.getElementById("btnSoftSubmit").click();
	startInterval();
	upLoadFileSuccess();
}
function upgradeRouterStart_bk() {
	stopInterval();
	var url;
	var host = window.location.protocol + "//" + window.location.host;
	url = host+getHeader("GET","upgrade");

	//hm();
	//sm('upgradeModalBox',350,170);
	//document.getElementById("h1RouterUpgrade").innerHTML = jQuery.i18n.prop("h1RouterUpgrade");
	//document.getElementById("lUploading").innerHTML = jQuery.i18n.prop("lUploading");
	document.getElementById("uploadFileForm").action = url;
	document.getElementById("btnSoftSubmit").click();
	startInterval();
	//upLoadFileSuccess();
}

var timeStatusBar,upgradeFileSuccessIntervalID,afterRebootID, timeBurnStatusBar;
var standardTiming = 100000;
var flagIsSuccess = true;

function upLoadFileSuccess() {
    if(document.getElementById("softVersionUpdateFile").value!="") {
        hm('upgradeModalBox');
        sm('upgradeModalBox1',350,230);
        document.getElementById("h1RouterUpgrade1").innerHTML = jQuery.i18n.prop("h1RouterUpgrade");
        document.getElementById("lUpgrade").innerHTML = jQuery.i18n.prop("lDownload");
        document.getElementById("lWarning").innerHTML = jQuery.i18n.prop("lWarning");
        document.getElementById("lWarningLine1").innerHTML = jQuery.i18n.prop("lWarningLine1");
        document.getElementById("lWarningLine2").innerHTML = jQuery.i18n.prop("lWarningLine2");

        timeStatusBar = setInterval("DownloadstatusBar()", 1200);
    }

}
function upLoadFileSuccess_bk() {
    if(document.getElementById("softVersionUpdateFile").value!="") {
        hm('upgradeModalBox');
        sm('upgradeModalBox1',350,230);
        document.getElementById("h1RouterUpgrade1").innerHTML = jQuery.i18n.prop("h1RouterUpgrade");
        document.getElementById("lUpgrade").innerHTML = jQuery.i18n.prop("lDownload");
        document.getElementById("lWarning").innerHTML = jQuery.i18n.prop("lWarning");
        document.getElementById("lWarningLine1").innerHTML = jQuery.i18n.prop("lWarningLine1");
        document.getElementById("lWarningLine2").innerHTML = jQuery.i18n.prop("lWarningLine2");

        timeStatusBar = setInterval("DownloadstatusBar_bk()", 1200);
    }

}
function upgradeFileSuccess() {

    sm('upgradeModalBox1',350,230);
    document.getElementById("h1RouterUpgrade1").innerHTML = jQuery.i18n.prop("h1RouterUpgrade");
    document.getElementById("lUpgrade").innerHTML = jQuery.i18n.prop("lBurnFirm");
    document.getElementById("lWarning").innerHTML = jQuery.i18n.prop("lWarning");
    document.getElementById("lWarningLine1").innerHTML = jQuery.i18n.prop("lWarningLine1");
    document.getElementById("lWarningLine2").innerHTML = jQuery.i18n.prop("lWarningLine2");
	var status=1;
	var progress=0;
	var xml;

	xml= callProductXMLNoDuster("upgrade_firmware");
	if(xml != null)
	{
        status = $(xml).find("upgrade_status").text();
		if(status == "2" || status == "0")
		{
			timeBurnStatusBar = setInterval("BurnstatusBar()", 2000);
		}else if(status == "3")
		{
			clearInterval(timeStatusBar);
		    clearInterval(timeBurnStatusBar);
			BurnFileFail();
		}
	}else{
			clearInterval(timeStatusBar);
		    clearInterval(timeBurnStatusBar);
			BurnFileFail();
	}

}

function uploadfiledone()
{
	clearInterval(timeStatusBar);
	hm('upgradeModalBox1');

	_pixels = 100;
	document.getElementById("statusDiv").style.width=_pixels+"%";
	document.getElementById("lUpgrade").innerHTML = jQuery.i18n.prop("lDownload");
	_pixels = 0;
	upgradeFileSuccess();
}

function uploadfilefailed()
{
	clearInterval(timeStatusBar);
	hm('upgradeModalBox1');

	//_pixels = 100;
	//document.getElementById("statusDiv").style.width=_pixels+"%";
	document.getElementById("lUpgrade").innerHTML = "upload load failed";

}
function BurnFileSuccess()
{
	document.getElementById("statusDiv").style.width="100%";
	document.getElementById("lUpgrade").innerHTML = jQuery.i18n.prop("lBurnFirm")+" 100%";

	clearInterval(timeBurnStatusBar);
	hm('upgradeModalBox1');
 	sm('upgradeModalBox2',319,170);
    document.getElementById("h1RouterUpgrade2").innerHTML = jQuery.i18n.prop("h1RouterUpgrade");
    document.getElementById("lReboot").innerHTML = jQuery.i18n.prop("lSuccessReboot");

    afterRebootID =  setInterval("afterReboot()", 20000);
}

function BurnFileFail()
{
	clearInterval(timeBurnStatusBar);
	hm('upgradeModalBox1');
 	sm('upgradeModalBox2',319,170);
    document.getElementById("h1RouterUpgrade2").innerHTML = jQuery.i18n.prop("h1RouterUpgrade");
    document.getElementById("lReboot").innerHTML = jQuery.i18n.prop("lFailReboot");

    afterRebootID =  setInterval("afterReboot()", 60000);
}


function afterReboot() {
    hm();
    clearInterval(afterRebootID);
    clearAuthheader();
}
function getStatus(status) {
    switch (status) {
        case "0":
            return        "NET_ERR_STATUS_OK";
        case "160":
            return        "NET_ERR_SWUP_FILE_SIZE";    /* File too big see: MAX_UPGRADE_SIZE */
        case "161":
            return        "NET_ERR_SWUP_BAD_URL";    /* Not an http or ftp url */
        case  "162":
            return        "NET_ERR_SWUP_CONNECTION";    /* Server stalled or not responding */
        case  "163":
            return        "NET_ERR_SWUP_DOWNGRADE";    /* Downgrade */
        case "164":
            return        "NET_ERR_SWUP_REMOTE_NEEDLESS";    /* Remote upgrade needless */
        case "165":
            return        "NET_ERR_SWUP_REMOTE_NEEDED";    /* Remote upgrade need */
        case "166":
            return        "NET_ERR_SWUP_BAD_FILE";    /* Image file corrupt */
        case "167":
            return        "NET_ERR_SWUP_BURN_FAILED";    /* Burn operation failed  */
        case "200":
            return        "NET_GENERIC_ERR";    /* Generic Error */
        case "180":
            return        "NET_ERR_REMOTE_NON_SUPPORT";
        default :
            return        "UNKNOWN_ERROR";
    }
}

var _pixelst = 0;
var pxml;

function DownloadstatusBar() {

    _pixelst++;
    document.getElementById("statusDiv").style.width=_pixelst+"%";
	document.getElementById("lUpgrade").innerHTML = jQuery.i18n.prop("lDownload");
	
	if(_pixelst == 101)
	{
		clearInterval(timeStatusBar);	
		sm("PleaseWait", 150, 100);
		afterReboot();
		//afterRebootID =  setInterval("afterReboot()", 5000);
	}
}
function DownloadstatusBar_bk() {

    _pixelst++;
    document.getElementById("statusDiv").style.width=_pixelst+"%";
	document.getElementById("lUpgrade").innerHTML = jQuery.i18n.prop("lDownload");
	if(_pixelst == 13){
		upgradeRouterStart_bk();
	}
	if(_pixelst == 101)
	{
		clearInterval(timeStatusBar);	
		sm("PleaseWait", 150, 100);
		afterReboot();
		//afterRebootID =  setInterval("afterReboot()", 5000);
	}
}
function BurnstatusBar() {

	var xml = callProductXMLNoDuster("upgrade_firmware");
   	var pixels = $(xml).find("progress").text();
	var status = $(xml).find("upgrade_status").text();
	var upgrade_fail_cause = $(xml).find("upgrade_fail_cause").text();
    if(pixels>=100&&status == "1") {
        clearInterval(timeStatusBar);
		clearInterval(timeBurnStatusBar);
        BurnFileSuccess();
    }
	else
	{
		if(status == "1")
		{
			clearInterval(timeStatusBar);
		    clearInterval(timeBurnStatusBar);
			BurnFileSuccess();
		}
		else if(status == "3")
		{
			clearInterval(timeStatusBar);
		    clearInterval(timeBurnStatusBar);
			BurnFileFail();
		}
		else
		{	
		if (upgrade_fail_cause == "Socket Error!"){
				clearInterval(timeStatusBar);
		    	clearInterval(timeBurnStatusBar);
				//BurnFileFail();
				upgradeRouterStart();
				}else{
    		document.getElementById("statusDiv").style.width=pixels+"%";
			document.getElementById("lUpgrade").innerHTML = jQuery.i18n.prop("lBurnFirm")+ " " + pixels+"%";}
		}
	}
}
function burnStatus(xml) {
    clearInterval(afterRebootID);
    clearInterval(timeStatusBar);
    var status=1;
	var xml;
	xml = callProductXMLNoDuster("upgrade");
    if (xml != null) {
        $(xml).find("VersionUpgrade").each(function() {
            status = decodeURIComponent($(this).find("status").text());
        });

        if(status != 0) {
            hm();
            sm('upgradeModalBox3',319,170);
            document.getElementById("h1RouterUpgrade3").innerHTML = jQuery.i18n.prop("h1RouterUpgrade");
            document.getElementById("lUpgradeError").innerHTML = jQuery.i18n.prop("lUpgradeError");
            document.getElementById("lUpgradeError").innerHTML = document.getElementById("lUpgradeError").innerHTML + " " + jQuery.i18n.prop(getStatus(status));
            execCommand("upgrade","SWUP_DELETE");
            flagIsSuccess = false;
        }
    }
}

function setAsDefaultClick() {
    showAlert("still not implement");
}
function getfileName() {
    var filename;
    var pathandfile=document.getElementById("softVersionUpdateFile").value;
    var last=pathandfile.lastIndexOf("\\");
    if(last==-1)
        filename=pathandfile;
    else
        filename=pathandfile.substring(last+1,pathandfile.length);

    document.getElementById("textfield").value=filename;

}

function btnCancelSDUpgradeFailedPopup() {
	hm();
}

function btnCancelSDUpgradeSuccessPopup() {
	hm();
}

function btGetSWList() {
	var mapData = new Array();
	var itemIndex = 0;
	putMapElement(mapData, "RGW/upgrade/sd_upgrade/sd_firmware_check", "1", itemIndex++);

	function loaddata(data) {
                $("#SelUpgradeList").empty();
		$(data).find("sd_upgrade").each(function() {
	        $(this).find("sd_firmware_list").each(function() {
				$(this).find("Item").each(function(){
		            var name = $(this).find("firmware_name").text();
		            var version = $(this).find("firmware_version").text();
		            var date = $(this).find("firmware_date").text();
		            var size = $(this).find("firmware_size").text();

		            var opt = document.createElement("option");
		            document.getElementById("SelUpgradeList").options.add(opt);
		            opt.text = name;
		            opt.value = name;
				})
	         })
	    })
	}
    PostXMLWithResponse("upgrade_firmware",g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),loaddata);
}


function SubmitUpgrade() {
    var mapData = new Array();
    var itemIndex = 0;
    var upgradeName = $("#SelUpgradeList").val();

    putMapElement(mapData, "RGW/upgrade/sd_upgrade/sd_firmware_upgrade_name", upgradeName, itemIndex++);

    function refreshPage(data) {

		var upgrade_status = "4";
		$(data).find("sd_upgrade").each(function() {
			upgrade_status = $(this).find("sd_firmware_upgrade_status").text();
		})

		if(upgrade_status == "3")
		{
			//sm("SDUpgradeSuccessPopup", 350, 150);
			//document.getElementById("h1SDUpgradeSuccessPopup").innerHTML = jQuery.i18n.prop("h1SDUpgradePopup");
			showMsgBox(jQuery.i18n.prop("h1SDUpgradePopup"),jQuery.i18n.prop("lSDUpgradeSuccessText"));
		}
		else if(upgrade_status == "4")
		{
			//sm("SDUpgradeFailedPopup", 350, 150);
			//document.getElementById("h1SDUpgradeFailedPopup").innerHTML = jQuery.i18n.prop("h1SDUpgradePopup");
			showMsgBox(jQuery.i18n.prop("h1SDUpgradePopup"),jQuery.i18n.prop("lSDUpgradeFailedText"));
		}
        //afterRebootID =  setInterval("afterReboot()", 30000);
    }

    PostXMLWithResponse("upgrade_firmware",g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),refreshPage);
}

//wk-s
var timeBackupStatusBar;

function isPowerBankCanUpgrade() {
	var host = window.location.protocol + "//" + window.location.host + "/";
	url = host+'xml_action.cgi?Action=GetInfo&Id=Base';

	var content = $.ajax( {
	type: "GET",
	url: url,
	'beforeSend': function(xhr) {
                xhr.setRequestHeader("Authorization",getAuthHeader("GET"))
            },
	dataType: "xml",
	async: false
	}).responseXML;
	if($(content).find("BatteryLevel").text() == "0")
		return false;
	else
		return true;
}

function BackupFirmWare() {
	stopInterval();
	var url = "";
	var host = window.location.protocol + "//" + window.location.host + "/";
	url = host+'xml_action.cgi?Action=BackupFwStart';

	hm();
	sm('backupModalBox1',350,230);
	document.getElementById("h1BackupSystem1").innerHTML = jQuery.i18n.prop("h1BackupSystem");
	document.getElementById("lInbackup").innerHTML = jQuery.i18n.prop("lInbackup");
	document.getElementById("lBackupWarning").innerHTML = jQuery.i18n.prop("lBackupWarning");
	document.getElementById("lBackupWarningLine1").innerHTML = jQuery.i18n.prop("lBackupWarningLine1");
	document.getElementById("lBackupWarningLine2").innerHTML = jQuery.i18n.prop("lBackupWarningLine2");

	$.ajax( {
		type: "GET",
		url: url,
		'beforeSend': function(xhr) {
                xhr.setRequestHeader("Authorization",getAuthHeader("GET"))
            },
		dataType: "html",
		async:false,
		complete: function() {
            		WaitDownloadFW();
        	}
	});

	startInterval();

}

function BackupFirmWareSuccess()
{
	document.getElementById("statusBK").style.width="100%";
	document.getElementById("lInbackup").innerHTML = jQuery.i18n.prop("lInbackup")+" 100%";

	clearInterval(timeBackupStatusBar);
	hm('backupModalBox1');

	sm("BackupSuccessPopup", 360, 160);
	document.getElementById("lBackupMessage").innerHTML = jQuery.i18n.prop("lBackupSuccessText");
	document.getElementById("lConfirmBackUpContinue").innerHTML = jQuery.i18n.prop("lConfirmBackUpContinue");
	document.getElementById("btnModalDownload").value = jQuery.i18n.prop("btnModalDownload");
	document.getElementById("h1BackupSuccessPopup").innerHTML = jQuery.i18n.prop("h1BackupSystem");
}

function BackupFirmWareFail()
{
	clearInterval(timeBackupStatusBar);
	hm('backupModalBox1');
	showAlert(jQuery.i18n.prop("lBackupFailedText"));
}

function BackupstatusBar() {

	var xml = callProductXMLNoDuster("upgrade_firmware");
   	var pixels = $(xml).find("backup_progress").text();
	var status = $(xml).find("backup_status").text();

	if(status == "1")
	{
		clearInterval(timeBackupStatusBar);
		BackupFirmWareSuccess();
	}
	else if(status == "3")
	{
		clearInterval(timeBackupStatusBar);
		BackupFirmWareFail();
	}
	else
	{
		document.getElementById("statusBK").style.width=pixels+"%";
		document.getElementById("lInbackup").innerHTML = jQuery.i18n.prop("lInbackup")+ " " + pixels+"%";
	}
}

function WaitDownloadFW() {
	var status=1;
	var xml;

	xml= callProductXMLNoDuster("upgrade_firmware");
	if(xml != null)
	{
		status = $(xml).find("backup_status").text();
		if(status == "2" || status == "0")
		{
			timeBackupStatusBar = setInterval("BackupstatusBar()", 1000);
		}else if(status == "3")
			{
				clearInterval(timeBackupStatusBar);
				BackupFirmWareFail();
			}
	}
}

function DownloadWare() {
	hm();
	window.open('xml_action.cgi?Action=BackupFw',  '_blank');
	autoStartUpdate= setInterval("upgradeRouter_bk()", 7000);
	
}
//end


function parseEnter2br(str){
var reg=new RegExp("\r\n","g");
var reg2=new RegExp("\n","g");
var reg3=new RegExp("\r","g");
if (str != null){
str = str.replace(reg,"<br>");
str = str.replace(reg2,"<br>");
str = str.replace(reg3,"<br>");
}
return str;
}

function combinURL(){
var params,md5key,base64_value,md5value,cversion;
mSN = "";
mFullSwVersion = "";
mProject_name = "";
var ROUTER_UPGRADE_URL ="http://service.zmifi.com/ota/newversion";
var xml = callInfoBaseXML("Base");
$(xml).find("SysInfo").each(function() {
				mSN = $(this).find("SN").text();
				mChannel = $(this).find("Channel").text();
				cversion  = $(this).find("FullSwVersion").text();
				mFullSwVersion  = cversion.substring(0,cversion.indexOf("_"));				

});
var zhaed_ver =getHardware_Version();
	if(zhaed_ver == "Ver.B")
		mProject_name = "MF96-ROUTER-J";
	else if(zhaed_ver == "Ver.C")
		mProject_name = "MF96-ROUTER-TJC";
	else if(zhaed_ver == "Ver.D")
		mProject_name = "MF96-ROUTER-C2";
	else
		mProject_name = "MF96-ROUTER";
params = "channel="+mChannel+"&filterID="+mSN+"&projectname="+mProject_name+"&time="+mDate+"&version="+mFullSwVersion;
md5key = params + "&" + DEFAULT_TOKEN;
base64_value = Base64.encode(md5key);
md5value = hex_md5(base64_value);
var url=ROUTER_UPGRADE_URL + "?" + params +"&s="+md5value;
return url;
}



function postotaurl(otaurl){
var mapData = new Array();
    putMapElement(mapData, "RGW/CheckOTAstatus/miOTAurl", otaurl, 0);
    postXML("OTAstatus", g_objXML.getXMLDocToString(g_objXML.createXML(mapData )));
}

function isEmptyObject( obj ) { 
    for ( var name in obj ) { 
        return false; 
    } 
    return true; 
}
