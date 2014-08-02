# This is some copy-pasta from the internet
# because the threading module was throwing errors
from gevent import monkey
monkey.patch_all()

import json
import uuid
import time

from flask import Flask, session
from flask.ext.socketio import SocketIO

from vote_manager import VoteManager
from database import db
from database.chosen_words import ChosenWords
from database.user_connections import UserConnections

app = Flask(__name__)
app.config['SECRET_KEY'] = 'PolarBearSunset'

# Init the database
# TMP db is fine for now
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db.init_app(app)
with app.app_context():
    db.create_all()

# Init the socket and the vote manager class
socket = SocketIO(app)
vote_manager = VoteManager(app, socket)


def log_connect(user_id):
    connection = UserConnections('connect', time.time(), user_id)
    db.session.add(connection)
    db.session.commit()


@app.route('/')
def index():
    """
    Serves up our client to the user.
    """
    # Give the user a session cookie so their vote
    # rate can be monitored
    session['user_id'] = str(uuid.uuid4())
    log_connect(session['user_id'])
    return app.send_static_file('index.html')


@app.route('/words')
def words():
    """
    Serves a JSON list of all the words used so far
    """
    chosen_words = ChosenWords.query.all()
    chosen_words = [chosen_word.word for chosen_word in chosen_words]
    return json.dumps(chosen_words)

@socket.on('vote')
def add_vote(message):
    """
    When a vote event is emitted by the client we want to add
    that vote to our vote managers queue for it to handle.
    """
    # Users can only vote with a cookie so they can be throttled,
    # a 'word' cannot have spaces and must be less than 15 chars
    if 'user_id' in session \
            and not " " in message['word'] \
            and message['word'] != vote_manager.last_word \
            and len(message['word']) <= 15:
        word = message['word']
        vote_manager.queue.put((word, session['user_id']))


@socket.on('disconnect')
def log_disconnect():
    connection = UserConnections('disconnect', time.time(), session['user_id'])
    db.session.add(connection)
    db.session.commit()
    db.session.commit()

if __name__ == '__main__':
    socket.run(app, host='0.0.0.0', port=80)
