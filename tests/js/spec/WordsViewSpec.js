describe("WordsView", function() {
    var test_words = ["these", "are,", "some", "words",
                      ".", "some", ".", "more!!!", "!!", "words",
                      ":", "how", "abou?t", "that", "?"]
    var test_words_with_chapters = ["these", "are,", "some", "words", ".",
    "Chapter", "4", "Subtitle", "of", "Thing", "some", ".", "more", "words",
    "words", "Chapter", "NotAllowed", "words", "wow", "we", "need", ".",
    "ChaPteR", "Coolio", ":", "A", "Subtitle", ",", "Cut", "Off", "At",
    "Ten", "Words", "I", "Promise", "words", "words"];

    beforeEach(function() {
        $('body').append('<div id="#story-content"></div>');
        this.wordsView = new WordsView({'model': new Words()});
    });

    it('is backed by a model instance, which provides the data.', function() {
        expect(this.wordsView.model).toBeDefined();
    });

    it("properly spaces punctuation in a list of words.", function() {
        var spacedWords = this.wordsView.formatText(test_words);
        expect(spacedWords).toBe(" these are, some words. some. more!!!!! words: how abou?t that?");
    });

    it("creates a list of chapter titles, subtitles, and text.", function() {
        this.wordsView.set('prev_words', test_words_with_chapters);

        var expectedList = [['text', ' these are some words.'], ['title', 'Chapter 4:'],
                            ['subtitle', 'Subtitle of Thing some.'], ['text', ' more words words Chapter NotAllowed' +
                             ' words wow we need.'],
                            ['title', 'ChaPteR Coolio:'], ['subtitle', 'A Subtitle, Cut Off At Ten Words I Promise'],
                            ['text', ' words words']];

        expect(this.wordsView.getContentList()).toBe(expectedList);
    });
});