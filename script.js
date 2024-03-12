
function task_enter() {
    let task_title_input = document.getElementById("task_name");
    let task_title = task_title_input.value;
    let task_add_btn = document.getElementById("task_add_btn");
    if (task_title != "") {
        task_add_btn.disabled = false;       
    } else {
        task_add_btn.disabled = true;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
    let task_title_input = document.getElementById("task_name");
    let task_add_btn = document.getElementById("task_add_btn");

    task_title_input.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && task_title_input.value != '') {
            task_add_btn.click();
        }
    });
});

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskList = document.querySelector('#task-list');
    taskList.innerHTML = '';

    tasks.forEach(function(task) {
        let checkedClass = task.done ? 'checked' : '';
        taskList.innerHTML += `
        <li id="task_${task.id}">
            <div class="task-content">
                <input type="checkbox" name="task" onchange="task_done(this)" ${checkedClass}>
                <div class="task-title ${checkedClass}"> ${task.title}</div>
            </div>
            <div class="task-btn">
                <button type="button" class="edit-btn" onclick="edit_task(this)"> <img src="assets/edit-32.jpg" alt="Edit"> </button>
                <button type="button" class="delete-btn" onclick="delete_task(this)"> <img src="assets/delete-32.jpg" alt="Delete"> </button>
            </div>
        </li>`;
    });
}

function task_add() {
    let task_title_input = document.getElementById("task_name").value;
    document.getElementById("task_name").value = "";
    document.getElementById("task_add_btn").disabled = true;
    let task_id = Date.now();
    let task = {
        id: task_id,
        title: task_title_input,
        done: false 
    };
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function edit_task(taskButton) {
    let li = taskButton.closest("li");
    let task_title = li.querySelector(".task-title");

    task_title.contentEditable = true;
    task_title.classList.add("editable");
    task_title.focus();
    
    task_title.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            save_edited_task(task_title,li);
        }
    });

    task_title.addEventListener('blur', function(e) {
        save_edited_task(task_title,li);
    });
}

function save_edited_task(task_title,li) {
    task_title.contentEditable = false;
    task_title.classList.remove("editable");

    let taskId = li.id.split("_")[1];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (task.id === parseInt(taskId)) {
            task.title = task_title.innerText;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function delete_task(taskButton) {
    if (confirmation_delete("Are you sure you want to delete the task?")) {
        let li = taskButton.closest("li");
        remove_task_from_local(li);

        li.parentNode.removeChild(li);
    }
}

function task_done(taskCheckbox) {
    let li = taskCheckbox.closest("li");
    let taskId = li.id.split("_")[1];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        if (task.id === parseInt(taskId)) {
            task.done = taskCheckbox.checked;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    let task_title = li.querySelector(".task-title");
    if (taskCheckbox.checked) {
        task_title.classList.add("checked");
    } else {
        task_title.classList.remove("checked");
    }
}

function delete_all_task() {
    if (confirmation_delete("Are you sure you want to delete All task?")) {
        let ul = document.getElementById("task-list");
        ul.innerHTML = "";

        localStorage.removeItem('tasks');
    }
}

function delete_checked_task() {
    if (confirmation_delete("Are you sure you want to delete Checked task?")) {
        var checkboxes = document.querySelectorAll('input[name=task]:checked');
        for (var i = 0; i < checkboxes.length; i++) {
            let li = checkboxes[i].closest("li");
            li.parentNode.removeChild(li);
            remove_task_from_local(li);
        }
    }
}

function remove_task_from_local(li) {
    let taskId = li.id.split("_")[1];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function confirmation_delete(text) {
    if (confirm(text) == true) {
      return true
    } else {
      return false
    }
}