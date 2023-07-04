import {
    Task
} from "./Task";
import {
    updateInToStorage
} from "../utils";

//Класс для управления конкретным списком задач
//status = 0 - ready
//status = 1 - InProgress
//status = 2 - Finished
export class TaskList {
    constructor(user, status, htmlObj) {
        //выбираем все задачи
        this.user = user;
        this.status = status;
        this.htmlObj = htmlObj;
        this.tasks = [];
    }

    //показываем все задачи
    viewTasks() {
        let taskListHtml = '';
        this.tasks.forEach(task => {
            taskListHtml = taskListHtml + `<div class="task" id="draggable" draggable="true" status="${task.getType()}" guid="${task.getId()}">${task.getText()}</div>`
        });
        this.htmlObj.insertAdjacentHTML('beforeend', taskListHtml);
    }

    //получить количество задач по типу
    taskCount() {
        return this.tasks.length;
    }

    getTasks() {
        return this.tasks;
    }

    //добавить новую задачу
    appendNewTask(taskName) {
        if (taskName.lenght == 0) {
            taskName = 'Не было задано';
        }
        let newTask = new Task(null, taskName, this.user, this.status);
        console.log(newTask);
        this.tasks.push(newTask);
        return newTask;
    }

    //добавить список существующих задач
    appendTasks(taskList) {
        taskList.forEach(task => {
            let newTask = new Task(task.id, task.text, task.user, task.type);
            this.tasks.push(newTask);
        });
    }

    //добавление существующей задачи
    appendExistTask(task) {
        task.setType(this.status);
        this.tasks.push(task);
        updateInToStorage("id", task.getId(), task.getStorageKey(), "type", this.status);
        return true;
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

    //переместить задачу
    removeTask(guid) {
        let i = 0;
        this.tasks.forEach(task => {
            if (task.getId() == guid) {
                this.tasks.splice(i, 1);
            }
            i++;
        });
    }
}