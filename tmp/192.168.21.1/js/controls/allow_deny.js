(function ($) {
    $.fn.allow_deny = function (oInit) {
     var divID=oInit;
     
       this.setRadioButton = function (control) {
           if(control=="1")
          document.getElementById(divID+"Allow").checked=true;
          else
              document.getElementById(divID+"Deny").checked=true;
          }
       this.getRadioButton = function () {
         if(document.getElementById(divID+"Allow").checked)
             return "1";
         else
             return "0";
       }
        this.addEventMapFunction = function (event,functionName){
           document.getElementById(divID+"Allow").addEventListener(event, functionName, null);
           document.getElementById(divID+"Deny").addEventListener(event, functionName, null);
        }
       return this.each(function () {
       var HTML = "<input type='radio' id='"+divID+"Allow' name='"+divID+"rbAwDn' selected> "+jQuery.i18n.prop('lAllow')+"</input> &nbsp;&nbsp;&nbsp; <input type='radio' id='"+divID+"Deny' name='"+divID+"rbAwDn'> "+jQuery.i18n.prop('lDeny')+"</input>";
       this.innerHTML = HTML;
        });
    }
})(jQuery);
