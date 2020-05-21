# from app import Userscore, Queue, Queuetournament, Tournament

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
    username = db.Column(db.String(255), unique=True,
                         nullable=False, primary_key=True)
    Wins = db.Column(db.Integer)
    Ties = db.Column(db.Integer)
    Loses = db.Column(db.Integer)
    #Winschess = db.Column(db.Integer)
    #Tieschess = db.Column(db.Integer)
    #Loseschess = db.Column(db.Integer)

    def json(self):
        return {"username": self.username, "Wins": self.Wins, "Ties": self.Ties, "Loses": self.Loses }#, "Winschess": self.Winschess, "Tieschess": self.Tieschess, "Loseschess": self.Loseschess}


class Queue(db.Model):
    __tablename__ = "queue"
    gameid = db.Column(db.String(255), unique=True,
                       nullable=False, primary_key=True)
    # username = db.Column(db.String(255), unique=True,
    #                      nullable=False, primary_key=True)
class Queue_Chess(db.Model):
    __tablename__ = "queue_Chess"
    gameid = db.Column(db.String(255), unique=True,
                       nullable=False, primary_key=True)

class Queuetournament(db.Model):
    __tablename__ = "queuetournament"
    gameid = db.Column(db.String(255), unique=True,
                       nullable=False, primary_key=True)
    # username = db.Column(db.String(255), unique=True,
    #                      nullable=False, primary_key=True)


class Tournament(db.Model):
    __tablename__ = "tournament"
    player1 = db.Column(db.String(255), nullable=False)
    player2 = db.Column(db.String(255), nullable=False)
    winner = db.Column(db.String(255))
    gameid = db.Column(db.String(255), primary_key=True)


# Create Database Table and Model
db.create_all()
db.session.commit()


# CreateUser API
@app.route("/gamemaster/createUser", methods=["POST"])
def createUser():
    username = request.json['username']

    userscore = Userscore(
        username=username,
        Wins=0,
        Ties=0,
        Loses=0,
        #WinsChess=0,
        #TiesChess=0,
        #LosesChess=0
    )
    db.session.add(userscore)
    db.session.commit()

    return Response("Userdb created with great success" + username, status=200)


@app.route("/gamemaster/getscores", methods=["GET"])
def getscores():
    username = request.json['username']
    scores = Userscore.query.filter_by(username=username).first()

    return jsonify(scores.json())


# winner is : 1) for player1 win,2) for player2 win,else tie
@app.route("/gamemaster/updatescores", methods=["POST"])
def updatescores():
    username = request.json['player1']
    username2 = request.json['player2']
    winner = request.json['winner']
    game_type = "Tic_tac_toe" #request.json['game_type']
    scores1 = Userscore.query.filter_by(username=username).first()
    scores2 = Userscore.query.filter_by(username=username2).first()
    if game_type=="Chess":
        if winner == 1:
            scores1.WinsChess = scores1.WinsChess + 1
            scores2.LosesChess = scores2.LosesChess + 1
        elif winner == 2:
            scores1.LosesChess = scores1['LosesChess'] + 1
            scores2.WinsChess = scores2['WinsChess'] + 1
        else:
            scores1.TiesChess = scores1.TiesChess + 1
            scores2.TiesChess = scores2.TiesChess + 1
    elif game_type=="Tic_tac_toe":
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


@app.route("/gamemaster/starttictactoe", methods=["POST"])
def starttictactoe():
    username = request.json['username']
    if Userscore.query.filter_by(username=username).first() is not None:
        if len(db.session.query(Queue).all()) >= 1:
            queue = db.session.query(Queue).first()
            data = {}
            data['gameid'] = queue.gameid
            db.session.delete(queue)
            db.session.commit()
            return jsonify(data)
        else:
            now = datetime.now()
            dt_string = now.strftime("%d/%m/%Y %H:%M:%S.%f")[:-3]
            gameid = "Tic_tac_toe"+"_"+dt_string
            data = {}
            data['gameid'] = gameid
            queue = Queue(
                gameid=gameid
            )
            db.session.add(queue)
            db.session.commit()
            return jsonify(data)
    else:
        return Response("error: name not found", status=401)


@app.route("/gamemaster/start_Chess", methods=["POST"])
def start_Chess():
    username = request.json['username']
    if Userscore.query.filter_by(username=username).first() is not None:
        if len(db.session.query(Queue_Chess).all()) >= 1:
            queue_Chess = db.session.query(Queue_Chess).first()
            data = {}
            data['gameid'] = queue_Chess.gameid
            # start_game = requests.post("http://playmaster:5001/playmaster/startGame",
            #                            json={"gameid": queue.gameid})
            # initgamestate = requests.post("http://playmaster:5001/playmaster/initstate",
            #   json={"gameid": queue.gameid, "game_owner": username})
            db.session.delete(queue_Chess)
            db.session.commit()
            return jsonify(data)
        else:
            now = datetime.now()
            dt_string = now.strftime("%d/%m/%Y %H:%M:%S.%f")[:-3]
            gameid = "Chess"+"_"+dt_string
            data = {}
            data['gameid'] = gameid
            # initgamestate = requests.post("http://playmaster:5001/playmaster/initstate",
            #                               json={"gameid": gameid, "game_owner": username})
            queue_Chess = Queue_Chess(
                gameid=gameid
            )
            db.session.add(queue_Chess)
            db.session.commit()
            return jsonify(data)
    else:
        return Response("error: name not found", status=401)


#@app.route("/gamemaster/starttictourn", methods=["GET"])
#def starttictourn():
#    username = request.json['username']
#    username = request.json['username']
#    if Userscore.query.filter_by(username=username).first() is not None:
#        queuetour = Queuetournament(
#            username=username,
#        )
#        db.session.add(queuetour)
#        db.session.commit()
#        if len(db.session.query(Queue).all()) >= 8:
#            for i in range(0, 4):
#                username2 = Queue.query.first()
#                db.session.delete(username2)
#                username = Queue.query.first()
#                db.session.delete(username)
#                now = datetime.now()
#                dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
#                data = {}
#                gameid = username.username+"_"+username2.username+"_"+dt_string
#                data['gameid'] = gameid
#                initgamestate = requests.post("http://playmaster:5001/playmaster/initstate", json={
#                                              "gameid": gameid, "player1": username.username, "player2": username2.username})
#                # json.dumps(data)
#                tournament = Tournament(
#                    player1=username.username,
#                    player2=username2.username,
#                    gameid=gameid
#                )
#                db.session.add(tournament)
#                db.session.commit()
#            return jsonify(data)
#        else:
#            return Response("waitting in queue", status=200)
#    else:
#        return Response("error: name not found", status=400)


if __name__ == "__main__":
    app.run(debug=False)
