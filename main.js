import { setListStorage } from './localStorage.js';
// const setListStorage = (key, value) => {
//     localStorage.setItem(key, JSON.stringify(value))
// }

// var localStorageFunctions = require('localStorage.js');
var getLocalStorage = localStorageFunctions.getLocalStorage;
// var setListStorage = localStorageFunctions.setListStorage;

const editEvent = (task_input, edit_button) => {
    let oldValue = task_input.value;
    task_input.removeAttribute("readOnly");
    task_input.focus(); // Didn't know that focus was a function. Thought it was a attribute.
    edit_button.innerText = "Save";
    edit_button.addEventListener('click', () => {saveEvent(task_input, edit_button, oldValue)});
}

const saveEvent = (task_input, edit_button, oldValue) => {
    task_input.setAttribute("readOnly", "readOnly");
    edit_button.innerText = "Edit";
    task_array = task_array.map(item => item === oldValue ? task_input.value : item);
    setListStorage('taskList', task_array);

    edit_button.addEventListener('click', () => {editEvent(task_input, edit_button)})
}

const deleteEvent = (task_item, task_input) => {
    let confirm_button = createButton("Confirm");
    confirm_button.addEventListener('click', () => {confirmEvent(popup, task_item, task_input)})

    let cancel_button = createButton("Cancel");
    cancel_button.addEventListener('click', () => {cancelEvent(popup, task_item)}); 

    let popup = createPopUp(confirm_button, cancel_button);

    body.appendChild(popup);
    task_item.setAttribute("hidden", "hidden");
}

const cancelEvent = (popup, task_item) => {
    popup.remove();
    task_item.removeAttribute("hidden");
}

const confirmEvent = (popup, task_item, task_input) => {
    popup.remove();
    let value = task_input.value;
    task_array = task_array.filter((task) => task != value);
    setListStorage('taskList', task_array);

    task_item.remove();
}

const popUpHeading = () => {
    let heading = document.createElement('h3');
    heading.innerText = 'Confirm Popup';
    return heading;
}

const constructPopUp = (popup, heading, confirm_button, cancel_button) => {
    popup.appendChild(heading);
    popup.appendChild(confirm_button);
    popup.appendChild(cancel_button);
}

const constructTaskItem = (task_item, task_input, edit_button, delete_button) => {
    task_item.appendChild(task_input);
    task_item.appendChild(edit_button);
    task_item.appendChild(delete_button);
}

const constructTaskInput = (task_input, value) => {
    task_input.setAttribute("readOnly", "readOnly");
    task_input.value = value;
}

const createPopUp = (confirm_button, cancel_button) => {
    let popup = document.createElement('div');
    let heading = popUpHeading();
    popup.classList.add('popup');

    constructPopUp(popup, heading, confirm_button, cancel_button)
    return popup;
}

const createButton = (label) => {
    let button = document.createElement("button");
    button.innerText = label;
    return button;
}

const createTaskItem = (value) => {
    let task_item = document.createElement("div");

    let task_input = document.createElement("input");

    constructTaskInput(task_input, value)

    let edit_button = createButton("Edit");
    edit_button.addEventListener('click', () => {editEvent(task_input, edit_button)});

    let delete_button = createButton("Delete");
    delete_button.addEventListener('click', () => {deleteEvent(task_item, task_input)});

    constructTaskItem(task_item, task_input, edit_button, delete_button);

    return task_item;
}

let form = document.getElementById("new_task");
let body = document.getElementById("body");
let newTask = form.input;
let list = document.getElementById("task_list");

let initialTasks = JSON.parse(localStorage.getItem('taskList'));
let task_array = [];

if(initialTasks && initialTasks.length > 0){
    task_array = initialTasks;
}

if(task_array && task_array.length > 0) {
    for(let j = 0; j < task_array.length; j++){
        list.append(createTaskItem(task_array[j]));
    }
}

document.addEventListener('submit', (e) => {
    e.preventDefault();

    let task_item = createTaskItem(newTask.value);

    task_array.push(newTask.value);
    setListStorage('taskList', task_array);

    list.appendChild(task_item);
    newTask.value = "";
})
