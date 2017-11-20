(function ($) {
    $.fn.ip_address = function (oInit) {
        var divID = oInit;

        this.setIP = function (ip) {
            if(ip==''){
              for(var i=0;i<4;i++)
                document.getElementById(divID+"text"+i).value = '';
            }else {
            var ary = ip.split(".");
            for(i=0;i<4;i++)
                document.getElementById(divID+"text"+i).value = ary[i];
            }
        }

        this.getIP = function () {
            var ip="";
            for(var i=0;i<3;i++)
                ip+=document.getElementById(divID+"text"+i).value+".";
            ip+=document.getElementById(divID+"text3").value;
            return ip;
        }
        this.validIP = function (flag) {
            return isIPFULL(this.getIP(),flag);
        }
        this.disableIP = function (var0,var1,var2,var3) {
 
            document.getElementById(divID+"text0").readOnly = var0;
            document.getElementById(divID+"text1").readOnly = var1;
            document.getElementById(divID+"text2").readOnly = var2;
            document.getElementById(divID+"text3").readOnly = var3;
        }

        this.getDivID = function () {
            return divID;
        }
        this.clearHTML = function () {
            this.innerHTML = "";
        }
        this.formatIP = function (ip){
            var ary = ip.split(".");
            document.getElementById(divID+"text0").value =  ary[0];
            document.getElementById(divID+"text1").value =  ary[1];
            this.formatIP2();
        }

        this.formatIP2 = function () {
            document.getElementById(divID+"text2").value = document.getElementById("textbox3").value;
        }
        return this.each(function () {
            var id1=divID+"text0";
            var id2=divID+"text1";
            var id3=divID+"text2";
            var id4=divID+"text3";

            var HTML ="<input type='text' id="+ id1+ "  maxlength='3' class='textfield1' onkeyup='setFocusIP(\""+id1+"\")'> </input><strong class='dot'>&middot;</strong>";
                HTML+="<input type='text' id="+ id2 +"  maxlength='3' class='textfield1' onkeyup='setFocusIP(\""+id2+"\")'> </input><strong class='dot'>&middot;</strong>";
                HTML+="<input type='text' id="+ id3 +"  maxlength='3' class='textfield1' onkeyup='setFocusIP(\""+id3+"\")'> </input><strong class='dot'>&middot;</strong>";
                HTML+="<input type='text' id="+ id4 +"  maxlength='3' class='textfield1'></input>";
            this.innerHTML += HTML;
        });
    }
})(jQuery);

function setFocusIP(controlID){
    var str=document.getElementById(controlID).value;
    if(str.length==3){
        var c = controlID.toString().charAt(controlID.length-1);
        c++;
        controlID = controlID.substring(0, controlID.length-1);
        controlID=controlID+c;
        document.getElementById(controlID.toString()).focus();
    }


}