describe("PollModel", function() {
    var poll;
    var one_vote = {'word': 1};
    var multiple_votes = {'word1': 4, 'word2': 1, 'word3': 3, 'word4': 6};

    beforeEach(function() {
        poll = new Poll();
    });

    it("properly sets default values.", function() {
        expect(poll.get('votes')).toEqual({});
        expect(poll.get('secs_left')).toBe(0);
        expect(poll.get('max_seconds')).toBe(15);
        expect(poll.get('has_voted')).toBe(false);
    });

    it("sorts the votes correctly.", function() {
        poll.set('votes', {});
        expect(poll.getSortedVotes()).toEqual([]);

        poll.set('votes', one_vote);
        expect(poll.getSortedVotes()).toEqual([['word', 1]]);

        poll.set('votes', multiple_votes);
        expect(poll.getSortedVotes()).toEqual([['word4', 6], ['word1', 4],
                                               ['word3', 3], ['word2', 1]]);
    });

    it("gets top vote number correctly.", function() {
        poll.set('votes', {});
        expect(poll.getTopVote()).toBe(0);

        poll.set('votes', one_vote);
        expect(poll.getTopVote()).toBe(1);

        poll.set('votes', multiple_votes);
        expect(poll.getTopVote()).toBe(6);
    });
});