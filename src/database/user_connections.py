from database import db


class UserConnections(db.Model):
    """
    A database table that logs all user connections and
    disconnections to keep track of concurrent users
    for analysis
    """
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String)
    time = db.Column(db.Float)
    user_id = db.Column(db.String)

    def __init__(self, type, time, user_id):
        self.type = type
        self.time = time
        self.user_id = user_id