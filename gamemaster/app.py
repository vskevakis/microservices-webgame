import os
import requests
from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


# Initialize Application
app = Flask(__name__)

# Configuration of postgreSQL Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}'.format(
    user=os.environ['POSTGRES_USER'],
    password=os.environ['POSTGRES_PASSWORD'],
    host=os.environ['POSTGRES_HOST'],
    port=os.environ['POSTGRES_PORT'],
    db=os.environ['POSTGRES_DB'])

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Database
db = SQLAlchemy(app)


# Database User Model
class Userscore(db.Model):
    __tablename__ = "userscore"
    # user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False, primary_key=True)
    Wins = db.Column(db.Integer)
    Ties = db.Column(db.Integer)
    Loses = db.Column(db.Integer)

    def json(self):
        return {"username": self.username, "Wins": self.Wins, "Ties": self.Ties, "Loses": self.Loses}

class Queue(db.Model):
    __tablename__ = "queue"
    username = db.Column(db.String(255), unique=True, nullable=False, primary_key=True)

class Queuetournament(db.Model):
    __tablename__ = "queuetournament"
    username = db.Column(db.String(255), unique=True, nullable=False, primary_key=True)

class Tournament(db.Model):
    __tablename__ = "tournament"
    player1 = db.Column(db.String(255), nullable=False)
    player2 = db.Column(db.String(255), nullable=False)
    winner = db.Column(db.String(255))
    gameid = db.Column(db.String(255), primary_key=True)

# Create Database Table and Model
db.create_all()
db.session.commit()
from app import Userscore, Queue ,Queuetournament ,Tournament

# CreateUser API
@app.route("/gamemaster/initdb", methods=["POST"])
def initdb():
    username = request.json['username']

    userscore = Userscore(
        username=username,
        Wins=0,
        Ties=0,
        Loses=0
    )
    db.session.add(userscore)
    db.session.commit()

    return Response("Userdb created with great success" + username, status=200)


@app.route("/gamemaster/getscores", methods=["GET"])
def getscores():
    username = request.json['username']
    scores = Userscore.query.filter_by(username=username).first()

    return jsonify(scores.json())


@app.route("/gamemaster/updatescores", methods=["POST"])  #winner is : 1) for player1 win,2) for player2 win,else tie
def updatescores():
    username = request.json['player1']
    username2 = request.json['player2']
    winner = request.json['winner']
    scores1 = Userscore.query.filter_by(username=username).first()
    scores2 = Userscore.query.filter_by(username=username2).first()
    if winner == 1:
        scores1.Wins = scores1.Wins + 1
        scores2.Loses = scores2.Loses + 1
    elif winner == 2:
        scores1.Loses = scores1['Loses'] + 1
        scores2.Wins = scores2['Wins'] + 1
    else:
        scores1.Ties = scores1.Ties + 1
        scores2.Ties = scores2.Ties + 1

    db.session.add(scores1)
    db.session.add(scores2)
    db.session.commit()
    return Response("Userscoredb updated with great success", status=200)

@app.route("/gamemaster/starttictactoe", methods=["GET"])
def starttictactoe():
    username = request.json['username']
    if Userscore.query.filter_by(username=username).first() is not None:
        if len(db.session.query(Queue).all()) >= 1:
            username2 = db.session.query(Queue).first()
            now = datetime.now()
            dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
            data = {}
            gameid = username+"_"+username2.username+"_"+dt_string
            data['gameid'] = gameid
            #json.dumps(data)
            initgamestate = requests.post("http://playmaster:5001/playmaster/initstate", json={"gameid": gameid, "player1": username, "player2": username2.username})
            db.session.delete(username2)
            db.session.commit()
            return jsonify(data)
        else:
            queue = Queue(
                username=username,
            )
            db.session.add(queue)
            db.session.commit()
            return Response("waitting in queue", status = 200)
    else:
        return Response("error: name not found", status = 400)

@app.route("/gamemaster/starttictourn", methods=["GET"])
def starttictourn():
    username = request.json['username']
    if Userscore.query.filter_by(username=username).first() is not None:
        queuetour = Queuetournament(
            username=username,
        )
        db.session.add(queuetour)
        db.session.commit()
        if len(db.session.query(Queue).all()) >= 8:
            for i in range(0, 4):
                username2 = Queue.query.first()
                db.session.delete(username2)
                username = Queue.query.first()
                db.session.delete(username)
                now = datetime.now()
                dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
                data = {}
                gameid = username.username+"_"+username2.username+"_"+dt_string
                data['gameid'] = gameid
                initgamestate = requests.post("http://playmaster:5001/playmaster/initstate", json={"gameid": gameid, "player1": username.username, "player2": username2.username})
                #json.dumps(data)
                tournament = Tournament(
                    player1=username.username,
                    player2=username2.username,
                    gameid=gameid
                )
                db.session.add(tournament)
                db.session.commit()
            return jsonify(data)
        else:
            return Response("waitting in queue", status = 200)
    else:
        return Response("error: name not found", status = 400)

if __name__ == "__main__":
    app.run(debug=False)