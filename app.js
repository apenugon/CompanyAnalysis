var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var data_interface = require('./data_interface');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'))

io.on('connection', function(socket) {
  data_interface.get_data(function(data) {
    socket.emit("data", data);
  });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
