import os
from flask import Flask, jsonify, Response ,request
import redis
import json

app = Flask(__name__)

r = redis.Redis(host=os.environ['REDIS_HOST'], port=os.environ['REDIS_PORT'], db=os.environ['REDIS_DB'])

@app.route("/playmaster/setstate", methods=["POST"])
def setstate():

    state = request.data
    temp = json.loads(state)
    temp = temp['state']
    r.set(str(temp[0]), state)
    return Response("correct send"+str(temp[0]), status=200)


@app.route("/playmaster/getstate", methods=["GET"])
def getstate():
    gameid = request.data
    gameid = json.loads(gameid)
    value = json.loads(r.get(str(gameid['gameid'])))
    return value

@app.route("/playmaster/initstate", methods=["POST"])
def initstate():
    gameid = request.data
    gameid = json.loads(gameid)
    data = {}
    init_state = [gameid['gameid'], 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
    data['state'] = init_state
    r.set(str(gameid['gameid']), json.dumps(data))
    return Response("correct init"+str(gameid['gameid']), status=200)

if __name__ == "__main__":
    app.run(debug=False)
