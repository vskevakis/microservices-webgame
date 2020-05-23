# from app import Userscore, Queue, Queuetournament, Tournament
import os
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
    t_wins = db.Column(db.Integer)
    t_ties = db.Column(db.Integer)
    t_loses = db.Column(db.Integer)
    c_wins = db.Column(db.Integer)
    c_ties = db.Column(db.Integer)
    c_loses = db.Column(db.Integer)

    def json(self):
        return {"username": self.username, "t_wins": self.t_wins, "t_ties": self.t_ties, "t_loses": self.t_loses, "c_wins": self.c_wins, "c_ties": self.c_ties, "c_loses": self.c_loses}


class Queue(db.Model):
    __tablename__ = "queue"
    gameid = db.Column(db.String(255), unique=True,
                       nullable=False, primary_key=True)
    username = db.Column(db.String(255), unique=True,
                         nullable=False)


class Queue_Chess(db.Model):
    __tablename__ = "queue_Chess"
    gameid = db.Column(db.String(255), unique=True,
                       nullable=False, primary_key=True)
    username = db.Column(db.String(255), unique=True,
                         nullable=False, primary_key=True)


class Queuetournament(db.Model):
    __tablename__ = "queuetournament"
    gameid = db.Column(db.String(255), unique=True,
                       nullable=False, primary_key=True)
    username = db.Column(db.String(255), unique=True,
                         nullable=False, primary_key=True)


class Playing(db.Model):
    __tablename__ = "playing"
    gameid = db.Column(db.String(255), unique=True,
                       nullable=False, primary_key=True)
    player1 = db.Column(db.String(255), unique=True,
                        nullable=False)
    player2 = db.Column(db.String(255), unique=True,
                        nullable=False)


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
        t_wins=0,
        t_ties=0,
        t_loses=0,
        c_wins=0,
        c_ties=0,
        c_loses=0
    )
    db.session.add(userscore)
    db.session.commit()

    return Response("Userdb created with great success" + username, status=200)


@app.route("/gamemaster/getscores", methods=["POST"])
def getscores():
    username = request.json['username']
    # data = request.get_json()
    # username = data.get('username')
    scores = Userscore.query.filter_by(username=username).first()
    return scores.json()


# winner is : 1) for player1 win,2) for player2 win,else tie
@app.route("/gamemaster/updatescores", methods=["POST"])
def updatescores():
    username = request.json['player1']
    username2 = request.json['player2']
    winner = request.json['winner']
    game_type = "Tic_tac_toe"  # request.json['game_type']
    scores1 = Userscore.query.filter_by(username=username).first()
    scores2 = Userscore.query.filter_by(username=username2).first()
    if game_type == "Chess":
        if winner == "1":
            scores1.c_wins = scores1.c_wins + 1
            scores2.c_loses = scores2.c_loses + 1
        elif winner == "2":
            scores1.c_loses = scores1.c_loses + 1
            scores2.c_wins = scores2.c_wins + 1
        else:
            scores1.c_ties = scores1.c_ties + 1
            scores2.c_ties = scores2.c_ties + 1
    elif game_type == "Tic_tac_toe":
        if winner == "1":
            scores1.t_wins = scores1.t_wins + 1
            scores2.t_loses = scores2.t_loses + 1
        elif winner == "2":
            scores1.t_loses = scores1.t_loses + 1
            scores2.t_wins = scores2.t_wins + 1
        else:
            scores1.t_ties = scores1.t_ties + 1
            scores2.t_ties = scores2.t_ties + 1
    if Playing.query.filter_by(player1=username).first() is not None:
        playing = Playing.query.filter_by(player1=username).first()
    else:
        playing = Playing.query.filter_by(player2=username).first()
    db.session.delete(playing)
    db.session.add(scores1)
    db.session.add(scores2)
    db.session.commit()
    return Response("Userscoredb updated with great success", status=200)


@app.route("/gamemaster/starttictactoe", methods=["POST"])
def starttictactoe():
    username = request.json['username']
    if Userscore.query.filter_by(username=username).first() is not None:
        if Playing.query.filter_by(player1=username).first() is not None:
            playing = db.session.query(Playing).filter_by(
                player1=username).first()
            data = {}
            data['gameid'] = playing.gameid
            return jsonify(data)
        if Playing.query.filter_by(player2=username).first() is not None:
            playing = db.session.query(Playing).filter_by(
                player2=username).first()
            data = {}
            data['gameid'] = playing.gameid
            return jsonify(data)
        if Queue.query.filter_by(username=username).first() is None:
            if len(db.session.query(Queue).all()) >= 1:
                queue = db.session.query(Queue).first()
                data = {}
                data['gameid'] = queue.gameid
                playing = Playing(
                    gameid=queue.gameid,
                    player1=queue.username,
                    player2=username
                )
                db.session.add(playing)
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
                    gameid=gameid,
                    username=username
                )
                db.session.add(queue)
                db.session.commit()
                return jsonify(data)
        else:
            queue = Queue.query.filter_by(username=username).first()
            data = {}
            data['gameid'] = queue.gameid
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

            db.session.delete(queue_Chess)
            db.session.commit()
            return jsonify(data)
        else:
            now = datetime.now()
            dt_string = now.strftime("%d/%m/%Y %H:%M:%S.%f")[:-3]
            gameid = "Chess"+"_"+dt_string
            data = {}
            data['gameid'] = gameid
            queue_Chess = Queue_Chess(
                gameid=gameid
            )
            db.session.add(queue_Chess)
            db.session.commit()
            return jsonify(data)
    else:
        return Response("error: name not found", status=401)


if __name__ == "__main__":
    app.run(debug=False)