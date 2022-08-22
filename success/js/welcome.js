// add item code start

$(document).ready(function(){
    $(".add-field-btn").click(function(){
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

$(document).ready(function(){
    $(".set-fee-btn").click(function(){
        let class_name = $(".class-name").val();
        let course_fee = [];
        let course_name = [];
        $(".course-name").each(function(i){
            course_name[i] = $(this).val();
        });
        $(".course-fee").each(function(i){
            course_fee[i] = $(this).val();
        });

        let fee_object = {
            class_name : class_name,
            course_name : course_name,
            course_fee : course_fee
        }

        // store data in database coding start
        
        let db_name = sessionStorage.getItem("db_name");
        let database = window.indexedDB.open(db_name);
        database.onsuccess = function(){
            let idb = this.result;
            let permission = idb.transaction("fee","readwrite");
            let access = permission.objectStore("fee");
            let fee_object_store = access.add(fee_object);
            fee_object_store.onsuccess = function(){
                alert("success fully stored fee object");
            }
            fee_object_store.onerror = function(){
                alert("some error accured on storing fee object");
            }

        }
        
        // store data in database coding end

    });
})

// set fee coding end


// show fee coding start

$(document).ready(function(){
    $("#check-fee-btn").click(function(){
        $("#fee-modal").modal();
        let db_name = sessionStorage.getItem("db_name");
        let database = window.indexedDB.open(db_name);
        database.onsuccess = function(){
            let idb = this.result;
            let permission = idb.transaction("fee","readwrite");
            let access = permission.objectStore("fee");
            let get_all_keys = access.getAllKeys();
            get_all_keys.onsuccess = function(){
                let keys = this.result;
                for(i=0;i <keys.length;i++){
                    let key_data = access.get(keys[i]);
                    key_data.onsuccess = function(){
                        let fee = this.result;
                        let ul = document.createElement("UL");
                        ul.className = "nav nav-tabs";
                        let li = document.createElement("LI");
                        li.className = "nav-item";
                        let a = document.createElement("A");
                        a.className = "nav-link active";
                        a.href = "#";
                        a.innerHTML = "CLASS - "+fee.class_name;
                        li.append(a);
                        ul.append(li);
                        $("#show-fee").append(ul);
                        let table = document.createElement("TABLE");
                        table.className = "table text-center";
                        let tr_for_th = document.createElement("TR");
                        let tr_for_td = document.createElement("TR");
                        for(j=0; j<fee.course_name.length; j++){
                            let th = document.createElement("TH");
                            th.innerHTML = fee.course_name[j];
                            tr_for_th.append(th);
                        }
                        let th_for_edit = document.createElement("TH");
                        th_for_edit.innerHTML = "Edit";
                        tr_for_th.append(th_for_edit);
                        let th_for_delete = document.createElement("TH");
                        th_for_delete.innerHTML = "Delete";
                        tr_for_th.append(th_for_delete);
                        table.append(tr_for_th);
                        $("#show-fee").append(table);
                    }
                }
            }
        }
    });
});

// show fee coding end