import { User } from "./User";

//Класс для управления конкретным списком задач
//status = 0 - ready
//status = 1 - InProgress
//status = 2 - Finished
export class UserList {
    constructor(user, htmlObj) {
        //выбираем все задачи
        this.user = user;
        this.htmlObj = htmlObj;
        this.users = [];
    }

    appendUser(userList) {
        userList.forEach(user => {
            let newUser = new User(user.login, user.password, false);
            this.users.push(newUser);
        });
    }

    viewUsers() {
        let userListHtml = '';
        this.users.forEach( user => {
            userListHtml = userListHtml + `<div class="user" name="${user.getName()}">${user.getName()}</div>`;
        });
        this.htmlObj.innerHTML = userListHtml;
    }

    findByGuid(guid) {
        let taskToReturn = null;
        this.tasks.forEach(task => {
            if (task.getId() == guid) {
                taskToReturn = task;
            }
        });
        return taskToReturn;
    }
}