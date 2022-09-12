$(document).ready(function(){
    let db_name = sessionStorage.getItem("db_name");
    let admission_no = sessionStorage.getItem("a_no");
    $(".school-name").html(db_name);
    $(".school-name").css({"textTransform":"uppercase"});
    let datababse = window.indexedDB.open(db_name);
    datababse.onsuccess = function(){
        let idb = this.result;
        let permission = idb.transaction("about_school","readwrite");
        let access = permission.objectStore("about_school");
        let check_data = access.get(db_name);
        check_data.onsuccess = function(){
            let data = this.result;
            $(".tag-line").html(data.tag_line);
            $(".venue").html("Venue : "+data.address);
            $(".school-contect").html("Contects: "+data.mobile+", "+data.phone);
        }

        let student_permission = idb.transaction("admission","readwrite");
        let student_access = student_permission.objectStore("admission");
        let check_admission = student_access.get(parseInt(admission_no));
        check_admission.onsuccess = function(){
            let data = this.result;
            if(data){
                var image = new Image();
                image.src = data.profile_pic;
                $(".photo-box").html(image);
                $(".adm-no").html(admission_no);
                $(".adm-date").html(data.doa);
                $(".student-name").html(data.s_name);
                $(".student-name").html(data.s_name);
                $(".gender").html(data.gender);
                $(".dob").html(data.dob);
                $(".adm-in").html(data.admit_in);
                $(".father-name").html(data.f_name);
                $(".mother-name").html(data.m_name);
                $(".mobile-one").html(data.mobile_one);
                $(".mobile-two").html(data.mobile_two);
                $(".add").html(data.address);
            }
            else{
                alert("Student not found!");
            }

        }
    }
});