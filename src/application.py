from flask import Flask
from flask.ext.socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'PolarBearSunset'
socketio = SocketIO(app)

# Votes is a global var that keeps track of all the words
# and their current votes
votes = {}


@app.route('/')
def index():
    """
    Serves up our client to the user
    """
    return app.send_static_file('index.html')


@socketio.on('vote')
def add_vote(message):
    """
    When a vote event is emitted by the client we want to add
    that vote to the votes dict; incrementing the votes if
    the word already exists or creating a new key if it does
    not.
    """
    word = message['word']

    if word in votes:
        votes[word] += 1
    else:
        votes[word] = 1


def get_top_ten_words():
    pass