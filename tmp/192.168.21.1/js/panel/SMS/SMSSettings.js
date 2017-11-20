
var DefaultcenterNumber = "";
(function($) {
    $.fn.objSmsSet = function(InIt) {

        var mapData = new Array();
        var xmlName = "";
		
        function SetLocation() {
            $("[id^='lt_SmsSet_stc']").each(function() {
                $(this).text(jQuery.i18n.prop($(this).attr("id")));
            });
            $("[id^='lt_SmsSet_btn']").each(function() {
                $(this).val(jQuery.i18n.prop($(this).attr("id")));
            });

        }

        function InitUpdate() {
            var xmlText = getData(xmlName);
            var savelocation = $(xmlText).find("save_location").text();
            var statusReport = $(xmlText).find("status_report").text();
            var saveTime = $(xmlText).find("save_time").text();
            DefaultcenterNumber = $(xmlText).find("sms_center").text();
			var smsovercsMode = $(xmlText).find("sms_over_cs").text();
            $("#smsSaveLocSel").val(savelocation);
			$("#smsSMScsModeSel").val(smsovercsMode);

            if ("0" == statusReport) {
                $("#SendReportDisabled").prop("checked", true);
            }
            else {
                $("#SendReportEnabled").prop("checked", true);
            }



            $("#txtCenterNumber").val(DefaultcenterNumber);

            switch (saveTime) {
                case "143":
                    $("#validitySel").get(0).selectedIndex = 0;
                    break;
                case "167":
                    $("#validitySel").get(0).selectedIndex = 1;
                    break;
                case "173":
                    $("#validitySel").get(0).selectedIndex = 2;
                    break;
                case "255":
                    $("#validitySel").get(0).selectedIndex = 3;
                    break;
                default:
                    $("#validitySel").get(0).selectedIndex = 0;
            }
        }
		
        this.onLoad = function() {
            this.loadHTML();
            SetLocation();
            InitUpdate();
        }

        this.onPostSuccess = function() {
            this.onLoad(true);
        }

        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/SMS/SmsSettings.html");
        }

        this.onPost = function() {
            var itemIdx = 0;
            var mapData = new Array(0);
			
            putMapElement(mapData, "RGW/message/flag/message_flag", "SET_SMS_CENTER", itemIdx++);
            putMapElement(mapData, "RGW/message/sms_setting/status_report", $("#SendReportEnabled").prop("checked") ? "1" : "0", itemIdx++);
            putMapElement(mapData, "RGW/message/sms_setting/sms_center", $("#txtCenterNumber").val(), itemIdx++);
            putMapElement(mapData, "RGW/message/sms_setting/save_time", $("#validitySel").val(), itemIdx++);
            putMapElement(mapData, "RGW/message/sms_setting/save_location", $("#smsSaveLocSel").val(), itemIdx++);
			putMapElement(mapData, "RGW/message/sms_setting/sms_over_cs", $("#smsSMScsModeSel").val(), itemIdx++);
            postXML("message", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
           
        }
		
        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }

        return this;
    }
})(jQuery);

function ModifySMScenterNumber(){
  				var CurrentCenterNumber = $("#txtCenterNumber").val();
				if(CurrentCenterNumber!=DefaultcenterNumber){
				 	showAlert(jQuery.i18n.prop("lSMSCenterModificationWarning"));
					DefaultcenterNumber = CurrentCenterNumber;
					}
				}

