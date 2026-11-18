// elements tagets
const tabs = document.querySelector('.task-filters');
const tasks = document.querySelector('.task-list');
const search = document.querySelector('input[type="search"]');
const taskForm = document.querySelector('#task-form');
const taskTitle = document.querySelector('#task-title');
const taskCategory = document.querySelector('#task-category');

// data
const tabData = [
    { value: 'all', active: true, text: 'All' },
    { value: 'pending', active: false, text: 'Pending' },
    { value: 'completed', active: false, text: 'Completed' },
];

let taskData = DreamSpace.getTasks();
let activeFilter = 'all';

// helper functions

function makeId() {
    return Date.now().toString();
}

function escapeHTML(value) {
    const element = document.createElement('div');
    element.textContent = value;
    return element.innerHTML;
}

function findTask(taskId) {
    for (let i = 0; i < taskData.length; i += 1) {
        if (taskData[i].id === taskId) {
            return taskData[i];
        }
    }

    return null;
}

function tabRenderer(tab) {
    return `<button type="button" class="${tab.active ? 'selected' : ''}" data-filter="${tab.value}">
        ${tab.text}
    </button>`;
}

function taskRenderer(task) {
    return `<article class="task-item ${task.completed ? 'completed' : ''}">
        <input
            type="checkbox"
            data-task-id="${task.id}"
            aria-label="Mark ${escapeHTML(task.title)} as complete"
            ${task.completed ? 'checked' : ''}
        >
        <div>
            <h3>${escapeHTML(task.title)}</h3>
            <p>${escapeHTML(task.category)}</p>
        </div>
        <button
            class="task-delete"
            type="button"
            data-delete-id="${task.id}"
            aria-label="Delete ${escapeHTML(task.title)}"
        >
            <i class="fa-solid fa-trash" aria-hidden="true"></i>
        </button>
    </article>`;
}

function getVisibleTasks() {
    const visibleTasks = [];
    const searchText = search.value.toLowerCase().trim();

    for (let i = 0; i < taskData.length; i += 1) {
        const task = taskData[i];
        const taskText = `${task.title} ${task.category}`.toLowerCase();
        let matchesFilter = true;

        if (activeFilter === 'pending' && task.completed) {
            matchesFilter = false;
        }

        if (activeFilter === 'completed' && !task.completed) {
            matchesFilter = false;
        }

        if (matchesFilter && taskText.indexOf(searchText) !== -1) {
            visibleTasks.push(task);
        }
    }

    return visibleTasks;
}

function renderTabs() {
    tabs.innerHTML = '';

    tabData.forEach(function (tab) {
        tabs.innerHTML += tabRenderer(tab);
    });
}

function renderTasks() {
    const visibleTasks = getVisibleTasks();
    tasks.innerHTML = '';

    if (visibleTasks.length === 0) {
        tasks.innerHTML = '<div class="empty-state"><strong>No tasks here yet.</strong><span>Add a task above or change the filter.</span></div>';
        return;
    }

    visibleTasks.forEach(function (task) {
        tasks.innerHTML += taskRenderer(task);
    });
}

function renderPage() {
    renderTabs();
    renderTasks();
}

tabs.addEventListener('click', function (event) {
    const selectedTab = event.target.closest('button');

    if (!selectedTab) return;

    activeFilter = selectedTab.dataset.filter;

    tabData.forEach(function (tab) {
        tab.active = tab.value === activeFilter;
    });

    renderPage();
});

tasks.addEventListener('change', function (event) {
    if (event.target.type !== 'checkbox') return;

    const task = findTask(event.target.dataset.taskId);

    if (!task) return;

    task.completed = event.target.checked;
    DreamSpace.saveTasks(taskData);
    renderTasks();
});

tasks.addEventListener('click', function (event) {
    const deleteButton = event.target.closest('.task-delete');

    if (!deleteButton) return;

    const taskId = deleteButton.dataset.deleteId;

    for (let i = 0; i < taskData.length; i += 1) {
        if (taskData[i].id === taskId) {
            taskData.splice(i, 1);
            break;
        }
    }

    DreamSpace.saveTasks(taskData);
    renderTasks();
});

taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = taskTitle.value.trim();

    if (!title) return;

    const newTask = {
        id: makeId(),
        title: title,
        category: taskCategory.value,
        completed: false,
    };

    taskData.unshift(newTask);
    DreamSpace.saveTasks(taskData);

    taskForm.reset();
    taskTitle.focus();
    activeFilter = 'all';

    tabData.forEach(function (tab) {
        tab.active = tab.value === activeFilter;
    });

    renderPage();
});

search.addEventListener('input', function () {
    renderTasks();
});

renderPage();
