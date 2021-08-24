const express = require('express')
const app = express()
const server = require('http').Server(app)
const cors = require('cors');

const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
require('dotenv').config();
app.set('view engine', 'ejs')
app.use(cors({origin:'https://anshtest.herokuapp.com' }))
app.use(cors({origin:'https://peerjs-server.herokuapp.com' }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})
const port = process.env.PORT ||  3000
server.listen(port, '0.0.0.0', () => {console.log(`success on port ${port}`)})
