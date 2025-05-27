const fs = require("fs"); //fs is Node.js file system module for reading/writing files
const path = require("path"); // path is Node.js module for handling file paths operations
const { json } = require("stream/consumers");
const { upgrade } = require("undici-types");

const Task_File = path.join(__dirname, "tasks.json"); //Path to our JSON storage file(in the same directory as this script)
// __dirname is a Node.js global variable that gives the directory name of the current module
// path.join() is used to create a path that works across different operating systems
// tasks.json will store our tasks in JSON format
// This file will be created if it doesn't exist
// If it exists, it will be used to read/write tasks
// If you want to change the file name or location, you can modify Task_File variable
// If you want to use a different file format, you can change the code accordingly
// If you want to use a database instead of a file, you can use a database library like mongoose or sequelize
// If you want to use a different storage method, you can change the code accordingly
// If you want to use a different programming language, you can use a different code accordingly

//Initializing the tasks file if it doesn't exist
function initTaskFile() {
  //check if tasks.json exists, if not create it with an empty array
  if (!fs.existsSync(Task_File)) {
    fs.writeFileSync(Task_File, JSON.stringify([], null, 2)); //Create pretty-printed empty JSON array
  }
}
function readTask() {
  try {
    const data = fs.readFileSync(Task_File, "utf8"); //Read the file synchronously
    return JSON.parse(data); //Parse the JSON data and return it
  } catch (error) {
    console.error("Error reading the tasks file:", error.message);
    process.exit(1); //Exit the process with an error code
  }
}
function writeTask(tasks) {
  //Write the tasks array to the file
  try {
    fs.writeFileSync(Task_File, JSON.stringify(tasks, null, 2)); //Write the tasks array to the file in pretty-printed JSON format
  } catch (error) {
    console.error("Error writing to the task file:", error.message);
    process.exit(1); //Exit the process with an error code
  }
}
//generateID function to create a unique ID for each task
function generateID() {
  return Date.now().toString(); //Generate a unique ID based on the current timestamp
}
//Add a new task to the tasks.json file
function addTask(description) {
  //Function to add a new task
  const tasks = readTask(); //Read the current tasks from the file
  const newTask = {
    id: generateID(), //Generate a unique ID for the new Task
    description,
    status: "todo", //Set the initial status to "todo"
    createdAt: new Date().toISOString(), //Set the creation date to the current date in ISO format
    updatedAt: new Date().toISOString(), //Set the updated date to the current date in ISO format
  };
  tasks.push(newTask); //Add the new task to the tasks array
  writeTask(tasks); //Write the updated tasks array to the file
  console.log("Task added successfully:", newTask); //Log the success message with the new task details
}
//Update an existing task in the tasks.json file
function updateTask(id, description) {
  const tasks = readTask(); //Read the current tasks from the file
  const taskIndex = tasks.findIndex((task) => task.id === id); //Find the index of the task with the given ID
  if (taskIndex === -1) {
    //If the task with the given ID is not found
    console.error("Task not found", id); //Log an error message with the ID
    return; //Exit the function
  }
  tasks[taskIndex].description = newDescription; //Update the description of the task
  tasks[taskIndex].updateAt = new Date().toISOString(); //Update the updated date to the current date in ISO format
  writeTask(tasks); //Write the updated tasks array to the file
  console.log("Task updated successfully:", task[taskIndex]); //Log the success message with the updated task details
}
//update the status of an existing task in the tasks.json file
function updateTaskStatus(id, status) {
  //Function to update the status of an existing task
  const validStatus = ["todo", "in-progress", "done"]; //Define the valid statuses for a task
  if (!validStatus.includes(status)) {
    console.log("Invalid status. Must be one of : todo, in-progress,done"); //If the status is not valid, log an error message
    return; //Exit the function
  }
  const tasks = readTask(); //Read the current tasks from the file
  const taskIndex = tasks.findIndex((task) => task.id === id); //Find the index of the task with the given ID
  if (taskIndex === -1) {
    console.log("Task not found", id); //If the task with the given ID is not found, log an error message
    return; //Exit the function
  }
  tasks[taskIndex].status = status; //Update the status of the task
  tasks[taskIndex].updateAt = new Date().toISOString(); //Update the updated date to the current date in ISO format
  writeTask(tasks); //Write the updated tasks array to the file
  console.log("Task status updated successfully:", tasks[taskIndex]); //Log the success message with the updated task details
}
//Delete a task from the tasks.json file
function deleteTask(id) {
  const tasks = readTask(); //Read the current tasks from the file
  const filteredTasks = tasks.filter((task) => task.id !== id); //Filter out the task with the given ID
  if (tasks.length === filteredTasks.length) {
    console.error("Task not found", id); //If the task with the given ID is not found, log an error message
    return; //Exit the function
  }
  writeTask(filteredTasks); //Write the updated tasks array to the file
  console.log("Task deleted successfully with the ID:", id); //Log the success message with the ID of the deleted task
}
//status filter function to get tasks by status
function listTaskFilter(statusFilter = null){//Function to list tasks with an optional status filter
  const tasks =readTask(); //Read the current tasks from the file
  let filteredTasks = tasks; //Initialize the filtered tasks to all tasks
  if (statusFilter){
    filteredTasks = tasks.filter(task => task.status === statusFilter);
    //If a status filter is provided, filter the tasks by the given status
  }
  if(filteredTasks.length === 0){
    console.log(statusFilter ? `No ${statusFilter} tasks found.` : "No tasks found.");
    //If no tasks are found, log a message indicating that
    return;
    //If no tasks are found, log a message and exit the function
  }
  console.log(`Tasks (${statusFilter || "all"}):`); //Log the status filter or "all" if no filter is provided
  filteredTasks.forEach(task => {
    console.log(`- ID: ${task.id}`);
    console.log(` Description: ${task.description}`);
    console.log(` Status: ${task.status}`);
    console.log(` Created: ${task.createdAt}`);
    console.log(` Update: ${task.updateAt}`);
    console.log("--------");
  });
}
function main() {
  initTaskFile(); //Initialize the tasks file if it doesn't exist
  const args = process.argv.slice(2); //Get the command line arguments, excluding the first two (node and script name)
  const command = args[0]; //The first argument is the command (add, update, delete, list, etc.)
  switch (command){
    case "add":
      if (args.length < 2 ){
        console.error('Usage: node task-trader.js add "task description"');
        break; //If the command is "add", check if a description is provided
      }
      addTask(args[1]); //Call the addTask function with the provided description
      break;
      case "update":
        if (args.length < 3){
          console.error('Usage: node task-tracker.js update taskID " new description');
          break; //If the command is "update", check if an ID and a new description are provided
        }
        case 'status':
          if(args.length <3){
            console.error('Usage: node task-tracker.js status taskId newStatus'); //If the command is "status", check if an ID and a new status are provided
            break;
          }
          updateTaskStatus(args[1],args[2]); //Call the updateTaskStatus function with the provided ID and new status
          break;
           
          case "delete" :
            if(args.length < 2){
              console.error('Usage: node task-tracker.js delete taskId');
              break; //If the command is "delete", check if an ID is provided
            }
            deleteTask(args[1]); //Call the deleteTask function with the provided ID
            break;
            case "list":
              listTaskFilter(args[1]); //If the command is "list", call the listTaskFilter function with the provided status filter
              break;
              case "list-todo":
                listTasks("todo"); //If the command is "list-todo", call the listTaskFilter function with "todo" status
                break;
                case "list-in-progress":
                  listTasks("in-progress"); //If the command is "list-in-progress", call the listTaskFilter function with "in-progress" status
                  break;
                  case "list-done":
                    listTasks("done");
                    break;
                    default:
                      console.log("Available commands:");
                      console.log(' add "description" - Add a new task');
                      console.log(' update taskId "new description" - Update an existing task');
                      console.log(' status taskId newStatus - Update the status of an existing task');
                      console.log(' delete taskId - Delete a task');
                      console.log(' list - List all tasks');
                      console.log(' list-todo - List all todo tasks');
                      console.log(' list-in-progress - List all in-progress tasks');
                      console.log(' list-done - List all done tasks');
  }
}
main(); //Call the main function to start the task tracker
//This is the main function that initializes the task file and processes the command line arguments