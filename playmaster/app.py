import os
from flask import Flask, jsonify, Response ,request
import redis
import json

app = Flask(__name__)

r = redis.Redis(host=os.environ['REDIS_HOST'], port=os.environ['REDIS_PORT'], db=os.environ['REDIS_DB'])

@app.route("/playmaster/setstate", methods=["POST"])
def setstate():

    state = request.json['state']
    #temp = json.loads(state)
    r.set(str(state[0]), json.dumps(state))
    return Response("correct send"+str(state[0]), status=200)


@app.route("/playmaster/getstate", methods=["GET"])
def getstate():
    gameid = request.json['gameid']
    #gameid = json.loads(gameid)
    value = json.loads(r.get(str(gameid)))
    return str(value)

@app.route("/playmaster/initstate", methods=["POST"])
def initstate():
    gameid = request.json['gameid']
    player1 = request.json['player1']
    player2 = request.json['player2']
    #gameid = json.loads(gamedate)
    data = {}
    init_state = [gameid, player1, player2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0] #last 3 are turn ,winner ,gamefinished
    data['state'] = init_state
    r.set(gameid, json.dumps(data))
    return Response("correct init"+str(gameid), status=200)

if __name__ == "__main__":
    app.run(debug=False)
