describe("WordsView", function() {
    var test_words = ["these", "are,", "some", "words",
                      ".", "some", ".", "more!!!", "!!", "words",
                      ":", "how", "abou?t", "that", "?"]
    var test_words_with_chapters = ["these", "are,", "some", "words", ".",
    "Chapter", "4", "Subtitle", "of", "Thing", "some", ".", "more", "words"];

    beforeEach(function() {
        $('body').append('<div id="#story-content"></div>');
        this.wordsView = new WordsView({'model': new Words()});
    });

    it('is backed by a model instance, which provides the data.', function() {
        expect(this.wordsView.model).toBeDefined();
    });

    it("properly spaces punctuation in a list of words.", function() {
        var spaced_words = this.wordsView.format_text(test_words);
        expect(spaced_words).toBe(" these are, some words. some. more!!!!! words: how abou?t that?");
    });
});