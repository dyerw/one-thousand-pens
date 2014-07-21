# This is some copy-pasta from the internet
# because the threading module was throwing errors
from gevent import monkey
monkey.patch_all()

import json

from flask import Flask
from flask.ext.socketio import SocketIO

from vote_manager import VoteManager
from database import db
from database.chosen_words import ChosenWords

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


@app.route('/')
def index():
    """
    Serves up our client to the user.
    """
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
    word = message['word']
    vote_manager.queue.put(word)


if __name__ == '__main__':
    socket.run(app)
