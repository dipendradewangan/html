// add item code start

$(document).ready(function () {
    $(".add-field-btn").click(function () {
        let add_element = `
        <div class="input-group mb-4">
            <input type="text" name="course-name" placeholder="Hostel fee" class="course-name form-control">
            <input type="text" name="course-fee" placeholder="500" class="course-fee form-control">
            <div class="input-group-prepend">
                <span class="input-group-text bg-warning">Monthly</span>
            </div>
            <button class="btn btn-light ml-1  border-1">
                <i class="fa fa-trash"></i>
            </button>
        </div>
        `;

        $(".add-field-area").append(add_element);
    });
});

// add item code end

// set fee coding start

$(document).ready(function () {
    $(".set-fee-btn").click(function () {
        let class_name = $(".class-name").val();
        let course_fee = [];
        let course_name = [];
        $(".course-name").each(function (i) {
            course_name[i] = $(this).val();
        });
        $(".course-fee").each(function (i) {
            course_fee[i] = $(this).val();
        });

        let fee_object = {
            class_name: class_name,
            course_name: course_name,
            course_fee: course_fee
        }

        // store data in database coding start

        let db_name = sessionStorage.getItem("db_name");
        let database = window.indexedDB.open(db_name);
        database.onsuccess = function () {
            let idb = this.result;
            let permission = idb.transaction("fee", "readwrite");
            let access = permission.objectStore("fee");
            let fee_object_store = access.add(fee_object);
            fee_object_store.onsuccess = function () {
                alert("success fully stored fee object");
            }
            fee_object_store.onerror = function () {
                alert("some error accured on storing fee object");
            }

        }

        // store data in database coding end

    });
})

// set fee coding end


// show fee coding start

$(document).ready(function () {
    $("#check-fee-btn").click(function () {
        $("#show-fee").html("");
        $("#fee-modal").modal();
        let db_name = sessionStorage.getItem("db_name");
        let database = window.indexedDB.open(db_name);
        database.onsuccess = function () {
            let idb = this.result;
            let permission = idb.transaction("fee", "readwrite");
            let access = permission.objectStore("fee");
            let get_all_keys = access.getAllKeys();
            get_all_keys.onsuccess = function () {
                let keys = this.result;
                for (i = 0; i < keys.length; i++) {
                    let key_data = access.get(keys[i]);
                    key_data.onsuccess = function () {
                        let fee = this.result;
                        let ul = document.createElement("UL");
                        ul.className = "nav nav-tabs";
                        let li = document.createElement("LI");
                        li.className = "nav-item";
                        let a = document.createElement("A");
                        a.className = "nav-link active";
                        a.href = "#";
                        a.innerHTML = "CLASS - " + fee.class_name;
                        li.append(a);
                        ul.append(li);
                        $("#show-fee").append(ul);
                        let table = document.createElement("TABLE");
                        table.className = "table text-center border-left border-right border-bottom";
                        let tr_for_th = document.createElement("TR");
                        let tr_for_td = document.createElement("TR");

                        // let start code for course name dynamically show in webpage

                        for (j = 0; j < fee.course_name.length; j++) {
                            let th = document.createElement("TH");
                            th.className = "border-0";
                            th.innerHTML = fee.course_name[j];
                            tr_for_th.append(th);
                        }

                        let th_for_edit = document.createElement("TH");
                        th_for_edit.className = "border-0";
                        th_for_edit.innerHTML = "Edit";
                        tr_for_th.append(th_for_edit);

                        let th_for_delete = document.createElement("TH");
                        th_for_delete.className = "border-0";
                        th_for_delete.innerHTML = "Delete";
                        tr_for_th.append(th_for_delete);
                        table.append(tr_for_th);


                        // let start code for course fee dynamically show in webpage

                        for (j = 0; j < fee.course_fee.length; j++) {
                            let td = document.createElement("TD");
                            td.className = "border-0";
                            td.innerHTML = fee.course_fee[j];
                            tr_for_td.append(td);
                        }

                        let td_for_edit_icon = document.createElement("TD");
                        td_for_edit_icon.className = "border-0";
                        td_for_edit_icon.innerHTML = "<i class='fa fa-edit'></i>";
                        tr_for_td.append(td_for_edit_icon);

                        let td_for_delete_icon = document.createElement("TD");
                        td_for_delete_icon.className = "border-0";
                        td_for_delete_icon.innerHTML = "<i class='fa fa-trash'></i>";
                        tr_for_td.append(td_for_delete_icon);
                        table.append(tr_for_td);

                        $("#show-fee").append(table);


                        // delete fee coding start
                        td_for_delete_icon.onclick = function(){
                            let ul = this.parentElement.parentElement.previousSibling;
                            let a = ul.getElementsByTagName("A");
                            let key_name_with_num = a[0].innerHTML;
                            let key_name = key_name_with_num.split(" ");
                            let db_name = sessionStorage.getItem("db_name");
                            let database = window.indexedDB.open(db_name);
                            database.onsuccess = function(){
                                let idb = this.result;
                                let permission = idb.transaction("fee","readwrite");
                                let access = permission.objectStore("fee");
                                let delete_success = access.delete(key_name[2]);
                                delete_success.onsuccess = function(){
                                    alert("successfully deleted "+key_name_with_num);
                                    ul.remove();
                                    td_for_delete_icon.parentElement.parentElement.remove();
                                }
                            }
                        }

                        // delete fee coding end

                        // edit fee coding start
                        
                        td_for_edit_icon.onclick = function(){
                            let table = this.parentElement.parentElement;
                            let ul = table.previousSibling;
                            let a = ul.getElementsByTagName("A");
                            let class_name = a[0].innerHTML.split(" ");
                            $(".class-name").val(class_name[2]);
                            let tr = table.getElementsByTagName("TR");

                            let th = tr[0].getElementsByTagName("TH");
                            let td = tr[1].getElementsByTagName("TD");
                            let course_name = document.getElementsByClassName("course-name");
                            let course_fee = document.getElementsByClassName("course-fee");
                            course_name[0].parentElement.remove();
                            for(i = 0;i<th.length-2; i++){
                                $(".add-field-btn").click();
                                course_name[i].value = th[i].innerHTML;
                                course_fee[i].value = td[i].innerHTML;
                                $("#fee-modal").modal('hide');
                            }

                            // let key_name_with_num = a[0].innerHTML;
                            // let key_name = key_name_with_num.split(" ");
                            // let db_name = sessionStorage.getItem("db_name");
                            // let database = window.indexedDB.open(db_name);
                            // database.onsuccess = function(){
                            //     let idb = this.result;
                            //     let permission = idb.transaction("fee","readwrite");
                            //     let access = permission.objectStore("fee");
                            //     let key_data = access.get(key_name[2]);
                            //     console.log(key_data.class_name);
                            // }
                        }

                        // edit fee coding end
                    }
                }
            }
        }
    });
});

// show fee coding end