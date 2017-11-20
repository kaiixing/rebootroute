var devEnv=0;
var content2=null;
/* This function sends xmldata as a string to thr server by
 * using ajax post call.
 * parameters are XML Name and xml Data as as string.
 * on success it returns the respoce XML which is call posted
 */

function postXML(xmlName,xmlData,timeOutInterval) {
//document.getElementById("loadingdivimage").style.display = "block";
    if(timeOutInterval==undefined)
        timeOutInterval = 360000;
    if(xmlName != "locale" && xmlName != "OTAstatus") {
        sm("PleaseWait",150,100);
        $("#lPleaseWait").text(jQuery.i18n.prop("h1PleaseWait"));
    }
    resetInterval();
    var url = "";
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+'xml_action.cgi?method=set&module=duster&file='+xmlName;
    if(devEnv=="1")
        alert(xmlData);
    $.ajax( {
    type: "POST",
    'beforeSend': function(xhr) {
            xhr.setRequestHeader("Authorization",getAuthHeader("POST"))
        },
    url: url,
    processData: false,
    data: xmlData,
    async: true,
    dataType: "xml",
    timeout: timeOutInterval,
    success:function(data, textStatus) {
    if($(data).find("login_status").text() == "KICKOFF") {
        AuthKickoff();

    }else if($(data).find("login_status").text() == "TIMEOUT"){
	    AuthTimeout();

	}else if($(data).find("login_status").text() == "UNAUTHORIZED"){
		AuthUnAuth();

	}
        },
    complete: function(XMLHttpRequest, textStatus) {
            if(xmlName != "locale") {
                hm();
            }
            if(xmlName == 'wizard')
                g_QuickSetup.onPostSuccess();
            else {
                g_objContent.onPostSuccess();
            }
        },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(xmlName != "locale") {
                hm();
            }
            // alert("In Error:" + textStatus);
            if(textStatus!="timeout")
                showAlert(jQuery.i18n.prop('lErrorPost'));
            else
                showAlert(jQuery.i18n.prop('lErrorTimeOut'));
        }
    });

    return true;
}

function postAPNXML(xmlName,xmlData,timeOutInterval) {
//document.getElementById("loadingdivimage").style.display = "block";
    if(timeOutInterval==undefined)
        timeOutInterval = 360000;
    
    resetInterval();
    var url = "";
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+'xml_action.cgi?method=set&module=duster&file='+xmlName;
    if(devEnv=="1")
        alert(xmlData);
    $.ajax( {
    type: "POST",
    'beforeSend': function(xhr) {
            xhr.setRequestHeader("Authorization",getAuthHeader("POST"))
        },
    url: url,
    processData: false,
    data: xmlData,
    async: true,
    dataType: "xml",
    timeout: timeOutInterval,
    success:function(data, textStatus) {
    if($(data).find("login_status").text() == "KICKOFF") {
        AuthKickoff();

    }else if($(data).find("login_status").text() == "TIMEOUT"){
	    AuthTimeout();

	}else if($(data).find("login_status").text() == "UNAUTHORIZED"){
		AuthUnAuth();

	}else{
		var apnid_selected_data = $(data).find("apnid_selected_data").text();
		var array_tmp = apnid_selected_data.split('%');
		$("#txtAPNname").val(array_tmp[1]);
		if(array_tmp[2] == "3"){
			$("#lErrorLogs").hide();
			$("#Sel2G3GAuthType").append("<option value=\"PAP_OR_CHAP\">PAP_OR_CHAP</option>");
			$("#Sel2G3GAuthType").val("PAP_OR_CHAP");
			//$("#divIpType").hide();
			$("#div2G3GAuthEnabled").show();
			$("#edit_apn_list").show();
			$("#txt2G3GUser").val(array_tmp[3]);
			$("#txt2G3GPassword").val(array_tmp[4]);
		}else if(array_tmp[2] == "0"){
			$("#lErrorLogs").hide();
			$("#Sel2G3GAuthType").val("NONE");
			//$("#divIpType").hide();
			$("#div2G3GAuthEnabled").hide();
			$("#edit_apn_list").show();
			$("#Sel2G3GAuthTypeNONE").show();
		}else if(array_tmp[2] == "1"){
			$("#lErrorLogs").hide();
			$("#Sel2G3GAuthType").val("PAP");
			$("#div2G3GAuthEnabled").show();
			$("#edit_apn_list").show();
			//$("#divIpType").hide();
			$("#txt2G3GUser").val(array_tmp[3]);
			$("#txt2G3GPassword").val(array_tmp[4]);
			$("#Sel2G3GAuthTypeNONE").hide();
		}else if(array_tmp[2] == "2"){
			$("#lErrorLogs").hide();
			$("#Sel2G3GAuthType").val("CHAP");
			$("#div2G3GAuthEnabled").show();
			$("#edit_apn_list").show();
			//$("#divIpType").hide();
			$("#txt2G3GUser").val(array_tmp[3]);
			$("#txt2G3GPassword").val(array_tmp[4]);
			$("#Sel2G3GAuthTypeNONE").hide();
		}
		

	}
        },
    
    error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(xmlName != "locale") {
                hm();
            }
            // alert("In Error:" + textStatus);
            if(textStatus!="timeout")
                showAlert(jQuery.i18n.prop('lErrorPost'));
            else
                showAlert(jQuery.i18n.prop('lErrorTimeOut'));
        }
    });

    return true;
}
function postXMLEx(xmlName, xmlData, timeOutInterval, queryFun) {
    if (timeOutInterval == undefined)
        timeOutInterval = 360000;

    sm("PleaseWait", 150, 100);
    $("#lPleaseWait").text(jQuery.i18n.prop("h1PleaseWait"));

    resetInterval();
    var url = "";
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host + 'xml_action.cgi?method=set&module=duster&file=' + xmlName;

    $.ajax( {
    type: "POST",
    'beforeSend': function(xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("POST"))
        },
    url: url,
    processData: false,
    data: xmlData,
    async: true,
    dataType: "xml",
    timeout: timeOutInterval,
    success:function(data, textStatus) {
    if($(data).find("login_status").text() == "KICKOFF") {
        AuthKickoff();

    }else if($(data).find("login_status").text() == "TIMEOUT"){
	    AuthTimeout();

	}else if($(data).find("login_status").text() == "UNAUTHORIZED"){
		AuthUnAuth();

	}
        },
    complete: function(XMLHttpRequest, textStatus) {
            hm();
            setTimeout(queryFun, 5000);
        },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
            hm();
            bIsScanNetwork = false;
            if (textStatus != "timeout")
                showAlert(jQuery.i18n.prop('lScanNetworkError'));
            else
                showAlert(jQuery.i18n.prop('lScanNetworkTimeOut'));
        }
    });

    return true;
}

function postXMLTimeset(xmlName, xmlData, timeOutInterval, queryFun) {
    if (timeOutInterval == undefined)
        timeOutInterval = 360000;

    sm("PleaseWait", 150, 100);
    $("#lPleaseWait").text(jQuery.i18n.prop("h1PleaseWait"));

    resetInterval();
    var url = "";
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host + 'xml_action.cgi?method=set&module=duster&file=' + xmlName;

    $.ajax( {
    type: "POST",
    'beforeSend': function(xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("POST"))
        },
    url: url,
    processData: false,
    data: xmlData,
    async: true,
    dataType: "xml",
    timeout: timeOutInterval,
    complete: function(XMLHttpRequest, textStatus) {
            hm();
            setTimeout(queryFun, 500);
        },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
            hm();
            if (textStatus != "timeout")
                showAlert(jQuery.i18n.prop('pFailedcompleteupdateTime'));
            else
                showAlert(jQuery.i18n.prop('pUpdateTimeOut'));
        }
    });
    return true;
}



function postXMLlocale(xmlName,xmlData,timeOutInterval) {
//document.getElementById("loadingdivimage").style.display = "block";
    if(timeOutInterval==undefined)
        timeOutInterval = 180000;
    resetInterval();
    var url = "";
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+'xml_action.cgi?method=set&module=duster&file='+xmlName;
    if(devEnv=="1")
        alert(xmlData);
    $.ajax( {
    type: "POST",
    'beforeSend': function(xhr) {
            xhr.setRequestHeader("Authorization",getAuthHeader("POST"))
        },
    url: url,
    processData: false,
    data: xmlData,
    async: true,
    dataType: "xml",
    timeout: timeOutInterval,
    success:function(data, textStatus) {
    if($(data).find("login_status").text() == "KICKOFF") {
        AuthKickoff();

    }else if($(data).find("login_status").text() == "TIMEOUT"){
	    AuthTimeout();

	}else if($(data).find("login_status").text() == "UNAUTHORIZED"){
		AuthUnAuth();

	}
        },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(textStatus!="timeout")
                alert(jQuery.i18n.prop('lErrorPost'));
            else
                alert(jQuery.i18n.prop('lErrorTimeOut'));
        }
    });

    return true;
}

function postLogout() {
    var url = "";
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+'xml_action.cgi?Action=logout';
    $.ajax( {
    type: "GET",
    url: url,
    dataType: "html",
    async:false,
    complete: function() {
            clearAuthheader();
        }
    });

    return true;
}
/* This function  returns HTML contect as a text to caller
 * Parameter is htmlpath path where the HTML file is Located
 * Returns RespoceText
 */
function callProductHTML(htmlName) {
    //setTimeout ( "calculateAuthheader()", 6);
    resetInterval();
    var content=null;

	var flag_success=0;
    if(username == "admin") {
        content = $.ajax( {
        type: "GET",
		success:function(data, textStatus) {
				flag_success = 0;
				content2=data;
				},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
				flag_success = 1;
            	},
        url: htmlName,
        dataType: "html",
        timeout: 30000,
        async:false
        }).responseText;
    } else {
        content = $.ajax( {
        type: "GET",
        'beforeSend': function(xhr) {
                xhr.setRequestHeader("Authorization",getAuthHeader("GET"))
            },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
                if(null != g_objContent) {
                    g_objContent.onLoad(true);
                }
            },
        url: htmlName,
        dataType: "html",
        timeout: 30000,
        async:false
        }).responseText;
    }

    if(content.indexOf("E7683FTEFTA8HT08HFH09") > 0) {
        clearAuthheader();
        return null;
    } else if(!flag_success)
  		 return content;
  	  else if(g_objContent) {
           g_objContent.onLoad(true);
			return content2;
        } 
}


function GetNetworkScanRetXml() {
    resetInterval();
    url = window.location.protocol + "//" + window.location.host + "/xml_action.cgi?method=get&module=duster&file=wan";
    var content =  $.ajax( {
    type: "GET",
    'beforeSend': function(xhr) {
            xhr.setRequestHeader("Authorization",getAuthHeader("GET"))
        },
    url: url,
    dataType: "xml",
    error:function() {
            if(bIsScanNetwork) {
                setTimeout(QueryScanResult, 15000);
            }
        },
    async:false
    }).responseXML;


    if($(content).find("login_status").text() == "KICKOFF") {
        AuthKickoff();
        return null;
    }else if($(content).find("login_status").text() == "TIMEOUT"){
	    AuthTimeout();
		return null;
	}else if($(content).find("login_status").text() == "UNAUTHORIZED"){
		AuthUnAuth();
	    return null;
	}

    return content;
}


/* This function get the XML from the server via ajax.
 *  Get is Method and return type is responceXML
 *
 */

function callProductXML(xmlName) {
    if(xmlName!="device_date")
        resetInterval();
    var url = "";
    var content;
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+'xml_action.cgi?method=get&module=duster&file='+xmlName;
    // alert(url);
    if(devEnv=="0") {
        content = $.ajax( {
        type: "GET",
        'beforeSend': function(xhr) {
                xhr.setRequestHeader("Authorization",getAuthHeader("GET"))
            },
        url: url,
        dataType: "xml",
        async:false
        }).responseXML;
    } else {
        xmlName="xml/"+xmlName+".xml";
        content = $.ajax( {
        type: "GET",
        url: xmlName,
        dataType: "xml",
        contentType: "text/xml;charset=UTF-8",
        async:false
        }).responseXML;
    }
    var login_text  = $(content).find("login_status").text();
    if(login_text == "KICKOFF") {
        AuthKickoff();
        return content;
    }else if(login_text == "TIMEOUT"){
	    AuthTimeout();
		return content;
	}else if(login_text == "UNAUTHORIZED"){
		AuthUnAuth();
	    return content;
	}
    return content;
}

function callInfoBaseXML(xmlName) {
    if(xmlName!="device_date")
        resetInterval();
    var url = "";
    var content;
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+'xml_action.cgi?Action=GetInfo&Id='+xmlName;
	$.ajaxSetup({ cache: false }); 
    if(devEnv=="0") {
		content = $.ajax( {
        type: "GET",
        url: url,
        dataType: "xml",
        async:false
        }).responseXML;
    } else {
    	xmlName="xml/"+xmlName+".xml";
        content = $.ajax( {
        type: "GET",
        url: xmlName,
        dataType: "xml",
        contentType: "text/xml;charset=UTF-8",
        async:false
        }).responseXML;
    }
    var login_text  = $(content).find("login_status").text();
    if(login_text == "KICKOFF") {
        AuthKickoff();
        return content;
    }else if(login_text == "TIMEOUT"){
	    AuthTimeout();
		return content;
	}else if(login_text == "UNAUTHORIZED"){
		AuthUnAuth();
	    return content;
	}
    return content;
}

function PostXMLWithResponse(xmlName, xmlData,callbackFun) {
    sm("PleaseWait", 150, 100);
    $("#lPleaseWait").text(jQuery.i18n.prop("h1PleaseWait"));
    resetInterval();

    var host = window.location.protocol + "//" + window.location.host + "/";
    var url = host + 'xml_action.cgi?method=set&module=duster&file=' + xmlName;
    $.ajax( {
    type: "POST",
    'beforeSend': function(xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("POST"))
        },
    url: url,
        timeout: 360000,
    dataType: "xml",
    data: xmlData,
    async: true,
    success:function(data, textStatus) {
    if($(data).find("login_status").text() == "KICKOFF") {
        AuthKickoff();

    }else if($(data).find("login_status").text() == "TIMEOUT"){
	    AuthTimeout();

	}else if($(data).find("login_status").text() == "UNAUTHORIZED"){
		AuthUnAuth();

	}
            hm();
            if(null != callbackFun) {
                callbackFun(data);
            }
        },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(textStatus!="timeout")
                showAlert(jQuery.i18n.prop('lErrorPost'));
            else
                showAlert(jQuery.i18n.prop('lErrorTimeOut'));
        }
    });

}

function GetSmsXML(xmlName) {
    var host = window.location.protocol + "//" + window.location.host + "/";
    var url = host + 'xml_action.cgi?method=get&module=duster&file=' + xmlName;
    resetInterval();

    var content = $.ajax( {
    type: "GET",
    'beforeSend': function(xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"))
        },
    url: url,
    dataType: "xml",
    timeout: 60000,
    async: false
    }).responseXML;

    if($(content).find("login_status").text() == "KICKOFF") {
        AuthKickoff();
        return null;
    }else if($(content).find("login_status").text() == "TIMEOUT"){
	    AuthTimeout();
		return null;
	}else if($(content).find("login_status").text() == "UNAUTHORIZED"){
		AuthUnAuth();
	    return null;
	}
    return content;
}


/* This method sets localization. It loads the Prpoerties file.
 * parameter are locale which is name of properties file
 * i.e. Message_en.properties is englist dict then parameter is en
 */
function setLocalization(locale) {

    if(locale != "en" && locale != "hk" && locale != "jp"){
		locale = "cn"
			
		}

    try {
        jQuery.i18n.properties( {
        name:'Messages',
        path:'properties/',
        mode:'map',
        language:locale,
        callback: function() {
            }
        });
    } catch(err) {
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", 'js/jquery/jquery.i18n.properties-1.0.4.js');
        document.getElementsByTagName("head")[0].appendChild(fileref);
        setLocalization(locale);
    }
}
/*
 * API used for url authentication digest checking.. it send url to server and
 * give responce to caller
 */
function authentication(url) {
    if(devEnv=='1') {
        return "200 OK";
    }
    var content = $.ajax( {
    url: url,
    dataType: "text/html",
    async:false,
    cache:false,
    beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization",getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control","no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        }
    }).responseText;
    return content;
}
function getAuthType(url) {
    if(devEnv=='1') {
        return 'Digest realm="Highwmg", nonce="718337c309eacc5dc1d2558936225417", qop="auth" Content-Type: text/html Server: Lighttpd/1.4.19 Content-Length: 0 Date: Tue, 11 Oct 2005 10:44:32 GMT ';
    }
    var content = $.ajax( {
    url: url,
    type: "GET",
    dataType: "text/html",
    async:false,
    cache:false,
    beforeSend: function(xhr) {
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control","no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        }
    }).getResponseHeader('WWW-Authenticate');
    return content;
}

function getVersionXML(xmlName) {
    var url = "";
    var content;
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+xmlName;
    if(devEnv=='1') {
        xmlName="xml/"+xmlName;

        content = $.ajax( {
        url: xmlName,
        dataType: "text/html",
        async:false
        }).responseText;
    } else {
        content = $.ajax( {
        url: url,
        dataType: "text/html",
        async:false
        }).responseText;
    }
    return content;
}

function callProductXMLNoDuster(xmlName) {
    resetInterval();
    var url = "";
    var content;
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+'xml_action.cgi?method=get&file='+xmlName;
    //  alert(url);
    if(devEnv=="0") {
        content = $.ajax( {
        type: "GET",
        'beforeSend': function(xhr) {
                xhr.setRequestHeader("Authorization",getAuthHeader("GET"))
            },
        url: url,
        dataType: "xml",
        async:false
        }).responseXML;
    } else {
        xmlName="xml/"+xmlName+".xml";
        content = $.ajax( {
        type: "GET",
        'beforeSend': function(xhr) {
                xhr.setRequestHeader("Authorization",getAuthHeader("GET"))
            },
        url: xmlName,
        dataType: "xml",
        async:false
        }).responseXML;

    }
    return content;
}
function execCommand(file,command,sFunction) {
    resetInterval();
    var url = "";
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+'xml_action.cgi?method=get&file='+file+"&command="+command;
    if(devEnv=="1")
        return url;
    else {
        content = $.ajax( {
        type: "GET",
        'beforeSend': function(xhr) {
                xhr.setRequestHeader("Authorization",getAuthHeader("GET"))
            },
        url: url,
        dataType: "xml",
//            async:false,
        success: sFunction
        }).responseXML;
        return content;
    }
}



function PostSyncXML(xmlName, xmlData) {
    var host = window.location.protocol + "//" + window.location.host + "/";
    var url = host + 'xml_action.cgi?method=set&module=duster&file=' + xmlName;
    resetInterval();
    $.ajax( {
    type: "POST",
    'beforeSend': function(xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("POST"))
        },
    complete: function(XMLHttpRequest, textStatus) {
            hm();
        },
    url: url,
    dataType: "xml",
    timeout: 60000,
    data: xmlData,
    async: false
    });
}

function AuthTimeout(){
showAlertAuth(jQuery.i18n.prop('lAuthTimeout'));
}

function AuthKickoff(){
showAlertAuth(jQuery.i18n.prop('lAuthKickoff'));
}

function AuthUnAuth(){
showAlertAuth(jQuery.i18n.prop('lAuthUnAuth'));
}

