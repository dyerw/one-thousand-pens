import db


class ChosenWords(db.Model):
    """
    A database table that holds all words chosen so far, the time they
    were chosen, and how many votes they got.
    """
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String)
    time_chosen = db.Column(db.String)
    num_votes = db.Column(db.Integer)

    def __init__(self, word, time_chosen, num_votes):
        self.word = word
        self.time_chosen = time_chosen
        self.num_votes = num_votes