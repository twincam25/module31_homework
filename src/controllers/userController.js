import { generateUser } from "../utils";
import { User } from "../models/User";
import { appState } from "../app";
import { UserList } from "../models/UserList";
import taskFieldTemplate from "../templates/taskField.html";
import { TaskController } from "./taskController";
import { authUser } from "../services/auth";
import { getTasksFromStorage } from "../utils";
import $ from "jquery";

export class UserController {
    constructor(user, userList) {
        //выбираем все задачи
        this.user = user;
        //кнопки
        this.userBtn = document.querySelector("#user-button");
        this.userCancelBtn = document.querySelector("#cancel-button-user");
        this.userSaveBtn = document.querySelector("#save-button-user");
        this.dropbtn = document.querySelector("#dropbtn");
        //элементы для вывода списков задач
        this.userListHtml = document.getElementById("user");
        this.currentUser = document.querySelector(".user");
        //списки
        this.userList = new UserList(this.user, this.userListHtml);
        this.tasks = [];

        this.createLists(userList);

        this.userSaveBtn.addEventListener('click', event => {
            this.appendNewUser()
        });

        $(function() {
            $(".kanban-block").on('contextmenu', ".user", function (){
                var result = confirm('Are you sure you want to delete this user?');
                var user = JSON.parse(localStorage.getItem("users"));
                var task = JSON.parse(localStorage.getItem("task"));
                const userName = this.getAttribute('name');
                if (userName === "admin") {
                    alert("You can't delete admin");
                    return false
                }
                for (var i=0; i< user.length; i++) {
                    if (user[i].login == userName & result) {
                        var id = user[i].id
                        user.splice(i, 1);
                        $(this).remove();
                    }
                }
                for (var i=0; i< task.length; i++) {
                    if (task[i].user == id & result) {
                        task.splice(i, 99);
                        $(this).remove();
                    }
                }
                task = JSON.stringify(task);
                localStorage.setItem("task", task);
                user = JSON.stringify(user);
                localStorage.setItem("users", user);
            })
        });

        $(function() {
            $(this.body).on("click", ".user", function (event) {
                var userName = event.target.textContent;
                var user = JSON.parse(localStorage.getItem("users"));
                for (var i=0; i< user.length; i++) {
                    if (user[i].login == userName) {
                        var id = i;
                    }
                }
                if (authUser(user[id].login, user[id].password)) {
                document.querySelector("#content").innerHTML = taskFieldTemplate;
                const taskController = new TaskController(appState.currentUser.id, getTasksFromStorage(appState.currentUser.id, "backlog"), getTasksFromStorage(appState.currentUser.id, "ready"), getTasksFromStorage(appState.currentUser.id, "inprogress"), getTasksFromStorage(appState.currentUser.id, "finished"));
            }
        });
    });
}

    //предзаполняем списки задач
    createLists(userList) {
        if (userList !== null && Array.isArray(userList) && userList.length > 0) {
            this.userList.appendUser(userList);
            this.userList.viewUsers();
        }
    }

    //отображение панели создания задачи
    appendNewUser() {
        var user = document.getElementById("user");
        var userName = document.getElementById("task-name").value;
        var userPassword = document.getElementById("task-description").value;
        console.log(userName, userPassword)
        if (userName == "") {
            alert("One of the values is missing")
            return false
        } else if (userPassword == "") {
            alert("One of the values is missing")
            return false
        }
        var context = `<div class="user" name="${userName}"><span>${userName}</span></div>`
        generateUser(new User(userName, userPassword, false))
        user.insertAdjacentHTML('beforeend', context);
    }
}