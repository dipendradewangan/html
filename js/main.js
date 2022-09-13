// register coding start

window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msWebkitIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;



// login or register page opening coding start

let db = window.indexedDB.databases();
db.then(function (db_list) {
    if (db_list.length != 0) {
        $("#login-link").click();
    }
    else {
        $("#register-link").click();
    }
});

// login or register page opening coding end



if (!window.indexedDB) {
    document.write("Please update your browser");
}

else {

    // register coding start

    $(document).ready(function () {
        $("#register-form").submit(function () {
            let check_database = window.indexedDB.databases();
            check_database.then(function (db_list) {
                if (db_list.length == 0) {
                    register();
                }
                else {
                    $("#message").removeClass("d-none");
                    $("#message").addClass("alert-warning");
                    $("#message").html(`
                        <div style="width: 90%; float: left">
                            <b>Registration failed !</b> 
                            <a href='https://wapinstitute.com'>Please purchase multi version</a> 
                            <i class='fa fa-trash ml-4' data-toggle='tooltip' id='tooltip' style='cursor:pointer'  title='To manage another school, please delete currently school record!'></i>
                        </div>
                        <i class="fa fa-close close pt-1" data-dismiss="alert"></i>
                    `);
                    $("#tooltip").tooltip();
                    $("#tooltip").click(function () {
                        $("#confirm").modal();
                        $("#db-delete-btn").click(function () {
                            let all_db = window.indexedDB.databases();
                            all_db.then(function (all_db_list) {
                                let db_delete_varify = window.indexedDB.deleteDatabase(all_db_list[0].name);
                                db_delete_varify.onsuccess = function () {
                                    // $("#message").removeClass("alert-warning");
                                    $("#message").addClass("d-none");
                                    $(".delete-modal").html("");
                                    $(".delete-success-notice").removeClass("d-none");
                                    $("#register-form").trigger("reset");
                                    setTimeout(() => {
                                        window.location = location.href;
                                    }, 2000)
                                }
                            });
                        });
                    });


                }
            });
            return false;
        });

        function register() {
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
                    $("#message").removeClass("alert-success");
                    $("[href='#login']").click();
                }, 2000);
            }

            database.onerror = function () {
                $("#message").removeClass("d-none");
                $("#message").addClass("alert-warning");
                $("#message").html("<b>Oops !</b> something went wrong please contact 9934946118 <i class='fa fa-close close' data-dismiss='alert'></i>");

            }

            database.onupgradeneeded = function () {
                let idb = this.result;
                let data = {
                    school_name: school_name,
                    tag_line: tag_line,
                    email: email,
                    website: website,
                    mobile: mobile,
                    password: password,
                    phone: phone,
                    address: address,
                    school_logo: "",
                    director_signature : "",
                    principal_signature : ""
                };
                let object = idb.createObjectStore("about_school", { keyPath: "school_name" });
                idb.createObjectStore("fee",{keyPath:"class_name"});
                idb.createObjectStore("admission",{autoIncrement:true})
                object.add(data);
            }
        }
    });

    // register coding end`

}



// login coding start

$(document).ready(function () {
    $("#login-form").submit(function () {
        let username = $("#username").val();
        let password = $("#login-password").val();
        let login_data = {
            username: username,
            password: password
        };

        let session_login_data = JSON.stringify(login_data);
        sessionStorage.setItem("login", session_login_data);
        if (sessionStorage.getItem("login") != null) {

            // find user from the database coding start

            let user_database = window.indexedDB.databases();
            user_database.then(function (pending_obj) {
                for (i = 0; i < pending_obj.length; i++) {
                    let db_name = pending_obj[i].name;

                    // storing db name into idb detabase
                    
                    sessionStorage.setItem("db_name",db_name);
                    let database = window.indexedDB.open(db_name);
                    database.onsuccess = function () {
                        let idb = this.result;
                        let permission = idb.transaction("about_school", "readwrite");
                        let access = permission.objectStore("about_school");
                        let database = access.get(db_name);
                        database.onsuccess = function () {
                            let user = this.result;
                            if (user) {
                                let db_username = user.email;
                                let db_password = user.password;
                                let session_data = JSON.parse(sessionStorage.getItem("login"));
                                if (db_username == session_data.username) {
                                    if (db_password == session_data.password) {
                                        window.location = "success/welcome.html";
                                    }
                                    else {
                                        $("#login-alert").removeClass("d-none");
                                        $("#login-alert").addClass("alert-warning");
                                        $("#login-alert").html("<b>Wrong password !</b>");
                                        
                                    }
                                }
                                else {
                                    $("#login-alert").removeClass("d-none");
                                    $("#login-alert").addClass("alert-warning");
                                    $("#login-alert").html("<b>User not found !</b>");
                                    
                                }
                            }
                            else {
                                alert("key not exist");
                            }
                        }
                    }
                }
            });

            // find user from the database coding end
        
        }
        else {
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
