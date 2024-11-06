const socket = io();
socket.on('connect', function (data) {
    console.log('Socket.IO is connected!!!');
});
socket.on('message', (data) => {
    const parsedData = JSON.parse(data);
    if ("players" in parsedData){
        updatePlayerList(parsedData)
    }
    if ("isOwner" in parsedData){
        changeButtonsAccordingToOwner(parsedData["isOwner"])
    }
    if ("startGame" in parsedData){
        handleGameStart(parsedData)
    }
});

function updatePlayerList(playerData) {
    let playerList = document.getElementById("player-list");
    playerList.innerHTML = "";
    let resPlayerList = "";
    for (const item of playerData.players) {
        resPlayerList += "<p>" + item.name + "</p>"
    }
    playerList.innerHTML = resPlayerList;
}

function handleGameStart(parsedData){
    if (parsedData["startGame"]) {
        window.location.assign(parsedData["redirect"]);
    }
}

function changeButtonsAccordingToOwner(isOwner) {
    if (isOwner){
        document.getElementById("non_owner_button").remove();
    }
    else {
        document.getElementById("owner_button").remove();
    }
}

let startButton = document.getElementById("owner_button")
startButton.onclick = function (){
    socket.send({"startGameRequest": true})
}