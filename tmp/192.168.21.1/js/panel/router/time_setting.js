var _arrayMessage = new Array(0);
var bIsupdatingTime = false;
var tryQueryUpdateResultCount = 0;
var g_bNtpEnabled;
(function($) {

    $.fn.objTimeSetting = function(InIt) {
        var xmlName = '';

        this.onLoad = function(flag) {
            var index = 0;
	if(flag){
            this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            lableLocaliztion(document.getElementsByTagName("span"));
            /* buttonLocaliztion(document.getElementById("btUpdate_time").id);
            $("#SyncupwithNtpTimeTip").text(jQuery.i18n.prop("SyncupwithNtpTimeTip"));
            $("#UpdateTimeWaiting").text(jQuery.i18n.prop("pwaitUpdatetime"));
            buttonLocaliztion("btUpdateNTPtime");*/
            buttonLocaliztion("btSaveDateTime");

            $("[id^='tbrouter']").focus(function() { $("#lTimeErrorLogs").hide(); });

            $("[id^='lselTZGMT']").each(function() {
                $(this).text(jQuery.i18n.prop($(this).attr("id")));
            });
	}
            var xml = getData(xmlName);

            $(xml).find("time_setting").each(function() {
                document.getElementById("tbrouter_year").value = $(this).find("year").text();
                document.getElementById("tbrouter_month").value = $(this).find("month").text();
                document.getElementById("tbrouter_day").value = $(this).find("day").text();
                document.getElementById("tbrouter_hour").value = $(this).find("hour").text();
                document.getElementById("tbrouter_minute").value = $(this).find("minute").text();
                document.getElementById("tbrouter_second").value = $(this).find("second").text();

                if ("enable" == $(this).find("ntp_status").text()) {
                    $("#NtpEnabledStatus").prop("checked", true);
					$("#tbrouter_year").prop("disabled",true);
					$("#tbrouter_month").prop("disabled",true);
					$("#tbrouter_day").prop("disabled",true);
					$("#tbrouter_hour").prop("disabled",true);
					$("#tbrouter_minute").prop("disabled",true);
					$("#tbrouter_second").prop("disabled",true);
                    g_bNtpEnabled = true;
                }
                else {
                    $("#NtpDisabledStatus").prop("checked", true);
					$("#tbrouter_year").prop("disabled",false);
					$("#tbrouter_month").prop("disabled",false);
					$("#tbrouter_day").prop("disabled",false);
					$("#tbrouter_hour").prop("disabled",false);
					$("#tbrouter_minute").prop("disabled",false);
					$("#tbrouter_second").prop("disabled",false);
                    g_bNtpEnabled = false;
                }

            });

            /* $(xml).find("ntp_setting").each(function() {
            router_ntpserverIP = $(this).find("ntp_server").text();
            router_ntptimezone = $(this).find("ntp_timezone").text();
            router_getntptimestart = $(this).find("get_ntptime_start").text();
            UpdatingTimeflag = $(this).find("ntp_sync_flag").text();
            document.getElementById("ipNTPControl_text").value = router_ntpserverIP;
            document.getElementById("SelTimezonedropdown").value = router_ntptimezone;
            $("#SelTimezonedropdown").val(router_ntptimezone);
            if (1 == router_getntptimestart) {
            document.getElementById("SyncupwithNtpTimeChk").checked = true;
            }
            else {
            document.getElementById("SyncupwithNtpTimeChk").checked = false;
            }
            //1: successful  2: failed 3: syncing 0: init
            if (bIsupdatingTime) {

                    if (1 == UpdatingTimeflag) {
            bIsupdatingTime = false;
            confirm(jQuery.i18n.prop("pSuccesscompleteupdateTime"));
            }
            else if (2 == UpdatingTimeflag) {
            bIsupdatingTime = false;
            confirm(jQuery.i18n.prop("pFailedcompleteupdateTime"));
            }
            }
            else {
            if (0 == UpdatingTimeflag)
            bIsupdatingTime = false;

            }

            });

            if (bIsupdatingTime) {
            $("#UpdateTimeWaiting").show();
            $("#UpdateTimeWaiting").show();
            $("#tbrouter_year").attr("disabled", true);
            $("#tbrouter_month").attr("disabled", true);
            $("#tbrouter_day").attr("disabled", true);
            $("#tbrouter_hour").attr("disabled", true);
            $("#tbrouter_minute").attr("disabled", true);
            $("#tbrouter_second").attr("disabled", true);
            $("#SelTimezonedropdown").attr("disabled", true);
            $("#btUpdateNTPtime").attr("disabled", true);
            $("#btSaveDateTime").attr("disabled", true);
            $("#btUpdateNTPtime").parent(".btnWrp:first").addClass("disabledBtn");
            $("#btSaveDateTime").parent(".btnWrp:first").addClass("disabledBtn");
            }*/


        }

        this.onPostSuccess = function() {
            this.onLoad();
        }
        this.putMapElement = function(xpath, value, index) {
            mapData[index] = new Array(2);
            mapData[index][0] = xpath;
            mapData[index][1] = value;
        }
        this.postItem = function(ntpServer, ntptimezone) {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();

            this.putMapElement("RGW/ntp_setting/ntp_server", ntpServer, itemIndex++);
            this.putMapElement("RGW/ntp_setting/ntp_timezone", ntptimezone, itemIndex++);

            if (document.getElementById("SyncupwithNtpTimeChk").checked) {
                this.putMapElement("RGW/ntp_setting/get_ntptime_start", 1, itemIndex++);
            }
            else {
                this.putMapElement("RGW/ntp_setting/get_ntptime_start", 0, itemIndex++);
            }
            this.putMapElement("RGW/ntp_setting/get_ntptime", 0, itemIndex++);

            if (mapData.length > 0) {
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            }
        }

        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/router/time_setting.html");
        }

        return this.each(function() {
		_timeSettingsIntervalID = setInterval("g_objContent.onLoad(false)", _timeSettingsInterval);
        });
    }
})(jQuery);

/*function btnTimeSetting(){

					var ntpServer =  document.getElementById("ipNTPControl_text").value;
					var ntptimezone = document.getElementById("SelTimezonedropdown").value;
				    var errorString = ntpserver_validate(ntpServer);


				    if(errorString=="OK"){
			    		hm();
			    		g_objContent.postItem(ntpServer,ntptimezone);
    				}
				    else
				    {
				        document.getElementById("lTimeErrorLogs").style.display = "block";
				       document.getElementById("lTimeErrorLogs").innerHTML = errorString;
				    }
 }*/

function StringMaxLength(string,value) {
					    if(string.length > value)
					        return false;
					    else
					        return true;
}
function is_leapyear(year)
{
   if((year%400==0) || (year%100!=0) && (year%4==0))
   	return true;
   else
   	return false;

}

function btnSaveDateandTime() {
	$("#lTimeErrorLogs").hide();
      var itemIndex=0;
       mapData=null;
       mapData = new Array();
	    var year =  document.getElementById("tbrouter_year").value;
	    var month =  document.getElementById("tbrouter_month").value;
		var day =  document.getElementById("tbrouter_day").value;
		var hour =  document.getElementById("tbrouter_hour").value;
		var minute =  document.getElementById("tbrouter_minute").value;
		var second =  document.getElementById("tbrouter_second").value;
	    var errorString = time_validate(year,month,day,hour,minute,second);

		if(errorString !="OK")
		{
			   document.getElementById("lTimeErrorLogs").style.display = "block";
			   document.getElementById("lTimeErrorLogs").innerHTML = errorString;
			 return;
		}


          putMapElement_test("RGW/time_setting/year", year, itemIndex++);
          putMapElement_test("RGW/time_setting/month", month, itemIndex++);
          putMapElement_test("RGW/time_setting/day", day, itemIndex++);
          putMapElement_test("RGW/time_setting/hour", hour, itemIndex++);
          putMapElement_test("RGW/time_setting/minute", minute, itemIndex++);
          putMapElement_test("RGW/time_setting/second", second, itemIndex++);

          if ($("#NtpEnabledStatus").prop("checked")) {
              putMapElement_test("RGW/time_setting/ntp_status", "enable", itemIndex++);
              if (g_bNtpEnabled) {
                  putMapElement_test("RGW/time_setting/ntp_action", "noaction", itemIndex++);
              }
              else {
                  putMapElement_test("RGW/time_setting/ntp_action", "enable", itemIndex++);
              }
          }
          else {
              putMapElement_test("RGW/time_setting/ntp_status", "disable", itemIndex++);
              if (!g_bNtpEnabled) {
                  putMapElement_test("RGW/time_setting/ntp_action", "noaction", itemIndex++);
              }
              else {
                  putMapElement_test("RGW/time_setting/ntp_action", "disable", itemIndex++);
              }
          }

         postXML("time_setting", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));

}

/*function btnUpdateNtpTime(){
      var itemIndex=0;
            mapData=null;
       	    mapData = new Array();
       	    putMapElement_test("RGW/ntp_setting/get_ntptime", 1, itemIndex++);
	   if (mapData.length > 0) {
	       tryQueryUpdateResultCount = 0;
	       bIsupdatingTime = true;
	       $("#UpdateTimeWaiting").show();
		   $("#tbrouter_year").attr("disabled", true);
		   $("#tbrouter_month").attr("disabled", true);
		   $("#tbrouter_day").attr("disabled", true);
		   $("#tbrouter_hour").attr("disabled", true);
		   $("#tbrouter_minute").attr("disabled", true);
		   $("#tbrouter_second").attr("disabled", true);
		   $("#SelTimezonedropdown").attr("disabled", true);
		   $("#btUpdateNTPtime").attr("disabled", true);
		   $("#btSaveDateTime").attr("disabled", true);
	       $("#btUpdateNTPtime").parent(".btnWrp:first").addClass("disabledBtn");
		   $("#btSaveDateTime").parent(".btnWrp:first").addClass("disabledBtn");
	       postXMLTimeset("time_setting", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)), undefined, QueryUpdateTimeResult);
	   }

}


function QueryUpdateTimeResult() {
    var xml = getData("time_setting");
    if (++tryQueryUpdateResultCount > 12) {
        showAlert(jQuery.i18n.prop("pUpdateTimeOut"));
        $("#UpdateTimeWaiting").hide();
		$("#tbrouter_year").attr("disabled", false);
		   $("#tbrouter_month").attr("disabled", false);
		   $("#tbrouter_day").attr("disabled", false);
		   $("#tbrouter_hour").attr("disabled", false);
		   $("#tbrouter_minute").attr("disabled", false);
		   $("#tbrouter_second").attr("disabled", false);
		   $("#SelTimezonedropdown").attr("disabled", false);
		   $("#btUpdateNTPtime").attr("disabled", false);
		   $("#btSaveDateTime").attr("disabled", false);
	       $("#btUpdateNTPtime").parent(".btnWrp:first").removeClass("disabledBtn");
		   $("#btSaveDateTime").parent(".btnWrp:first").removeClass("disabledBtn");
        bIsupdatingTime = false;
        return;
    }
    $(xml).find("ntp_setting").each(function() {

    var UpdateTimeflag = $(this).find("ntp_sync_flag").text();

    //1: successful  2: failed 3: syncing 0: init
    if (bIsupdatingTime) {
        if (1 == UpdateTimeflag) {
                bIsupdatingTime = false;
                $("#UpdateTimeWaiting").hide();
                confirm(jQuery.i18n.prop("pSuccesscompleteupdateTime"));
               $("#tbrouter_year").attr("disabled", false);
		   $("#tbrouter_month").attr("disabled", false);
		   $("#tbrouter_day").attr("disabled", false);
		   $("#tbrouter_hour").attr("disabled", false);
		   $("#tbrouter_minute").attr("disabled", false);
		   $("#tbrouter_second").attr("disabled", false);
		   $("#SelTimezonedropdown").attr("disabled", false);
		   $("#btUpdateNTPtime").attr("disabled", false);
		   $("#btSaveDateTime").attr("disabled", false);
	       $("#btUpdateNTPtime").parent(".btnWrp:first").removeClass("disabledBtn");
		   $("#btSaveDateTime").parent(".btnWrp:first").removeClass("disabledBtn");
                bIsupdatingTime = false;
        }
        else if (2 == UpdateTimeflag) {
                bIsupdatingTime = false;
                $("#UpdateTimeWaiting").hide();
                confirm(jQuery.i18n.prop("pFailedcompleteupdateTime"));
                $("#tbrouter_year").attr("disabled", false);
		   $("#tbrouter_month").attr("disabled", false);
		   $("#tbrouter_day").attr("disabled", false);
		   $("#tbrouter_hour").attr("disabled", false);
		   $("#tbrouter_minute").attr("disabled", false);
		   $("#tbrouter_second").attr("disabled", false);
		   $("#SelTimezonedropdown").attr("disabled", false);
		   $("#btUpdateNTPtime").attr("disabled", false);
		   $("#btSaveDateTime").attr("disabled", false);
	       $("#btUpdateNTPtime").parent(".btnWrp:first").removeClass("disabledBtn");
		   $("#btSaveDateTime").parent(".btnWrp:first").removeClass("disabledBtn");
                bIsupdatingTime = false;
            }
       else{
               setTimeout(QueryUpdateTimeResult, 10000);
            }
    }

    });
}

function ntpserver_validate(ntpserver){

				   if(ntpserver=="")
				        return jQuery.i18n.prop('lEmptyNTPServerIP');
				   else{
                           var ipvalueArray = ntpserver.split(".");
						   if(ipvalueArray[0]!="www"){

						   	if(ipvalueArray.length!=4)
								return jQuery.i18n.prop('lNTPServerIPErr');
							else{
								  for(var i=0;i<4;i++){
								  	 if(!isNumber(ipvalueArray[i]))
				                       return jQuery.i18n.prop('lNTPServerIPNumErr');
				                   if (ipvalueArray[i] < 0 || ipvalueArray[i] > 255)
				                       return jQuery.i18n.prop('lNTPServerIPRangeErr');
								  	}
								}
						   	}

				   	   }
				    return "OK";
}*/
 function time_validate(year,month,day,hour,minute,second){


					if(year=="")
				        return jQuery.i18n.prop('lEmptyYear');
				    if(month=="")
				        return jQuery.i18n.prop('lEmptyMonth');
				    if(day=="")
				        return jQuery.i18n.prop('lEmptyDay');
				    if(hour=="")
				        return jQuery.i18n.prop('lEmptyHour');
				    if(minute=="")
				        return jQuery.i18n.prop('lEmptyMinute');
				    if(second=="")
				        return jQuery.i18n.prop('lEmptySecond');

				    if(!isNumber(year))
				        return jQuery.i18n.prop('lYearNumErr');
				    if(!StringMaxLength(year,4))
				        return jQuery.i18n.prop('lYearLenErr');
				    if(!isNumber(month))
				        return jQuery.i18n.prop('lMonthNumErr');
				    if(!StringMaxLength(month,2))
				    		return jQuery.i18n.prop('lMonthLenErr');
				    if(month>12 || month<0)
				    		return jQuery.i18n.prop('lMonthLenErr');
				    if(!isNumber(day))
				        return jQuery.i18n.prop('lDayNumErr');
				    if(!StringMaxLength(day,2))
				    		return jQuery.i18n.prop('lMonthLenErr');
				   if(month == 2)
				   {
						if(is_leapyear(year))
						{
						   if(day>29)
							return jQuery.i18n.prop('lDayRangeLeap');
						}
						else
						{
						    if(day>28)
							return jQuery.i18n.prop('lDayRangeNonLeap');
						}

				   }
				   else if(month <=7 )
				  {
						if(month%2==1)
						{
							if(day>31)
								return jQuery.i18n.prop('lDayRangeErr');
						}
						else
						{
							if(day>30)
								return jQuery.i18n.prop('lDayRangeErr1');
						}
				  }
				   else if(month > 7)
				   {
						if(month%2==0)
						{
							if(day>31)
								return jQuery.i18n.prop('lDayRangeErr');
						}
						else
						{
							if(day>30)
							     return jQuery.i18n.prop('lDayRangeErr1');
						}
				   }

				    if(day>31 || day<1)
				    		return jQuery.i18n.prop('lDayRangeErr');
				    if(!isNumber(hour))
				        return jQuery.i18n.prop('lHourNumErr');
				    if(hour>23 || hour<0)
				    		return jQuery.i18n.prop('lHourRangeErr');
				    if(!isNumber(minute))
				        return jQuery.i18n.prop('lMinuteNumErr');
				    if(minute>59 || minute<0)
				    		return jQuery.i18n.prop('lMinuteRangeErr');
				    if(!isNumber(second))
				        return jQuery.i18n.prop('lSecondNumErr');
				    if(second>59 || second<0)
				    		return jQuery.i18n.prop('lSecondRangeErr');
				    return "OK";
}

 function putMapElement_test(xpath, value, index) {
    mapData[index] = new Array(2);
    mapData[index][0] = xpath;
    mapData[index][1] = value;
}

function EDTimeSettingNW(){
    if (document.getElementById('NtpEnabledStatus').checked) {
        $("#tbrouter_year").prop("disabled",true);
		$("#tbrouter_month").prop("disabled",true);
		$("#tbrouter_day").prop("disabled",true);
		$("#tbrouter_hour").prop("disabled",true);
		$("#tbrouter_minute").prop("disabled",true);
		$("#tbrouter_second").prop("disabled",true);
    } else {
        $("#tbrouter_year").prop("disabled",false);
		$("#tbrouter_month").prop("disabled",false);
		$("#tbrouter_day").prop("disabled",false);
		$("#tbrouter_hour").prop("disabled",false);
		$("#tbrouter_minute").prop("disabled",false);
		$("#tbrouter_second").prop("disabled",false);
    }

}