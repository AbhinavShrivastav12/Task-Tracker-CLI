const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Initialize tasks file if it doesn't exist
function initTasksFile() {
    if (!fs.existsSync(TASKS_FILE)) {
        fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
    }
}

// Read tasks from file
function readTasks() {
    try {
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading tasks file:', err.message);
        process.exit(1);
    }
}

// Write tasks to file
function writeTasks(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error('Error writing tasks file:', err.message);
        process.exit(1);
    }
}

// Generate a unique ID
function generateId() {
    return Date.now().toString();
}

// Add a new task
function addTask(description) {
    const tasks = readTasks();
    const newTask = {
        id: generateId(),
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    writeTasks(tasks);
    console.log('Task added successfully:');
    console.log(`ID: ${newTask.id}`);
    console.log(`Description: ${newTask.description}`);
    console.log(`Status: ${newTask.status}`);
}

// Main CLI handler
function main() {
    initTasksFile();
    
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (command === 'add' && args.length >= 2) {
        addTask(args[1]);
    } else {
        console.log('Usage: node task-tracker.js add "task description"');
    }
}

main();