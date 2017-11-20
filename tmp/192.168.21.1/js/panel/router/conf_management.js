(function($) {
    $.fn.objConfManage = function(InIt) {


        var xmlName = '';
        this.onLoad = function() {

            var index = 0;
            this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            buttonLocaliztion("btnRestoreFactorySettings");
            buttonLocaliztion("btnUpdate");
            buttonLocaliztion("btnBrowserFile");
            $("#lExportLink").text(jQuery.i18n.prop("lExportLink"));
            $("#lFileFormatError").text(jQuery.i18n.prop("lFileFormatError"));
			 $("#lFileupError").text(jQuery.i18n.prop("lFileupError"));
            $("#btnSaveAcatDumplogSettings").val(jQuery.i18n.prop("lbtnSaveAcatDumpLogSetting"));
            document.getElementById("lSaveAcatDumplogIntoSDText").innerHTML = jQuery.i18n.prop("lSaveAcatDumplogIntoSDText");

            var _xmlname = "admin";
            xml = getData(_xmlname);
            var AcatDumpSDFlag = 0;
            var AcatDumpSDSupportFlag = 0;
            $(xml).find("log_management").each(function() {
                AcatDumpSDFlag = $(this).find("acatlog_sd").text();
                AcatDumpSDSupportFlag = $(this).find("acatlog_sd_support").text();
                SDFormatSupport = $(this).find("sd_support_format").text();
                if(0 == SDFormatSupport) {
                    $("#txtSdFormatStatus").text(jQuery.i18n.prop("lSdSupportFormat0"));
                    $("#saveacatlogchk").prop("disabled",false);
                } else if(1 == SDFormatSupport) {
                    $("#txtSdFormatStatus").text(jQuery.i18n.prop("lSdSupportFormat1"));
                    $("#saveacatlogchk").prop("disabled",true);
                } else if(2 == SDFormatSupport) {
                    $("#txtSdFormatStatus").text(jQuery.i18n.prop("lSdSupportFormat2"));
                    $("#saveacatlogchk").prop("disabled",true);
                }
		else if(255 == SDFormatSupport) {
                    $("#txtSdFormatStatus").text(jQuery.i18n.prop("lSdSupportFormat255"));
                    $("#saveacatlogchk").prop("disabled",true);
                }
            });
            if ("1" == AcatDumpSDFlag)
                document.getElementById("saveacatlogchk").checked = true;
            else
                document.getElementById("saveacatlogchk").checked = false;

            if ("1" == AcatDumpSDSupportFlag)
                document.getElementById("ACATSDlog_Setting_div").style.display = "none";
            else
                document.getElementById("ACATSDlog_Setting_div").style.display = "none";

        }

        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/router/conf_management.html");

            $('#uploadConfigFileForm').ajaxForm({
            success: function() {
                    //hm();
                },
            error: function() {
                    //hm();
                }
            });
        }
        return this.each(function() {
        });
    }

})(jQuery);
var factoryRebootTimerID;
var smValueClicked = 0; // 0 = nothing clicked , 1 = OK clicked, 2 = cancle clicked
function saveConfiguration() {
    var url;
    var Data;
    var host = window.location.protocol + "//" + window.location.host;
    url = host + getHeader("GET", "config_save");
    //document.getElementById("getFileForm").action = url;
    $.download(url, 'filename=config_save&format=xml&content=' + Data, "POST", saveConfigurationSuccess);
}
function saveConfigurationSuccess() {
    // alert("saveConfigurationSuccess success");
}
function restoreConfiguration() {
    if (document.getElementById("fileConfFile").value != "") {

        if (document.getElementById("fileConfFile").value.toString().lastIndexOf(".xml") == -1) {
            showAlert(jQuery.i18n.prop("XMLExtError"));

        } else {
            stopInterval();
            startInterval();
            sm('MBConfirm', 350, 170);
            localizeConfirmtMB();
        }
    } else

        showAlert(jQuery.i18n.prop("errorSelectConfFile"));



}
function RestoreFactoryConfiguration() {

    sm('MBConfirmFactory', 360, 120);
    localizeConfirmtMB1();
}
function afterRebootConf() {
    hm();
    clearInterval(afterRebootID);
    clearAuthheader();
}


function confManagementConfirmed() {

    submitConf();
    document.getElementById("btnSubmit").click();
    hm();
    sm("MBRebooting", 350, 150);
}
function factoryRebootTimer() {
    clearInterval(factoryRebootTimerID);
    hm();
    clearAuthheader();
}
function localizeRebootMB() {
    document.getElementById("h1Rebooting").innerHTML = jQuery.i18n.prop("h1Rebooting");
    document.getElementById("lRebootingText").innerHTML = jQuery.i18n.prop("lRebootingText");
    document.getElementById("lRebootingText1").innerHTML = jQuery.i18n.prop("lRebootingText1");
    document.getElementById("btnModalOk").innerHTML = jQuery.i18n.prop("btnModalOk");
}
function localizeConfirmtMB() {
    document.getElementById("h1Confirm").innerHTML = jQuery.i18n.prop("h1Confirm");
    document.getElementById("lConfirmText").innerHTML = jQuery.i18n.prop("lConfirmText");
    document.getElementById("btnModalOk1").innerHTML = jQuery.i18n.prop("btnModalOk");
    document.getElementById("btnModalCancle").innerHTML = jQuery.i18n.prop("btnModalCancle");
}
function localizeConfirmtMB1() {
    document.getElementById("h1Confirm").innerHTML = jQuery.i18n.prop("h1Confirm");
    document.getElementById("lConfirmText1").innerHTML = jQuery.i18n.prop("lConfirmText1");
    document.getElementById("btnModalOk").innerHTML = jQuery.i18n.prop("btnModalOk");
    document.getElementById("btnModalCancle").innerHTML = jQuery.i18n.prop("btnModalCancle");
}
function getFileSuccess() {

}


function submitConf() {
    stopInterval();
    var url;
    var host = window.location.protocol + "//" + window.location.host;
    url = host + getHeader("POST", "config_save");

    sm("PleaseWait", 150, 100);
    $("#lPleaseWait").text(jQuery.i18n.prop("h1PleaseWait"));
    document.getElementById("uploadConfigFileForm").action = url;

    startInterval();
}
function confFactoryConfirmed() {
    hm();
    sm("PleaseWait", 150, 100);
    $("#lPleaseWait").text(jQuery.i18n.prop("h1PleaseWait"));
    callProductXML("restore_defaults");
    hm();
    sm("MBRebooting", 350, 150);
    localizeRebootMB();
    afterRebootID = setInterval("afterRebootConf()", 45000);
}

function onChangeCfgFile(filePath) {
    var strCfgFileName = $("#updateCfgFile").val();
    if (strCfgFileName.indexOf(".bin") != strCfgFileName.length - 4) {
        $("#lFileFormatError").show();
    } else {
        $("#lFileFormatError").hide();
    }


    $("#txtCfgFileName").val(strCfgFileName);

}


function UpdateCfgFile() {
    var strCfgFileName = $("#updateCfgFile").val();
    if (strCfgFileName.indexOf(".bin") != strCfgFileName.length - 4) {
        return;
    }

    sm("PleaseWait", 150, 100);
    $("#lPleaseWait").text(jQuery.i18n.prop("h1PleaseWait"));

    var host = window.location.protocol + "//" + window.location.host;
    var url = host + getHeader("GET", "config_backup");
   // document.getElementById("uploadFileForm").action = url;
   // document.getElementById("btnSubmitCnfFile").click();


        var options = {
            type: 'post',
            dataType: "xml",
            url: url,
            success: function( rsp ) {
                if ( rsp ) {
				var xml = rsp;
               
               var PSM_CHECK = $(xml).find("PSM_CHECK").text();
		
				if (PSM_CHECK == "WRONG"){
							hm();
							//$("#mbox").hide();
					        $("#lFileupError").show();

					}else{
					    hm();
					    //sm("MBRebooting", 350, 150);
					    //localizeRebootMB();
					    afterRebootID = setInterval("afterRebootConf()", 45000);
	}
               } 
            },
            error: function() {
						hm();
					    
					    afterRebootID = setInterval("afterRebootConf()", 45000);
			}

        };
 		$( '#uploadFileForm' ).ajaxUpload( options );
		sm("MBRebooting", 350, 150);
		localizeRebootMB();
	

}
function SaveAcatDumplogSetting() {
    var itemIndex=0;
    mapData=null;
    mapData = new Array();
    if(document.getElementById("saveacatlogchk").checked)
        putMapElement_test("RGW/log_management/acatlog_sd", 1, itemIndex++);
    else
        putMapElement_test("RGW/log_management/acatlog_sd", 0, itemIndex++);

    postXML("admin", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
}

(function( $ ){
    $.fn.ajaxUpload = function(options){

        var that = this,
            uploadbyiframe = function( options ){
                var d = new Date().getTime(),
                    iframeName = 'iframeUpload' + d,
                    iframeContents,
                    iframe = $('<iframe name="'+iframeName+'" id="'+iframeName+'" style="display: none" />');
                $("body").append(iframe);

                var form = $(that);
                form.attr("action", options.url);
                form.attr("method", "post");
                form.attr("enctype", "multipart/form-data");
                form.attr("encoding", "multipart/form-data");
                form.attr("target", iframeName);
                form.submit();

                $(document.getElementById(iframeName))
                    .load(function () {
                        iframeContents = document.getElementById(iframeName).contentWindow.document.body.innerHTML;
                        var rsp = iframeContents.match(/^\{.*?\}/);
                        if ( rsp ) {
                            rsp = rsp[0];
                            options.success(rsp);
                        } else {
                            options.error();
                        }
                    })
                    .error(function(){
                        options.error();
                    });
                return false;

            },
            uploadbyajax = function( options ) {
                var form = $(that);
                var formData = new FormData( form[0] );
                var progressBar = form.find( '.progress' );
                var progressBarVal = form.find( '.progress .value' );

                var xhr = new XMLHttpRequest();
                xhr.open('POST', options.url, true);
                xhr.onload = function(e) {
                    var rsp = e.target.responseText;
                    options.success(rsp);
                };
                xhr.onerror = function(e) {
                    options.error();
                };
                xhr.upload.onprogress = function ( e ) {
                   
                    if (e.lengthComputable) {
                        progressBar.show();
                        progressBarVal.css({
                            width: ( (e.loaded / e.total) * 100 ) + '%'
                        });
                    }
                }
                xhr.send(formData);  // multipart/form-data

            };

        if ( window.FormData ) {
            uploadbyajax( options );
        } else {
            uploadbyiframe( options );
        }
    };
})(jQuery);
