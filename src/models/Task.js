import { v4 as uuid } from "uuid";
import {addToStorage } from "../utils";



//класс для задачи. Храним uuid, текст задачи и uuid пользователя
//type = 0 - ready
//type = 1 - InProgress
//type = 2 - Finished

export class Task {
    constructor(guid, taskText, user, type) {
      this.text = taskText;
      this.user = user;
      this.storageKey = "task";
      if (type == "ready" || type == "inprogress" || type == "finished")
      {
        this.type = type;
      }
      else
      {
        this.type = "backlog";
      }

      if(guid == null)
      {
        this.id = uuid();
        addToStorage(this, this.storageKey);
      }  else {
        this.id = guid;
      }

      console.log(`создал ${this.id}:${this.text} тип: ${this.type}`);
    }

    getStorageKey(){
        return this.storageKey;
    }

    getId() {
        return this.id;
    }

    getText() {
        return this.text;
    }

    getUser() {
        return this.user;
    }

    getType() {
        return this.type;
    }

    setType(type){
        if (type != "backlog" || type != "ready" || type != "inprogress" || type != "finished")
        {
            this.type = "backlog";
        } else {
            this.type = type;
        }
    }
}