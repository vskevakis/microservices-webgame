import os
from gevent import monkey
import json
import redis
from flask_socketio import SocketIO, emit
from flask import Flask, jsonify
monkey.patch_all()


app = Flask(__name__)
socketio = SocketIO(app)  # async_mode=async_mode,


r = redis.Redis(host=os.environ['REDIS_HOST'],
                port=os.environ['REDIS_PORT'], db=os.environ['REDIS_DB'])


@socketio.on("start")
def start_handler(data):
    game_id = data['game_id']
    username = data['username']
    if (r.exists(game_id)):
        game_state = json.loads(r.get(game_id))
        if (game_state['player1'] == username):
            emit('waiting')
        else:
            init_state = {
                'game_id': game_id,
                'player1': game_state['player1'],
                'player2': username,
                'state': game_state['state'],
                'turn': game_state['turn'],
                'active': 1,
                'winner': game_state['winner']
            }
            emit('playing')  # this propably needs change and are here for reference
    else:
        init_state = {
            'game_id': game_id,
            'player1': username,
            'player2': 'not yet',
            'state': [0, 0, 0, 0, 0, 0, 0, 0, 0],
            'turn': 'x',
            'active': 0,
            'winner': 0
        }
        emit('waiting')  # this propably needs change and are here for reference
    r.set(game_id, json.dumps(init_state))


@socketio.on('get_state')
def game_handler(data):
    game_id = data['game_id']
    game = r.get(game_id)
    emit('response get_state', game)  # this propably ok


@socketio.on('set_state')
def set_state(data):
    state = {
        'game_id': data['game_id'],
        'player1': data['y'],
        'player2': data['player2'],
        'state': data['state'],
        'turn': data['turn'],
        'active': data['active'],
        'winner': data['winner']
    }
    r.set(str(data['game_id']), json.dumps(state))


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
