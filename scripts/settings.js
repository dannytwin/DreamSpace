const usernameInput = document.querySelector('.settings-card input[type="text"]');
const emailInput = document.querySelector('.settings-card input[type="email"]');
const themeSelect = document.querySelector('.settings-card select');
const notificationsInput = document.querySelector('.notification-setting input');
const saveButton = document.querySelector('.save-button');

const settings = DreamSpace.getSettings();

usernameInput.value = settings.username;
emailInput.value = settings.email;
themeSelect.value = settings.theme;
notificationsInput.checked = settings.notifications;

function applyTheme() {
    if (themeSelect.value === 'Dark Mode') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function saveSettings() {
    const updatedSettings = {
        username: usernameInput.value.trim() || 'DreamUser',
        email: emailInput.value.trim() || 'dream@example.com',
        theme: themeSelect.value,
        notifications: notificationsInput.checked,
    };

    DreamSpace.saveSettings(updatedSettings);

    saveButton.textContent = 'Changes saved';
    saveButton.disabled = true;

    window.setTimeout(function () {
        saveButton.textContent = 'Save Changes';
        saveButton.disabled = false;
    }, 1600);
}

themeSelect.addEventListener('change', function () {
    applyTheme();
});

saveButton.addEventListener('click', function () {
    saveSettings();
});

applyTheme();
