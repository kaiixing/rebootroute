

$.download = function(url, data, method, callback){
    var inputs = '';
    var iframeX;
    var downloadInterval;
    if(url && data){
        // remove old iframe if has
        if($("#iframeX")) $("#iframeX").remove();
        // creater new iframe
        iframeX= $('<iframe src="[removed]false;" name="iframeX" id="iframeX"></iframe>').appendTo('body').hide();
        if($.browser.msie){
            downloadInterval = setInterval(function(){
                // if loading then readyState is “loading” else readyState is “interactive”
                if(iframeX&& iframeX[0].readyState !=="loading"){
                    callback();
                    clearInterval(downloadInterval);
                }
            }, 23);
        } else {
            iframeX.load(function(){
                callback();
            });
        }

        jQuery.each(data.split('&'), function(){
            var pair = this.split('=');
            inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
        });

        //create form to send request
        $('<form action="'+ url +'" method="'+ (method||'post') + '" target="iframeX">'+inputs+'</form>').appendTo('body').submit().remove();
    }
}
