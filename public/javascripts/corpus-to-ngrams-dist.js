var fs = require('fs');
var natural = require('natural');
var _ = require("underscore");
var file = '../../storage/corpora/trump.txt';

var data = fs.readFileSync(file).toString();
var tokens = data.split(" ");

// do preprocessing of data first...

tokens = _.map(tokens, function (w) {
   if(w == w.toUpperCase()){
       return w.toLowerCase();
   } else
       return w;
});

var bigrams = natural.NGrams.bigrams(tokens);
var trigrams = natural.NGrams.trigrams(tokens);
var bigramCounts ={};
var trigramCounts = {};

_.each(bigrams, function (bigram) {  // For each bigram...
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

_.each(trigrams, function (trigram) {  // this works essentially the same as the above process, except w1 is actually an array of the first two words of the trigram
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

var writeData = {
    bigramCounts: bigramCounts,
    trigramCounts: trigramCounts
};

fs.writeFile('../../storage/corpora/trump-ngrams.txt', JSON.stringify(writeData), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});