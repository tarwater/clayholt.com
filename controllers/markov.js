const natural = require("natural");
const NGrams = natural.NGrams;
const _ = require("underscore");
const fs = require('fs');

module.exports.generate = function (req, res, next) {
    var speaker = req.query.speaker;
    var length = req.query.length;
    var seed = req.query.seed.trim();

    if(seed.split(" ").length !== 2){
        seed = "We are";
    }

    if(length > 200)
        length = 200;
    else if (!length)
        length = 50;

    var text = generate(speaker, seed, length);

    return res.send(text);
};

function generate(speaker, seed, length){

    var file;

    if(speaker === "shakespeare")
        file = 'storage/corpora/shakespeare-ngrams.txt';
    else
        file = 'storage/corpora/trump-ngrams.txt';

    var data = fs.readFileSync(file);
    data = JSON.parse(data);


    var markov = new Markov(data.bigramCounts, data.trigramCounts);
    var result = [seed];
    var nextWord;

    seed = seed.split(" "); // two word phrase for a seed plz validate
    var w1 = seed[0];
    var w2 = seed[1];

    var endedWithPeriod = false;

    while (length > 0 || !endedWithPeriod) { // build the chain of words
        nextWord = markov.nextWord(w1, w2);
        result.push(nextWord);
        w1 = w2;
        w2 = nextWord;
        length--;
        endedWithPeriod = (w2.charAt(nextWord.length - 1) === "."); // we want to end with a word that has a period at the end.
    }

    return result.join(" ");
}

function Markov(bigrams, trigrams) {  // Class to hold conditional frequency distributions, one for bigrams, one for trigrams

    this.bigramCounts = bigrams;
    this.trigramCounts = trigrams;
}

Markov.prototype.nextWord = function (w1, w2) {
    var rand;

    if (this.trigramCounts.hasOwnProperty([w1, w2])) {  // can we use a trigram?

        var sum = Object.values(this.trigramCounts[[w1, w2]]).reduce(function (n1, n2) { // get all 3rd words and their counts. sum them.
            return n1 + n2;
        });
        rand = _.random(0, sum); // rand between 0 and the sum of all counts.
        // what we're doing is picking a random 3rd word for this trigram according to the conditional probabilities associated with it
        // for example: "to the x", store: 4, house: 2, graveyard: 2 .... we want a 50% chance of drawing 'store', 25% chance of 'house' or 'graveyard'
        var trigramCounts = this.trigramCounts;
        var nextWord;
        _.each(_.shuffle(Object.keys(trigramCounts[[w1, w2]])), function (w) { // shuffling might be unnecessary...
            rand -= trigramCounts[[w1,w2]][w];
            if (rand < 1 ) {
                nextWord = w;
            }
        });
        // console.log("here1: " + nextWord);
        return nextWord;
    } else if (this.bigramCounts.hasOwnProperty(w2)) { // else a trigram won't work, var's try a bigram. works the same way as above essentially.

        var sum = Object.values(this.bigramCounts[w2]).reduce(function (n1, n2) {
            return n1 + n2;
        });
        rand = _.random(0, sum);
        var bigramCounts = this.bigramCounts;
        var nextWord;

        _.each(_.shuffle(Object.keys(bigramCounts[w2])), function (w) {
            rand -= bigramCounts[w2][w];
            if (rand < 1) {
                nextWord = w;
            }
        });
        return nextWord;
    } else { // this word has not been seen, return a random one.
        var words = Object.keys(this.bigramCounts);
        return _.sample(words);
    }
};
