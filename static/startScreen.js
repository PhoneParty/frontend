const socket = io();

socket.on('connect', function (data) {
    console.log('Socket.IO is connected!!!');
});


socket.on('message', (data) => {
    const parsedData = JSON.parse(data);
    if ("joinRequestAccept" in parsedData) {
        handleJoinRequestAccept(parsedData)
    }
});

let button = document.getElementById('play_button');
button.onclick = function () {
    socket.send({"joinRequest": 1234})
};


function handleJoinRequestAccept(parsedData) {
    if (parsedData["joinRequestAccept"]) {
        window.location.assign(parsedData["redirect"]);
    }
}