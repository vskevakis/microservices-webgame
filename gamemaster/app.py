# from app import Userscore, Queue, Queuetournament, Tournament
import os
from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
from datetime import datetime
import json

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
    tour_t_wins = db.Column(db.Integer)
    tour_t_ties = db.Column(db.Integer)
    tour_t_loses = db.Column(db.Integer)
    tour_c_wins = db.Column(db.Integer)
    tour_c_ties = db.Column(db.Integer)
    tour_c_loses = db.Column(db.Integer)

    def json(self):
        return {"username": self.username, "t_wins": self.t_wins, "t_ties": self.t_ties, "t_loses": self.t_loses, "c_wins": self.c_wins, "c_ties": self.c_ties, "c_loses": self.c_loses, "tour_t_wins": self.tour_t_wins, "tour_t_ties": self.tour_t_ties, "tour_t_loses": self.tour_t_loses, "tour_c_wins": self.tour_c_wins, "tour_c_ties": self.tour_c_ties, "tour_c_loses": self.tour_c_loses}


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
    tour_id = db.Column(db.String(255), unique=True,
                        nullable=False, primary_key=True)
    current_players = db.Column(db.Integer)
    game_type = db.Column(db.String(255), nullable=False)
    player1 = db.Column(db.String(255),
                        nullable=False)
    player2 = db.Column(db.String(255),
                        nullable=False)
    player3 = db.Column(db.String(255),
                        nullable=False)
    player4 = db.Column(db.String(255),
                        nullable=False)
    player5 = db.Column(db.String(255),
                        nullable=False)
    player6 = db.Column(db.String(255),
                        nullable=False)
    player7 = db.Column(db.String(255),
                        nullable=False)
    player8 = db.Column(db.String(255),
                        nullable=False)
    # def json2(self):
    #     return {"username": self.username, "current_players":self.current_players ,"game_type":self.game_type}


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
    tour_id = db.Column(db.String(255))
    game_type = db.Column(db.String(255), nullable=False)
    game_number = db.Column(db.String(255), nullable=False)
    gameid = db.Column(db.String(255), primary_key=True)
    player1 = db.Column(db.String(255), nullable=False)
    player2 = db.Column(db.String(255), nullable=False)
    winner = db.Column(db.String(255))


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
        c_loses=0,
        tour_t_wins=0,
        tour_t_ties=0,
        tour_t_loses=0,
        tour_c_wins=0,
        tour_c_ties=0,
        tour_c_loses=0,
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
    # "Tic_tac_toe"  # request.json['game_type']
    game_type = request.json['game_type']
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
        if Queue_Chess.query.filter_by(username=username).first() is None:
            if len(db.session.query(Queue_Chess).all()) >= 1:
                queue_Chess = db.session.query(Queue_Chess).first()
                data = {}
                data['gameid'] = queue_Chess.gameid
                playing = Playing(
                    gameid=queue_Chess.gameid,
                    player1=queue_Chess.username,
                    player2=username
                )
                db.session.add(playing)
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
                    gameid=gameid,
                    username=username
                )
                db.session.add(queue_Chess)
                db.session.commit()
                return jsonify(data)
        else:
            queue_Chess = Queue_Chess.query.filter_by(
                username=username).first()
            data = {}
            data['gameid'] = queue_Chess.gameid
            return jsonify(data)
    else:
        return Response("error: name not found", status=401)


@app.route("/gamemaster/Tour_list", methods=["GET"])
def Tour_list():
    temps = Queuetournament.query.all()
    data = []
    counter = 0
    for temp in temps:
        counter = counter+1
        data.append({'tour_id': temp.tour_id,
                     'current_players': temp.current_players, 'game_type': temp.game_type})
    return jsonify(items=data)


@app.route("/gamemaster/Tour_get_game_id", methods=["POST"])
def Tour_get_game_id():
    username = request.json['username']
    tour_id = request.json['tour_id']
    data = {}
    if Tournament.query.filter(and_(Tournament.tour_id == tour_id, Tournament.player1 == username)).first() is not None:
        temp = Tournament.query.filter(
            and_(Tournament.tour_id == tour_id, Tournament.player1 == username)).first()
        data['gameid'] = temp.gameid
        return jsonify(data)
    if Tournament.query.filter(and_(Tournament.tour_id == tour_id, Tournament.player2 == username)).first() is not None:
        temp = Tournament.query.filter(
            and_(Tournament.tour_id == tour_id, Tournament.player2 == username)).first()
        data['gameid'] = temp.gameid
        return jsonify(data)
    return Response("error: Tour_get_game_id not found", status=401)


@app.route("/gamemaster/start_Tour", methods=["POST"])
def start_Tour():
    # username = request.json['username']
    role = request.json['user_role']
    game_type = request.json['game_type']
    if role == 'admin' or role == 'official':
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S.%f")[:-3]
        tourid = "Tournament"+game_type+"_"+dt_string
        # data = {}
        # data['gameid'] = tourid
        queuetournament = Queuetournament(
            tour_id=tourid,
            current_players=0,
            game_type=game_type,
            player1='not yet',
            player2='not yet',
            player3='not yet',
            player4='not yet',
            player5='not yet',
            player6='not yet',
            player7='not yet',
            player8='not yet'
        )
        db.session.add(queuetournament)
        db.session.commit()
        return Response("Tournament succesfully created", status=200)
    else:
        return Response("not qualified", status=550)


@app.route("/gamemaster/join_Tour", methods=["POST"])
def join_Tour():
    username = request.json['username']
    tour_id = request.json['tour_id']
    if Userscore.query.filter_by(username=username).first() is not None and Queuetournament.query.filter_by(tour_id=tour_id).first() is not None:
        queue = Queuetournament.query.filter_by(tour_id=tour_id).first()
        if queue.current_players == 7:
            # queue = Queuetournament.query.filter_by(tour_id=tour_id)
            now = datetime.now()
            dt_string = now.strftime("%d/%m/%Y %H:%M:%S.%f")[:-3]
            tournament = Tournament(
                tour_id=queue.tour_id,
                game_type=queue.game_type,
                game_number='game1',
                gameid="Tournament_"+'game1_'+queue.game_type+"_"+dt_string,
                player1=queue.player1,
                player2=queue.player2,
                winner='not yet'
            )
            tournament2 = Tournament(
                tour_id=queue.tour_id,
                game_type=queue.game_type,
                game_number='game2',
                gameid="Tournament_"+'game2_'+queue.game_type+"_"+dt_string,
                player1=queue.player3,
                player2=queue.player4,
                winner='not yet'
            )
            tournament3 = Tournament(
                tour_id=queue.tour_id,
                game_type=queue.game_type,
                game_number='game3',
                gameid="Tournament_"+'game3_'+queue.game_type+"_"+dt_string,
                player1=queue.player5,
                player2=queue.player6,
                winner='not yet'
            )
            tournament4 = Tournament(
                tour_id=queue.tour_id,
                game_type=queue.game_type,
                game_number='game4',
                gameid="Tournament_"+'game4_'+queue.game_type+"_"+dt_string,
                player1=queue.player7,
                player2=username,
                winner='not yet'
            )
            tournament5 = Tournament(
                tour_id=queue.tour_id,
                game_type=queue.game_type,
                game_number='game5',
                gameid="Tournament_"+'game5_'+queue.game_type+"_"+dt_string,
                player1='not yet',
                player2='not yet',
                winner='not yet'
            )
            tournament6 = Tournament(
                tour_id=queue.tour_id,
                game_type=queue.game_type,
                game_number='game6',
                gameid="Tournament_"+'game6_'+queue.game_type+"_"+dt_string,
                player1='not yet',
                player2='not yet',
                winner='not yet'
            )
            tournament7 = Tournament(
                tour_id=queue.tour_id,
                game_type=queue.game_type,
                game_number='game7',
                gameid="Tournament_"+'game7_'+queue.game_type+"_"+dt_string,
                player1='not yet',
                player2='not yet',
                winner='not yet'
            )
            db.session.delete(queue)
            db.session.add(tournament)
            db.session.add(tournament2)
            db.session.add(tournament3)
            db.session.add(tournament4)
            db.session.add(tournament5)
            db.session.add(tournament6)
            db.session.add(tournament7)
            db.session.commit()
            return Response("Successful join_Tour and Queuetournament deleted", status=200)
        else:
            # queue = Queuetournament.query.filter_by(tour_id=tour_id)
            if queue.player1 == username or queue.player2 == username or queue.player3 == username or queue.player4 == username or queue.player5 == username or queue.player6 == username or queue.player7 == username:
                return Response("user already in tournament", status=210)
            if queue.player1 == 'not yet':
                queue.player1 = username
            elif queue.player2 == 'not yet':
                queue.player2 = username
            elif queue.player3 == 'not yet':
                queue.player3 = username
            elif queue.player4 == 'not yet':
                queue.player4 = username
            elif queue.player5 == 'not yet':
                queue.player5 = username
            elif queue.player6 == 'not yet':
                queue.player6 = username
            elif queue.player7 == 'not yet':
                queue.player7 = username
            queue.current_players = queue.current_players + 1
            db.session.commit()
            return Response("Successful join_Tour", status=200)
    else:
        return Response("error join_Tour", status=450)


@app.route("/gamemaster/update_tournament", methods=["POST"])
def update_tournament():
    username = request.json['player1']
    username2 = request.json['player2']
    gameid = request.json['game_id']
    winner = request.json['winner']
    # "Tic_tac_toe"  # request.json['game_type']
    game_type = request.json['game_type']
    scores1 = Userscore.query.filter_by(username=username).first()
    scores2 = Userscore.query.filter_by(username=username2).first()
    if game_type == "Chess":
        if winner == "1":
            scores1.tour_c_wins = scores1.tour_c_wins + 1
            scores2.tour_c_loses = scores2.tour_c_loses + 1
        elif winner == "2":
            scores1.tour_c_loses = scores1.tour_c_loses + 1
            scores2.tour_c_wins = scores2.tour_c_wins + 1
        else:
            scores1.tour_c_ties = scores1.tour_c_ties + 1
            scores2.tour_c_ties = scores2.tour_c_ties + 1
    elif game_type == "Tic_tac_toe":
        if winner == "1":
            scores1.tour_t_wins = scores1.tour_t_wins + 1
            scores2.tour_t_loses = scores2.tour_t_loses + 1
        elif winner == "2":
            scores1.tour_t_loses = scores1.tour_t_loses + 1
            scores2.tour_t_wins = scores2.tour_t_wins + 1
        else:
            scores1.tour_t_ties = scores1.tour_t_ties + 1
            scores2.tour_t_ties = scores2.tour_t_ties + 1
    if Playing.query.filter_by(player1=username).first() is not None:
        playing = Playing.query.filter_by(player1=username).first()
    else:
        playing = Playing.query.filter_by(player2=username).first()
    data = {}
    if Tournament.query.filter_by(gameid=gameid).first() is not None:
        temp = Tournament.query.filter_by(gameid=gameid).first()
        if temp.game_number == 'game1':
            # tour_id==temp.tour_id game_number=='game5'
            temp2 = Tournament.query.filter(and_(
                Tournament.tour_id == temp.tour_id, Tournament.game_number == 'game5')).first()
            data['gameid'] = temp2.gameid
        elif temp.game_number == 'game2':
            temp2 = Tournament.query.filter(and_(
                Tournament.tour_id == temp.tour_id, Tournament.game_number == 'game5')).first()
            data['gameid'] = temp2.gameid
        elif temp.game_number == 'game3':
            temp2 = Tournament.query.filter(and_(
                Tournament.tour_id == temp.tour_id, Tournament.game_number == 'game6')).first()
            data['gameid'] = temp2.gameid
        elif temp.game_number == 'game4':
            temp2 = Tournament.query.filter(and_(
                Tournament.tour_id == temp.tour_id, Tournament.game_number == 'game6')).first()
            data['gameid'] = temp2.gameid
        elif temp.game_number == 'game5':
            temp2 = Tournament.query.filter(and_(
                Tournament.tour_id == temp.tour_id, Tournament.game_number == 'game7')).first()
            data['gameid'] = temp2.gameid
        elif temp.game_number == 'game6':
            temp2 = Tournament.query.filter(and_(
                Tournament.tour_id == temp.tour_id, Tournament.game_number == 'game7')).first()
            data['gameid'] = temp2.gameid
        else:
            data['gameid'] = 'over'
    db.session.delete(playing)
    db.session.add(scores1)
    db.session.add(scores2)
    db.session.commit()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=False)
