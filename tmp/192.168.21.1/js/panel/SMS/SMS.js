var phoneNumberList = null;
(function($) {
    $.fn.objSms = function(InIt) {
        var xmlName = "";
        var SMS_NUMBER_PAGE = 10;
        var menuId = "";
        var memStore = "";
        var tags = "";
        var QueryReportTryCount = 0;
        var QuerySmsCmdTryCount = 0;
		//var hard_ver = getHardware_Version();
        $("#Content").html(callProductHTML("html/SMS/SMS.html"));
		/*if(hard_ver == "Ver.B"){//zmi jp
			$("#lt_sms_btnNew").hide();
			$("#lt_sms_btnSend").hide();
		}*/

        var _simxml = callProductXML("wan");
        if ("0" == $(_simxml).find("sim_status").text()) {
            g_bSimCardExist = true;
        } else    {
            g_bSimCardExist = false;
        }

        function SetLocation() {
            $("[id^='lt_sms_stc']").each(function() {
                $(this).text(jQuery.i18n.prop($(this).attr("id")));
            });
            $("[id^='lt_sms_btn']").each(function() {
                $(this).val(jQuery.i18n.prop($(this).attr("id")));
            });

            if ("mDeviceInbox" == menuId || "mDeviceOutbox" == menuId) {
                $("#lt_sms_stcmeumove").text(jQuery.i18n.prop("lt_sms_stcmeumovetosim"));
                $("#lt_sms_stcmeucopy").text(jQuery.i18n.prop("lt_sms_stcmeucopytosim"));
                $("#lt_sms_btnCopy").val(jQuery.i18n.prop("lt_sms_stcmeucopytosim"));
                $("#lt_sms_btnMove").val(jQuery.i18n.prop("lt_sms_stcmeumovetosim"));

            }
            if ("mSimSms" == menuId) {
                $("#lt_sms_stcmeumove").text(jQuery.i18n.prop("lt_sms_stcmeumovetolocal"));
                $("#lt_sms_stcmeucopy").text(jQuery.i18n.prop("lt_sms_stcmeucopytolocal"));
                $("#lt_sms_btnCopy").val(jQuery.i18n.prop("lt_sms_stcmeucopytolocal"));
                $("#lt_sms_btnMove").val(jQuery.i18n.prop("lt_sms_stcmeumovetolocal"));
            }

            if ("mDrafts" == menuId) {
                $("#lt_sms_btnCopy").val(jQuery.i18n.prop("lt_sms_stcmeucopytosim"));
                $("#lt_sms_btnMove").val(jQuery.i18n.prop("lt_sms_stcmeumovetosim"));
            }

            if ("mDeviceOutbox" == menuId) {
                $("#lt_sms_stcFrom").text(jQuery.i18n.prop("lsmsReceiver"));
            }


            $("#lt_sms_stcTitle").text(jQuery.i18n.prop(menuId));
            //     $("#sendNumberList").val(jQuery.i18n.prop("lt_sms_chooseNumberTip"));
            $("#forwardSmsImg").attr("title", jQuery.i18n.prop("lt_sms_forwardSmsTip"));
            $("#deletSmsImg").attr("title", jQuery.i18n.prop("lt_sms_deleteSmsTip"));
            $("#lt_sms_btnNew").attr("title", jQuery.i18n.prop("lt_sms_newSmsTip"));
            $("#lt_sms_btnDelete").attr("title", jQuery.i18n.prop("lt_sms_deleteSmsTip"));
        }

        function AddSmsToList(From, Subject, SubjectUniCode,recvTime, Status, id,messageType) {
            var showSubject = Subject;
            if (Subject.length > 40) {
                showSubject = Subject.substr(0, 35) + "..." ;
            }

            showSubject=showSubject.replace(/</ig,"&lt");
            showSubject=showSubject.replace(/>/ig,"&gt");
			showSubject=showSubject.replace(/[ ]/g,"&nbsp"); //处理多个连续空格问题

            var contact = "";
            if (From.indexOf(";") == 0) {
                contact = From.substr(1, From.length - 1);
            } else {
                contact = From.substr(0, From.indexOf(";"));
            }

            var statusLtTipId = "";
            var imgSrc = "";
            switch (Status) {
                case "0":
                    statusLtTipId = "lt_sms_unreadSms";
                    imgSrc = "unreadSms.png";
                    break;
                case "1":
                    statusLtTipId = "lt_sms_readedSms";
                    imgSrc = "readedSms.png";
                    break;
                case "2":
                    statusLtTipId = "lt_sms_sendFailed";
                    imgSrc = "SmssendFailed.png";
                    break;
                case "3":
                    statusLtTipId = "lt_sms_sendSuccess";
                    imgSrc = "SendSmsSuccess.png";
                    break;
                case "4":
                    statusLtTipId = "lt_sms_drafts";
                    imgSrc = "drafts.png";
                    break;
                default:
                    break;
            }

            var htmlText ;
            if(0 == messageType) {
                htmlText = "<tr style=\"background-color: rgb(255, 255, 255);\" id=\"" + id + "\" name=\"" + SubjectUniCode + "\">"
                           + "<td style=\"cursor: pointer;\"><span name=\"" + From + "\">" + contact + "</span></td>"
                           + "<td style=\"cursor: pointer;\"><span>" + showSubject + "</span></td>"
                           + "<td><span>" + recvTime + "</span></td>"
                           + "<td style=\"cursor: pointer;\"> <img align=\"middle\" src=\"images/" + imgSrc + "\" title=\"" + jQuery.i18n.prop(statusLtTipId) + "\"/></td>"
                           + "<td><input align=\"right\" type=\"checkbox\" class=\"chk11 delCheckBox\"/></td></tr>";
            } else {
                htmlText = "<tr style=\"background-color: rgb(255, 255, 255);\" id=\"" + id + "\" name=\"" + SubjectUniCode + "\">"
                           + "<td style=\"cursor: pointer;\"><span name=\"" + From + "\">" + contact + "</span></td>"
                           + "<td style=\"background:#80BFFF;cursor: pointer;\"><span  style=\"\">" + showSubject + "</span></td>"
                           + "<td><span>" + recvTime + "</span></td>"
                           + "<td style=\"cursor: pointer;\"> <img align=\"middle\" src=\"images/" + imgSrc + "\" title=\"" + jQuery.i18n.prop(statusLtTipId) + "\"/></td>"
                           + "<td><input align=\"right\" type=\"checkbox\" class=\"chk11 delCheckBox\"/></td></tr>";
            }


            $("#smsListInfo").append(htmlText);



            $(".delCheckBox:last").click(function() {
                if ($(".delCheckBox:checked").length == $(".delCheckBox").length) {
                    $("#deleteAllSms").prop("checked", true);
                } else {
                    $("#deleteAllSms").prop("checked", false);
                }
                if ($(".delCheckBox:checked").length >= 1)
                    RefreshButton(true);
                else
                    RefreshButton(false);

            });

            $("#deletSmsImg").click(function(event) {

                var deleteSmsId = $(this).attr("name");
                var mapData = new Array();
                var itemIndex = 0;

                putMapElement(mapData, "RGW/message/flag/message_flag", "DELETE_SMS", itemIndex++);
                putMapElement(mapData, "RGW/message/flag/sms_cmd", "6", itemIndex++);
                putMapElement(mapData, "RGW/message/get_message/tags", tags, itemIndex++);
                putMapElement(mapData, "RGW/message/get_message/mem_store", memStore, itemIndex++);
                putMapElement(mapData, "RGW/message/set_message/delete_message_id", deleteSmsId, itemIndex++);

                QuerySmsCmdTryCount = 0;
                PostXMLWithResponse(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),QuerySmsCmdStatus);             


            });

            $("tr:last td").click(function(event) {
                if ($(event.target).parents("td:first").css("cursor") != "pointer"
                    && $(event.target).css("cursor") != "pointer") {
                    return;
                }

                var smsId = $(event.target).parents("tr:first").attr("id");
                if (-1 != $(event.target).parents("tr:first").children("td:eq(3)").children("img:first").attr("src").indexOf("unreadSms.png")) {
                    var mapData = new Array();
                    var itemIndex = 0;

                    putMapElement(mapData, "RGW/message/flag/message_flag", "SET_MSG_READ", itemIndex++);
                    putMapElement(mapData, "RGW/message/flag/sms_cmd", "7", itemIndex++);
                    putMapElement(mapData, "RGW/message/get_message/tags", tags, itemIndex++);
                    putMapElement(mapData, "RGW/message/get_message/mem_store", memStore, itemIndex++);
                    putMapElement(mapData, "RGW/message/set_message/read_message_id", smsId, itemIndex++);

                   PostSyncXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));

                    //                    var smsCmdStatusRet = $(xml).find("sms_cmd_status_result").text();
                    //                    if ("1" == smsCmdStatusRet) {
                    //                        QuerySmsCmdStatus("7");
                    //                    }
                    //                    else if ("2" == smsCmdStatusRet) {
                    //                        alert("Failed");
                    //                    }
                    //                    else if ("3" == smsCmdStatusRet) {
                    //                        $(event.target).parents("tr:first").children("td:eq(3)").children("img:first").attr("src", "images/readedSms.png");
                    //                    }

                }
                $("#lt_sms_meuRightClick").hide();
                $("#divSmsList").hide();
                $("#divSmsChatRoom").show();
                $(".search-choice").remove();
                $("#divRecvSmsContent").show();
                $("#txtSmsContent").val("");

                var contactInfo = $(event.target).parents("tr:first").children("td:first").children("span:first").attr("name");
                var contacts;
                if (contactInfo.indexOf(";") == 0) {
                    contacts = contactInfo.substr(1, contactInfo.length - 1);
                } else {
                    contacts = contactInfo.replace(";", "/");
                }

                var smsContents = UniDecode($(event.target).parents("tr:first").attr("name"));

                if (menuId == "mDrafts") {
                    $("#lt_sms_spanSend").show();
                    $("#divNewSmsContent").show();
                    $("#divRecvSmsContent").hide();
                    $("#txtSmsContent").val(smsContents);
                    $("#txtSmsContent").attr("name", smsId); //保存SMS ID

                    var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;

                    var msgLen = smsContents.length;
                    var charCount, itemCount;
                    if (!IsGSM7Code(smsContents)) {
                        charCount = "(" + msgLen + "/70)";
                        if (msgLen <= 70) {
                            itemCount = 1;
                        } else {
                            itemCount = Math.floor(msgLen / 67 + (msgLen % 67 > 0 ? 1 : 0)); //长短信每条短信只有67个字符
                        }
                    } else { //english
                        if (msgLen <= 160) {
                            itemCount = 1;
                        } else {
                            itemCount = Math.floor(msgLen / 153 + (msgLen % 153 > 0 ? 1 : 0)); //长短信每条短信只有153个字符
                        }
                        charCount = "(" + msgLen + "/160)";
                    }

                    $("#inputcount").text(charCount);
                    $("#inputItemCount").text("(" + itemCount + "/1)");
                    //
                    if(-1 != contacts.indexOf ("/"))
                    {
                        contacts = contacts.substr(contacts.indexOf ("/")+1);
                    }
                    $("#sendNumberList").val(contacts);
                } else {
                    smsContents=smsContents.replace(/</ig,"&lt");
                    smsContents=smsContents.replace(/>/ig,"&gt");
					smsContents=smsContents.replace(/[ ]/g,"&nbsp");
                    smsContents = EditHrefs(smsContents);		
		

                    var time = $(event.target).parents("tr:first").children("td:eq(2)").children("span:first").text();
                    var contactHtmlText = "<li class=\"search-choice\"><span>" + contacts + "</span></li>";

                    $("#chosen-search-field-input").before(contactHtmlText);
                    $("#txtRecvSmsContent").html(smsContents);
                    $("#txtRecvSmsContent").attr("name", smsId); //保存SMS ID
                    document.getElementById("recvSmsTimeImg").innerHTML = time;
                    $("#chosen-search-field-input").hide();
                    $("#lt_sms_spanSend").show();
                }
            });
        }

        function InitSmsPageNum(totalPageNum) {
            $("#divSmsPageNum").empty();
            for (var idx = 1; idx <= totalPageNum; ++idx) {
                var htmlTxt = "<a style=\"color: red; font-weight: 700; text-decoration: underline;margin-left:3px;cursor:pointer;\" href=\"##\">" + idx + "</a>";
                $("#divSmsPageNum").append(htmlTxt);
            }
        }


        $("#divSmsPageNum").click(function(event) {
            if ($(event.target).is("a")) {
                $(event.target).css("color", "blue");
                $(event.target).addClass("pageSelIdx");
                $(event.target).siblings().css("color", "red");
                $(event.target).siblings().removeClass("pageSelIdx");
                var smsPageIdx = $(event.target).text();
                $("#deleteAllSms").prop("checked", false);
                UpdateSmsList(smsPageIdx, false);
            }
        });




        function GetSmsXmlInfo(messageFlag, pageNumber) {
            var mapData = new Array();
            var itemIndex = 0;

            putMapElement(mapData, "RGW/message/flag/message_flag", messageFlag, itemIndex++);
            putMapElement(mapData, "RGW/message/get_message/page_number", pageNumber, itemIndex++);
            PostSyncXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
            return GetSmsXML(xmlName);
        }

        function UpdateSmsList(pageNumber, bInitFlag) {
            $("#smsListInfo").empty();
            var messageFlag = "";
            switch (menuId) {
                case "mDeviceInbox":
                    messageFlag = "GET_RCV_SMS_LOCAL";
                    memStore = "1";
                    tags = "12";
                    break;
                case "mDeviceOutbox":
                    messageFlag = "GET_SENT_SMS_LOCAL";
                    memStore = "1";
                    tags = "2";
                    break;
                case "mSimSms":
                    messageFlag = "GET_SIM_SMS";
                    memStore = "0";
                    break;
                case "mDrafts":
                    messageFlag = "GET_DRAFT_SMS";
                    memStore = "2";
                    tags = "2";
                    break;
                default:
            }

            var xml = GetSmsXmlInfo(messageFlag, pageNumber);
            if (bInitFlag) {

                var smsNvTotal = parseInt($(xml).find("sms_nv_total").text());
                var smsSimTotal = parseInt($(xml).find("sms_sim_total").text());

                var smsSimNum = parseInt($(xml).find("sms_sim_num").text());

                var smsNvRecvTotal = parseInt($(xml).find("sms_nv_rev_total").text());
                var smsNvSendTotal = parseInt($(xml).find("sms_nv_send_total").text());
                var smsNvDraftTotal = parseInt($(xml).find("sms_nv_draftbox_total").text());
                var smsNvRecvNum = parseInt($(xml).find("sms_nv_rev_num").text());
                var smsNvSendNum = parseInt($(xml).find("sms_nv_send_num").text());
                var smsNvDraftNum = parseInt($(xml).find("sms_nv_draftbox_num").text());

                if (menuId == "mDeviceInbox" && smsNvRecvNum > smsNvRecvTotal) {
                    showMsgBox(jQuery.i18n.prop("lsmsWarning"), jQuery.i18n.prop("lDeviceInboxCapacityFull"));
                }

                if (menuId == "mDeviceOutbox" && smsNvRecvNum > smsNvRecvTotal) {
                    showMsgBox(jQuery.i18n.prop("lsmsWarning"), jQuery.i18n.prop("lDeviceOutboxCapacityFull"));
                }

                if (menuId == "mDrafts" && smsNvRecvNum > smsNvRecvTotal) {
                    showMsgBox(jQuery.i18n.prop("lsmsWarning"), jQuery.i18n.prop("lDeviceDraftboxCapacityFull"));
                }

                if (menuId == "mSimSms" && smsSimNum >= smsSimTotal) {
                    showMsgBox(jQuery.i18n.prop("lsmsWarning"), jQuery.i18n.prop("lSimCardCapacityFull"));
                }

                if ($(xml).find("total_number").text() == "") {
                    return;
                }
                var smsPageNum = parseInt($(xml).find("total_number").text());

                InitSmsPageNum(smsPageNum);
                var SelPage = pageNumber - 1;
                var $Selector = "#divSmsPageNum a:eq(" + SelPage + ")";
                //                $("#divSmsPageNum a:first").css("color", "blue");
                //                $("#divSmsPageNum a:first").addClass("pageSelIdx");
                $($Selector).css("color", "blue");
                $($Selector).siblings().css("color", "red");
                $($Selector).addClass("pageSelIdx");
                $($Selector).siblings().removeClass("pageSelIdx");
            }


            $(xml).find("message_list").each(function() {
                $(this).find("Item").each(function() {
                    var status = $(this).find("status").text();

                    var subjectUnicode = $(this).find("subject").text();
                    var content = UniDecode(subjectUnicode);
					//content = ReplaceBlackSpace(content);
                    var from = UniDecode($(this).find("from").text());

                    var recvTime = $(this).find("received").text();
                    var date = new Array();
                    date = recvTime.split(",");
                    var len = date.length;

                    for (var i = 0; i < len - 1; i++) { //the last one is timezone , no need to handle
                        if (date[i] < 10 && date[i].length < 2)// add 0 if number is smaller than 10
                            date[i] = "0" + date[i];
                    }

                    var messageType = $(this).find("message_type").text();

                    var formatTime = date[0] + "/" + date[1] + "/" + date[2] + " " + date[3] + ":" + date[4] + ":" + date[5]; //month/day/year hh:mm:ss

                    AddSmsToList(from, content,subjectUnicode, formatTime, status, $(this).find("index").text(),messageType);

                });
            });


            var selID = GetSelSmsId();
            if ("" == selID)
                RefreshButton(false);
            else
                RefreshButton(true);

        }

        function RefreshButton(enable) {

            if (enable) {

                $("#lt_sms_btnDelete").prop("disabled", false);
                $("#lt_sms_btnCopy").prop("disabled", false);
                $("#lt_sms_btnMove").prop("disabled", false);
                $("#lt_sms_btnDelete").parent(".btnWrp:first").removeClass("disabledBtn");
                $("#lt_sms_btnCopy").parent(".btnWrp:first").removeClass("disabledBtn");
                $("#lt_sms_btnMove").parent(".btnWrp:first").removeClass("disabledBtn");
            } else {
                $("#lt_sms_btnDelete").prop("disabled", true);
                $("#lt_sms_btnCopy").prop("disabled", true);
                $("#lt_sms_btnMove").prop("disabled", true);
                $("#lt_sms_btnDelete").parent(".btnWrp:first").addClass("disabledBtn");
                $("#lt_sms_btnCopy").parent(".btnWrp:first").addClass("disabledBtn");
                $("#lt_sms_btnMove").parent(".btnWrp:first").addClass("disabledBtn");

            }

        }


        function QuerySmsCmdStatus(retData) {
            $("#deleteAllSms").prop("checked", false);
            var _xml = getData("message");
            if (null == _xml) {
                QuerySmsCmdTryCount++;
                setTimeout(QuerySmsCmdStatus, 1500);
                return;
            }
            if (QuerySmsCmdTryCount > 10) {
                alert("Failed");
                return;
            }
            var smsCmdStatusRet = $(_xml).find("sms_cmd_status_result").text();
            var smsCmd = $(_xml).find("sms_cmd").text();


            if ("9" == smsCmdStatusRet) { //部分失败
                if ("8" == smsCmd)//COPY
                    showMsgBox(jQuery.i18n.prop("lOperateMessageReportTitle"), jQuery.i18n.prop("lCopyMessagePartialFailed"));
                else if ("9" == smsCmd)//move
                    showMsgBox(jQuery.i18n.prop("lOperateMessageReportTitle"), jQuery.i18n.prop("lMoveMessagePartialFailed"));
            } else  if ("3" != smsCmdStatusRet) { //failed
                if ("5" == smsCmd) //save
                    showMsgBox(jQuery.i18n.prop("lOperateMessageReportTitle"), jQuery.i18n.prop("lSaveMessageFailed"));
                else if ("6" == smsCmd)//delete
                    showMsgBox(jQuery.i18n.prop("lOperateMessageReportTitle"), jQuery.i18n.prop("lDeleteMessageFailed"));
                else if ("8" == smsCmd)//COPY
                    showMsgBox(jQuery.i18n.prop("lOperateMessageReportTitle"), jQuery.i18n.prop("lCopyMessageFailed"));
                else if ("9" == smsCmd)//move
                    showMsgBox(jQuery.i18n.prop("lOperateMessageReportTitle"), jQuery.i18n.prop("lMoveMessageFailed"));
                return;
            }

            //var totalSmsPage = parseInt($(_xml).find("total_number").text());
            var curpage = $("#divSmsPageNum .pageSelIdx").text();

            if (5 == smsCmd) {//save drafts
                $("#divSmsChatRoom").hide();
                $("#divSmsList").show();
                UpdateSmsList(1, true);
            } else if (6 == smsCmd || 9 == smsCmd) { //delete,move
                /* if (curpage <= totalSmsPage) {
                     UpdateSmsList(curpage, true);
                 } else {
                     UpdateSmsList(totalSmsPage, true);
                 }*/
                UpdateSmsList(1, true);
            } else if (8 == smsCmd) { //copy
                $("#deleteAllSms").prop("checked", false);
                $(".delCheckBox").prop("checked", false);
            }
        }


        function QuerySmsReport() {
            var _xml = getData("message");
            $(_xml).find("sms_report_status_list").each(function() {
                if ($(this).find("Item").length == 0 && ++QueryReportTryCount < 5) {
                    setTimeout(QuerySmsReport, 4000);
                } else if ($(this).find("Item").length > 0) {
                    var recvSuccessNumber = "";
                    var recvFailNumber = "";
                    $(this).find("Item").each(function() {
                        var phoneNumber = $(this).find("submit_num").text();
                        if (1 == $(this).find("status").text()) {
                            recvSuccessNumber = recvSuccessNumber + phoneNumber + ";";
                        } else {
                            recvFailNumber = recvFailNumber + phoneNumber + ";";
                        }
                    });
                    var msg = "";
                    if ("" != recvSuccessNumber) {
                        msg = msg + recvSuccessNumber.substr(0, recvSuccessNumber.length - 1) + " " + jQuery.i18n.prop("lMessageReportSuccessReceive");
                    }
                    if ("" != recvFailNumber) {
                        msg = msg + recvFailNumber.substr(0, recvFailNumber.length - 1) + " " + jQuery.i18n.prop("lMessageReportFailedReceive");
                    }
                    showMsgBox(jQuery.i18n.prop("lMessageReportTitle"), msg);
                }
            });
        }

        function QuerySmsSendResult(retData) {
            var _xml = getData("message");
            if (null == _xml) {
                QueryReportTryCount++;
                setTimeout(QuerySmsSendResult(), 2000);
                return;
            }

            $("#divSmsList").show();
            $("#divSmsChatRoom").hide();
            if ("3" == $(_xml).find("sms_cmd_status_result").text()) { //成功
                hm();
            } else {     //失败
                showMsgBox(jQuery.i18n.prop("lOperateMessageReportTitle"), jQuery.i18n.prop("lSendMessageFailed"));
                return;
            }

            var curpage = $("#divSmsPageNum .pageSelIdx").text();
            UpdateSmsList(curpage, true);

            if ("1" == $(_xml).find("status_report").text()) {
                QueryReportTryCount = 0;
                QuerySmsReport();
            }
        }


        function SendSms() {
            var phoneNumber = GetSmsNumberList();
            if ("" == phoneNumber) {
                document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "inline";
                $("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lContactIsEmpty"));
                return;
            } else {
                document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "none";
            }

			for(var idx = 0; idx < phoneNumber.split(",").length; ++idx){
				if("" != phoneNumber.split(",")[idx] && !IsPhoneNumber(phoneNumber.split(",")[idx])){
					document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "inline";
                	$("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lPhoneNumberFormatError"));
                	return;
				}				
			}

			

            var ChineseCharacterPatrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
            var messageBody;

            var mapData = new Array();
            var itemIndex = 0;

             messageBody = $("#txtSmsContent").val();
            if (menuId == "mDrafts") {               
                var smsId = $("#txtSmsContent").attr("name") + ",";
                putMapElement(mapData, "RGW/message/send_save_message/send_from_draft_id", smsId, itemIndex++);
            } 

            /*if("" == messageBody) {
                document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "inline";
                $("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lSmsIsEmpty"));
                return;
            }*/

			var encodeType = "UNICODE";
            if(IsGSM7Code(messageBody)) {
                encodeType = "GSM7_default";
				 if (messageBody.length > 70) {
                    $("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lt_sms_stcSmsLenghtError"));
                    document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "inline";
                    return;
                }
            }
			else{
				if (messageBody.length > 160) {
                    $("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lt_sms_stcSmsLenghtError"));
                    document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "inline";
                    return;
                }
			}


                    

            putMapElement(mapData, "RGW/message/flag/message_flag", "SEND_SMS", itemIndex++);
            putMapElement(mapData, "RGW/message/flag/sms_cmd", "4", itemIndex++);
            putMapElement(mapData, "RGW/message/send_save_message/contacts", phoneNumber, itemIndex++);
            putMapElement(mapData, "RGW/message/send_save_message/content", UniEncode(messageBody), itemIndex++);
            putMapElement(mapData, "RGW/message/send_save_message/encode_type", encodeType, itemIndex++);
            putMapElement(mapData, "RGW/message/send_save_message/sms_time", GetSmsTime(), itemIndex++);

            PostXMLWithResponse(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),QuerySmsSendResult);

            //setTimeout(QuerySmsSendResult, 2000);
        }



        $("#lt_sms_btnSaveDraft").click(function() {

            var messageBody, smsId;
            var bEditDraftFlag = false;

            var phoneNumber = GetSmsNumberList();
            if ("" == phoneNumber) {
                document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "inline";
                $("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lContactIsEmpty"));
                return;
            } else {
                document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "none";
            }

            if ($("#divNewSmsContent").is(":visible")) { //new add draft
                messageBody = $("#txtSmsContent").val();
            } else { //edit draft
                messageBody = $("#txtRecvSmsContent").html();
                smsId = $("#txtRecvSmsContent").attr("name");
                bEditDraftFlag = true;
            }

            var encodeType = "UNICODE";
			if(IsGSM7Code(encodeType))
			{
				encodeType = "GSM7_default";
			}
           

            if( ("UNICODE" == encodeType && messageBody.length > 70) || ("GSM7_default" == encodeType && messageBody.length > 160)) {
                document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "inline";
                $("#lt_sms_stcSmsErrorInfo").text(jQuery.i18n.prop("lSaveSmsError"));
                return;
            }


            var mapData = new Array();
            var itemIndex = 0;

            putMapElement(mapData, "RGW/message/flag/message_flag", "SAVE_SMS", itemIndex++);
            putMapElement(mapData, "RGW/message/flag/sms_cmd", "5", itemIndex++);
            putMapElement(mapData, "RGW/message/get_message/tags", "11", itemIndex++);
            putMapElement(mapData, "RGW/message/get_message/mem_store", "1", itemIndex++);
            putMapElement(mapData, "RGW/message/send_save_message/contacts", phoneNumber, itemIndex++);
            putMapElement(mapData, "RGW/message/send_save_message/content", UniEncode(messageBody), itemIndex++);
            putMapElement(mapData, "RGW/message/send_save_message/encode_type", encodeType, itemIndex++);
            putMapElement(mapData, "RGW/message/send_save_message/sms_time", GetSmsTime(), itemIndex++);
            if (bEditDraftFlag) {
                putMapElement(mapData, "RGW/message/send_save_message/edit_draft_id", smsId, itemIndex++);
            }

            QuerySmsCmdTryCount = 0;
            PostXMLWithResponse(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),QuerySmsCmdStatus);

        });




        $("#lt_sms_btnSend").click(function() {

            // there is no simcard
            if (!g_bSimCardExist) {
                showAlert(jQuery.i18n.prop("lsmsSimCardAbsent"));
                return;
            }
            /* if (!g_bNetworkConnected) {
                 showAlert(jQuery.i18n.prop("lsmsNoWirelessNetwork"));
                 return;

             }*/

            SendSms();


        });

        function GetAllSmsId() {
            var smsIdSet = "";
            $("tbody tr").each(function() {
                smsIdSet = smsIdSet + this.id + ";";
            });
            return smsIdSet;
        }

        function GetSelSmsId() {
            var smsIdSet = "";
            $(".delCheckBox:checked").each(function() {
                smsIdSet = smsIdSet + $(this).parents("tr:first").attr("id") + ",";
            });
            return smsIdSet;
        }

        function DeleteSms() {
            var deleteSmsId = GetSelSmsId();
            var mapData = new Array();
            var itemIndex = 0;

            putMapElement(mapData, "RGW/message/flag/message_flag", "DELETE_SMS", itemIndex++);
            putMapElement(mapData, "RGW/message/flag/sms_cmd", "6", itemIndex++);
            putMapElement(mapData, "RGW/message/get_message/tags", tags, itemIndex++);
            putMapElement(mapData, "RGW/message/get_message/mem_store", memStore, itemIndex++);
            putMapElement(mapData, "RGW/message/set_message/delete_message_id", deleteSmsId, itemIndex++);

            QuerySmsCmdTryCount = 0;
            PostXMLWithResponse(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),QuerySmsCmdStatus);

        }

        $("#lt_sms_btnDelete").click(function() {
            DeleteSms();
        });


        $("#sendNumberList").click(function() {
            if (jQuery.i18n.prop("lt_sms_chooseNumberTip") == $("#sendNumberList").val()) {
                $("#sendNumberList").val("");
            }
        });

        $("#sendNumberList").mouseup(function(event) {
            if ($(event.target).parents("#chosenUserSelectDiv").length == 0) {
                $("#chosenUserSelectDiv").hide();
            }
        });



        $("#txtSmsContent").keyup(function() {
            $("#lt_sms_stcSmsErrorInfo").hide();
            var messageBody = $("#txtSmsContent").val();
           // var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;

            var msgLen = messageBody.length;
            var charCount, itemCount;
            if (!IsGSM7Code(messageBody)) {
                if (msgLen > 70) {
                    document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "inline";
                    $("#txtSmsContent").val(messageBody.substr(0, 70));
                    msgLen = 70;
                }
                charCount = "(" + msgLen + "/70)";
                if (msgLen <= 70) {
                    itemCount = 1;
                } else {
                    itemCount = Math.floor(msgLen / 67 + (msgLen % 67 > 0 ? 1 : 0));
                }

            } else { //english
                if (msgLen > 160) {
                    document.getElementById("lt_sms_stcSmsErrorInfo").style.display = "inline";
                    $("#txtSmsContent").val(messageBody.substr(0, 160));
                    msgLen = 160;
                }
               /* var specString = "^{}\\[]~|";
                for (var idx = 0; idx < messageBody.length; ++idx) {
                    if (-1 != specString.indexOf(messageBody[idx])) {
                        ++msgLen;
                    }
                }*/
                if (msgLen <= 160) {
                    itemCount = 1;
                } else {

                   /* if (-1 != specString.indexOf(messageBody[152])) {
                        ++msgLen;
                    }*/
                    itemCount = Math.floor(msgLen / 153 + (msgLen % 153 > 0 ? 1 : 0));
                }

                charCount = "(" + msgLen + "/160)";
            }

            $("#inputcount").text(charCount);
            $("#inputItemCount").text("(" + itemCount + "/1)");

        });

        function GetSmsNumberList() {
            var phoneNumber = "";
            $(".chzn-container .chzn-choices .search-choice").each(function() {
                var contactPersonInfo = $(this).children("span").text();
                var number;
                if (-1 != contactPersonInfo.indexOf("/")) {
                    number = contactPersonInfo.substr(contactPersonInfo.indexOf("/") + 1);
                } else {
                    number = contactPersonInfo;
                }
                phoneNumber = phoneNumber + number + ";";
            });

            if ($("#sendNumberList").is(":visible")) {
                phoneNumber += $("#sendNumberList").val();
            }

            if (";" != phoneNumber.charAt(phoneNumber.length - 1)) {
                phoneNumber = phoneNumber + ";"
            }

            if (phoneNumber.indexOf(";") == phoneNumber.length - 1) {
                phoneNumber = phoneNumber.substr(0, phoneNumber.length - 1);
            }
            phoneNumber = phoneNumber.replace(new RegExp(";", "gm"), ",");

            return phoneNumber;
        }

        $("#sendNumberList").dblclick(function() {

            if (phoneNumberList.length == 0) {
                return;
            }
            $("#chosenUserSelectDiv").show();
            $("#chosenUserSelect").empty();

            //test code to load contacts list
            for (var idx = 0; idx < phoneNumberList.length; ++idx) {
                var phoneInfo = phoneNumberList[idx];

                var pbmNumber = phoneInfo.split("/")[1];
                var pbmName = phoneInfo.split("/")[0];
                var optionNodeText = "<option value=\"" + pbmNumber + "\">" + pbmName + "/" + pbmNumber + "</option>";
                $("#chosenUserSelect").append(optionNodeText);
            }
        });

        $("#chosenUserSelect").dblclick(function() {
            var phoneInfo = $("#chosenUserSelect").find("option:selected").text();
            var number = phoneInfo.substring(phoneInfo.indexOf("/") + 1);

            var allNumber = $("#sendNumberList").val();
            if ("" == allNumber) {
                allNumber = number;
            } else {
                allNumber = allNumber + ";" + number;
            }

            $("#sendNumberList").val(allNumber);
            $("#chosenUserSelectDiv").hide();
        });


        function RefreshDeleteBtn(bDisabledBtn) {
            if(bDisabledBtn) {
                $("#lt_Phonebook_btnDelete").prop("disabled", true);
                $("#lt_Phonebook_btnDelete").parent(".btnWrp:first").addClass("disabledBtn");

            } else {
                $("#lt_Phonebook_btnDelete").prop("disabled", false);
                $("#lt_Phonebook_btnDelete").parent(".btnWrp:first").removeClass("disabledBtn");

            }
        }
        

        function ClearAllSMS() {
            var deleteSmsId = GetAllSmsId();
            var mapData = new Array();
            var itemIndex = 0;

            putMapElement(mapData, "RGW/message/flag/message_flag", "DELETE_SMS", itemIndex++);
            putMapElement(mapData, "RGW/message/flag/sms_cmd", "6", itemIndex++);
            putMapElement(mapData, "RGW/message/get_message/tags", tags, itemIndex++);
            putMapElement(mapData, "RGW/message/get_message/mem_store", memStore, itemIndex++);
            putMapElement(mapData, "RGW/message/set_message/delete_message_id", deleteSmsId, itemIndex++);

            QuerySmsCmdTryCount = 0;
            PostXMLWithResponse(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),QuerySmsCmdStatus);

        }

        function ReceiveSms() {
            // there is no simcard
            if (menuId == "mSimSms") {
                if (!g_bSimCardExist) {
                    showAlert(jQuery.i18n.prop("lsmsSimCardAbsent"));
                    return;
                }
            }
            UpdateSmsList("1", true);

            if ($(".navigation ul li a.on").text() == jQuery.i18n.prop("tSms")) {
                //setTimeout(ReceiveSms, 10000);
            }

        }


        $("#lt_sms_btnNew").click(function() {

            $("#lt_sms_meuRightClick").hide();
            $("#divSmsList").hide();
            $("#divSmsChatRoom").show();
            $("#divNewSmsContent").show();
            $("#divRecvSmsContent").hide();
            $("#txtSmsContent").val("");

            $("#sendNumberList").css("width", "500px");
            $(".search-choice").remove();
            $("#chosen-search-field-input").show();
            $("#sendNumberList").val("");


            if ("mDrafts" == menuId) {
                $("#lt_sms_spanDraftSave").show();
                $("#lt_sms_spanSend").hide();


            } else {

                $("#lt_sms_spanSend").show();
                //$("#lt_sms_spanDraftSave").hide()

            }
        });

        $("#lt_sms_btnCancel").click(function() {
            $("#divSmsList").show();
            $("#divSmsChatRoom").hide();
            UpdateSmsList($("#divSmsPageNum .pageSelIdx").text(), false);
        });

        $("#forwardSmsImg").click(function() {
            $(".search-choice").remove();
            $("#chosen-search-field-input").show();
            $("#divRecvSmsContent").hide();
            $("#divNewSmsContent").show();
            var smsContents = RemoveHrefs($("#txtRecvSmsContent").html());
            smsContents=smsContents.replace(/&lt;/ig,"<");
            smsContents=smsContents.replace(/&gt;/ig,">");
			smsContents=smsContents.replace(/&nbsp;/g," ");
            $("#txtSmsContent").val(smsContents);
        });

        $("#deleteAllSms").click(function() {
            if ($("#deleteAllSms").prop("checked")) {
                $(".delCheckBox").prop("checked", true);
            } else
                $(".delCheckBox").prop("checked", false);

            if ($(".delCheckBox:checked").length >= 1)
                RefreshButton(true);
            else
                RefreshButton(false);
        });

        this.onLoad = function() {
            menuId = $("#submenu").children(".on:first").attr("id");

            if ("mDeviceOutbox" == menuId || "mDrafts" == menuId) {
                $("#lt_sms_btnCopy").hide().parent().hide();
                $("#lt_sms_btnMove").hide().parent().hide();
            } else {
                $("#lt_sms_btnCopy").hide().parent().hide();
                $("#lt_sms_btnMove").hide().parent().hide();
            }


            // there is no simcard
            if (menuId == "mSimSms") {
                if (!g_bSimCardExist) {
                    showAlert(jQuery.i18n.prop("lsmsSimCardAbsent"));
                    return;
                }
            }

            if ("mDrafts" == menuId) {
                $("#divRecvSmsContent").hide();
            }
            SetLocation();
            UpdateSmsList("1", true);
            if(null == phoneNumberList) {
                //UpdatePhoneBookList();
            }
            //setTimeout(ReceiveSms, 10000);
        }


        this.onPost = function() {
        }

        this.onPostSuccess = function() {
        }


        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }

        return this;
    }
})(jQuery);

