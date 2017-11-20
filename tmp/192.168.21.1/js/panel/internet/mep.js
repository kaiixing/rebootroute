var g_bProvidePukPasswd = false;
(function ($) {
    $.fn.objMEPSetting = function (InIt) {
        var _xmlname = '';
        var mapData;
        var _xml = '';
        var _xml1 = '';
        var mep_currentststus;
        var pin_attempts;
        var puk_attempts;
        var simLeftRetryNum;
        var NWLeftRetryNum;
        var NWSubLeftRetryNum;
        var PSLeftRetryNum;
        var corpLeftRetryNum;

        this.onLoad = function () {

            this.loadHTML();

            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);

            _xml1=callProductXML("pin_puk");
            pin_attempts = $(_xml1).find("pin_attempts").text();
            puk_attempts = $(_xml1).find("puk_attempts").text();
            mep_currentststus = $(_xml1).find("CURRENT_STATUS").text();

            simLeftRetryNum  = $(_xml1).find("SIM_LEFT_RETRY_NUM").text();
            PnLeftRetryNum  = $(_xml1).find("NW_LEFT_RETRY_NUM").text();
            PuLeftRetryNum  = $(_xml1).find("NWSUB_LEFT_RETRY_NUM").text();
            PSLeftRetryNum  = $(_xml1).find("PS_LEFT_RETRY_NUM").text();
            PcLeftRetryNum  = $(_xml1).find("CORP_LEFT_RETRY_NUM").text();
            if(g_bProvidePukPasswd && "fail" == $(_xml1).find("ACTION_RESULT").text())
            {
                showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lPasswordError"))
            }
            g_bProvidePukPasswd = false;

            this.SetCurrentStatus();
        }

        this.RefreshDisplay = function(IsShow) {
            var divstyle = IsShow? "block":"none";
            document.getElementById("MEP_PinAttempts_div").style.display = divstyle;
            document.getElementById("MEP_PinPukAttempts_div").style.display = divstyle;
            document.getElementById("MEP_PNPassword_div").style.display = divstyle;
            //document.getElementById("MEP_PN_PUK_div").style.display = divstyle;
            document.getElementById("MEP_PUPassword_div").style.display = divstyle;
            //document.getElementById("MEP_PU_PUK_div").style.display = divstyle;
            document.getElementById("MEP_PUPassword_div").style.display = divstyle;
            document.getElementById("MEP_SPPassword_div").style.display = divstyle;
            //document.getElementById("MEP_SP_PUK_div").style.display = divstyle;
            document.getElementById("MEP_PCPassword_div").style.display = divstyle;
            document.getElementById("MEP_SIMPassword_div").style.display = divstyle;
            document.getElementById("MEP_SIM_PUK_div").style.display = divstyle;
        }

        this.SetCurrentStatus = function() {
            this.RefreshDisplay(false);
            if("READY"==mep_currentststus) {
                pn_status = $(_xml1).find("PN_STATUS").text();
                pu_status = $(_xml1).find("PU_STATUS").text();
                sp_status = $(_xml1).find("PP_STATUS").text();
                pc_status = $(_xml1).find("PC_STATUS").text();
                sim_status = $(_xml1).find("SIMLOCK_STATUS").text();

                document.getElementById("lMEPPNLeftRetry").innerHTML = jQuery.i18n.prop("lMEPPNLeftRetry")+" "+PnLeftRetryNum;
                document.getElementById("lMEPPUAttempts").innerHTML = jQuery.i18n.prop("lMEPPUAttempts")+" "+PuLeftRetryNum;
                document.getElementById("lMEPSPAttempts").innerHTML = jQuery.i18n.prop("lMEPSPAttempts")+" "+PSLeftRetryNum;
                document.getElementById("lMEPPCAttempts").innerHTML = jQuery.i18n.prop("lMEPPCAttempts")+" "+PcLeftRetryNum;
                 document.getElementById("lMEPSIMAttempts").innerHTML = jQuery.i18n.prop("lMEPSIMAttempts")+" "+simLeftRetryNum;

                
                if("ENABLED"==pn_status) { //unlock PN
                    document.getElementById("MEP_PNPassword_div").style.display = "block";
                    $("#lUnlockMEPPNBtn").val(jQuery.i18n.prop("lUnlockMEPPNBtn"));
                } else if("UNLOCKED"==pn_status) {
                    document.getElementById("MEP_PNPassword_div").style.display = "block";
                    $("#lUnlockMEPPNBtn").val(jQuery.i18n.prop("lEnableLockMEPPNBtn"));
                } else {
                    document.getElementById("MEP_SPPassword_div").style.display = "block";
                    $("#lEnterPNPassword").prop("disabled", true);
                    $("#lUnlockMEPPNBtn").val(jQuery.i18n.prop("lInvalidLockMEPPNBtn"));
                    $("#lUnlockMEPPNBtn").parent(".btnWrp:first").addClass("disabledBtn");
                    $("#lUnlockMEPPNBtn").prop("disabled", true);
                }

                if("ENABLED"==pu_status) { //unlock PU

                    document.getElementById("MEP_PUPassword_div").style.display = "block";
                    $("#lUnlockMEPPUBtn").val(jQuery.i18n.prop("lUnlockMEPPUBtn"));
                } else if("UNLOCKED"==pu_status) {

                    document.getElementById("MEP_PUPassword_div").style.display = "block";
                    $("#lUnlockMEPPUBtn").val(jQuery.i18n.prop("lEnableLockMEPPUBtn"));
                } else {
                    document.getElementById("MEP_PUPassword_div").style.display = "block";
                    $("#lEnterPUPassword").prop("disabled", true);
                    $("#lUnlockMEPPUBtn").val(jQuery.i18n.prop("lInvalidLockMEPPUBtn"));
                    $("#lUnlockMEPPUBtn").parent(".btnWrp:first").addClass("disabledBtn");
                    $("#lUnlockMEPPUBtn").prop("disabled", true);
                }

                if("ENABLED"==sp_status) { //unlock SP

                    document.getElementById("MEP_SPPassword_div").style.display = "block";
                    $("#lUnlockMEPSPBtn").val(jQuery.i18n.prop("lUnlockMEPSPBtn"));
                } else if("UNLOCKED"==sp_status) {

                    document.getElementById("MEP_SPPassword_div").style.display = "block";
                    $("#lUnlockMEPSPBtn").val(jQuery.i18n.prop("lEnablelockMEPSPBtn"));
                } else {
                    document.getElementById("MEP_SPPassword_div").style.display = "block";
                    $("#lEnterSPPassword").prop("disabled", true);
                    $("#lUnlockMEPSPBtn").val(jQuery.i18n.prop("lInvalidLockMEPSPBtn"));
                    $("#lUnlockMEPSPBtn").parent(".btnWrp:first").addClass("disabledBtn");
                    $("#lUnlockMEPSPBtn").prop("disabled", true);
                }


                if("ENABLED"==pc_status) { //unlock PC

                    document.getElementById("MEP_PCPassword_div").style.display = "block";
                    $("#lUnlockMEPPCBtn").val(jQuery.i18n.prop("lUnlockMEPPCBtn"));
                } else if("UNLOCKED"==sp_status) {
                    document.getElementById("MEP_PCPassword_div").style.display = "block";
                    $("#lUnlockMEPPCBtn").val(jQuery.i18n.prop("lEnableLockMEPPCBtn"));
                } else {
                    document.getElementById("MEP_PCPassword_div").style.display = "block";
                    $("#lEnterPCPassword").prop("disabled", true);
                    $("#lUnlockMEPPCBtn").val(jQuery.i18n.prop("lInvalidLockMEPPCBtn"));
                    $("#lUnlockMEPPCBtn").parent(".btnWrp:first").addClass("disabledBtn");
                    $("#lUnlockMEPPCBtn").prop("disabled", true);
                }

                if("ENABLED"==sim_status) { //unlock SIM

                    document.getElementById("MEP_SIMPassword_div").style.display = "block";
                    $("#lUnlockMEPSIMBtn").val(jQuery.i18n.prop("lUnlockMEPSIMBtn"));
                } else if("UNLOCKED"==sim_status) {

                    document.getElementById("MEP_SIMPassword_div").style.display = "block";
                    $("#lUnlockMEPSIMBtn").val(jQuery.i18n.prop("lEnablelockMEPSIMBtn"));
                } else {
                    document.getElementById("MEP_SIMPassword_div").style.display = "block";
                    $("#lEnterSIMPassword").prop("disabled", true);
                    $("#lUnlockMEPSIMBtn").val(jQuery.i18n.prop("lInvalidLockMEPSIMBtn"));
                    $("#lUnlockMEPSIMBtn").parent(".btnWrp:first").addClass("disabledBtn");
                    $("#lUnlockMEPSIMBtn").prop("disabled", true);
                }


            } else if("PIN_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_PinAttempts_div").style.display = "block";
                document.getElementById("MEP_Pin_div").style.display = "block";
                document.getElementById("vPinAttmepts").innerHTML = jQuery.i18n.prop("lPINAttempts")+" "+pin_attempts;
                $("#lUnlockPINBtn").val(jQuery.i18n.prop("lUnlockPINBtn"));
            } else if("PUK_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_PinPukAttempts_div").style.display = "block";
                document.getElementById("vPukAttmepts").innerHTML = jQuery.i18n.prop("lpukattempts")+" "+puk_attempts;
            } else if("PN_PIN_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_PNPassword_div").style.display = "block";
                document.getElementById("lMEPPNLeftRetry").innerHTML = jQuery.i18n.prop("lMEPPNLeftRetry")+" "+PnLeftRetryNum;
                $("#lUnlockMEPPNBtn").val(jQuery.i18n.prop("lUnlockMEPPNBtn"));

            } else if("PN_PUK_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_PN_PUK_div").style.display = "block";
                $("#lMEPPNpukBtn").val(jQuery.i18n.prop("lMEPPNpukBtn"));

            } else if("PU_PIN_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_PUPassword_div").style.display = "block";
               document.getElementById("lMEPPUAttempts").innerHTML = jQuery.i18n.prop("lMEPPUAttempts")+" "+PuLeftRetryNum;
                $("#lUnlockMEPPUBtn").val(jQuery.i18n.prop("lUnlockMEPPUBtn"));

            } else if("PU_PUK_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_PU_PUK_div").style.display = "block";
                $("#lMEPPUpukBtn").val(jQuery.i18n.prop("lMEPPUpukBtn"));


            } else if("PP_PIN_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_SPPassword_div").style.display = "block";
               document.getElementById("lMEPSPAttempts").innerHTML = jQuery.i18n.prop("lMEPSPAttempts")+" "+PSLeftRetryNum;
                $("#lUnlockMEPSPBtn").val(jQuery.i18n.prop("lUnlockMEPSPBtn"));


            } else if("PP_PUK_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_SP_PUK_div").style.display = "block";
                $("#lMEPSPpukBtn").val(jQuery.i18n.prop("lMEPSPpukBtn"));

            } else if("PC_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_PCPassword_div").style.display = "block";
                document.getElementById("lMEPPCAttempts").innerHTML = jQuery.i18n.prop("lMEPPCAttempts")+" "+PcLeftRetryNum;
                $("#lUnlockMEPPCBtn").val(jQuery.i18n.prop("lUnlockMEPPCBtn"));

            } else if("PC_PUK_LOCK" == mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_PC_PUK_div").style.display = "block";
                $("#lMepPcPukBtn").val(jQuery.i18n.prop("lMepPcPukBtn"));
            } else if("SIM_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_SIMPassword_div").style.display = "block";
                 document.getElementById("lMEPSIMAttempts").innerHTML = jQuery.i18n.prop("lMEPSIMAttempts")+" "+simLeftRetryNum;
                $("#lUnlockMEPSIMBtn").val(jQuery.i18n.prop("lUnlockMEPSIMBtn"));
            } else if("SIM_PUK_LOCK"==mep_currentststus) {
                this.RefreshDisplay(false);
                document.getElementById("MEP_SIM_PUK_div").style.display = "block";
                $("#lMepSimPukBtn").val(jQuery.i18n.prop("lMepSimPukBtn"));
            }
        }



        this.onPostSuccess = function () {
            this.onLoad(true);
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML ="";
            document.getElementById('Content').innerHTML = callProductHTML("html/internet/mep.html");
        }
        this.setXMLName = function (xmlname) {
            _xmlname = xmlname;
        }

        return this.each(function () {
        });
    }
})(jQuery);

function UnlockMEPPU() {
    var itemIndex=0;
    var mapData = new Array();

    var PU_pin = document.getElementById('lEnterPUPassword').value;
    if(! validate_meppin(PU_pin)) {
        document.getElementById('lMEPPUAlertError').innerHTML= jQuery.i18n.prop("lMEPinvalidPin");
        return;
    }

    if(document.getElementById('lUnlockMEPPUBtn').value ==jQuery.i18n.prop("lUnlockMEPPUBtn"))
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_PU", itemIndex++);
    else
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "ENABLE_PU", itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/MEP/PASSWD", PU_pin, itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    g_bProvidePukPasswd = true;
}

function UnlockMEPPN() {
    var itemIndex=0;
    var mapData = new Array();

    var PN_pin = document.getElementById('lEnterPNPassword').value;
    if(! validate_meppin(PN_pin)) {
        document.getElementById('lMEPPNAlertError').innerHTML= jQuery.i18n.prop("lMEPinvalidPin");
        return;
    }
    if(document.getElementById('lUnlockMEPPNBtn').value ==jQuery.i18n.prop("lUnlockMEPPNBtn"))
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_PN", itemIndex++);
    else
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "ENABLE_PN", itemIndex++);

    putMapElement(mapData,"RGW/pin_puk/MEP/PASSWD", PN_pin, itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
g_bProvidePukPasswd = true;
}


function UnlockMEPSP() {
    var itemIndex=0;
    var mapData = new Array();

    var sp_pin = document.getElementById('lEnterSPPassword').value;
    if(! validate_meppin(sp_pin)) {
        document.getElementById('lMEPSPAlertError').innerHTML= jQuery.i18n.prop("lMEPinvalidPin");
        return;
    }
    if(document.getElementById('lUnlockMEPSPBtn').value ==jQuery.i18n.prop("lUnlockMEPSPBtn"))
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_PP", itemIndex++);
    else
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "ENABLE_PP", itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/MEP/PASSWD", sp_pin, itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
g_bProvidePukPasswd = true;

}

function UnlockMEPPC() {
    var itemIndex=0;
    var mapData = new Array();

    var PC_pin = document.getElementById('lEnterPCPassword').value;
    if(! validate_meppin(PC_pin)) {
        document.getElementById('lMEPPCAlertError').innerHTML= jQuery.i18n.prop("lMEPinvalidPin");
        return;
    }
    if(document.getElementById('lUnlockMEPPCBtn').value ==jQuery.i18n.prop("lUnlockMEPPCBtn"))
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_PC", itemIndex++);
    else
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "ENABLE_PC", itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/MEP/PASSWD", PC_pin, itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
g_bProvidePukPasswd = true;
}

function UnlockMEPSIM() {
    var itemIndex=0;
    var mapData = new Array();

    var SIM_pin = document.getElementById('lEnterSIMPassword').value;
    if(! validate_mepsimpin(SIM_pin)) {
        document.getElementById('lMEPSIMAlertError').innerHTML= jQuery.i18n.prop("lMEPinvalidPin");
        return;
    }
    if(document.getElementById('lUnlockMEPSIMBtn').value ==jQuery.i18n.prop("lUnlockMEPSIMBtn"))
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_SIMLOCK", itemIndex++);
    else
        putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "ENABLE_SIMLOCK", itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/MEP/PASSWD", SIM_pin, itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));

g_bProvidePukPasswd = true;
}

function MepSimPuk() {
    var itemIndex=0;
    var  mapData = new Array();
    var SimPukPasswd = document.getElementById('lSimPukPassword').value;

    putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_PS_PUK", itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/MEP/PUK_PASSWD", SimPukPasswd, itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    g_bProvidePukPasswd = true;
}

function MepPcPuk() {
    var itemIndex=0;
    var  mapData = new Array();
    var PcPukPasswd = document.getElementById('lPcPukPassword').value;
    putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_PC_PUK", itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/MEP/PUK_PASSWD", PcPukPasswd, itemIndex++);
    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    g_bProvidePukPasswd = true;
}

function MEPPuPuk() {
    var itemIndex=0;
    var  mapData = new Array();
    var PuPukPasswd = document.getElementById('lPuPukPassword').value;

    putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_PU_PUK", itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/MEP/PUK_PASSWD", PuPukPasswd, itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    g_bProvidePukPasswd = true;
}

function MEPPnPuk() {
    var itemIndex=0;
    var  mapData = new Array();
    var PnPukPasswd = document.getElementById('lPnPukPassword').value;

    putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_PN_PUK", itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/MEP/PUK_PASSWD", PnPukPasswd, itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    g_bProvidePukPasswd = true;
}

function MEPSPPuk() {
    var itemIndex=0;
    var  mapData = new Array();
    var PPPukPasswd = document.getElementById('lSpPukPassword').value;

    putMapElement(mapData,"RGW/pin_puk/MEP/MEP_ACTION", "UNLOCK_PP_PUK", itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/MEP/PUK_PASSWD", PPPukPasswd, itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
    g_bProvidePukPasswd = true;
}

function UnlockPin() {
    var itemIndex=0;

    var mapData = new Array();

    var pin = document.getElementById('txtEnterPin').value;
    if(! validate_pin(pin)) {
        document.getElementById('lPINAlertError').innerHTML= jQuery.i18n.prop("linvalidPin");
        return;
    }
    putMapElement(mapData,"RGW/pin_puk/pin", pin, itemIndex++);
    if(document.getElementById('lUnlockPINBtn').value ==jQuery.i18n.prop("lUnlockPINBtn"))
        putMapElement(mapData,"RGW/pin_puk/command", "5", itemIndex++);
    else
        putMapElement(mapData,"RGW/pin_puk/command", "2", itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
g_bProvidePukPasswd = true;

}



function ResetPinUsingPuk() {
    var itemIndex=0;
    var mapData = new Array();
    var puk = document.getElementById('txtEnterPinPukpassword').value;
    var newpin = document.getElementById('txtEnterNewPin').value;
    if(! validate_pin(newpin)) {
        document.getElementById('lNewPINAlertError').innerHTML= jQuery.i18n.prop("linvalidPin");
        return;
    }

    if(! validate_puk(puk)) {
        document.getElementById('lPINPUKAlertError').innerHTML= jQuery.i18n.prop("linvalidPuk");
        return;
    }
    putMapElement(mapData,"RGW/pin_puk/pin", newpin, itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/puk", puk, itemIndex++);
    putMapElement(mapData,"RGW/pin_puk/command", "4", itemIndex++);

    postXML("pin_puk", g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
g_bProvidePukPasswd = true;

}


function validate_pin(pin) {
    var ret = true;

    if(pin.length < 4 || pin.length > 8)
        ret = false;

    if(!isNumber(pin))
        ret = false;

    return ret;
}

function validate_puk(puk) {
    var ret = true;

    if(puk.length < 4 || puk.length > 10)
        ret = false;

    if (/\W/.test(puk))
        ret = false;

    return ret;
}


function validate_meppin(meppin) {
    var ret = true;

    if(meppin.length < 0 || meppin.length > 16)
        ret = false;

    if(!isNumber(meppin))
        ret = false;

    return ret;
}

function validate_mepsimpin(mepsimpin) {
    var ret = true;

    if(mepsimpin.length < 0 || mepsimpin.length > 16)
        ret = false;

    if(!isNumber(mepsimpin))
        ret = false;

    return ret;
}

