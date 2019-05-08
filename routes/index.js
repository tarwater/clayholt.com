var express = require('express');
var router = express.Router();
router.post = express.Router.post; // just doing this to suppress an IDE error
var movies = require('../controllers/movies');
var markov = require('../controllers/markov');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Project routes
router.get('/projects', function(req, res, next) {
    res.render('projects/projects');
});

router.get('/projects/snake', function (req, res, next) {
    res.render('projects/snake')
});

router.get('/projects/simon', function (req, res, next) {
    res.render('projects/simon')
});

router.get('/projects/heatmap', function (req, res, next) {
    res.render('projects/heatmap')
});

router.get('/projects/markov/generate', markov.generate);
router.get('/projects/markov', function (req, res, next) {
    res.render('projects/markov')
});

router.get('/projects/movies', movies.index);
router.post('/projects/movies/save', movies.save);
router.post('/projects/movies/register', movies.register);
router.post('/projects/movies/login', movies.login);
router.get('/projects/movies/list', movies.getList);


router.get('/*', function (req, res) {
    res.render('index');
});


module.exports = router;
