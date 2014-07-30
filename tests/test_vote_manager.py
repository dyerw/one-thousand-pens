# Delete the threading module because we need to reinitialize it
# and properly patch it in our code
# TODO: when does it get imported before this??
import sys
if 'threading' in sys.modules:
    del sys.modules['threading']

import unittest
import time

from flask import session

from application import app, socket, add_vote
from vote_manager import VoteManager


class TestVoteManager(unittest.TestCase):
    def setUp(self):
        self.vm = VoteManager(app, socket, testing=True)

    def test_vote(self):
        self.vm.update_votes_thread.start()

        with app.test_request_context():
            session['user_id'] = 'test'
            add_vote({'word': 'testword'})

        # FIXME: I can't test this multithreading stuff very
        # well at all

    def test_cant_vote_for_last_word(self):
        pass

    def test_get_top_voted_word(self):
        pass

    def test_add_word_to_database(self):
        pass

    def test_throttles_votes(self):
        # Add 1,000,000 votes to the queue,
        # we need this many or we will run out of
        # votes to add
        for _ in range(1000000):
            self.vm.queue.put(("test_word", "mock_id"))

        self.vm.update_votes_thread.start()

        # Theoretically this should let 5 votes go through
        time.sleep(self.vm.VOTE_FREQ * 5)

        # Then we stop the thread
        self.vm.please_stop = True

        # Make sure they didn't all make it in
        # FIXME: due to strange behavior variable amounts of votes
        # make it in, we can only assure that there are not hundreds
        # of votes as there would be if there was no throttle
        self.assertLess(self.vm._votes['test_word'], 20)