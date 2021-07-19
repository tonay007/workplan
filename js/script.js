import loginInfo from "./loginInfo.js";
import tasks from "./tasks.js";
let loginArea = document.querySelector(".login-area");
let welcomeArea = document.querySelector(".welcome-area");
let taskArea = document.querySelector(".task-area");
let userInfo;

document.querySelector("#login").addEventListener("click", () => {
    let tokenInput = document.querySelector("#token").value;
    let tokenArr = [];
    loginInfo.map(user => tokenArr.push(user.token));
    let matchedToken = tokenArr.filter(token => token === tokenInput);
    if (matchedToken.length == 1) {
        loginArea.style.display = 'none';
        welcomeArea.style.display = 'block';
        userInfo = loginInfo.filter(user => matchedToken[0] === user.token);
        let { name, role } = userInfo[0];
        let usernames = document.getElementsByClassName('username');
        for (let i = 0; i < usernames.length; i++) {
            usernames[i].innerText = name
        }
        let roles = document.getElementsByClassName('role');
        for (let i = 0; i < usernames.length; i++) {
            roles[i].innerText = role;
        }
    }
    else {
        document.querySelector(".wrong-token").style.display = 'block';
    }

    let date = fetchDate();

    fetchTasks(matchedToken, date);

})

const fetchDate = () => {
    const dateAndTime = new Date();
    const year = dateAndTime.getFullYear();
    let month = dateAndTime.getMonth() + 1;
    const date = dateAndTime.getDate();
    month = (month).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
    const formattedDate = `${date}-${month}-${year}`;
    return formattedDate;
}

const fetchTasks = (token, date) => {
    const taskContainer = document.querySelector(".task");
    const noTaskFoundContainer = document.querySelector("#no-tasks-found");
    const nextTaskDate = document.querySelector('.next-task-date');
    const foundTasks = tasks.filter(task => task.token === token[0] && task.date === date)
    if (foundTasks.length !== 0) {
        const length = document.createElement("h3");
        const lengthText = document.createTextNode("Task Found: " + foundTasks.length)
        length.appendChild(lengthText);
        taskContainer.appendChild(length);
    }
    else {
        noTaskFoundContainer.style.display = "block";
        const nextDate = checkNextTask(token, date);
        if(nextDate){
            nextTaskDate.innerText = nextDate[0] || true;
        }
    }
}

const checkNextTask = (token, date) => {
    let dateParticles = date.split("-");
    dateParticles = arrayNumConvert(dateParticles);
    const allTasks = tasks.filter(task => task.token == token[0]);
    let allTasksDates = [];
    allTasks.map(task => allTasksDates.push(task.date));
    let resultDates = []
    for (let i = 0; i < allTasksDates.length; i++){
        let matchedDateParticles = allTasksDates[i].split("-");
        matchedDateParticles = arrayNumConvert(matchedDateParticles);
        if(dateParticles[0] <= matchedDateParticles[0] && dateParticles[1] <= matchedDateParticles[1] && dateParticles[2] <= matchedDateParticles[2]){
            resultDates.push(allTasksDates[i]);
        }
    }
    if(resultDates.length !== 0){
        return resultDates;
    }
    else{
        document.querySelector(".next-task-text").innerHTML = 'Your next task will appear soon!'
    }
}

const arrayNumConvert = array => {
    let arr = [];
    array.map(str => arr.push(parseFloat(str)));
    return arr;
}

document.querySelector("#show-task").addEventListener("click", () => {
    welcomeArea.style.display = 'none';
    taskArea.style.display = 'block';
})