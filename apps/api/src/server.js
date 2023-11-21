import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import http from 'http';

const port = parseInt(process.env.PORT, 10) || 7000;
const dev = process.env.NODE_ENV !== 'production';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://10.0.0.236:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true,
  },
});

app.set('trust proxy', !dev);
app.disable('x-powered-by');

app.use(morgan(dev ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on("createDrawing", (data) => {
    console.log(`user with id-${socket.id} has given data`);
    console.log(data);
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
