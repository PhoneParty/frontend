import time

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import json
from random import choice

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)


@socketio.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/lobby')
def lobby():
    return render_template("lobbyScreen.html")


@app.route('/game')
def game():
    return render_template("whoAmIGameScreen.html")


@socketio.on('connect')
def on_connect():
    print("Client connected")
    socketio.start_background_task(send_data)
    socketio.start_background_task(send_end_game)
    socketio.send('{"isOwner": true}')


@socketio.on('message')
def on_message(data):
    print("Got message:", data)
    if "joinRequest" in data:
        socketio.send(json.dumps({"joinRequestAccept": True, "redirect": "lobby?id=1234"}))
    if "startGameRequest" in data:
        socketio.send(json.dumps({"startGame": True, "redirect": "game?id=1234"}))


def send_data():
    while True:
        time.sleep(3)
        timestamp = time.strftime('%H:%M:%S')
        message = f"Server message at {timestamp}"
        socketio.send('{"players": [{"name": "externus"}, {"name": "egor spitsyn"}]}')
        socketio.send(json.dumps({"changeTurnState": choice(["judge", "guess", "view"]),
                                  "characterName": "Benya Salin",
                                  "characterImage": "static/src/BenyaSalin.jpg"}))
        print(f"Sent message: {message}")


def send_end_game():
    while True:
        time.sleep(12)
        timestamp = time.strftime('%H:%M:%S')
        message = f"Server message at {timestamp}"
        socketio.send(json.dumps({"gameEnd": True,
                                  "redirect": "/gameEnd?id=1234"}))
        print(f"Sent end game message on {timestamp}")


if __name__ == '__main__':
    socketio.run(app, allow_unsafe_werkzeug=True)

