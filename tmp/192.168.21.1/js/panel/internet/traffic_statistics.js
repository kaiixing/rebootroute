(function ($) {

    $.fn.objTrafficStats = function (InIt) {
	var c_xmlName = '';

	this.onLoad = function (flag) {
            var index = 0;
	    if (flag)
		this.loadHTML();
            document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
	    var xml = getData(c_xmlName);

            var arrayLabels = document.getElementsByTagName("label");
            lableLocaliztion(arrayLabels);
             arrayLabels = document.getElementsByTagName("th");
            lableLocaliztion(arrayLabels);

            arrayLabels = document.getElementsByTagName("td");
            lableLocaliztion(arrayLabels);
	$("#lTrafficStatsWANSent").attr("align","right");


	    var wanSent, wanReceived, wanErrors, wanTotal;
	    $(xml).find("WanStatistics").each(function(){
		    //wanSent = $(this).find("tx").text();
		    //wanReceived = $(this).find("rx").text();
			rx_byte_all = $(this).find("rx_byte_all").text();
			tx_byte_all =$(this).find("tx_byte_all").text();
			wanReceived = getWlanByte(rx_byte_all);
			wanSent = getWlanByte(tx_byte_all);
			wanTotal = getWlanByte(parseInt(rx_byte_all)+parseInt(tx_byte_all));
		    //wanErrors = $(this).find("errors").text();

                    var id = document.getElementById("tblTrafficStatics");
                  $("#wanSend").html(wanSent);
                  $("#wanRecive").html(wanReceived);
                  //$("#wanError").html(wanErrors);
                  $("#wanTotal").html(wanTotal);

//                    $("#lTrafficStatsWANSent").text(document.getElementById('lTrafficStatsWANSent').innerHTML+" "+wanSent);
//                    $("#lTrafficStatsWANReceived").text(document.getElementById('lTrafficStatsWANReceived').innerHTML+" "+wanReceived);
//                    $("#lTrafficStatsWANErrors").text(document.getElementById('lTrafficStatsWANErrors').innerHTML+" "+wanErrors);


    	    });
/*
	    var wlanSent, wlanReceived, wlanErrors;
	    $(xml).find("WlanStatistics").each(function(){
		    wlanSent = $(this).find("tx").text();
		    wlanReceived = $(this).find("rx").text();
		    wlanErrors = $(this).find("errors").text();
                   $("#wlanSend").html(wlanSent);
                  $("#wlanRecive").html(wlanReceived);
                  $("#wlanError").html(wlanErrors);


//                    $("#lTrafficStatsWLANSent").text(document.getElementById('lTrafficStatsWLANSent').innerHTML+" "+wlanSent);
//                    $("#lTrafficStatsWLANReceived").text(document.getElementById('lTrafficStatsWLANReceived').innerHTML+" "+wlanReceived);
//                    $("#lTrafficStatsWLANErrors").text(document.getElementById('lTrafficStatsWLANErrors').innerHTML+" "+wlanErrors);

    	    });
		*/
/*
	    var lanSent, lanReceived, lanErrors;
	    $(xml).find("LanStatistics").each(function(){
		    lanSent = $(this).find("tx").text();
		    lanReceived = $(this).find("rx").text();
		    lanErrors = $(this).find("errors").text();
                   $("#lanSend").html(lanSent);
                  $("#lanRecive").html(lanReceived);
                  $("#lanError").html(lanErrors);


//                    $("#lTrafficStatsWLANSent").text(document.getElementById('lTrafficStatsWLANSent').innerHTML+" "+wlanSent);
//                    $("#lTrafficStatsWLANReceived").text(document.getElementById('lTrafficStatsWLANReceived').innerHTML+" "+wlanReceived);
//                    $("#lTrafficStatsWLANErrors").text(document.getElementById('lTrafficStatsWLANErrors').innerHTML+" "+wlanErrors);

    	    });
		*/

	}

        this.onPost = function () {
	}

        this.loadHTML =  function() {
	    document.getElementById('Content').innerHTML ="";
	    document.getElementById('Content').innerHTML = callProductHTML("html/internet/traffic_statistics.html");
        }

        this.setXMLName = function (_xmlname){
            c_xmlName = _xmlname;
        }

        return this.each(function () {
		_trafficstatisticsIntervalID = setInterval( "g_objContent.onLoad(false)", _trafficstatisticsInterval);
	});
    }
})(jQuery);
function setLabelValue(id,value){
    document.getElementById(id).innerHTML=value;
}
function getWlanByte(byte) {
	var mByte = "";
	var gb = 1024*1024*1024;
	var mb = 1024*1024;
	var kb = 1024;

	if(byte>gb) //GB
	{
		mByte = (byte/gb).toFixed(2)+' '+"GB";
	}
	else if(byte>mb) //MB
	{
		mByte = (byte/mb).toFixed(2)+' '+"MB";
	}
	else if(byte>kb)//KB
	{
		mByte =(byte/kb).toFixed(2)+' '+"KB";
	}
	else //Byte
	{
		mByte = byte;
	}

	return mByte;
}