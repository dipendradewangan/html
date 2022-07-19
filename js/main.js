// register coding start

window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msWebkitIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    document.write("Please update your browser");
}

else {
    $(document).ready(function () {
        $("#register-form").submit(function () {
            let school_name = $("#school-name").val();
            let tag_line = $("#tag-line").val();
            let email = $("#email").val();
            let password = $("#password").val();
            let website = $("#website").val();
            let mobile = $("#mobile").val();
            let phone = $("#phone").val();
            let address = $("#address").val();
            let database = window.indexedDB.open(school_name);
            database.onsuccess = function () {
                $("#message").removeClass("d-none");
                $("#message").addClass("alert-success");
                $("#register-form").trigger("reset");
                $("#message").html('<b>Success !</b> dear admin please login....');
                setTimeout(() => {
                    $("#message").addClass("d-none");
                    $("#message").addClass("alert-success");
                    $("[href='#login']").click();
                }, 2000);
            }

            database.onerror = function () {
                $("#message").removeClass("d-none");
                $("#message").addClass("alert-warning");
                $("#message").html("<b>Oops !</b> something went wrong please contact 9934946118 <i class='fa fa-close close' data-dismiss='alert'></i>");

            }   
            
            database.onupgradeneeded = function(){
                let idb = this.result;
                let data = {
                    school_name : school_name,
                    tag_line : tag_line,
                    email : email,
                    website :website,
                    mobile : mobile,
                    password : password,
                    phone : phone,
                    address : address
                };
                let object = idb.createObjectStore("about_school",{keyPath: "school_name"});
                object.add(data);
            }
            return false;
        });
    });
}


// register coding start

// login coding start

$(document).ready(function(){
    $("#login-form").submit(function(){
        let username = $("#username").val();
        let password = $("#login-password").val();
        let login_data = {
            username : username,
            password : password
        };
        
        let session_login_data = JSON.stringify(login_data);
        sessionStorage.setItem("login",session_login_data);
        if(sessionStorage.getItem("login") != null){
            let user_database = window.indexedDB.databases();
            user_database.then(function(pending_obj){
                for(i = 0; i<pending_obj.length;i++){
                    let db_name = pending_obj[i].name;
                    let database = window.indexedDB.open(db_name);
                    database.onsuccess = function(){
                        let idb = this.result;
                        let permission =  idb.transaction("about_school","readwrite");
                        let access = permission.objectStore("about_school");
                        let database = access.get(db_name);
                        database.onsuccess = function(){
                            let user = this.result;
                            if(user){
                                let db_username = user.email;
                                let db_password = user.password;
                                let session_data = JSON.parse(sessionStorage.getItem("login"));
                                if(db_username == session_data.username){
                                    if(db_password == session_data.password){
                                        window.location = "success/welcome.html";
                                    }
                                    else{
                                        $("#login-alert").removeClass("d-none");
                                        $("#login-alert").addClass("alert-warning");
                                        $("#login-alert").html("<b>Wrong password !</b>");
                                        
                                    }
                                }   
                                else{
                                    $("#login-alert").removeClass("d-none");
                                    $("#login-alert").addClass("alert-warning");
                                    $("#login-alert").html("<b>User not found !</b>");
                                    
                                }
                            }
                            else{
                                alert("key not exist");
                            }
                        }
                    }
                }
            });
        }
        else{
            $("#login-alert").removeClass("d-none")
            $("#login-alert").addClass("alert-warning");
            $("#login-alert").html("<b>Session failed !</b> Please try again....");
            setTimeout(() => {
                $("#login-alert").addClass("d-none");
                $("#login-alert").removeClass("alert-warning");
                $(this).trigger("reset");
            }, 2000);
        }

    });
});

// login coding end