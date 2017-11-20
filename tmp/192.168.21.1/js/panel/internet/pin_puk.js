(function ($) {

    $.fn.objPinPuk = function (InIt) {

        var _xmlname = '';
        var mapData;
        var _xml = '';
        var _xml1 = '';
        var pin_enabled;

        this.onLoad = function () {

            this.loadHTML();

            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
			buttonLocaliztion("btUpdate0");
            _xml1=callProductXML("wan");
            sim_status = $(_xml1).find("sim_status").text();
            pin_status = $(_xml1).find("pin_status").text();
            if(sim_status != "0") {
                message = jQuery.i18n.prop("lUnknownNoSIM");
				sm("alertMB",350,135);
			    document.getElementById("lAlertMessage").innerHTML = message;
			    document.getElementById("lAlert").innerHTML = jQuery.i18n.prop("lAlert");
			    //document.getElementById("btnModalOk").innerHTML = jQuery.i18n.prop("btnModalOk");
			    buttonLocaliztion("btnModalOk");
                return;
            }

            _xml=callProductXML(_xmlname);

            var pin_attempts = $(_xml).find("pin_attempts").text();
            var puk_attempts = $(_xml).find("puk_attempts").text();
            pin_enabled = $(_xml).find("pin_enabled").text();

            var mep_currentststus = $(_xml).find("CURRENT_STATUS").text();
            if(mep_currentststus!="PIN_LOCK"
               &&mep_currentststus!="PUK_LOCK"
               &&mep_currentststus!="READY") {
                showAlert(jQuery.i18n.prop("lMEPUnlockrequired"));
                return;
            }


            document.getElementById("vPinAttmepts").innerHTML = jQuery.i18n.prop("lpinattempts")+" "+pin_attempts;
            document.getElementById("vPukAttmepts").innerHTML = jQuery.i18n.prop("lpukattempts")+" "+puk_attempts;

            if(sim_status != "0") {
                showAlert(jQuery.i18n.prop("lUnknownNoSIM"));
            } else if(pin_attempts == "-1" || puk_attempts == "-1") {
                showAlert(jQuery.i18n.prop("lUnknownNoSIM"));
            } else if(pin_attempts == "0" && puk_attempts == "0") {
                showAlert(jQuery.i18n.prop("lPukExhausted"));
            } else if(pin_attempts == "0" && puk_attempts != "0") {
                showAlert(jQuery.i18n.prop("lPinExhausted"));
                document.getElementById("PinPukAttempts").style.display="block";
                document.getElementById("ResetPinUsingPuk").style.display="block";
            } else {
                if(pin_status == "1") {
                    document.getElementById("PinPukAttempts").style.display="block";
                    document.getElementById("ProvidePin").style.display="block";
                    buttonLocaliztion(document.getElementById("btUpdate").id);

                } else {
                    document.getElementById("PinPukAttempts").style.display="block";
                    document.getElementById("EnableDisablePin").style.display="block";
                    if(pin_enabled == "0") {
                        document.getElementById("lEnableDisablePin").innerHTML=jQuery.i18n.prop("lEnablePin");
                        document.getElementById("btUpdate1").value = jQuery.i18n.prop("lEnablePin");
                    } else {
                        document.getElementById("lEnableDisablePin").innerHTML=jQuery.i18n.prop("lDisablePin");
                        document.getElementById("btUpdate1").value = jQuery.i18n.prop("lDisablePin");
                        document.getElementById("ChangePin").style.display="block";
                        buttonLocaliztion(document.getElementById("btUpdate2").id);
                    }
                }
            }

        }
        this.onPostSuccess = function () {
            this.onLoad(true);
        }
        this.loadHTML = function() {
            document.getElementById('Content').innerHTML ="";
            document.getElementById('Content').innerHTML = callProductHTML("html/internet/pin_puk.html");
        }
        this.setXMLName = function (xmlname) {
            _xmlname = xmlname;
        }
        this.putMapElement = function(xpath,value,index) {
            mapData[index]=new Array(2);
            mapData[index][0]=xpath;
            mapData[index][1]=value;
        }

        this._ProvidePin = function() {
            var itemIndex=0;
            mapData=null;
            mapData = new Array();

            var pin = document.getElementById('txtPin').value;
            if(! validate_pin(pin)) {
                document.getElementById('lAlertError').innerHTML= jQuery.i18n.prop("linvalidPin");
                return;
            }

            this.putMapElement("RGW/pin_puk/command", "5", itemIndex++);
            this.putMapElement("RGW/pin_puk/pin", pin, itemIndex++);

            PostXMLWithResponse(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),CheckCmdStatus);   
            //CheckCmdStatus(retXml);

        }

        this._resetPinUsingPuk = function() {
            var itemIndex=0;
            mapData=null;
            mapData = new Array();

            var puk = document.getElementById('txtPuk0').value;
            var new_pin = document.getElementById('txtNewPin0').value;
            buttonLocaliztion("btUpdate0");

            if(! validate_puk(puk)) {
                document.getElementById('lAlertError0').innerHTML= jQuery.i18n.prop("linvalidPuk");
                return;
            }

            if(! validate_pin(new_pin)) {
                document.getElementById('lAlertError0').innerHTML= jQuery.i18n.prop("linvalidPin");
                return;
            }
            this.putMapElement("RGW/pin_puk/command", "4", itemIndex++);
            this.putMapElement("RGW/pin_puk/puk", puk, itemIndex++);
            this.putMapElement("RGW/pin_puk/new_pin", new_pin, itemIndex++);
            

            PostXMLWithResponse(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),CheckCmdStatus);
            //CheckCmdStatus(retXml);
        }

        this._EnableDisablePin = function() {
            var itemIndex=0;
            mapData=null;
            mapData = new Array();
            var pin = document.getElementById('txtPin1').value;
            var command;

            if(! validate_pin(pin)) {
                document.getElementById('lAlertError1').innerHTML= jQuery.i18n.prop("linvalidPin");
                return;
            }
            if(pin_enabled == "0")
                command = "1";
            else
                command = "2";

            this.putMapElement("RGW/pin_puk/command", command, itemIndex++);
            this.putMapElement("RGW/pin_puk/pin", pin, itemIndex++);
            

           PostXMLWithResponse(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),CheckCmdStatus);
          //  CheckCmdStatus(retXml);

        }

        this._ChangePin = function() {
            var itemIndex=0;
            mapData=null;
            mapData = new Array();

            var pin = document.getElementById('txtPin2').value;
            var new_pin = document.getElementById('txtNewPin2').value;

            if(! validate_pin(pin)) {
                document.getElementById('lAlertError2').innerHTML= jQuery.i18n.prop("linvalidPin");
                return;
            }

            if(! validate_pin(new_pin)) {
                document.getElementById('lAlertError2').innerHTML= jQuery.i18n.prop("linvalidPin");
                return;
            }

            if(pin == new_pin) {
                document.getElementById('lAlertError2').innerHTML= jQuery.i18n.prop("lNewPinSameWithOld");
                return;
            }

            this.putMapElement("RGW/pin_puk/command", "3", itemIndex++);
            this.putMapElement("RGW/pin_puk/pin", pin, itemIndex++);
            this.putMapElement("RGW/pin_puk/new_pin", new_pin, itemIndex++);


            PostXMLWithResponse(_xmlname, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),CheckCmdStatus);

            //CheckCmdStatus(retXml);
        }
        return this.each(function () {
        });
    }
})(jQuery);

function ProvidePin() {
    g_objContent._ProvidePin();
}
function resetPinUsingPuk() {
    g_objContent._resetPinUsingPuk();
}

function EnableDisablePin() {
    g_objContent._EnableDisablePin();
}

function ChangePin() {
    g_objContent._ChangePin();
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

function CheckCmdStatus(retXml) {
    var cmdStatus = parseInt($(retXml).find("cmd_status").text());
	var pin_attempts = parseInt($(retXml).find("pin_attempts").text());
	var puk_attempts = parseInt($(retXml).find("puk_attempts").text());
     g_objContent.onLoad();
     hm();

    if(10 == cmdStatus) { // incorrect password
    	if(pin_attempts==0 && puk_attempts!=0)
		showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lPukPasswordError"))
		else
        showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lPinPasswordError"))
    } else if(13 == cmdStatus) { //SIM CARD do not support this PIN code
        showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lSimNotSupportPinCode"))
    }  else if(7 == cmdStatus) { //SIM PUK request
        showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lSimPUKRequest"))
    }  else if(0 != cmdStatus){ //other failed,0 is success
        showMsgBox(jQuery.i18n.prop("lWarning"),jQuery.i18n.prop("lFailedWithUnkown"))
    }   
}

function clearAlertError()
{
    $("#lAlertError").text("");
}
function clearAlertError0()
{
    $("#lAlertError0").text("");
}

function clearAlertError1()
{
    $("#lAlertError1").text("");
}

function clearAlertError2()
{
    $("#lAlertError2").text("");
}