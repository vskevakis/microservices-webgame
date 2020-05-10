import os
import requests
from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

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
class User(db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))

    def json(self):
        return {"id":self.user_id, "username":self.username, "email":self.email, "password":self.password}

#Create Database Table and Model
db.create_all()
db.session.commit()

#CreateUser API
@app.route("/auth/register", methods = ["POST"])
def register():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    
    if username is None or email is None or password is None:
        error = 'username, email and password are required'
        return Response(error, status = 400)
    if ' ' in username:
        error = 'Username should not contain spaces'
        return Response(error, status = 400)
    else: 
        user = db.session.query(User).filter_by(username=username).first()
        if user is not None:
            error = 'A User with the same username already exists'
            return Response(error, status = 400)
        user = db.session.query(User).filter_by(email=email).first()
        if user is not None:
            error = 'A User with the same email already exists'
            return Response(error, status = 400)
        user = User(
            username = username,
            email = email,
            password = generate_password_hash(password, method='sha256')
        )
        db.session.add(user)
        db.session.commit()
        #test = requests.post("http://localhost:5003/initdb", json={"username": username})
        return Response("User created with great success", status = 200)

@app.route("/auth/login", methods = ["GET"])
def login():
    username = request.json['username']
    password = request.json['password']
    user = db.session.query(User).filter_by(username=username).first()
    if user is None:
        error = 'A User with that username does not exist'
        return Response(error, status = 400)
    check_password = check_password_hash(user.password, password)
    if not check_password:
        error = 'Password is incorrect'
        return Response(error, status = 400)
    return Response('User Authenticated with GREAT SUCCESS', status = 200)


if __name__ == "__main__":
    app.run(debug=False)
