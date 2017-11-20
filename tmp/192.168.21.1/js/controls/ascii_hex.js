(function ($) {
    $.fn.ascii_hex = function (oInit) {
     var divID=oInit;
     
       this.setRadioButton = function (control) {
           if(control=="1")
          document.getElementById(divID+"Hex").checked=true;
          else
              document.getElementById(divID+"Ascii").checked=true;
          }
       this.getRadioButton = function () {
         if(document.getElementById(divID+"Hex").checked)
             return "1";
         else
             return "0";
       }
       this.addEventMapFunction = function (event,functionName){
           document.getElementById(divID+"Hex").addEventListener(event, functionName, null);
           document.getElementById(divID+"Ascii").addEventListener(event, functionName, null);
        }
       return this.each(function () {
       var HTML = "<input type='radio' id='"+divID+"Ascii' name='"+divID+"rbAH' selected> "+jQuery.i18n.prop('lAscii')+"</input> &nbsp;&nbsp;&nbsp; <input type='radio' id='"+divID+"Hex' name='"+divID+"rbAH'>"+jQuery.i18n.prop('lHex')+"</input>";
       this.innerHTML = HTML;
        });
    }
})(jQuery);
