function Quote(url, apiKey) {
    this.url = url;
    this.apiKey = apiKey;

    this.getQuote = function () {
        return fetch(this.url, {
            headers: { 'X-Api-Key': this.apiKey },
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return response.json();
            })
            .then(function (data) {
                return quoteResponseParser(data);
            });
    };

    this.hydrateDom = async function (quoteID, authorID) {
        const quoteElement = document.getElementById(quoteID);
        const authorElement = document.getElementById(authorID);

        try {
            const data = await this.getQuote();

            quoteElement.textContent = `“${data[0]}”`;
            authorElement.textContent = `— ${data[1]}`;
        } catch (error) {
            console.log(error);

            quoteElement.textContent = '“Great things are done by a series of small things brought together.”';
            authorElement.textContent = '— Vincent van Gogh';
        }
    };
}

function Courses() {
    this.courses = [];

    this.addCourse = function (course) {
        this.courses.push(course);
    };

    this.removeCourse = function (course) {
        const index = this.courses.indexOf(course);

        if (index !== -1) {
            this.courses.splice(index, 1);
        }
    };

    this.assignTask = function (course, task) {
        if (!course.tasks) {
            course.tasks = [];
        }

        course.tasks.push(task);
    };
}

function Task(title, category) {
    this.id = new Date().getTime();
    this.title = title;
    this.category = category;
    this.completed = false;
}

function Profile(username, email) {
    this.username = username;
    this.email = email;
}

function Notification(message) {
    this.message = message;
    this.createdAt = new Date();
}

function quoteResponseParser(data) {
    if (!data || data.length === 0) {
        throw new Error('No quote was returned.');
    }

    return [data[0].quote, data[0].author];
}

function setupHomeNavigation() {
    const tasksCard = document.querySelector('.tasks-card');
    const progressCard = document.querySelector('.progress-card');
    const getStartedButton = document.querySelector('.welcome-text button');

    if (tasksCard) {
        tasksCard.addEventListener('click', function () {
            window.location.href = 'tasks.html';
        });
    }

    if (progressCard) {
        progressCard.addEventListener('click', function () {
            window.location.href = 'progress.html';
        });
    }

    if (getStartedButton) {
        getStartedButton.addEventListener('click', function () {
            window.location.href = 'tasks.html';
        });
    }
}

function updateHomeSummary() {
    const stats = DreamSpace.getStats();
    const taskDescription = document.querySelector('.tasks-card p');

    if (taskDescription) {
        taskDescription.textContent = `${stats.pending} task${stats.pending === 1 ? '' : 's'} to focus on`;
    }
}

const url = 'https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom';
const apiKey = 'mkndHWUK9HgsRJf2d5fChuBhUIdnhL39wOvxTOrN';
const quote = new Quote(url, apiKey);

quote.hydrateDom('quote-main', 'quote-author');
setupHomeNavigation();
updateHomeSummary();



