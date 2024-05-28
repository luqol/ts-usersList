const inquirer = require('inquirer');
const { consola, createConsola } = require("consola");

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit",
  Edit = "edit"
}

enum MessageVariant {
  Success,
  Error,
  Info
}

type InquirerAnswers = {
  action: Action
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

  public edit(name: string, noa: string , newValue:string | number): void {
    const index = this.data.findIndex( user => user.name === name);
    if (index !== -1){
      if ( noa === 'name' && typeof newValue === 'string'){
        this.data[index].name = newValue;
        Message.showColorized(MessageVariant.Success,'Name changed');
      } else if ( noa === 'age' && typeof newValue === 'number'){
        this.data[index].age = newValue;
        Message.showColorized(MessageVariant.Success,'Age changed');
      }
  
    } else {
      Message.showColorized(MessageVariant.Error, `User ${name} not found...`);
    }
  }

}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("edit – edit user name or age");
console.log("quit – quit the app");
console.log("\n");

const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    switch (answers.action){
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Edit:
        const editName = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name'
        } , {
          name: 'nameOrAge',
          type: 'input',
          message: 'What do you want to edit name or age?'
        }, {
          name: 'newValue',
          type: 'input',
          message: 'What is new value'
        }]);
        users.edit(editName.name, editName.nameOrAge, editName.newValue);
        break;
      case Action.Quit:
        Message.showColorized(MessageVariant.Info, "Bye Bye");
        return;
      default:
        Message.showColorized(MessageVariant.Error,"Command not found");
    }
    startApp();
  });
}


startApp();