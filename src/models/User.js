import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";
export class User extends BaseModel {
  constructor(login, password, isAdmin) {
    super();
    this.login = login;
    this.password = password;
    this.storageKey = "users";
    //Админ, Админ может всё
    this.isAdmin = isAdmin;
  }
  get hasAccess() {
    let users = getFromStorage(this.storageKey);
    if (users.length == 0) return false;
    for (let user of users) {
      if (user.login == this.login && user.password == this.password) {
        this.updateUid(user.id);
        return true;
      }
    }
    return false;
  }

  isAdmin(isAdmin) {
    if (isAdmin === true) {
      return true;
    } else {
      return false
    }
  }

  getId() {
    return this.id;
}

  getName() {
    return this.login;
  }

  static save(user) {
    try {
      JSON.stringify(user);
      addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}