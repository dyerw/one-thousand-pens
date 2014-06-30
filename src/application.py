import thread
import time
import Queue
# This is some copy-pasta from the internet
# because the threading module was throwing errors
from gevent import monkey
monkey.patch_all()

from flask import Flask
from flask.ext.socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'PolarBearSunset'
socketio = SocketIO(app)

# Votes is a global var that keeps track of all the words
# and their current votes
vote_queue = Queue.Queue()
votes = {}

def update_votes():
    """
    
    """
    while True:
        word = vote_queue.get(True)
        print word
        if word in votes:
            votes[word] += 1
        else:
            votes[word] = 1

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

    vote_queue.put(word)

def get_top_ten_words():
    pass

if __name__ == '__main__':
    thread.start_new_thread(update_votes)
    socketio.run(app)
