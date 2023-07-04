import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.min.js';
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import taskFieldAdminTemplate from "./templates/taskFieldAdmin.html";
import { State } from "./state";
import { User } from "./models/User";
import { generateUser } from "./utils";
import { authUser } from "./services/auth";
import { TaskController } from "./controllers/taskController";
import { UserController } from "./controllers/userController";
import { getTasksFromStorage } from "./utils";
import { getUsersFromStorage } from "./utils";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");
const account = document.querySelector(".dropdown");
const paragraph = document.querySelector('p');
const avatar = document.querySelector(".avatar");
const avatar2 = document.querySelector(".avatar2");
const welcome = document.querySelector(".welcome");
const formControl = document.querySelector("#form");
const formControl2 = document.querySelector("#form2");
const btn = document.querySelector("#app-login-btn");

if (localStorage.length == 0) {
  generateUser(new User("admin","123",true, null))
  generateUser(new User("test1","123",false, null))
  generateUser(new User("test2","123",false, null))
}
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  let fieldHTMLContent = noAccessTemplate;
  document.querySelector("#content").innerHTML = noAccessTemplate;

  if (authUser(login, password)) {
    fieldHTMLContent = taskFieldTemplate;
      //работа с задачами
    document.querySelector("#content").innerHTML = taskFieldTemplate;
    account.style.display = "block";
    avatar2.style.display = "block";
    welcome.style.display = "block";
    formControl.style.visibility = "hidden";
    formControl2.style.visibility = "hidden";
    btn.style.visibility = "hidden";
    paragraph.textContent = `Welcome, ${formControl.value}!`;
    const taskController = new TaskController(appState.currentUser.id, getTasksFromStorage(appState.currentUser.id, "backlog"), getTasksFromStorage(appState.currentUser.id, "ready"), getTasksFromStorage(appState.currentUser.id, "inprogress"), getTasksFromStorage(appState.currentUser.id, "finished"));
  }

  if (authUser(login, password), login === "admin" & password === "123") {
    fieldHTMLContent = taskFieldAdminTemplate;
      //работа с задачами
    document.querySelector("#content").innerHTML = taskFieldAdminTemplate;
    account.style.display = "block";
    avatar.style.display = "block";
    avatar2.style.visibility = "hidden";
    welcome.style.display = "block";
    formControl.style.visibility = "hidden";
    formControl2.style.visibility = "hidden";
    btn.style.visibility = "hidden";
    paragraph.textContent = `Welcome, ${formControl.value}!`;
    const taskController = new UserController(appState.currentUser.id, getUsersFromStorage("users"));
  }
});