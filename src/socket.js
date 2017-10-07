const init = (io) => {
  console.log('initalizing sockets');
  io.on('connection', client => {
    client.emit('test', 'other data');
  })
}

export {init};
