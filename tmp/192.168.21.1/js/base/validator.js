function isIPFULL(inputString,flag) {
var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
if(!flag){
    if(inputString=="...")
        return true;
    else
       isIPFULL(inputString,true);
}
 //test the input string against the regular expression
 if (re.test(inputString)) {

   //now, validate the separate parts
   var parts = inputString.split(".");
   if (parseInt(parseFloat(parts[0])) == 0) {
   	if(parseInt(parseFloat(parts[1])) == 0&&parseInt(parseFloat(parts[2])) == 0&&parseInt(parseFloat(parts[3])) == 0){
		return true;
		}else
     return false;
   }
    if (parseInt(parseFloat(parts[3])) == 0 /*|| inputString=="192.168.0.1"*/) {
     return false;
   }
   for (var i=0; i<parts.length; i++) {
     if (parseInt(parseFloat(parts[i])) > 255) {
       return false;
     }
   }
   return true;
 }
 else {
   return false;
 }
}
function isIP(obj) {
    obj = obj.toString();
    if (parseInt(parseFloat(obj)) > 255)
       return false;
       else
       return true;
}

function isNumber(obj) {
    if( typeof(obj) === 'string' )
    {
		var r = /^-?\d+$/;
		return r.test(obj); 
    }
    if(typeof(obj) === "number")
    {
    	if(obj.toString().indexOf(".") != -1)
		return false;
	else
		return true;
    }
    return false;
}

function textBoxMinLength(control,value) {
    if(document.getElementById(control).value.length < value)
        return false;
    else
        return true;
}
function isChineseChar(value) {
	if(/.*[\u0100-\uffff]+.*$/.test(value))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function textBoxMaxLength(control,value) {
    if(document.getElementById(control).value.length > value)
        return false;
    else
        return true;
}

function textBoxLength(control,value) {
    if(document.getElementById(control).value.length == value)
        return true;
    else
        return false;
}

function IsPhoneNumber(phoneNumber) {
    var pattern = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^\+?[0-9]{3,15}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)/;
    if (pattern.test(phoneNumber)) {
        return true;
    }
    else {
        return false;
    }
}

function deviceNameValidationchinese(str) {
    

	if (str.toString().indexOf("#") != -1)
	    return false;
	else if (str.toString().indexOf(":") != -1)
	    return false;
	else if (str.toString().indexOf(" ") != -1)
	    return false;
	else if (str.toString().indexOf("&") != -1)
	    return false;
	else if (str.toString().indexOf(";") != -1)
	    return false;
	else if (str.toString().indexOf("~") != -1)
	    return false;
	else if (str.toString().indexOf("|") != -1)
	    return false;
	else if (str.toString().indexOf("<") != -1)
	    return false;
	else if (str.toString().indexOf(">") != -1)
	    return false;
	else if (str.toString().indexOf("$") != -1)
	    return false;
	else if (str.toString().indexOf("%") != -1)
	    return false;
	else if (str.toString().indexOf("^") != -1)
	    return false;
	else if (str.toString().indexOf("!") != -1)
	    return false;
	else if (str.toString().indexOf("@") != -1)
	    return false;
	else if (str.toString().indexOf(",") != -1)
	    return false;
	else
	    return true;
	}
	
function deviceNameValidation(str) {
    if (isChineseChar(str)) {
        return false;   }

	if (str.toString().indexOf("#") != -1)
	    return false;
	else if (str.toString().indexOf(":") != -1)
	    return false;
	else if (str.toString().indexOf(" ") != -1)
	    return false;
	else if (str.toString().indexOf("&") != -1)
	    return false;
	else if (str.toString().indexOf(";") != -1)
	    return false;
	else if (str.toString().indexOf("~") != -1)
	    return false;
	else if (str.toString().indexOf("|") != -1)
	    return false;
	else if (str.toString().indexOf("<") != -1)
	    return false;
	else if (str.toString().indexOf(">") != -1)
	    return false;
	else if (str.toString().indexOf("$") != -1)
	    return false;
	else if (str.toString().indexOf("%") != -1)
	    return false;
	else if (str.toString().indexOf("^") != -1)
	    return false;
	else if (str.toString().indexOf("!") != -1)
	    return false;
	else if (str.toString().indexOf("@") != -1)
	    return false;
	else if (str.toString().indexOf(",") != -1)
	    return false;
	else
	    return true;}

function isIPv6(str) {
    return str.match(/:/g) != null
        && str.match(/:/g).length <= 15
		&& /::/.test(str)
		? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)
		: /^([\da-f]{1,4}:){15}[\da-f]{1,4}$/i.test(str);
}

function isIPv4(ipAddr) {
    var exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/; 
    var reg = ipAddr.match(exp); 
  
   if(reg==null){       
        return false;   
     }else{
         return true;
     }
}