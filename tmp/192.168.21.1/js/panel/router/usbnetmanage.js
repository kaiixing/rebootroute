var xnetmodstatus="";
(function ($) {
    $.fn.objUsbNetManage = function (InIt) {

        var xmlName = '';
        this.onLoad = function () {
            this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
            var buttonID = document.getElementById("btUpdateusbnetmod").id;
            buttonLocaliztion(buttonID);
            lableLocaliztion(document.getElementsByTagName("span"));
            var xml = getData(xmlName);
            xnetmodstatus = $(xml).find("NetModStatus").text();
            if(xnetmodstatus == "1"){
                $("#UMSRadioEnabled").prop("checked",true);
            }else{
                $("#UMSRadioDisabled").prop("checked",true);
            }

        }


        this.onPost  =  function  () {
            

        }
        this.onPostSuccess = function() {
            this.onLoad();
        }

        this.setXMLName = function(_xmlname) {
            xmlName = _xmlname;
        }

        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/router/UsbNetManage.html");
        }

        return this.each(function () {
        });

    }
})(jQuery);
function Saveusbnetmod() {
    var susbnetmod="";
    if( $("#UMSRadioEnabled").prop("checked")){
           susbnetmod = "1" 
    }else{
        susbnetmod = "0" 
    }
    if(susbnetmod != xnetmodstatus){
    var mapData = new Array();
    putMapElement(mapData, "RGW/USBNetMode/NetModStatus", susbnetmod, 0);
    postXML("usbnetmode", g_objXML.getXMLDocToString(g_objXML.createXML(mapData )));
    }else
        return;
}

