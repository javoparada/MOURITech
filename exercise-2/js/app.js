(function () {
  const data = window.localStorage;
  const addButton = document.getElementById('add-button');
  const incompleteTasksHolder = document.getElementById('incomplete-tasks');
  const completedTasksHolder = document.getElementById('completed-tasks');

  const createNewTaskElement = function (obj) {
    const listItem = document.createElement('li');
    const checkBox = document.createElement('input');
    const editInput = document.createElement('input');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    checkBox.type = 'checkbox';
    checkBox.checked = obj.completed;
    editInput.type = 'text';
    editInput.disabled = obj.disabled;
    editInput.value = obj.name;
    editButton.innerText = obj.disabled ? 'Edit' : 'Save';
    editButton.className = 'edit';
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete';

    listItem.appendChild(checkBox);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
  };

  const addTask = function () {
    const taskInput = document.getElementById('new-task');
    const error = document.getElementById('error');
    const checkTaskName = function (name) {
      return tasks.find((task) => task.name == name);
    };
    const listItemName = taskInput.value;
    const taskExists = checkTaskName(listItemName);
    if (listItemName === '') {
      error.innerText = 'Please enter a name';
      taskInput.classList.add('red-border');
      taskInput.focus();
    } else if (typeof taskExists != 'undefined') {
      error.innerText = "Task's name already exists. Please enter another name";
      taskInput.classList.add('red-border');
      taskInput.focus();
    } else {
      const task = {
        name: listItemName,
        disabled: true,
        completed: false,
      };
      updateLocalStorage('add', task);
      const listItem = createNewTaskElement(task);
      incompleteTasksHolder.appendChild(listItem);
      error.innerText = '';
      taskInput.classList.remove('red-border');
      taskInput.value = '';
      bindTaskEvents(listItem, taskCompleted);
    }
  };

  const editTask = function () {
    const listItem = this.parentNode;
    const editInput = listItem.querySelector('input[type=text]');
    const button = listItem.querySelector('button');
    const oldName = editInput.getAttribute('data-old');
    const dataName = editInput.value;
    const isDisabled = editInput.disabled;
    const listObj = getListObject(listItem);
    if (isDisabled) {
      button.innerText = 'Save';
      editInput.focus();
    } else {
      button.innerText = 'Edit';
    }
    listObj.disabled = !isDisabled;
    updateLocalStorage('update', listObj, oldName || dataName);
    editInput.toggleAttribute('disabled');
    editInput.setAttribute('data-old', dataName);
  };

  const deleteTask = function () {
    const listItem = this.parentNode;
    const ul = listItem.parentNode;
    const listObj = getListObject(listItem);
    updateLocalStorage('delete', listObj);
    ul.removeChild(listItem);
  };

  const taskCompleted = function () {
    const listItem = this.parentNode;
    completedTasksHolder.appendChild(listItem);
    const listObj = getListObject(listItem);
    listObj.completed = true;
    updateLocalStorage('update', listObj, listObj.name);
    bindTaskEvents(listItem, taskIncomplete);
  };

  const taskIncomplete = function () {
    const listItem = this.parentNode;
    incompleteTasksHolder.appendChild(listItem);
    const listObj = getListObject(listItem);
    listObj.completed = false;
    updateLocalStorage('update', listObj, listObj.name);
    bindTaskEvents(listItem, taskCompleted);
  };

  const bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
    const checkBox = taskListItem.querySelector('input[type=checkbox]');
    const editButton = taskListItem.querySelector('.edit');
    const deleteButton = taskListItem.querySelector('.delete');
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
  };

  const initLocalStorage = function () {
    if (!data.getItem('tasks')) {
      data.setItem(
        'tasks',
        JSON.stringify([
          { name: 'See the Doctor', disabled: true, completed: true },
          { name: 'Pay Bills', disabled: true, completed: false },
          { name: 'Go Shopping', disabled: false, completed: false },
        ])
      );
    }

    return JSON.parse(data.getItem('tasks'));
  };

  const updateLocalStorage = function (action, obj, name) {
    switch (action) {
      case 'add':
        tasks.push(obj);
        break;
      case 'delete':
        tasks = tasks.filter((task) => task.name !== obj.name);
        break;
      case 'update':
      default:
        const index = tasks.findIndex((task) => task.name === name);
        tasks[index] = obj;
        break;
    }
    data.setItem('tasks', JSON.stringify(tasks));
  };

  const getListObject = function (listItem) {
    const completed = listItem.querySelector('input[type="checkbox"]').checked;
    const disabled = listItem.querySelector('input[type="text"]').disabled;
    const name = listItem.querySelector('input[type="text"]').value;
    return { name: name, disabled: disabled, completed: completed };
  };

  const renderTasksHolder = function (tasksArray) {
    for (let task of tasksArray) {
      const listItem = createNewTaskElement(task);
      if (task.completed) {
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete);
      } else {
        incompleteTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
      }
    }
  };

  let tasks = initLocalStorage();
  addButton.addEventListener('click', addTask);
  renderTasksHolder(tasks);
})();
