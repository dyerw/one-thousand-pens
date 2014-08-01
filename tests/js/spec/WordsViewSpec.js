describe("WordsView", function() {
    var test_words = ["these", "are,", "some", "words",
                      ".", "some", ".", "more!!!", "!!", "words",
                      ":", "how", "abou?t", "that", "?"];

    var test_words_with_chapters = ["these", "are,", "some", "words", ".",
    "Chapter", "4", "Subtitle", "of", "Thing", "some", ".", "more", "words",
    "words", "Chapter", "NotAllowed", "words", "wow", "we", "need", ".",
    "ChaPteR", "Coolio", ":", "A", "Subtitle", "Will", "Cut", "Off", "At",
    "Ten", "Words", "I", "Promise", "words", "words"];

    var test_words_end_in_subtitle = ["these", "are,", "some", "words", ".",
    "Chapter", "4", "Subtitle", "of", "Thing", "some", ".", "more", "words",
    "words", "Chapter", "NotAllowed", "words", "wow", "we", "need", ".",
    "ChaPteR", "Coolio", ":", "A", "Subtitle", "Will"];

    var test_words_end_in_title = ["these", "are,", "some", "words", ".",
    "Chapter"];

    beforeEach(function() {
        $('body').append('<div id="#story-content"></div>');
        this.wordsView = new WordsView({'model': new Words()});
    });

    it('is backed by a model instance, which provides the data.', function() {
        expect(this.wordsView.model).toBeDefined();
    });

    it("properly identifies punctuation.", function() {
        expect(this.wordsView.isPunctuation('.')).toBe(true);
        expect(this.wordsView.isPunctuation('!')).toBe(true);
        expect(this.wordsView.isPunctuation('?')).toBe(true);
        expect(this.wordsView.isPunctuation(',')).toBe(true);
        expect(this.wordsView.isPunctuation('w')).toBe(false);
        expect(this.wordsView.isPunctuation('word')).toBe(false);
        expect(this.wordsView.isPunctuation('..')).toBe(true);
        expect(this.wordsView.isPunctuation('!?')).toBe(true);
        expect(this.wordsView.isPunctuation(':')).toBe(true);
        expect(this.wordsView.isPunctuation('"')).toBe(true);
        expect(this.wordsView.isPunctuation('\'')).toBe(true);
        expect(this.wordsView.isPunctuation('word?')).toBe(false);
        expect(this.wordsView.isPunctuation('!word')).toBe(false);
        expect(this.wordsView.isPunctuation('!!word!!')).toBe(false);
        expect(this.wordsView.isPunctuation('')).toBe(false);
    });

    it("properly spaces punctuation in a list of words.", function() {
        expect(this.wordsView.formatText([])).toBe("");

        var spacedWords = this.wordsView.formatText(test_words);
        expect(spacedWords).toBe("these are, some words. some. more!!!!! words: how abou?t that?");
    });

    it("creates a list of chapter titles, subtitles, and text when it ends in a text block.", function() {
        this.wordsView.model.set('prev_words', test_words_with_chapters);

        var expectedList = [['text', 'these are, some words.'], ['title', 'Chapter 4:'],
                            ['subtitle', 'Subtitle of Thing some.'], ['text', 'more words words Chapter NotAllowed' +
                             ' words wow we need.'],
                            ['title', 'ChaPteR Coolio:'], ['subtitle', 'A Subtitle Will Cut Off At Ten Words I Promise'],
                            ['text', 'words words']];

        var contentList = this.wordsView.getContentList();

        expect(contentList.length).toBe(expectedList.length);

        for (var i = 0; i < contentList.length; i++) {
            expect(contentList[i]).toEqual(expectedList[i]);
        }
    });

    it("creates a list of chapter titles, subtitles, and text when it ends in a subtitle block.", function() {
        // Test text that cuts off in the subtitle
        this.wordsView.model.set('prev_words', test_words_end_in_subtitle);

        var expectedInSubtitleList = [['text', 'these are, some words.'], ['title', 'Chapter 4:'],
                            ['subtitle', 'Subtitle of Thing some.'], ['text', 'more words words Chapter NotAllowed' +
                             ' words wow we need.'],
                            ['title', 'ChaPteR Coolio:'], ['subtitle', 'A Subtitle Will']];

        var contentList = this.wordsView.getContentList();

        expect(contentList.length).toBe(expectedInSubtitleList.length);

        for (var i = 0; i < contentList.length; i++) {
            expect(contentList[i]).toEqual(expectedInSubtitleList[i]);
        }
    });

    it("creates a list of chapter titles, subtitles, and text when it ends in a title block.", function() {
        // Test text that cuts off in the subtitle
        this.wordsView.model.set('prev_words', test_words_end_in_title);

        var expectedInSubtitleList = [['text', 'these are, some words.'], ['title', 'Chapter']];

        var contentList = this.wordsView.getContentList();

        expect(contentList.length).toBe(expectedInSubtitleList.length);
        console.log(contentList);
        console.log(expectedInSubtitleList);

        for (var i = 0; i < contentList.length; i++) {
            expect(contentList[i]).toEqual(expectedInSubtitleList[i]);
        }
    });
});