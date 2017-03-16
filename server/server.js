var app = require('express')();
var http = require('http').Server(app)
var io = require('socket.io')(http)
var express = require('express')
var bodyParser = require('body-parser')

var messageRecv;
app.use(bodyParser.json())
app.use(express.static('../public'));
app.use(express.static('/models'));
app.use(bodyParser.urlencoded({
    extended: true
}));

var User = require('./models/user.js');
var Chatroom = require('./models/chatroom.js');


app.get('/', function(req, resp) {
    resp.sendFile('../public / index.html');
})

app.post('/dashboard/', function(req, resp) {
    var name = req.body.username;
    console.log(req.body.username);
    var user = new User({
        username: name
    });
    console.log("name is" + name);
    user.save(function(error) {
        if (error) {
            console.log('username already exists');
            resp.status(200);
        } else {
            console.log("username  created");
            resp.status(200);
        }
    })

})

app.get('/dashboard', function(req, resp) {
    User.find({}, {
            "username": 1,
            "_id": 0
        },
        function(err, data) {
            if (err) console.log("Error in data retrieva");
            else resp.json(data);
        });
})

app.post('/sendMsg/:msg', function(req, resp) {
    var message = req.body.message;
})

app.get('/chatroom', function(req, resp) {
    Chatroom.find({},
        function(err, data) {
            if (err) console.log("error in retrieving chatroom data");
            else {
                console.log("all data is:" + data);
                resp.json(data)
            };
        }).select({
        'chatroom_name': 1,
        '_id': 0,
        'users': 1
    });
})
app.get('/chatroom/:chatroom_name', function(req, resp) {
    var roomname = req.params.chatroom_name;
    console.log("roomnameis:" + roomname);
    Chatroom.find({
        chatroom_name: roomname
    }, 'users', function(err, data) {
        if (err) console.log("error in retrieving specific chatroom data");
        else {
            console.log("uesssdsds" + data);
            resp.json(data)
        };
    }).select({
        '_id': 0
    })

})

app.post('/chatroom', function(req, resp) {
    var chatroom = new Chatroom();
    chatroom.chatroom_name = req.body.chatroom_name;
    console.log("array data:" + req.body.user);
    chatroom.users.push(req.body.user);
    chatroom.save(function(error, data) {
        if (error) {
            console.log("error in chatroom creation");
            Chatroom.update({
                chatroom_name: req.body.chatroom_name
            }, {
                $addToSet: {
                    users: req.body.user
                }
            }, {
                upsert: true
            }, function(err, data) {
                if (err) console.log("eRRRRRR");
<<<<<<< HEAD
                else {
                    console.log("SUCCCCCCCCCCCCCCCCcc")
                    resp.sendStatus(200);
                };
=======
                else console.log("SUCCCCCCCCCCCCCCCCcc");
>>>>>>> 81902e5e99bcf67924d99d0cea924f33e7648448
            });
        } else {
            console.log("chatroom created");
            resp.json(data);
        }
    })
})

io.on('connection', function(socket) {
    socket.on('chatroom', function(data) {
        socket.user = data.user;
        //created a property on socket object
        console.log("username on the socket is:" + socket.user);
        console.log("user is connected:" + data.user);
        socket.join(data.chatroom);
        console.log("chat room created:" + data.chatroom);
<<<<<<< HEAD
        socket.chatroom_name = data.chatroom;
=======
>>>>>>> 81902e5e99bcf67924d99d0cea924f33e7648448
    })
    socket.on('send', function(data) {
        console.log("message received:" + data.message);
        console.log("sending msg to room:" + data.chatroom);
        socket.broadcast.to(data.chatroom).emit('recv', {
            message: data.message,
            user: data.user
        })
    })
    socket.on('disconnect', function() {
        console.log(socket.user + " is disconnected");
        User.find({
            username: socket.user
        }).remove().exec();
<<<<<<< HEAD
        Chatroom.find({
            chatroom_name: socket.chatroom_name
        }).remove().exec();
=======
>>>>>>> 81902e5e99bcf67924d99d0cea924f33e7648448
    })
})


http.listen(8050, function() {
    console.log("server running at 8050 port");
})