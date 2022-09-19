if (sessionStorage.getItem("upload_pic") != null) {
    let date = new Date($(".dob").val());
    let dob_day = date.getDate();
    let dob_month = date.getMonth() + 1;
    let dob_year = date.getFullYear();
    let dob = dob_day + "/" + dob_month + "/" + dob_year;
    let current_date = new Date();
    let doa_day = current_date.getDate();
    let doa_month = current_date.getMonth() + 1;
    let doa_year = current_date.getFullYear();
    let doa = doa_day + "/" + doa_month + "/" + doa_year;
    let admission = {
        adm_no : a_no,
        s_name: $(".s-name").val(),
        f_name: $(".f-name").val(),
        m_name: $(".m-name").val(),
        dob: dob,
        gender: $(".gender").val(),
        mobile_one: $(".mobile-one").val(),
        mobile_two: $(".mobile-two").val(),
        class: $(".class").val(),
        admit_in: $(".admit-in").val(),
        address: $(".address").val(),
        doa: doa,
        profile_pic: sessionStorage.getItem("upload_pic")
    }
    sessionStorage.removeItem("upload_pic");
    let db_name = sessionStorage.getItem("db_name");
    let database = window.indexedDB.open(db_name);
    database.onsuccess = function () {
        let idb = this.result;
        let permission = idb.transaction("admission", "readwrite");
        let access = permission.objectStore("admission");
        let check_admission = access.add(admission);
        check_admission.onsuccess = function () {
            $(".show-pic").attr("src", "../images/upload_pic.jpg");
            admission_no();
            $(".admit-notice").html("");
            let alert = "<div class='alert alert-success'><i class='fa fa-close close' data-dismiss='alert'></i> <b>Admission Success !</b> <a href='admission_slip.html'>Get amission slip</a>   </div>";
            $(".admit-notice").html(alert);
        }
        check_admission.onerror = function () {
            $(".show-pic").attr("src", "../images/upload_pic.jpg");
            $(".admit-notice").html("");
            let alert = "<div class='alert alert-warning'><i class='fa fa-close close' data-dismiss='alert'></i> <b>Admission failed !</b></div>";
            $(".admit-notice").html(alert);

        }
    }
} else {
    $(".admit-notice").html("");
    let alert = "<div class='alert alert-warning'><i class='fa fa-close close' data-dismiss='alert'></i> <b>Please upload student pic !</b></div>";
    $(".admit-notice").html(alert);
}
$(this).trigger("reset");
return false;