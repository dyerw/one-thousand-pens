import Queue
import time
import threading

from database.chosen_words import ChosenWords
from database import db


class VoteManager(object):
    """
    A class that manages storing votes. Handles all
    concurrent read/write issues internally. Also runs
    worker threads to continually send out updates to
    all clients.
    """

    def __init__(self, app, socket, testing=False):
        self.POLL_UPDATE_FREQ = 2
        self.NEXT_WORD_FREQ = 15
        self.VOTE_FREQ = 0.5  # seconds
        self.socket = socket
        self.queue = Queue.Queue()
        self.app = app
        self._user_vote_times = {}
        self._votes = {}

        # This is a flag that if turned true will end all
        # threads after their next loop
        self.please_stop = False

        # Start threads to continually update
        # the internal vote state and update
        # all listening clients with the vote
        # state
        self.update_votes_thread = threading.Thread(target=self.update_votes)
        self.broadcast_poll_thread = threading.Thread(target=self.broadcast_poll)
        self.broadcast_next_word_thread = threading.Thread(target=self.broadcast_next_word)

        # If we are testing the test suite will manually
        # start and end these threads as needed, so we do
        # not want to start them
        if not testing:
            self.update_votes_thread.start()
            self.broadcast_poll_thread.start()
            self.broadcast_next_word_thread.start()

    def get_votes(self):
        return self._votes

    def update_votes(self):
        """
        Attempts to retrieve available votes from the queue.
        If there is an available vote, either increment that 
        words vote counter or add it to the dict with a count 
        of one.
        """
        while not self.please_stop:
            word, user_id = self.queue.get(True)

            # See if the user has voted before
            if user_id in self._user_vote_times:
                # Make sure they haven't voted since the last time specified by vote frequency
                if time.time() - self._user_vote_times[user_id] < self.VOTE_FREQ:
                    # Skip this vote, the user is being throttled
                    continue

            # Update the user's last voted time
            self._user_vote_times[user_id] = time.time()

            # Add their vote
            if word in self._votes:
                self._votes[word] += 1
            else:
                self._votes[word] = 1

    def broadcast_poll(self):
        """
        Sends out the top ten (or less) words currently being voted for and
        their vote counts to all clients every few seconds.
        """
        while not self.please_stop:
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

    def get_top_voted_word(self):
        """
        Gets the currently top voted word and how many votes it has and returns
        both as a tuple
        """
        # The votes are sorted by number of votes, the first index is the top voted word
        return sorted(self._votes.items(), key=lambda vote: 0 - vote[1])[0]

    def add_word_to_database(self, word, votes):
        """
        Given a word and how many votes it got, will add it to the database with
        the current time.
        """
        new_word = ChosenWords(word, time.strftime('%Y-%m-%d %H:%M:%S'), votes)

        with self.app.app_context():
            db.session.add(new_word)
            db.session.commit()

    def broadcast_next_word(self):
        """
        Every minute sends out what the next word was, clears the the votes,
        and stores the chosen word in the database.
        """
        while not self.please_stop:
            time.sleep(self.NEXT_WORD_FREQ)

            # We need at least one vote to choose a word
            if len(self._votes) > 0:
                chosen_word, chosen_votes = self.get_top_voted_word()

                self._votes = {}

                # Add the voted for word to the database so it can be served up later
                self.add_word_to_database(chosen_word, chosen_votes)

                # Broadcast the word to all listening clients
                self.socket.emit('nextword', {'word': chosen_word})
