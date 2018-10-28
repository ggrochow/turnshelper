
document.addEventListener('DOMContentLoaded', () => {
    let users = [
        // {
        //     name: 0,
        //     posts: 0,
        //     hunts: 0,
        //     joinedAt: "7:36 pm",
        // }
    ];

    const resetAllButton = document.getElementById('clearListButton');
    const addUserForm = document.getElementById('addUserForm');

    const userNameInput = document.getElementById('userNameInput');
    const userTableBody = document.getElementById('usersBody');
    const hostPostButton = document.getElementById('hostPostButton');

    const removeButtons = document.querySelectorAll('.removeUser');
    const postButtons = document.querySelectorAll('.questPost');

    function addUser(name) {
        users.push({
            name,
            posts: 0,
            hunts: 0,
            joinedAt: moment().format("h:mm a"),
        });
    }

    function loadUsers() {
        let usersStr = localStorage.getItem('turnsUsers');
        if (usersStr) {
            users = JSON.parse(usersStr);
        }
    }

    function saveUsers() {
        localStorage.setItem('turnsUsers', JSON.stringify(users));
    }

    function drawUsers() {
        let userRows = userTableBody.querySelectorAll('.user');

        userRows.forEach( (row, index) => {
            let nameTd = row.querySelector('.name');
            let turnsTd = row.querySelector('.turns');
            let huntsTd = row.querySelector('.hunts');
            let joinedTd = row.querySelector('.joinedAt');

            let user = users[index];
            if (!user) {
                row.classList.add("is-hidden");
                user = {};
            } else {
                row.classList.remove("is-hidden");
            }

            nameTd.innerText = user.name || '';
            turnsTd.innerText = user.posts || '';
            huntsTd.innerText = user.hunts || '';
            joinedTd.innerText = user.joinedAt || '';
        });
    }

    function getUserIndexFromEvent(e) {
        let buttonContainer = e.target.parentElement;
        return buttonContainer.dataset.index;
    }

    function increaseUserQuestCount() {
        users.forEach((user) => {
            user.hunts++;
        });
    }

    function handlePosted(e) {
        let currentUserIndex = getUserIndexFromEvent(e);

        users[currentUserIndex].posts++;
        increaseUserQuestCount();

        saveUsers();
        drawUsers();
    }


    function handleAddUser(e) {
        e.preventDefault();

        if (users.length >= 3) {
            alert("Hub can't handle new players, remove one first");
            return;
        }

        let name = userNameInput.value;
        if (!name || name.length === 0) {
            alert("Please enter a name");
            return;
        }

        userNameInput.value = '';
        addUser(name);

        saveUsers();
        drawUsers();
    }

    function handleRemoveUser(e) {
        let currentUserIndex = getUserIndexFromEvent(e);
        users.splice(currentUserIndex, 1);

        saveUsers();
        drawUsers();
    }

    function handleResetAll() {
        users = [];

        saveUsers();
        drawUsers();
    }

    function handleHostQuestPost() {
        increaseUserQuestCount();

        saveUsers();
        drawUsers();
    }


    addUserForm.addEventListener('submit', handleAddUser);
    resetAllButton.addEventListener('click', handleResetAll);
    hostPostButton.addEventListener('click', handleHostQuestPost);

    removeButtons.forEach((ele) => ele.addEventListener('click', handleRemoveUser));
    postButtons.forEach((ele) => ele.addEventListener('click', handlePosted));

    loadUsers();
    drawUsers();
});
