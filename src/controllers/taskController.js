import { TaskList } from "../models/TaskList";
import { Task } from "../models/Task";
import $ from "jquery";
import { getFromStorage } from "../utils";

export class TaskController {
    constructor(user, backlogList, readyList, inProgressList, finishedList) {
        //выбираем все задачи
        this.user = user;
        //кнопки
        this.taskBtn = document.querySelector(".task-button-block");
        this.cancelBtn = document.querySelector("#cancel-button");
        this.saveBtn = document.querySelector("#save-button");
        //элементы для вывода списков задач
        this.source = document.getElementById("draggable");
        this.tasksListElement = document.querySelector(".kanban-block");
        this.backlogListHtml = document.getElementById("backlog");
        this.readyListHtml = document.getElementById("ready");
        this.inProgressListHtml = document.getElementById("inprogress");
        this.finishedListHtml = document.getElementById("finished");
        this.task = document.querySelector(".task");
        //списки
        let dragged = null;
        this.backlogList = new TaskList(this.user, "backlog", this.backlogListHtml);
        this.readyList = new TaskList(this.user, "ready", this.readyListHtml);
        this.inProgressList = new TaskList(this.user, "inprogress", this.inProgressListHtml);
        this.finishedList = new TaskList(this.user, "finished", this.finishedListHtml);
        this.tasks = [];

        this.createLists(backlogList, readyList, inProgressList, finishedList);

        $(function() {
            $(this.body).on('dragstart', this.source, function(event) {
                dragged = event.target;
            })
        })

        $(function() {
            $(this.body).on('dragover', this.tasksListElement, function(event) {
                event.preventDefault();
            })
        })

        $(function() {
            $(this.body).on('drop', this.tasksListElement, function(event) {
                var source = dragged.getAttribute("guid")
                var type = event.target.getAttribute("id");
                var altType = $(event.target).parent("div");
                var anothAltType = $(altType).attr("id")
                // prevent default action (open as link for some elements)
                event.preventDefault();
                // move dragged element to the selected drop target
                if (event.target.className === "kanban-block" ) {
                    dragged.parentNode.removeChild(dragged);
                    event.target.insertAdjacentElement("beforeEnd", dragged);
                    const storageData = getFromStorage("task");
                    if(storageData !== null) {
                        storageData.forEach(element => {
                            if(element["id"] == source) {
                                element["type"] = type;
                                localStorage.setItem("task", JSON.stringify(storageData));
                                return;
                            }
                        });
                    }
                }
                if (event.target.className === "task" ) {
                    dragged.parentNode.removeChild(dragged);
                    event.target.insertAdjacentElement("afterend", dragged);
                    const storageData = getFromStorage("task");
                    if(storageData !== null) {
                        storageData.forEach(element => {
                            if(element["id"] == source) {
                                element["type"] = anothAltType;
                                localStorage.setItem("task", JSON.stringify(storageData));
                                return;
                            }
                        });
                    }
                }
                if (event.target.className === "span" ) {
                    dragged.parentNode.removeChild(dragged);
                    event.target.insertAdjacentElement("beforeEnd", dragged);
                    const storageData = getFromStorage("task");
                    if(storageData !== null) {
                        storageData.forEach(element => {
                            if(element["id"] == source) {
                                element["type"] = type;
                                localStorage.setItem("task", JSON.stringify(storageData));
                                return;
                            }
                        });
                    }
                }
            })
        })

        this.taskBtn.addEventListener('click', event => {
            this.createTask()
        });

        this.cancelBtn.addEventListener('click', event => {
            this.createTask()
        });

        this.saveBtn.addEventListener('click', event => {
            this.appendNewTask()
        });

        $(function() {
            $(".kanban-block").on('click', ".task", function (){
                var result = confirm('Are you sure you want to delete this task?');
                if (result == true) {
                    var task = JSON.parse(localStorage.getItem("task"));
                    const taskGuid = this.getAttribute('guid');
                    for (var i=0; i< task.length; i++) {
                        if (task[i].id == taskGuid & result == true) {
                            task.splice(i, 1);
                            $(this).remove();
                        }
                    }
                    task = JSON.stringify(task);
                    localStorage.setItem("task", task);
                }
            })
        });

        $(function() {
            $(".kanban-block").on('contextmenu', ".task", function (){
                var newName = prompt('New name for this task');
                if (newName == "") {
                    alert("One of the values is missing")
                    return false
                }
                this.innerHTML = newName
                const taskGuid = this.getAttribute('guid');
                const storageData = getFromStorage("task");
                if(storageData !== null) {
                    storageData.forEach(element => {
                        if(element["id"] == taskGuid) {
                            element["text"] = newName;
                            localStorage.setItem("task", JSON.stringify(storageData));
                            return;
                        }
                    });
                }
            })
        });
    }

    //предзаполняем списки задач
    createLists(backlogList, readyList, inProgressList, finishedList) {
        if (backlogList !== null && Array.isArray(backlogList) && backlogList.length > 0) {
            this.backlogList.appendTasks(backlogList);
            this.backlogList.viewTasks();
        }
        if (readyList !== null && Array.isArray(readyList) && readyList.length > 0) {
            this.readyList.appendTasks(readyList);
            this.readyList.viewTasks();
        }
        if (inProgressList !== null && Array.isArray(inProgressList) && inProgressList.length > 0) {
            this.inProgressList.appendTasks(inProgressList);
            this.inProgressList.viewTasks();
        }
        if (finishedList !== null && Array.isArray(finishedList) && finishedList.length > 0) {
            this.finishedList.appendTasks(finishedList);
            this.finishedList.viewTasks();
        }
    }

    //отображение панели создания задачи
    createTask() {
        var x = document.getElementById("ready");
        var c = document.getElementById("inprogress");
        var y = document.getElementById("finished");
        var z = document.getElementById("create-new-task-block");
        if (x.style.display === "none") {
            x.style.display = "block";
            c.style.display = "block";
            y.style.display = "block";
            z.style.display = "none";
        } else {
            x.style.display = "none";
            y.style.display = "none";
            c.style.display = "none";
            z.style.display = "flex";
        }
    }

    appendNewTaskInStorage(taskText, status) {
        if (taskText.lenght == 0) {
            taskText = 'Не было задано';
        }
        let newTask = new Task(null, taskText, this.user, status);
        this.tasks.push(newTask);
        return newTask;
    }

    //создание задачи
    appendNewTask() {
        var x = document.getElementById("ready");
        var c = document.getElementById("inprogress");
        var y = document.getElementById("finished");
        var z = document.getElementById("create-new-task-block");
        var backlog = document.getElementById("backlog");
        var ready = document.getElementById("ready");
        var inprogress = document.getElementById("inprogress");
        var finished = document.getElementById("finished");
        var form = document.getElementById("task-status");
        var taskName = document.getElementById("task-name").value;
        if (taskName == "") {
            alert("No name")
            return false
        }
        if (form.value === "backlog") {
            var task = this.appendNewTaskInStorage(taskName, form.value);
            var newTask = document.createElement("div");
            var span = document.createElement("span");
            newTask.setAttribute("guid", task.getId());
            newTask.setAttribute("class", "task");
            newTask.setAttribute("draggable", "true");
            var spanHtml = newTask.insertAdjacentElement("afterbegin", span);
            spanHtml.textContent = taskName;
            backlog.appendChild(newTask);
            if (taskName == "") {
                alert("No name")
                return false
            }
        }
        if (form.value === "ready") {
            var task = this.appendNewTaskInStorage(taskName, form.value);
            var newTask = document.createElement("div");
            var span = document.createElement("span");
            newTask.setAttribute("guid", task.getId());
            newTask.setAttribute("class", "task");
            newTask.setAttribute("draggable", "true");
            var spanHtml = newTask.insertAdjacentElement("afterbegin", span);
            spanHtml.textContent = taskName;
            ready.appendChild(newTask);
            if (taskName == "") {
                alert("No name")
                return false
            }
        }
        if (form.value === "inprogress") {
            var task = this.appendNewTaskInStorage(taskName, form.value);
            var newTask = document.createElement("div");
            var span = document.createElement("span");
            newTask.setAttribute("guid", task.getId());
            newTask.setAttribute("class", "task");
            newTask.setAttribute("draggable", "true");
            var spanHtml = newTask.insertAdjacentElement("afterbegin", span);
            spanHtml.textContent = taskName;
            inprogress.appendChild(newTask);
            if (taskName == "") {
                alert("No name")
                return false
            }
        }
        if (form.value === "finished") {
            var task = this.appendNewTaskInStorage(taskName, form.value);
            var newTask = document.createElement("div");
            var span = document.createElement("span");
            newTask.setAttribute("guid", task.getId());
            newTask.setAttribute("class", "task");
            newTask.setAttribute("draggable", "true");
            var spanHtml = newTask.insertAdjacentElement("afterbegin", span);
            spanHtml.textContent = taskName;
            finished.appendChild(newTask);
            if (taskName == "") {
                alert("No name")
                return false
            }
        }
        if (x.style.display === "none") {
            x.style.display = "block";
            c.style.display = "block";
            y.style.display = "block";
            z.style.display = "none";
        } else {
            x.style.display = "none";
            y.style.display = "none";
            c.style.display = "none";
            z.style.display = "flex";
        }
    }
}