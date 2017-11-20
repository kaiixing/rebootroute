(function ($) {
    $.fn.visible_invisible = function (oInit) {
     var divID=oInit;
       this.setRadioButton = function (control) {
           if(control=="1")
          document.getElementById(divID+"Visible").checked=true;
          else
              document.getElementById(divID+"Invisible").checked=true;
          }
       this.getRadioButton = function () {
         if(document.getElementById(divID+"Visible").checked)
             return "1";
         else
             return "0";
       }
       return this.each(function () {
       var HTML = "<input type='radio' id='"+divID+"Visible' name='"+divID+"rbEnDis' selected> "+jQuery.i18n.prop('lVisible')+"</input> &nbsp;&nbsp;&nbsp; <input type='radio' id='"+divID+"Invisible' name='"+divID+"rbEnDis'> "+jQuery.i18n.prop('lInvisible')+"</input>";
       this.innerHTML = HTML;
        });
    }
})(jQuery);
