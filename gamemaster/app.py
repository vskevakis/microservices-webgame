import os
import requests
from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy


#Initialize Application 
app = Flask(__name__)

#Configuration of postgreSQL Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}'.format(
    user=os.environ['POSTGRES_USER'],
    password=os.environ['POSTGRES_PASSWORD'],
    host=os.environ['POSTGRES_HOST'],
    port=os.environ['POSTGRES_PORT'],
    db=os.environ['POSTGRES_DB'])

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#Initialize Database
db = SQLAlchemy(app)

#Database User Model
class Userscore(db.Model):
    __tablename__ = "userscore"
    #user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False, primary_key=True)
    Wins = db.Column(db.Integer)
    Ties = db.Column(db.Integer)
    Loses = db.Column(db.Integer)

    def json(self):
        return {"username":self.username, "Wins":self.Wins, "Ties":self.Ties , "Loses":self.Loses}

#Create Database Table and Model
db.create_all()
db.session.commit()

#CreateUser API
@app.route("/gamemaster/initdb", methods = ["POST"])
def initdb():
    username = request.json['username']

    userscore = Userscore(
        username = username,
        Wins = 0,
        Ties = 0,
        Loses = 0
    )
    db.session.add(userscore)
    db.session.commit()

    return Response("Userdb created with great success"+username , status = 200)

@app.route("/gamemaster/getscores", methods = ["GET"])
def getscores():
    username = request.json['username']
    #Userscore.query.all()
    #scores = Userscore.query.filter_by(username=username).first()
    scores = db.session.query(Userscore).filter_by(username=username).first()

    return jsonify(scores.json())

if __name__ == "__main__":
    app.run(debug=False)
