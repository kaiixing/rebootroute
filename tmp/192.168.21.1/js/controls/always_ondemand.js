(function ($) {
    $.fn.always_ondemand = function (oInit) {
     var divID=oInit;
     
       this.setRadioButton = function (control) {
           if(control=="0")
          document.getElementById(divID+"Always").checked=true;
          else
              document.getElementById(divID+"OnDemand").checked=true;
          }
       this.getRadioButton = function () {
         if(document.getElementById(divID+"Always").checked)
             return "0";
         else
             return "1";
       }
       this.addEventMapFunction = function (event,functionName){
           document.getElementById(divID+"Always").addEventListener(event, functionName, null);
           document.getElementById(divID+"OnDemand").addEventListener(event, functionName, null);
        }
       return this.each(function () {
       var HTML = "<input type='radio' id='"+divID+"Always' name='"+divID+"rbAlOd' selected> <strong>"+jQuery.i18n.prop('lAlways')+"</strong></input> &nbsp;&nbsp;&nbsp; <input type='radio' id='"+divID+"OnDemand' name='"+divID+"rbAlOd'> <strong>"+jQuery.i18n.prop('lOnDemand')+"</strong></input>";
       this.innerHTML = HTML;
        });
    }
})(jQuery);
