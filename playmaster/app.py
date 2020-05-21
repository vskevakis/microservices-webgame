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
    game_type = data['game_type']
    if (r.exists(game_id)):
        game_state = json.loads(r.get(game_id))
        if (game_state['player1'] == username):
            emit('waiting')
        else:
            init_state = {
                'game_id': game_id,
                'game_type':game_state['game_type'],
                'player1': game_state['player1'],
                'player2': username,
                'board': game_state['board'],
                'turn': username,
                'active': "1",
                'winner': game_state['winner']
            }
            emit('playing', init_state)
            # emit('playing')  # this propably needs change and are here for reference
    else:
        #emit('waiting2')
        if game_type == "Tic_tac_toe":
            init_state = {
                'game_id': game_id,
                'game_type': "Tic_tac_toe",
                'player1': username,
                'player2': 'not yet',
                'board': [None, None, None, None, None, None, None, None, None],
                'turn': 'not yet',
                'active': "0",
                'winner': "0"
            }
        elif game_type == "Chess":
            init_state = {
            'game_id': game_id,
            'game_type': "Chess",
            'player1': username,
            'player2': 'not yet',
            'board': 'start',
            'turn': 'not yet',
            'active': "0",
            'winner': "0"
            }
        emit('waiting')  # this propably needs change and are here for reference
    r.set(game_id, json.dumps(init_state))


@socketio.on('get_state')
def game_handler(data):
    game_id = data['game_id']
    game_info = json.loads(r.get(game_id))
    emit('response get_state', game_info)  # this propably ok


@socketio.on('get_state2')
def game_handler2(data):
    game_id = data['game_id']
    game_info = json.loads(r.get(game_id))
    emit('playing', game_info)


@socketio.on("set_state")
def set_state2(data):
    state = {
        'game_id': data['game_id'],
        'player1': data['player1'],
        'player2': data['player2'],
        'board': data['board'],
        'turn': data['turn'],
        'active': data['active'],
        'winner': data['winner']
    }
    r.set(data['game_id'], json.dumps(state))
    emit('waiting')


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
