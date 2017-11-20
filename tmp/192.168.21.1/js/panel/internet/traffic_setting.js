(function($) {

    $.fn.objTrafficSetting = function(InIt) {
        var xmlName = '';
		var hard_ver = getHardware_Version();
        document.getElementById('Content').innerHTML = callProductHTML("html/internet/traffic_setting.html");

        $("[id^='lt_trafficSet_stc']").each(function() {
            $(this).text(jQuery.i18n.prop($(this).attr("id")));
        });
        $("[id^='lt_trafficSet_btn']").each(function() {
            $(this).val(jQuery.i18n.prop($(this).attr("id")));
        });
		$("#lt_trafficSet_Payment_day").text(jQuery.i18n.prop("lt_trafficSet_Payment_day"));
		var tyear,tmonth="",tday="",tstrControlMode="",tupper_value_month="",tupper_value_period="",tupper_value_daily="",tupper_value_unlimit="",awarning_value="";
		var perstart_date="",perend_date="";
        var strControlMode = "";
		var tpayment_day="";

        this.onLoad = function() {
            var xml = getData(xmlName);
				
				$(xml).find("time_setting").each(function() {
                tyear = $(this).find("year").text();
				tmonth = $(this).find("month").text();
				tday = $(this).find("day").text();
					});
            $(xml).find("WanStatistics").each(function() {
				awarning_value = $(this).find("warning_value").text();
				perstart_date = $(this).find("period_start_date").text();
				perend_date = $(this).find("period_end_date").text();
                strControlMode = $(this).find("stat_mang_method").text();
                //$("#trafficSetingSel").val(strControlMode);

				$("#DisconnectActionSel").val($(this).find("dis_value_at_upper").text());
				

                if (0 == strControlMode) {
					tstrControlMode = "0";
					$("#trafficSetingSel").val(strControlMode);
                    $("#DivMonthTrafficInfo").hide();
                    $("#DivPeriodTrafficInfo").hide();
                    $("#DivUnlimitPeriodTrafficInfo").hide();
                    $("#divDisconnectNetwork").hide();
					$("#DivPeriodhUsedTraffic").hide();
					$("#DivUnlimitPeriodUsedTraffic").hide();
					$("#DivMonthUsedTraffic").hide();
					$("#DivMonthPayment_day").hide();
					$("#DivDailyTrafficInfo").hide();
					$("#DivDailyUsedTraffic").hide();
                }
                else if (1 == strControlMode) {
					tstrControlMode = "2";
					$("#trafficSetingSel").val("2");
                    $("#DivMonthTrafficInfo").show();
                    $("#DivPeriodTrafficInfo").hide();
                    $("#DivUnlimitPeriodTrafficInfo").hide();
					$("#divDisconnectNetwork").show();
					$("#lt_trafficSet_stcDisabled").hide();
					$("#DivPeriodhUsedTraffic").hide();
					$("#DivUnlimitPeriodUsedTraffic").hide();
					$("#DivMonthUsedTraffic").show();
					$("#DivDailyTrafficInfo").hide();
					$("#DivDailyUsedTraffic").hide();
					
					//jmm
				if(hard_ver=="Ver.B"||hard_ver=="Ver.C"){
       				$("#dtraffic_mode_set").hide();//jmm jp changed 
       				$("#twarningvalue_div").hide();
					$("#lt_trafficSet_btnCalMonthTraffic").val(jQuery.i18n.prop("resetTraffic"));
        		}else{		
					$("#DivMonthPayment_day").show();
					$("#dtraffic_mode_set").show();//jmm jp changed 
       				$("#twarningvalue_div").show();
					$("#lt_trafficSet_btnCalMonthTraffic").val(jQuery.i18n.prop("lt_trafficSet_btnCalMonthTraffic"));
					tpayment_day =$(this).find("payment_day").text();
					if(tpayment_day == "0")
						$("#txtPayment_day").val("1");
					else
						$("#txtPayment_day").val(tpayment_day);
					}
			//jmm end

                    //月总流量
                    tupper_value_month = $(this).find("upper_value_month").text();
                    var dataTraffic = parseInt($(this).find("upper_value_month").text());
					if (dataTraffic > 1024 * 1024 * 1024) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
                        $("#txtMonthTotalTaffic").val(dataInGB.toFixed(2));
                        $("#MonthTotaldDataUnitSel").val("3");
                    }
                    else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
                        $("#txtMonthTotalTaffic").val(dataInMB.toFixed(2));
                        $("#MonthTotaldDataUnitSel").val("2");
                    }
                    else {
                        var dataInKB = dataTraffic / 1024;
						if(isNaN(dataTraffic))
						$("#txtMonthTotalTaffic").val(jQuery.i18n.prop("flowunset"));
						else
                        $("#txtMonthTotalTaffic").val(dataInKB.toFixed(2));
                        $("#MonthTotaldDataUnitSel").val("1");
                    }



                    //月可用流量
                    dataTraffic = parseInt($(this).find("total_available_month").text());
                    if (dataTraffic > 1024 * 1024 * 1024) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
                        $("#txtMonthAvailableTraffic").val(dataInGB.toFixed(2));
                        $("#MonthAvalibleDataUnitSel").val("3");
                    }
                    else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
                        $("#txtMonthAvailableTraffic").val(dataInMB.toFixed(2));
                        $("#MonthAvalibleDataUnitSel").val("2");
                    }
                    else {
                        var dataInKB = dataTraffic / 1024;
						if(isNaN(dataTraffic))
						$("#txtMonthAvailableTraffic").val(jQuery.i18n.prop("flowunset"));
						else
                        $("#txtMonthAvailableTraffic").val(dataInKB.toFixed(2));
                        $("#MonthAvalibleDataUnitSel").val("1");
                    }

                    //月已经使用流量
                    dataTraffic = parseInt($(this).find("total_used_month").text());
                    if (dataTraffic > 1024 * 1024 * 1024) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
						$("#txtMonthUsedTaffic").html(dataInGB.toFixed(2)+" GB");
                       /* $("#txtMonthUsedTaffic").val(dataInGB.toFixed(2));
                        $("#MonthUsedDataUnitSel").val("3");*/
                    }
                    else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
						$("#txtMonthUsedTaffic").html(dataInMB.toFixed(2)+" MB");
                        /*$("#txtMonthUsedTaffic").val(dataInMB.toFixed(2));
                        $("#MonthUsedDataUnitSel").val("2");*/
                    }
                    else {
                        var dataInKB = dataTraffic / 1024;
						$("#txtMonthUsedTaffic").html(dataInKB.toFixed(2)+" KB");
                       /* $("#txtMonthUsedTaffic").val(dataInKB.toFixed(2));
                        $("#MonthUsedDataUnitSel").val("1");*/
                    }
				var lwarning_value = parseInt($(this).find("warning_value").text());
				var lupper_vakue_can_use = parseInt($(this).find("upper_value_month").text());
				var cwnvle = parseInt(lupper_vakue_can_use*0.6);
				if(lwarning_value == parseInt(lupper_vakue_can_use*1))
					$("#twarningvalue_select").val("0");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.9))
					$("#twarningvalue_select").val("1");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.8))
					$("#twarningvalue_select").val("2");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.7))
					$("#twarningvalue_select").val("3");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.6))
					$("#twarningvalue_select").val("4");
                }
                else if (2 == strControlMode) {
					//$("#trafficSetingSel").val("3");
                    $("#DivMonthTrafficInfo").hide();
                    $("#DivPeriodTrafficInfo").show();
                    $("#DivUnlimitPeriodTrafficInfo").hide();
					$("#divDisconnectNetwork").show();
					$("#lt_trafficSet_stcDisabled").hide();
					$("#DivPeriodhUsedTraffic").show();
					$("#DivUnlimitPeriodUsedTraffic").hide();
					$("#DivMonthUsedTraffic").hide();
					$("#DivMonthPayment_day").hide();
					$("#DivDailyTrafficInfo").hide();
					$("#DivDailyUsedTraffic").hide();
                    //周期总流量
                   tupper_value_period = $(this).find("upper_value_period ").text()
                    var dataTraffic = parseInt($(this).find("upper_value_period ").text());
                    if (dataTraffic > 1024 * 1024 * 1024) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
                        $("#txtPeriodTotalTaffic").val(dataInGB.toFixed(2));
                        $("#PeroidTotaldDataUnitSel").val("3");
                    }
                    else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
                        $("#txtPeriodTotalTaffic").val(dataInMB.toFixed(2));
                        $("#PeroidTotaldDataUnitSel").val("2");
                    }
                    else {
						
                        var dataInKB = dataTraffic / 1024;
						if(isNaN(dataTraffic))
						$("#txtPeriodTotalTaffic").val(jQuery.i18n.prop("flowunset"));
						else
                        $("#txtPeriodTotalTaffic").val(dataInKB.toFixed(2));
                        $("#PeroidTotaldDataUnitSel").val("1");
                    }


                    //周期可用流量
                    dataTraffic = parseInt($(this).find("total_available_period").text());
                    if (dataTraffic > 1024 * 1024 * 1024) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
                        $("#txtPeriodAvalibleTraffic").val(dataInGB.toFixed(2));
                        $("#PeroidAvalibleDataUnitSel").val("3");
                    }
                    else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
                        $("#txtPeriodAvalibleTraffic").val(dataInMB.toFixed(2));
                        $("#PeroidAvalibleDataUnitSel").val("2");
                    }
                    else {
                        var dataInKB = dataTraffic / 1024;
						if(isNaN(dataTraffic))
						$("#txtPeriodAvalibleTraffic").val(jQuery.i18n.prop("flowunset"));
						else
                        $("#txtPeriodAvalibleTraffic").val(dataInKB.toFixed(2));
                        $("#PeroidAvalibleDataUnitSel").val("1");
                    }

                    //周期已经使用流量
                    dataTraffic = parseInt($(this).find("total_used_period").text());
                    if (dataTraffic > 1073741824) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
						$("#txtPeriodUsedTaffic").html(dataInGB.toFixed(2)+" GB");
                        /*$("#txtPeriodUsedTaffic").val(dataInGB.toFixed(2));
                        $("#PeroidUsedDataUnitSel").val("3");*/
                    }
                    else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
						$("#txtPeriodUsedTaffic").html(dataInMB.toFixed(2)+" MB");
                        /*$("#txtPeriodUsedTaffic").val(dataInMB.toFixed(2));
                        $("#PeroidUsedDataUnitSel").val("2");*/
                    }
                    else {
                        var dataInKB = dataTraffic / 1024;
						$("#txtPeriodUsedTaffic").html(dataInKB.toFixed(2)+" KB");
                       /* $("#txtPeriodUsedTaffic").val(dataInKB.toFixed(2));
                        $("#PeroidUsedDataUnitSel").val("1");*/
                    }


                    var periodStartData = $(this).find("period_start_date").text().split(",");
                    var periodEndData = $(this).find("period_end_date").text().split(",");
					if(periodStartData[0]==periodEndData[0]){
						if(parseInt(periodEndData[1])-parseInt(periodStartData[1])==3){
							tstrControlMode = "3";
							$("#trafficSetingSel").val("3");
						}else{
							tstrControlMode = "4";
							$("#trafficSetingSel").val("4");
						}
						
					}else if(parseInt(periodEndData[0])>parseInt(periodStartData[0])){
						if(parseInt(periodStartData[1])== parseInt(periodEndData[1])){
							tstrControlMode = "5";
							$("#trafficSetingSel").val("5");
							}else if(parseInt(periodStartData[1])-parseInt(periodEndData[1])==6){
							tstrControlMode = "4";
							$("#trafficSetingSel").val("4");
							}else{
							tstrControlMode = "3";
							$("#trafficSetingSel").val("3");
							}
					}
                    $("#txtPeriodStartYear").val("20" + periodStartData[0]);
                    $("#txtPeriodStartMonth").val(periodStartData[1]);
                    $("#txtPeriodStartDay").val(periodStartData[2]);
                    $("#txtPeriodEndYear").val("20" + periodEndData[0]);
                    $("#txtPeriodEndMonth").val(periodEndData[1]);
                    $("#txtPeriodEndDay").val(periodEndData[2]);
				var lwarning_value = parseInt($(this).find("warning_value").text());
				var lupper_vakue_can_use = parseInt($(this).find("upper_value_period").text());
				
				if(lwarning_value == parseInt(lupper_vakue_can_use*1))
					$("#twarningvalue_select").val("0");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.9))
					$("#twarningvalue_select").val("1");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.8))
					$("#twarningvalue_select").val("2");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.7))
					$("#twarningvalue_select").val("3");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.6))
					$("#twarningvalue_select").val("4");
                }
                else if (3 == strControlMode){
					tstrControlMode = "1";
					$("#trafficSetingSel").val("1");
                    $("#DivMonthTrafficInfo").hide();
                    $("#DivPeriodTrafficInfo").hide();
                    $("#DivUnlimitPeriodTrafficInfo").show();
					$("#divDisconnectNetwork").show();
					$("#lt_trafficSet_stcDisabled").hide();
					$("#DivPeriodhUsedTraffic").hide();
					$("#DivUnlimitPeriodUsedTraffic").show();
					$("#DivMonthUsedTraffic").hide();
					$("#DivMonthPayment_day").hide();
					$("#DivDailyTrafficInfo").hide();
					$("#DivDailyUsedTraffic").hide();

                    //无限制周期总流量
                   tupper_value_unlimit = $(this).find("upper_value_unlimit").text()
                    var dataTraffic = parseInt($(this).find("upper_value_unlimit").text());
                    if (dataTraffic > 1073741824) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
                        $("#txtUnlimitPeriodTotalTaffic").val(dataInGB.toFixed(2));
                        $("#UnlimitPeriodTotaldDataUnitSel").val("3");
                    }
                    else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
                        $("#txtUnlimitPeriodTotalTaffic").val(dataInMB.toFixed(2));
                        $("#UnlimitPeriodTotaldDataUnitSel").val("2");
                    }
                    else {
                        var dataInKB = dataTraffic / 1024;
						if(isNaN(dataTraffic))
						$("#txtUnlimitPeriodTotalTaffic").val(jQuery.i18n.prop("flowunset"));
						else
                        $("#txtUnlimitPeriodTotalTaffic").val(dataInKB.toFixed(2));
                        $("#UnlimitPeriodTotaldDataUnitSel").val("1");
                    }


                    //无限制周期可用流量
                    dataTraffic = parseInt($(this).find("total_avaliable_unlimit").text());
                    if (dataTraffic > 1073741824) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
                        $("#txtUnlimitPeriodAvailableTraffic").val(dataInGB.toFixed(2));
                        $("#UnlimitPeriodAvalibleDataUnitSel").val("3");
                    }
                    else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
                        $("#txtUnlimitPeriodAvailableTraffic").val(dataInMB.toFixed(2));
                        $("#UnlimitPeriodAvalibleDataUnitSel").val("2");
                    }
                    else {
                        var dataInKB = dataTraffic / 1024;
						if(isNaN(dataTraffic))
						$("#txtUnlimitPeriodAvailableTraffic").val(jQuery.i18n.prop("flowunset"));
						else
                        $("#txtUnlimitPeriodAvailableTraffic").val(dataInKB.toFixed(2));
                        $("#UnlimitPeriodAvalibleDataUnitSel").val("1");
                    }

                    //无限制周期已经使用流量
                    dataTraffic = parseInt($(this).find("total_used_unlimit").text());
                    if (dataTraffic > 1073741824) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
						$("#txtUnlimitPeriodUsedTaffic").html(dataInGB.toFixed(2)+" GB");
                        /*$("#txtUnlimitPeriodUsedTaffic").val(dataInGB.toFixed(2));
                        $("#UnlimitPeriodUsedDataUnitSel").val("3");*/
                    }
                    else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
						$("#txtUnlimitPeriodUsedTaffic").html(dataInMB.toFixed(2)+" MB");
                       /* $("#txtUnlimitPeriodUsedTaffic").val(dataInMB.toFixed(2));
                        $("#UnlimitPeriodUsedDataUnitSel").val("2");*/
                    }
                    else {
                        var dataInKB = dataTraffic / 1024;
						$("#txtUnlimitPeriodUsedTaffic").html(dataInKB.toFixed(2)+" KB");
                        /*$("#txtUnlimitPeriodUsedTaffic").val(dataInKB.toFixed(2));
                        $("#UnlimitPeriodUsedDataUnitSel").val("1");*/
                    }
					var lwarning_value = parseInt($(this).find("warning_value").text());
				var lupper_vakue_can_use = parseInt($(this).find("upper_value_unlimit").text());
				if(lwarning_value == parseInt(lupper_vakue_can_use*1))
					$("#twarningvalue_select").val("0");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.9))
					$("#twarningvalue_select").val("1");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.8))
					$("#twarningvalue_select").val("2");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.7))
					$("#twarningvalue_select").val("3");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.6))
					$("#twarningvalue_select").val("4");
                }else if (4 == strControlMode){
                	tstrControlMode = "6";
					$("#trafficSetingSel").val("6");
					
					$("#DivMonthTrafficInfo").hide();
                    $("#DivPeriodTrafficInfo").hide();
                    $("#DivUnlimitPeriodTrafficInfo").hide();
                    $("#DivDailyTrafficInfo").show();
                    $("#divDisconnectNetwork").show();
                    //
                	$("#lt_trafficSet_stcDisabled").hide();
					$("#DivPeriodhUsedTraffic").hide();
					$("#DivUnlimitPeriodUsedTraffic").hide();
					$("#DivMonthUsedTraffic").hide();
					$("#DivMonthPayment_day").hide();
					$("#DivDailyUsedTraffic").show();
                    //
                    /*daily total*/
					tupper_value_daily = $(this).find("upper_value_daily").text();
                    var dataTraffic = parseInt($(this).find("upper_value_daily").text());					
                    if (dataTraffic > 1073741824) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
                        $("#txtDailyTotalTaffic").val(dataInGB.toFixed(2));
                        $("#DailyTotaldDataUnitSel").val("3");
                    } else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
                        $("#txtDailyTotalTaffic").val(dataInMB.toFixed(2));
                        $("#DailyTotaldDataUnitSel").val("2");
                    } else {
                        var dataInKB = dataTraffic / 1024;
                        $("#txtDailyTotalTaffic").val(dataInKB.toFixed(2));
                        $("#DailyTotaldDataUnitSel").val("1");
                    }

		       /*daily available*/
                   /* dataTraffic = parseInt($(this).find("total_available_daily").text());
					g_dailyAvailbleTraffic = dataTraffic;
                    if (dataTraffic > 1073741824) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
                        $("#txtDailyAvailableTraffic").val(dataInGB.toFixed(2));
                        $("#DailyAvalibleDataUnitSel").val("3");
                    } else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
                        $("#txtDailyAvailableTraffic").val(dataInMB.toFixed(2));
                        $("#DailyAvalibleDataUnitSel").val("2");
                    } else {
                        var dataInKB = dataTraffic / 1024;
                        $("#txtDailyAvailableTraffic").val(dataInKB.toFixed(2));
                        $("#DailyAvalibleDataUnitSel").val("1");
                    }*/

                    /*daily used*/
                    dataTraffic = parseInt($(this).find("total_used_daily").text());
                    if (dataTraffic > 1073741824) {
                        var dataInGB = dataTraffic / (1024 * 1024 * 1024);
                        $("#txtDailyUsedTaffic").html(dataInGB.toFixed(2)+" GB");
                        //$("#DailyUsedDataUnitSel").val("3");
                    } else if (dataTraffic > 1024 * 1024) {
                        var dataInMB = dataTraffic / (1024 * 1024);
                        $("#txtDailyUsedTaffic").html(dataInMB.toFixed(2)+" MB");
                        //$("#DailyUsedDataUnitSel").val("2");
                    } else {
                        var dataInKB = dataTraffic / 1024;
                        $("#txtDailyUsedTaffic").html(dataInKB.toFixed(2)+" KB");
                        //$("#DailyUsedDataUnitSel").val("1");
                    }

					var lwarning_value = parseInt($(this).find("warning_value").text());
				var lupper_vakue_can_use = parseInt($(this).find("upper_value_daily").text());
				if(lwarning_value == parseInt(lupper_vakue_can_use*1))
					$("#twarningvalue_select").val("0");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.9))
					$("#twarningvalue_select").val("1");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.8))
					$("#twarningvalue_select").val("2");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.7))
					$("#twarningvalue_select").val("3");
				else if (lwarning_value == parseInt(lupper_vakue_can_use*0.6))
					$("#twarningvalue_select").val("4");
				}

            });
        }

        $("#DisconnectActionSel").change(function() {
            var mapData = new Array();
            putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_dis_at_upper", 0);
            putMapElement(mapData, "RGW/statistics/WanStatistics/dis_value_at_upper", $(this).children('option:selected').val(), 1);
            postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
        });

        $("#trafficSetingSel").change(function() {
			$("#ltrafficErrorMes").hide();
			var tselValue;
            var selValue = $(this).children('option:selected').val();
            if (0 == selValue) {
				tselValue = 0;
                $("#DivMonthTrafficInfo").hide();
                $("#DivPeriodTrafficInfo").hide();
                $("#DivUnlimitPeriodTrafficInfo").hide();
                $("#divDisconnectNetwork").hide();
				$("#DivPeriodhUsedTraffic").hide();
				$("#DivUnlimitPeriodUsedTraffic").hide();
				$("#DivMonthUsedTraffic").hide();
				$("#DivMonthPayment_day").hide();
				$("#DivDailyTrafficInfo").hide();
				$("#DivDailyUsedTraffic").hide();
            }
			else if (1 == selValue) {
				tselValue = 3;
                $("#DivMonthTrafficInfo").hide();
                $("#DivPeriodTrafficInfo").hide();
                $("#DivUnlimitPeriodTrafficInfo").show();
                $("#divDisconnectNetwork").show();
				$("#lt_trafficSet_stcDisabled").hide();
				$("#DivPeriodhUsedTraffic").hide();
				//$("#DivUnlimitPeriodUsedTraffic").show();
				$("#DivMonthUsedTraffic").hide();
				$("#DivMonthPayment_day").hide();
				$("#DivDailyTrafficInfo").hide();
				$("#DivDailyUsedTraffic").hide();
				
            }
            else if (2 == selValue) {
				tselValue = 1;
                $("#DivMonthTrafficInfo").show();
                $("#DivPeriodTrafficInfo").hide();
                $("#DivUnlimitPeriodTrafficInfo").hide();
                $("#divDisconnectNetwork").show();
				$("#lt_trafficSet_stcDisabled").hide();
				$("#DivPeriodhUsedTraffic").hide();
				$("#DivUnlimitPeriodUsedTraffic").hide();
				$("#DivMonthPayment_day").show();
				$("#DivDailyTrafficInfo").hide();
				$("#DivDailyUsedTraffic").hide();
				//$("#DivMonthUsedTraffic").show();
				
            }
            else if (3 == selValue) {
				tselValue = 2;
                $("#DivMonthTrafficInfo").hide();
                $("#DivPeriodTrafficInfo").show();
                $("#DivUnlimitPeriodTrafficInfo").hide();
                $("#divDisconnectNetwork").show();
				$("#lt_trafficSet_stcDisabled").hide();
				//$("#DivPeriodhUsedTraffic").show();
				$("#DivUnlimitPeriodUsedTraffic").hide();
				$("#DivMonthUsedTraffic").hide();
				$("#DivMonthPayment_day").hide();
				$("#DivDailyTrafficInfo").hide();
				$("#DivDailyUsedTraffic").hide();
				
            }
            
			else if (4 == selValue) {
				tselValue = 2;
                $("#DivMonthTrafficInfo").hide();
                $("#DivPeriodTrafficInfo").show();
                $("#DivUnlimitPeriodTrafficInfo").hide();
                $("#divDisconnectNetwork").show();
				$("#lt_trafficSet_stcDisabled").hide();
				//$("#DivPeriodhUsedTraffic").show();
				$("#DivUnlimitPeriodUsedTraffic").hide();
				$("#DivMonthUsedTraffic").hide();
				$("#DivMonthPayment_day").hide();
				$("#DivDailyTrafficInfo").hide();
				$("#DivDailyUsedTraffic").hide();
				
            }
			else if (5 == selValue) {
				tselValue = 2;
                $("#DivMonthTrafficInfo").hide();
                $("#DivPeriodTrafficInfo").show();
                $("#DivUnlimitPeriodTrafficInfo").hide();
                $("#divDisconnectNetwork").show();
				$("#lt_trafficSet_stcDisabled").hide();
				//$("#DivPeriodhUsedTraffic").show();
				$("#DivUnlimitPeriodUsedTraffic").hide();
				$("#DivMonthUsedTraffic").hide();
				$("#DivMonthPayment_day").hide();
				$("#DivDailyTrafficInfo").hide();
				$("#DivDailyUsedTraffic").hide();
				
            }else if (6 == selValue) {
				tselValue = 4;
                $("#DivMonthTrafficInfo").hide();
                $("#DivPeriodTrafficInfo").hide();
                $("#DivUnlimitPeriodTrafficInfo").hide();
                $("#divDisconnectNetwork").show();
				$("#lt_trafficSet_stcDisabled").hide();
				//$("#DivPeriodhUsedTraffic").show();
				$("#DivUnlimitPeriodUsedTraffic").hide();
				$("#DivMonthUsedTraffic").hide();
				$("#DivMonthPayment_day").hide();
				$("#DivDailyTrafficInfo").show();
				$("#DivDailyUsedTraffic").hide();
				
            }

           
			if(tselValue == "2"){

			///////////
			


			/////
                var startYear = tyear;
                var startMonth = tmonth;
                var startDay = tday;
				$("#txtPeriodStartYear").val(startYear);
				$("#txtPeriodStartMonth").val(startMonth);
				$("#txtPeriodStartDay").val(startDay);
				var endYear,endMonth,endDay;
				if(selValue == "3"){
					if(parseInt(startMonth)+3>12){
                endYear =(parseInt(startYear)+1).toString();
                endMonth = ((parseInt(startMonth)+3)%12).toString();
				}else {
				endYear = startYear;
				endMonth = (parseInt(startMonth)+3).toString();
				}
                endDay = startDay;
				}
				else if(selValue == "4"){
               if(parseInt(startMonth)+6>12){
                endYear = (parseInt(startYear)+1).toString();
                endMonth = ((parseInt(startMonth)+6)%12).toString();
				}else {
				endYear = startYear;
				endMonth = (parseInt(startMonth)+6).toString();
				}
                endDay = startDay;
				}
				else {
                endYear =(parseInt(startYear)+1).toString();
                endMonth = startMonth;
                endDay = startDay;}
				endYear=endYear.toString()
				var zmendday=getMaxDayByYearMonth(endYear,endMonth);
				if(zmendday<=endDay)
					endDay=zmendday;
				$("#txtPeriodEndYear").val(endYear);
				$("#txtPeriodEndMonth").val(endMonth);
				$("#txtPeriodEndDay").val(endDay);
                /*var strStart = startYear.substr(2, 2) + "," + startMonth + "," + startDay;
                var strEnd = endYear.substr(2, 2) + "," + endMonth + "," + endDay;*/

              

               /* var mapData = new Array();
				putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_mang_method", 0);
            	putMapElement(mapData, "RGW/statistics/WanStatistics/stat_mang_method", tselValue, 1);
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_stat_period", 2);
                putMapElement(mapData, "RGW/statistics/WanStatistics/period_start_date", strStart, 3);
                putMapElement(mapData, "RGW/statistics/WanStatistics/period_end_date", strEnd, 4);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));*/
            
        


//////////////
				
			}else{
			/*var mapData = new Array();
            putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_mang_method", 0);
            putMapElement(mapData, "RGW/statistics/WanStatistics/stat_mang_method", tselValue, 1);*/
			}
            //postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
        });
//


$("#lt_trafficSet_btnbtUpdate").click(function() {
 var itemIndex = 0,somethingchanged = 0;
 var mapData = new Array();
		$("#ltrafficErrorMes").hide();

	var tselValue,retValue,WarnValue ;
		    var selValue = $("#trafficSetingSel").val();
			
            if (0 == selValue) {
				tselValue = 0;
				}
			else if (1 == selValue) {
				if($("#txtUnlimitPeriodTotalTaffic").val()== ""){
					$("#ltrafficErrorMes").text(jQuery.i18n.prop("lt_trafficSet_Unset"))
					$("#ltrafficErrorMes").show();
					return;
				}
				tselValue = 3;
				retValue = parseFloat($("#txtUnlimitPeriodTotalTaffic").val());
				if (2 == $("#UnlimitPeriodTotaldDataUnitSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#UnlimitPeriodTotaldDataUnitSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}
				if(retValue.toString() != tupper_value_unlimit){
					somethingchanged = 1;
					
				}
				putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_unlimit", Math.floor(retValue), itemIndex++);
				}
			else if (2 == selValue) {
				var paytemp;
				var stxtPayment_day = parseInt($("#txtPayment_day").val());
				if(stxtPayment_day>0 &&stxtPayment_day <=31 &&parseInt(tpayment_day)!= stxtPayment_day){
					somethingchanged = 1;
				putMapElement(mapData, "RGW/statistics/WanStatistics/payment_day", stxtPayment_day, itemIndex++);
				}else if(parseInt(tpayment_day)== stxtPayment_day){
					paytemp =1;
				}else if(parseInt(tpayment_day)==0 && stxtPayment_day ==1){
					paytemp =1;
				}
				else{
					$("#ltrafficErrorMes").text(jQuery.i18n.prop("lt_trafficSet_Payment_dayError"));
					$("#ltrafficErrorMes").show();
					return;
					}
				if($("#txtMonthTotalTaffic").val()== ""){
					$("#ltrafficErrorMes").text(jQuery.i18n.prop("lt_trafficSet_Unset"))
					$("#ltrafficErrorMes").show();
					return;
				}
				tselValue = 1;
				retValue = parseFloat($("#txtMonthTotalTaffic").val());
				if (2 == $("#MonthTotaldDataUnitSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if(3 == $("#MonthTotaldDataUnitSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}
				if(retValue.toString() != tupper_value_month){
					somethingchanged = 1;
					
				}
				putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_month", Math.floor(retValue), itemIndex++);
				}
			else if (3 == selValue) {
				if($("#txtPeriodTotalTaffic").val()== ""){
					$("#ltrafficErrorMes").text(jQuery.i18n.prop("lt_trafficSet_Unset"))
					$("#ltrafficErrorMes").show();
					return;
				}
				tselValue = 2;
				retValue = parseFloat($("#txtPeriodTotalTaffic").val());
				if (2 == $("#PeroidTotaldDataUnitSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#PeroidTotaldDataUnitSel").val()) {
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
                	retValue = retValue * 1024;
                	}
				if(retValue.toString() != tupper_value_period){
					somethingchanged = 1;
					
				}
				putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_period", Math.floor(retValue), itemIndex++);
				}
			else if (4 == selValue) {
				if($("#txtPeriodTotalTaffic").val()== ""){
					$("#ltrafficErrorMes").text(jQuery.i18n.prop("lt_trafficSet_Unset"))
					$("#ltrafficErrorMes").show();
					return;
				}
				tselValue = 2;
				retValue = parseFloat($("#txtPeriodTotalTaffic").val());
				if (2 == $("#PeroidTotaldDataUnitSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#PeroidTotaldDataUnitSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024 ;
				}
				if(retValue.toString() != tupper_value_period){
					somethingchanged = 1;
					
				}
				putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_period", Math.floor(retValue), itemIndex++);
				}
			else if (5 == selValue) {
				if($("#txtPeriodTotalTaffic").val()== ""){
					$("#ltrafficErrorMes").text(jQuery.i18n.prop("lt_trafficSet_Unset"))
					$("#ltrafficErrorMes").show();
					return;
				}
				tselValue = 2;
				retValue = parseFloat($("#txtPeriodTotalTaffic").val());
				if (2 == $("#PeroidTotaldDataUnitSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#PeroidTotaldDataUnitSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}
				if(retValue.toString() != tupper_value_period){
					somethingchanged = 1;
					
				}
				putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_period", Math.floor(retValue), itemIndex++);
				}else if (6 == selValue) {
				if($("#txtDailyTotalTaffic").val()== ""){
					$("#ltrafficErrorMes").text(jQuery.i18n.prop("lt_trafficSet_Unset"))
					$("#ltrafficErrorMes").show();
					return;
				}
				tselValue = 4;
				retValue = parseFloat($("#txtDailyTotalTaffic").val());
				if (2 == $("#DailyTotaldDataUnitSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#DailyTotaldDataUnitSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}
				if(retValue.toString() != tupper_value_daily){
					somethingchanged = 1;
					
				}
				putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_daily", Math.floor(retValue), itemIndex++);
				}
				
			if(selValue != tstrControlMode){////////////////////jmm
				somethingchanged = 1;
				
				}
			putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_mang_method", itemIndex++);
            putMapElement(mapData, "RGW/statistics/WanStatistics/stat_mang_method", tselValue, itemIndex++);
			
			var twarning_value = $("#twarningvalue_select").val();
			retValue = Math.floor(retValue);
			if(twarning_value == "0")
				WarnValue = parseInt(retValue*1);
			else if(twarning_value == "1")
				WarnValue = parseInt(retValue*0.9);
			else if(twarning_value == "2")
				WarnValue = parseInt(retValue*0.8);
			else if(twarning_value == "3")
				WarnValue = parseInt(retValue*0.7);
			else if(twarning_value == "4")
				WarnValue = parseInt(retValue*0.6);
              if(WarnValue != parseInt(awarning_value)){
			  	somethingchanged = 1;
				
			  } 
			  putMapElement(mapData, "RGW/statistics/WanStatistics/warning_value", WarnValue, itemIndex++);
			if(tselValue == "2"){
				
				
				var startYear = $("#txtPeriodStartYear").val();
                var startMonth = $("#txtPeriodStartMonth").val();
                var startDay = $("#txtPeriodStartDay").val();
				var endYear,endMonth,endDay;
				if(selValue == "3"){
					if(parseInt(startMonth)+3>12){
                endYear =(parseInt(startYear)+1).toString();
                endMonth = ((parseInt(startMonth)+3)%12).toString();
				}else {
				endYear = startYear;
				endMonth = (parseInt(startMonth)+3).toString();
				}
                endDay = startDay;
				}
				else if(selValue == "4"){
               if(parseInt(startMonth)+6>12){
                endYear = (parseInt(startYear)+1).toString();
                endMonth = ((parseInt(startMonth)+6)%12).toString();
				}else {
				endYear = startYear;
				endMonth = (parseInt(startMonth)+6).toString();
				}
                endDay = startDay;
				}
				else {
                endYear =(parseInt(startYear)+1).toString();
                endMonth = startMonth;
                endDay = startDay;
				}
				endYear=endYear.toString()
				var zmstartday=getMaxDayByYearMonth(startYear,startMonth);
				var zmendday=getMaxDayByYearMonth(endYear,endMonth);
				if(zmendday<=endDay)
					endDay=zmendday;
                var strStart = startYear.substr(2, 2) + "," + startMonth + "," + startDay;
                var strEnd = endYear.substr(2, 2) + "," + endMonth + "," + endDay;
				 if (startYear.length != 4 
                    || parseInt(startMonth) < 1 || parseInt(startMonth) > 12 
                    || parseInt(startDay) < 1 || parseInt(startDay) > 31 
                    ||parseInt(startDay)>zmstartday
                    ) {
                    $("#ltrafficErrorMes").text(jQuery.i18n.prop("lTimeFormatError"));
                    $("#ltrafficErrorMes").show();
                    return;
                }
				if(perstart_date != strStart || perend_date != strEnd){
					somethingchanged = 1;
				
				}
				putMapElement(mapData, "RGW/statistics/WanStatistics/period_start_date", strStart, itemIndex++);
				putMapElement(mapData, "RGW/statistics/WanStatistics/period_end_date", strEnd, itemIndex++);
			}
				if(somethingchanged == 1)
				postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
				else 
					return;
});
//

        $("#lt_trafficSet_btnCalMonthTraffic").click(function() {
        //jmm
				if(hard_ver=="Ver.B"||hard_ver=="Ver.C"){
				var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_stat_value_month", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/corrected_value_month", Math.floor(0), 1);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));

           
        		}else{
				sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("TrafficCalTile"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("TrafficCalLable"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#newTrafficSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_stat_value_month", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/corrected_value_month", Math.floor(retValue), 1);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
					 });
			}
			//jmm end
            
        });


        $("#lt_trafficSet_btnCalUnlimitPeriodTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("TrafficCalTile"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("TrafficCalLable"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_stat_value_unlimit", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/corrected_value_unlimit", Math.floor(retValue), 1);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });



        $("#lt_trafficSet_btnCalPeroidTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("TrafficCalTile"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("TrafficCalLable"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#newTrafficSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_stat_value_period", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/corrected_value_period", Math.floor(retValue), 1);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });

        $("#lt_trafficSet_btnCalDailyTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("TrafficCalTile"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("TrafficCalLable"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if(1 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024;
                } else if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                } else {
                    retValue = retValue * 1024 * 1024 * 1024;
                }

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_stat_value_daily", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/corrected_value_daily", Math.floor(retValue), 1);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });
        $("#lt_trafficSet_btnChangeMonthAvalibleTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("MonthAvalibleTrafficSetting"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("MonthAvalibleTraffic"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#newTrafficSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/total_available_month", Math.floor(retValue), 0);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });


        $("#lt_trafficSet_btnChangeUnlimitPeriodAvalibleTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("MonthAvalibleTrafficSetting"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("MonthAvalibleTraffic"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#newTrafficSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/total_avaliable_unlimit", Math.floor(retValue), 0);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });


        $("#lt_trafficSet_btnChangePeroidAvalibleTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("PeriodAvalibleTrafficSetting"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("PeriodAvalibleTraffic"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#newTrafficSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/total_available_period", Math.floor(retValue), 0);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });

         $("#lt_trafficSet_btnChangeDailyAvalibleTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("DailyAvalibleTrafficSetting"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("DailyAvalibleTraffic"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if(1 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024;
                } else if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                } else {
                    retValue = retValue * 1024 * 1024 * 1024;
                }

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/total_available_daily", Math.floor(retValue), 0);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });
	
        $("#lt_trafficSet_btnChangeMonthTotalTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("MonthLimitTrafficSetting"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("MonthLimitTraffic"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#newTrafficSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_upper_range_value", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_month", Math.floor(retValue), 1);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });

        $("#lt_trafficSet_btnChangePeroidTotalTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("PeriodLimitTrafficSetting"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("PeriodLimitTraffic"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#newTrafficSel").val()){
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_upper_range_value", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_period", Math.floor(retValue), 1);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });


        $("#lt_trafficSet_btnChangeUnlimitPeriodTotalTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("PeriodLimitTrafficSetting"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("PeriodLimitTraffic"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                }
                else if (3 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024 * 1024;
                }else{
					retValue = retValue * 1024;
				}

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_upper_range_value", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_unlimit", Math.floor(retValue), 1);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });



        $("#lt_trafficSet_btnChangePeroidTime").click(function() {
            sm("divPeriodTimeSetting", 450, 100);
            $("#lt_trafficSet_stcPeriodTimeSetting").text(jQuery.i18n.prop("lt_trafficSet_stcPeriodTimeSetting"));
            $("#lt_trafficSet_stcNewPeriodTime").text(jQuery.i18n.prop("lt_trafficSet_stcNewPeriodTime"));
            $("textfield1").click(function() {
                $("#lErrorLogs").hide();
            });
			var periedtime=$("#trafficSetingSel").val();
            $("#lt_trafficSet_btnNewPeroidTime").click(function() {
                var startYear = $("#txtNewPeriodStartYear").val();
                var startMonth = $("#txtNewPeriodStartMonth").val();
                var startDay = $("#txtNewPeriodStartDay").val();
				var endYear,endMonth,endDay;
				if(periedtime == "3"){
					if(parseInt(startMonth)+3>12){
                endYear = parseInt(startYear)+1;
                endMonth = (parseInt(startMonth)+3)%12;
				}else {
				endYear = startYear;
				endMonth = parseInt(startMonth)+3;
				}
                endDay = startDay;
				}
				else if(periedtime == "4"){
               if(parseInt(startMonth)+6>12){
                endYear = parseInt(startYear)+1;
                endMonth = (parseInt(startMonth)+6)%12;
				}else {
				endYear = startYear;
				endMonth = parseInt(startMonth)+6;
				}
                endDay = startDay;
				}
				else {
                endYear = parseInt(startYear)+1;
                endMonth = startMonth;
                endDay = startDay;
				}
				endYear=endYear.toString()
				var zmstartday=getMaxDayByYearMonth(startYear,startMonth);
				var zmendday=getMaxDayByYearMonth(endYear,endMonth);
				if(zmendday<endDay)
					endDay=parseInt(zmendday);
                var strStart = startYear.substr(2, 2) + "," + startMonth + "," + startDay;
                var strEnd = endYear.substr(2, 2) + "," + endMonth + "," + endDay;

                if (startYear.length != 4 
                    || parseInt(startMonth) < 1 || parseInt(startMonth) > 12 
                    || parseInt(startDay) < 1 || parseInt(startDay) > 31 
                    ||parseInt(startDay)>zmstartday
                    ) {
                    $("#lErrorLogs").text(jQuery.i18n.prop("lTimeFormatError"));
                    $("#lErrorLogs").show();
                    return;
                }

                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_stat_period", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/period_start_date", strStart, 1);
                putMapElement(mapData, "RGW/statistics/WanStatistics/period_end_date", strEnd, 2);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });

	$("#lt_trafficSet_btnChangeDailyTotalTraffic").click(function() {
            sm("divTrafficSetting", 450, 100);
            $("#lt_trafficSet_stcTrafficSettingTitle").text(jQuery.i18n.prop("DailyLimitTrafficSetting"));
            $("#lt_trafficSet_stcTrafficSettingLabel").text(jQuery.i18n.prop("DailyLimitTraffic"));

            $("#lt_trafficSet_btnNewTraffic").click(function() {
                var retValue = parseFloat($("#txtNewTrafficData").val());
                if(1 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024;
                } else if (2 == $("#newTrafficSel").val()) {
                    retValue = retValue * 1024 * 1024;
                } else {
                    retValue = retValue * 1024 * 1024 * 1024;
                }
				if(retValue > g_dailyAvailbleTraffic){
					alert("Limit traffic must be smaller than the available traffic!");
					return;
				}
			
                var mapData = new Array();
                putMapElement(mapData, "RGW/statistics/WanStatistics/set_action", "set_upper_range_value", 0);
                putMapElement(mapData, "RGW/statistics/WanStatistics/upper_value_daily", Math.floor(retValue), 1);
                postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            });
        });
	



        this.onPost = function() {
        }

        this.onPostSuccess = function() {
            this.onLoad();
        }

        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }

        return this;

    }
})(jQuery);

