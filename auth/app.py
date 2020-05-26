import os
import requests
import jwt
import datetime
import json

from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

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

app.config['SECRET_KEY'] = 'my_secret_key'

jwt_secret_key = "secret"

# Initialize Database
db = SQLAlchemy(app)

# Database User Model


class User(db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))
    user_role = db.Column(db.String(255))

    def json(self):
        return {"id": self.user_id, "username": self.username, "email": self.email, "password": self.password, "user_role": self.user_role}


# Create Database Table and Model
db.create_all()
db.session.commit()

# CreateUser API
@app.route("/auth/register", methods=["POST"])
def register():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    if username is None or email is None or password is None:
        error = 'username, email and password are required'
        return Response(error, status=400)
    if ' ' in username:
        error = 'Username should not contain spaces'
        return Response(error, status=400)
    else:
        user = db.session.query(User).filter_by(username=username).first()
        if user is not None:
            error = 'A User with the same username already exists'
            return Response(error, status=400)
        user = db.session.query(User).filter_by(email=email).first()
        if user is not None:
            error = 'A User with the same email already exists'
            return Response(error, status=400)
        user = User(
            username=username,
            email=email,
            password=generate_password_hash(password, method='sha256'),
            user_role="user"  # default role is user
        )
        db.session.add(user)
        db.session.commit()
        # needs work  error handling if add user didnt work
        initscoredb = requests.post(
            "http://gamemaster:5002/gamemaster/createUser", json={"username": username})
        token = encodeAuthToken(user.username, user.user_role)
        return token
        # REMEMBER TO REMOVE DECODE FROM HERE BEFORE PRODUCTION
        # dec = decodeAuthToken(token)
        # return Response("User created with token"+str(dec), status=200)


@app.route("/auth/login", methods=["POST"])
def login():
    username = request.json['username']
    password = request.json['password']
    user = db.session.query(User).filter_by(username=username).first()
    if user is None:
        error = 'A User with that username does not exist'
        return Response(error, status=400)
    check_password = check_password_hash(user.password, password)
    if not check_password:
        error = 'Password is incorrect'
        return Response(error, status=400)
    token = encodeAuthToken(user.username, user.user_role)
    return token
    # REMEMBER TO REMOVE DECODE FROM HERE BEFORE PRODUCTION
    # dec = decodeAuthToken(token)
    # return Response('User Authenticated with token ' + str(dec), status=200)


@app.route("/auth/check_token", methods=["POST"])
def check_token():
    token = request.json['token']
    dec = decodeAuthToken(token)
    if dec['username'] is None:
        error = "Validation Unsuccessfull"
        return Response(error, status=400)
    response = {
        'username': dec['username'],
        'user_role': dec['user_role'],
    }
    return jsonify(response)


@app.route("/auth/make_admin", methods=["POST"])
def make_admin():
    username = request.json['username']
    user = db.session.query(User).filter_by(username=username).first()
    if user is None:
        error = 'A User with that username does not exist'
        return Response(error, status=400)
    if user.user_role == "admin":
        error = 'This user is already an admin'
        return Response(error, status=400)
    user.user_role = "admin"
    db.session.commit()
    # Generate New Token
    token = encodeAuthToken(user.username, user.user_role)
    return token
    # REMEMBER TO REMOVE DECODE FROM HERE BEFORE PRODUCTION
    # dec = decodeAuthToken(token)
    # return Response('User promoted to admin. New token ' + str(dec), status=200)


@app.route("/auth/make_official", methods=["POST"])
def make_official():
    username = request.json['username']
    user = db.session.query(User).filter_by(username=username).first()
    if user is None:
        error = 'A User with that username does not exist'
        return Response(error, status=400)
    if user.user_role == "official":
        error = 'This user is already an official'
        return Response(error, status=400)

    user.user_role = "official"
    db.session.commit()
    # Generate New Token
    token = encodeAuthToken(user.username, user.user_role)
    return token
    # REMEMBER TO REMOVE DECODE FROM HERE BEFORE PRODUCTION
    # dec = decodeAuthToken(token)
    # return Response('User promoted to official. New token ' + str(dec), status=200)


# JWT TOKEN
def encodeAuthToken(username, user_role):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=60),
            'iat': datetime.datetime.utcnow(),
            'username': username,
            'user_role': user_role
        }
        token = jwt.encode(
            payload, jwt_secret_key, algorithm='HS256')
        return token
    except Exception as e:
        print(e)
        return e


def decodeAuthToken(token):
    try:
        payload = jwt.decode(
            token, jwt_secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Login please'
    except jwt.InvalidTokenError:
        return 'Nice try, invalid token. Login please'


if __name__ == "__main__":
    app.run(debug=False)
