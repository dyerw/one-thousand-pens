import Queue
import time
import thread
import json

from flask.ext.socketio import emit

class VoteManager(object):
    """
    A class that manages storing votes. Handles all
    concurrent read/write issues internally.
    """

    def __init__(self, socket):
        self.POLL_UPDATE_FREQ = 2
        self.NEXT_WORD_FREQ = 15
        self.socket = socket
        self.queue = Queue.Queue()
        self._votes = {}

        # Start threads to continually update
        # the internal vote state and update
        # all listening clients with the vote
        # state
        thread.start_new_thread(self.update_votes)
        thread.start_new_thread(self.broadcast_poll)
        thread.start_new_thread(self.broadcast_next_word)

    def get_votes(self):
        return self._votes

    def update_votes(self):
        """
        Attempts to retrieve available votes from the queue.
        If there is an available vote, either increment that 
        words vote counter or add it to the dict with a count 
        of one.
        """
        while True:
            word = self.queue.get(True)
            
            if word in self._votes:
                self._votes[word] += 1
            else:
                self._votes[word] = 1

    def broadcast_poll(self):
        """
        Sends out the top ten (or less) words currently being voted for and
        their vote counts to all clients every few seconds.
        """
        while True:
            time.sleep(self.POLL_UPDATE_FREQ)
            votes = self._votes

            # Only get ten votes if there's more than ten, 
            # otherwise get all of them
            if len(votes) > 10:
                i = 10
            else:
                i = len(votes)

            top_ten = dict([v for v in sorted(votes.items(), key=lambda vote: 0 - vote[1])][:i])

            self.socket.emit('updatepoll', {'votes': top_ten})

    def broadcast_next_word(self):
        """
        Every minute sends out what the next word was, clears the the votes,
        and stores the chosen word in the database.
        """
        while True:
            time.sleep(self.NEXT_WORD_FREQ)
            votes = self._votes

            if len(votes) > 0:
                chosen_word = sorted(votes.items(), key=lambda vote: 0 - vote[1])[0][0]
                self._votes = {}

                print chosen_word
                self.socket.emit('nextword', {'word': chosen_word})
