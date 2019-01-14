var natural = require("natural");
var NGrams = natural.NGrams;
var _ = require("underscore");
var fs = require('fs');

function Markov(corpus) { // Class

    // this.corpus = corpus.split(" "); // Split into an array of words. Add any special tokenization processes here

    // this.bigrams = NGrams.bigrams(this.corpus); // use Natural's built in methods
    // this.trigrams = NGrams.trigrams(this.corpus);
}

function CondFreqDist(bigrams, trigrams) {  // Class to hold conditional frequency distributions, one for bigrams, one for trigrams

    var data = fs.readFileSync('../../storage/corpora/trump-ngrams.txt');
    data = JSON.parse(data);

    //uncomment the lines below if were are having to calculate and store the counts for a new corpus
    // this.bigrams = bigrams;
    this.bigramCounts = data.bigramCounts;
    // this.trigrams = trigrams;
    this.trigramCounts = data.trigramCounts;
    // this.count() // populate the distributions
}

CondFreqDist.prototype.count = function () {  // Method for populating the distributions. Could definitely be cleaned up.
    var bigramCounts = this.bigramCounts;
    var trigramCounts = this.trigramCounts;
    _.each(this.bigrams, function (bigram) {  // For each bigram...
        var w1 = bigram[0]; // word one
        var w2 = bigram[1]; // one two
        if (bigramCounts.hasOwnProperty(w1)) {  // Have we seen word one before?
            var words = bigramCounts[w1];  // Which words are associated with it
            if (words.hasOwnProperty(w2)) {  // If we've seen this secondary word before, increment the count
                words[w2] += 1;
            } else {  // else initialize it to one
                words[w2] = 1;
            }
        } else {  // else this is an unseen bigram, initialize the structure and set count to one
            bigramCounts[w1] = {};
            bigramCounts[w1][w2] = 1;
        }
    });

    _.each(this.trigrams, function (trigram) {  // this works essentially the same as the above process, except w1 is actually an array of the first two words of the trigram
        var w1 = trigram.slice(0, 2);
        var w2 = trigram[2];

        if (trigramCounts.hasOwnProperty(w1)) {
            var words = trigramCounts[w1];
            if (words.hasOwnProperty(w2)) {
                words[w2] += 1;
            } else {
                words[w2] = 1;
            }
        } else {
            trigramCounts[w1] = {};
            trigramCounts[w1][w2] = 1;
        }
    });
};

CondFreqDist.prototype.nextWord = function (w1, w2) {  // Method generating the next word

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
    } else if (this.bigramCounts.hasOwnProperty(w2)) { // else a trigram won't work, let's try a bigram. works the same way as above essentially.

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
        // var randWord = words[_.random(0, words.length - 1)];
        randWord = _.sample(words);
        return randWord;
    }
};

Markov.prototype.generate = function (seed, length) { // generate the text

    var freqDist = new CondFreqDist(this.bigrams, this.trigrams);  // maybe, to save time, we could do this calculation for each corpus ahead of time
    var result = [seed];
    var nextWord;

    seed = seed.split(" "); // two word phrase for a seed plz validate
    var w1 = seed[0];
    var w2 = seed[1];

    var endedWithPeriod = false;

    while (length > 0 || !endedWithPeriod) { // build the chain of words
        nextWord = freqDist.nextWord(w1, w2);
        result.push(nextWord);
        w1 = w2;
        w2 = nextWord;
        length--;
        endedWithPeriod = (w2.charAt(nextWord.length - 1) === "."); // we want to end with a word that has a period at the end.
    }

    return result.join(" ");
};


//reading a corpus
// fs.readFile('../../storage/corpora/shakespeare.txt', 'utf8', function (err, contents) {
//     var generator = new Markov(contents);
//     console.log(generator.generate("the power", 50).replace(/\s+/g,' '));
// });

var generator = new Markov(null);
console.log(generator.generate("terrific people", 50).replace(/\s+/g,' '));

