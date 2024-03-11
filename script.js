var task_id = 0;

function task_enter() {
    let task_title_input = document.getElementById("task_name").value;
    if (task_title_input != "") {
        document.getElementById("task_add_btn").disabled = false;
    } else {
        document.getElementById("task_add_btn").disabled = true;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
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
                <div class="task-title ${checkedClass}">${task.id} ${task.title}</div>
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
    let task = {
        id: task_id,
        title: task_title_input,
        done: false 
    };
    task_id+=1;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}


function edit_task(taskButton) {
    let li = taskButton.closest("li");
    let task_title = li.querySelector(".task-title").innerText;
    let task_input = document.getElementById("task_name");
    task_input.value = task_title;
    task_input.focus();
    document.getElementById("task_add_btn").disabled = false;
    
    remove_task_from_local(li);

    li.parentNode.removeChild(li);
}

function delete_task(taskButton) {
    let li = taskButton.closest("li");
    remove_task_from_local(li);

    li.parentNode.removeChild(li);
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
    let ul = document.getElementById("task-list");
    ul.innerHTML = "";

    localStorage.removeItem('tasks');
}

function delete_checked_task() {
    var checkboxes = document.querySelectorAll('input[name=task]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        let li = checkboxes[i].closest("li");
        li.parentNode.removeChild(li);
        remove_task_from_local(li);
    }
}

function remove_task_from_local(li) {
    let taskId = li.id.split("_")[1];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
