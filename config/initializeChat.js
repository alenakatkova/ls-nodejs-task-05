let users = {}; // все пользователи чата

module.exports = (io) => {
  io.on('connection', (socket) => {
    // создаем объект пользователя
    users[socket.id] = {};
    users[socket.id].username = socket.handshake.headers.username;
    users[socket.id].id = socket.id;

    // сообщаем всем, что появился новый пользователь
    socket.emit('new user', users);
    socket.broadcast.emit('all users', users);

    // обрабатываем событие, когда пользователь что-то написал другому пользователю
    socket.on('chat message', (data, recipient) => {
      // сообщаем реципиенту, кто и что ему написал
      socket.broadcast.to(recipient).emit('chat message', data, socket.id);
    });

    socket.on('disconnect', (data) => {
      // удаляем пользователя из объекта подключенных пользователей
      delete users[socket.id];
      // передаем подклюценным пользователям id отключившегося пользователя
      socket.broadcast.emit('delete user', socket.id);
    });
  });
};
