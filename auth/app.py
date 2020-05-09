import os
from flask import Flask, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}'.format(
    user=os.environ['POSTGRES_USER'],
    password=os.environ['POSTGRES_PASSWORD'],
    host=os.environ['POSTGRES_HOST'],
    port=os.environ['POSTGRES_PORT'],
    db=os.environ['POSTGRES_DB'])

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

    def json(self):
        return {"id":self.user_id, "username":self.username, "email":self.email, "password":self.password}

    def __repr__(self):
        return '<User {}>'.format(self.username)

db.create_all()
db.session.commit()

@app.route("/auth/adduser", methods = ["POST"])
def adduser():
    user = User(username="Kostas", email="email")
    user.set_password("password")
    db.session.add(user)
    db.session.commit()
    return Response("THIS IS A TEXT", status=200)

@app.route("/auth/getuser", methods = ["GET"])
def getuser():
    # user = User.query.filter_by(username="Kostas").first()
    user = db.session.query(User).filter_by(username="Kostas").first()
    return jsonify(user.json())


if __name__ == "__main__":
    app.run(debug=False)

    