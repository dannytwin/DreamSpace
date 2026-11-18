const tasksKey = 'dreamspace.tasks.v1';
const settingsKey = 'dreamspace.settings.v1';

const defaultTasks = [
    { id: 'html-lesson', title: 'Complete HTML lesson', category: 'Web development', completed: false },
    { id: 'chapter-three', title: 'Read chapter three', category: 'Personal development', completed: false },
    { id: 'review-css', title: 'Review CSS', category: 'Web development', completed: false },
    { id: 'practice-javascript', title: 'Practice JavaScript', category: 'Web development', completed: false },
];

const defaultSettings = {
    username: 'DreamUser',
    email: 'dream@example.com',
    theme: 'Light Mode',
    notifications: true,
};

function getData(key, defaultData) {
    const savedData = localStorage.getItem(key);

    if (savedData) {
        return JSON.parse(savedData);
    }

    return defaultData;
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

const DreamSpace = {
    getTasks: function () {
        return getData(tasksKey, defaultTasks);
    },

    saveTasks: function (tasks) {
        saveData(tasksKey, tasks);
    },

    getSettings: function () {
        const savedSettings = getData(settingsKey, {});

        return {
            username: savedSettings.username || defaultSettings.username,
            email: savedSettings.email || defaultSettings.email,
            theme: savedSettings.theme || defaultSettings.theme,
            notifications: savedSettings.notifications === undefined
                ? defaultSettings.notifications
                : savedSettings.notifications,
        };
    },

    saveSettings: function (settings) {
        saveData(settingsKey, settings);
    },

    getStats: function () {
        const tasks = this.getTasks();
        let completed = 0;
        let categories = [];

        tasks.forEach(function (task) {
            if (task.completed) {
                completed += 1;
            }

            if (categories.indexOf(task.category) === -1) {
                categories.push(task.category);
            }
        });

        return {
            total: tasks.length,
            completed: completed,
            pending: tasks.length - completed,
            categories: categories.length,
        };
    },
};
