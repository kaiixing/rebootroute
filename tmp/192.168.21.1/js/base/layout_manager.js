
var g_menues = new Array(0);
var g_objContent = null;
var g_objXML =  $().XML_Operations();
var g_clickedItem ='User Management';
var  _dashboardInterval        = 30000;
var  _connectedDeviceInterval  = 60000;
var _trafficstatisticsInterval = 60000;
var _networkActivityInterval   = 60000;
var _storageSettingsInterval = 30000;
var  _WiFiInterval  = 25000;
var _timeSettingsInterval   = 60000;
var _zstimeSettingsIntervalID;
var  _dashboardIntervalID;
var  _connectedDeviceIntervalID;
var _trafficstatisticsIntervalID;
var _networkActivityIntervalID;
var _storageSettingsIntervalID;
var _WiFiIntervalID;
var _timeSettingsIntervalID;
/* This function get the XML from the server via ajax.
 *  Get is Method and success fucntion is callback funciton when the request success
 */
document.onkeydown = function (e) {
	if(null == g_objContent)
	return true;
var ev = window.event || e;
var code = ev.keyCode || ev.which;
if (code == 116) {
ev.keyCode ? ev.keyCode = 0 : ev.which = 0;
cancelBubble = true;
g_objContent.onLoad(true);
return false;
}
}

function callXML(xml,sFucntion){

    $.ajax({
        type: "GET",
        url: xml,
        dataType: "xml",
        async: false,
        success: sFucntion

    });
}

/* This is important function which parses the UIxml file
 * Creates the Menu and submenu depending upon XML items
 *
 */
function parseXml(xml)
{
    var menuIndex = 0;
	var hard_ver = getHardware_Version()
    $(xml).find("Tab").each(function()
    {

        var tabName=jQuery.i18n.prop($(this).attr("Name").toString());
		var tname = $(this).attr("Name").toString()
		if(tname!='tSms'||hard_ver == "Ver.A"||hard_ver == "Ver.D"){ 
		var menu = new Array(0);
        var i=0, i2 = 0;
		if($(this).attr("type").toString()=='submenuabsent'){
			if($(this).attr("xmlName").toString()!=''){
            menu[i] = new Array(2);
			menu[i][0]=$(this).attr("implFunction").toString();
            menu[i][1]=$(this).attr("xmlName").toString();
            i++;}
        }else{
		//console.log($(this).find("Menues"),$(this).find("Menues").length, 'Menues');
		if( $(this).find("Menues").length > 1 ){

	        	$(this).find("Menues").each(function(){
				menu[i] = [];
				var mid = $(this).attr("id").toString();
				$(this).find("Menu").each(function(){
					menu[i].push( [$(this).attr("id").toString(),  $(this).attr("implFunction").toString(),  $(this).attr("xmlName").toString(), mid] );
				});

	            		i++;
	        	});
		} else {
			$(this).find("Menu").each(function(){
				menu[i] = [];
				menu[i][0]=$(this).attr("id").toString();
	                    menu[i][1]=$(this).attr("implFunction").toString();
	                    menu[i][2]=$(this).attr("xmlName").toString();
				i++;
			});
		}

        }
        g_menues[menuIndex++] = menu;
       // console.log(menu, menuIndex);
        document.getElementById('menu').innerHTML +="<li><a href='#' id="+menuIndex+" onClick='createMenu("+menuIndex+")'>"+tabName+"</a></li>";
			}
    });
}
/*
 * Create the submeny from XML items
 */
function createMenu(index)
{
     var temp = index;
     removeMenuClass();
    document.getElementById(temp.toString()).className = "on";
     var menu = g_menues[index-1];
     if(menu[0].length==2){
        clearRefreshTimers();
        var obj = eval('$("#mainColumn").'+ menu[0][0] + '({})');
         obj.setXMLName(menu[0][1]);
        // helpPage =  "quick_setup";
         g_objContent = obj;
         obj.onLoad(true);

    }else{
       document.getElementById('mainColumn').innerHTML ="";
       document.getElementById('mainColumn').innerHTML ="<div class='leftBar'><ul class='leftMenu' id='submenu'></ul></div><div id='Content' class='content'></div><br class='clear /><br class='clear />";
	var indx =0;
    for(var i=0;i<menu.length;i++) {

	if($.isArray(menu[i][0])){
		var submenus = [];
		 //console.log(menu[i]);
		for(var i2 = 0; i2< menu[i].length; i2++){
		    var menustr = "\"" + menu[i][i2][0] + "\"" ;
                 submenus.push("<ul id="+menustr+"><a href=\"#\" onClick='displayForm("+menustr+")'>"+ jQuery.i18n.prop(menu[i][i2][0])+"</a></ul>");
		}
		indx++;
		document.getElementById('submenu').innerHTML += "<li><a href=\"#\"  onClick='openMenu(\"submenu"+indx+"\")'>"+ jQuery.i18n.prop(menu[i][0][3])+"</a><ul style='display:none;' id='submenu"+ indx +"'>"+submenus.join("")+"</ul></li>";
		
	}else{
	   var menustr = "\"" + menu[i][0] + "\"" ;
       document.getElementById('submenu').innerHTML += "<li id="+menustr+"><a href=\"#\" onClick='displayForm("+menustr+")'>"+ jQuery.i18n.prop(menu[i][0])+"</a></li>";

	}

    }
	if($.isArray(menu[0][0])){
	//	if(i2== '3'){
		openMenu("submenu1");
		displayForm(menu[0][0][0]);

	}else{
	   displayForm(menu[0][0]);
	}
   
    }
}
//var helpPage = "help_en.html";
//jmm add for menu2

function createsetMenu(index){
     var temp = index;
     removeMenuClass();
    document.getElementById(temp.toString()).className = "on";
     var menu = g_menues[index-1];
     if(menu[0].length==2){
        clearRefreshTimers();
        var obj = eval('$("#mainColumn").'+ menu[0][0] + '({})');
         obj.setXMLName(menu[0][1]);
        // helpPage =  "quick_setup";
         g_objContent = obj;
		 obj.onLoad(true);
    }else{
       document.getElementById('mainColumn').innerHTML ="";
       document.getElementById('mainColumn').innerHTML ="<div class='leftBar'><ul class='leftMenu' id='submenu'></ul></div><div id='Content' class='content'></div><br class='clear /><br class='clear />";
	var indx =0;
    for(var i=0;i<menu.length;i++) {

	if($.isArray(menu[i][0])){
		var submenus = [];
		 //console.log(menu[i]);
		for(var i2 = 0; i2< menu[i].length; i2++){
		    var menustr = "\"" + menu[i][i2][0] + "\"" ;
                 submenus.push("<ul id="+menustr+"><a href=\"#\" onClick='displayForm("+menustr+")'>"+ jQuery.i18n.prop(menu[i][i2][0])+"</a></ul>");
		}
		indx++;
		document.getElementById('submenu').innerHTML += "<li><a href=\"#\"  onClick='openMenu(\"submenu"+indx+"\")'>"+ jQuery.i18n.prop(menu[i][0][3])+"</a><ul style='display:none;' id='submenu"+ indx +"'>"+submenus.join("")+"</ul></li>";
		
	}else{
	   var menustr = "\"" + menu[i][0] + "\"" ;
       document.getElementById('submenu').innerHTML += "<li id="+menustr+"><a href=\"#\" onClick='displayForm("+menustr+")'>"+ jQuery.i18n.prop(menu[i][0])+"</a></li>";

	}

    }

    }
}

function removeMenuClass(){
  if(g_menues.length>0)
  for(var j=1;j<=g_menues.length;j++)
         document.getElementById(j.toString()).className = "";
}
 /*
 * Function for passing the JavaScript
 */
function createMenuFromXML(){
    callXML("xml/ui_" + g_platformName + ".xml",parseXml);
    /*adjust main menu layout according the menu number
	add by llzhou 9/1/2013*/

    $(".navigation ul li").width(($(".header").width()-8*2)/g_menues.length-1);

}
/*
 * Check which item is selected and take appropriate action to execute the
 * panel class, and call his onLoad function as well as set the XML Name
 */
function displayForm(clickedItem){
 //document.getElementById("divDateTime").innerHTML ="";

   clearRefreshTimers();


 if(document.getElementById(g_clickedItem)!=null)
  document.getElementById(g_clickedItem).className = "";
  g_clickedItem = clickedItem;
  g_objContent = null;
 for(var i=0;i<g_menues.length;i++){
    var _menu = g_menues[i];
    for(var j=0;j<_menu.length;j++){

    if(_menu[j][2]!='temp'){
    if(_menu[j][0]==clickedItem && !$.isArray( clickedItem )){
         document.getElementById(clickedItem).className = "on";

        var obj = eval('$("#Content").'+ _menu[j][1] + '("'+ _menu[j][0]+'")');
       // helpPage =  jQuery.i18n.prop(_menu[j][0].toString()).replace(/\s+/g,'');
         obj.setXMLName(_menu[j][2]);
         g_objContent = obj;
		 obj.onLoad(true);
        break;
    }else{
	if( $.isArray( _menu[j][0] ) ){
		for(var k=0;k<_menu[j].length;k++){
			 if(_menu[j][k][0]==clickedItem && !$.isArray( clickedItem )){
			         document.getElementById(clickedItem).className = "on";

			        var obj = eval('$("#Content").'+ _menu[j][k][1] + '("'+ _menu[j][k][0]+'")');
			       // helpPage =  jQuery.i18n.prop(_menu[j][0].toString()).replace(/\s+/g,'');
			         obj.setXMLName(_menu[j][k][2]);
			         g_objContent = obj;
					 obj.onLoad(true);
			         break;
			}
		}
	}
    }
    }
  }
}

if(g_objContent == null)
 document.getElementById("Content").innerHTML = "";
}

function clearRefreshTimers(){
      clearInterval(_dashboardIntervalID);
     clearInterval(_connectedDeviceIntervalID);
     clearInterval(_trafficstatisticsIntervalID);
     clearInterval(_networkActivityIntervalID);
     clearInterval(_storageSettingsIntervalID);
     clearInterval(_WiFiIntervalID);
     clearInterval(_timeSettingsIntervalID);
	 clearInterval(_zstimeSettingsIntervalID)
}
function dashboardOnClick(menuIndex,subMenuID){

    //document.getElementById('mainColumn').innerHTML ="<div class='leftBar'><ul class='leftMenu' id='submenu'></ul></div><div id='Content' class='content'></div><br class='clear /><br class='clear />";
    //createMenu(menuIndex);
    var selMenuIdx ,selMenuIdx2;
    for (var menuIdx = 0; menuIdx < g_menues.length; ++menuIdx) {
        var menu = g_menues[menuIdx];
		
		if ("mDHCP_Settings"==g_menues[menuIdx][0][0][0] ){//cmcc change from 3 to 4 to avoid dashboard quicklink can't find sms 
        for (var subMenuIdx = 0; subMenuIdx < menu.length; ++subMenuIdx) {
			var menu2 = menu[subMenuIdx];
			for (var subMenuIdx2 = 0; subMenuIdx2 < menu2.length; ++subMenuIdx2) {
            if (subMenuID == menu[subMenuIdx][subMenuIdx2][0]) {
                selMenuIdx = menuIdx + 1;
				selMenuIdx2 = subMenuIdx + 1;
                break;
            	}
        	}
        }
	}
		else {
		for (var subMenuIdx = 0; subMenuIdx < menu.length; ++subMenuIdx) {
			if (subMenuID == menu[subMenuIdx][0]) {
				selMenuIdx = menuIdx + 1;
				break;
				}
			}
		}
    }
	if (selMenuIdx == 4){
   		createsetMenu(selMenuIdx,selMenuIdx2);
		var ul = document.getElementById(subMenuID);
		var $ul = $(ul);
		$ul.parent("ul").show();
		$ul.parent("ul").parent("li").siblings("li").children("ul").hide();
		$ul.parent("ul").parent("li").siblings("li").children("ul").siblings("a").css("color","#333");
		$ul.parent("ul").parent("li").siblings("li").children("ul").siblings("a").css("font-weight","normal");
		$ul.parent("ul").siblings("a").css("color","#297acc");
		$ul.parent("ul").siblings("a").css("font-weight","bold");
		//document.getElementById("submenu3").style.borderBottom = "1px solid #e5e5e5";
		//$ul.parents("ul").style.borderBottom = "1px solid #e5e5e5";
		$ul.parent("ul").css("borderBottom","1px solid #e5e5e5");
	}else
		createsetMenu(selMenuIdx);
    displayForm(subMenuID);
}

function openMenu( id ) {
	var ul = document.getElementById(id);
	var $ul = $(ul);
	if( ul.style.display=='none'){
		$ul.show();
		$ul.siblings("a").css("color","#297acc");
		$ul.siblings("a").css("font-weight","bold");
	}else{
		$ul.hide();
		$ul.siblings("a").css("color","#333");
		$ul.siblings("a").css("font-weight","normal");
	}
document.getElementById("submenu3").style.borderBottom = "1px solid #e5e5e5";
}
