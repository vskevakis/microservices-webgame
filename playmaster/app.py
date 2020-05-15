import os
from flask import Flask, jsonify, Response, request
from flask_socketio import SocketIO, emit
import redis
import time
import json

app = Flask(__name__)
socketio = SocketIO(app)


r = redis.Redis(host=os.environ['REDIS_HOST'],
                port=os.environ['REDIS_PORT'], db=os.environ['REDIS_DB'])


@app.route("/playmaster/setstate", methods=["POST"])
def setstate():

    state = request.json['state']
    #temp = json.loads(state)
    r.set(str(state[0]), json.dumps(state))
    return Response("correct send"+str(state[0]), status=200)


@app.route("/playmaster/getstate", methods=["POST"])
def getstate():
    gameid = request.json['gameid']
    # retries = 3
    success = False
    while not success:
        if (r.exists(str(gameid))):
            success = True
        else:
            # wait = retries * 30
            time.sleep(1)
            # retries += 1
    return r.get(str(gameid))


@app.route("/playmaster/initstate", methods=["POST"])
def initstate():
    gameid = request.json['gameid']
    game_owner = request.json['game_owner']
    #gameid = json.loads(gamedate)
    data = {}
    # last3) 12 are turn ,13 winner ,14 gameactive
    init_state = [gameid, game_owner, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]
    data['state'] = init_state
    r.set(gameid, json.dumps(data))
    return Response("correct init"+str(gameid), status=200)


@socketio.on('hi')
def hi_handler(json):
    gameid = json['game_id']
    username = json['username']
    if (r.exists(str(gameid))):
        game_state = json.loads(r.get(str(gameid)))
        init_state = {
            'game_id': gameid,
            'player1': game_state['username'],
            'player2': username,
            'state': game_state['state'],
            'turn': game_state['turn'],
            'active': 1,
            'winner': game_state['winner']
        }
        r.set(gameid, json.dumps(init_state))
    init_state = {
        'game_id': gameid,
        'player1': username,
        'player2': 'not yet',
        'state': [0, 0, 0, 0, 0, 0, 0, 0, 0],
        'turn': 'x',
        'active': 0,
        'winner': 0
    }
    r.set(gameid, json.dumps(init_state))


@socketio.on('get_state')
def game_handler(json):
    game_id = json['game_id']


@socketio.on('set_state')
def set_state(json):
    state = json['game_state']
    r.set(str(state[0]), json.dumps(state))


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5001)
