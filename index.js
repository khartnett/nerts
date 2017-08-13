var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var users = [];

app.use(express.static('public'))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/pixijs', function(req, res){
    res.sendFile(__dirname + '/indexPixi.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg + socket.id);
    });

    socket.on('sign in', function(msg){
        var data = JSON.parse(msg);
        data.socket_id = socket.id;
        users.push( data)
        io.emit('chat message', JSON.stringify(users) + ' are the users');
//        io.to(socket.id).emit('thanks for joining ', socket.id);
        io.to(socket.id).emit('chat message', 'thanks for joining '+ socket.id);
    });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});
