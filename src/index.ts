const inquirer = require('inquirer');
const { consola, createConsola } = require("consola");

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit"
}

type InquirerAnswers = {
  action: Action
}

enum MessageVariant {
  Success,
  Error,
  Info
}

class Message {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  public show(): void {
    console.log(this.content);
  }

  public capitalize(): void {
    this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase();
  }

  public toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }

  static showColorized( variant:MessageVariant , str: string):void {
    
    if (variant === MessageVariant.Success) consola.success(str);
    else if(variant === MessageVariant.Error) consola.error(str);
    else if (variant === MessageVariant.Info) consola.info(str);
  }
}

type User = {
  name: string,
  age: number
}

class UsersData {
  private data: User[];

  constructor () {
    console.log('New User data');
    this.data = [];
  }

  public showAll(): void {
    Message.showColorized(MessageVariant.Info, "Users data");
    if( this.data.length === 0) console.log('No data...')
      else console.table(this.data);
  }

  public add(user: User): void {
    if (typeof user.name === 'string' && typeof user.age === 'number' && user.age > 0 && user.name.length > 0) {
      this.data.push(user);
      Message.showColorized(MessageVariant.Success, "User has been successfully added!");
    } else {
      Message.showColorized(MessageVariant.Error, "Wrong data!");
    }
  }

  public remove(name: string): void {
    const index = this.data.findIndex( user => user.name === name);
    if (index !== -1){
      this.data.splice(index, 1);
      Message.showColorized(MessageVariant.Success, `User ${name} deleted!`);
    } else {
      Message.showColorized(MessageVariant.Error, `User ${name} not found...`);
    }
  }

}

const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    switch (answers.action){
      case Action.List:
        console.log(answers.action);
        break;
      case Action.Add:
        console.log(answers.action);
        break;
      case Action.Remove:
        console.log(answers.action);
        break;
      case Action.Quit:
        Message.showColorized(MessageVariant.Info, "Bye Bye");
        return;
    }
    startApp();
  });
}

const users = new UsersData();
users.showAll();
users.add({ name: "Jan", age: 20 });
users.add({ name: "Adam", age: 30 });
users.add({ name: "Kasia", age: 23 });
users.add({ name: "Basia", age: -6 });
users.showAll();
users.remove("Maurycy");
users.remove("Adam");
users.showAll();