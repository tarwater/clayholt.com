var fs = require('fs');

module.exports.index = function (req, res, next) {

    var data = fs.readFileSync('storage/movieDB.json', 'utf8');
    data = JSON.parse(data);

    data.randos = data.users;

    genKey();
    res.render('projects/movies', data);
};

module.exports.register = function (req, res, next) {
    var name = req.body.name;
    var data = fs.readFileSync('storage/movieDB.json', 'utf8');
    data = JSON.parse(data);
    // check for duplicates
    for (var i = 0; i < data.users.length; i++) {
        if (data.users[i].name === name) {
            return res.send({
                status: "error",
                message: "A user with that name already exists"
            })
        }
    }

    var key = genKey();

    data.users.push({
        id: data.users.length,
        name: name,
        key: key
    });

    fs.writeFile("storage/movieDB.json", JSON.stringify(data), function () {
        console.log("saving user");
    });

    var response = {
        status: "success",
        key: key
    };

    return res.send(response);
}
;

module.exports.login = function (req, res, next) {

    var name = req.body.name;
    var key = req.body.key;

    var data = fs.readFileSync('storage/movieDB.json', 'utf8');
    data = JSON.parse(data);

    for (var i = 0; i < data.users.length; i++) {
        if (data.users[i].name === name && data.users[i].key === key) {
            return res.send({
                status: "success",
                id: data.users[i].id
            })
        }
    }

    return res.send({
        status: "failure"
    })
};

module.exports.save = function (req, res, next) {

    var data = fs.readFileSync('storage/movieDB.json', 'utf8');
    data = JSON.parse(data);

    var key = req.body.key;
    var movies = req.body.movies;
    var comments = req.body.comments;
    var titles = req.body.titles;

    console.log(req.body);

    var user;

    for (var i = 0; i < data.users.length; i++) {
        if (data.users[i].key === key) {
            user = data.users[i];
        }
    }
    for (var j = 0; j < data.movies.length; j++) {
        if (data.movies[j] && data.movies[j].movie_user_id === user.id) {
            delete data.movies[j]
        }
    }

    if(movies){
        for(var k = 0; k < movies.length; k++){
            var m = {};
            m.api_id = movies[k];
            m.movie_user_id = user.id;
            if(comments){
                m.comment = comments[movies[k]] || "";
            }
            if(titles){
                m.title = titles[movies[k]] || "";
            }
            data.movies.push(m);
        }
    }

    fs.writeFile("storage/movieDB.json", JSON.stringify(data), function () {
        console.log("saving movies");
    });

    return res.send("success")
};

module.exports.getList = function (req, res, next) {

    var id = req.query.id;

    var movies = [];

    var data = fs.readFileSync('storage/movieDB.json', 'utf8');
    data = JSON.parse(data);

    for (var j = 0; j < data.movies.length; j++) {
        if (data.movies[j] && data.movies[j].movie_user_id == id) {
            movies.push(data.movies[j]);
        }
    }
    return res.send(movies);

};

function genKey() {
    return Math.floor((Math.random() * 1000000) + 100000).toString(16);
}

function keyExists(key) {

}
