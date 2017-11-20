(function ($) {
    $.fn.enabled_disabled = function (oInit) {
     var divID=oInit;
     
       this.setRadioButton = function (control) {
           if(control=="1")
          document.getElementById(divID+"Enabled").checked=true;
          else
              document.getElementById(divID+"Disabled").checked=true;
          }
       this.getRadioButton = function () {
         if(document.getElementById(divID+"Enabled").checked)
             return "1";
         else
             return "0";
       }
       this.addEventMapFunction = function (event,functionName){
           document.getElementById(divID+"Enabled").addEventListener(event, functionName, null);
           document.getElementById(divID+"Disabled").addEventListener(event, functionName, null);
        }
       return this.each(function () {
       var HTML = "<input type='radio' id='"+divID+"Enabled' name='"+divID+"rbEnDis' selected> "+jQuery.i18n.prop('lEnabled')+"</input> &nbsp;&nbsp;&nbsp; <input type='radio' id='"+divID+"Disabled' name='"+divID+"rbEnDis'>"+jQuery.i18n.prop('lDisabled')+"</input>";
       this.innerHTML = HTML;
        });
    }
})(jQuery);