const tasks = DreamSpace.getTasks();
const stats = DreamSpace.getStats();
const statCards = document.querySelectorAll('.stat-card');

function addLeadingZero(number) {
    if (number < 10) {
        return `0${number}`;
    }

    return number;
}

function getCoursePercentage(courseName) {
    let courseTasks = [];
    let completedTasks = 0;

    for (let i = 0; i < tasks.length; i += 1) {
        const task = tasks[i];
        const category = task.category.toLowerCase();
        const title = task.title.toLowerCase();
        let belongsToCourse = false;

        if (courseName === 'Web Development' && category === 'web development') {
            belongsToCourse = true;
        }

        if (courseName === 'Personal Development' && category === 'personal development') {
            belongsToCourse = true;
        }

        if (courseName === 'JavaScript Practice' && title.indexOf('javascript') !== -1) {
            belongsToCourse = true;
        }

        if (belongsToCourse) {
            courseTasks.push(task);

            if (task.completed) {
                completedTasks += 1;
            }
        }
    }

    if (courseTasks.length === 0) {
        return 0;
    }

    return Math.round((completedTasks / courseTasks.length) * 100);
}

if (statCards[0]) {
    statCards[0].querySelector('h2').textContent = addLeadingZero(stats.categories);
    statCards[0].querySelector('p').textContent = 'Learning areas in progress';
}

if (statCards[1]) {
    statCards[1].querySelector('h2').textContent = addLeadingZero(stats.completed);
    statCards[1].querySelector('p').textContent = `of ${stats.total} tasks completed`;
}

if (statCards[2]) {
    const minutes = stats.completed * 45;
    let studyTime = `${minutes} min`;

    if (minutes >= 60) {
        studyTime = `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    }

    statCards[2].querySelector('h2').textContent = studyTime;
    statCards[2].querySelector('p').textContent = 'Estimated focused time';
}

const progressItems = document.querySelectorAll('.progress-item');
const courseNames = [
    'Web Development',
    'Personal Development',
    'JavaScript Practice',
];

for (let i = 0; i < progressItems.length; i += 1) {
    const percentage = getCoursePercentage(courseNames[i]);

    progressItems[i].querySelector('h3').textContent = courseNames[i];
    progressItems[i].querySelector('span').textContent = `${percentage}%`;
    progressItems[i].querySelector('progress').value = percentage;
}
