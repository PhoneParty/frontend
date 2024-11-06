const socket = io();

socket.on('connect', function (data) {
    console.log('Socket.IO is connected!!!');
});

socket.on('message', (data) => {
    const parsedData = JSON.parse(data);
    if ("changeTurnState" in parsedData) {
        handleChangeTurnState(parsedData)
    }
    if ("gameEnd" in parsedData){
        handleGameEnd(parsedData)
    }
});


const guessScreen = document.getElementById("guess-screen")
const viewScreen = document.getElementById("view-screen")
const judgeScreen = document.getElementById("judge-screen")

function changeState(newState){
    switch (newState) {
        case "guess":
            viewScreen.classList.add("visually-hidden")
            judgeScreen.classList.add("visually-hidden")
            guessScreen.classList.remove("visually-hidden")
            break;
        case "view":
            guessScreen.classList.add("visually-hidden")
            judgeScreen.classList.add("visually-hidden")
            viewScreen.classList.remove("visually-hidden")
            break;
        case "judge":
            guessScreen.classList.add("visually-hidden")
            viewScreen.classList.remove("visually-hidden")
            judgeScreen.classList.remove("visually-hidden")
            break;
        default:
            alert("Wrong state received!!!");
    }
}


const characterNameElement = document.getElementById("characterName")
const characterImageElement = document.getElementById("characterImage")
function changeCharacter(characterName, imageSource){
    characterNameElement.innerHTML = characterName
    characterImageElement.src = imageSource
}

function handleChangeTurnState(data){
    changeState(data["changeTurnState"])
    changeCharacter(data["characterName"], data["characterImage"])
}

function handleGameEnd(data){
    if (data["gameEnd"]){
        window.location.assign(data["redirect"]);
    }
}

const wrongGuessButton = document.getElementById("wrongGuessButton")
const rightGuessButton = document.getElementById("rightGuessButton")

wrongGuessButton.onclick = function (){
    socket.send({"judgeTurn": false})
}
rightGuessButton.onclick = function (){
    socket.send({"judgeTurn": true})
}