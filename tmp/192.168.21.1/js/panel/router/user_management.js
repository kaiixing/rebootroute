var g_login_name;
var g_login_password;
var gMtltiAccount;
var bEditAccount;
var _arrayTableDataAccount = new Array(0);
(function($) {
    $.fn.objUserManage = function(InIt) {

        var controlMapExisting=new Array(0);
        var controlMapCurrent=new Array(0);
        var xmlName = '';

        this.onLoad = function (flag) {

            var index = 0;
            _arrayTableDataAccount = new Array(0);
            var indexAccount = 0;
			if(flag){
            	this.loadHTML();
           	 	document.getElementById("title").innerHTML = jQuery.i18n.prop(InIt);
            
            	var arrayLabels = document.getElementsByTagName("label");
            	lableLocaliztion(arrayLabels);
            	var buttonID = document.getElementById("btUpdate").id;
            	buttonLocaliztion(buttonID);
            	buttonLocaliztion("btnAddNewAccount");

            	arrayLabels = document.getElementsByTagName("th");
            	lableLocaliztion(arrayLabels);

            	arrayLabels = document.getElementsByTagName("td");
            	lableLocaliztion(arrayLabels);

            	arrayLabels = document.getElementsByTagName("h1");
            	lableLocaliztion(arrayLabels);
				
            	$("#opt_restricted").text(jQuery.i18n.prop("opt_restricted"));
            	$("#opt_standard").text(jQuery.i18n.prop("opt_standard"));
			}

			var xml = getData(xmlName);


            var _router_username;
            var _router_password;

            var router_username_;
            var router_password_;
            var authority;
            var login_account_index;
            var is_admin_account;
            g_login_name = '';
            g_login_password = '';

            $(xml).find("management").each(function() {
                gMtltiAccount = $(this).find("multi_account").text();
                _router_username = decodeURIComponent($(this).find("router_username").text());
                _router_password = decodeURIComponent($(this).find("router_password").text());
            });

            if(gMtltiAccount == "0") { //single account
                document.getElementById("User_Password_Reset_div").style.display = "block";
                document.getElementById("User_Account_div").style.display = "none";
                document.getElementById("tbrouter_username").value = _router_username;
                //document.getElementById("tbrouter_username").readonly = true;
                document.getElementById("tbrouter_password").value = _router_password;
                document.getElementById("tbreenter_password").value = decodeURIComponent($(this).find("router_password").text());

                controlMapExisting = g_objXML.putMapElement(controlMapExisting,index++, "RGW/management/router_username", _router_username);
                controlMapExisting = g_objXML.putMapElement(controlMapExisting,index, "RGW/management/router_password", _router_password);
                controlMapCurrent = g_objXML.copyArray(controlMapExisting,controlMapCurrent);
            } else {
                // mutil accounts
                document.getElementById("User_Password_Reset_div").style.display = "none";
                document.getElementById("User_Account_div").style.display = "block";
                $(xml).find("router_user_list").each(function() {
                    $(this).find("Item").each(function() {
                        router_username_ = decodeURIComponent($(this).find("username").text());
                        router_password_ = decodeURIComponent($(this).find("password").text());
                        authority = $(this).find("authority").text();
                        if(router_username_ == username) {
                            login_account_index = indexAccount;
                        }
                        _arrayTableDataAccount[indexAccount] = new Array(3);
                        _arrayTableDataAccount[indexAccount][0] = router_username_;
                        _arrayTableDataAccount[indexAccount][1] = router_password_;
                        _arrayTableDataAccount[indexAccount][2] = authority;
                        indexAccount++;

                    });
                });
                if(indexAccount > 0) {
                    g_login_name = _arrayTableDataAccount[login_account_index][0];
                    g_login_password = _arrayTableDataAccount[login_account_index][1];
                    is_admin_account = _arrayTableDataAccount[login_account_index][2];
                }

                loadAccountTable(_arrayTableDataAccount);

                if(g_login_name !="admin") {
                    $("#btnAddNewAccount").attr("disabled",true);
                    //$("#btnwrpAddAccount").removeClass("btnWrp");
                    //$("#btnwrpAddAccount").addClass("disabledBtn");
                    $("#btnAddNewAccount").css({
                    'background-image':'url(../images/disabledBtn.png)',
                    'color':'#adadad',
                    'cursor':'default'
                    });

                } else {
                    $("#btnAddNewAccount").prop("disabled",false);
                }
            }
        }


		function AdminCallBackFun(retXml) {

            var index = 0;
            _arrayTableDataAccount = new Array(0);
            var indexAccount = 0;
			

            var _router_username;
            var _router_password;

            var router_username_;
            var router_password_;
            var authority;
            var login_account_index;
            var is_admin_account;
            g_login_name = '';
            g_login_password = '';

            $(retXml).find("management").each(function() {
                gMtltiAccount = $(this).find("multi_account").text();
                _router_username = decodeURIComponent($(this).find("router_username").text());
                _router_password = decodeURIComponent($(this).find("router_password").text());
            });

            if(gMtltiAccount == "0") { //single account
                document.getElementById("User_Password_Reset_div").style.display = "block";
                document.getElementById("User_Account_div").style.display = "none";
                document.getElementById("tbrouter_username").value = _router_username;
                //document.getElementById("tbrouter_username").readonly = true;
                document.getElementById("tbrouter_password").value = _router_password;
                document.getElementById("tbreenter_password").value = decodeURIComponent($(this).find("router_password").text());

                controlMapExisting = g_objXML.putMapElement(controlMapExisting,index++, "RGW/management/router_username", _router_username);
                controlMapExisting = g_objXML.putMapElement(controlMapExisting,index, "RGW/management/router_password", _router_password);
                controlMapCurrent = g_objXML.copyArray(controlMapExisting,controlMapCurrent);
            } else {
                // mutil accounts
                document.getElementById("User_Password_Reset_div").style.display = "none";
                document.getElementById("User_Account_div").style.display = "block";
                $(retXml).find("router_user_list").each(function() {
                    $(this).find("Item").each(function() {
                        router_username_ = decodeURIComponent($(this).find("username").text());
                        router_password_ = decodeURIComponent($(this).find("password").text());
                        authority = $(this).find("authority").text();
                        if(router_username_ == username) {
                            login_account_index = indexAccount;							
                        }
                        _arrayTableDataAccount[indexAccount] = new Array(3);
                        _arrayTableDataAccount[indexAccount][0] = router_username_;
                        _arrayTableDataAccount[indexAccount][1] = router_password_;
                        _arrayTableDataAccount[indexAccount][2] = authority;
                        indexAccount++;

                    });
                });
                if(indexAccount > 0) {
                    g_login_name = _arrayTableDataAccount[login_account_index][0];
                    g_login_password = _arrayTableDataAccount[login_account_index][1];
                    is_admin_account = _arrayTableDataAccount[login_account_index][2];	
					username = g_login_name;
					passwd = g_login_password;
                }

                loadAccountTable(_arrayTableDataAccount);

                if(g_login_name !="admin") {
                    $("#btnAddNewAccount").prop("disabled",true); 
                    $("#btnAddNewAccount").css({
                    'background-image':'url(../images/disabledBtn.png)',
                    'color':'#adadad',
                    'cursor':'default'
                    });

                } else {
                    $("#btnAddNewAccount").prop("disabled",false);
                }
            }
        }

        function loadAccountTable(arrayTableData) {

            var tableUserAccount = document.getElementById('tableUserAccount');
            var tBodytable = tableUserAccount.getElementsByTagName('tbody')[0];
            clearTabaleRows('tableUserAccount');
            if (arrayTableData.length == 0) {
                var row1 = tBodytable.insertRow(0);
                var rowCol1 = row1.insertCell(0);
                rowCol1.colSpan = 3;
                rowCol1.innerHTML = jQuery.i18n.prop("tableNoData");
            } else {
                for (var i = 0; i < arrayTableData.length; i++) {
                    var arrayTableDataRow = arrayTableData[i];
                    var row = tBodytable.insertRow(-1);

                    var AccountNameCol = row.insertCell(0);
                    //var AuthorityCol = row.insertCell(1);
                    var removeCol = row.insertCell(1);

                    var _name = decodeURIComponent(arrayTableDataRow[0]);
                    AccountNameCol.innerHTML =_name;


                    removeCol.innerHTML = "<a href='#' id='table_remove_link"+i+"' onclick='AccountClicked(" + i + ")'>" +jQuery.i18n.prop("lRemove") + "</a>";

                    if(g_login_name !="admin") {
                        if( g_login_name != _name) {
                            $("#table_username_link"+i+"").attr("onclick", null);
                            $("#table_username_link"+i+"").css("color", "gray");
                        }
                        $("#table_remove_link"+i+"").attr("onclick", null);
                        $("#table_remove_link"+i+"").css("color", "gray");
                    } else if( g_login_name == _name) {
                        //$("#table_remove_link"+i+"").attr("onclick", null);
                        //$("#table_remove_link"+i+"").css("color", "gray");
                    }



                }
            }
            Table.stripe(tableUserAccount, "alternate", "table-stripeclass");
        }
        this.getTableAccountDataRow = function(index) {
            return _arrayTableDataAccount[index];
        }
        this.postAccountItem = function(index, isDeleted, name, password, authority) {
            var itemIndex = 0;
            mapData = null;
            mapData = new Array();

            var login_username = encodeURIComponent(document.getElementById("tbrouter_username").value);
            var login_password = encodeURIComponent(document.getElementById("tbrouter_password").value);

            this.putMapElement("RGW/management/router_username", login_username, itemIndex++);
            this.putMapElement("RGW/management/router_password", login_password, itemIndex++);
            // delete
            if (isDeleted) {
                var _name = encodeURIComponent(name);
                var _password = encodeURIComponent(password);

                this.putMapElement("RGW/management/account_management/account_action", 2, itemIndex++);//delete
                this.putMapElement("RGW/management/account_management/account_username", _name, itemIndex++);
                this.putMapElement("RGW/management/account_management/account_password", _password, itemIndex++);
                this.putMapElement("RGW/management/router_user_list/Item#index", index, itemIndex++);
                this.putMapElement("RGW/management/router_user_list/Item/username#delete", _name, itemIndex++);
            } else { //edit or add
                var item_name = encodeURIComponent(name);
                var item_password = encodeURIComponent(password);

                this.putMapElement("RGW/management/account_management/account_action", 1, itemIndex++);//edit or add
                this.putMapElement("RGW/management/account_management/account_username", item_name, itemIndex++);
                this.putMapElement("RGW/management/account_management/account_password", item_password, itemIndex++);
                //this.putMapElement("RGW/management/router_user_list/Item#index", index, itemIndex++);
                this.putMapElement("RGW/management/router_user_list/Item/username", item_name, itemIndex++);
                this.putMapElement("RGW/management/router_user_list/Item/password", item_password, itemIndex++);
                this.putMapElement("RGW/management/router_user_list/Item/authority", authority, itemIndex++);
            }

            if (mapData.length > 0) {
                //postXML(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)));
                PostXMLWithResponse(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(mapData)),AdminCallBackFun);
            }
        }
        this.putMapElement = function(xpath, value, index) {
            mapData[index] = new Array(2);
            mapData[index][0] = xpath;
            mapData[index][1] = value;
        }
        this.onPost  =  function  () {


            if(this.isValid()) {
                document.getElementById('lPassErrorMes').style.display = 'none';
                var _controlMap = this.getPostData();
                if(_controlMap.length>0) {
                    PostXMLWithResponse(xmlName, g_objXML.getXMLDocToString(g_objXML.createXML(_controlMap)),AdminCallBackFun);
                }
            }
        }
        this.onPostSuccess = function() {
            if(gMtltiAccount == "0") {
                //username = encodeURIComponent(document.getElementById("tbrouter_username").value);
                //passwd = encodeURIComponent(document.getElementById("tbrouter_password").value);
            }
            this.onLoad(false);
        }
        this.isValid = function () {
            return isValidAdminPage();
        }
        this.getPostData = function () {
            var index = 0;
            var mapData = new Array(0);
            controlMapCurrent[index++][1] = encodeURIComponent(document.getElementById("tbrouter_username").value);
            controlMapCurrent[index++][1] = encodeURIComponent(document.getElementById("tbrouter_password").value);
            mapData = g_objXML.copyArray(controlMapCurrent,mapData);
            mapData = g_objXML.getChangedArray(controlMapExisting,mapData,true);
            return mapData;
        }
        this.setXMLName = function (_xmlname) {
            xmlName = _xmlname;
        }

        this.loadHTML = function() {
            document.getElementById('Content').innerHTML = "";
            document.getElementById('Content').innerHTML = callProductHTML("html/router/user_management.html");
        }
        return this.each(function () {


        });
    }
})(jQuery);

function passwordChanged() {
    document.getElementById("tbreenter_password").value = '';
    document.getElementById('lRePassword').style.display = 'block';
    document.getElementById('tbreenter_password').style.display = 'block';

}

function validatePassword() {
    if(document.getElementById('tbrouter_password').value!=document.getElementById('tbreenter_password').value) {
        document.getElementById('lPassErrorMes').style.display = 'block';
        document.getElementById('lPassErrorMes').innerHTML=jQuery.i18n.prop('lPassErrorMes');
        document.getElementById("tbreenter_password").value = '';
    } else {
        document.getElementById('lPassErrorMes').style.display = 'none';
        setData();
    }
}
function isValidAdminPage() {
    if(!(textBoxMinLength("tbrouter_username",4) && textBoxMinLength("tbrouter_password",6))) {
        document.getElementById('lPassErrorMes').style.display = 'block';
        document.getElementById('lPassErrorMes').innerHTML = jQuery.i18n.prop('lminLengthError');
        return false;
    }
    if(!(textBoxMaxLength("tbrouter_username",20) && textBoxMaxLength("tbrouter_password",32))) {
        document.getElementById('lPassErrorMes').style.display = 'block';
        document.getElementById('lPassErrorMes').innerHTML = jQuery.i18n.prop('lmaxLengthError');
        return false;
    }
    if(!deviceNameValidation(document.getElementById('tbrouter_username').value)) {
        document.getElementById('lPassErrorMes').style.display = 'block';
        document.getElementById('lPassErrorMes').innerHTML = jQuery.i18n.prop('ErrInvalidUserPass');
        return false;
    }
    if(!deviceNameValidation(document.getElementById('tbrouter_password').value)) {
        document.getElementById('lPassErrorMes').style.display = 'block';
        document.getElementById('lPassErrorMes').innerHTML = jQuery.i18n.prop('ErrInvalidUserPass');
        return false;
    }
    return true;
}

function deleteAccountItem(index) {
    var data = g_objContent.getTableAccountDataRow(index);
    g_objContent.postAccountItem(index, true, data[0],data[1]);
}

function AddNewAccount() {

    if (document.getElementById("tableUserAccount").rows.length <= 4) {
        sm("MBAccount_Popup", 450, 200);
        localizeMBAccount();
        document.getElementById("txtAccountName").readOnly = false;
        //$("#AccountGroupSelect").val(0);
        //$("#AccountGroupSelect").prop("disabled",true);
        $("#txtAccountName").prop("readonly", false);
        $("#txtAccountName").prop("disabled", false);
        bEditAccount = false; //add account
    } else {
        showAlert(jQuery.i18n.prop("lMaxAccountError"));
    }
}

function localizeMBAccount() {
    document.getElementById("h1AccountEdit").innerHTML = jQuery.i18n.prop("h1AccountEdit");
    document.getElementById("lAccountName").innerHTML = jQuery.i18n.prop("lAccountName");
    document.getElementById("lAccountPassword").innerHTML = jQuery.i18n.prop("lAccountPassword");
    document.getElementById("lReAccountPassword").innerHTML = jQuery.i18n.prop("lReAccountPassword");
   // document.getElementById("lAccountAuthority").innerHTML = jQuery.i18n.prop("lAccountAuthority");
    document.getElementById("btnCancel").innerHTML = jQuery.i18n.prop("btnCancel");
    buttonLocaliztion(document.getElementById("btnOk").id);
}

function AccountClicked(index) {
    sm("MBAccount_Popup", 430, 180);
    localizeMBAccount();

    var data = g_objContent.getTableAccountDataRow(index);

    document.getElementById("txtAccountName").value = data[0];
    document.getElementById("txtAccountName").readonly = true;
    //document.getElementById("txtAccountPassword").value = decodeURIComponent(data[1]);
    //document.getElementById("txtReAccountPassword").value = decodeURIComponent(data[1]);//decodeURIComponent
    //document.getElementById("AccountGroupSelect").value = data[2];
    //$("#AccountGroupSelect").prop("disabled",true);
    $("#txtAccountName").prop("disabled", true);
    $("#txtAccountName").prop("readonly", true);
    bEditAccount = true; //edit
}

function tablepasswordChanged() {
    document.getElementById("txtReAccountPassword").value = '';
    document.getElementById('lReAccountPassword').style.display = 'block';
    document.getElementById('txtReAccountPassword').style.display = 'block';

}

function isValidAccountPage() {
    if(!(textBoxMinLength("txtAccountName",4) && textBoxMinLength("txtAccountPassword",6))) {
        document.getElementById('lTablePassErrorMes').style.display = 'block';
        document.getElementById('lTablePassErrorMes').innerHTML = jQuery.i18n.prop('lminLengthError');
        return false;
    }
    if(!(textBoxMaxLength("txtAccountName",32) && textBoxMaxLength("txtAccountPassword",32))) {
        document.getElementById('lTablePassErrorMes').style.display = 'block';
        document.getElementById('lTablePassErrorMes').innerHTML = jQuery.i18n.prop('lmaxLengthError');
        return false;
    }
    if(!deviceNameValidation(document.getElementById('txtAccountName').value)) {
        document.getElementById('lTablePassErrorMes').style.display = 'block';
        document.getElementById('lTablePassErrorMes').innerHTML = jQuery.i18n.prop('ErrInvalidUserPass');
        return false;
    }
    if(!deviceNameValidation(document.getElementById('txtAccountPassword').value)) {
        document.getElementById('lTablePassErrorMes').style.display = 'block';
        document.getElementById('lTablePassErrorMes').innerHTML = jQuery.i18n.prop('ErrInvalidUserPass');
        return false;
    }
    return true;
}

function btnOKClickedEditAccount() {
    var AccountName, AccountPassword, AccountRePassword, AccountAuthority,OldAccountPassword ;

    AccountName = encodeURIComponent(document.getElementById("txtAccountName").value);
	OldAccountPassword = encodeURIComponent(document.getElementById("txtOldAccountPassword").value);
    AccountPassword = document.getElementById("txtAccountPassword").value;
    AccountRePassword = document.getElementById("txtReAccountPassword").value;
    //AccountAuthority = document.getElementById("AccountGroupSelect").value;
    var login_done;
            if(AccountName=="" ||OldAccountPassword=="")
            	login_done = 0;
            else
            	login_done = doLogin(AccountName,OldAccountPassword)
	    if(login_done == 1){

    if(!bEditAccount) { //add new account
        for (var idx = 0; idx < _arrayTableDataAccount.length; ++idx) {
            if (AccountName == _arrayTableDataAccount[idx][0]) {
                document.getElementById('lTablePassErrorMes').style.display = 'block';
                document.getElementById('lTablePassErrorMes').innerHTML = jQuery.i18n.prop('lAccountExist');
                return;
            }
        }
    }

    if(document.getElementById('txtAccountPassword').value != document.getElementById('txtReAccountPassword').value) {
        document.getElementById('lTablePassErrorMes').style.display = 'block';
        document.getElementById('lTablePassErrorMes').innerHTML=jQuery.i18n.prop('lPassErrorMes');
        document.getElementById("txtReAccountPassword").value = '';
    } else {
        document.getElementById('lTablePassErrorMes').style.display = 'none';
        if(isValidAccountPage()) {
            document.getElementById('lTablePassErrorMes').style.display = 'none';
            g_objContent.postAccountItem(0,false, AccountName,AccountPassword,AccountAuthority);

        }
    }
	    	}else {
               document.getElementById('loldpassworderror').style.display = 'block';
               if(login_done == 0)
                    document.getElementById("loldpassworderror").innerHTML = jQuery.i18n.prop("loldpassworderror");
	       else if(login_done == -1)
		    document.getElementById("loldpassworderror").innerHTML = jQuery.i18n.prop("lnoconn");
            }
		
}

function btnCancelClickedAccountEdit() {
    hm();
}
