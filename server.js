var io = require('socket.io').listen(8080);

var mongoose = require('mongoose');
mongoose.connect('localhost', 'node_chat');
var ChatSchema = new mongoose.Schema({
     text: {type: String}
   , user: {type: String}
   , css:  {type: String}
});
var Chat = mongoose.model('Chat', ChatSchema);


io.sockets.on('connection', function(socket) {
//  console.log('onconnection:', socket);

  // クライアントからのイベント'all'を受信する
  socket.on('all', function(data) {

    var c = new Chat({text: data.text, user: data.user, css: data.css});
    c.save();

    // イベント名'msg'で受信メッセージを
    // 自分を含む全クライアントにブロードキャストする
    io.sockets.emit('msg', data);
  });

  // クライアントからのイベント'others'を受信する
  socket.on('others', function(data) {
    // イベント名'msg'で受信メッセージを
    // 自分以外の全クライアントにブロードキャストする
    socket.broadcast.emit('msg', data);
  });

  socket.on('disconnect', function() {
    console.log('disconn');
  });


  Chat.find().exec().addCallback(function(chats){
    console.log('====');
    io.sockets.emit('ready', chats); 
  });
  
});

